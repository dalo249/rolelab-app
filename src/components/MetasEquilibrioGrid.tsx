import React from 'react';
import { CheckCircle2, Gauge, ShieldCheck } from 'lucide-react';
import { MetricasSistema } from '../types/rolelab';
import { TerminoTecnico } from './TerminoTecnico';
import { formatearSegundos } from '../utils/metricasFormato';

interface MetasEquilibrioGridProps {
  metricas: MetricasSistema;
}

export const MetasEquilibrioGrid: React.FC<MetasEquilibrioGridProps> = ({ metricas }) => {
  const entranSinErrorDe100 = Math.max(0, Math.min(100, Math.round(metricas.disponibilidad)));
  const disponibilidadOk = metricas.disponibilidad >= 95;
  const latenciaOk = metricas.latenciaMs < 400;
  const latenciaLenta = metricas.latenciaMs >= 400 && metricas.latenciaMs < 1000;

  const estadoDisp = disponibilidadOk
    ? { texto: 'Normal', clase: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    : metricas.disponibilidad < 85
    ? { texto: 'Crítico', clase: 'bg-rose-50 text-rose-700 border-rose-200' }
    : { texto: 'En alerta', clase: 'bg-amber-50 text-amber-800 border-amber-200' };

  const estadoLat = latenciaOk
    ? { texto: 'Normal', clase: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    : latenciaLenta
    ? { texto: 'Lento', clase: 'bg-amber-50 text-amber-800 border-amber-200' }
    : { texto: 'Crítico', clase: 'bg-rose-50 text-rose-700 border-rose-200' };

  // Escala visual de tiempo de respuesta (0 a 2,800 ms, o más si supera ese valor)
  const latenciaMaxEscala = Math.max(2800, metricas.latenciaMs);
  const latenciaPct = Math.max(
    4,
    Math.min(100, Math.round((metricas.latenciaMs / latenciaMaxEscala) * 100))
  );
  const latenciaMetaPct = Math.round((400 / latenciaMaxEscala) * 100);

  return (
    <div className="bg-[#F9F8F6] rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#16263B]">
          <Gauge className="w-4 h-4" />
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#0F172A]">
            Las 2 metas que debes equilibrar hoy
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Cada decisión que tomes mueve estos dos indicadores al mismo tiempo:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta 1: Entran sin error */}
        <article className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#EFECE6] text-[#16263B] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h4 className="font-sans text-sm font-semibold text-[#0F172A]">
                  1. Entran sin error
                </h4>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${estadoDisp.clase}`}>
                {estadoDisp.texto}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Estudiantes que entran correctamente a su curso sin que les salgan problemas ni errores (<TerminoTecnico palabra="HTTP 500" />). Así ves de inmediato qué tan bien funciona el acceso.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-[#E5E7EB]">
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F9F8F6] rounded-lg p-2.5 border border-[#E5E7EB]">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">Normal</span>
                <strong className="font-mono text-[#0F172A] tabular-nums">≥ 95 de cada 100</strong>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">Ahora</span>
                <strong
                  className={`font-mono tabular-nums inline-flex items-center gap-1 ${
                    disponibilidadOk
                      ? 'text-[#10B981]'
                      : metricas.disponibilidad < 85
                      ? 'text-rose-700'
                      : 'text-amber-700'
                  }`}
                >
                  {disponibilidadOk && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                  {entranSinErrorDe100} de cada 100
                </strong>
              </div>
            </div>

            {/* Barra dinámica con marcador de objetivo >= 95 de cada 100 */}
            <div className="relative pt-1 pb-4">
              <div className="h-3 w-full rounded-full bg-[#EFECE6] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    disponibilidadOk
                      ? 'bg-[#10B981]'
                      : metricas.disponibilidad < 85
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${entranSinErrorDe100}%` }}
                />
              </div>
              <div
                className="absolute top-0 bottom-3 w-0.5 bg-[#0F172A]"
                style={{ left: '95%' }}
                aria-hidden="true"
              />
              <span
                className="absolute bottom-0 -translate-x-1/2 text-[10px] font-mono font-semibold text-[#0F172A] tabular-nums whitespace-nowrap"
                style={{ left: '95%' }}
              >
                95/100
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {disponibilidadOk
                ? 'Casi todos logran entrar a su clase sin problemas.'
                : `Hoy ${100 - entranSinErrorDe100} de cada 100 estudiantes ven una pantalla de error al intentar entrar.`}
            </p>
          </div>
        </article>

        {/* Tarjeta 2: Tiempo de respuesta */}
        <article className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#EFECE6] text-[#16263B] flex items-center justify-center shrink-0">
                  <Gauge className="w-4 h-4" />
                </span>
                <h4 className="font-sans text-sm font-semibold text-[#0F172A]">
                  2. <TerminoTecnico palabra="Latencia p95" etiqueta="Tiempo de respuesta (s)" />
                </h4>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${estadoLat.clase}`}>
                {estadoLat.texto}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Segundos (<span className="font-mono text-xs">s</span>) que espera un estudiante por clic hasta que abre un curso o carga la página del curso.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-[#E5E7EB]">
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F9F8F6] rounded-lg p-2.5 border border-[#E5E7EB]">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">Normal</span>
                <strong className="font-mono text-[#0F172A] tabular-nums">&lt; 0.4 s</strong>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">Ahora</span>
                <strong
                  className={`font-mono tabular-nums inline-flex items-center gap-1 ${
                    latenciaOk ? 'text-[#10B981]' : latenciaLenta ? 'text-amber-700' : 'text-rose-700'
                  }`}
                >
                  {latenciaOk && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                  {formatearSegundos(metricas.latenciaMs)}
                </strong>
              </div>
            </div>

            {/* Barra dinámica con zona saludable (< 0.4 s) y marcador */}
            <div className="relative pt-1 pb-4">
              <div className="relative h-3 w-full rounded-full bg-[#EFECE6] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-100"
                  style={{ width: `${latenciaMetaPct}%` }}
                  aria-hidden="true"
                />
                <div
                  className={`relative h-full rounded-full transition-all duration-500 ${
                    latenciaOk ? 'bg-[#10B981]' : latenciaLenta ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${latenciaPct}%` }}
                />
              </div>
              <div
                className="absolute top-0 bottom-3 w-0.5 bg-[#0F172A]"
                style={{ left: `${latenciaMetaPct}%` }}
                aria-hidden="true"
              />
              <span
                className="absolute bottom-0 -translate-x-1/2 text-[10px] font-mono font-semibold text-[#0F172A] tabular-nums whitespace-nowrap"
                style={{ left: `${latenciaMetaPct}%` }}
              >
                0.4 s
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {latenciaOk
                ? 'La página del curso abre al instante (en menos de medio segundo).'
                : `Espera ${formatearSegundos(metricas.latenciaMs)} por clic y siente la vista congelada al cargar su curso.`}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
