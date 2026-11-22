import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Gauge,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  CorreoConsecuencia,
  ErrorHistorial,
  EvaluacionIA,
  ImpactoMetrica,
  MetricasSistema,
  OpcionNodo,
  PropuestaFinalData,
  Reto,
} from '../types/rolelab';
import { Stage0Contexto } from './stages/Stage0Contexto';
import { Stage1Reunion } from './stages/Stage1Reunion';
import { Stage2Laboratorio } from './stages/Stage2Laboratorio';
import { Stage3Propuesta } from './stages/Stage3Propuesta';
import { Stage4EvaluacionIA } from './stages/Stage4EvaluacionIA';
import { SidebarNavegacion } from './SidebarNavegacion';
import { formatearSegundos } from '../utils/metricasFormato';

interface WorkspaceViewProps {
  reto: Reto;
  etapaActual: number;
  etapaMaximaDesbloqueada: number;
  metricasActuales: MetricasSistema;
  ultimoImpactoBadge: { texto: string; positivo: boolean } | null;
  nodosCompletados: string[];
  historialErrores: ErrorHistorial[];
  correosRecibidos: CorreoConsecuencia[];
  propuestaFinal: PropuestaFinalData;
  evaluacionIA: EvaluacionIA | null;
  cargandoIA: boolean;
  errorEvaluacionIA: string | null;
  onCambiarEtapa: (etapa: number) => void;
  onVolverCarreras: () => void;
  onReintentarReto: () => void;
  onRegistrarErrorNodo: (nodoId: string, nodoTitulo: string, opcion: OpcionNodo) => void;
  onCompletarNodo: (nodoId: string, impacto?: ImpactoMetrica) => void;
  onActualizarPropuesta: (patch: Partial<PropuestaFinalData>) => void;
  onEnviarYAnalizar: () => void;
  onExplorarPiramide: () => void;
}

const ETAPAS = [
  { id: 0, titulo: 'Parte 0: Tu equipo y el caso', corto: 'Equipo' },
  { id: 1, titulo: 'Parte 1: Reunión y metas', corto: 'Reunión' },
  { id: 2, titulo: 'Parte 2: Pistas y decisiones', corto: 'Pistas' },
  { id: 3, titulo: 'Parte 3: Tu plan final', corto: 'Plan final' },
  { id: 4, titulo: 'Parte 4: Opinión de la IA', corto: 'Opinión IA' },
];

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  reto,
  etapaActual,
  etapaMaximaDesbloqueada,
  metricasActuales,
  ultimoImpactoBadge,
  nodosCompletados,
  historialErrores,
  correosRecibidos,
  propuestaFinal,
  evaluacionIA,
  cargandoIA,
  errorEvaluacionIA,
  onCambiarEtapa,
  onVolverCarreras,
  onReintentarReto,
  onRegistrarErrorNodo,
  onCompletarNodo,
  onActualizarPropuesta,
  onEnviarYAnalizar,
  onExplorarPiramide,
}) => {
  const entranSinErrorDe100 = Math.max(0, Math.min(100, Math.round(metricasActuales.disponibilidad)));
  const disponibilidadOk = metricasActuales.disponibilidad >= 95;
  const latenciaOk = metricasActuales.latenciaMs < 400;
  const latenciaLenta = metricasActuales.latenciaMs >= 400 && metricasActuales.latenciaMs < 1000;

  const estadoDisponibilidad = disponibilidadOk
    ? { etiqueta: 'Normal', clase: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    : metricasActuales.disponibilidad < 85
    ? { etiqueta: 'Crítico', clase: 'bg-rose-50 text-rose-700 border-rose-200' }
    : { etiqueta: 'En alerta', clase: 'bg-amber-50 text-amber-800 border-amber-200' };

  const estadoLatencia = latenciaOk
    ? { etiqueta: 'Normal', clase: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    : latenciaLenta
    ? { etiqueta: 'Lento', clase: 'bg-amber-50 text-amber-800 border-amber-200' }
    : { etiqueta: 'Crítico', clase: 'bg-rose-50 text-rose-700 border-rose-200' };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar izquierdo de progreso secuencial */}
        <SidebarNavegacion
          titulo={reto.titulo}
          subtitulo={`${reto.empresaFicticia} · ${reto.nivelPosicionamiento}`}
          ariaLabel="Progreso del reto"
          onVolver={onVolverCarreras}
          items={ETAPAS.map((etapa) => {
            const desbloqueada = etapa.id <= etapaMaximaDesbloqueada;
            const completada =
              etapa.id < etapaMaximaDesbloqueada || (etapa.id === 4 && Boolean(evaluacionIA));
            const activa = etapa.id === etapaActual;

            return {
              id: etapa.id,
              titulo: etapa.titulo,
              activa,
              deshabilitada: !desbloqueada,
              completada,
              onClick: () => onCambiarEtapa(etapa.id),
            };
          })}
          footer={
            <button
              type="button"
              onClick={onReintentarReto}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#EFECE6] text-[#16263B] hover:bg-[#E4DDD1] transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reintentar reto
            </button>
          }
        />

        {/* Columna principal del Workspace */}
        <div className="lg:col-span-9 space-y-6">
          {/* BARRA SUPERIOR FIJA DE INDICADORES EN VIVO */}
          <div className="sticky top-3 z-30 bg-white/95 backdrop-blur-sm rounded-2xl border border-[#E5E7EB] p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E5E7EB]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#0F172A]">
                  Estado de {reto.empresaFicticia} en vivo
                </span>
                {ultimoImpactoBadge && (
                  <span
                    className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg transition-all ${
                      ultimoImpactoBadge.positivo
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {ultimoImpactoBadge.texto}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onReintentarReto}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16263B] hover:text-[#0F172A] transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reintentar reto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Indicador 1: Entran sin error (de cada 100 estudiantes) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16263B]" />
                    Entran sin error
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${estadoDisponibilidad.clase}`}
                    >
                      {estadoDisponibilidad.etiqueta}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold tabular-nums flex items-center gap-0.5 ${
                        disponibilidadOk
                          ? 'text-emerald-700'
                          : metricasActuales.disponibilidad < 85
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {entranSinErrorDe100} de cada 100
                      <ArrowUp className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-[#EFECE6] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      disponibilidadOk
                        ? 'bg-[#10B981]'
                        : metricasActuales.disponibilidad < 85
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${entranSinErrorDe100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Estudiantes que entran a su curso sin problemas ni errores.
                </p>
              </div>

              {/* Indicador 2: Tiempo de respuesta (s) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#16263B]" />
                    Tiempo de respuesta
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${estadoLatencia.clase}`}
                    >
                      {estadoLatencia.etiqueta}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold tabular-nums flex items-center gap-0.5 ${
                        latenciaOk ? 'text-emerald-700' : latenciaLenta ? 'text-amber-700' : 'text-rose-700'
                      }`}
                    >
                      {formatearSegundos(metricasActuales.latenciaMs)}
                      <ArrowDown className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-[#EFECE6] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      latenciaOk ? 'bg-[#10B981]' : latenciaLenta ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{
                      width: `${Math.max(10, Math.min(100, Math.round((metricasActuales.latenciaMs / 2800) * 100)))}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {latenciaOk
                    ? 'La página del curso abre al instante tras cada clic.'
                    : `Un estudiante espera ${formatearSegundos(metricasActuales.latenciaMs)} por clic y la vista se congela al cargar su curso.`}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido de la etapa activa */}
          <main>
            {etapaActual === 0 && (
              <Stage0Contexto reto={reto} onAvanzar={() => onCambiarEtapa(1)} />
            )}
            {etapaActual === 1 && (
              <Stage1Reunion
                reto={reto}
                metricasActuales={metricasActuales}
                onAvanzar={() => onCambiarEtapa(2)}
              />
            )}
            {etapaActual === 2 && (
              <Stage2Laboratorio
                reto={reto}
                nodosCompletados={nodosCompletados}
                correosRecibidos={correosRecibidos}
                onRegistrarErrorNodo={onRegistrarErrorNodo}
                onCompletarNodo={onCompletarNodo}
                onAvanzar={() => onCambiarEtapa(3)}
              />
            )}
            {etapaActual === 3 && (
              <Stage3Propuesta
                reto={reto}
                propuesta={propuestaFinal}
                onActualizarPropuesta={onActualizarPropuesta}
                onEnviarYAnalizar={onEnviarYAnalizar}
                cargandoIA={cargandoIA}
              />
            )}
            {etapaActual === 4 && (
              <Stage4EvaluacionIA
                reto={reto}
                evaluacion={evaluacionIA}
                cargando={cargandoIA}
                errorConexion={errorEvaluacionIA}
                metricasActuales={metricasActuales}
                historialErrores={historialErrores}
                onReintentarConexionIA={onEnviarYAnalizar}
                onVolverAPropuesta={() => onCambiarEtapa(3)}
                onReintentarReto={onReintentarReto}
                onExplorarCarreras={onExplorarPiramide}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
