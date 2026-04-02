'use client';

import { useEffect, useState, use } from 'react';
import { Eye, EyeOff, Plus, Trash2, ArrowLeft, ShieldCheck, Copy, Check, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function PasswordListPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = use(params);
  const [entries, setEntries] = useState<any[]>([]);
  const [showPass, setShowPass] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', user: '', pass: '', desc: '' });

  // Retrieve the 4-digit PIN stored during the "Secret Gate" login
  const pin = typeof window !== 'undefined' ? sessionStorage.getItem('vault_key_fragment') : '';

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/passwords?categoryId=${categoryId}`, {
        headers: { 'x-session-pin': pin || '' }
      });
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load vault:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/passwords', {
      method: 'POST',
      body: JSON.stringify({ 
        categoryId, 
        name: formData.name, 
        username: formData.user, 
        password: formData.pass, 
        desc: formData.desc, 
        pin 
      }),
    });

    if (res.ok) {
      setFormData({ name: '', user: '', pass: '', desc: '' });
      setFormOpen(false);
      fetchData();
    }
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently purge this record?")) return;
    await fetch(`/api/passwords/${id}`, { method: 'DELETE' });
    fetchData();
  };

  useEffect(() => { 
    if (pin) fetchData(); 
  }, [categoryId, pin]);

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directories
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            <ShieldCheck className="w-3 h-3" /> End-to-End Encrypted
          </div>
        </div>

        {/* Title Section */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Secure Assets</span>
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Vault Management</h1>
          </div>
          <button 
            onClick={() => setFormOpen(!formOpen)} 
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> New Entry
          </button>
        </div>

        {/* Add Entry Form */}
        {formOpen && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-5">Create New Record</p>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-zinc-500 font-bold uppercase mb-1.5 block">Service Name *</label>
                  <input type="text" placeholder="e.g. AWS Console" required className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white outline-none focus:ring-2 focus:ring-zinc-900/5 transition" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 font-bold uppercase mb-1.5 block">Identifier / User</label>
                  <input type="text" placeholder="admin@nexus.com" className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white outline-none focus:ring-2 focus:ring-zinc-900/5 transition" value={formData.user} onChange={e => setFormData({ ...formData, user: e.target.value })} />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 font-bold uppercase mb-1.5 block">Secret Code *</label>
                  <input type="password" placeholder="••••••••" required className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white outline-none focus:ring-2 focus:ring-zinc-900/5 transition" value={formData.pass} onChange={e => setFormData({ ...formData, pass: e.target.value })} />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 font-bold uppercase mb-1.5 block">Internal Note</label>
                  <input type="text" placeholder="Server rack #4" className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white outline-none focus:ring-2 focus:ring-zinc-900/5 transition" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-zinc-800 transition shadow-md">Encrypt & Save</button>
                <button type="button" onClick={() => setFormOpen(false)} className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4 py-3 hover:text-zinc-600 transition">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Credentials List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-zinc-300">
               <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin mb-4" />
               <p className="text-xs font-medium uppercase tracking-widest">Unlocking Vault...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl">
              <p className="text-zinc-400 text-sm font-medium">This directory is empty.</p>
            </div>
          ) : entries.map((entry) => (
            <div key={entry.id} className="group bg-white border border-zinc-100 rounded-2xl p-1 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
              {/* Icon Letter */}
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-lg font-bold shrink-0 ml-1">
                {entry.name?.[0] || '?'}
              </div>
              
              {/* Name & User */}
              <div className="flex-1 min-w-0 py-2">
                <p className="text-sm font-bold text-zinc-900 truncate">{entry.name}</p>
                <p className="text-[11px] font-medium text-zinc-400 truncate tracking-wide">{entry.username || 'No Identifier'}</p>
              </div>

              {/* Password & Copy Group */}
              <div className="flex items-center gap-1.5 bg-zinc-50 rounded-xl p-1.5 border border-zinc-100">
                <input 
                  type={showPass === entry.id ? 'text' : 'password'} 
                  readOnly 
                  value={entry.password}
                  className="bg-transparent text-xs font-mono font-bold text-zinc-700 w-24 px-2 outline-none" 
                />
                <button onClick={() => setShowPass(showPass === entry.id ? null : entry.id)} className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors">
                  {showPass === entry.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <div className="w-[1px] h-4 bg-zinc-200 mx-0.5" />
                <button onClick={() => handleCopy(entry.id, entry.password)} className="p-1.5 text-zinc-400 hover:text-emerald-600 transition-colors">
                  {copied === entry.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Description & Delete */}
              <div className="flex items-center gap-4 pr-4">
                {entry.description && (
                  <span className="hidden lg:block text-[10px] font-bold text-zinc-300 uppercase tracking-tighter bg-zinc-50 px-2 py-1 rounded">
                    {entry.description}
                  </span>
                )}
                <button onClick={() => handleDelete(entry.id)} className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}