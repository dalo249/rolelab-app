import React from 'react';
import { ArrowRight, CheckSquare, FileText, Sparkles } from 'lucide-react';
import { PropuestaFinalData, Reto } from '../../types/rolelab';
import { TerminoTecnico, TextoConTerminos } from '../TerminoTecnico';

interface Stage3PropuestaProps {
  reto: Reto;
  propuesta: PropuestaFinalData;
  onActualizarPropuesta: (patch: Partial<PropuestaFinalData>) => void;
  onEnviarYAnalizar: () => void;
  cargandoIA: boolean;
}

function contarPalabras(texto: string): number {
  const limpio = texto.trim();
  if (!limpio) return 0;
  return limpio.split(/\s+/).length;
}

export const Stage3Propuesta: React.FC<Stage3PropuestaProps> = ({
  reto,
  propuesta,
  onActualizarPropuesta,
  onEnviarYAnalizar,
  cargandoIA,
}) => {
  const formularioCompleto =
    Boolean(propuesta.ordenPrioridadId) &&
    Boolean(propuesta.tradeOffId) &&
    propuesta.problemaYEvidencias.trim().length >= 20 &&
    propuesta.recomendacionYOrden.trim().length >= 20 &&
    propuesta.riesgoCalidadYLimitesIA.trim().length >= 20;

  return (
    <div className="space-y-8">
      <header className="space-y-2.5">
        <p className="text-xs font-medium text-slate-500">
          Parte 3 · Tu plan final para Mateo
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0F172A]">
          Presenta tu plan a Mateo
        </h1>
        <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
          Elige en qué orden actuarías, qué pequeño sacrificio (<TerminoTecnico palabra="Trade-off" etiqueta="cesión temporal" />) aceptas hoy y resume lo que encontraste con tus propias palabras.
        </p>
      </header>

      {/* Paso 3A: Selectores estructurados de criterio */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4">
          <CheckSquare className="w-5 h-5 text-[#16263B]" />
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
              Paso 3A · Elige el orden y el sacrificio principal
            </h2>
            <p className="text-xs text-slate-500">
              Define qué harías primero, qué va después y qué detalle aceptas ceder hoy para salvar las clases.
            </p>
          </div>
        </div>

        {/* Orden de prioridad de 3 pasos */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#0F172A]">
            1. ¿En qué orden actuarías hoy? (3 pasos)
          </h3>
          <div className="space-y-2.5">
            {reto.opcionesOrdenPrioridad.map((opcion) => {
              const seleccionada = propuesta.ordenPrioridadId === opcion.id;
              return (
                <label
                  key={opcion.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    seleccionada
                      ? 'bg-[#EFECE6]/70 border-[#16263B] text-[#0F172A]'
                      : 'bg-[#F9F8F6] border-[#E5E7EB] hover:bg-[#EFECE6]/35 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="orden-prioridad"
                    checked={seleccionada}
                    onChange={() =>
                      onActualizarPropuesta({
                        ordenPrioridadId: opcion.id,
                        ordenPrioridadTexto: opcion.etiqueta,
                      })
                    }
                    className="mt-1 accent-[#16263B]"
                  />
                  <span className="text-sm leading-relaxed">
                    <TextoConTerminos texto={opcion.etiqueta} />
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Selector de Trade-off */}
        <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-[#0F172A]">
            2. ¿Qué pequeño sacrificio aceptas hoy? (<TerminoTecnico palabra="Trade-off" etiqueta="cesión temporal" />)
          </h3>
          <div className="space-y-2.5">
            {reto.opcionesTradeOff.map((opcion) => {
              const seleccionada = propuesta.tradeOffId === opcion.id;
              return (
                <label
                  key={opcion.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    seleccionada
                      ? 'bg-[#EFECE6]/70 border-[#16263B] text-[#0F172A]'
                      : 'bg-[#F9F8F6] border-[#E5E7EB] hover:bg-[#EFECE6]/35 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="tradeoff-principal"
                    checked={seleccionada}
                    onChange={() =>
                      onActualizarPropuesta({
                        tradeOffId: opcion.id,
                        tradeOffTexto: opcion.etiqueta,
                      })
                    }
                    className="mt-1 accent-[#16263B]"
                  />
                  <span className="text-sm leading-relaxed">
                    <TextoConTerminos texto={opcion.etiqueta} />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* Paso 3B: Cajas de redacción abierta breve */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4">
          <FileText className="w-5 h-5 text-[#16263B]" />
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0F172A]">
              Paso 3B · Explica tu plan con tus palabras
            </h2>
            <p className="text-xs text-slate-500">
              Escribe sencillo y directo, como se lo contarías a un compañero (mínimo 20 caracteres por caja).
            </p>
          </div>
        </div>

        {/* Caja 1 */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="prop-evidencias" className="text-sm font-semibold text-[#0F172A]">
              1. ¿Qué causó la caída y qué 2 datos lo demuestran?
            </label>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {contarPalabras(propuesta.problemaYEvidencias)} palabras
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cuenta qué se llenó (<TerminoTecnico palabra="Connection Pool" etiqueta="100 ventanillas" />) y cita dos números reales que viste en la gráfica y en los registros.
          </p>
          <textarea
            id="prop-evidencias"
            rows={4}
            value={propuesta.problemaYEvidencias}
            onChange={(e) => onActualizarPropuesta({ problemaYEvidencias: e.target.value })}
            placeholder="Ej: Se llenaron las 100 ventanillas de datos porque el historial hacía 420 preguntas seguidas por clic. A las 08:00 a.m. la espera subió a 2.4 s y falló el 18.4%..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9F8F6] p-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16263B]"
          />
        </div>

        {/* Caja 2 */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="prop-recomendacion" className="text-sm font-semibold text-[#0F172A]">
              2. ¿Qué harías primero, qué revisarías después y qué arreglarías al final?
            </label>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {contarPalabras(propuesta.recomendacionYOrden)} palabras
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Explica tu alivio rápido (copia temporal de 60 s y límite de recargas), qué comprobarías para saber que funcionó y el arreglo de fondo.
          </p>
          <textarea
            id="prop-recomendacion"
            rows={4}
            value={propuesta.recomendacionYOrden}
            onChange={(e) => onActualizarPropuesta({ recomendacionYOrden: e.target.value })}
            placeholder="Ej: Primero pondría una copia rápida de 60 segundos solo para leer el historial y limitaría recargas; luego revisaría que bajen los errores antes de corregir el código..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9F8F6] p-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16263B]"
          />
        </div>

        {/* Caja 3 */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="prop-riesgo" className="text-sm font-semibold text-[#0F172A]">
              3. ¿Qué molestia aceptas hoy, cómo proteges los datos y cómo fallaría una IA?
            </label>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {contarPalabras(propuesta.riesgoCalidadYLimitesIA)} palabras
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aclara cómo evitas perder asistencias nuevas y por qué una IA automática podría dar una <TerminoTecnico palabra="Falso positivo" etiqueta="falsa alarma" /> a las 08:00 a.m.
          </p>
          <textarea
            id="prop-riesgo"
            rows={4}
            value={propuesta.riesgoCalidadYLimitesIA}
            onChange={(e) => onActualizarPropuesta({ riesgoCalidadYLimitesIA: e.target.value })}
            placeholder="Ej: Acepto que el historial viejo tarde 60 s en actualizarse, pero guardo directo cada asistencia nueva para no perderla. Una IA podría bloquear estudiantes reales creyendo que es un ataque..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9F8F6] p-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16263B]"
          />
        </div>
      </section>

      {/* Botón Enviar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-500">
          {formularioCompleto
            ? 'Tu plan está listo para que la IA lo revise como tu líder de equipo.'
            : 'Elige ambas opciones del Paso 3A y escribe en las 3 cajas del Paso 3B para continuar.'}
        </p>
        <button
          type="button"
          disabled={!formularioCompleto || cargandoIA}
          onClick={onEnviarYAnalizar}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#16263B] text-white hover:bg-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          {cargandoIA
            ? 'Revisando tu plan...'
            : 'Enviar plan y ver opinión de la IA'}
          {!cargandoIA && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
