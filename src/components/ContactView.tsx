import React, { useState } from 'react';
import { Send, MessageCircle, Instagram, Mail, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactView() {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Standard Inquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please provide name, email address, and messages.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, message: `[Subject: ${subject}] - ${message}` })
      });

      if (!response.ok) throw new Error("Contact ticket post failed");

      const responseData = await response.json();
      setTicketId(responseData.ticketId);
      setFeedback(responseData.message);
      
      // Clear states
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

    } catch (err) {
      alert("Issue submitting support ticket. Our server will receive it shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] py-16 text-brand-black text-left font-sans-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-left space-y-3 mb-12 border-b border-brand-beige/20 pb-6">
          <span className="text-[10px] uppercase tracking-[0.4em] font-sans-poppins font-semibold text-brand-gold">
             Atelier Concierge &amp; Help Desk
          </span>
          <h1 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-wide font-light">
             Speak with our Soapmakers
          </h1>
          <p className="font-sans-inter text-xs text-brand-black/55 max-w-xl font-light leading-relaxed">
             Need bespoke wedding labels, custom ribbon configurations, or wholesale orders? Log a secure ticket or slide into our WhatsApp concierge channel.
          </p>
        </div>

        {/* CONTORTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Complete Guest Message Form */}
          <div className="lg:col-span-7 bg-brand-cream border border-brand-beige/25 p-8 rounded-[2.5rem] shadow-sm">
            
            {feedback ? (
              <div className="py-12 px-6 text-center space-y-6 animate-fade-in">
                <CheckCircle2 className="h-12 w-12 text-brand-gold mx-auto" />
                <h3 className="font-serif-playfair text-2xl text-brand-black font-semibold">Message Logged!</h3>
                <p className="text-xs text-brand-black/70 leading-relaxed font-sans-inter">
                  {feedback}
                </p>
                <div className="bg-[#FAF7F2] border border-brand-beige/20 p-4 rounded-2xl w-fit mx-auto">
                   <span className="text-[9px] uppercase tracking-widest text-brand-black/45 block mb-0.5">Your Secure Ticket ID</span>
                   <span className="font-mono text-xs text-brand-black font-bold font-semibold">{ticketId}</span>
                </div>
                <button
                  onClick={() => setFeedback('')}
                  className="py-3 px-6 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-cream font-sans-poppins tracking-widest text-[10px] uppercase font-bold rounded-full transition-colors"
                  id="logcheck-reset"
                >
                   Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-sans-poppins text-brand-gold font-bold">Patron Form &bull; Guaranteed response within 12 hours</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium">
                      Patron Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clarissa Westbrook"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                      id="contact-name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. clarissa@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                      id="contact-email"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. (555) 012-3456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                      id="contact-phone"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium">
                      Nature of Request
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black font-sans-poppins text-xs uppercase tracking-wider font-semibold focus:outline-none focus:border-brand-gold"
                      id="contact-subject-select"
                    >
                      <option value="Standard Inquiry">Standard Inquiry</option>
                      <option value="Wedding / Favors Custom Order">Wedding / Favors Custom Order</option>
                      <option value="Wholesale & Bulk Quoting">Wholesale & Bulk Quoting</option>
                      <option value="Gifting Concierge Help">Gifting Concierge Help</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium">
                    Please describe your design details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    maxLength={1000}
                    placeholder="Provide as much details as possible... e.g. dates of event, item selections, customized waxes needed..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all resize-none"
                    id="contact-message"
                  />
                  <span className="text-[10px] text-brand-black/40 text-right block mt-1">{1000 - message.length} characters left</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black disabled:bg-brand-beige/50 rounded-full font-sans-poppins text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow flex items-center justify-center space-x-2"
                  id="contact-submit"
                >
                  {loading ? (
                    <span className="animate-spin text-xs">🌀 Logging Ticket...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Transmit Message to Atelier</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* RIGHT: High-end support Cards (WhatsApp templates, Instagram, working hours) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WHATSAPP CARD (Simulated direct template!) */}
            <div className="bg-brand-cream border border-brand-beige/25 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center space-x-3 text-[#128C7E]">
                <MessageCircle className="h-6 w-6 stroke-[1.8] fill-current" />
                <h3 className="font-serif-playfair text-xl text-brand-black font-semibold">Direct WhatsApp Chat</h3>
              </div>
              <p className="text-xs text-brand-black/70 leading-relaxed font-light font-sans-inter">
                 Want instant verification or need to transmit image references of custom souvenir ribbon ribbons? Chat with our digital coordinator instantly via WhatsApp.
              </p>
              
              <div className="pt-2">
                <a
                  href="https://wa.me/15550199000?text=Hi%21%20I%20am%20interested%20in%20obtaining%20custom%20floral%20soap%20wedding%20souvenirs."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-[#FAF7F2] py-3.5 px-6 rounded-full font-sans-poppins text-[10px] font-bold uppercase tracking-widest transition-colors w-full justify-center shadow"
                  id="wa-concierge-trigger"
                >
                   Launch WhatsApp Concierge
                </a>
              </div>
            </div>

            {/* DIRECT LABELS AND DIRECTORY */}
            <div className="bg-[#FAF7F2] border border-brand-beige/25 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="space-y-4 font-sans-inter text-xs text-brand-black/70">
                <div className="flex items-start space-x-3.5 text-left">
                  <Mail className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif-playfair text-sm text-brand-black font-semibold">Atelier Email Contacts</h4>
                    <p className="font-light mt-0.5">patronage@lavishlathers.com</p>
                    <p className="font-light">wholesale@lavishlathers.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-left border-t border-brand-beige/20 pt-4">
                  <Instagram className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif-playfair text-sm text-brand-black font-semibold">Digital Journal Handle</h4>
                    <p className="font-light mt-0.5">@LavishLathers.Atelier</p>
                    <p className="text-[10px] text-brand-gold">Quote us in your unboxings to be featured!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-left border-t border-brand-beige/20 pt-4">
                  <MapPin className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif-playfair text-sm text-brand-black font-semibold">Cottage Workshop Location</h4>
                    <span className="font-light block mt-0.5">74 Pine Lattice Way</span>
                    <span className="font-light">Sisters, Oregon, United States</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-left border-t border-brand-beige/20 pt-4">
                  <Clock className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif-playfair text-sm text-brand-black font-semibold">Cottage Concierge Hours</h4>
                    <p className="font-light mt-0.5">Monday &ndash; Saturday: 10:00 AM &ndash; 6:00 PM EST</p>
                    <p className="font-light">Sunday: Closed for drying rituals</p>
                  </div>
                </div>
              </div>

              {/* Secure terms */}
              <div className="flex items-center space-x-2 text-[10px] text-brand-black/45 justify-center pt-2 border-t border-brand-beige/20 leading-normal">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                <span>Encrypted transmission validated</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
