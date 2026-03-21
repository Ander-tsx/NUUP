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
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { formatMXN } from '@/lib/utils';
import { sileo } from 'sileo';

const projectSchema = z.object({
  freelancer_id: z.string().min(1, 'Freelancer requerido'),
  category_id: z.string().min(1, 'Categoría requerida'),
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  amount: z.coerce.number().min(100, 'Mínimo $100 MXN'),
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

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const prefilledFreelancer = searchParams.get('freelancer_id') || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      freelancer_id: prefilledFreelancer,
    },
  });

  const amount = watch('amount') || 0;
  const guarantee = Math.round(amount * 0.15);
  const total = amount + guarantee;

  const onSubmit = async (data: ProjectForm) => {
    setLoading(true);
    const promise = api.post('/projects', {
      ...data,
      recruiter_id: user?._id,
      guarantee,
    });
    sileo.promise(promise, {
      loading: { title: 'Creando proyecto...' },
      success: { title: 'Proyecto creado', description: 'Propuesta enviada al freelancer' },
      error: { title: 'Error al crear proyecto' },
    });
    try {
      const res = await promise;
      router.push(`/projects/${res.data._id}`);
    } catch {}
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="recruiter">
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
            Nuevo proyecto
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            Crea un contrato 1:1 con un freelancer
          </p>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="ID del Freelancer"
                placeholder="ID del freelancer"
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
                placeholder="Describe el alcance, entregables y requisitos..."
                error={errors.description?.message}
                {...register('description')}
              />
              <Input
                label="Monto (MXN)"
                type="number"
                placeholder="3500"
                error={errors.amount?.message}
                {...register('amount')}
              />

              {/* Real-time calculation */}
              {amount > 0 && (
                <div className="bg-zinc-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-500">
                    <span>Monto</span>
                    <span>{formatMXN(amount)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Garantía (15%)</span>
                    <span>{formatMXN(guarantee)}</span>
                  </div>
                  <hr className="border-zinc-200" />
                  <div className="flex justify-between font-semibold text-zinc-900">
                    <span>Total a depositar</span>
                    <span>{formatMXN(total)}</span>
                  </div>
                </div>
              )}

              <Input
                label="Deadline"
                type="date"
                error={errors.deadline?.message}
                {...register('deadline')}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading}>
                  Enviar propuesta
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
