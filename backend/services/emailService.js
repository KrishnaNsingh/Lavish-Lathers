const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const formatOrderItemsHtml = (items) => {
  return items.map(item => {
    const giftScrollHtml = item.isGift ? `
      <tr>
        <td colspan="3" style="padding: 10px 15px 15px 15px;">
          <div style="background-color: #FCFAF5; border: 1px dashed #D6C29E; border-radius: 12px; padding: 15px; position: relative;">
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #B29158; font-weight: bold; margin-bottom: 6px; font-family: sans-serif; display: flex; align-items: center;">
              📜 WAX-SEALED GIFT SCROLL
            </div>
            <div style="font-size: 13px; font-family: Georgia, serif; color: #8A251E; font-weight: bold; margin-bottom: 4px;">
              To: ${item.giftRecipient || 'Patron'}
            </div>
            <div style="font-size: 13px; font-style: italic; color: #2F2C2A; line-height: 1.6; font-family: Georgia, serif;">
              &ldquo;${item.giftNote || 'Heartfelt Greetings'}&rdquo;
            </div>
          </div>
        </td>
      </tr>
    ` : '';

    return `
      <tr style="border-bottom: 1px solid #EFECE6;">
        <td style="padding: 15px 10px; font-family: Georgia, serif; font-size: 14px; color: #1A1817; font-weight: 500;">
          ${item.name}
          <div style="font-size: 10px; color: #7E7771; font-family: sans-serif; margin-top: 2px;">Registry: ${item.registryId || 'N/A'}</div>
        </td>
        <td style="padding: 15px 10px; font-family: Arial, sans-serif; font-size: 14px; color: #2F2C2A; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 15px 10px; font-family: Georgia, serif; font-size: 14px; color: #1A1817; text-align: right; font-weight: bold;">
          ₹${item.price * item.quantity}
        </td>
      </tr>
      ${giftScrollHtml}
    `;
  }).join('');
};

const sendCustomerOrderEmail = async (order) => {
  try {
    console.log("Customer Email Destination:", order.customer.email);

    const response = await resend.emails.send({
      from: "Lavish Lathers <onboarding@resend.dev>",
      to: order.customer.email,
      subject: "Order Confirmed - Lavish Lathers",
      html: `
      <div style="background-color: #FAF7F2; padding: 40px 15px; font-family: Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #EFECE6; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.025);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #1A1817; padding: 40px 20px; border-bottom: 4px solid #BFA873;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; letter-spacing: 0.15em; color: #FAF7F2; text-transform: uppercase; font-weight: 300;">Lavish Lathers</h1>
              <p style="margin: 5px 0 0 0; font-family: sans-serif; font-size: 9px; letter-spacing: 0.3em; color: #BFA873; text-transform: uppercase; font-weight: 600;">Atelier Apothecary &amp; Souvenirs</p>
            </td>
          </tr>
          
          <!-- Welcome Intro -->
          <tr>
            <td style="padding: 35px 30px 20px 30px;">
              <h2 style="margin: 0 0 15px 0; font-family: Georgia, serif; font-size: 22px; color: #1A1817; font-weight: normal; letter-spacing: 0.02em;">Your Order is Curing</h2>
              <p style="margin: 0; font-size: 14px; color: #2F2C2A; line-height: 1.6; font-weight: 300;">
                Hello ${order.customer.name},
              </p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #7E7771; line-height: 1.6; font-weight: 300;">
                Thank you for your patronage. Your purchase has been verified and registered. Our artisans have locked in your selections and are preparing your customized ribbon boxes.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF7F2; border-radius: 16px; padding: 24px; border: 1px solid #FAF7F2;">
                <tr>
                  <td style="padding-bottom: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #7E7771; font-weight: bold; font-family: sans-serif;">Order Reference ID</td>
                  <td style="padding-bottom: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #7E7771; font-weight: bold; text-align: right; font-family: sans-serif;">Curing Status</td>
                </tr>
                <tr>
                  <td style="font-family: monospace; font-size: 13px; color: #1A1817; font-weight: bold;">${order._id}</td>
                  <td style="font-family: sans-serif; font-size: 10px; color: #BFA873; font-weight: bold; text-align: right; text-transform: uppercase; letter-spacing: 0.1em;">Curing &amp; Packaging</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 15px; border-top: 1px solid #EFECE6; margin-top: 15px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #7E7771; padding: 3px 0;">Date of Registry:</td>
                        <td style="font-size: 12px; color: #1A1817; text-align: right; font-weight: 500; padding: 3px 0;">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #7E7771; padding: 3px 0;">Dispatch Destination:</td>
                        <td style="font-size: 12px; color: #1A1817; text-align: right; font-weight: 500; padding: 3px 0;">
                          ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 10px 30px 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #EFECE6;">
                    <th align="left" style="padding-bottom: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #7E7771; font-weight: bold; font-family: sans-serif;">Bespoke Formulation</th>
                    <th align="center" style="padding-bottom: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #7E7771; font-weight: bold; width: 60px; font-family: sans-serif;">Qty</th>
                    <th align="right" style="padding-bottom: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #7E7771; font-weight: bold; width: 90px; font-family: sans-serif;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${formatOrderItemsHtml(order.items)}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Breakdown calculations -->
          <tr>
            <td style="padding: 0 30px 35px 30px;">
              <table align="right" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 280px; border-top: 2px solid #EFECE6; padding-top: 15px;">
                <tr>
                  <td style="font-size: 13px; color: #7E7771; padding: 5px 0;">Gross Subtotal</td>
                  <td align="right" style="font-family: Georgia, serif; font-size: 13px; color: #2F2C2A; padding: 5px 0;">₹${order.pricing.subtotal}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #7E7771; padding: 5px 0;">Artisan Wrapping &amp; Shipping</td>
                  <td align="right" style="font-family: Georgia, serif; font-size: 13px; color: #2F2C2A; padding: 5px 0;">
                    ${order.pricing.shipping === 0 ? '<span style="color: #10B981; font-weight: bold; font-size: 10px; font-family: sans-serif; letter-spacing: 0.05em;">FREE</span>' : `₹${order.pricing.shipping}`}
                  </td>
                </tr>
                <tr style="border-top: 1px solid #EFECE6;">
                  <td style="font-family: Georgia, serif; font-size: 15px; color: #1A1817; font-weight: bold; padding: 15px 0 0 0;">Total Clearance</td>
                  <td align="right" style="font-family: Georgia, serif; font-size: 20px; color: #BFA873; font-weight: bold; padding: 15px 0 0 0;">₹${order.pricing.total}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer/Concierge details -->
          <tr>
            <td align="center" style="background-color: #1A1817; padding: 35px 20px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #FAF7F2; font-weight: 300; line-height: 1.5; font-family: sans-serif;">
                Concierge snap favors or ribbon wrapping details?
                <br>
                Chat with our artisans on WhatsApp: <strong style="color: #BFA873;">+1 (555) 0199-CONCIERGE</strong>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 9px; color: #7E7771; text-transform: uppercase; letter-spacing: 0.2em; font-family: sans-serif;">&copy; ${new Date().getFullYear()} Lavish Lathers. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
      `,
    });

    console.log("Customer Email Response ID:", response.data?.id);
  } catch (error) {
    console.error("Customer email delivery crash:", error);
  }
};

const sendAdminOrderEmail = async (order) => {
  try {
    console.log("Admin Email Destination:", process.env.ADMIN_EMAIL);

    const response = await resend.emails.send({
      from: "Lavish Lathers <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `New Patron Order Received - Ref: ${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
      <div style="background-color: #1A1817; padding: 40px 15px; font-family: Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #EFECE6; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #BFA873; padding: 30px 20px;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 22px; color: #1A1817; text-transform: uppercase; font-weight: normal; letter-spacing: 0.1em;">NEW PATRON ORDER</h1>
              <p style="margin: 5px 0 0 0; font-family: sans-serif; font-size: 9px; letter-spacing: 0.2em; color: #ffffff; text-transform: uppercase; font-weight: bold;">Atelier Fulfillment Request</p>
            </td>
          </tr>

          <!-- Patron Details Block -->
          <tr>
            <td style="padding: 30px 30px 15px 30px;">
              <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 16px; color: #1A1817; border-bottom: 2px solid #EFECE6; padding-bottom: 8px;">1. Patron Credentials</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; line-height: 1.6; color: #2F2C2A;">
                <tr>
                  <td style="font-weight: bold; width: 120px;">Name:</td>
                  <td>${order.customer.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Email:</td>
                  <td>${order.customer.email}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Phone:</td>
                  <td>${order.customer.phone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dispatch Destination Block -->
          <tr>
            <td style="padding: 0 30px 15px 30px;">
              <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 16px; color: #1A1817; border-bottom: 2px solid #EFECE6; padding-bottom: 8px;">2. Shipping Address</h3>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #2F2C2A;">
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.instructions ? `<span style="font-style: italic; color: #7E7771;">Instructions: ${order.shippingAddress.instructions}</span>` : ''}
              </p>
            </td>
          </tr>

          <!-- Ordered Items Table -->
          <tr>
            <td style="padding: 10px 30px 20px 30px;">
              <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 16px; color: #1A1817; border-bottom: 2px solid #EFECE6; padding-bottom: 8px;">3. Curation Manifest</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #EFECE6;">
                    <th align="left" style="padding-bottom: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #7E7771; font-weight: bold;">Item</th>
                    <th align="center" style="padding-bottom: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #7E7771; font-weight: bold; width: 60px;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #7E7771; font-weight: bold; width: 90px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${formatOrderItemsHtml(order.items)}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Pricing Clearance Breakdown -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table align="right" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-top: 1px solid #EFECE6; padding-top: 15px;">
                <tr>
                  <td style="font-size: 13px; color: #7E7771;">Total Revenue Cleared:</td>
                  <td align="right" style="font-family: Georgia, serif; font-size: 18px; color: #BFA873; font-weight: bold;">₹${order.pricing.total}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #7E7771; padding-top: 5px;">Payment ID:</td>
                  <td align="right" style="font-family: monospace; font-size: 12px; color: #2F2C2A; padding-top: 5px;">${order.payment?.razorpayPaymentId || 'N/A'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Admin instructions -->
          <tr>
            <td align="center" style="background-color: #FAF7F2; padding: 25px 20px; text-align: center; border-top: 1px solid #EFECE6;">
              <p style="margin: 0; font-size: 11px; color: #7E7771; font-family: sans-serif;">
                Verify customization scroll messages above prior to box assembly.
              </p>
            </td>
          </tr>
        </table>
      </div>
      `,
    });

    console.log("Admin Email Response ID:", response.data?.id);
  } catch (error) {
    console.error("Admin notification dispatch failure:", error);
  }
};

const sendPaymentFailedEmail = async (order) => {
  try {
    console.log("Payment Failed Email Destination:", order.customer.email);

    const response = await resend.emails.send({
      from: "Lavish Lathers <onboarding@resend.dev>",
      to: order.customer.email,
      subject: "Payment Failed - Lavish Lathers",
      html: `
      <div style="background-color: #FAF7F2; padding: 40px 15px; font-family: Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #EFECE6; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.025);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #DC2626; padding: 35px 20px; border-bottom: 4px solid #991B1B;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #ffffff; text-transform: uppercase; font-weight: normal; letter-spacing: 0.1em;">⚠ PAYMENT FAILED</h1>
              <p style="margin: 5px 0 0 0; font-family: sans-serif; font-size: 9px; letter-spacing: 0.25em; color: #FECACA; text-transform: uppercase; font-weight: 600;">Transaction Unresolved</p>
            </td>
          </tr>

          <!-- Intro Message -->
          <tr>
            <td style="padding: 35px 30px 20px 30px;">
              <p style="margin: 0; font-size: 14px; color: #2F2C2A; line-height: 1.6; font-weight: 300;">
                Hello ${order.customer.name},
              </p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #7E7771; line-height: 1.6; font-weight: 300;">
                We were unable to process the payment verification sequence for your recent Lavish Lathers order. As a result, your order curation is currently on hold.
              </p>
            </td>
          </tr>

          <!-- Failed Order Info Card -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FEF2F2; border-radius: 12px; padding: 20px; border: 1px solid #FEE2E2;">
                <tr>
                  <td style="font-size: 12px; color: #991B1B; font-weight: bold; padding: 3px 0;">Order Reference:</td>
                  <td style="font-family: monospace; font-size: 12px; color: #991B1B; text-align: right; font-weight: bold; padding: 3px 0;">${order._id}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #991B1B; font-weight: bold; padding: 3px 0;">Total Clearance Required:</td>
                  <td align="right" style="font-family: Georgia, serif; font-size: 14px; color: #991B1B; font-weight: bold; padding: 3px 0;">₹${order.pricing.total}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #991B1B; font-weight: bold; padding: 3px 0;">Status:</td>
                  <td style="font-size: 11px; text-transform: uppercase; color: #DC2626; text-align: right; font-weight: bold; padding: 3px 0; font-family: sans-serif;">Declined</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Possible Reasons Checklist -->
          <tr>
            <td style="padding: 0 30px 25px 30px; font-size: 13px; color: #2F2C2A; line-height: 1.6;">
              <h4 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 14px; color: #1A1817;">Common causes for failure:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #7E7771;">
                <li style="margin-bottom: 5px;">UPI / Card authentication timeout or failure</li>
                <li style="margin-bottom: 5px;">Declined transaction by card issuer or bank</li>
                <li style="margin-bottom: 5px;">Insufficient funds inside the source account</li>
                <li style="margin-bottom: 5px;">Network interruption during checkout verification</li>
              </ul>
            </td>
          </tr>

          <!-- CTA to Retry -->
          <tr>
            <td align="center" style="padding: 10px 30px 35px 30px; text-align: center;">
              <a href="http://localhost:5173/shop" style="background-color: #1A1817; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; padding: 15px 30px; border-radius: 30px; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.15); font-family: sans-serif;">
                Return &amp; Retry Payment
              </a>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #7E7771; font-weight: 300; line-height: 1.5; font-family: sans-serif;">
                If you have been debited but do not receive a confirmation within 1 hour,<br>
                please contact our concierge team at: <strong style="color: #1A1817;">+1 (555) 0199-CONCIERGE</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #1A1817; padding: 25px 20px; text-align: center;">
              <p style="margin: 0; font-size: 9px; color: #7E7771; text-transform: uppercase; letter-spacing: 0.25em; font-family: sans-serif;">&copy; ${new Date().getFullYear()} Lavish Lathers. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
      `,
    });

    console.log("Payment Failed Email Response ID:", response.data?.id);
  } catch (error) {
    console.error("Payment failure notification delivery crash:", error);
  }
};

module.exports = {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
  sendPaymentFailedEmail,
};