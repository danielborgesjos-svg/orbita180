'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from './DashboardLayout';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const publicRoutes = ['/login', '/cadastro'];
  
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
