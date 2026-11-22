import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookCheck,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  GitBranch,
  Lightbulb,
  Loader2,
  MessageSquareCode,
  RefreshCw,
  RotateCcw,
  Target,
  WifiOff,
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
    return { textoColor: 'text-[#16263B]', indicador: '◐ Sólido' };
  }
  return { textoColor: 'text-amber-700', indicador: '○ En desarrollo' };
}

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
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 sm:p-14 text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-[#16263B] text-white flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F172A]">
            Revisando tu plan con Gemini IA…
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Estamos comparando tus decisiones ({historialErrores.length} {historialErrores.length === 1 ? 'prueba' : 'pruebas'} en el camino), cómo quedaron los indicadores ({Math.round(metricasActuales.disponibilidad)} de cada 100 entran sin error · {formatearSegundos(metricasActuales.latenciaMs)}) y lo que escribiste.
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
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F172A]">
              Hubo un error de conexión con Gemini IA y no pudimos revisar tu plan en este momento.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              No generamos respuestas inventadas cuando falla la conexión. Tus textos y tu progreso siguen guardados en este navegador para que lo intentes de nuevo.
            </p>
            {errorConexion && (
              <p className="text-xs font-mono text-slate-500 pt-1">
                Detalle técnico: {errorConexion}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onReintentarConexionIA}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16263B] text-white hover:bg-[#0F172A] transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar con Gemini IA
          </button>

          <button
            type="button"
            onClick={onVolverAPropuesta}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#EFECE6] text-[#0F172A] hover:bg-[#E4DDD1] transition-colors whitespace-nowrap"
          >
            Volver a mi plan
          </button>
        </div>
      </div>
    );
  }

  const habilidades = evaluacion.habilidades || [];
  const habilidadActiva = habilidades[habilidadSeleccionadaIdx] || habilidades[0];

  return (
    <div className="space-y-8">
      <header className="space-y-2.5">
        <p className="text-xs font-medium text-slate-500">
          Parte 4 · Opinión de Gemini IA ({evaluacion.modeloUsado})
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0F172A]">
          Comentarios de tu líder de equipo
        </h1>
        <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
          <TextoConTerminos texto={evaluacion.resumenGeneral} />
        </p>
      </header>

      {/* 1. Mapa de habilidades observadas (Interactivo) */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
              Habilidades que pusiste en práctica
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Toca cualquiera de las 4 habilidades para ver qué hiciste hoy y cómo practicarla mejor.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Toca para ver detalle
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna izquierda: gráfica + botones por habilidad */}
          <div className="lg:col-span-6 space-y-4">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={habilidades}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 6, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} />
                  <YAxis
                    dataKey="nombre"
                    type="category"
                    width={145}
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
                        fill={idx === habilidadSeleccionadaIdx ? '#16263B' : '#94A3B8'}
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
                        ? 'bg-[#EFECE6]/85 border-[#16263B] text-[#0F172A]'
                        : 'bg-[#F9F8F6] border-[#E5E7EB] text-slate-700 hover:bg-[#EFECE6]/45'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{hab.nombre}</p>
                      <p className={`text-xs font-medium mt-0.5 ${estilo.textoColor}`}>
                        {estilo.indicador}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-semibold tabular-nums text-[#16263B] shrink-0">
                      {hab.puntaje} / 100
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna derecha: panel detallado interactivo */}
          {habilidadActiva && (
            <div className="lg:col-span-6 bg-[#F9F8F6] rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
                <div>
                  <p className="text-xs font-medium text-slate-500">Detalle</p>
                  <h3 className="font-serif text-xl font-semibold text-[#0F172A]">
                    {habilidadActiva.nombre}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-lg font-semibold tabular-nums text-[#16263B]">
                    {habilidadActiva.puntaje} / 100
                  </span>
                  <span className={`text-xs font-semibold ${obtenerEstiloNivel(habilidadActiva.nivel).textoColor}`}>
                    {obtenerEstiloNivel(habilidadActiva.nivel).indicador}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-1">
                  <p className="text-xs font-semibold text-[#16263B] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    1. Qué significa
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <TextoConTerminos texto={habilidadActiva.queSignifica} />
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-1">
                  <p className="text-xs font-semibold text-[#16263B] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    2. Qué hiciste hoy
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <TextoConTerminos texto={habilidadActiva.queHiciste} />
                  </p>
                </div>

                <div className="bg-[#EFECE6]/80 rounded-xl border border-[#E5E7EB] p-4 space-y-1">
                  <p className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#16263B]" />
                    3. Qué practicar la próxima vez
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

      {/* 2. Coincidencias (Aciertos) y Criterio y comunicación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <h2 className="font-serif text-xl font-semibold text-[#0F172A]">
              Lo que lograste bien
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
            {evaluacion.coincidencias.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100"
              >
                <span className="font-mono text-xs font-semibold text-emerald-700 mt-0.5 tabular-nums">
                  0{idx + 1}.
                </span>
                <span>
                  <TextoConTerminos texto={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <MessageSquareCode className="w-5 h-5 text-[#16263B]" />
            <h2 className="font-serif text-xl font-semibold text-[#0F172A]">
              Claridad de tu explicación
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            <TextoConTerminos texto={evaluacion.criterioYComunicacion} />
          </p>
          <div className="pt-3 border-t border-[#E5E7EB] grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#F9F8F6] rounded-xl p-2.5 border border-[#E5E7EB]">
              <span className="block text-[11px] text-slate-500">Entran sin error</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-[#0F172A]">
                {Math.round(metricasActuales.disponibilidad)} de cada 100
              </span>
            </div>
            <div className="bg-[#F9F8F6] rounded-xl p-2.5 border border-[#E5E7EB]">
              <span className="block text-[11px] text-slate-500">
                <TerminoTecnico palabra="Latencia p95" etiqueta="Tiempo de respuesta" />
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-[#0F172A]">
                {formatearSegundos(metricasActuales.latenciaMs)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 3. Consecuencias / Efecto dominó en el equipo */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-5">
        <div className="flex items-start gap-3 border-b border-[#E5E7EB] pb-4">
          <GitBranch className="w-5 h-5 text-[#16263B] mt-1 shrink-0" />
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
              Qué pasa con el equipo y los estudiantes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Como fichas de dominó: cada decisión tuya cambia la experiencia de quienes usan o mantienen {reto.empresaFicticia}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluacion.efectoDomino.map((item, idx) => (
            <article
              key={idx}
              className="bg-[#F9F8F6] rounded-xl border border-[#E5E7EB] p-4 sm:p-5 space-y-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E5E7EB] pb-2">
                <h3 className="text-sm font-semibold text-[#0F172A]">{item.afectado}</h3>
                <span className="text-xs text-slate-500">{item.rolOArea}</span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-[#0F172A]">Cómo lo sienten al instante:</strong>{' '}
                  <TextoConTerminos texto={item.efectoInmediato} />
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-[#16263B]">Qué pasa con la app o el presupuesto:</strong>{' '}
                  <TextoConTerminos texto={item.efectoSistemaOPresupuesto} />
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Oportunidades de mejora (constructivas y sin tono de regaño) */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-5">
        <div className="flex items-start gap-3 border-b border-[#E5E7EB] pb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
              Ideas para hacerlo aún mejor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Probar y equivocarse aquí es seguro: mira qué salió distinto y cómo reforzarlo en tu próximo intento.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {evaluacion.oportunidadesMejora.map((item, idx) => {
            const esErrorSimulacion = item.tipo === 'error_simulacion';
            return (
              <article
                key={idx}
                className="bg-[#F9F8F6] rounded-2xl border border-[#E5E7EB] p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-[#0F172A]">{item.titulo}</h3>
                  <span
                    className={`text-xs font-medium ${
                      esErrorSimulacion ? 'text-amber-800' : 'text-[#16263B]'
                    }`}
                  >
                    {esErrorSimulacion
                      ? 'Error de simulación · Parte del entrenamiento'
                      : 'Área por fortalecer'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 space-y-1">
                    <p className="font-semibold text-[#0F172A]">Qué pasó</p>
                    <p className="text-slate-700 leading-relaxed">
                      <TextoConTerminos texto={item.quePaso} />
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 space-y-1">
                    <p className="font-semibold text-[#0F172A]">Por qué importa en el trabajo</p>
                    <p className="text-slate-700 leading-relaxed">
                      <TextoConTerminos texto={item.porQueImporta} />
                    </p>
                  </div>
                  <div className="bg-[#EFECE6]/70 rounded-xl border border-[#E5E7EB] p-3.5 space-y-1">
                    <p className="font-semibold text-[#16263B]">Cómo mejorarlo</p>
                    <p className="text-[#0F172A] leading-relaxed">
                      <TextoConTerminos texto={item.comoMejorarlo} />
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Respuesta esperada del profesional (Solución de referencia del caso) */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <button
          type="button"
          onClick={() => setReferenciaAbierta((prev) => !prev)}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-[#EFECE6]/70 text-left hover:bg-[#EFECE6] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BookCheck className="w-5 h-5 text-[#16263B]" />
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#0F172A]">
                Cómo lo resuelve un profesional con experiencia (Referencia del caso)
              </h2>
              <p className="text-xs text-slate-600">
                Despliega esta guía para comparar paso a paso tu propuesta con la solución completa.
              </p>
            </div>
          </div>
          {referenciaAbierta ? (
            <ChevronUp className="w-5 h-5 text-slate-600 shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
          )}
        </button>

        {referenciaAbierta && (
          <div className="p-6 text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white border-t border-[#E5E7EB]">
            <TextoConTerminos texto={reto.solucionReferenciaProfesional} />
          </div>
        )}
      </section>

      {/* 6. Roles afines en lenguaje humano */}
      <section className="bg-[#EFECE6]/70 rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-5 h-5 text-[#16263B]" />
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#0F172A]">
              Carreras y roles afines para explorar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Si te gustó investigar pistas, cuidar datos reales y resolver emergencias con calma, estos caminos profesionales encajan contigo:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evaluacion.rolesAfines.map((item) => (
            <article
              key={item.rol}
              className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-2"
            >
              <h3 className="text-base font-semibold text-[#16263B]">{item.rol}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <TextoConTerminos texto={item.razon} />
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Acciones finales */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E5E7EB]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReintentarReto}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#EFECE6] text-[#0F172A] hover:bg-[#E4DDD1] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar reto
          </button>
          <button
            type="button"
            onClick={onVolverAPropuesta}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F9F8F6] transition-colors whitespace-nowrap"
          >
            Editar mi propuesta
          </button>
        </div>

        <button
          type="button"
          onClick={onExplorarCarreras}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#16263B] text-white hover:bg-[#0F172A] transition-colors shadow-xs whitespace-nowrap"
        >
          Explorar otras carreras
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
