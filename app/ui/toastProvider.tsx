"use client";

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
  return <ToastContainer position="top-center" autoClose={10000} />;
};

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'success') {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
