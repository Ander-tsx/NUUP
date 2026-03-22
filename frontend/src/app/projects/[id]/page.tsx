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
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ChatBox from '@/components/projects/ChatBox';
import { formatMXN, formatDate } from '@/lib/utils';
import { Calendar, DollarSign, Shield } from 'lucide-react';
import { sileo } from 'sileo';
import type { Project, User as UserType } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${params.id}`);
      setProject(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const updateStatus = async (status: string) => {
    setActionLoading(true);
    const promise = api.put(`/projects/${params.id}/status`, { status });
    sileo.promise(promise, {
      loading: { title: 'Actualizando...' },
      success: { title: 'Estado actualizado' },
      error: { title: 'Error' },
    });
    try {
      await promise;
      fetchProject();
    } catch {}
    setActionLoading(false);
  };

  const handleAccept = async () => {
    setActionLoading(true);
    const promise = api.post(`/projects/${params.id}/accept`);
    sileo.promise(promise, {
      loading: { title: 'Aceptando propuesta...' },
      success: { title: 'Propuesta aceptada', description: 'El proyecto está activo' },
      error: { title: 'Error al aceptar' },
    });
    try {
      await promise;
      fetchProject();
    } catch {}
    setActionLoading(false);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    const promise = api.post(`/projects/${params.id}/approve`);
    sileo.promise(promise, {
      loading: { title: 'Aprobando entrega...' },
      success: { title: 'Entrega aprobada', description: 'Pago liberado al freelancer' },
      error: { title: 'Error al aprobar' },
    });
    try {
      await promise;
      fetchProject();
    } catch {}
    setActionLoading(false);
  };

  const handleDeliver = async () => {
    if (!fileUrl) return;
    setActionLoading(true);
    const promise = api.post(`/projects/${params.id}/deliver`, { file_url: fileUrl, description });
    sileo.promise(promise, {
      loading: { title: 'Enviando entrega...' },
      success: { title: 'Entrega enviada' },
      error: { title: 'Error al entregar' },
    });
    try {
      await promise;
      setShowDeliverModal(false);
      fetchProject();
    } catch {}
    setActionLoading(false);
  };

  const handleDispute = async () => {
    setActionLoading(true);
    const promise = api.post('/disputes', {
      project_id: params.id,
      reason: 'Disputa abierta por el freelancer',
      description: 'El freelancer ha solicitado revisión del proyecto',
    });
    sileo.promise(promise, {
      loading: { title: 'Abriendo disputa...' },
      success: { title: 'Disputa abierta' },
      error: { title: 'Error' },
    });
    try {
      await promise;
      fetchProject();
    } catch {}
    setActionLoading(false);
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

  if (!project) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="pt-14 min-h-screen bg-zinc-100 flex items-center justify-center">
          <p className="text-zinc-500">Proyecto no encontrado</p>
        </div>
      </ProtectedRoute>
    );
  }

  const isFreelancer = typeof project.freelancer_id === 'string'
    ? project.freelancer_id === user?._id
    : (project.freelancer_id as UserType)?._id === user?._id;

  const isRecruiter = typeof project.recruiter_id === 'string'
    ? project.recruiter_id === user?._id
    : (project.recruiter_id as UserType)?._id === user?._id;

  const otherUserId = isFreelancer
    ? (typeof project.recruiter_id === 'string' ? project.recruiter_id : (project.recruiter_id as UserType)?._id)
    : (typeof project.freelancer_id === 'string' ? project.freelancer_id : (project.freelancer_id as UserType)?._id);

  const otherUsername = isFreelancer
    ? (typeof project.recruiter_id === 'object' ? (project.recruiter_id as UserType).username : 'Reclutador')
    : (typeof project.freelancer_id === 'object' ? (project.freelancer_id as UserType).username : 'Freelancer');

  const statusTimeline = ['proposed', 'active', 'review', 'completed'];
  const currentIdx = statusTimeline.indexOf(project.status);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen bg-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Main — Chat */}
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {project.title}
                  </h1>
                  <Badge variant={getStatusVariant(project.status)}>{undefined}</Badge>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">{project.description}</p>
              </Card>

              <Card>
                <ChatBox
                  projectId={project._id}
                  otherUserId={otherUserId || ''}
                  otherUsername={otherUsername}
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Info */}
              <Card>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-2">
                  Detalles
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <DollarSign className="w-4 h-4 text-zinc-400" />
                    <span>Monto: <strong className="text-zinc-900">{formatMXN(project.amount)}</strong></span>
                  </div>
                  {project.guarantee > 0 && (
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Shield className="w-4 h-4 text-zinc-400" />
                      <span>Garantía: {formatMXN(project.guarantee)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Deadline: {formatDate(project.deadline)}</span>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-3">
                  Timeline
                </p>
                <div className="space-y-2">
                  {statusTimeline.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          i <= currentIdx ? 'bg-zinc-900' : 'bg-zinc-200'
                        }`}
                      />
                      <span
                        className={`text-xs capitalize ${
                          i <= currentIdx ? 'text-zinc-900 font-medium' : 'text-zinc-400'
                        }`}
                      >
                        {s === 'proposed' ? 'Propuesto' :
                         s === 'active' ? 'Activo' :
                         s === 'review' ? 'En revisión' : 'Completado'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <Card>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-3">
                  Acciones
                </p>
                <div className="space-y-2">
                  {/* Freelancer actions */}
                  {isFreelancer && project.status === 'proposed' && (
                    <Button className="w-full" onClick={handleAccept} loading={actionLoading}>
                      Aceptar propuesta
                    </Button>
                  )}
                  {isFreelancer && project.status === 'active' && (
                    <Button className="w-full" onClick={() => setShowDeliverModal(true)}>
                      Subir entrega
                    </Button>
                  )}
                  {isFreelancer && ['review', 'active'].includes(project.status) && (
                    <Button variant="danger" className="w-full" onClick={handleDispute} loading={actionLoading}>
                      Abrir disputa
                    </Button>
                  )}

                  {/* Recruiter actions */}
                  {isRecruiter && project.status === 'review' && (
                    <>
                      <Button className="w-full" onClick={handleApprove} loading={actionLoading}>
                        Aprobar entrega
                      </Button>
                      {!project.correction_used && (
                        <Button variant="secondary" className="w-full" onClick={() => updateStatus('active')} loading={actionLoading}>
                          Solicitar corrección
                        </Button>
                      )}
                      <Button variant="danger" className="w-full" onClick={() => updateStatus('rejected')} loading={actionLoading}>
                        Rechazar
                      </Button>
                    </>
                  )}

                  {project.status === 'completed' && (
                    <p className="text-xs text-zinc-400 text-center">Proyecto completado ✓</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Deliver modal */}
      <Modal open={showDeliverModal} onClose={() => setShowDeliverModal(false)} title="Subir entrega">
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
          <Button className="w-full" onClick={handleDeliver} loading={actionLoading}>
            Enviar entrega
          </Button>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
