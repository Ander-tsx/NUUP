'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { formatMXN, formatDate } from '@/lib/utils';
import { Calendar, Users, Trophy, ExternalLink } from 'lucide-react';
import { sileo } from 'sileo';
import type { Event, Category, User as UserType } from '@/types';

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${params.id}`);
      setEvent(res.data);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const handleApply = async () => {
    setApplying(true);
    const promise = api.post(`/events/${params.id}/apply`);
    sileo.promise(promise, {
      loading: { title: 'Aplicando...' },
      success: { title: 'Aplicación enviada', description: 'Te has registrado al evento' },
      error: { title: 'Error al aplicar' },
    });
    try {
      await promise;
      fetchEvent();
    } catch {}
    setApplying(false);
  };

  const handleSubmitWork = async () => {
    if (!fileUrl) return;
    setSubmitting(true);
    const promise = api.post(`/events/${params.id}/submit`, {
      file_url: fileUrl,
      description,
    });
    sileo.promise(promise, {
      loading: { title: 'Enviando...' },
      success: { title: 'Entrega enviada', description: 'Tu trabajo fue registrado' },
      error: { title: 'Error al enviar' },
    });
    try {
      await promise;
      setShowSubmitModal(false);
      setFileUrl('');
      setDescription('');
      fetchEvent();
    } catch {}
    setSubmitting(false);
  };

  const handleSelectWinner = async (submissionId: string) => {
    const promise = api.post(`/events/${params.id}/winner`, { submission_id: submissionId });
    sileo.promise(promise, {
      loading: { title: 'Seleccionando ganador...' },
      success: { title: 'Ganador seleccionado', description: 'El premio será liberado' },
      error: { title: 'Error al seleccionar ganador' },
    });
    try {
      await promise;
      fetchEvent();
    } catch {}
  };

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

  if (!event) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="pt-14 min-h-screen bg-zinc-100 flex items-center justify-center">
          <p className="text-zinc-500">Evento no encontrado</p>
        </div>
      </ProtectedRoute>
    );
  }

  const categoryName = typeof event.category_id === 'object' ? (event.category_id as Category).name : 'General';
  const recruiterName = typeof event.recruiter_id === 'object' ? (event.recruiter_id as UserType).username : 'Reclutador';
  const isOwner = typeof event.recruiter_id === 'object'
    ? (event.recruiter_id as UserType)._id === user?._id
    : event.recruiter_id === user?._id;

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Main column */}
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                    {categoryName}
                  </span>
                  <Badge variant={getStatusVariant(event.status)}>{undefined}</Badge>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-3">
                  {event.title}
                </h1>
                <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-2">
                  Premio
                </p>
                <p className="text-2xl font-bold text-zinc-900 mb-4">
                  {formatMXN(event.prize_amount)}
                </p>

                <div className="space-y-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Cierre: {formatDate(event.deadline_submission)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-zinc-400" />
                    <span>{event.max_winners} ganador{event.max_winners > 1 ? 'es' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span>Publicado por {recruiterName}</span>
                  </div>
                </div>

                <hr className="border-zinc-100 my-4" />

                {/* Actions */}
                {user?.role === 'freelancer' && event.status === 'active' && (
                  <div className="space-y-2">
                    <Button className="w-full" onClick={handleApply} loading={applying}>
                      Participar
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setShowSubmitModal(true)}
                    >
                      Subir entrega
                    </Button>
                  </div>
                )}

                {isOwner && event.soroban_event_id && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${event.soroban_event_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#81DA47] hover:underline mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Ver on-chain
                  </a>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Submit work modal */}
      <Modal open={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Subir entrega">
        <div className="space-y-4">
          <Input
            label="URL del archivo"
            placeholder="https://drive.google.com/..."
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
          <Textarea
            label="Descripción"
            placeholder="Describe tu entrega..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button className="w-full" onClick={handleSubmitWork} loading={submitting}>
            Enviar entrega
          </Button>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
