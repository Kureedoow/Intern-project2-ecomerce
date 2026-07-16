import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-16 text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Contact</span>
        </nav>

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
            <form className="flex flex-col h-full gap-8">
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name *" 
                  required
                  className="bg-[#F5F5F5] rounded py-3.5 px-4 flex-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                <input 
                  type="email" 
                  placeholder="Your Email *" 
                  required
                  className="bg-[#F5F5F5] rounded py-3.5 px-4 flex-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                <input 
                  type="tel" 
                  placeholder="Your Phone *" 
                  required
                  className="bg-[#F5F5F5] rounded py-3.5 px-4 flex-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <textarea 
                placeholder="Your Massage" 
                className="bg-[#F5F5F5] rounded py-4 px-4 flex-grow min-h-[200px] focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
              ></textarea>

              <div className="flex justify-end mt-auto">
                <button 
                  type="submit" 
                  className="bg-primary text-white px-12 py-4 rounded font-medium hover:bg-red-600 transition-colors"
                >
                  Send Massage
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
