import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Carrera } from '../types/rolelab';

interface RetosViewProps {
  carreras: Carrera[];
  tieneProgresoActivo: boolean;
  onEntrarReto: (retoId: string) => void;
}

interface RetoCatalogoItem {
  id: string;
  carreraId: string;
  carreraTitulo: string;
  nivelLabel: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  disponible: boolean;
  retoId?: string;
}

const RETOS_POR_CARRERA: Record<string, Omit<RetoCatalogoItem, 'carreraId' | 'carreraTitulo'>[]> = {
  'ingenieria-software-cloud': [
    {
      id: 'cs-caida-8am',
      nivelLabel: 'Nivel 1 · Junior (0–2 años)',
      titulo: 'Caída a las 8:00 a. m.',
      descripcion:
        'Miles de estudiantes intentan entrar a clase y la plataforma falla. Investiga gráficas y logs, toma decisiones seguras y presenta un plan sin disparar costos.',
      duracion: '20–30 min',
      disponible: true,
      retoId: 'cs-caida-8am',
    },
  ],
  'ciencia-datos-producto': [
    {
      id: 'ds-abandono-registros',
      nivelLabel: 'Nivel 1 · Junior (0–2 años)',
      titulo: 'Caída repentina de registros en la app',
      descripcion:
        'Las inscripciones bajaron tras una actualización reciente. Analizarás métricas de uso y encuestas para identificar dónde abandonan las personas y qué ajustar.',
      duracion: '15–20 min',
      disponible: false,
    },
  ],
  'ingenieria-industrial-operaciones': [
    {
      id: 'ii-cuello-botella-entregas',
      nivelLabel: 'Nivel 1 · Junior (0–2 años)',
      titulo: 'Cuello de botella en entregas del día',
      descripcion:
        'Los pedidos se duplicaron en pocas horas y las rutas empezaron a retrasarse. Reorganizarás tiempos, turnos y recursos para cumplir a tiempo sin exceder el presupuesto.',
      duracion: '15–20 min',
      disponible: false,
    },
  ],
};

export const RetosView: React.FC<RetosViewProps> = ({
  carreras,
  tieneProgresoActivo,
  onEntrarReto,
}) => {
  const [carreraFiltroId, setCarreraFiltroId] = useState<'todas' | string>('todas');

  const seccionesCarreras = useMemo(() => {
    const carrerasVisibles =
      carreraFiltroId === 'todas'
        ? carreras
        : carreras.filter((c) => c.id === carreraFiltroId);

    return carrerasVisibles.map((carrera) => {
      const itemsBase = RETOS_POR_CARRERA[carrera.id] || [
        {
          id: `${carrera.id}-proximo`,
          nivelLabel: 'Nivel 1 · Junior (0–2 años)',
          titulo: carrera.retoTitulo || 'Caso práctico en preparación',
          descripcion: carrera.resumenCorto,
          duracion: carrera.duracionEstimada,
          disponible: Boolean(carrera.activa && carrera.retoId),
          retoId: carrera.retoId,
        },
      ];

      const retos: RetoCatalogoItem[] = itemsBase.map((item) => ({
        ...item,
        carreraId: carrera.id,
        carreraTitulo: carrera.titulo,
      }));

      const tieneRetoDisponible = retos.some((r) => r.disponible);

      return {
        carrera,
        retos,
        tieneRetoDisponible,
      };
    });
  }, [carreras, carreraFiltroId]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* Introducción breve */}
      <section className="space-y-3 max-w-3xl">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2D6CDF]">
          Retos profesionales · Simulación práctica
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
          Elige un reto y pon a prueba tu criterio
        </h1>
        <p className="text-base text-[#475569] leading-relaxed">
          Al elegir un reto, asumirás un rol dentro de una empresa y enfrentarás un problema real según la carrera que seleccionaste y el nivel profesional.
        </p>
      </section>

      {/* Filtro por carrera */}
      <section
        aria-label="Filtrar retos por carrera"
        className="bg-white p-3 rounded-2xl border border-[#E2E8F0]"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setCarreraFiltroId('todas')}
            aria-pressed={carreraFiltroId === 'todas'}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              carreraFiltroId === 'todas'
                ? 'bg-[#2D6CDF] text-white'
                : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2D6CDF]'
            }`}
          >
            Todas
          </button>

          {carreras.map((carrera) => {
            const activo = carreraFiltroId === carrera.id;
            return (
              <button
                key={carrera.id}
                type="button"
                onClick={() => setCarreraFiltroId(carrera.id)}
                aria-pressed={activo}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activo
                    ? 'bg-[#2D6CDF] text-white'
                    : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2D6CDF]'
                }`}
              >
                {carrera.titulo}
              </button>
            );
          })}
        </div>
      </section>

      {/* Secciones agrupadas por carrera */}
      <div className="space-y-8">
        {seccionesCarreras.map(({ carrera, retos, tieneRetoDisponible }) => (
          <section
            key={carrera.id}
            aria-labelledby={`seccion-carrera-${carrera.id}`}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
              <div className="space-y-1">
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]">
                  {carrera.area}
                </p>
                <h2
                  id={`seccion-carrera-${carrera.id}`}
                  className="font-sans text-xl sm:text-2xl font-bold text-[#0F172A]"
                >
                  {carrera.titulo}
                </h2>
              </div>

              {tieneRetoDisponible ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  Reto disponible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                  Próximamente
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {retos.map((reto) => (
                <article
                  key={reto.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 sm:p-6 space-y-5 transition-all ${
                    reto.disponible
                      ? 'bg-[#F8FAFC] border-[#2D6CDF]/30 shadow-xs'
                      : 'bg-[#F8FAFC]/70 border-[#E2E8F0]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* 1. Carrera y nivel */}
                    <p className="text-xs font-medium text-[#475569] leading-snug">
                      {reto.carreraTitulo} ·{' '}
                      <span className="font-mono text-[#0F172A]">{reto.nivelLabel}</span>
                    </p>

                    {/* 2. Título del reto */}
                    <h3 className="font-sans text-xl font-bold text-[#0F172A] leading-snug">
                      {reto.titulo}
                    </h3>

                    {/* 3. Descripción breve (1–2 líneas) */}
                    <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">
                      {reto.descripcion}
                    </p>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-[#E2E8F0]">
                    {/* 4. Duración estimada y estado */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#475569]">
                        <Clock className="w-3.5 h-3.5 text-[#2D6CDF]" />
                        {reto.duracion}
                      </span>

                      {reto.disponible ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                          Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-0.5 rounded-lg">
                          Próximamente
                        </span>
                      )}
                    </div>

                    {/* 5. Botón de acción */}
                    {reto.disponible && reto.retoId ? (
                      <button
                        type="button"
                        onClick={() => onEntrarReto(reto.retoId!)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {tieneProgresoActivo ? 'Continuar reto' : 'Iniciar reto'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-200 text-slate-500 cursor-not-allowed whitespace-nowrap"
                      >
                        Próximamente
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
