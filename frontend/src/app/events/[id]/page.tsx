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
import { Calendar, Users, Trophy, ExternalLink, CheckCircle } from 'lucide-react';
import { sileo } from 'sileo';
import type { Event, EventSubmission, EventParticipant, Category, User as UserType } from '@/types';

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');

  const fetchAll = async () => {
    try {
      const [eventRes, partRes, subRes] = await Promise.allSettled([
        api.get(`/events/${params.id}`),
        api.get(`/events/${params.id}/participants`),
        api.get(`/events/${params.id}/submissions`),
      ]);
      if (eventRes.status === 'fulfilled') setEvent(eventRes.value.data);
      if (partRes.status === 'fulfilled') setParticipants(Array.isArray(partRes.value.data) ? partRes.value.data : []);
      if (subRes.status === 'fulfilled') setSubmissions(Array.isArray(subRes.value.data) ? subRes.value.data : []);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
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
      fetchAll();
    } catch { }
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
      fetchAll();
    } catch { }
    setSubmitting(false);
  };

  const handleSelectWinner = async (submissionId: string) => {
    const promise = api.post(`/events/${params.id}/winner`, { submission_ids: [submissionId] });
    sileo.promise(promise, {
      loading: { title: 'Seleccionando ganador...' },
      success: { title: 'Ganador seleccionado', description: 'El premio será liberado' },
      error: { title: 'Error al seleccionar ganador' },
    });
    try {
      await promise;
      fetchAll();
    } catch { }
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

  // Has this user already applied?
  const alreadyApplied = participants.some((p) => {
    const fId = typeof p.freelancer_id === 'object' ? (p.freelancer_id as UserType)._id : p.freelancer_id;
    return fId === user?._id;
  });

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

              {/* Participants (visible to owner) */}
              {isOwner && participants.length > 0 && (
                <Card>
                  <h2 className="text-base font-semibold text-zinc-900 mb-3">
                    Participantes ({participants.length})
                  </h2>
                  <div className="space-y-2">
                    {participants.map((p) => {
                      const pUser = typeof p.freelancer_id === 'object' ? p.freelancer_id as UserType : null;
                      const username = pUser?.username || 'Freelancer';
                      return (
                        <div key={p._id} className="flex items-center justify-between p-2 rounded-lg border border-zinc-100">
                          <div className="flex items-center gap-2">
                            <Avatar name={username} size="sm" />
                            <span className="text-sm text-zinc-700">{username}</span>
                          </div>
                          <Badge variant={p.status === 'winner' ? 'completed' : p.status === 'submitted' ? 'review' : 'pending'}>
                            {p.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Submissions — owner sees with "Select winner" button */}
              {(isOwner || user?.role === 'freelancer') && submissions.length > 0 && (
                <Card>
                  <h2 className="text-base font-semibold text-zinc-900 mb-3">
                    Entregas ({submissions.length})
                  </h2>
                  <div className="space-y-3">
                    {submissions.map((sub) => {
                      const subUser = typeof sub.freelancer_id === 'object' ? sub.freelancer_id as UserType : null;
                      const username = subUser?.username || 'Freelancer';
                      return (
                        <div key={sub._id} className="p-3 rounded-lg border border-zinc-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar name={username} size="sm" />
                              <span className="text-sm font-medium text-zinc-700">{username}</span>
                            </div>
                            {sub.is_winner && (
                              <div className="flex items-center gap-1 text-xs text-[#81DA47] font-semibold">
                                <Trophy className="w-3.5 h-3.5" /> Ganador
                              </div>
                            )}
                          </div>
                          {sub.description && (
                            <p className="text-xs text-zinc-500 mb-2">{sub.description}</p>
                          )}
                          {sub.file_url && (
                            <a
                              href={sub.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#81DA47] hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" /> Ver entrega
                            </a>
                          )}
                          {isOwner && event.status === 'active' && !sub.is_winner && (
                            <div className="mt-2">
                              <Button
                                variant="secondary"
                                className="w-full text-xs"
                                onClick={() => handleSelectWinner(sub._id)}
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Seleccionar ganador
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-2">
                  Premio
                </p>
                <p className="text-2xl font-bold text-zinc-200 mb-4">
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
                    <span>{participants.length} participante{participants.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Por:</span>
                    <span>{recruiterName}</span>
                  </div>
                </div>

                <hr className="border-zinc-100 my-4" />

                {/* Freelancer actions */}
                {user?.role === 'freelancer' && event.status === 'active' && (
                  <div className="space-y-2">
                    {!alreadyApplied ? (
                      <Button className="w-full" onClick={handleApply} loading={applying}>
                        Participar
                      </Button>
                    ) : (
                      <p className="text-xs text-center text-zinc-500 py-1">
                        ✓ Ya estás participando
                      </p>
                    )}
                    {alreadyApplied && (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setShowSubmitModal(true)}
                      >
                        Subir entrega
                      </Button>
                    )}
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
