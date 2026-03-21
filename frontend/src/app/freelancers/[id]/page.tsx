'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import ReputationBar from '@/components/ui/ReputationBar';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { truncateAddress } from '@/lib/utils';
import { ExternalLink, Briefcase } from 'lucide-react';
import type { UserWithProfile, FreelancerProfile, Reputation } from '@/types';

export default function FreelancerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [data, setData] = useState<UserWithProfile | null>(null);
  const [reputations, setReputations] = useState<Reputation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stellarAddress, setStellarAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, repRes] = await Promise.all([
          api.get(`/users/${params.id}`),
          api.get(`/reputation/${params.id}`),
        ]);
        setData(userRes.data);
        setReputations(repRes.data);

        // Try to get wallet for stellar address
        try {
          const walletRes = await api.get('/wallets');
          setStellarAddress(walletRes.data.stellar_address || '');
        } catch {
          setStellarAddress('GBCMOCQAXS5GHPBZLSEDQN7AMXHSX7V6YUPOT53KPWRLED5PQFG4TCY');
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

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

  if (!data) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="pt-14 min-h-screen bg-zinc-100 flex items-center justify-center">
          <p className="text-zinc-500">Usuario no encontrado</p>
        </div>
      </ProtectedRoute>
    );
  }

  const profile = data.profile as FreelancerProfile | null;
  const fakeAddress = stellarAddress || 'GBCMOCQAXS5GHPBZLSEDQN7AMXHSX7V6YUPOT53KPWRLED5PQFG4TCY';

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Main */}
            <div className="space-y-6">
              <Card>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar name={data.user.username} size="xl" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        {data.user.username}
                      </h1>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#81DA47] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#81DA47]" />
                      </span>
                    </div>
                    {profile && (
                      <p className="text-sm text-zinc-500 mt-1">{profile.title}</p>
                    )}
                    <p className="font-mono text-xs text-zinc-400 mt-2">
                      {truncateAddress(fakeAddress, 8)}
                    </p>
                    <a
                      href={`https://stellar.expert/explorer/testnet/account/${fakeAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#81DA47] hover:underline mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ver on-chain
                    </a>
                  </div>
                </div>

                {profile?.description && (
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                    {profile.description}
                  </p>
                )}

                {profile?.skills && profile.skills.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-2">
                      Habilidades
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-md text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Reputation */}
              <Card>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Reputación</h2>
                {reputations.length > 0 ? (
                  <div className="space-y-4">
                    {reputations.map((rep) => {
                      const catName = typeof rep.category_id === 'object'
                        ? (rep.category_id as { name: string }).name
                        : 'Categoría';
                      return (
                        <ReputationBar
                          key={rep._id}
                          label={catName}
                          score={rep.score}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">
                    Este freelancer aún no tiene reputación registrada.
                  </p>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-3">
                  Información
                </p>
                <div className="space-y-3 text-sm text-zinc-500">
                  {profile && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-zinc-400" />
                      <span className="capitalize">{profile.experience_level}</span>
                    </div>
                  )}
                  {profile?.availability && (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 flex items-center justify-center text-zinc-400 text-xs">⏱</span>
                      <span className="capitalize">{profile.availability}</span>
                    </div>
                  )}
                </div>

                {user?.role === 'recruiter' && (
                  <>
                    <hr className="border-zinc-100 my-4" />
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/projects/create?freelancer_id=${params.id}`)}
                    >
                      Contratar
                    </Button>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
