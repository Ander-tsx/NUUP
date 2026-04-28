"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { BadgeCheck, Building2, CheckCircle2, Clock } from "lucide-react";
import type { CompanyProfile } from "@/types";

const INDUSTRIES = [
  "Tecnología",
  "Fintech",
  "E-commerce",
  "Salud",
  "Educación",
  "Marketing",
  "Otro",
];
const EMPLOYEE_COUNTS = ["1-10", "11-50", "51-200", "200+"];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const isRecruiter = user?.role === "recruiter";

  const [company, setCompany] = useState<Partial<CompanyProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [verifyMsg, setVerifyMsg] = useState("");
  const [rfcError, setRfcError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?._id) return;
        const res = await api.get(
          `/users/${user.stellar_public_key || user._id}`,
        );
        const u = res.data?.data?.user ?? res.data?.data ?? res.data;
        setCompany(u?.company || {});
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setRfcError("");
    if (company.rfc && !RFC_REGEX.test(company.rfc)) {
      setRfcError(
        "RFC inválido. Debe tener 12 caracteres (persona moral) o 13 (persona física).",
      );
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      await api.put("/users/company-profile", company);
      setSaveMsg("Perfil de empresa guardado.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Error al guardar.";
      setSaveMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleRequestVerification = async () => {
    setRequesting(true);
    setVerifyMsg("");
    try {
      const res = await api.post("/users/request-verification");
      setVerifyMsg(res.data?.data?.message || "Solicitud enviada.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Error al enviar solicitud.";
      setVerifyMsg(msg);
    } finally {
      setRequesting(false);
    }
  };

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

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-14 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white">Configuración</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>
              Gestiona tu cuenta y perfil
            </p>
          </div>

          {/* Company profile section — recruiters only */}
          {isRecruiter && (
            <div
              className="animate-fade-up rounded-2xl p-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-4 h-4 text-[#2185D5]" />
                <h2 className="text-sm font-semibold text-white">
                  Perfil de empresa
                </h2>
                {company.verified && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto"
                    style={{
                      background: "rgba(34,197,94,0.12)",
                      color: "#22c55e",
                      border: "1px solid rgba(34,197,94,0.22)",
                    }}
                  >
                    <BadgeCheck className="w-3 h-3" />
                    Verificada
                  </span>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label="Nombre de empresa"
                  value={company.name || ""}
                  onChange={(e) =>
                    setCompany({ ...company, name: e.target.value })
                  }
                  placeholder="Acme S.A. de C.V."
                />

                <div>
                  <Input
                    label="RFC"
                    value={company.rfc || ""}
                    onChange={(e) => {
                      setRfcError("");
                      setCompany({
                        ...company,
                        rfc: e.target.value.toUpperCase(),
                      });
                    }}
                    placeholder="ABC123456XYZ"
                    error={rfcError}
                  />
                  <p
                    className="text-[11px] mt-1"
                    style={{ color: "var(--text-3)" }}
                  >
                    12 caracteres para personas morales · 13 para personas
                    físicas
                  </p>
                </div>

                <Input
                  label="Sitio web"
                  value={company.website || ""}
                  onChange={(e) =>
                    setCompany({ ...company, website: e.target.value })
                  }
                  placeholder="https://empresa.com"
                />

                <Input
                  label="URL del logo"
                  value={company.logo_url || ""}
                  onChange={(e) =>
                    setCompany({ ...company, logo_url: e.target.value })
                  }
                  placeholder="https://cdn.empresa.com/logo.png"
                />

                <div className="w-full">
                  <label className="block text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                    Industria
                  </label>
                  <select
                    value={company.industry || ""}
                    onChange={(e) =>
                      setCompany({ ...company, industry: e.target.value })
                    }
                    className="w-full rounded-xl px-3 py-2 text-sm text-white"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <option value="">Selecciona una industria</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Año de fundación"
                    type="number"
                    value={company.founded_year || ""}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        founded_year: Number(e.target.value),
                      })
                    }
                    placeholder="2020"
                  />
                  <div className="w-full">
                    <label className="block text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                      Tamaño de empresa
                    </label>
                    <select
                      value={company.employee_count || ""}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          employee_count: e.target
                            .value as CompanyProfile["employee_count"],
                        })
                      }
                      className="w-full rounded-xl px-3 py-2 text-sm text-white"
                      style={{
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <option value="">Selecciona</option>
                      {EMPLOYEE_COUNTS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    value={company.description || ""}
                    onChange={(e) =>
                      setCompany({ ...company, description: e.target.value })
                    }
                    rows={3}
                    maxLength={500}
                    placeholder="Describe brevemente tu empresa..."
                    className="w-full rounded-xl px-3 py-2 text-sm text-white resize-none"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <p
                    className="text-[11px] mt-1 text-right"
                    style={{ color: "var(--text-3)" }}
                  >
                    {(company.description || "").length}/500
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button type="submit" loading={saving}>
                    Guardar cambios
                  </Button>
                  {saveMsg && (
                    <span
                      className="text-xs flex items-center gap-1"
                      style={{
                        color: saveMsg.includes("Error")
                          ? "#f87171"
                          : "#22c55e",
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {saveMsg}
                    </span>
                  )}
                </div>
              </form>

              {/* Verification request */}
              {!company.verified && (
                <div
                  className="mt-6 pt-5 rounded-xl p-4"
                  style={{
                    background: "rgba(33,133,213,0.05)",
                    border: "1px solid rgba(33,133,213,0.12)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-4 h-4 text-[#2185D5] mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        Solicitar verificación
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-3)" }}
                      >
                        El badge "Empresa verificada" aumenta la confianza de
                        los freelancers en tus retos. Requiere nombre de empresa
                        y RFC completos.
                      </p>
                      {company.verification_requested_at &&
                        !company.verified && (
                          <p
                            className="text-xs mt-2 flex items-center gap-1"
                            style={{ color: "#f59e0b" }}
                          >
                            <Clock className="w-3 h-3" />
                            Solicitud enviada el{" "}
                            {new Date(
                              company.verification_requested_at,
                            ).toLocaleDateString("es-MX")}{" "}
                            · En revisión
                          </p>
                        )}
                      {verifyMsg && (
                        <p
                          className="text-xs mt-2"
                          style={{
                            color:
                              verifyMsg.includes("Error") ||
                              verifyMsg.includes("error")
                                ? "#f87171"
                                : "#22c55e",
                          }}
                        >
                          {verifyMsg}
                        </p>
                      )}
                    </div>
                  </div>
                  {!company.verification_requested_at && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      loading={requesting}
                      onClick={handleRequestVerification}
                    >
                      Solicitar verificación
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Non-recruiter placeholder */}
          {!isRecruiter && (
            <div
              className="animate-fade-up rounded-2xl p-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                La configuración de perfil de empresa está disponible solo para
                reclutadores.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
