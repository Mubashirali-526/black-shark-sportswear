"use client";

import { motion } from "framer-motion";
import { whatsappLink } from "@/lib/data";
import { Whatsapp } from "./social-icons";

export function WhatsappFab() {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center">
      {/* Left pill */}
      <motion.a
        href={whatsappLink(
          "Hi Black Shark! I'm interested in your custom sportswear. Can you help?"
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-[12px] font-semibold text-ink shadow-[0_8px_24px_rgba(200,162,74,0.4)]"
      >
        <Whatsapp size={14} />
        <span>Chat on WhatsApp</span>
        <span className="ml-1 text-[10px] opacity-70">✕</span>
      </motion.a>

      {/* Right big icon circle */}
      <motion.a
        href={whatsappLink(
          "Hi Black Shark! I'm interested in your custom sportswear. Can you help?"
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="-ml-2 grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink text-accent shadow-[0_4px_20px_rgba(0,0,0,0.55)] ring-2 ring-accent/25"
      >
        <Whatsapp size={34} />
      </motion.a>
    </div>
  );
}