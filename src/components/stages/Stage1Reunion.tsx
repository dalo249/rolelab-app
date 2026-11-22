import React from 'react';
import { ArrowRight, Target, TriangleAlert } from 'lucide-react';
import { MetricasSistema, Reto } from '../../types/rolelab';
import { VideoReunionPlayer } from '../VideoReunionPlayer';
import { TerminoTecnico, TextoConTerminos } from '../TerminoTecnico';
import { MetasEquilibrioGrid } from '../MetasEquilibrioGrid';

interface Stage1ReunionProps {
  reto: Reto;
  metricasActuales: MetricasSistema;
  onAvanzar: () => void;
}

export const Stage1Reunion: React.FC<Stage1ReunionProps> = ({
  reto,
  metricasActuales,
  onAvanzar,
}) => {
  return (
    <div className="space-y-8">
      <header className="space-y-2.5">
        <p className="text-xs font-medium text-slate-500">
          Parte 1 · Reunión de emergencia y metas de hoy
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0F172A]">
          08:05 a.m. — Llamada urgente del equipo
        </h1>
        <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
          Antes de tocar nada, escucha qué vio cada compañero. Reproduce la llamada o toca cada turno para entender por qué están saliendo errores{' '}
          <TerminoTecnico palabra="HTTP 500" /> y qué está trabando{' '}
          <TerminoTecnico palabra="PostgreSQL" etiqueta="el archivo central" />.
        </p>
      </header>

      {/* Reproductor multimedia preparado para YouTube o Simulación Interactiva */}
      <VideoReunionPlayer
        videoUrl={reto.videoUrl}
        turnos={reto.turnosReunion}
        equipo={reto.equipo}
      />

      {/* Cierre del líder + Problemática + Tarea + Metas */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E5E7EB]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resumen de tu líder
            </p>
            <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
              Tu misión según {reto.cierreLider.autor}
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">{reto.cierreLider.cargo}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#F9F8F6] rounded-xl p-5 border border-[#E5E7EB] space-y-2">
            <div className="flex items-center gap-2 text-rose-700">
              <TriangleAlert className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#0F172A]">Qué está pasando hoy</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <TextoConTerminos texto={reto.cierreLider.problematica} />
            </p>
          </div>

          <div className="bg-[#EFECE6]/70 rounded-xl p-5 border border-[#E5E7EB] space-y-2">
            <div className="flex items-center gap-2 text-[#16263B]">
              <Target className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#0F172A]">Tu misión</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <TextoConTerminos texto={reto.cierreLider.tareaAsignada} />
            </p>
          </div>
        </div>

        <MetasEquilibrioGrid metricas={metricasActuales} />
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAvanzar}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#16263B] text-white hover:bg-[#0F172A] transition-colors shadow-xs whitespace-nowrap"
        >
          Ir a revisar pistas y decidir
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
