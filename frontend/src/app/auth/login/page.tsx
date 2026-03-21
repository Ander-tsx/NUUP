'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { sileo } from 'sileo';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

function HexLogo() {
  return (
    <svg width="32" height="36" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0L19.5 5.5V16.5L10 22L0.5 16.5V5.5L10 0Z" fill="#81DA47" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const promise = api.post('/auth/login', data);

    sileo.promise(promise, {
      loading: { title: 'Iniciando sesión...' },
      success: { title: 'Bienvenido', description: 'Sesión iniciada correctamente' },
      error: { title: 'Error al iniciar sesión' },
    });

    try {
      const res = await promise;
      setAuth(res.data);
      router.push('/dashboard');
    } catch {
      // handled by toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-zinc-100 p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <HexLogo />
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mt-4">
            ProofWork
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-zinc-900 font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
