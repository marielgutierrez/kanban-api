import React, { createContext, useState, useCallback, useRef } from 'react';
import { Toast } from '../../components/common/Toast';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast({ message: '', type: 'info' });
  }, []);

  const showToast = useCallback((message, type = 'info', durationMs = 4000) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ message, type });

    timerRef.current = setTimeout(() => {
      setToast({ message: '', type: 'info' });
      timerRef.current = null;
    }, durationMs);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    </ToastContext.Provider>
  );
};
