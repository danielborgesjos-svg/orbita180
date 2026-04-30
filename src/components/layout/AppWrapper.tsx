'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from './DashboardLayout';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
