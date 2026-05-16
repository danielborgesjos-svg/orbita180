'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change
  }, [pathname]);

  React.useEffect(() => {
    const publicRoutes = ['/login', '/cadastro'];
    if (!isLoading && !user && !publicRoutes.includes(pathname)) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'startup_founder' && pathname !== '/startup/setup') {
      const checkSetup = async () => {
        const { getStartupByUserId } = await import('@/lib/actions/startup');
        const res = await getStartupByUserId(user.id);
        if (res.success && res.startup && !res.startup.cnpj) {
          router.push('/startup/setup');
        }
      };
      checkSetup();
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={40} color="#2563eb" className="spin" />
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Carregando plataforma...</p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } .spin{animation:spin 1s linear infinite}`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="main-wrapper">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="content-area">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
