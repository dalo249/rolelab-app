import React from 'react';
import { ArrowRight, Briefcase, Compass, Sparkles } from 'lucide-react';

interface LandingHomeViewProps {
  onExplorarCarreras: () => void;
  onExplorarRetos: () => void;
}

const PASOS_ORIENTACION = [
  {
    numero: '01',
    titulo: 'Explora la carrera',
    descripcion:
      'Conoce de qué trata cada profesión, qué actividades hace y cómo se crece a nivel profesional.',
    icono: Compass,
  },
  {
    numero: '02',
    titulo: 'Asume un rol en un reto',
    descripcion:
      'Entra a una empresa simulada y resuelve un problema real según tu nivel profesional.',
    icono: Briefcase,
  },
  {
    numero: '03',
    titulo: 'Forma tu percepción',
    descripcion:
      'Evalúa si ese tipo de trabajo te gusta y si es una opción para tu carrera profesional.',
    icono: Sparkles,
  },
];

export const LandingHomeView: React.FC<LandingHomeViewProps> = ({
  onExplorarCarreras,
  onExplorarRetos,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Portada editorial de orientación vocacional (2 columnas) */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna izquierda: contenido introductorio */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2D6CDF]">
              RoleLab · Orientación vocacional práctica · Sin registro
            </p>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0F172A] leading-[1.15] tracking-tight">
              Conoce profesiones y decide si te gustaría dedicarte a ellas
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl">
              Si tienes dudas sobre qué carrera estudiar, aquí puedes descubrir qué hace realmente cada profesión y mediante retos enfrentar cómo se siente trabajar en una empresa real.
            </p>
          </div>

          {/* Columna derecha: imagen contextual de trabajo en equipo */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#EFF6FF]">
              <img
                src="/src/assets/images/home_estudiantes_proyecto_1795289931906.jpg"
                alt="Tres jóvenes trabajando en un proyecto alrededor de una mesa con una laptop y cuadernos"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mecánica en 3 pasos concisos */}
      <section aria-labelledby="como-funciona-titulo" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="como-funciona-titulo"
            className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]"
          >
            Cómo funciona en 3 pasos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PASOS_ORIENTACION.map((paso) => {
            const Icono = paso.icono;
            return (
              <article
                key={paso.numero}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono font-semibold text-[#64748B]">
                    Paso {paso.numero}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2D6CDF]">
                    <Icono className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>

                <h3 className="font-sans text-xl font-bold text-[#0F172A] leading-snug">
                  {paso.titulo}
                </h3>

                <p className="text-sm text-[#475569] leading-relaxed">
                  {paso.descripcion}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Llamados a la acción debajo de las cards */}
      <section aria-label="Acciones principales" className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onExplorarCarreras}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          Explorar carreras universitarias
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onExplorarRetos}
          className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-[#1E293B] bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors cursor-pointer whitespace-nowrap"
        >
          Ir directo a retos
        </button>
      </section>

      {/* Nota transparente educativa */}
      <footer className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
        <span>
          RoleLab · Escenarios, empresas y perfiles profesionales simulados con fines educativos.
        </span>
        <span>Tu avance se guarda localmente en este navegador sin necesidad de cuenta.</span>
      </footer>
    </div>
  );
};
