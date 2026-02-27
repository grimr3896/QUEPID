import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { MobileNav } from '@/components/Navigation';

export default function Layout() {
  const location = useLocation();

  // Redirect root to chats
  if (location.pathname === '/') {
    return <Navigate to="/chats" replace />;
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-bg-primary text-text-primary">
      
      <main className="flex-1 flex flex-col relative h-full overflow-hidden pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
