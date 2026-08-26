import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = '923172072623';
  const defaultMessage = encodeURIComponent(
    'Hi The Aesthetic Palette! 🌸 I would like to inquire about your handcrafted crochet items and custom paintings.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="WhatsApp Studio Support" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-float transition-all duration-300 hover:scale-105 active:scale-95"
        title="Chat on WhatsApp (+92 317 2072623)"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
        </div>
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
};
