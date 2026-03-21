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

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
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
    setLoading(true);
    const promise = api.post('/events', { ...data, status: 'active' });
    sileo.promise(promise, {
      loading: { title: 'Creando evento...' },
      success: { title: 'Evento creado', description: 'Tu evento está activo' },
      error: { title: 'Error al crear evento' },
    });
    try {
      const res = await promise;
      router.push(`/events/${res.data._id}`);
    } catch {}
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
                  {prizeAmount > 0 && (
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
