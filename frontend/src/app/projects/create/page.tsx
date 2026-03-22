'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { sileo } from 'sileo';
import { formatXLM } from '@/lib/utils';
import { Briefcase, ArrowRight, Lock, Wallet, Zap } from 'lucide-react';

const projectSchema = z.object({
  freelancer_id: z.string().min(1, 'Freelancer requerido'),
  category_id: z.string().min(1, 'Categoría requerida'),
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  amount: z.coerce.number().min(1, 'Mínimo 1 XLM'),
  deadline: z.string().min(1, 'Deadline requerido'),
});
type ProjectForm = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  return (
    <Suspense>
      <CreateProjectContent />
    </Suspense>
  );
}

function CreateProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [xlmBalance, setXlmBalance] = useState<number | null>(null);

  useEffect(() => {
    // Cargar categorías
    api.get('/categories').then((res) => {
      const cats = res.data?.data ?? res.data;
      setCategories(Array.isArray(cats) ? cats : []);
    }).catch(() => {});

    // Cargar balance XLM on-chain real
    api.get('/wallets/balance')
      .then((res) => {
        // el endpoint devuelve balance_xlm o los on_chain_balances
        const b = res.data?.data ?? res.data;
        const xlm = b?.balance_xlm
          ?? b?.on_chain_balances?.find((x: { asset_type: string; balance: string }) => x.asset_type === 'native')?.balance
          ?? b?.balance_mxne  // fallback si el endpoint aún devuelve mxne
          ?? 0;
        setXlmBalance(parseFloat(String(xlm)));
      })
      .catch(() => setXlmBalance(0));
  }, []);

  const prefilledFreelancer = searchParams.get('freelancer_id') || '';

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: { freelancer_id: prefilledFreelancer },
  });

  const rawAmount = watch('amount');
  const amount = typeof rawAmount === 'string' ? parseFloat(rawAmount) || 0 : (rawAmount || 0);
  // 10% plataforma se descuenta al liberar, el reclutador deposita el total
  const commission = amount * 0.10;
  const freelancerReceives = amount - commission;
  const insufficient = xlmBalance !== null && amount > 0 && amount > xlmBalance;

  const onSubmit = async (data: ProjectForm) => {
    setLoading(true);
    const promise = api.post('/projects', {
      freelancer_id: data.freelancer_id,
      recruiter_id: user?._id,
      category_id: data.category_id,
      title: data.title,
      description: data.description,
      amount: Number(data.amount),
      deadline: data.deadline,
    });
    sileo.promise(promise, {
      loading: { title: 'Creando proyecto…', description: 'Enviando XLM al escrow on-chain' },
      success: { title: 'Proyecto creado', description: 'XLM en escrow — propuesta enviada al freelancer' },
      error: { title: 'Error al crear proyecto' },
    });
    try {
      const res = await promise;
      const projectId = res.data?.data?.project?._id ?? res.data?._id;
      if (projectId) router.push(`/projects/${projectId}`);
    } catch { }
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="recruiter">
      <Navbar />
      <div className="pt-14 min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="glow-orb w-[500px] h-[500px] -top-32 -left-32 opacity-[0.07]" style={{ background: '#818cf8' }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <div className="animate-fade-up mb-8">
            <p className="text-[10.5px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-3)' }}>
              Contrato privado · Stellar XLM
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Nuevo proyecto</h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-2)' }}>
              El monto en XLM queda en escrow on-chain hasta que apruebes la entrega
            </p>
          </div>

          {/* XLM Balance hint */}
          {xlmBalance !== null && (
            <div
              className="animate-fade-up flex items-center gap-2.5 mb-5 px-3.5 py-2.5 rounded-xl text-xs"
              style={xlmBalance < 1 ? {
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                color: 'rgba(248,113,113,0.9)',
              } : {
                background: 'rgba(33,133,213,0.07)',
                border: '1px solid rgba(33,133,213,0.18)',
                color: 'var(--text-2)',
              }}
            >
              <Wallet className="w-3.5 h-3.5 shrink-0" />
              <span>
                Saldo XLM on-chain: <strong className="text-white">{formatXLM(xlmBalance)}</strong>
                {xlmBalance < 1 && ' — Necesitas XLM en tu wallet Stellar para crear proyectos'}
              </span>
            </div>
          )}

          <div className="animate-fade-up delay-100 rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="ID del Freelancer"
                placeholder="MongoDB ID del freelancer"
                error={errors.freelancer_id?.message}
                {...register('freelancer_id')}
              />
              <Select
                label="Categoría"
                placeholder="Selecciona una categoría"
                options={categories.map((c) => ({ value: c._id, label: c.name }))}
                error={errors.category_id?.message}
                {...register('category_id')}
              />
              <Input
                label="Título del proyecto"
                placeholder="Ej: Rediseño de landing page"
                error={errors.title?.message}
                {...register('title')}
              />
              <Textarea
                label="Descripción"
                placeholder="Describe el alcance, entregables y requisitos…"
                error={errors.description?.message}
                {...register('description')}
              />
              <div>
                <Input
                  label="Monto del proyecto (XLM)"
                  type="number"
                  placeholder="10"
                  error={errors.amount?.message}
                  {...register('amount')}
                />

                {/* Amount summary — escrow only */}
                {amount > 0 && (
                  <div
                    className="mt-2 rounded-xl px-4 py-3 text-sm animate-fade-up"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2" style={{ color: 'var(--text-2)' }}>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Se deposita en escrow</span>
                      </div>
                      <span
                        className="font-bold tabular-nums"
                        style={{ color: insufficient ? '#f87171' : '#4ade80' }}
                      >
                        {formatXLM(amount)}
                        {insufficient && <span className="text-[10px] ml-1.5 font-normal text-[#f87171]">saldo insuficiente</span>}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Deadline"
                type="date"
                error={errors.deadline?.message}
                {...register('deadline')}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading} disabled={insufficient || amount <= 0}>
                  <Briefcase className="w-4 h-4" /> Enviar propuesta <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button variant="secondary" type="button" onClick={() => router.back()}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
