"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "./ui/Toast";

// Toast Context
const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

// Toast Context Hook
export const useToast = () => useContext(ToastContext);

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info", // "success", "error", "warning", "info"
  });

  // Toast'ı göster
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });

    // Belirtilen süre sonunda toast'ı kapat
    if (duration > 0) {
      setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, []);

  // Toast'ı gizle
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider; 