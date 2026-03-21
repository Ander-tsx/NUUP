'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import FreelancerCard from '@/components/freelancers/FreelancerCard';
import PendingBanner from '@/components/ui/PendingBanner';
import { Search } from 'lucide-react';

// No search endpoint exists — using mock data
const mockFreelancers = [
  {
    _id: 'fl1',
    username: 'Ana López',
    title: 'Desarrolladora full-stack',
    reputations: [
      { category: 'Desarrollo web', score: 120 },
      { category: 'Diseño UX', score: 45 },
    ],
  },
  {
    _id: 'fl2',
    username: 'Miguel Torres',
    title: 'Redactor creativo',
    reputations: [
      { category: 'Redacción', score: 95 },
      { category: 'Copywriting', score: 62 },
    ],
  },
  {
    _id: 'fl3',
    username: 'Laura Vega',
    title: 'Ilustradora digital',
    reputations: [
      { category: 'Ilustración', score: 78 },
      { category: 'Diseño gráfico', score: 54 },
    ],
  },
  {
    _id: 'fl4',
    username: 'Carlos Méndez',
    title: 'Diseñador gráfico senior',
    reputations: [
      { category: 'Diseño gráfico', score: 85 },
      { category: 'Ilustración', score: 42 },
    ],
  },
];

const categories = ['Todos', 'Desarrollo web', 'Diseño gráfico', 'Redacción', 'Ilustración', 'Copywriting', 'Diseño UX'];

export default function FreelancersPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [minRep, setMinRep] = useState(0);

  const filtered = mockFreelancers.filter((f) => {
    const matchesSearch = f.username.toLowerCase().includes(search.toLowerCase()) ||
      f.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' ||
      f.reputations.some((r) => r.category === selectedCategory);
    const matchesRep = f.reputations.some((r) => r.score >= minRep);
    return matchesSearch && matchesCategory && matchesRep;
  });

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <PendingBanner />

          <div className="mt-6 mb-6">
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

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    selectedCategory === cat
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((f) => (
              <FreelancerCard key={f._id} freelancer={f} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-zinc-400">No se encontraron resultados</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
