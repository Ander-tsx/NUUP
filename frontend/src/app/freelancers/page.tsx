'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import FreelancerCard from '@/components/freelancers/FreelancerCard';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { Search, Users } from 'lucide-react';
import type { SearchFreelancer } from '@/types';

const SKILL_CATEGORIES = [
  'Todos', 'JavaScript', 'React', 'Node.js', 'Python', 'Diseño UX',
  'Diseño gráfico', 'Redacción', 'Marketing', 'Blockchain',
];

export default function FreelancersPage() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('Todos');
  const [minRep, setMinRep] = useState(0);
  const [freelancers, setFreelancers] = useState<SearchFreelancer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSkill !== 'Todos') params.set('skills', selectedSkill);
      if (minRep > 0) params.set('min_reputation', String(minRep));
      params.set('limit', '50');

      const res = await api.get(`/users/search/freelancers?${params.toString()}`);
      const data = res.data;
      setFreelancers(Array.isArray(data?.freelancers) ? data.freelancers : Array.isArray(data) ? data : []);
    } catch {
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSkill, minRep]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  // Client-side name filter (search is fast, no need for re-fetch)
  const filtered = freelancers.filter((f) => {
    if (!search) return true;
    const name = f.user_id?.username || '';
    const title = f.title || '';
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || title.toLowerCase().includes(q);
  });

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Buscar freelancers
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Encuentra talento por categoría y reputación on-chain
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-zinc-200 bg-white rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all duration-150"
              />
            </div>

            {/* Skill pills */}
            <div className="flex flex-wrap gap-2">
              {SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSkill(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    selectedSkill === cat
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Reputation slider */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                Reputación mín.
              </span>
              <input
                type="range"
                min={0}
                max={200}
                value={minRep}
                onChange={(e) => setMinRep(Number(e.target.value))}
                className="flex-1 accent-zinc-900"
              />
              <span className="text-sm font-semibold text-zinc-900 min-w-[40px] text-right">
                {minRep}
              </span>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Sin freelancers"
              description="No se encontraron freelancers con estos filtros."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((f) => (
                <FreelancerCard key={f._id} freelancer={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
