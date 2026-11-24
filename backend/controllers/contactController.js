const ContactMessage = require("../models/ContactMessage");

async function submitContact(req, res) {
  const { name, email, phone, subject, message } = req.body || {};
  try {
    const ticket = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, ticketId: ticket.id, message: "Your inquiry has been received." });
  } catch (error) {
    const invalid = error.name === "ValidationError";
    res.status(invalid ? 400 : 500).json({ message: invalid ? "Please check your contact details and message." : "Unable to save your inquiry. Please try again." });
  }
}

async function listMessages(req, res) {
  const messages = await ContactMessage.find().sort({ _id: -1 }).lean();
  res.json(messages);
}

module.exports = { submitContact, listMessages };
