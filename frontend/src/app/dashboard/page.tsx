'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import ReputationBar from '@/components/ui/ReputationBar';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import PendingBanner from '@/components/ui/PendingBanner';
import { formatMXN, formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import type { Event, Project, Reputation, Wallet } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reputations, setReputations] = useState<Reputation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [walletRes, eventsRes, projectsRes] = await Promise.allSettled([
          api.get('/wallets'),
          api.get('/events'),
          api.get('/projects'),
        ]);

        if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data);
        if (eventsRes.status === 'fulfilled') {
          const eData = eventsRes.value.data;
          setEvents((Array.isArray(eData) ? eData : []).slice(0, 3));
        }
        if (projectsRes.status === 'fulfilled') {
          const pData = projectsRes.value.data;
          setProjects((Array.isArray(pData) ? pData : []).slice(0, 3));
        }

        if (user) {
          try {
            const repRes = await api.get(`/reputation/${user._id}`);
            setReputations(Array.isArray(repRes.data) ? repRes.data : []);
          } catch {}
        }
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="pt-14 min-h-screen bg-zinc-100 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <PendingBanner />

          {/* Welcome */}
          <Card className="mt-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Hola, {user?.username} 👋
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  {user?.role === 'recruiter' ? 'Panel de reclutador' : 'Panel de freelancer'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                  Saldo
                </p>
                <p className="text-2xl font-bold text-zinc-900">
                  {formatMXN(wallet?.balance_mxne || 0)}
                </p>
              </div>
            </div>
          </Card>

          {/* Reputation (freelancer) */}
          {user?.role === 'freelancer' && reputations.length > 0 && (
            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">Tu reputación</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reputations.map((rep) => {
                  const catName = typeof rep.category_id === 'object'
                    ? (rep.category_id as { name: string }).name
                    : 'Categoría';
                  return <ReputationBar key={rep._id} label={catName} score={rep.score} />;
                })}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {user?.role === 'recruiter' ? 'Eventos publicados' : 'Eventos recientes'}
                </h2>
                <button
                  onClick={() => router.push('/events')}
                  className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1 transition-all duration-150"
                >
                  Ver todos <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((e) => (
                    <div
                      key={e._id}
                      onClick={() => router.push(`/events/${e._id}`)}
                      className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:border-zinc-300 cursor-pointer transition-all duration-150"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 truncate">{e.title}</p>
                        <p className="text-xs text-zinc-400">{formatDate(e.deadline_submission)}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-sm font-semibold text-zinc-900">{formatMXN(e.prize_amount)}</span>
                        <Badge variant={getStatusVariant(e.status)}>{undefined}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 text-center py-4">No hay eventos aún</p>
              )}
            </Card>

            {/* Projects */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900">Proyectos activos</h2>
                <button
                  onClick={() => router.push('/projects')}
                  className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1 transition-all duration-150"
                >
                  Ver todos <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => router.push(`/projects/${p._id}`)}
                      className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:border-zinc-300 cursor-pointer transition-all duration-150"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 truncate">{p.title}</p>
                        <p className="text-xs text-zinc-400">{formatMXN(p.amount)}</p>
                      </div>
                      <Badge variant={getStatusVariant(p.status)}>{undefined}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 text-center py-4">No hay proyectos aún</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
