require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const webhookRoutes = require("./routes/webhookRoutes");


app.use(
  "/api/webhooks",
  webhookRoutes
);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
