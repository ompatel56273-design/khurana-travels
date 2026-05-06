'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { IoBus, IoLockClosedOutline, IoChevronBack } from 'react-icons/io5';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(username, password);
    if (success) router.push('/admin/dashboard');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center mb-4 shadow-lg shadow-red-600/20">
            <IoBus className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white font-['Outfit']">Admin Login</h1>
          <p className="text-sm text-neutral-400 mt-1">Sign in to manage Khurana Travels</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-5 shadow-2xl">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Enter username" 
              required 
              className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-300 placeholder:text-neutral-600 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              name="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter password" 
              required 
              className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-300 placeholder:text-neutral-600 focus:border-red-500"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          
          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-2 hover:shadow-[0_8px_30px_rgba(220,38,38,0.3)] transition-all duration-300 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <IoLockClosedOutline size={20} />
            )}
            Sign In
          </button>
          <p className="text-[10px] text-neutral-600 text-center pt-2">Protected admin area — Authorized personnel only</p>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
            <IoChevronBack />
            Back to the web site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
