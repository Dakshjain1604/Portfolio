"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X, Sparkles } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

function Toast({ message, type = "info", onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="text-green-400" size={18} />,
    error: <AlertCircle className="text-red-400" size={18} />,
    info: <Info className="text-blue-400" size={18} />,
  };

  const colors = {
    success: "border-green-500/30 bg-green-500/10",
    error: "border-red-500/30 bg-red-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[type]} backdrop-blur-sm shadow-lg`}
    >
      {icons[type]}
      <span className="text-sm text-white">{message}</span>
      <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" | "info" }>>([]);

  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      setToasts((prev) => [...prev, { id: Date.now(), ...e.detail }]);
    };

    window.addEventListener("showToast" as never, handleToast);
    return () => window.removeEventListener("showToast" as never, handleToast);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function showNotification(message: string, type: "success" | "error" | "info" = "info") {
  window.dispatchEvent(new CustomEvent("showToast", { detail: { message, type } }));
}

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-[90] p-4"
    >
      <div className="max-w-4xl mx-auto glass-card rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Sparkles size={20} className="text-cyan-400" />
          </div>
          <p className="text-sm text-neutral-300">
            This website uses cookies to enhance your experience. By continuing, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <motion.button
            onClick={accept}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Accept
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
