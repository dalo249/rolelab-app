import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookCheck,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  GitBranch,
  Lightbulb,
  Loader2,
  MessageSquareCode,
  RefreshCw,
  RotateCcw,
  Target,
  ThumbsUp,
  Users,
  WifiOff,
  Wrench,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ErrorHistorial,
  EvaluacionIA,
  MetricasSistema,
  NivelHabilidad,
  Reto,
} from '../../types/rolelab';
import { TerminoTecnico, TextoConTerminos } from '../TerminoTecnico';
import { formatearSegundos } from '../../utils/metricasFormato';

interface Stage4EvaluacionIAProps {
  reto: Reto;
  evaluacion: EvaluacionIA | null;
  cargando: boolean;
  errorConexion: string | null;
  metricasActuales: MetricasSistema;
  historialErrores: ErrorHistorial[];
  onReintentarConexionIA: () => void;
  onVolverAPropuesta: () => void;
  onReintentarReto: () => void;
  onExplorarCarreras: () => void;
}

function obtenerEstiloNivel(nivel: NivelHabilidad): {
  textoColor: string;
  indicador: string;
} {
  if (nivel === 'Destacado') {
    return { textoColor: 'text-emerald-700', indicador: '● Destacado' };
  }
  if (nivel === 'Sólido') {
    return { textoColor: 'text-[#2D6CDF]', indicador: '◐ Sólido' };
  }
  return { textoColor: 'text-amber-700', indicador: '○ En desarrollo' };
}

const IlustracionVidaReal: React.FC = () => (
  <svg
    viewBox="0 0 120 88"
    className="w-24 h-18 shrink-0 hidden sm:block"
    aria-hidden="true"
  >
    <rect x="6" y="10" width="108" height="68" rx="12" fill="#EFF6FF" stroke="#E2E8F0" />
    <rect x="16" y="20" width="52" height="32" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
    <path
      d="M22 42 L32 34 L42 38 L52 26 L62 30"
      fill="none"
      stroke="#10B981"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="52" cy="26" r="3" fill="#2D6CDF" />
    <rect x="74" y="20" width="30" height="14" rx="4" fill="#2D6CDF" />
    <rect x="79" y="25" width="18" height="3" rx="1.5" fill="#FFFFFF" />
    <rect x="74" y="38" width="30" height="14" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
    <circle cx="82" cy="45" r="3" fill="#10B981" />
    <rect x="88" y="43.5" width="11" height="3" rx="1.5" fill="#94A3B8" />
    <rect x="16" y="58" width="88" height="10" rx="5" fill="#FFFFFF" stroke="#E2E8F0" />
    <circle cx="25" cy="63" r="2.5" fill="#2D6CDF" />
    <rect x="32" y="61.5" width="42" height="3" rx="1.5" fill="#CBD5E1" />
  </svg>
);

const IlustracionBrujula: React.FC = () => (
  <svg
    viewBox="0 0 88 88"
    className="w-16 h-16 shrink-0 hidden sm:block"
    aria-hidden="true"
  >
    <circle cx="44" cy="44" r="36" fill="#EFF6FF" stroke="#E2E8F0" strokeWidth="2" />
    <circle cx="44" cy="44" r="26" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
    <polygon points="44,21 51,44 44,39 37,44" fill="#10B981" />
    <polygon points="44,67 51,44 44,49 37,44" fill="#2D6CDF" />
    <circle cx="44" cy="44" r="3.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
  </svg>
);

export const Stage4EvaluacionIA: React.FC<Stage4EvaluacionIAProps> = ({
  reto,
  evaluacion,
  cargando,
  errorConexion,
  metricasActuales,
  historialErrores,
  onReintentarConexionIA,
  onVolverAPropuesta,
  onReintentarReto,
  onExplorarCarreras,
}) => {
  const [referenciaAbierta, setReferenciaAbierta] = useState(false);
  const [habilidadSeleccionadaIdx, setHabilidadSeleccionadaIdx] = useState(0);

  useEffect(() => {
    setHabilidadSeleccionadaIdx(0);
  }, [evaluacion?.generadaEn]);

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 sm:p-14 text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-[#2D6CDF] text-white flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Revisando tu plan con Gemini IA…
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            Estamos revisando tus decisiones ({historialErrores.length}{' '}
            {historialErrores.length === 1 ? 'prueba' : 'pruebas'} en el camino), los indicadores (
            {Math.round(metricasActuales.disponibilidad)} de cada 100 entran sin error ·{' '}
            {formatearSegundos(metricasActuales.latenciaMs)}) y lo que escribiste.
          </p>
        </div>
      </div>
    );
  }

  if (errorConexion || !evaluacion) {
    return (
      <div
        role="alert"
        className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 space-y-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
            <WifiOff className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-rose-700">
              Parte 4 · No se pudo conectar con Gemini IA
            </p>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Hubo un error de conexión con Gemini IA y no pudimos revisar tu plan en este momento.
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
              No generamos respuestas inventadas cuando falla la conexión. Tus textos y tu progreso siguen guardados en este navegador para que lo intentes de nuevo.
            </p>
            {errorConexion && (
              <p className="text-xs font-mono text-[#64748B] pt-1">
                Detalle técnico: {errorConexion}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onReintentarConexionIA}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar con Gemini IA
          </button>

          <button
            type="button"
            onClick={onVolverAPropuesta}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] transition-colors whitespace-nowrap"
          >
            Volver a mi plan
          </button>
        </div>
      </div>
    );
  }

  const habilidades = evaluacion.habilidades || [];
  const habilidadActiva = habilidades[habilidadSeleccionadaIdx] || habilidades[0];
  const vidaReal = evaluacion.vidaReal;
  const brujula = evaluacion.brujulaAfinidad;

  return (
    <div className="space-y-7">
      {/* 1. Encabezado + Resumen y Claridad en cards compactas */}
      <header className="space-y-4">
        <p className="text-xs font-medium text-[#64748B]">
          Parte 4 · Opinión de la IA ({evaluacion.modeloUsado})
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
          Balance de tu experiencia
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2D6CDF] text-white flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="font-sans text-lg font-bold text-[#0F172A]">
                Resumen de esta sesión
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed">
              <TextoConTerminos texto={evaluacion.resumenGeneral} />
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                <span className="block text-[11px] text-[#64748B]">Entran sin error</span>
                <span className="font-mono text-sm font-semibold tabular-nums text-[#0F172A]">
                  {Math.round(metricasActuales.disponibilidad)} de cada 100
                </span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                <span className="block text-[11px] text-[#64748B]">
                  <TerminoTecnico palabra="Latencia p95" etiqueta="Tiempo de respuesta" />
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-[#0F172A]">
                  {formatearSegundos(metricasActuales.latenciaMs)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2D6CDF] flex items-center justify-center shrink-0">
                  <MessageSquareCode className="w-4 h-4" />
                </div>
                <h2 className="font-sans text-lg font-bold text-[#0F172A]">
                  Claridad de tu explicación
                </h2>
              </div>
              <p className="text-sm text-[#1E293B] leading-relaxed">
                <TextoConTerminos texto={evaluacion.criterioYComunicacion} />
              </p>
            </div>
            <p className="text-[11px] text-[#64748B] pt-2 border-t border-[#E2E8F0]">
              Basado únicamente en tus elecciones y respuestas escritas de hoy.
            </p>
          </div>
        </div>
      </header>

      {/* 2. Lo correcto y Por mejorar (2 columnas de cards breves) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <h2 className="font-sans text-xl font-bold text-[#0F172A]">Lo correcto</h2>
              <p className="text-xs text-[#64748B]">Aciertos reales observados en tu sesión</p>
            </div>
          </div>

          {evaluacion.coincidencias.length > 0 ? (
            <ul className="space-y-2.5 text-sm text-[#1E293B] leading-relaxed">
              {evaluacion.coincidencias.slice(0, 3).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 bg-emerald-50/45 p-3.5 rounded-xl border border-emerald-100"
                >
                  <span className="font-mono text-xs font-semibold text-emerald-700 mt-0.5 tabular-nums shrink-0">
                    0{idx + 1}
                  </span>
                  <span>
                    <TextoConTerminos texto={item} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#475569] bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
              Aún no hubo suficiente detalle escrito para confirmar aciertos concretos.
            </p>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-amber-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="font-sans text-xl font-bold text-[#0F172A]">Por mejorar</h2>
              <p className="text-xs text-[#64748B]">Qué ajustar en tu próximo intento</p>
            </div>
          </div>

          <div className="space-y-3">
            {evaluacion.oportunidadesMejora.slice(0, 3).map((item, idx) => {
              const esErrorSimulacion = item.tipo === 'error_simulacion';
              return (
                <article
                  key={idx}
                  className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {item.titulo}
                    </h3>
                    <span className="text-[11px] font-medium text-[#64748B]">
                      {esErrorSimulacion ? 'Práctica' : 'Para reforzar'}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E293B] leading-relaxed">
                    <TextoConTerminos texto={item.quePaso} />{' '}
                    <span className="text-[#475569]">
                      <TextoConTerminos texto={item.porQueImporta} />
                    </span>
                  </p>
                  <p className="text-xs font-medium text-[#1E293B] bg-white rounded-lg border border-[#E2E8F0] px-3 py-2">
                    <strong className="text-[#2D6CDF]">Próximo paso:</strong>{' '}
                    <TextoConTerminos texto={item.comoMejorarlo} />
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. Habilidades en palabras cotidianas (Interactivo) */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="font-sans text-2xl font-bold text-[#0F172A]">
              Tus habilidades en este reto
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Toca una habilidad para ver qué significa y qué puedes practicar después.
            </p>
          </div>
          <span className="text-xs font-mono text-[#64748B]">4 habilidades clave</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={habilidades}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 6, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} />
                  <YAxis
                    dataKey="nombre"
                    type="category"
                    width={150}
                    stroke="#0F172A"
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                    formatter={(value: unknown) => [`${value}/100`, 'Puntaje']}
                  />
                  <Bar
                    dataKey="puntaje"
                    radius={[0, 8, 8, 0]}
                    barSize={18}
                    onClick={(_data, idx) => {
                      if (typeof idx === 'number') setHabilidadSeleccionadaIdx(idx);
                    }}
                    className="cursor-pointer"
                  >
                    {habilidades.map((entry, idx) => (
                      <Cell
                        key={entry.nombre}
                        fill={idx === habilidadSeleccionadaIdx ? '#2D6CDF' : '#94A3B8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {habilidades.map((hab, idx) => {
                const activa = idx === habilidadSeleccionadaIdx;
                const estilo = obtenerEstiloNivel(hab.nivel);
                return (
                  <button
                    key={hab.nombre}
                    type="button"
                    onClick={() => setHabilidadSeleccionadaIdx(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      activa
                        ? 'bg-[#EFF6FF] border-[#2D6CDF] text-[#0F172A]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] hover:bg-[#EFF6FF]/50'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{hab.nombre}</p>
                      <p className={`text-xs font-medium mt-0.5 ${estilo.textoColor}`}>
                        {estilo.indicador}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-semibold tabular-nums text-[#2D6CDF] shrink-0">
                      {hab.puntaje} / 100
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {habilidadActiva && (
            <div className="lg:col-span-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <h3 className="font-sans text-xl font-bold text-[#0F172A]">
                  {habilidadActiva.nombre}
                </h3>
                <span className="font-mono text-base font-semibold tabular-nums text-[#2D6CDF]">
                  {habilidadActiva.puntaje} / 100
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 space-y-1">
                  <p className="text-xs font-semibold text-[#2D6CDF] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Qué es
                  </p>
                  <p className="text-sm text-[#1E293B] leading-relaxed">
                    <TextoConTerminos texto={habilidadActiva.queSignifica} />
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 space-y-1">
                  <p className="text-xs font-semibold text-[#2D6CDF] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Qué hiciste hoy
                  </p>
                  <p className="text-sm text-[#1E293B] leading-relaxed">
                    <TextoConTerminos texto={habilidadActiva.queHiciste} />
                  </p>
                </div>

                <div className="bg-[#EFF6FF] rounded-xl border border-[#DBEAFE] p-3.5 space-y-1">
                  <p className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#2D6CDF]" />
                    Próximo reto
                  </p>
                  <p className="text-sm text-[#0F172A] leading-relaxed">
                    <TextoConTerminos texto={habilidadActiva.microReto} />
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Cómo es esto en la vida real */}
      {vidaReal && (
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#64748B]">De la simulación al trabajo diario</p>
              <h2 className="font-sans text-2xl font-bold text-[#0F172A]">
                Cómo es esto en la vida real
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Lo que hace un profesional de software en su jornada normal, sin idealizarlo.
              </p>
            </div>
            <IlustracionVidaReal />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#10B981]" />
                Qué se hace de verdad
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                {vidaReal.queSeHace.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#10B981] font-bold mt-0.5">•</span>
                    <span>
                      <TextoConTerminos texto={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Lo que no siempre es glamoroso
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                {vidaReal.ladoNoGlamoroso.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>
                      <TextoConTerminos texto={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2D6CDF]" />
              Con quiénes trabajas todos los días
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {vidaReal.conQuienesColaboras.map((area) => (
                <article
                  key={area.rol}
                  className="bg-[#EFF6FF]/65 rounded-xl border border-[#DBEAFE] p-3.5 space-y-1"
                >
                  <p className="text-xs font-semibold text-[#2D6CDF]">{area.rol}</p>
                  <p className="text-xs text-[#1E293B] leading-relaxed">
                    <TextoConTerminos texto={area.paraQue} />
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Brújula de afinidad */}
      {brujula && (
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#64748B]">Para tu elección de carrera</p>
              <h2 className="font-sans text-2xl font-bold text-[#0F172A]">
                Brújula de afinidad: ¿esto va contigo?
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Señales honestas para descubrir si disfrutarías trabajar en software o en otra área.
              </p>
            </div>
            <IlustracionBrujula />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="bg-emerald-50/45 rounded-xl border border-emerald-200 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-emerald-950 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-[#10B981]" />
                Probablemente te guste si…
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {brujula.teGustaraSi.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
                    <span>
                      <TextoConTerminos texto={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#2D6CDF]" />
                Quizás prefieras explorar otras áreas si…
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                {brujula.exploraOtrasSi.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#2D6CDF] font-bold mt-0.5">•</span>
                    <span>
                      <TextoConTerminos texto={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      )}

      {/* 6. Qué pasó en el equipo (Efecto dominó) */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3">
          <GitBranch className="w-5 h-5 text-[#2D6CDF] shrink-0" />
          <div>
            <h2 className="font-sans text-xl font-bold text-[#0F172A]">
              Qué pasó con el equipo y los estudiantes
            </h2>
            <p className="text-xs text-[#475569]">
              Consecuencias directas de tus decisiones en {reto.empresaFicticia}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluacion.efectoDomino.map((item, idx) => (
            <article
              key={idx}
              className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-2"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E2E8F0] pb-1.5">
                <h3 className="text-sm font-semibold text-[#0F172A]">{item.afectado}</h3>
                <span className="text-xs text-[#64748B]">{item.rolOArea}</span>
              </div>
              <p className="text-xs text-[#1E293B] leading-relaxed">
                <strong className="text-[#0F172A]">Personas:</strong>{' '}
                <TextoConTerminos texto={item.efectoInmediato} />
              </p>
              <p className="text-xs text-[#1E293B] leading-relaxed">
                <strong className="text-[#2D6CDF]">Plataforma:</strong>{' '}
                <TextoConTerminos texto={item.efectoSistemaOPresupuesto} />
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Solución de referencia (desplegable) */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <button
          type="button"
          onClick={() => setReferenciaAbierta((prev) => !prev)}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-[#F8FAFC] text-left hover:bg-[#EFF6FF]/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BookCheck className="w-5 h-5 text-[#2D6CDF]" />
            <div>
              <h2 className="font-sans text-lg sm:text-xl font-bold text-[#0F172A]">
                Cómo lo resuelve un profesional (Referencia del caso)
              </h2>
              <p className="text-xs text-[#475569]">
                Despliega esta guía para comparar tu plan con la solución completa.
              </p>
            </div>
          </div>
          {referenciaAbierta ? (
            <ChevronUp className="w-5 h-5 text-[#475569] shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#475569] shrink-0" />
          )}
        </button>

        {referenciaAbierta && (
          <div className="p-6 text-sm text-[#1E293B] leading-relaxed whitespace-pre-line bg-white border-t border-[#E2E8F0]">
            <TextoConTerminos texto={reto.solucionReferenciaProfesional} />
          </div>
        )}
      </section>

      {/* 8. Roles afines */}
      <section className="bg-[#EFF6FF]/65 rounded-2xl border border-[#DBEAFE] p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-5 h-5 text-[#2D6CDF]" />
          <div>
            <h2 className="font-sans text-xl font-bold text-[#0F172A]">
              Roles afines para seguir explorando
            </h2>
            <p className="text-xs text-[#475569]">
              Caminos reales relacionados con lo que practicaste hoy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evaluacion.rolesAfines.map((item) => (
            <article
              key={item.rol}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-1.5"
            >
              <h3 className="text-sm font-semibold text-[#2D6CDF]">{item.rol}</h3>
              <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                <TextoConTerminos texto={item.razon} />
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Acciones finales */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E2E8F0]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReintentarReto}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar reto
          </button>
          <button
            type="button"
            onClick={onVolverAPropuesta}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
          >
            Editar mi propuesta
          </button>
        </div>

        <button
          type="button"
          onClick={onExplorarCarreras}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors shadow-xs whitespace-nowrap"
        >
          Explorar otras carreras
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
