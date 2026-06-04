# 🛁 Lavish Lathers – Premium Artisan Apothecary & Souvenirs

Lavish Lathers is a full-stack e-commerce web application designed for a luxury artisan botanical soap and skincare brand. The platform offers a visually stunning, responsive storefront with item-level customization (such as personalized gift notes), seamless checkout processing via Razorpay, real-time transactional email notifications via Resend, and automated business operations including Cloudinary image management, Google Sheets bookkeeping, and admin ledger exports.

---

## 🏛️ System Architecture

The project follows a decoupled client-server architecture with several third-party service integrations to automate orders, catalog updates, and ledger bookkeeping:

```mermaid
graph TD
    A[React Client - Vite/TS] <-->|HTTP API / JSON| B[Express.js Server]
    B <-->|Mongoose ODM| C[(MongoDB Database)]
    B -->|SDK / Webhooks| D[Razorpay Payments]
    B -->|Transactional Mail| E[Resend Email API]
    B -->|Asset Delivery| F[Cloudinary CDN]
    B -->|Automated Bookkeeping| G[Google Sheets API]
    B -->|ExcelJS Compilation| H[Excel Ledger Exports]
```

---

## 🚀 Key Features

* **Artisanal Catalog (Shop & Products):** Browsing experience with advanced filters (by category and souvenir type), custom sorting, search capabilities, and dedicated detail panels detailing ingredients, benefits, and descriptions.
* **Patron Reviews:** Complete review cycle allowing customers to submit reviews and star ratings, automatically recalculating the product's overall rating averages.
* **Item-Level Personalization:** Supports unique gift wrapping details, recipient specifications, and customized notes per individual item in the shopping cart.
* **Razorpay Payment Integration:** Seamless guest checkout. Pre-registers orders in MongoDB to ensure consistency and validates HMAC signature callbacks.
* **Webhook Curing Daemon:** Built-in webhook handler to handle asynchronous order payments (supporting `order.paid`, `payment.captured`, and `payment.failed` event states) in case of unexpected network drops or closed browser tabs.
* **Automated Ledger Bookkeeping:** Connects to Google Sheets via the Google APIs service account, automatically logging successful clearances into a remote spreadsheet in real-time.
* **Fulfillment Admin Dashboard:**
  * **Real-time Metrics:** Displays overall order volume, cumulative revenues, and active catalog counts.
  * **Interactive Dispatch Registry:** Order table with status modifiers (`pending` ➔ `packaging` ➔ `shipped` ➔ `delivered`) and collapsible drawers highlighting custom gift notes.
  * **Catalog Editor:** Full CRUD administration for catalog managers to edit details, upload assets, adjust stock, and flag featured or collectible souvenirs.
  * **Data Export:** Instant administrative exports of the ledger database into Excel sheets (`orders.xlsx`) powered by ExcelJS.
* **Botanical Alerts & Mailing System:** Dynamic HTML mail alerts dispatched through the Resend API (Customer Confirmation, Admin Alert, and Payment Failure/Warning notices).

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React 19, TypeScript, Vite 6
* **Styling:** Tailwind CSS v4 (Sleek custom colors, serif-cormorant typography, glassmorphism UI)
* **Animations:** Motion (Framer Motion v12) for premium transitions, hover states, and loading states
* **Routing:** React Router DOM v7
* **Icons:** Lucide React

### Backend
* **Core:** Node.js, Express.js 5
* **Database:** MongoDB & Mongoose ODM (configured with performance indexes on query paths)
* **API Compilation & Auth:** JSON Web Tokens (JWT), BcryptJS (Password hashing)
* **Integrations & Operations:**
  * **Razorpay Node SDK:** Payment gateway lifecycle
  * **Resend API:** Transactional email alerts
  * **Google APIs Node SDK:** Google Sheets automated ledger sync
  * **ExcelJS:** Administrative spreadsheet compilation
  * **Cloudinary SDK:** Botanical media hosting
  * **Multer:** Multipart file uploads for assets

---

## 📂 Project Structure

```
lavish-lathers/
├── backend/                  # Express.js Server Application
│   ├── config/               # Database and API keys configurations (MongoDB, Cloudinary, Google Auth)
│   ├── controllers/          # Business logic (Admin, Auth, Orders, Products, Webhooks)
│   ├── middleware/           # Middlewares (Auth protection, raw body hooks)
│   ├── models/               # MongoDB Mongoose Schemas (Admin, Order, Product)
│   ├── routes/               # API Router declarations
│   ├── services/             # Integrations (Resend Email service, Google Sheets Ledger)
│   ├── app.js                # App definition and middleware pipelines
│   ├── server.js             # Main server execution hook
│   └── package.json          # Backend dependencies and run scripts
├── src/                      # React Frontend Source Code
│   ├── api/                  # Base API Client and route-specific API calls
│   ├── components/           # Reusable UI parts & structure layouts (Nav, Footer, Logo)
│   ├── context/              # Global application states (Cart, Sidebar overlays)
│   ├── data/                 # Catalog mock data for initial seeds
│   ├── pages/                # Main views (Shop, About, Product Detail, Checkout, Admin pages)
│   ├── types.ts              # Global TypeScript interface definitions
│   └── main.tsx              # React mounting entry point
├── package.json              # Frontend dependencies and run scripts
├── vite.config.ts            # Vite & Tailwind compilation configuration
├── index.html                # Main HTML page template
└── README.md                 # Project Documentation (This file)
```

---

## ⚙️ Configuration & Installation

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (Local instance or MongoDB Atlas Cloud URI)
* **Google Cloud Account** (For Google Sheets API service account access)
* **Razorpay Developer Account** (For payment sandbox testing)
* **Resend Account** (For email notification triggers)

---

### Step 1: Environment Variables Setup

#### Backend Environment Configuration
Create a `.env` file inside the `backend/` directory and configure the variables as follows:

```env
# Server Port Configuration
PORT=5000

# Database URI (MongoDB connection string)
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/dbname"

# Admin Authentication Secret
JWT_SECRET="your_jwt_signing_token_secret"

# Frontend Application Base URL (for CORS allowance)
FRONTEND_URL="http://localhost:5173"

# Razorpay API Credentials
RAZORPAY_KEY_ID="rzp_test_YourKeyID"
RAZORPAY_KEY_SECRET="YourKeySecret"
RAZORPAY_WEBHOOK_SECRET="YourWebhookSecret"

# Resend API Key & Alerts Configuration
RESEND_API_KEY="re_YourResendAPIKey"
ADMIN_EMAIL="admin@yourbrand.com"

# Google Sheets Ledger Parameters
GOOGLE_SHEET_ID="your_google_sheet_id_string"

# Cloudinary Storage Credentials
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

---

### Step 2: Google Sheets Ledger Configuration

To enable real-time order logging, you must set up a Google Cloud Service Account:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Sheets API**.
3. Create a **Service Account** under *IAM & Admin > Service Accounts*.
4. Generate and download a **JSON Private Key** for the service account.
5. Save this JSON key file inside `backend/config/` and rename it to `google-service-account.json`.
6. Open your target Google Sheet tracking ledger and **share edit access** with the service account email (e.g. `your-service-account@your-project.iam.gserviceaccount.com`).
7. Keep column order from `A to M` in `Sheet1` mapping to:
   `Order ID | Customer Name | Email | Phone | Shipping Address | Product List | Total Quantity | Subtotal | Shipping Fee | Total Cost | Payment Status | Order Status | Timestamp`

---

### Step 3: Installation & Execution

You can run the application in two modes depending on your workflow.

#### Option A: Unified Dev Sandbox (Recommended)
This runs both the API routes and the client application through a single Vite dev server process:

1. Open the root workspace folder.
2. Install the main frontend/dev dependencies:
   ```bash
   npm install
   ```
3. Run the development sandbox script (pre-configured to serve Vite and API routes):
   ```bash
   npx tsx example.ts
   ```
4. Access the unified app at `http://localhost:5173`.

#### Option B: Decoupled Client-Server Setup
For individual control over the backend nodemon process and frontend hot-reloads:

##### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
The server starts listening on `http://localhost:5000` (or your configured `PORT`).

##### 2. Start the Frontend Vite Server
Open a separate terminal window and run:
```bash
npm install
npm run dev
```
The Vite client launches on `http://localhost:5173`.

---

## 🔒 Administrative Credentials

For initial testing in the sandbox environment, default credentials can be configured or are hardcoded as static checks (e.g., in sandbox environments):
* **Admin Login Email:** `admin@lavishlathers.com`
* **Admin Login Password:** `adminpassword`

To access the fulfillment registry directly, navigate to `http://localhost:5173/admin` and sign in.

---

## 📂 Production Build Commands

To prepare the platform for deployment:

### Build Frontend
Compile the TypeScript and build production-ready optimized static files:
```bash
npm run build
```
This outputs production assets to the `dist/` directory, which can be served by the backend or a CDN.

### Serve Production
Run the production server to host the APIs and built client resources:
```bash
npm start
```

---

## 🛠️ Code Architecture Snippets

### Mongoose Order Schema with Personalization (`backend/models/Order.js`)
```javascript
const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    registryId: String,
    name: String,
    quantity: Number,
    price: Number,
    isGift: { type: Boolean, default: false },
    giftNote: String,
    giftRecipient: String,
  }],
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
  orderStatus: {
    type: String,
    enum: ["pending", "packaging", "shipped", "delivered"],
    default: "pending",
  }
}, { timestamps: true });

// Optimize retrieval and aggregates
orderSchema.index({ "payment.paymentStatus": 1 });
orderSchema.index({ createdAt: -1 });
```

### Razorpay Webhook Verifier (`backend/controllers/webhookController.js`)
```javascript
const generatedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(req.body) // Webhooks routed before global express.json() parser to maintain stream
  .digest("hex");

if (generatedSignature !== signature) {
  return res.status(400).json({ message: "Invalid signature" });
}

// Proceed to update order paymentStatus to "paid" or "failed"
```