import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { PRODUCTS } from "./src/data";
import { Order, CheckoutDetails, CartItem, ContactMessage, Review, Product } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // In-memory data persistence models
  let siteProducts = [...PRODUCTS];
  const orders: Order[] = [];
  const contactMessages: ContactMessage[] = [];
  
  // Custom Reviews storage mapped to product IDs
  const customReviews: Record<string, Review[]> = {};

  // HEALTH CHECK
  app.get("/api/health", (req, res) => {
    res.json({ status: "alive", brand: "Lavish Lathers", timestamp: new Date() });
  });

  // GET LIST OF PRODUCTS
  app.get("/api/products", (req, res) => {
    const { category, isBestSeller, isCollectible } = req.query;
    let filtered = [...siteProducts];

    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (isBestSeller === "true") {
      filtered = filtered.filter(p => p.isBestSeller);
    }
    if (isCollectible === "true") {
      filtered = filtered.filter(p => p.isCollectible);
    }

    res.json(filtered);
  });

  // GET PARTICULAR PRODUCT
  app.get("/api/products/:id", (req, res) => {
    const product = siteProducts.find(p => p.id === req.params.id);
    if (!product) {
       res.status(404).json({ error: "Product not found" });
       return;
    }
    
    // Attach custom reviews if any exist
    const pReviews = customReviews[product.id] || [];
    res.json({ ...product, customReviews: pReviews });
  });

  // SUBMIT REVIEW
  app.post("/api/products/:id/reviews", (req, res) => {
    const { name, rating, text } = req.body;
    const targetProduct = siteProducts.find(p => p.id === req.params.id);
    
    if (!targetProduct) {
       res.status(404).json({ error: "Product not found" });
       return;
    }

    if (!name || !rating || !text) {
       res.status(400).json({ error: "Missing required review fields (name, rating, text)" });
       return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      rating: Number(rating),
      text,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    if (!customReviews[targetProduct.id]) {
      customReviews[targetProduct.id] = [];
    }
    customReviews[targetProduct.id].unshift(newReview);

    // Update product rating average dynamically
    const allReviewsCount = targetProduct.reviewsCount + 1;
    const currentTotalPoints = targetProduct.rating * targetProduct.reviewsCount;
    const newRating = Number(((currentTotalPoints + Number(rating)) / allReviewsCount).toFixed(2));

    targetProduct.rating = Math.min(5, Math.max(1, newRating));
    targetProduct.reviewsCount = allReviewsCount;

    res.status(201).json({ success: true, review: newReview, updatedRating: targetProduct.rating, reviewsCount: targetProduct.reviewsCount });
  });

  // POST CUSTOM SUPPORT TICKETS
  app.post("/api/contact", (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
       res.status(400).json({ error: "Name, email, and message are required fields" });
       return;
    }

    const submission: ContactMessage = {
      id: `contact-${Date.now()}`,
      name,
      email,
      phone,
      message,
      date: new Date().toISOString()
    };

    contactMessages.push(submission);
    console.log(`[Support Ticket] New message from ${name} (${email}): ${message}`);

    res.json({
      success: true,
      message: "Your message has been received with botanical love. We will contact you via Email/WhatsApp shortly.",
      ticketId: submission.id
    });
  });

  // NEW ORDER & GUEST CHECKOUT WITH RAZORPAY PRE-INTEGRATION
  app.post("/api/orders", (req, res) => {
    const { items, shippingDetails, subtotal, shipping, total } = req.body;

    if (!items || !items.length || !shippingDetails) {
       res.status(400).json({ error: "Required cart items or checkout details are missing" });
       return;
    }

    // Verify stock and update stock values
    for (const item of items as CartItem[]) {
      const dbProd = siteProducts.find(p => p.id === item.product.id);
      if (dbProd) {
        if (dbProd.stock < item.quantity) {
           res.status(400).json({ error: `Product '${dbProd.name}' is out of stock. Available: ${dbProd.stock}` });
           return;
        }
      }
    }

    // Deduct inventory
    for (const item of items as CartItem[]) {
      const dbProd = siteProducts.find(p => p.id === item.product.id);
      if (dbProd) {
        dbProd.stock -= item.quantity;
      }
    }

    // Capture guest order with mock Razorpay reference IDs
    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      items,
      shippingDetails,
      subtotal: Number(subtotal),
      shipping: Number(shipping),
      total: Number(total),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      paymentId: `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(4, 9)}`,
      paymentStatus: "completed",
      status: "processing"
    };

    orders.push(newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Thank you for buying from Lavish Lathers!",
      order: newOrder
    });
  });

  // RETRIEVE SPECIFIC ORDER FOR THE PATRON'S CHECKOUT SUMMARY SCREEN
  app.get("/api/orders/:id", (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
       res.status(404).json({ error: "Order details not found" });
       return;
    }
    res.json(order);
  });

  // --- ADMIN AUTHENTICATION MIDDLEWARE ---
  const adminAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Access denied. Credentials needed." });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (token !== "dummy-jwt-token-luxe-ayurveda") {
      res.status(403).json({ error: "Invalid token credentials." });
      return;
    }
    next();
  };

  // POST ADMIN LOGIN
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    
    // Simple but secure static credentials for sandbox testing
    if (email === "admin@lavishlathers.com" && password === "adminpassword") {
      res.json({
        success: true,
        token: "dummy-jwt-token-luxe-ayurveda",
        email: "admin@lavishlathers.com"
      });
    } else {
      res.status(401).json({ error: "Incorrect administrator email or password" });
    }
  });

  // GET ADMIN DASHBOARD STATS
  app.get("/api/admin/stats", adminAuthMiddleware, (req, res) => {
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const productsCount = siteProducts.length;
    const messagesCount = contactMessages.length;

    // Calculate category distribution sales
    const salesByCategory: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const cat = item.product.category || 'Other';
        salesByCategory[cat] = (salesByCategory[cat] || 0) + (item.product.price * item.quantity);
      });
    });

    res.json({
      totalOrders,
      totalSales,
      productsCount,
      messagesCount,
      salesByCategory
    });
  });

  // GET ALL ORDERS FOR ADMIN
  app.get("/api/admin/orders", adminAuthMiddleware, (req, res) => {
    // Return all orders sorted by dynamic date descending (or reverse chronologically)
    res.json([...orders].reverse());
  });

  // UPDATE ORDER STATUS
  app.put("/api/admin/orders/:id/status", adminAuthMiddleware, (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      res.status(404).json({ error: "Order requested not found." });
      return;
    }

    if (status !== "processing" && status !== "shipped" && status !== "delivered") {
      res.status(400).json({ error: "Invalid status code value." });
      return;
    }

    order.status = status;
    res.json({ success: true, order });
  });

  // GET CONTACT MESSAGES FOR ADMIN
  app.get("/api/admin/messages", adminAuthMiddleware, (req, res) => {
    res.json([...contactMessages].reverse());
  });

  // ADMIN CREATE PRODUCT
  app.post("/api/admin/products", adminAuthMiddleware, (req, res) => {
    const productData = req.body;

    if (!productData.name || !productData.price || !productData.category) {
      res.status(400).json({ error: "Product name, category, and price are required." });
      return;
    }

    const newProduct: Product = {
      id: productData.id || `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: productData.name,
      type: productData.type || 'skincare',
      category: productData.category,
      price: Number(productData.price),
      rating: 5.0,
      reviewsCount: 0,
      description: productData.description || "A pristine Lavish Lathers formulation.",
      details: productData.details || "A premium cure made with ancient botanical practices.",
      ingredients: productData.ingredients || [],
      benefits: productData.benefits || [],
      images: productData.images && productData.images.length ? productData.images : ["https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=800"],
      stock: Number(productData.stock ?? 20),
      isBestSeller: !!productData.isBestSeller,
      isCollectible: !!productData.isCollectible
    };

    siteProducts.push(newProduct);
    res.status(201).json(newProduct);
  });

  // ADMIN UPDATE PRODUCT
  app.put("/api/admin/products/:id", adminAuthMiddleware, (req, res) => {
    const targetIdx = siteProducts.findIndex(p => p.id === req.params.id);

    if (targetIdx === -1) {
      res.status(404).json({ error: "Product with specified ID was not found." });
      return;
    }

    const currentProd = siteProducts[targetIdx];
    const updateData = req.body;

    const updatedProduct: Product = {
      ...currentProd,
      name: updateData.name ?? currentProd.name,
      type: updateData.type ?? currentProd.type,
      category: updateData.category ?? currentProd.category,
      price: updateData.price !== undefined ? Number(updateData.price) : currentProd.price,
      description: updateData.description ?? currentProd.description,
      details: updateData.details ?? currentProd.details,
      ingredients: updateData.ingredients ?? currentProd.ingredients,
      benefits: updateData.benefits ?? currentProd.benefits,
      images: updateData.images && updateData.images.length ? updateData.images : currentProd.images,
      stock: updateData.stock !== undefined ? Number(updateData.stock) : currentProd.stock,
      isBestSeller: updateData.isBestSeller !== undefined ? !!updateData.isBestSeller : currentProd.isBestSeller,
      isCollectible: updateData.isCollectible !== undefined ? !!updateData.isCollectible : currentProd.isCollectible
    };

    siteProducts[targetIdx] = updatedProduct;
    res.json(updatedProduct);
  });

  // ADMIN DELETE PRODUCT
  app.delete("/api/admin/products/:id", adminAuthMiddleware, (req, res) => {
    const targetIdx = siteProducts.findIndex(p => p.id === req.params.id);

    if (targetIdx === -1) {
      res.status(404).json({ error: "Product with specified ID was not found." });
      return;
    }

    const removedId = siteProducts[targetIdx].id;
    siteProducts = siteProducts.filter(p => p.id !== req.params.id);
    res.json({ success: true, id: removedId });
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Lavish Lathers Backend] Server initialized successfully on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting backend server:", err);
});
