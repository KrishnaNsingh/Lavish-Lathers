import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Package, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useApp } from "../../context/AppContext";
import { orderApi } from "../../api/orderApi";
import type { Order, OrderItem } from "../../types";
import "./Orders.css";

const placedFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  hour12: true, timeZone: "Asia/Kolkata",
});
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2,
});
const statuses = ["pending", "packaging", "shipped", "delivered"] as const;

function PlacedAt({ value }: { value: string }) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return <span>Date unavailable</span>;
  return <time dateTime={date.toISOString()}>{placedFormatter.format(date)} IST</time>;
}

function ProductLine({ item, catalogImage, detailed }: {
  item: OrderItem; catalogImage?: string; detailed?: boolean;
}) {
  const [failed, setFailed] = useState<string[]>([]);
  const image = [item.images?.[0], catalogImage].find(src => src && !failed.includes(src));
  return (
    <div className="ao-product">
      <span className="ao-thumb">
        {image ? <img src={image} alt="" loading="lazy" onError={() => setFailed(prev => [...prev, image])} />
          : <Package aria-label="Product image unavailable" size={20} />}
      </span>
      <div>
        <strong>{item.name}</strong>
        <small>Qty {item.quantity}{detailed && <> &middot; {currency.format(item.price)} each</>}</small>
        {detailed && item.registryId && <small>SKU {item.registryId}</small>}
        {detailed && item.isGift && <p className="ao-note">Gift{item.giftRecipient && <> for {item.giftRecipient}</>}{item.giftNote && <> &mdash; {item.giftNote}</>}</p>}
      </div>
    </div>
  );
}

function OrderDetails({ order, images, dismiss }: {
  order: Order; images: Map<string, string>; dismiss: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const overflow = document.body.style.overflow;
    const trigger = document.activeElement;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  const { customer, shippingAddress: address, pricing } = order;
  const discount = Math.round((pricing.subtotal + pricing.shipping - pricing.total) * 100) / 100;
  return (
    <dialog ref={ref} className="ao-dialog" aria-labelledby="ao-title"
      onCancel={event => { event.preventDefault(); dismiss(); }}
      onClick={event => { if (event.target === event.currentTarget) dismiss(); }}>
      <div className="ao-panel">
        <header className="ao-dialog-head">
          <div><small>Order details</small><h2 id="ao-title">Order #{order._id.slice(-8)}</h2>
            <p>Placed <PlacedAt value={order.createdAt} /></p></div>
          <button className="ao-close" type="button" onClick={dismiss} aria-label="Close order details" autoFocus><X size={21} /></button>
        </header>
        <div className="ao-detail-body">
          <section><h3>Products</h3>
            {order.items.map((item, i) => <ProductLine key={i} item={item} catalogImage={images.get(item.productId)} detailed />)}
          </section>
          <section><h3>Customer &amp; delivery</h3><strong>{customer.name}</strong>
            <p>{customer.email}</p><p>{customer.phone}</p>
            <p className="mt-2">{[address.street, address.city, address.state, address.postalCode].filter(Boolean).join(", ")}</p>
            {address.instructions && <p className="ao-note">Delivery instructions &mdash; {address.instructions}</p>}
          </section>
          <section><h3>Order summary</h3>
            <dl className="ao-totals">
              <dt>Order reference</dt><dd>{order._id}</dd>
              <dt>Fulfillment</dt><dd className="capitalize">{order.orderStatus}</dd>
              <dt>Payment</dt><dd className="capitalize">{order.payment?.paymentStatus || order.paymentStatus || "Unavailable"}</dd>
              <dt>Subtotal</dt><dd>{currency.format(pricing.subtotal)}</dd>
              <dt>Shipping</dt><dd>{currency.format(pricing.shipping)}</dd>
              {discount > 0 && <><dt>Discount</dt><dd>-{currency.format(discount)}</dd></>}
              <dt className="ao-total">Total</dt><dd className="ao-total">{currency.format(pricing.total)}</dd>
            </dl>
          </section>
        </div>
      </div>
    </dialog>
  );
}

export default function AdminOrders() {
  const [selectedId, setSelectedId] = useState<string>();
  const { products } = useApp();
  const images = useMemo(() => new Map(products.map(p => [p._id, p.images?.[0]])), [products]);
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["orders"], queryFn: orderApi.getOrders,
  });
  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: Order["orderStatus"] }) => orderApi.updateOrderStatus(id, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
  const selected = orders.find(order => order._id === selectedId);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <AdminLayout title="Orders" subtitle="View purchases, delivery details, and fulfillment status.">
      <div className="ao-list">
        {isLoading ? <p role="status">Loading orders...</p>
          : isError ? <p role="alert">Unable to load orders. <button className="underline" onClick={() => refetch()}>Retry</button></p>
          : orders.length === 0 ? <p>No orders yet.</p> : <>
            <p className="ao-count">{orders.length} {orders.length === 1 ? "order" : "orders"}</p>
            {status.isError && <p role="alert">Could not update the order status. Please try again.</p>}
            <div className="ao-columns ao-head" aria-hidden="true"><span>Customer / placed</span><span>Products</span><span>Total</span><span>Fulfillment</span></div>
            <ul>{orders.map(order => (
              <li key={order._id} className="ao-columns ao-row">
                <button className="ao-open" aria-haspopup="dialog" aria-label={`View order ${order._id.slice(-8)} for ${order.customer.name}`}
                  onClick={() => setSelectedId(order._id)} />
                <div className="ao-buyer"><small>#{order._id.slice(-8)}</small><strong>{order.customer.name}</strong>
                  <PlacedAt value={order.createdAt} /></div>
                <div className="ao-lines">{order.items.map((item, i) => <ProductLine key={i} item={item} catalogImage={images.get(item.productId)} />)}</div>
                <div className="ao-amount"><small>Total</small>{currency.format(order.pricing.total)}</div>
                <label className="ao-status"><small>Fulfillment</small>
                  <select aria-label={`Fulfillment status for order ${order._id.slice(-8)}`} value={order.orderStatus}
                    disabled={status.isPending} onChange={event => status.mutate({ id: order._id, value: event.target.value as Order["orderStatus"] })}>
                    {statuses.map(value => <option key={value} value={value}>{value}</option>)}
                  </select></label>
                <ChevronRight className="ao-chevron" aria-hidden="true" size={18} />
              </li>
            ))}</ul>
          </>}
      </div>
      {selected && <OrderDetails order={selected} images={images} dismiss={() => setSelectedId(undefined)} />}
    </AdminLayout>
  );
}
