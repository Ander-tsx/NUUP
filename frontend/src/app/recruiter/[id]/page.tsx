"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import EventCard from "@/components/events/EventCard";
import { formatDate } from "@/lib/utils";
import { BadgeCheck, Globe, Calendar, Briefcase, Users } from "lucide-react";
import type { User, Event, Project } from "@/types";

interface RecruiterPageData {
  user: User;
  activeEvents: Event[];
  activeProjects: Project[];
}

export default function RecruiterProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<RecruiterPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/users/recruiter/${params.id}`);
        setData(res.data?.data ?? res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div
          className="pt-14 min-h-screen flex items-center justify-center"
          style={{ background: "var(--bg)" }}
        >
          <Spinner size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div
          className="pt-14 min-h-screen flex items-center justify-center"
          style={{ background: "var(--bg)" }}
        >
          <p style={{ color: "var(--text-3)" }}>Reclutador no encontrado</p>
        </div>
      </ProtectedRoute>
    );
  }

  const { user, activeEvents, activeProjects } = data;
  const company = user.company;

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen" style={{ background: "var(--bg)" }}>
        {/* BG orbs */}
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            className="glow-orb w-[500px] h-[500px] -top-32 -left-32 opacity-[0.07]"
            style={{ background: "#818cf8" }}
          />
          <div
            className="glow-orb w-[400px] h-[400px] -bottom-24 -right-32 opacity-[0.05]"
            style={{ background: "#2185D5" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-5">
          {/* Company hero card */}
          <div
            className="animate-fade-up rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="h-28 relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(33,133,213,0.18) 0%, rgba(129,140,248,0.12) 100%)",
              }}
            />
            <div className="px-6 pb-6 -mt-10 relative">
              <div className="flex items-end gap-4 mb-4">
                <div
                  className="rounded-2xl p-0.5"
                  style={{ background: "var(--surface)" }}
                >
                  {company?.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <Avatar name={company?.name || user.username} size="xl" />
                  )}
                </div>
                <div className="mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-white">
                      {company?.name || user.username}
                    </h1>
                    {company?.verified && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(34,197,94,0.12)",
                          color: "#22c55e",
                          border: "1px solid rgba(34,197,94,0.22)",
                        }}
                      >
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Empresa verificada
                      </span>
                    )}
                  </div>
                  {company?.industry && (
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "var(--text-2)" }}
                    >
                      {company.industry}
                    </p>
                  )}
                </div>
              </div>

              {company?.description && (
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "var(--text-2)" }}
                >
                  {company.description}
                </p>
              )}

              {/* Meta row */}
              <div
                className="flex flex-wrap gap-4 text-xs"
                style={{ color: "var(--text-3)" }}
              >
                {company?.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#60b8f0] transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {company?.employee_count && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {company.employee_count} empleados
                  </span>
                )}
                {company?.founded_year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Fundada en {company.founded_year}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Miembro desde {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Active events */}
          {activeEvents.length > 0 && (
            <div className="animate-fade-up delay-100">
              <h2 className="text-sm font-semibold text-white mb-3">
                Retos activos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Active projects */}
          {activeProjects.length > 0 && (
            <div className="animate-fade-up delay-150">
              <h2 className="text-sm font-semibold text-white mb-3">
                Proyectos activos
              </h2>
              <div className="space-y-3">
                {activeProjects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => router.push(`/projects/${project._id}`)}
                    className="card card-clickable p-4 flex items-center justify-between gap-4"
                    style={{ background: "var(--surface)" }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {project.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-3)" }}
                      >
                        Vence {formatDate(project.deadline)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: "rgba(33,133,213,0.10)",
                        color: "#60b8f0",
                        border: "1px solid rgba(33,133,213,0.18)",
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeEvents.length === 0 && activeProjects.length === 0 && (
            <div
              className="animate-fade-up delay-100 rounded-2xl p-10 text-center"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                Este reclutador no tiene retos ni proyectos activos en este
                momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
