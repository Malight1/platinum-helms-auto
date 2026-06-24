import { MessageCircle } from "lucide-react";
import { useState } from "react";

export function FloatingWhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Replace with your actual WhatsApp business number (format: country code + number, no + or spaces)
  const phoneNumber = "17808840893";
  const message = "Hello! I'm interested in learning more about Platinum Helms vehicles.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
            Chat with us on WhatsApp
            <div className="absolute top-full right-4 -mt-1">
              <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        )}
        
        {/* Button */}
        <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
      </div>
    </a>
  );
}
