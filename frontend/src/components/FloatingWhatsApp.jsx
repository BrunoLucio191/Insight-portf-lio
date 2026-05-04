import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "../lib/data";

function FloatingWhatsApp() {
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 18 }}
      href={`https://wa.me/${CONTACT.whatsappPrimary}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 group"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"
      />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] hover:scale-110 transition-transform">
        <MessageCircle size={26} fill="currentColor" />
      </span>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-black text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
        Fale conosco
      </span>
    </motion.a>
  );
}

export default FloatingWhatsApp;
