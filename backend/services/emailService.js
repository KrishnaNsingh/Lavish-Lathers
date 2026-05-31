const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendCustomerOrderEmail = async (
  order
) => {
  try {
    await resend.emails.send({
      from:
        "Lavish Lathers <onboarding@resend.dev>",

      to: order.customer.email,

      subject:
        "Order Confirmed - Lavish Lathers",

      html: `
        <h2>Thank you for your order!</h2>

        <p>Hello ${order.customer.name},</p>

        <p>Your order has been successfully placed.</p>

        <h3>Order Summary</h3>

        <p>
          Total:
          ₹${order.pricing.total}
        </p>

        <p>
          Status:
          ${order.orderStatus}
        </p>

        <p>
          Order Date:
          ${new Date(
            order.createdAt
          ).toLocaleString()}
        </p>

        <p>
          We'll begin processing your
          order shortly.
        </p>

        <br>

        <p>
          Lavish Lathers
        </p>
      `,
    });

  } catch (error) {
    console.error(
      "Customer email error:",
      error
    );
  }
};

const sendAdminOrderEmail = async (
  order
) => {
  try {
    await resend.emails.send({
      from:
        "Lavish Lathers <onboarding@resend.dev>",

      to:
        process.env.ADMIN_EMAIL,

      subject:
        "New Order Received",

      html: `
        <h2>New Order</h2>

        <p>
          Customer:
          ${order.customer.name}
        </p>

        <p>
          Email:
          ${order.customer.email}
        </p>

        <p>
          Phone:
          ${order.customer.phone}
        </p>

        <p>
          Total:
          ₹${order.pricing.total}
        </p>
      `,
    });

  } catch (error) {
    console.error(
      "Admin email error:",
      error
    );
  }
};

module.exports = {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
};