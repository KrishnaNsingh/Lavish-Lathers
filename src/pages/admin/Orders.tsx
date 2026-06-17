import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ClipboardList,
  MessageSquare,
  Ship,
  Check,
  ShoppingBag,
  Eye,
  Calendar,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { orderApi } from "../../api/orderApi";
import { Order } from "../../types";

export default function AdminOrders() {
  // const [orders, setOrders] = useState<Order[]>([]);
  // const [loading, setLoading] = useState(true);

  // Focus modal details
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: loading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: orderApi.getOrders,
  });

  // const fetchOrders = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await orderApi.getOrders();
  //     setOrders(data);
  //   } catch (err) {
  //     console.error("Error fetching order records:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   fetchOrders();
  // }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const handleStatusChange = async (
  //   id: string,
  //   newStatus: "pending" | "packaging" | "shipped" | "delivered",
  // ) => {
  //   try {
  //     const res = await orderApi.updateOrderStatus(id, newStatus);
  //     if (res.success) {
  //       // Update in layout state
  //       setOrders((prev) =>
  //         prev.map((o) =>
  //           o._id === id ? { ...o, orderStatus: newStatus } : o,
  //         ),
  //       );
  //       if (selectedOrder?._id === id) {
  //         setSelectedOrder((prev) =>
  //           prev ? { ...prev, orderStatus: newStatus } : null,
  //         );
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Failed to transition status:", err);
  //     alert("Encountered error updating dispatch status.");
  //   }
  // };

  const statusMutation = useMutation({
  mutationFn: ({
    id,
    status,
  }: {
    id: string;
    status: "pending" | "packaging" | "shipped" | "delivered";
  }) => orderApi.updateOrderStatus(id, status),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["orders"],
    });
  },
});

  const statusTags = {
    pending: {
      bg: "bg-red-950/40 border-red-800/40",
      text: "text-red-400",
      label: "Pending",
    },

    packaging: {
      bg: "bg-amber-950/40 border-amber-800/40",
      text: "text-amber-400",
      label: "Curing/Packaging",
    },

    shipped: {
      bg: "bg-blue-950/40 border-blue-800/40",
      text: "text-blue-400",
      label: "Dispatched",
    },

    delivered: {
      bg: "bg-emerald-950/40 border-emerald-800/40",
      text: "text-emerald-400",
      label: "Delivered",
    },
  };

  return (
    <AdminLayout
      title="Orders, Dispatch &amp; Wax Seals Registry"
      subtitle="Exquisite logistics view. Handle guest addresses, customized ribbon snapshot configurations, and 3-D secure payment invoices."
    >
      <div className="space-y-6 font-sans-inter text-left">
        <div className="flex justify-between items-center text-xs font-sans-poppins">
          <span className="text-brand-cream/45">
            Total Orders Queue: <strong>{orders.length}</strong> sales
          </span>
          <span className="text-brand-gold italic">
            Curing chamber packaging slots active
          </span>
        </div>

        {/* LOADING SCREEN */}
        {loading ? (
          <div className="py-20 flex text-center justify-center text-xs uppercase tracking-widest text-brand-gold font-sans-poppins">
            Opening Dispatch Book Registry...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-[#141211] border border-brand-cream/10 rounded-3xl space-y-4">
            <ClipboardList className="h-10 w-10 text-brand-cream/20 mx-auto" />
            <p className="text-xs text-brand-cream/55">
              No billing order records currently registered.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Complete table of orders */}
            <div
              className={`bg-[#141211] border border-brand-cream/10 rounded-2xl overflow-hidden ${selectedOrder ? "lg:col-span-7" : "lg:col-span-12"}`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left divide-y divide-brand-cream/5">
                  <thead className="bg-[#1A1817] text-brand-gold font-sans-poppins text-[9px] uppercase tracking-widest font-semibold">
                    <tr>
                      <th className="px-5 py-4">Patron Ref</th>
                      <th className="px-5 py-4">Sandalwood Items</th>
                      <th className="px-5 py-4">Invoice Clear</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-cream/5 text-brand-cream/77">
                    {orders.map((o) => (
                      <tr
                        key={o._id}
                        className={`hover:bg-brand-cream/5 transition-colors cursor-pointer ${selectedOrder?._id === o._id ? "bg-brand-cream/5 border-l-2 border-brand-gold" : ""}`}
                        onClick={() => setSelectedOrder(o)}
                      >
                        {/* ID + Guest Name */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[9px] text-brand-cream/35">
                              {o._id.slice(-8)}
                            </span>
                            <h4 className="font-sans-inter text-brand-cream font-medium line-clamp-1">
                              {o.customer.name}
                            </h4>
                          </div>
                        </td>

                        {/* Items quantity */}
                        <td className="px-5 py-4">
                          <span className="font-sans-inter">
                            {o.items.reduce((acc, it) => acc + it.quantity, 0)}{" "}
                            bespoke curio(s)
                          </span>
                        </td>

                        {/* Total cleared value */}
                        <td className="px-5 py-4 font-serif-cormorant text-sm font-semibold">
                          ₹{o.pricing.total}
                        </td>

                        {/* State Dropdown and label */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-semibold font-sans-poppins ${statusTags[o.orderStatus]?.bg || ""} ${statusTags[o.orderStatus]?.text || ""}`}
                          >
                            {statusTags[o.orderStatus]?.label || o.orderStatus}
                          </span>
                        </td>

                        {/* Direct detailed click button */}
                        <td
                          className="px-5 py-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="p-1.5 bg-[#211F1E] hover:bg-[#2F2C2A] text-brand-gold rounded-lg transition-colors cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* 🛠️ WIRED SELECT COMPONENT */}
                            <select
                              value={o.orderStatus}
                              // onChange={async (e) => {
                              //   // Calls api, runs UI state mutation map, then forces state reload
                              //   await handleStatusChange(
                              //     o._id,
                              //     e.target.value as any,
                              //   );
                              // }}
                              onChange={(e) => {
                                statusMutation.mutate({
                                  id: o._id,
                                  status: e.target.value as
                                    | "pending"
                                    | "packaging"
                                    | "shipped"
                                    | "delivered",
                                });
                              }}
                              className="bg-[#1F1E1D] border border-brand-cream/15 text-brand-cream/80 px-2 py-1.5 rounded-lg text-[9px] font-sans-poppins uppercase focus:outline-none focus:border-brand-gold cursor-pointer"
                            >
                              <option value="pending">Pending</option>

                              <option value="packaging">Packaging</option>

                              <option value="shipped">Shipped</option>

                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT SIDEBAR DETAILS */}
            {selectedOrder && (
              <div className="lg:col-span-5 bg-[#141211] border border-brand-cream/15 p-6 rounded-[2rem] space-y-6 text-xs text-brand-cream/90 animate-zoom-in">
                <div className="flex items-center justify-between border-b border-brand-cream/10 pb-4 font-sans-poppins">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                      Patron Invoice Detail
                    </span>
                    <h3 className="font-serif-playfair text-lg text-brand-cream font-medium">
                      Ref: {selectedOrder._id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 border border-brand-cream/20 hover:border-brand-cream rounded-xl text-brand-cream/55 hover:text-brand-cream cursor-pointer"
                  >
                    Collapse
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-brand-cream/45 block font-bold font-sans-poppins">
                      Gifting Dispatch Address
                    </span>
                    <div className="bg-[#1C1A19] border border-brand-cream/5 p-3 rounded-xl space-y-1 leading-normal font-sans-inter text-brand-cream/70 font-light">
                      <p className="font-medium text-brand-cream font-sans-poppins text-xs">
                        {selectedOrder.customer.name}
                      </p>
                      <p>{selectedOrder.customer.email}</p>
                      <p>{selectedOrder.customer.phone}</p>
                      <p className="pt-1.5 border-t border-brand-cream/5 text-[11px] text-brand-cream/80">
                        {selectedOrder.shippingAddress.street},<br />
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state || ""}{" "}
                        {selectedOrder.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-widest text-brand-cream/45 block font-bold font-sans-poppins">
                      Itemized Formulations Package
                    </span>

                    <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-brand-cream/5">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-3 pt-2.5 first:pt-0 items-start"
                        >
                          <div className="flex-grow text-left space-y-0.5">
                            <h5 className="font-serif-playfair text-[13px] leading-tight text-brand-cream font-medium line-clamp-1">
                              {item.name} (x{item.quantity})
                            </h5>
                            <span className="text-[10px] text-brand-cream/45">
                              Registry: {item.registryId}
                            </span>

                            {item.isGift && (
                              <div className="mt-1.5 p-2 bg-[#211210] border border-red-900/30 text-[9px] text-red-300 rounded-md leading-normal select-all">
                                <strong className="text-brand-gold uppercase tracking-wider block mb-0.5 font-sans-poppins text-[8px]">
                                  Attached Wax Seal Message scroll:
                                </strong>
                                &ldquo;{item.giftNote}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-brand-cream/5 pt-4 text-xs space-y-2 font-sans-inter">
                    <div className="flex justify-between text-brand-cream/65">
                      <span>Gross Cured Subtotal</span>
                      <span className="font-serif-cormorant text-sm">
                        ₹{selectedOrder.pricing.subtotal}
                      </span>
                    </div>

                    <div className="flex justify-between text-brand-cream/65">
                      <span>Artisan Ribbon Shipping</span>
                      <span className="font-serif-cormorant text-sm">
                        ₹{selectedOrder.pricing.shipping}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold pt-2 border-t border-brand-cream/10 text-brand-gold font-sans-poppins">
                      <span className="uppercase text-[10px]">
                        Grand Cleared Total
                      </span>
                      <span className="font-serif-cormorant text-[16px] text-brand-gold">
                        ₹{selectedOrder.pricing.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
