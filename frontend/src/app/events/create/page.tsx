'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { formatMXN } from '@/lib/utils';
import { sileo } from 'sileo';
import { AlertCircle } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(20, 'Mínimo 20 caracteres'),
  category_id: z.string().min(1, 'Categoría requerida'),
  prize_amount: z.coerce.number().min(100, 'Mínimo $100 MXN'),
  max_winners: z.coerce.number().min(1, 'Al menos 1 ganador'),
  deadline_submission: z.string().min(1, 'Fecha requerida'),
  deadline_selection: z.string().min(1, 'Fecha requerida'),
});

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [backendError, setBackendError] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
    api.get('/wallets/balance')
      .then((res) => setWalletBalance(res.data.balance_mxne ?? 0))
      .catch(() => setWalletBalance(0));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: { max_winners: 1 },
  });

  const prizeAmount = watch('prize_amount');

  const onSubmit = async (data: EventForm) => {
    setBackendError('');
    setLoading(true);
    try {
      const res = await api.post('/events', { ...data, status: 'active' });
      sileo.success({ title: 'Evento creado', description: 'Tu evento está activo' });
      router.push(`/events/${res.data._id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Error al crear el evento';
      setBackendError(msg);
      sileo.error({ title: 'Error', description: msg });
    }
    setLoading(false);
  };


  return (
    <ProtectedRoute requiredRole="recruiter">
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
            Crear evento
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            Publica un reto de competencia para freelancers
          </p>

          <Card>
            {/* Wallet balance hint */}
            {walletBalance !== null && (
              <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-xs ${
                walletBalance === 0
                  ? 'bg-red-50 text-red-600'
                  : 'bg-zinc-50 text-zinc-500'
              }`}>
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Saldo disponible: <strong>{formatMXN(walletBalance)}</strong> MXNe
                  {walletBalance === 0 && ' — Deposita fondos antes de crear un evento'}
                </span>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Título del evento"
                placeholder="Ej: Diseña el logo de nuestra startup fintech"
                error={errors.title?.message}
                {...register('title')}
              />
              <Textarea
                label="Descripción"
                placeholder="Describe los requisitos, entregables y criterios de evaluación..."
                error={errors.description?.message}
                {...register('description')}
              />
              <Select
                label="Categoría"
                placeholder="Selecciona una categoría"
                options={categories.map((c) => ({ value: c._id, label: c.name }))}
                error={errors.category_id?.message}
                {...register('category_id')}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Premio (MXN)"
                    type="number"
                    placeholder="2500"
                    error={errors.prize_amount?.message}
                    {...register('prize_amount')}
                  />
                  {prizeAmount > 0 && walletBalance !== null && prizeAmount > walletBalance && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Saldo insuficiente (tienes {formatMXN(walletBalance)})
                    </p>
                  )}
                  {prizeAmount > 0 && (walletBalance === null || prizeAmount <= walletBalance) && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Se bloqueará {formatMXN(prizeAmount)} en escrow Soroban
                    </p>
                  )}
                </div>
                <Input
                  label="Máx. ganadores"
                  type="number"
                  placeholder="1"
                  error={errors.max_winners?.message}
                  {...register('max_winners')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cierre de entregas"
                  type="date"
                  error={errors.deadline_submission?.message}
                  {...register('deadline_submission')}
                />
                <Input
                  label="Fecha de selección"
                  type="date"
                  error={errors.deadline_selection?.message}
                  {...register('deadline_selection')}
                />
              </div>
              {/* Backend error */}
              {backendError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{backendError}</span>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading}>
                  Publicar evento
                </Button>
                <Button variant="secondary" type="button" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
