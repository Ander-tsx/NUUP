'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { formatMXN } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import { Menu, X, LogOut } from 'lucide-react';
import api from '@/lib/api';

const freelancerLinks = [
  { href: '/events', label: 'Explorar eventos' },
  { href: '/projects', label: 'Mis proyectos' },
  { href: '/freelancers', label: 'Freelancers' },
  { href: '/wallet', label: 'Wallet' },
];

const recruiterLinks = [
  { href: '/events', label: 'Mis eventos' },
  { href: '/projects', label: 'Proyectos' },
  { href: '/freelancers', label: 'Buscar freelancers' },
  { href: '/wallet', label: 'Wallet' },
];

function HexLogo() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 0L19.5 5.5V16.5L10 22L0.5 16.5V5.5L10 0Z"
        fill="#81DA47"
      />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const links = user.role === 'recruiter' ? recruiterLinks : freelancerLinks;

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    router.push('/auth/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 bg-zinc-950 border-b border-white/5 z-40 flex items-center px-4">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 mr-8">
          <HexLogo />
          <span className="text-white font-semibold text-sm">ProofWork</span>
        </Link>

        {/* Center: Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-all duration-150 ${
                pathname.startsWith(link.href)
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Balance + Avatar + Logout */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <span className="text-white/60 text-xs">{formatMXN(0)}</span>
          <div className="relative">
            <Avatar name={user.username} size="sm" />
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#81DA47]" />
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile: Hamburger */}
        <button
          className="md:hidden ml-auto text-white/60 hover:text-white transition-all duration-150"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 bg-zinc-950 z-30 md:hidden">
          <div className="flex flex-col p-4 gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm transition-all duration-150 ${
                  pathname.startsWith(link.href)
                    ? 'text-white bg-white/5'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/5 my-2" />
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar name={user.username} size="sm" />
              <div>
                <p className="text-white text-sm">{user.username}</p>
                <p className="text-white/40 text-xs">{formatMXN(0)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto text-white/40 hover:text-white transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
