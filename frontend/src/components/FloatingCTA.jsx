import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, Calendar } from 'lucide-react';
import { Button } from './ui/button';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCall = () => {
    window.location.href = 'tel:18008900428';
  };

  const handleWhatsApp = () => {
    // Note: Toll-free numbers don't work on WhatsApp
    // Opening contact form instead
    handleScheduleVisit();
  };

  const handleScheduleVisit = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300 border border-emerald-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">Connect With Us</h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {/* Call Button */}
            <button
              onClick={handleCall}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                <Phone className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Call Now (Toll-Free)</p>
                <p className="text-xs text-gray-500">1800 890 0428</p>
              </div>
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Enquire Now</p>
                <p className="text-xs text-gray-500">Fill contact form</p>
              </div>
            </button>

            {/* Schedule Visit Button */}
            <button
              onClick={handleScheduleVisit}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Calendar className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Site Visit</p>
                <p className="text-xs text-gray-500">Book your tour</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-2xl hover:shadow-emerald-600/50 transition-all duration-300 hover:scale-110 group relative"
      >
        {!isExpanded ? (
          <>
            <Phone className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </>
        ) : (
          <X className="w-6 h-6" />
        )}
      </button>

      {/* Tooltip */}
      {!isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Get in Touch
          <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default FloatingCTA;
