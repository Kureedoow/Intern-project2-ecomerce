import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', text: '' }); // 'success' | 'error' | 'sending'

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'sending', text: 'Sending message...' });

    try {
      // FormSubmit allows direct email destination endpoints. 
      // First submission to rapidmaan1@gmail.com will receive an activation email from FormSubmit.
      const response = await fetch("https://formsubmit.co/ajax/rapidmaan1@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          _subject: `Exclusive Store: Contact Inquiry from ${formData.name}`
        })
      });

      const result = await response.json();
      if (response.ok && result.success === "true") {
        setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({ type: 'error', text: result.message || 'Something went wrong. Please check your setup and try again.' });
      }
    } catch (error) {
      console.error("Email submission error:", error);
      setStatus({ type: 'error', text: 'Failed to connect. Please check your internet connection and try again.' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-16 text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Contact</span>
        </nav>

        {status.text && (
          <div className={`mb-8 flex items-center gap-3 p-4 border rounded-xl ${
            status.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : status.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {status.type === 'success' && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
            {status.type === 'error' && <AlertCircle size={20} className="text-red-500 flex-shrink-0" />}
            {status.type === 'sending' && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary border-opacity-50 flex-shrink-0" />}
            <div>
              <p className="font-semibold text-sm">
                {status.type === 'success' && 'Message Sent!'}
                {status.type === 'error' && 'Error Sending Message'}
                {status.type === 'sending' && 'Sending...'}
              </p>
              <p className="text-xs">{status.text}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Info Panel */}
          <div className="w-full lg:w-1/3 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.05)] rounded border border-gray-100 p-8 sm:p-10">
            
            {/* Call To Us */}
            <div className="mb-10 pb-10 border-b border-gray-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <h3 className="font-medium text-lg">Call To Us</h3>
              </div>
              <p className="text-sm mb-4 text-gray-800">We are available 24/7, 7 days a week.</p>
              <p className="text-sm font-medium text-gray-800">Phone: +8801611112222</p>
            </div>

            {/* Write To Us */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <h3 className="font-medium text-lg">Write To US</h3>
              </div>
              <p className="text-sm mb-4 text-gray-800">Fill out our form and we will contact you within 24 hours.</p>
              <p className="text-sm font-medium text-gray-800 mb-4">Emails: customer@exclusive.com</p>
              <p className="text-sm font-medium text-gray-800">Emails: support@exclusive.com</p>
            </div>

          </div>

          {/* Form Panel */}
          <div className="w-full lg:w-2/3 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.05)] rounded border border-gray-100 p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name *" 
                  required
                  className="bg-[#F5F5F5] rounded py-3.5 px-4 flex-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email *" 
                  required
                  className="bg-[#F5F5F5] rounded py-3.5 px-4 flex-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone *" 
                  required
                  className="bg-[#F5F5F5] rounded py-3.5 px-4 flex-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message *" 
                required
                className="bg-[#F5F5F5] rounded py-4 px-4 flex-grow min-h-[200px] focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
              ></textarea>

              <div className="flex justify-end mt-auto">
                <button 
                  type="submit" 
                  disabled={status.type === 'sending'}
                  className={`px-12 py-4 rounded font-medium transition-colors ${
                    status.type === 'sending' 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-red-600'
                  }`}
                >
                  {status.type === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
