import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X, Activity, Database, Terminal } from 'lucide-react';
import { HerramientaReal, SlideHerramienta } from '../types/rolelab';
import { TextoConTerminos } from './TerminoTecnico';

interface ModalHerramientaRealProps {
  herramienta: HerramientaReal | null;
  onClose: () => void;
}

const SlideVisualTelemetry: React.FC<{ tipo: SlideHerramienta['tipoVisual'] }> = ({ tipo }) => {
  switch (tipo) {
    case 'grafana-latencia':
      return (
        <div className="bg-[#0F172A] text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 mb-3 border-b border-slate-800">
            <span>Grafana · Tiempo de carga de la app</span>
            <span className="text-rose-400 font-semibold">Meta: &lt; 0.4 s</span>
          </div>
          <svg viewBox="0 0 460 140" className="w-full h-36 overflow-visible">
            {/* Grid */}
            <line x1="30" y1="20" x2="445" y2="20" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="30" y1="65" x2="445" y2="65" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="30" y1="110" x2="445" y2="110" stroke="#334155" />
            {/* Threshold line */}
            <line x1="30" y1="92" x2="445" y2="92" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="4 4" />
            <text x="35" y="87" fill="#FDA4AF" fontSize="9">Objetivo 0.4 s</text>
            {/* Latency curve */}
            <path
              d="M 35 103 L 95 101 L 155 100 L 210 24 L 270 28 L 330 34 L 390 40 L 440 42"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            <circle cx="210" cy="24" r="5" fill="#F43F5E" />
            <text x="220" y="22" fill="#FDA4AF" fontSize="10" fontWeight="bold">08:00 a.m. · 2.4 s</text>
            <text x="35" y="128" fill="#94A3B8" fontSize="9">07:30</text>
            <text x="198" y="128" fill="#F8FAFC" fontSize="9" fontWeight="bold">08:00</text>
            <text x="320" y="128" fill="#94A3B8" fontSize="9">08:30</text>
            <text x="422" y="128" fill="#94A3B8" fontSize="9">09:00</text>
          </svg>
        </div>
      );
    case 'grafana-pool':
      return (
        <div className="bg-[#0F172A] text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 mb-3 border-b border-slate-800">
            <span>Grafana · Ventanillas de datos (PostgreSQL)</span>
            <span className="text-amber-300 font-semibold">100 / 100 ocupadas</span>
          </div>
          <div className="space-y-3 py-1">
            <div>
              <div className="flex justify-between mb-1 text-[11px]">
                <span className="text-slate-300">07:45 a.m. (Tráfico normal)</span>
                <span className="text-emerald-400 tabular-nums">18 / 100 ventanillas</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[18%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-[11px]">
                <span className="text-slate-300">08:00 a.m. (Entrada masiva + /historial)</span>
                <span className="text-rose-400 tabular-nums">100 / 100 (Lleno)</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-full" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex justify-between">
              <span>Personas esperando en la fila:</span>
              <span className="text-rose-300 font-semibold tabular-nums">342 en espera (se corta a los 2 s)</span>
            </div>
          </div>
        </div>
      );
    case 'datadog-apm':
      return (
        <div className="bg-[#0F172A] text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 mb-3 border-b border-slate-800">
            <span>Datadog APM · Rayos X de un clic</span>
            <span className="text-sky-300">Total: 1.85 s</span>
          </div>
          <div className="space-y-2">
            <div className="bg-slate-800/90 px-3 py-1.5 rounded border border-slate-700 flex justify-between">
              <span>Abrir GET /api/asistencia/historial</span>
              <span className="text-rose-300 tabular-nums">1.85 s</span>
            </div>
            <div className="ml-4 bg-sky-950/70 px-3 py-1.5 rounded border border-sky-800/60 flex justify-between">
              <span>Revisar usuario (sesión)</span>
              <span className="text-emerald-300 tabular-nums">&lt; 0.01 s</span>
            </div>
            <div className="ml-4 bg-rose-950/80 px-3 py-2 rounded border border-rose-700/70">
              <div className="flex justify-between text-rose-200 font-semibold mb-1">
                <span>420 preguntas una por una (Query N+1)</span>
                <span className="tabular-nums">1.74 s (94.1%)</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-2 bg-rose-500/80 rounded-xs" />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case 'datadog-errores':
      return (
        <div className="bg-[#0F172A] text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 mb-3 border-b border-slate-800">
            <span>Datadog · Dónde ocurren los errores HTTP 500</span>
            <span className="text-rose-400">08:00–08:15 a.m.</span>
          </div>
          <div className="space-y-2.5">
            {[
              { ruta: 'GET /api/asistencia/historial', pct: 84, errores: '4,120 fallos' },
              { ruta: 'POST /api/reservas/asistencia (fila llena)', pct: 15, errores: '735 fallos' },
              { ruta: 'GET /api/auth/session', pct: 1, errores: '12 fallos' },
            ].map((item) => (
              <div key={item.ruta}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-200 truncate pr-2">{item.ruta}</span>
                  <span className="text-rose-300 shrink-0 tabular-nums">{item.errores} ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'postgres-slow':
      return (
        <div className="bg-[#0F172A] text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span>PostgreSQL · Pregunta que más se repite</span>
            <span className="text-amber-300">Uso del equipo: 98.4%</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto">
            <code>
              SELECT id, fecha, estado FROM asistencia_registros WHERE sesion_id = $1;
            </code>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
              <span className="block text-slate-400 text-[10px]">Veces en 10 min</span>
              <span className="font-semibold text-rose-300 tabular-nums">1,197,000</span>
            </div>
            <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
              <span className="block text-slate-400 text-[10px]">Por cada clic</span>
              <span className="font-semibold text-amber-300 tabular-nums">420 preguntas</span>
            </div>
            <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
              <span className="block text-slate-400 text-[10px]">Ventanillas</span>
              <span className="font-semibold text-rose-400">Llenas</span>
            </div>
          </div>
        </div>
      );
    case 'postgres-explain':
      return (
        <div className="bg-[#0F172A] text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-[11px] space-y-2.5">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span>Comparación · Antes vs. Solución</span>
            <span className="text-emerald-400">96% más rápido</span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/60">
            <span className="block text-rose-300 font-semibold">Ahora (420 preguntas una por una)</span>
            <span className="text-slate-300">Tarda 1.85 s · Ocupa 100 / 100 ventanillas</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60">
            <span className="block text-emerald-300 font-semibold">Con alivio rápido + arreglo final</span>
            <span className="text-slate-300">Copia rápida (60 s): 0.01 s · Datos juntos en una sola consulta: 0.02 s</span>
          </div>
        </div>
      );
  }
};

export const ModalHerramientaReal: React.FC<ModalHerramientaRealProps> = ({ herramienta, onClose }) => {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    setSlideIdx(0);
  }, [herramienta?.id]);

  useEffect(() => {
    if (!herramienta) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [herramienta, onClose]);

  if (!herramienta) return null;

  const slides = herramienta.slides;
  const slideActual = slides[slideIdx] || slides[0];

  const Icono =
    herramienta.id === 'grafana' ? Activity : herramienta.id === 'datadog' ? Terminal : Database;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-herramienta-titulo"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E5E7EB] bg-[#F9F8F6]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16263B] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Icono className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-0.5">
                Herramienta real de la industria · {herramienta.categoria}
              </p>
              <h2
                id="modal-herramienta-titulo"
                className="font-serif text-2xl font-semibold text-[#0F172A]"
              >
                {herramienta.nombre}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-2 rounded-xl text-slate-500 hover:text-[#0F172A] hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F9F8F6] rounded-xl p-4 border border-[#E5E7EB]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Qué hace en una empresa real
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <TextoConTerminos texto={herramienta.queHaceEnEmpresa} />
              </p>
            </div>
            <div className="bg-[#EFECE6]/70 rounded-xl p-4 border border-[#E5E7EB]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#16263B] mb-1.5">
                Cómo ayuda en este caso
              </h3>
              <p className="text-sm text-[#0F172A] leading-relaxed">
                <TextoConTerminos texto={herramienta.relacionConCaso} />
              </p>
            </div>
          </div>

          {/* Interactive Carousel */}
          <div className="border border-[#E5E7EB] rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">{slideActual.titulo}</h3>
                <p className="text-xs text-slate-500">{slideActual.subtitulo}</p>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500 shrink-0">
                {slideIdx + 1} / {slides.length}
              </span>
            </div>

            <SlideVisualTelemetry tipo={slideActual.tipoVisual} />

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              <TextoConTerminos texto={slideActual.leyenda} />
            </p>

            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#16263B] text-white hover:bg-[#0F172A] transition-colors whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <div className="flex items-center gap-1.5" aria-label="Indicadores de diapositiva">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSlideIdx(idx)}
                    aria-label={`Ver vista ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      idx === slideIdx ? 'w-6 bg-[#16263B]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSlideIdx((prev) => (prev + 1) % slides.length)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#16263B] text-white hover:bg-[#0F172A] transition-colors whitespace-nowrap"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F9F8F6]">
          <a
            href={herramienta.documentacionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#16263B] hover:underline"
          >
            {herramienta.documentacionLabel}
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#16263B] text-white hover:bg-[#0F172A] transition-colors whitespace-nowrap"
          >
            Volver al laboratorio
          </button>
        </div>
      </div>
    </div>
  );
};
