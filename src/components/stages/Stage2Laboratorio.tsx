import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lock,
  Mail,
  Plus,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CorreoConsecuencia,
  HerramientaReal,
  ImpactoMetrica,
  LogPeticion,
  OpcionNodo,
  Reto,
} from '../../types/rolelab';
import { TerminoTecnico, TextoConTerminos } from '../TerminoTecnico';
import { ModalHerramientaReal } from '../ModalHerramientaReal';
import { formatearDeltaSegundos, formatearSegundos } from '../../utils/metricasFormato';

interface Stage2LaboratorioProps {
  reto: Reto;
  nodosCompletados: string[];
  correosRecibidos: CorreoConsecuencia[];
  onRegistrarErrorNodo: (
    nodoId: string,
    nodoTitulo: string,
    opcion: OpcionNodo
  ) => void;
  onCompletarNodo: (nodoId: string, impacto?: ImpactoMetrica) => void;
  onAvanzar: () => void;
}

export const Stage2Laboratorio: React.FC<Stage2LaboratorioProps> = ({
  reto,
  nodosCompletados,
  correosRecibidos,
  onRegistrarErrorNodo,
  onCompletarNodo,
  onAvanzar,
}) => {
  const [resaltarPico, setResaltarPico] = useState(true);
  const [logSeleccionado, setLogSeleccionado] = useState<LogPeticion>(reto.logs[2]); // log de /api/asistencia/historial por defecto
  const [herramientaModal, setHerramientaModal] = useState<HerramientaReal | null>(null);

  const [seleccionesPorNodo, setSeleccionesPorNodo] = useState<Record<string, string>>({});
  const [pistasAbiertas, setPistasAbiertas] = useState<Record<string, boolean>>({});
  const [ultimoCorreoPorNodo, setUltimoCorreoPorNodo] = useState<Record<string, CorreoConsecuencia>>({});
  const [nodoVisibleIdx, setNodoVisibleIdx] = useState<number>(() => {
    const idx = reto.nodos.findIndex((n) => !nodosCompletados.includes(n.id));
    return idx === -1 ? reto.nodos.length - 1 : idx;
  });

  const todosNodosCompletados = reto.nodos.every((n) => nodosCompletados.includes(n.id));

  const manejarComprobar = (nodoIndex: number) => {
    const nodo = reto.nodos[nodoIndex];
    const opcionId = seleccionesPorNodo[nodo.id];
    if (!opcionId) return;

    const opcion = nodo.opciones.find((o) => o.id === opcionId);
    if (!opcion) return;

    if (opcion.esCorrecta) {
      // Limpia error visible previo de este nodo y marca completado
      setUltimoCorreoPorNodo((prev) => {
        const next = { ...prev };
        delete next[nodo.id];
        return next;
      });
      if (!nodosCompletados.includes(nodo.id)) {
        onCompletarNodo(nodo.id, opcion.impactoMetricas);
      }
    } else {
      onRegistrarErrorNodo(nodo.id, nodo.titulo, opcion);
      if (opcion.correoConsecuencia) {
        const correoGenerado: CorreoConsecuencia = {
          id: `mail-${nodo.id}-${Date.now()}`,
          nodoId: nodo.id,
          hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          ...opcion.correoConsecuencia,
        };
        setUltimoCorreoPorNodo((prev) => ({
          ...prev,
          [nodo.id]: correoGenerado,
        }));
      }
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2.5">
        <p className="text-xs font-medium text-[#64748B]">
          Parte 2 · Pistas del sistema y decisiones paso a paso
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
          Revisa las pistas reales y decide qué hacer
        </h1>
        <p className="text-base text-[#475569] leading-relaxed max-w-3xl">
          Mira en la gráfica cómo subió la espera a las 08:00 a.m. y compara las acciones de abajo para descubrir qué saturó las 100{' '}
          <TerminoTecnico palabra="Connection Pool" etiqueta="ventanillas" />. Si quieres ver cómo lucen estas herramientas en una empresa real, abre los botones{' '}
          <strong className="text-[#0F172A]">(+)</strong>.
        </p>
      </header>

      {/* Panel Oscuro de Pistas (#0F172A) */}
      <section className="bg-[#0F172A] text-slate-100 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-lg space-y-6">
        {/* Encabezado de consola */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-wide text-white">
              Señales en vivo de {reto.empresaFicticia} · 07:30 - 09:00 a.m.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setResaltarPico((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                resaltarPico
                  ? 'bg-rose-500/20 text-rose-200 border border-rose-400/50'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {resaltarPico ? 'Pico 08:00 a.m. resaltado' : 'Resaltar pico de las 08:00 a.m.'}
            </button>
          </div>
        </div>

        {/* Gráfica interactiva Recharts + 2 Hotspots (+) */}
        <div className="relative bg-slate-900/80 rounded-xl border border-slate-800 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-sans text-sm sm:text-base font-semibold text-white">
                Tiempo de carga (s) vs. Fallos al entrar (%)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {resaltarPico
                  ? 'A las 08:00 a.m. la espera salta de 0.2 s a 2.4 s y el 18.4% de los clics falla.'
                  : 'Pasa el cursor sobre la gráfica para ver cómo cambió minuto a minuto.'}
              </p>
            </div>

            {/* 2 Hotspots (+) sobre las señales: Grafana & Datadog */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setHerramientaModal(reto.herramientasReales.grafana)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1E293B] text-white border border-sky-400/40 hover:bg-[#2D6CDF]/30 transition-colors whitespace-nowrap"
                title="Abrir detalle de Grafana"
              >
                <span className="w-4 h-4 rounded-full bg-sky-400 text-[#0F172A] inline-flex items-center justify-center font-bold">
                  <Plus className="w-3 h-3" />
                </span>
                Grafana
              </button>
              <button
                type="button"
                onClick={() => setHerramientaModal(reto.herramientasReales.datadog)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1E293B] text-white border border-blue-400/40 hover:bg-[#2D6CDF]/30 transition-colors whitespace-nowrap"
                title="Abrir detalle de Datadog APM"
              >
                <span className="w-4 h-4 rounded-full bg-[#38BDF8] text-[#0F172A] inline-flex items-center justify-center font-bold">
                  <Plus className="w-3 h-3" />
                </span>
                Datadog APM
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={reto.telemetria} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="latenciaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="hora" stroke="#94A3B8" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  stroke="#38BDF8"
                  fontSize={12}
                  tickFormatter={(v) => formatearSegundos(Number(v))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#FB7185"
                  fontSize={12}
                  domain={[0, 25]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                  formatter={(value: unknown, name: unknown) => {
                    if (name === 'latenciaMs') {
                      return [formatearSegundos(Number(value)), 'Tiempo de carga'];
                    }
                    if (name === 'erroresHttp500Pct') return [`${value}%`, 'Fallos al entrar (%)'];
                    return [String(value ?? ''), String(name ?? '')];
                  }}
                />
                {resaltarPico && (
                  <ReferenceLine
                    x="08:00"
                    yAxisId="left"
                    stroke="#F43F5E"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: 'Pico 08:00 a.m.',
                      position: 'top',
                      fill: '#FDA4AF',
                      fontSize: 11,
                    }}
                  />
                )}
                <ReferenceLine
                  y={400}
                  yAxisId="left"
                  stroke="#10B981"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Meta < 0.4 s',
                    position: 'insideBottomLeft',
                    fill: '#6EE7B7',
                    fontSize: 10,
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="latenciaMs"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fill="url(#latenciaFill)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="erroresHttp500Pct"
                  stroke="#FB7185"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#FB7185' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inspector interactivo de 6 registros recientes + Hotspot PostgreSQL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">
                Registro de acciones recientes (6 clics reales)
              </h3>
              <button
                type="button"
                onClick={() => setHerramientaModal(reto.herramientasReales['postgres-slow-log'])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1E293B] text-white border border-amber-400/40 hover:bg-amber-900/40 transition-colors whitespace-nowrap"
              >
                <span className="w-4 h-4 rounded-full bg-amber-400 text-[#0F172A] inline-flex items-center justify-center font-bold">
                  <Plus className="w-3 h-3" />
                </span>
                Archivo lento (PostgreSQL)
              </button>
            </div>

            <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-3 text-xs text-slate-300 space-y-1 leading-relaxed">
              <p className="font-semibold text-sky-300">
                ¿Cómo leer estas peticiones?
              </p>
              <p>
                Cada línea es una peticion(ventanilla) de la página.{' '}
                <span className="font-mono text-sky-300">GET</span> consulta información y{' '}
                <span className="font-mono text-amber-300">POST</span> guarda algo nuevo. Mira el resultado (
                <strong className="text-emerald-300">OK 200</strong> funcionó,{' '}
                <strong className="text-rose-300">Error 500</strong> falló) y el tiempo (s) para ver qué pedido está lento o roto.
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto telemetry-scroll pr-1">
              {reto.logs.map((log) => {
                const activo = log.id === logSeleccionado.id;
                const esError = log.status >= 500;
                return (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setLogSeleccionado(log)}
                    className={`w-full text-left p-3 rounded-xl border font-mono text-xs transition-all ${
                      activo
                        ? 'bg-slate-800 border-sky-400 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            esError
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {esError ? `Error ${log.status}` : `OK ${log.status}`}
                        </span>
                        <span className="font-semibold text-sky-300">{log.metodo}</span>
                        <span className="truncate text-slate-100">{log.endpoint}</span>
                      </div>
                      <span
                        className={`tabular-nums shrink-0 ${
                          log.duracionMs > 400 ? 'text-rose-300 font-semibold' : 'text-emerald-300'
                        }`}
                      >
                        {(log.duracionMs / 1000).toFixed(2)} s · {log.subconsultasSql}{' '}
                        {log.subconsultasSql === 1 ? 'pregunta' : 'preguntas'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalle claro en español cotidiano del registro seleccionado */}
          <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-xs text-sky-300">Detalle de la acción elegida</span>
                <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                  {logSeleccionado.timestamp}
                </span>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-slate-400 block">Petición (ventanilla)</span>
                    <span className="text-[11px] text-slate-400">
                      {logSeleccionado.metodo === 'GET'
                        ? 'GET = pide consultar datos al sistema'
                        : 'POST = envía datos para guardarlos'}
                    </span>
                  </div>
                  <span className="font-mono text-sky-300 font-semibold text-right break-all">
                    {logSeleccionado.metodo} {logSeleccionado.endpoint}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400">Respuesta del sistema</span>
                    <span
                      className={`font-semibold ${
                        logSeleccionado.status >= 500 ? 'text-rose-300' : 'text-emerald-300'
                      }`}
                    >
                      {logSeleccionado.status >= 500
                        ? `Falló (${logSeleccionado.status} · fallo interno)`
                        : `Funcionó (${logSeleccionado.status} · entregó datos)`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400">
                      {logSeleccionado.status >= 500 ? 'Tardó antes de fallar' : 'Tiempo de respuesta'}
                    </span>
                    <span
                      className={`font-mono font-semibold tabular-nums ${
                        logSeleccionado.duracionMs > 400 ? 'text-rose-300' : 'text-emerald-300'
                      }`}
                    >
                      {(logSeleccionado.duracionMs / 1000).toFixed(2)} s
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400">Preguntas al archivo</span>
                    <span className="font-mono font-semibold text-amber-300 tabular-nums">
                      {logSeleccionado.subconsultasSql} {logSeleccionado.subconsultasSql === 1 ? 'pregunta' : 'preguntas'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400">Ventanillas ocupadas</span>
                    <span className="font-mono font-semibold text-slate-100 tabular-nums">
                      {logSeleccionado.poolConexionesUso}
                    </span>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-800">
                  <span className="block text-[10px] text-slate-400 mb-0.5">Resumen rápido</span>
                  <p className="text-slate-200 leading-snug">{logSeleccionado.payloadResumen}</p>
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <p className="font-semibold text-white mb-1">Qué pasó aquí:</p>
                <p className="whitespace-pre-line">
                  <TextoConTerminos texto={logSeleccionado.trazaDetalle} variant="dark" />
                </p>
                {logSeleccionado.sqlMuestra && (
                  <code className="block mt-2 p-2 rounded bg-slate-950 text-amber-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {logSeleccionado.sqlMuestra}
                  </code>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Tip: toca cada fila de la izquierda para comparar las acciones rápidas (OK 200) contra la que está atascando el sistema (Error 500).
            </p>
          </div>
        </div>
      </section>

      {/* 3 Pasos secuenciales de decisión */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-sans text-2xl font-bold text-[#0F172A]">
              Decisiones paso a paso bajo presión
            </h2>
            <p className="text-sm text-[#475569] mt-0.5">
              Primero encuentra qué falló, luego frena el daño sin apagar todo y al final protege los datos nuevos. Si pruebas una opción riesgosa, verás cómo reacciona tu equipo por correo.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#2D6CDF] tabular-nums">
            {nodosCompletados.length} / {reto.nodos.length} pasos listos
          </span>
        </div>

        <div className="space-y-5">
          {reto.nodos.map((nodo, idx) => {
            const completado = nodosCompletados.includes(nodo.id);
            const desbloqueado = idx === 0 || nodosCompletados.includes(reto.nodos[idx - 1].id);
            const opcionElegidaId = seleccionesPorNodo[nodo.id] || '';
            const opcionCorrecta = nodo.opciones.find((o) => o.esCorrecta);
            const correoError = ultimoCorreoPorNodo[nodo.id];
            const pistaAbierta = !!pistasAbiertas[nodo.id];

            if (!desbloqueado) {
              return (
                <div
                  key={nodo.id}
                  className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 flex items-center justify-between gap-4 opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-[#1E293B]">{nodo.titulo}</h3>
                      <p className="text-xs text-[#64748B]">
                        Completa el paso anterior para abrir esta decisión.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <article
                id={`decision-${nodo.id}`}
                key={nodo.id}
                className={`scroll-mt-32 sm:scroll-mt-40 bg-white rounded-2xl border p-4 sm:p-6 space-y-5 transition-all ${
                  completado ? 'border-emerald-300' : 'border-[#E2E8F0]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-[#64748B]">
                        Paso {nodo.numero} de {reto.nodos.length}
                      </span>
                      {completado && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          Listo
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-xl font-bold text-[#0F172A]">{nodo.titulo}</h3>
                    <p className="mt-1.5 text-sm sm:text-base text-[#1E293B] leading-relaxed">
                      <TextoConTerminos texto={nodo.contextoPregunta} />
                    </p>
                  </div>

                  {!completado && (
                    <button
                      type="button"
                      onClick={() =>
                        setPistasAbiertas((prev) => ({ ...prev, [nodo.id]: !prev[nodo.id] }))
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] transition-colors whitespace-nowrap"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Pedir una pista
                    </button>
                  )}
                </div>

                {pistaAbierta && !completado && (
                  <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4 text-xs sm:text-sm text-[#0F172A] leading-relaxed">
                    <strong className="font-semibold text-[#2D6CDF]">Pista de tu mentor:</strong>{' '}
                    <TextoConTerminos texto={nodo.pista} />
                  </div>
                )}

                {/* Opciones */}
                <div className="space-y-2.5">
                  {nodo.opciones.map((opcion) => {
                    const seleccionada =
                      completado ? opcion.esCorrecta : opcionElegidaId === opcion.id;

                    return (
                      <label
                        key={opcion.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                          completado && opcion.esCorrecta
                            ? 'bg-emerald-50/70 border-emerald-400 text-[#0F172A]'
                            : seleccionada
                            ? 'bg-[#EFF6FF] border-[#2D6CDF] text-[#0F172A]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#EFF6FF]/50 text-[#1E293B]'
                        } ${completado ? 'cursor-default' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`nodo-${nodo.id}`}
                          value={opcion.id}
                          checked={seleccionada}
                          disabled={completado}
                          onChange={() =>
                            setSeleccionesPorNodo((prev) => ({ ...prev, [nodo.id]: opcion.id }))
                          }
                          className="mt-1 accent-[#2D6CDF]"
                        />
                        <span className="text-sm leading-relaxed min-w-0">
                          <TextoConTerminos texto={opcion.texto} />
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Correo de consecuencia si respondió incorrectamente */}
                {correoError && !completado && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-rose-200 bg-rose-50/60 overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-rose-100/70 border-b border-rose-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-rose-900">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-semibold">
                          Mensaje urgente · De: {correoError.remitente} ({correoError.cargoRemitente})
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-rose-800">
                        Efecto: {correoError.impactoEtiqueta}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5 text-sm text-rose-950">
                      <p className="font-semibold">Asunto: {correoError.asunto}</p>
                      <p className="text-slate-800 leading-relaxed">
                        <TextoConTerminos texto={correoError.cuerpo} />
                      </p>
                      <p className="text-xs text-rose-800 font-medium pt-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Tranquilo: revisa la gráfica o las pistas arriba y prueba otra opción.
                      </p>
                    </div>
                  </div>
                )}

                {/* Validación correcta */}
                {completado && opcionCorrecta && (
                  <div className="space-y-3">
                    <div className="w-full rounded-xl bg-emerald-50/80 border border-emerald-200 p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                          Decisión correcta
                        </p>
                        {opcionCorrecta.impactoMetricas && (
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-200 tabular-nums">
                            {[
                              opcionCorrecta.impactoMetricas.disponibilidad
                                ? `Entran sin error ${opcionCorrecta.impactoMetricas.disponibilidad > 0 ? '+' : ''}${opcionCorrecta.impactoMetricas.disponibilidad} de cada 100`
                                : null,
                              opcionCorrecta.impactoMetricas.latenciaMs
                                ? `Tiempo ${formatearDeltaSegundos(opcionCorrecta.impactoMetricas.latenciaMs)}`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        )}
                      </div>
                      <p className="w-full text-sm text-emerald-950 leading-relaxed">
                        <TextoConTerminos texto={opcionCorrecta.explicacionCorrecta || ''} />
                      </p>
                    </div>

                    {idx < reto.nodos.length - 1 && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setNodoVisibleIdx(idx + 1);
                            const siguienteId = `decision-${reto.nodos[idx + 1].id}`;
                            window.setTimeout(() => {
                              document
                                .getElementById(siguienteId)
                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 60);
                          }}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Ir al siguiente paso
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Botón Comprobar */}
                {!completado && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!opcionElegidaId}
                      onClick={() => manejarComprobar(idx)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] disabled:opacity-45 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      Probar esta decisión
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Historial breve de correos recibidos en la sesión si hubo errores */}
        {correosRecibidos.length > 0 && (
          <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Mensajes que recibiste en la práctica ({correosRecibidos.length} {correosRecibidos.length === 1 ? 'aviso' : 'avisos'})
            </p>
            <div className="space-y-1.5">
              {correosRecibidos.map((c) => (
                <div
                  key={c.id}
                  className="text-xs text-[#1E293B] flex flex-wrap items-center justify-between gap-2 py-1 border-b border-[#E2E8F0] last:border-b-0"
                >
                  <span>
                    <strong className="text-[#0F172A]">{c.remitente}:</strong> {c.asunto}
                  </span>
                  <span className="font-mono text-rose-700">{c.impactoEtiqueta}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Compuerta hacia Tu Plan Final */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E2E8F0]">
        <p className="text-xs text-[#64748B]">
          {todosNodosCompletados
            ? 'Todos los pasos están listos. Ya puedes enviar tu plan final a Mateo.'
            : 'Completa los 3 pasos en orden para abrir tu plan final.'}
        </p>
        <button
          type="button"
          disabled={!todosNodosCompletados}
          onClick={onAvanzar}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          Ir a mi plan final
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal de herramientas reales */}
      <ModalHerramientaReal
        herramienta={herramientaModal}
        onClose={() => setHerramientaModal(null)}
      />
    </div>
  );
};
