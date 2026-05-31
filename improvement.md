# 🏛️ Atelier Production Engineering Registry: Antigravity Audit

## 1. Mismatches & Data Drifts

### Frontend `Order` Interface vs. Backend Mongoose Schema (`paymentStatus`)
* **Location:** [src/types.ts](file:///d:/Lavish%20Lathers/lavish-lathers/src/types.ts#L137-L140) and [backend/models/Order.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/models/Order.js#L38-L48)
* **Drift Description:** 
  In the frontend TypeScript definitions, the `Order` type defines `paymentStatus: "pending" | "paid" | "failed"` directly at the root of the object. However, the backend Mongoose schema places the status field nested inside the `payment` object as `payment.paymentStatus`.
* **Impact:** 
  When orders are retrieved from the backend (`GET /api/admin/orders`) and rendered on the frontend in the dispatch admin view, `order.paymentStatus` resolves to `undefined`. This breaks rendering logic and dashboard card statistics.

### Item-Level Gift Customization Properties
* **Location:** [src/types.ts](file:///d:/Lavish%20Lathers/lavish-lathers/src/types.ts#L95-L110) and [backend/models/Order.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/models/Order.js#L19-L36)
* **Drift Description:** 
  The frontend cart and checkout systems allow customers to customize individual items by marking them as gifts with a specific recipient name and note. The frontend `OrderItem` interface expects:
  * `isGift?: boolean`
  * `giftNote?: string`
  * `giftRecipient?: string`
  * `registryId: string`
  
  However, the backend Mongoose schema for `items` inside `Order.js` does not include these fields. It instead defines `customMessage: String` and `productId`.
* **Impact:** 
  Due to Mongoose's strict schema enforcement, when a verified payment creates an order, Mongoose silently strips away `isGift`, `giftNote`, `giftRecipient`, and `registryId`. Consequently, custom wax-sealed scroll messages entered by customers are completely lost and never saved to MongoDB. The admin dashboard trying to render these fields in the drawer will find them missing.

### Query Filter Parameter Discrepancy
* **Location:** [src/api/productApi.ts](file:///d:/Lavish%20Lathers/lavish-lathers/src/api/productApi.ts#L6-L23) and [backend/controllers/productController.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/controllers/productController.js#L7-L17)
* **Drift Description:** 
  The frontend API client queries products using filter properties: `featured` and `souvenir` (e.g. `?featured=true` and `?souvenir=true`).
  However, the backend product controller expects different query fields: `isBestSeller` (to map to schema `featured`) and `isCollectible` (to map to schema `souvenir`).
* **Impact:** 
  Any direct API queries from the frontend for featured products or collectible souvenirs will fail to be filtered by the database and will return the entire product list unfiltered.

---

## 2. Active Structural Bugs Found

### 🚨 Invalid Default Enum Value for `orderStatus` (Order Creation Crashes)
* **Location:** [backend/models/Order.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/models/Order.js#L56-L60)
* **Bug Details:**
  The `orderStatus` field in `Order.js` defines an enum constraint:
  ```javascript
  orderStatus: {
    type: String,
    enum: ["pending", "packaging", "shipped", "delivered"],
    default: "processing",
  }
  ```
  Note that `"processing"` is the default value, but it is **not** present in the `enum` array. 
* **Runtime Risk:**
  When a user completes payment and `verifyPaymentAndCreateOrder` calls `Order.create()`, Mongoose initializes `orderStatus` to the default `"processing"`. Because `"processing"` fails the enum validation, Mongoose throws a `ValidationError` and rejects the database write. **Every single checkout attempt will fail to save the order to the database, resulting in a 500 error after the customer's money is debited.**

### Redundant State Reloads causing Global UI Flashing (Admin Orders)
* **Location:** [src/pages/admin/Orders.tsx](file:///d:/Lavish%20Lathers/lavish-lathers/src/pages/admin/Orders.tsx#L192-L199)
* **Bug Details:**
  In the orders list, changing the dispatch status dropdown runs:
  ```typescript
  onChange={async (e) => {
    await handleStatusChange(o._id, e.target.value as any);
    await fetchOrders();
  }}
  ```
  `handleStatusChange` already performs a localized state update in the React component tree (replacing the updated order). Calling `fetchOrders()` immediately after sets `loading = true`, forcing the component to unmount the table and render the fullscreen layout: `"Opening Dispatch Book Registry..."`.
* **Impact:**
  The admin UI flashes a global loading screen for every single dropdown toggle, locking focus and degrading administrator efficiency.

### Direct React State Mutation in AppContext
* **Location:** [src/context/AppContext.tsx](file:///d:/Lavish%20Lathers/lavish-lathers/src/context/AppContext.tsx#L111-L122)
* **Bug Details:**
  In `addToCart`, when an item already exists in the cart, the code shallow-copies the cart array, but mutates the item object's property directly:
  ```typescript
  let updated = [...cart];
  if (existingIdx > -1) {
    updated[existingIdx].quantity += quantity; // Direct mutation of state object!
  }
  ```
* **Impact:**
  Since the inner object references are shared, this mutates the active state object directly. React may fail to trigger re-renders on components that perform shallow comparison of items, leading to desynced cart indicators and counts.

---

## 3. Webhook, Payment & Resend Resilience

### Express Body Parser Ordering Bug (Signature Verification Always Fails)
* **Location:** [backend/server.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/server.js#L3-L11) and [backend/app.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/app.js#L11)
* **Integration Weak Point:**
  `server.js` requires `./app` which immediately runs `app.use(express.json())`. The raw webhook parser `express.raw({ type: "application/json" })` is registered *afterwards* inside `server.js` via `app.use("/api/webhooks", webhookRoutes)`.
* **Impact:**
  By the time a Razorpay request reaches the webhook route, `express.json()` has already consumed the stream and parsed the body into an object. Inside `webhookController.js`, `req.body.toString()` evaluates to `"[object Object]"`. Consequently, the HMAC SHA256 signature verification always fails, and Razorpay webhooks are permanently rejected.

### Dead Webhook Controller (Unmapped Payment Lifecycle)
* **Location:** [backend/controllers/webhookController.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/controllers/webhookController.js#L7-L54)
* **Integration Weak Point:**
  The webhook controller validates the signature and returns 200, but contains **no database updates or order resolution logic**.
* **Recommended Strategy:**
  If a customer completes payment but closes their tab before the frontend redirects back to execute `/verify-payment`, the order is never written. The webhook must listen for `order.paid` or `payment.captured` events and automatically create or update the order state to "paid" in the database.

### Resend Email Error Swallowing
* **Location:** [backend/services/emailService.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/services/emailService.js#L7-L112)
* **Integration Weak Point:**
  The catch blocks inside `sendCustomerOrderEmail` and `sendAdminOrderEmail` log to `console.error` but swallow the exception.
* **Impact:**
  The caller in `orderController.js` is unaware if email delivery fails. If the Resend API limit is reached or the token is expired, the system reports successful verification, leaving the admin without notice of dropped mail alerts.

---

## 4. Performance & Scalability Enhancements

### Lack of Indexes on Active Query Paths
* **Target Schema:** [backend/models/Order.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/models/Order.js) and [backend/models/Product.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/models/Product.js)
* **Enhancement:**
  The dashboard performs a `$match` aggregate on `"payment.paymentStatus"` to compute total revenues. Additionally, products are frequently queried on `featured`, `souvenir`, and `category`. 
* **Recommendation:**
  Add indexes to avoid full collection scans as the order registry scales:
  ```javascript
  orderSchema.index({ "payment.paymentStatus": 1 });
  productSchema.index({ category: 1, featured: 1, souvenir: 1 });
  ```

### Duplicate Controller Implementations
* **Location:** [backend/controllers/adminController.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/controllers/adminController.js) and [backend/controllers/productController.js](file:///d:/Lavish%20Lathers/lavish-lathers/backend/controllers/productController.js)
* **Enhancement:**
  Product CRUD operations (`createProduct`, `updateProduct`, `deleteProduct`) are defined in both controllers with slightly different structures. For example, `deleteProduct` in `adminController.js` returns `{ success: true, id: req.params.id }` while `productController.js` returns `{ message: "Product deleted" }`.
* **Recommendation:**
  Consolidate all product management functions into `productController.js` and import them into `adminRoutes.js` to prevent code drift.

### Invoice Curve UI Arithmetic Mismatch
* **Location:** [src/pages/Checkout.tsx](file:///d:/Lavish%20Lathers/lavish-lathers/src/pages/Checkout.tsx#L531)
* **Enhancement:**
  `shippingCharge` is defined as `299` in JavaScript arithmetic (representing ₹299), but the UI displays a hardcoded string `₹9.50`. This causes the displayed "Total Order Value" to look incorrect as it adds ₹299 instead of the ₹9.50 displayed to the user.

---

## 5. Architectural Corrective Actions (Code Blocks)

### Corrective Action 1: Fix `Order.js` Schema Validation & Add Personalization Fields
Modify the order schema to support the frontend `OrderItem` custom fields, correct the invalid default `orderStatus`, and map `paymentStatus` correctly:

```javascript
// backend/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      instructions: String,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        registryId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        imageUrl: String,
        isGift: { type: Boolean, default: false },
        giftNote: String,
        giftRecipient: String,
      },
    ],

    payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },

    pricing: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, required: true },
      total: { type: Number, required: true },
    },

    orderStatus: {
      type: String,
      enum: ["pending", "packaging", "shipped", "delivered"],
      default: "pending", // Fixed default enum constraint
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ "payment.paymentStatus": 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
```

### Corrective Action 2: Fix Express Raw Parser Order in Server setup
To prevent `express.json()` from corrupting the raw webhook buffer, register the webhook route *before* the global JSON parser middleware:

```javascript
// backend/app.js
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const webhookRoutes = require("./routes/webhookRoutes"); // Import webhooks here
const cors = require("cors");

const app = express();

app.use(cors());

// Mount raw webhook routes BEFORE express.json()
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;
```
*(Ensure `server.js` is cleaned up to remove `app.use("/api/webhooks", webhookRoutes)` to avoid double-registration).*

### Corrective Action 3: Correct React State Immutability in AppContext
Replace the direct quantity mutation with a clean immutable array map:

```typescript
// src/context/AppContext.tsx
const addToCart = (
  product: Product,
  isGift: boolean,
  giftNote?: string,
  giftRecipient?: string,
  quantity = 1,
) => {
  const existingIdx = cart.findIndex(
    (it) =>
      it.product._id === product._id &&
      it.isGift === isGift &&
      it.giftRecipient === giftRecipient,
  );

  let updated: CartItem[];
  if (existingIdx > -1) {
    updated = cart.map((item, idx) =>
      idx === existingIdx
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    updated = [
      ...cart,
      {
        product,
        quantity,
        isGift,
        giftNote,
        giftRecipient,
      },
    ];
  }

  updateCartState(updated);
  setIsCartOpen(true);
};
```

### Corrective Action 4: Unify Shipping Cost Arithmetic
Update the checkout display to correctly reference the runtime shipping charge variable:

```typescript
// src/pages/Checkout.tsx (L523-L534)
<div className="flex justify-between text-brand-black/60">
  <span>Ribbon Wrapping &amp; Shipping</span>
  {isFreeShipping ? (
    <span className="text-emerald-700 font-medium text-[10px] font-bold">
      FREE
    </span>
  ) : (
    <span className="font-serif-cormorant text-sm text-brand-black font-semibold">
      ₹{shippingCharge} {/* Fixed hardcoded ₹9.50 */}
    </span>
  )}
</div>
```

### Corrective Action 5: Secure `/test-email` GET Admin Endpoint
Protect the test email route to prevent unsolicited message spam triggers:

```javascript
// backend/routes/adminRoutes.js
router.get("/test-email", protectAdmin, async (req, res) => {
  // Now authenticated properly
  ...
});
```
