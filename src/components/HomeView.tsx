import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Gauge,
  Layers,
  Network,
  Play,
  PlayCircle,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Wrench,
  X,
} from 'lucide-react';
import { AreaCarrera, CargoNivel, Carrera, IconoHerramienta } from '../types/rolelab';
import { TerminoTecnico } from './TerminoTecnico';
import { SidebarNavegacion } from './SidebarNavegacion';

interface HomeViewProps {
  carreras: Carrera[];
  carreraSeleccionadaId: string | null;
  tieneProgresoActivo: boolean;
  menuLateralAbierto: boolean;
  onCerrarMenuLateral: () => void;
  onSeleccionarCarrera: (carreraId: string | null) => void;
  onEntrarReto: (retoId: string) => void;
}

const AREAS_FILTRO: Array<'Todas' | AreaCarrera> = [
  'Todas',
  'Tecnología & Cloud',
  'Datos & Analítica',
  'Operaciones & Negocio',
];

function renderIconoHerramienta(icono: IconoHerramienta) {
  const props = { className: 'w-4 h-4 text-[#2D6CDF] shrink-0', 'aria-hidden': true as const };
  switch (icono) {
    case 'activity':
      return <Activity {...props} />;
    case 'terminal':
      return <Terminal {...props} />;
    case 'database':
      return <Database {...props} />;
    case 'gauge':
      return <Gauge {...props} />;
    case 'shield':
      return <ShieldCheck {...props} />;
    case 'layers':
      return <Layers {...props} />;
    case 'code':
      return <Code2 {...props} />;
    case 'server':
      return <Server {...props} />;
    case 'cpu':
      return <Cpu {...props} />;
    case 'network':
      return <Network {...props} />;
    default:
      return <Wrench {...props} />;
  }
}

function obtenerEmbedUrlYouTube(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    let videoId: string | null = null;

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else if (parsed.pathname.startsWith('/embed/') || parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] || null;
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
  } catch {
    return null;
  }
}

export const HomeView: React.FC<HomeViewProps> = ({
  carreras,
  carreraSeleccionadaId,
  tieneProgresoActivo,
  menuLateralAbierto,
  onCerrarMenuLateral,
  onSeleccionarCarrera,
  onEntrarReto,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [areaFiltro, setAreaFiltro] = useState<'Todas' | AreaCarrera>('Todas');
  const [nivelPiramideActivo, setNivelPiramideActivo] = useState<1 | 2 | 3 | 4>(1);
  const [cargoModal, setCargoModal] = useState<CargoNivel | null>(null);
  const [videoCargado, setVideoCargado] = useState(false);
  const [carreraPreviewModal, setCarreraPreviewModal] = useState<Carrera | null>(null);
  const [seccionCarreraActiva, setSeccionCarreraActiva] = useState<
    'que-es' | 'actividades' | 'niveles'
  >('que-es');

  const queEsRef = useRef<HTMLDivElement | null>(null);
  const actividadesRef = useRef<HTMLDivElement | null>(null);
  const progresionRef = useRef<HTMLElement | null>(null);
  const manualScrollLockRef = useRef(false);
  const manualScrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setVideoCargado(false);
    setSeccionCarreraActiva('que-es');
  }, [carreraSeleccionadaId]);

  useEffect(() => {
    if (!carreraSeleccionadaId) return;

    const actualizarSeccionPorScroll = () => {
      if (manualScrollLockRef.current) return;

      const offset = 210;
      const alFinalDePagina =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (alFinalDePagina) {
        setSeccionCarreraActiva('niveles');
        return;
      }

      const nivelesTop = progresionRef.current?.getBoundingClientRect().top ?? Infinity;
      const actividadesTop = actividadesRef.current?.getBoundingClientRect().top ?? Infinity;

      if (nivelesTop <= offset) {
        setSeccionCarreraActiva('niveles');
      } else if (actividadesTop <= offset) {
        setSeccionCarreraActiva('actividades');
      } else {
        setSeccionCarreraActiva('que-es');
      }
    };

    window.addEventListener('scroll', actualizarSeccionPorScroll, { passive: true });
    return () => window.removeEventListener('scroll', actualizarSeccionPorScroll);
  }, [carreraSeleccionadaId]);

  useEffect(() => {
    return () => {
      if (manualScrollTimeoutRef.current !== null) {
        window.clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  const irASeccionCarrera = (seccion: 'que-es' | 'actividades' | 'niveles') => {
    setSeccionCarreraActiva(seccion);
    manualScrollLockRef.current = true;
    if (manualScrollTimeoutRef.current !== null) {
      window.clearTimeout(manualScrollTimeoutRef.current);
    }
    manualScrollTimeoutRef.current = window.setTimeout(() => {
      manualScrollLockRef.current = false;
    }, 700);

    const destino =
      seccion === 'que-es'
        ? queEsRef.current
        : seccion === 'actividades'
        ? actividadesRef.current
        : progresionRef.current;

    destino?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!cargoModal) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCargoModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cargoModal]);

  const carreraActiva = useMemo(
    () => carreras.find((c) => c.id === carreraSeleccionadaId) || null,
    [carreras, carreraSeleccionadaId]
  );

  const carrerasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return carreras.filter((c) => {
      const coincideArea = areaFiltro === 'Todas' || c.area === areaFiltro;
      const coincideTexto =
        !q ||
        c.titulo.toLowerCase().includes(q) ||
        c.resumenCorto.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        (c.retoTitulo && c.retoTitulo.toLowerCase().includes(q));
      return coincideArea && coincideTexto;
    });
  }, [carreras, areaFiltro, busqueda]);

  // Vista detalle de carrera + Pirámide interactiva de 4 niveles
  if (carreraActiva) {
    const nivelSeleccionado =
      carreraActiva.piramideProgresion.find((n) => n.nivel === nivelPiramideActivo) ||
      carreraActiva.piramideProgresion[carreraActiva.piramideProgresion.length - 1];

    // Anchos visuales crecientes de cúspide (Nivel 4) a base (Nivel 1)
    const anchosPiramide: Record<number, string> = {
      4: 'w-[62%] sm:w-[58%]',
      3: 'w-[75%] sm:w-[72%]',
      2: 'w-[88%] sm:w-[86%]',
      1: 'w-full',
    };

    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Menú lateral desplegable (drawer en PC y móvil) */}
        <SidebarNavegacion
          abierto={menuLateralAbierto}
          onCerrar={onCerrarMenuLateral}
          titulo={carreraActiva.titulo}
          subtitulo={`${carreraActiva.area} · ${carreraActiva.nivelEntrada}`}
          ariaLabel="Secciones de la carrera"
          onVolver={() => onSeleccionarCarrera(null)}
          items={[
            {
              id: 'que-es',
              titulo: 'Acerca de la profesión',
              activa: seccionCarreraActiva === 'que-es',
              onClick: () => irASeccionCarrera('que-es'),
            },
            {
              id: 'actividades',
              titulo: 'Actividades del día a día',
              activa: seccionCarreraActiva === 'actividades',
              onClick: () => irASeccionCarrera('actividades'),
            },
            {
              id: 'niveles',
              titulo: 'Niveles y retos prácticos',
              activa: seccionCarreraActiva === 'niveles',
              onClick: () => irASeccionCarrera('niveles'),
            },
          ]}
          footer={
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Escenario y perfil profesional simulado con fines educativos.
            </p>
          }
        />

        {/* Columna principal de exploración de la carrera */}
        <div className="space-y-8 min-w-0">
          <div ref={queEsRef} id="seccion-que-es" className="scroll-mt-20 sm:scroll-mt-24 space-y-8">
              {/* Encabezado editorial de la carrera */}
              <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#64748B] mb-2">
                    {carreraActiva.area} · {carreraActiva.duracionEstimada} · {carreraActiva.nivelEntrada}
                  </p>
                  <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
                    {carreraActiva.titulo}
                  </h1>
                </div>

                {carreraActiva.retoTitulo && (
                  <div>
                    <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>
                        <strong className="text-[#0F172A]">Reto inicial (Nivel 1 · Junior):</strong>{' '}
                        {carreraActiva.retoTitulo}
                      </span>
                    </div>
                  </div>
                )}
              </section>

              {/* Acerca de la carrera */}
              <section
                id="acerca-de-carrera"
                className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-10 space-y-10"
              >
          {/* 1. Parte superior: Título y descripción general */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2D6CDF]">
              Conoce acerca de la ingenieria de Software
            </p>
            <div className="mt-4 text-base text-[#475569] leading-relaxed">
              <p> {carreraActiva.acercaDe.queTrata} </p>
            </div>
          </div>

          {/* 2. Video explicativo de la carrera (fachada interactiva antes de cargar el iframe) */}
          {carreraActiva.videoExplicativoUrl && (
            <div className="max-w-4xl mx-auto rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF]/60 p-3 sm:p-4 space-y-3">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A]">
                {videoCargado && obtenerEmbedUrlYouTube(carreraActiva.videoExplicativoUrl) ? (
                  <iframe
                    src={obtenerEmbedUrlYouTube(carreraActiva.videoExplicativoUrl)!}
                    title={`Video explicativo sobre ${carreraActiva.titulo}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src="/assets/aistudio/ciclo-software_98da275d.jpg"
                      alt="Ciclo de vida en Ingeniería de Software: Análisis, Diseño, Código, Pruebas, Mejora y Operación / Soporte"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/10">
                      <button
                        type="button"
                        onClick={() => setVideoCargado(true)}
                        aria-label={`Reproducir video explicativo de ${carreraActiva.titulo}`}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 hover:bg-white text-[#2D6CDF] shadow-xl ring-4 ring-white/20 hover:ring-white/35 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <Play className="w-6 h-6 fill-current ml-0.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#475569]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F172A]">
                  <PlayCircle className="w-4 h-4 text-[#2D6CDF]" />
                  Video explicativo de la carrera
                </span>
                <a
                  href={carreraActiva.videoExplicativoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#2D6CDF] hover:text-[#1D4ED8] underline decoration-[#BFDBFE] underline-offset-4 transition-colors"
                >
                  Si no carga el reproductor, míralo directamente en YouTube
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* 3. Actividades generales que realiza un ingeniero de software (6 tarjetas) */}
          <div
            ref={actividadesRef}
            id="seccion-actividades"
            className="scroll-mt-20 sm:scroll-mt-24 pt-4 border-t border-[#E2E8F0] space-y-8"
          >
            <div className="space-y-1">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2D6CDF]">
                Lo que hace en su día a día
              </p>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Actividades generales que realiza un ingeniero de software
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 pt-4">
              {[
                {
                  titulo: 'Analiza necesidades',
                  descripcion:
                    'identifica problemas y determina qué solución tecnológica se necesita.',
                  icono: Search,
                },
                {
                  titulo: 'Diseña soluciones',
                  descripcion: 'define cómo se organizará y funcionará el software.',
                  icono: Layers,
                },
                {
                  titulo: 'Desarrolla',
                  descripcion: 'escribe código para construir aplicaciones y sistemas.',
                  icono: Code2,
                },
                {
                  titulo: 'Prueba',
                  descripcion:
                    'verifica que el software funcione correctamente y detecta errores.',
                  icono: CheckCircle2,
                },
                {
                  titulo: 'Mantiene y mejora',
                  descripcion:
                    'corrige problemas, incorpora funcionalidades y optimiza el sistema.',
                  icono: RefreshCw,
                },
                {
                  titulo: 'Gestiona su funcionamiento',
                  descripcion:
                    'procura que las aplicaciones estén disponibles, sean seguras y respondan adecuadamente a las necesidades de sus usuarios.',
                  icono: Activity,
                },
              ].map((actividad) => {
                const Icono = actividad.icono;
                return (
                  <article
                    key={actividad.titulo}
                    className="relative bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] px-6 pt-9 pb-6 shadow-xs"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -top-5 left-6 w-11 h-11 rounded-full bg-[#2D6CDF] text-white flex items-center justify-center shadow-sm ring-4 ring-white"
                    >
                      <Icono className="w-5 h-5" />
                    </span>
                    <h4 className="font-sans text-lg font-bold text-[#0F172A]">
                      {actividad.titulo}
                    </h4>
                    <p className="mt-2 text-sm text-[#475569] leading-relaxed">
                      {actividad.descripcion}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
            </div>

        {/* SECCIÓN DESTACADA: Progresión de la carrera (2 columnas: Pirámide izquierda + Ficha de nivel derecha) */}
        <section
          id="progresion-carrera"
          ref={progresionRef}
          className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 space-y-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E2E8F0] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Explora cada etapa profesional · Selecciona cualquier nivel para ver su ficha completa
              </p>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Progresión de la carrera
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-xs font-semibold text-[#1E293B]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Tu punto de partida hoy: Nivel 1 · Graduate / Junior
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna izquierda: Pirámide interactiva de 4 niveles */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <p className="text-xs text-[#64748B] text-center">
                Haz clic en cualquier escalón de la pirámide para cambiar el nivel mostrado a la derecha.
              </p>
              <div className="flex flex-col items-center gap-3 py-1">
                {carreraActiva.piramideProgresion.map((nivel) => {
                  const seleccionado = nivel.nivel === nivelPiramideActivo;
                  const esActivoReto = nivel.activoEnReto;

                  return (
                    <button
                      key={nivel.nivel}
                      type="button"
                      onClick={() => setNivelPiramideActivo(nivel.nivel)}
                      aria-pressed={seleccionado}
                      className={`${anchosPiramide[nivel.nivel]} rounded-2xl px-4 py-4 border text-left transition-all cursor-pointer ${
                        seleccionado
                          ? 'bg-[#2D6CDF] text-white border-[#1D4ED8] shadow-md'
                          : esActivoReto
                          ? 'bg-[#EFF6FF] text-[#0F172A] border-[#2D6CDF]/40 hover:border-[#2D6CDF]'
                          : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${
                            seleccionado ? 'text-blue-100' : 'text-[#64748B]'
                          }`}
                        >
                          Nivel {nivel.nivel} · {nivel.rangoExperiencia}
                        </span>
                        {esActivoReto ? (
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${
                              seleccionado
                                ? 'bg-[#10B981] text-white'
                                : 'bg-[#2D6CDF] text-white'
                            }`}
                          >
                            Simulación activa
                          </span>
                        ) : (
                          <span
                            className={`text-[11px] font-medium ${
                              seleccionado ? 'text-blue-100' : 'text-[#64748B]'
                            }`}
                          >
                            Etapa futura
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 font-sans text-lg font-bold leading-snug">
                        {nivel.titulo}
                      </h3>

                    </button>
                  );
                })}
              </div>
            </div>

            {/* Columna derecha: Ficha del nivel seleccionado */}
            {nivelSeleccionado && (
              <div className="lg:col-span-7 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex flex-col">
                <div className="p-6 sm:p-8 space-y-6">
                  {/* 01 · Nivel seleccionado */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2D6CDF]">
                        01 · Nivel seleccionado · Nivel {nivelSeleccionado.nivel} ({nivelSeleccionado.rangoExperiencia})
                      </span>
                      {nivelSeleccionado.experienciaPractica.disponible ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          Simulación activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1 rounded-xl">
                          <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                          Etapa futura
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#0F172A]">
                      Nivel {nivelSeleccionado.nivel}: {nivelSeleccionado.titulo}
                    </h3>
                    <p className="text-xs font-medium text-[#475569]">
                      Experiencia habitual: <span className="font-mono text-[#0F172A]">{nivelSeleccionado.rangoExperiencia}</span>
                    </p>
                  </div>

                  {/* 02 · Así es el trabajo en esta etapa */}
                  <div className="pt-5 border-t border-[#E2E8F0] space-y-2">
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]">
                      02 · Así es el trabajo en esta etapa
                    </p>
                    <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                      {nivelSeleccionado.descripcionEtapa}
                    </p>
                  </div>

                  {/* 03 · Habilidades clave (chips inactivos estilo selector) */}
                  <div className="pt-5 border-t border-[#E2E8F0] space-y-3">
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]">
                      03 · Habilidades clave
                    </p>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Habilidades clave del nivel">
                      {nivelSeleccionado.diferenciacion.habilidades.map((hab) => (
                        <button
                          key={hab}
                          type="button"
                          disabled
                          aria-disabled="true"
                          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#1E293B] cursor-default select-none"
                        >
                          {hab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 04 · Cargos y roles disponibles */}
                  <div className="pt-5 border-t border-[#E2E8F0] space-y-3">
                    <div>
                      <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]">
                        04 · Cargos y roles disponibles
                      </p>
                      <p className="mt-1 text-xs text-[#475569]">
                        Haz clic en cualquier cargo para ver qué hace en su jornada, qué problemas resuelve y sus herramientas.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {nivelSeleccionado.cargosDisponibles.map((cargo) => (
                        <button
                          key={cargo.id}
                          type="button"
                          onClick={() => setCargoModal(cargo)}
                          className="group w-full bg-white rounded-xl border border-[#E2E8F0] hover:border-[#2D6CDF] px-4 py-3.5 text-left transition-all cursor-pointer flex items-center justify-between gap-4"
                        >
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2D6CDF]">
                              {cargo.titulo}
                            </h4>
                            <p className="text-xs text-[#475569] leading-relaxed">
                              {cargo.descripcionBreve}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6CDF] shrink-0 whitespace-nowrap">
                            Ver ficha
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 05 · Barra inferior anclada/flotante · Experiencia práctica */}
                <div className="lg:sticky lg:bottom-0 z-20 bg-white/95 backdrop-blur-sm border-t border-[#E2E8F0] rounded-b-2xl px-6 py-4 sm:px-8 sm:py-5 lg:shadow-[0_-10px_28px_-14px_rgba(15,23,42,0.14)] space-y-2.5">
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]">
                    05 · Experiencia práctica · Experimenta un día en este rol
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A]">
                        Reto: {nivelSeleccionado.experienciaPractica.tituloReto}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-xs font-mono text-[#475569]">
                        <Clock className="w-3.5 h-3.5 text-[#2D6CDF]" />
                        <span>
                          <strong className="font-sans text-[#0F172A]">Duración estimada:</strong>{' '}
                          {nivelSeleccionado.experienciaPractica.duracionEstimada}
                        </span>
                      </p>
                    </div>

                    {nivelSeleccionado.experienciaPractica.disponible && carreraActiva.retoId ? (
                      <button
                        type="button"
                        onClick={() => onEntrarReto(carreraActiva.retoId!)}
                        className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Experimenta este rol
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] cursor-not-allowed whitespace-nowrap"
                      >
                        Experimenta este rol
                      </button>
                    )}
                  </div>

                  {!nivelSeleccionado.experienciaPractica.disponible &&
                    nivelSeleccionado.experienciaPractica.notaEstado && (
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        {nivelSeleccionado.experienciaPractica.notaEstado}
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
        </section>
        </div>

        {/* Modal de ficha de cargo (Únicamente 3 secciones: Jornada, Problemas, Herramientas) */}
        {cargoModal && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-xs"
            onClick={() => setCargoModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cargo-modal-titulo"
          >
            <div
              className="w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xl space-y-6 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2D6CDF]">
                    Nivel {nivelSeleccionado?.nivel} · {nivelSeleccionado?.titulo}
                  </p>
                  <h3
                    id="cargo-modal-titulo"
                    className="mt-1 font-sans text-2xl font-bold text-[#0F172A]"
                  >
                    {cargoModal.titulo}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCargoModal(null)}
                  aria-label="Cerrar ficha del cargo"
                  className="p-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sección 1: ¿Qué hace en su jornada? */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-semibold text-[#0F172A]">
                  1. ¿Qué hace en su jornada?
                </h4>
                <ul className="space-y-2 text-sm text-[#475569] leading-relaxed">
                  {cargoModal.queHaceEnJornada.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-[#2D6CDF] font-bold mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sección 2: ¿Qué tipo de problemas resuelve? */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
                <h4 className="text-sm font-semibold text-[#0F172A]">
                  2. ¿Qué tipo de problemas resuelve?
                </h4>
                <ul className="space-y-2 text-sm text-[#475569] leading-relaxed">
                  {cargoModal.problemasQueResuelve.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-[#2D6CDF] font-bold mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sección 3 (al final del modal): Herramientas que utiliza */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">
                    3. Herramientas que utiliza
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Pasa el cursor o haz clic sobre cada herramienta subrayada para ver su analogía en palabras sencillas.
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {cargoModal.herramientas.map((herramienta) => (
                    <li
                      key={`${cargoModal.id}-${herramienta.nombre}`}
                      className="flex items-start gap-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5"
                    >
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 mt-0.5">
                        {renderIconoHerramienta(herramienta.icono)}
                      </span>
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-sm font-semibold text-[#0F172A]">
                          <TerminoTecnico
                            palabra={herramienta.terminoGlosario}
                            etiqueta={herramienta.nombre}
                            definicion={herramienta.definicionAnalogia}
                            align="left"
                          />
                        </div>
                        <p className="text-xs text-[#475569] leading-relaxed">
                          {herramienta.resumenUso}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista dedicada de Carreras Universitarias · Catálogo y exploración
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* Encabezado de Carreras Universitarias */}
      <section className="space-y-3 max-w-3xl">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2D6CDF]">
          Carreras universitarias · Exploración por áreas
        </p>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight tracking-tight">
          Explora carreras universitarias por dentro
        </h1>
        <p className="text-base text-[#475569] leading-relaxed">
          Elige una carrera para descubrir de qué trata, sus actividades del día a día, cómo avanza por niveles profesionales y qué retos prácticos puedes experimentar.
        </p>
      </section>

      {/* Buscador + Filtros por área */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#E2E8F0]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar carrera, área o reto (ej. Cloud, Datos, Caída a las 8:00 a.m.)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {AREAS_FILTRO.map((area) => {
            const activo = areaFiltro === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setAreaFiltro(area)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activo
                    ? 'bg-[#2D6CDF] text-white'
                    : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tarjetas de carreras estilo carpeta/ficha moderna */}
      <section aria-label="Carreras disponibles">
        {carrerasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center space-y-3">
            <p className="font-sans font-bold text-xl text-[#0F172A]">
              No encontramos carreras que coincidan con “{busqueda}”
            </p>
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setAreaFiltro('Todas');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8]"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carrerasFiltradas.map((carrera, idx) => (
              <article
                key={carrera.id}
                className={`group relative flex flex-col justify-between bg-white rounded-2xl border transition-all ${
                  carrera.activa
                    ? 'border-[#2D6CDF]/30 shadow-sm hover:shadow-md'
                    : 'border-[#E2E8F0] opacity-95'
                }`}
              >
                {/* Pestaña superior estilo carpeta */}
                <div className="px-6 pt-5 pb-3 border-b border-[#E2E8F0] flex items-center justify-between gap-2 bg-[#EFF6FF]/65 rounded-t-2xl">
                  <span className="text-xs font-mono font-medium text-[#475569]">
                    0{idx + 1}. {carrera.area}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      carrera.activa ? 'text-[#10B981]' : 'text-[#64748B]'
                    }`}
                  >
                    {carrera.activa ? 'Disponible ahora' : 'Vista previa'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    {carrera.activa && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] mb-3">
                        <img
                          src={carrera.imagenPortada}
                          alt={carrera.titulo}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                      {carrera.titulo}
                    </h2>
                    
                    <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {carrera.duracionEstimada}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {carrera.nivelEntrada}
                      </span>
                    </div>

                    {carrera.activa && carrera.retoTitulo && (
                      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2D6CDF]">
                          Reto disponible
                        </p>
                        <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                          “{carrera.retoTitulo}” · EduCloud Live
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    {carrera.activa ? (
                      <button
                        type="button"
                        onClick={() => onSeleccionarCarrera(carrera.id)}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {tieneProgresoActivo ? 'Explorar carrera y continuar' : 'Explorar carrera'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCarreraPreviewModal(carrera)}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Ver avance
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Nota transparente educativa */}
      <footer className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
        <span>
          RoleLab · Escenarios, empresas y perfiles profesionales simulados con fines educativos.
        </span>
        <span>Tu avance se guarda localmente en tu navegador sin necesidad de cuenta.</span>
      </footer>

      {/* Modal vista previa para carreras próximas */}
      {carreraPreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs"
          onClick={() => setCarreraPreviewModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-1">
                  Próximamente · {carreraPreviewModal.area}
                </p>
                <h3 className="font-sans text-2xl font-bold text-[#0F172A]">
                  {carreraPreviewModal.titulo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCarreraPreviewModal(null)}
                aria-label="Cerrar vista previa"
                className="p-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#475569] leading-relaxed">
              {carreraPreviewModal.acercaDe.queTrata}
            </p>

            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Habilidades que pondrás a prueba
              </p>
              <ul className="space-y-1.5 text-sm text-[#475569]">
                {carreraPreviewModal.acercaDe.habilidadesClave.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="font-bold text-[#2D6CDF]">·</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setCarreraPreviewModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setCarreraPreviewModal(null);
                  onSeleccionarCarrera('ingenieria-software-cloud');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2D6CDF] text-white hover:bg-[#1D4ED8]"
              >
                Probar reto activo ahora
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
