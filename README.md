# 🛁 Lavish Lathers – Premium Artisan Apothecary & Souvenirs

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-02042B?logo=razorpay&logoColor=00BAF2)](https://razorpay.com/)
[![TanStack Query](https://img.shields.io/badge/Query-TanStack_v5-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query)

**Lavish Lathers** is an enterprise-grade full-stack e-commerce web platform engineered for a luxury artisan botanical soap, skincare, and bespoke souvenir atelier. The platform features an editorial storefront with item-level gifting personalizations, dual-resilience checkout processing with Razorpay, asynchronous webhook event curing, automated Google Sheets ledger synchronization, rich transactional HTML emails via Resend, and a JWT-secured fulfillment admin operations console.

---

## 🏛️ System Architecture

The platform follows a decoupled, resilient client-server architecture with dedicated external integration pipelines for payments, bookkeeping, media hosting, and email notifications:

```mermaid
graph TB
    subgraph Client ["Client Tier (Browser)"]
        UI["React 19 SPA (Vite 6)"]
        RQ["TanStack React Query Cache (30m TTL)"]
        Ctx["AppContext (Cart & LocalStorage Sync)"]
        RzpModal["Razorpay Checkout Modal"]
    end

    subgraph API ["Application Gateway Tier (Express 5 / Node.js)"]
        App["Express Gateway"]
        Sec["Security Layer (Helmet + CORS)"]
        RL["Tiered Rate Limiters (API / Auth / Admin)"]
        RawHook["Raw Body Parser (/api/webhooks)"]
        JsonParser["JSON Parser (/api/*)"]
        AuthMid["JWT RBAC Guard (protectAdmin)"]
        Router["Express Routers"]
        Ctrl["Controllers (Order, Product, Admin, Auth, Webhook)"]
        Svc["Services Layer (Email, Sheets)"]
    end

    subgraph DB ["Data Tier"]
        Mongo[("MongoDB Database (Mongoose 9)")]
    end

    subgraph Integrations ["Third-Party Service Mesh"]
        RZP["Razorpay Payment Gateway"]
        GSHEET["Google Sheets API v4 (Service Account)"]
        RESEND["Resend API (Transactional HTML Mail)"]
        CDN["Cloudinary CDN (Artisan Photography)"]
        EXCEL["ExcelJS (Streamed .xlsx Exports)"]
    end

    UI <-->|HTTP REST / JSON| App
    App --> Sec --> RL
    RL --> RawHook
    RawHook -->|Preserves Raw Buffer| Router
    RawHook --> JsonParser --> Router
    Router --> AuthMid --> Ctrl
    Router --> Ctrl
    Ctrl <-->|Mongoose ODM| Mongo
    Ctrl --> Svc
    RzpModal <-->|Payment Session| RZP
    RZP -->|Webhook Events: order.paid / payment.failed| Router
    Svc -->|Append Row| GSHEET
    Svc -->|Dispatch HTML Mails| RESEND
    Ctrl -->|Stream Binary| EXCEL
    UI -->|Static Imagery| CDN
```

---

## 🔄 End-to-End Core Workflows

### 1. Dual-Resilience Checkout & Payment Lifecycle

The payment flow guarantees that money debited from a patron always records an order, even if the customer unexpectedly closes their browser tab before the client-side redirect completes:

```mermaid
sequenceDiagram
    autonumber
    actor Patron as Customer
    participant FE as React Client (Vite)
    participant API as Express API Server
    participant DB as MongoDB
    participant RZP as Razorpay Gateway
    participant GS as Google Sheets API
    participant Mail as Resend Mail Service

    Patron->>FE: Submits Checkout Form (Items + Gift Notes + Shipping)
    FE->>API: POST /api/orders/create-razorpay-order
    API->>RZP: orders.create({ amount, currency: "INR" })
    RZP-->>API: razorpay_order (id: rzp_order_xxx)
    API->>DB: Order.create({ status: "pending", rzp_order_id, items, pricing })
    API-->>FE: Returns razorpay_order payload

    FE->>RZP: Mounts & Displays Razorpay Modal
    Patron->>RZP: Completes Payment (UPI / Card / NetBanking)
    RZP-->>FE: Emits { razorpay_payment_id, razorpay_signature }

    rect rgb(240, 248, 255)
        note over FE,GS: Primary Path: Synchronous Client Verification
        FE->>API: POST /api/orders/verify-payment
        API->>API: Compute & Verify HMAC-SHA256 Signature
        API->>DB: Find Order & Update paymentStatus -> "paid"
        API->>GS: appendOrderToSheet(order)
        API-->>FE: 201 Success Response
        FE->>Patron: Redirects to /order-confirmation
    end

    rect rgb(255, 245, 238)
        note over RZP,Mail: Fallback Safety Net: Asynchronous Webhook Daemon
        RZP->>API: POST /api/webhooks/razorpay (event: "order.paid")
        API->>API: Verify Webhook HMAC Signature against Raw Stream
        API->>DB: Find order by rzp_order_id & mark "paid"
        API->>DB: Automatically Decrement Product Stock
        API->>Mail: sendCustomerOrderEmail() & sendAdminOrderEmail()
        API-->>RZP: 200 OK
    end
```

---

## 🗄️ Database Entity Relationship (ERD)

The MongoDB database is organized into indexed collections optimized for rapid sales aggregates and dispatch querying:

```mermaid
erDiagram
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    ORDER ||--|{ ORDER_ITEM : "contains"
    ADMIN ||--o{ ORDER : "supervises"

    PRODUCT {
        ObjectId _id PK
        string registryId UK "Unique SKU (e.g. prod-123)"
        string name "Product title"
        string shortDescription "Summary"
        string detailedDescription "Rich formulation story"
        number price "Unit price in INR"
        number stock "Available inventory"
        string category "Herbal Soaps | Essential Oils | Gift Boxes | Souvenirs"
        string artistryType "Skincare formulation | Keepsake Souvenir"
        string_array images "Array of Cloudinary/CDN image URLs"
        boolean featured "Homepage best-seller flag"
        boolean souvenir "Keepsake souvenir flag"
        string_array ingredients "Botanical components"
        string_array benefits "Holistic skincare benefits"
        string_array skinFeel "Texture & finish tags"
        string howToUse "Usage rituals"
        object productInformation "netWeight, soapType, handcraftedIn"
        boolean customMessageAvailable "Eligibility for personalized gift note"
    }

    ORDER {
        ObjectId _id PK
        object customer "name, email, phone"
        object shippingAddress "street, city, state, postalCode, instructions"
        object payment "razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentStatus"
        object pricing "subtotal, shipping, total"
        string orderStatus "pending | packaging | shipped | delivered"
        date createdAt "Indexed for sorting"
    }

    ORDER_ITEM {
        ObjectId productId FK "Ref Product"
        string registryId "SKU Identifier"
        string name "Product name at purchase"
        number quantity "Purchased count"
        number price "Price at purchase"
        string_array images "Product imagery"
        boolean isGift "Bespoke gift flag"
        string giftNote "Wax-sealed scroll custom note"
        string giftRecipient "Recipient dedication name"
        string customMessage "Supplementary remarks"
    }

    ADMIN {
        ObjectId _id PK
        string email UK "Login email (lowercased)"
        string password "Bcrypt hashed credential"
        string role "admin"
    }
```

### Performance & Retrieval Indexes
- `orderSchema.index({ "payment.paymentStatus": 1 })`: Powers the administrator sales aggregation pipeline without collection scans.
- `orderSchema.index({ createdAt: -1 })`: Delivers instant descending order dispatch book rendering.
- `productSchema.index({ registryId: 1 }, { unique: true })`: Prevents duplicate SKU/registry collision.

---

## 🚀 Key Feature Matrix

| Feature | Description | Architecture / Implementation |
| :--- | :--- | :--- |
| **Artisan Catalog & Filtering** | High-aesthetic browsing with real-time category, bestseller, and collectible souvenir filters. | TanStack Query v5 with 30-min stale time + URL query strings mapped to MongoDB filters. |
| **Item-Level Gift Personalization** | Unique wax-sealed scroll notes and recipient names customizable per individual cart item. | Preserved through `CartItem` state, MongoDB `Order.items` schema, and embedded in Resend HTML emails. |
| **Dual-Path Payment Integration** | Razorpay guest checkout with pre-registered pending orders and HMAC-SHA256 signature verification. | Two-phase checkout (client callback + asynchronous webhook daemon with raw body parsing). |
| **Live Google Sheets Bookkeeping** | Automatically logs all cleared transactions into a remote Google Spreadsheet in real time. | Google APIs v4 service account appending columns `A:N` in IST timezone. Non-blocking error isolation. |
| **Interactive Dispatch Console** | Fulfillment table with status pipeline (`pending` ➔ `packaging` ➔ `shipped` ➔ `delivered`). | React Query optimistic mutation invalidation (`queryKey: ["orders"]`) preventing full-page reload flashes. |
| **Administrative Sales Analytics** | Live dashboard showing gross patron sales, order counts, and catalog volume. | MongoDB `$match` & `$group` aggregation pipeline; zero client-side calculation lag. |
| **Excel Ledger Export** | Instant compilation and downloading of the complete orders registry into a styled spreadsheet. | `ExcelJS` streaming `orders.xlsx` with custom column widths directly from Express. |
| **Botanical Email Dispatches** | Elegant HTML transactional emails styled with brand serif typography and wax-seal formatting. | `Resend` API triggers for customer receipt, admin dispatch alerts, and payment failure notices. |
| **Multi-Tiered Rate Limiting** | Defends against brute-force attacks and denial-of-service traffic spikes. | `express-rate-limit`: Global API (300/15m), Auth login (20/15m), Admin (1000/15m). |

---

## 🛠️ Technology Stack Breakdown

### Frontend
- **Core Framework:** React 19, TypeScript 5.8, Vite 6
- **Server State & Caching:** `@tanstack/react-query` v5 (Configured with `staleTime: 30m`, `gcTime: 30m`, `retry: 2`)
- **Styling & Layout:** Tailwind CSS v4, custom brand design system (`brand-cream`, `brand-black`, `brand-gold`, `brand-beige`, `brand-pink`, `brand-ivory`)
- **Typography:** Cormorant Garamond, Playfair Display, and Inter
- **Motion & Interactions:** Motion (Framer Motion v12) for smooth drawer slide-outs and layout transitions
- **Routing:** React Router DOM v7 with protected route wrapper guards
- **Icons:** Lucide React

### Backend
- **Runtime & Web Framework:** Node.js (v18+), Express.js 5
- **Database & Modeling:** MongoDB, Mongoose 9 (Strict typing, indexed query fields)
- **Security:** `helmet` for HTTP headers, `cors` with origin whitelisting, `bcryptjs` password hashing, `jsonwebtoken` (JWT) with role verification
- **Payment & Webhooks:** Razorpay Node SDK, Node.js native `crypto` HMAC-SHA256
- **Spreadsheets & Bookkeeping:** `googleapis` (Google Sheets v4), `exceljs`
- **Email Service:** `resend` SDK
- **Media Storage:** `cloudinary` v2

---

## 📂 Project Directory Structure

```
lavish-lathers/
├── backend/                             # Express.js Server Application
│   ├── config/
│   │   ├── db.js                        # Mongoose MongoDB connection & error handling
│   │   ├── cloudinary.js                # Cloudinary SDK configuration
│   │   └── google-service-account.json  # (Gitignored) Google Service Account credentials
│   ├── controllers/
│   │   ├── adminController.js           # Sales aggregation, order logs, Excel exports
│   │   ├── authController.js            # Admin authentication & NoSQL injection guards
│   │   ├── orderController.js           # Razorpay order initialization & signature check
│   │   ├── productController.js         # Public product catalog & admin mutations
│   │   └── webhookController.js         # Asynchronous Razorpay webhook processing
│   ├── middleware/
│   │   └── authMiddleware.js            # JWT verification & admin role enforcement
│   ├── models/
│   │   ├── Admin.js                     # Admin credentials schema
│   │   ├── Order.js                     # Order schema with item gift personalization & indexes
│   │   └── Product.js                   # Product schema with imagery, specs, and stock
│   ├── routes/
│   │   ├── adminRoutes.js               # Protected /api/admin/* endpoints
│   │   ├── authRoutes.js                # /api/auth/* endpoints (rate limited)
│   │   ├── orderRoutes.js               # /api/orders/* checkout endpoints
│   │   ├── productRoutes.js             # /api/products/* public read endpoints
│   │   └── webhookRoutes.js             # /api/webhooks/razorpay (Raw body parser)
│   ├── services/
│   │   ├── emailService.js              # Resend branded HTML mail generators
│   │   ├── googleSheetService.js        # Google Sheets v4 client authentication
│   │   └── orderSheetService.js         # Row assembly & append execution
│   ├── app.js                           # Express application & middleware chain
│   ├── server.js                        # Server initialization entry point
│   └── package.json                     # Backend dependencies & scripts
│
├── src/                                 # React Frontend Source Code
│   ├── api/
│   │   ├── apiClient.ts                 # Base HTTP client with auto-JWT & 401 interceptor
│   │   ├── authApi.ts                   # Admin authentication API calls
│   │   ├── contactApi.ts                # Customer inquiry messaging
│   │   ├── orderApi.ts                  # Order creation & dispatch updates
│   │   └── productApi.ts                # Catalog retrieval & product CRUD
│   ├── components/
│   │   ├── admin/                       # AdminLayout and back-office navigation
│   │   ├── home/                        # Hero slider, Bento collections, Testimonials
│   │   ├── layout/                      # Layout wrappers
│   │   ├── CartView.tsx                 # Slide-over canvas shopping bag drawer
│   │   ├── CustomMessageForm.tsx        # Wax-sealed scroll gift message customizer
│   │   ├── Footer.tsx                   # Brand footer with newsletter & links
│   │   ├── Navbar.tsx                   # Dynamic blur navigation header with cart badge
│   │   └── ScrollToTop.tsx              # Viewport reset on route navigation
│   ├── context/
│   │   └── AppContext.tsx               # Cart, wishlist, filters, and admin session
│   ├── hooks/
│   │   ├── useProduct.ts                # TanStack single product query hook
│   │   └── useProducts.ts               # TanStack product collection query hook
│   ├── lib/
│   │   └── queryClient.ts               # Global QueryClient configuration
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx            # Gross sales metrics & quick analytics
│   │   │   ├── Login.tsx                # Secure admin authentication form
│   │   │   ├── Orders.tsx               # Fulfillment registry, status transitions & notes
│   │   │   └── Products.tsx             # Inventory & botanical formula manager
│   │   ├── About.tsx                    # Brand heritage & botanical philosophy
│   │   ├── Checkout.tsx                 # Multi-step checkout & Razorpay checkout trigger
│   │   ├── Contact.tsx                  # Customer assistance & bespoke inquiries
│   │   ├── Home.tsx                     # Editorial hero & curated selections
│   │   ├── OrderConfirmation.tsx        # Cleared order presentation & receipt review
│   │   ├── PrivacyPolicy.tsx            # Legal policies
│   │   ├── Product.tsx                  # Product detail, rituals, ingredients & reviews
│   │   ├── Shop.tsx                     # Searchable, filterable catalog
│   │   └── TermsConditions.tsx          # Terms of purchase
│   ├── routes/
│   │   └── ProtectedRoute.tsx           # Route guard redirecting unauthorized users
│   ├── types.ts                         # Complete TypeScript domain interfaces
│   ├── App.tsx                          # App routing structure & global components
│   ├── main.tsx                         # DOM root mount with QueryClientProvider
│   └── index.css                        # Tailwind CSS v4 design system imports
│
├── example.ts                           # Unified in-memory dev sandbox server
├── package.json                         # Frontend dependencies & build commands
├── tsconfig.json                        # TypeScript compiler configurations
├── vite.config.ts                       # Vite bundler & Tailwind integration
└── README.md                            # Comprehensive production documentation
```

---

## 📡 API Reference

### Public Storefront Endpoints
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch catalog. Supports `?category=`, `?featured=true`, `?souvenir=true`. | None |
| `GET` | `/api/products/:id` | Fetch single product by MongoDB ID. | None |
| `POST` | `/api/orders/create-razorpay-order` | Pre-registers order in MongoDB and creates Razorpay Order. | None |
| `POST` | `/api/orders/verify-payment` | Verifies Razorpay HMAC signature, marks order paid, syncs Google Sheets. | None |
| `POST` | `/api/webhooks/razorpay` | Asynchronous webhook daemon for `order.paid` and `payment.failed`. | HMAC Signature |

### Admin & Back-Office Endpoints
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates administrator; issues 7-day JWT. | None (Rate Limited) |
| `GET` | `/api/admin/stats` | Computes gross sales revenue, order counts, and catalog volume. | Bearer JWT |
| `GET` | `/api/admin/orders` | Retrieves all historical orders sorted descending. | Bearer JWT |
| `PUT` | `/api/admin/orders/:id/status` | Updates order fulfillment status (`pending`, `packaging`, `shipped`, `delivered`). | Bearer JWT |
| `GET` | `/api/admin/orders/export` | Streams formatted Excel file (`orders.xlsx`) via ExcelJS. | Bearer JWT |
| `POST` | `/api/admin/products` | Creates a new artisan botanical product. | Bearer JWT |
| `PUT` | `/api/admin/products/:id` | Updates an existing product's specs, pricing, or stock. | Bearer JWT |
| `DELETE`| `/api/admin/products/:id` | Deletes a product from the database. | Bearer JWT |

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `backend/` directory:

```env
# Server Port
PORT=5000

# MongoDB Database Connection String
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/lavish_lathers?retryWrites=true&w=majority"

# Admin Authentication Token Secret
JWT_SECRET="your_long_cryptographically_secure_jwt_secret"

# Frontend Origin for CORS Whitelisting
FRONTEND_URL="http://localhost:5173"

# Razorpay API Credentials
RAZORPAY_KEY_ID="rzp_test_YourKeyId"
RAZORPAY_KEY_SECRET="YourKeySecret"
RAZORPAY_WEBHOOK_SECRET="YourWebhookSecret"

# Resend Transactional Email API Key & Dispatcher
RESEND_API_KEY="re_YourResendApiKey"
ADMIN_EMAIL="concierge@lavishlathers.in"

# Google Sheets Automated Bookkeeping
GOOGLE_SHEET_ID="your_google_sheet_spreadsheet_id"
GOOGLE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADAN....w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Cloudinary Storage Credentials
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

Create a `.env` file in the root directory for the frontend:

```env
VITE_API_URL="http://localhost:5000/api"
VITE_RAZORPAY_KEY_ID="rzp_test_YourKeyId"
```

---

## 🚀 Installation & Running Locally

### Option A: Decoupled Full-Stack Development (Recommended)

#### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
*Backend API server initializes on `http://localhost:5000` with MongoDB and Razorpay bindings.*

#### 2. Start the Frontend Client
In a separate terminal window:
```bash
npm install
npm run dev
```
*Vite client launches on `http://localhost:5173`.*

---

### Option B: Unified Dev Sandbox Mode

For rapid prototyping without configuring external databases or third-party webhooks, you can run the in-memory sandbox server:
```bash
npx tsx example.ts
```
*Serves mock endpoints and compiles Vite client simultaneously on `http://localhost:5173`.*

---

## 📊 Google Sheets Ledger Configuration

To enable real-time order ledger streaming:
1. Create a Google Cloud Project in the [Google Cloud Console](https://console.cloud.google.com/) and enable the **Google Sheets API**.
2. Create a **Service Account** under *IAM & Admin > Service Accounts*.
3. Generate and download the private key JSON file, then supply `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` in `backend/.env`.
4. Create a Google Spreadsheet and **share edit permissions** with the Service Account email.
5. In `Sheet1`, initialize columns `A` through `N` with headers:
   `Order ID | Customer Name | Email | Phone | Shipping Address | Product List | Total Quantity | Subtotal | Shipping Fee | Delivery Instructions | Total Cost | Payment Status | Order Status | Timestamp`

---

## 🔒 Security & Production Hardening

1. **Webhook Body Ordering:** Express body parsing order is strictly enforced so that `express.raw({ type: "application/json" })` intercepts `/api/webhooks` before `express.json()` consumes the stream. This maintains byte fidelity for HMAC verification.
2. **NoSQL Injection Defense:** In `authController.js`, input parameters are explicitly typed (`typeof email !== "string"`) to thwart object-based operator injections (e.g. `{"$gt": ""}`).
3. **Multi-Tier Rate Limiting:** Separate sliding-window rate limiters prevent dictionary attacks against the admin portal (`20 req / 15m`) while allowing fluid storefront navigation.
4. **JWT Role Verification:** `protectAdmin` middleware explicitly verifies `decoded.role === "admin"` to prevent token privilege escalation.
5. **Database Indexing:** Indexed search paths prevent full collection scans as order volume grows.

---

## 📜 Production Build & Deployment

To compile for production:

```bash
# Build frontend bundle
npm run build

# Start production server
npm start
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

&copy; 2026 Lavish Lathers – Handcrafted Botanical Formulations & Keepsakes.