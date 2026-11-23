import React from 'react';
import { ArrowRight, Building2, CheckCircle2, Compass, ShieldAlert, Users } from 'lucide-react';
import { Reto } from '../../types/rolelab';
import { TerminoTecnico } from '../TerminoTecnico';

interface Stage0ContextoProps {
  reto: Reto;
  onAvanzar: () => void;
}

export const Stage0Contexto: React.FC<Stage0ContextoProps> = ({ reto, onAvanzar }) => {
  return (
    <div className="space-y-8">
      {/* Encabezado de etapa */}
      <header className="space-y-3">
        <p className="text-xs font-medium text-[#64748B]">
          Parte 0 · Tu equipo y el caso · Escenario simulado
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
          Tu primer mes en {reto.empresaFicticia}
        </h1>
        <p className="text-base text-[#475569] leading-relaxed max-w-3xl">
          Acabas de entrar al equipo. Antes de atender la falla de hoy, conoce qué hace la empresa, quién trabaja contigo y cómo cuidarás que las clases sigan funcionando sin perder datos.
        </p>
      </header>

      {/* Ficha de Empresa y Rol */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2.5 text-[#2D6CDF]">
            <Building2 className="w-5 h-5" />
            <h2 className="font-sans text-xl font-bold text-[#0F172A]">
              Qué hace {reto.empresaFicticia}
            </h2>
          </div>
          <p className="text-sm text-[#1E293B] leading-relaxed">{reto.empresaDescripcion}</p>
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Tu rol en el equipo
            </p>
            <p className="text-sm font-semibold text-[#0F172A]">{reto.rolEstudiante}</p>
            <p className="text-xs text-[#475569]">{reto.nivelPosicionamiento}</p>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#EFF6FF]/75 rounded-xl p-5 border border-[#DBEAFE] space-y-3">
          <div className="flex items-center gap-2 text-[#2D6CDF]">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-[#0F172A]">
              Lo que define un buen trabajo hoy
            </h3>
          </div>
          <ul className="space-y-2.5 text-sm text-[#1E293B]">
            {reto.responsabilidadesRol.map((resp) => (
              <li key={resp} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#475569] pt-1">
            Tip: toca cualquier palabra subrayada como{' '}
            <TerminoTecnico palabra="HTTP 500" />, <TerminoTecnico palabra="Connection Pool" etiqueta="ventanillas" /> o{' '}
            <TerminoTecnico palabra="PostgreSQL" etiqueta="archivo de datos" /> para ver su significado al instante.
          </p>
        </div>
      </section>

      {/* Tarjetas del equipo de trabajo */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2D6CDF]" />
            <h2 className="font-sans text-2xl font-bold text-[#0F172A]">
              Tu equipo de trabajo
            </h2>
          </div>
          <span className="text-xs text-[#64748B]">
            Compañeros simulados del caso
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reto.equipo.map((miembro) => (
            <article
              key={miembro.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={miembro.avatarUrl}
                    alt={`${miembro.nombre} — ${miembro.cargo}`}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-[#E2E8F0] shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#0F172A] truncate">
                      {miembro.nombre}
                    </h3>
                    <p className="text-xs font-medium text-[#2D6CDF] leading-snug">
                      {miembro.cargo}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">{miembro.relacionConRol}</p>
              </div>
              <p className="text-[11px] font-medium text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                Área: {miembro.especialidad}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Mapa visual de áreas que participan */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#2D6CDF]" />
          <h2 className="font-sans text-xl font-bold text-[#0F172A]">
            Áreas que participan en este trabajo
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {reto.camposCarrera.map((campo) => (
            <div
              key={campo.nombre}
              className={`rounded-xl p-4 border ${
                campo.activoEnReto
                  ? 'bg-[#EFF6FF] border-[#2D6CDF]/35'
                  : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}
            >
              <p className="text-xs font-semibold text-[#0F172A]">{campo.nombre}</p>
              <p className="mt-1.5 text-xs text-[#475569] leading-relaxed">{campo.foco}</p>
              {campo.activoEnReto && (
                <p className="mt-2 text-[11px] font-semibold text-[#2D6CDF]">
                  Presente en este reto
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Compuerta */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onAvanzar}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors shadow-xs whitespace-nowrap"
        >
          Ir a la reunión del equipo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
