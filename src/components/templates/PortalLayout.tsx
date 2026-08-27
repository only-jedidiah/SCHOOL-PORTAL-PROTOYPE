import React from 'react';
import { Header } from '../organisms/Header/Header';
import { ToastContainer } from '../molecules/Toast/ToastContainer';

export const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-base text-text-primary flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Header />
      <main className="max-w-7xl mx-auto w-full flex-grow p-4 sm:p-6 flex flex-col justify-center">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
};
