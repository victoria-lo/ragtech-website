"use client";

import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { HiX } from "react-icons/hi";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  title: string;
  backgroundColor?: string;
}

export default function QRModal({
  isOpen,
  onClose,
  value,
  title,
  backgroundColor = "#fda2a9",
}: QRModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* QR Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              duration: 0.6 
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full pointer-events-auto"
              style={{ backgroundColor: backgroundColor + "20" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-lg hover:scale-110 transition-transform"
                aria-label="Close QR code"
              >
                <HiX className="w-6 h-6 text-brownDark dark:text-brown" />
              </button>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center mb-6 text-white dark:text-white">
                {title}
              </h3>

              {/* QR Code */}
              <div className="bg-white p-6 rounded-2xl shadow-inner flex items-center justify-center">
                <QRCode
                  value={value}
                  size={220}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              {/* Instructions */}
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
                Scan with your phone camera to connect
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
