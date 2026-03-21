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

const registerSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['freelancer', 'recruiter'], { required_error: 'Selecciona un rol' }),
});

type RegisterForm = z.infer<typeof registerSchema>;

function HexLogo() {
  return (
    <svg width="32" height="36" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0L19.5 5.5V16.5L10 22L0.5 16.5V5.5L10 0Z" fill="#81DA47" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'freelancer' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);

    try {
      // Register
      const registerPromise = api.post('/auth/register', data);
      sileo.promise(registerPromise, {
        loading: { title: 'Creando cuenta...' },
        success: { title: 'Cuenta creada' },
        error: { title: 'Error al crear cuenta' },
      });
      await registerPromise;

      // Auto-login
      const loginRes = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      setAuth(loginRes.data);
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
          <p className="text-sm text-zinc-500 mt-1">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Toggle */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-1.5">
              Soy
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue('role', 'freelancer')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${
                  selectedRole === 'freelancer'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'recruiter')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${
                  selectedRole === 'recruiter'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                Reclutador
              </button>
            </div>
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
          </div>

          <Input
            label="Nombre de usuario"
            placeholder="tu_nombre"
            error={errors.username?.message}
            {...register('username')}
          />
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
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-zinc-900 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
