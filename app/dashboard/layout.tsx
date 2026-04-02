'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut, Shield } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the secret half-key from memory
    sessionStorage.removeItem('vault_key_fragment');
    // Clear the auth cookie
    Cookies.remove('auth_session');
    // Kick back to landing page
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-bold tracking-tight uppercase text-sm">System Management Console</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}