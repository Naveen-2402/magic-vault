'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import SessionTimeout from '@/components/SessionTimeout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    sessionStorage.removeItem('vault_key_fragment');
    await fetch('/api/auth/logout', { method: 'POST' }); // Server clears the cookie
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
      {/* Silent Session Guard - Monitors inactivity */}
      <SessionTimeout />

      <header className="bg-slate-900 text-white px-8 py-3.5 flex justify-between items-center shadow-2xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded-lg">
            <Image 
              src="/logo.png" 
              alt="Nexus Logo" 
              width={20} 
              height={20} 
              className="brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-[0.2em] uppercase text-[10px] leading-tight">
              Nexus <span className="font-light opacity-60">Systems</span>
            </span>
            <span className="text-[8px] text-blue-400 font-mono uppercase tracking-tighter opacity-80">
              Management Console v4.0.2
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="group flex items-center gap-2.5 text-[10px] font-bold text-slate-400 hover:text-red-400 transition-all uppercase tracking-[0.15em]"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Terminate Session
        </button>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full animate-in fade-in duration-700">
        {children}
      </main>

      <footer className="py-6 text-center border-t border-slate-100">
        <p className="text-[10px] text-slate-300 uppercase tracking-widest font-medium">
          Secure Environment // Authorization Required // © {new Date().getFullYear()} Nexus Systems Int.
        </p>
      </footer>
    </div>
  );
}