"use client";

import React from 'react';
import WelcomeModal from '../components/WelcomeModal';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WelcomeModal />
    </>
  );
}