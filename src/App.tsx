import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { CARRERAS, RETOS } from './data/retosData';
import { HomeView } from './components/HomeView';
import { LandingHomeView } from './components/LandingHomeView';
import { RetosView } from './components/RetosView';
import { WorkspaceView } from './components/WorkspaceView';
import {
  CorreoConsecuencia,
  ImpactoMetrica,
  OpcionNodo,
  ProgresoGuardado,
  PropuestaFinalData,
} from './types/rolelab';
import { evaluarPropuestaConIA } from './services/geminiEvaluator';
import { formatearDeltaSegundos } from './utils/metricasFormato';

const STORAGE_KEY = 'rolelab_progreso_v1';

const RETO_INICIAL = RETOS[0];

function crearEstadoInicial(): ProgresoGuardado {
  return {
    retoActivoId: null,
    etapaActual: 0,
    metricasActuales: { ...RETO_INICIAL.metricasIniciales },
    nodosCompletados: [],
    historialErrores: [],
    correosRecibidos: [],
    propuestaFinal: {
      ordenPrioridadId: '',
      ordenPrioridadTexto: '',
      tradeOffId: '',
      tradeOffTexto: '',
      problemaYEvidencias: '',
      recomendacionYOrden: '',
      riesgoCalidadYLimitesIA: '',
    },
    evaluacionIA: null,
  };
}

function cargarProgresoGuardado(): ProgresoGuardado {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return crearEstadoInicial();
    const parsed = JSON.parse(raw) as Partial<ProgresoGuardado>;
    const base = crearEstadoInicial();
    const evaluacionValida =
      parsed.evaluacionIA &&
      parsed.evaluacionIA.origen === 'gemini-api' &&
      Array.isArray(parsed.evaluacionIA.efectoDomino) &&
      Array.isArray(parsed.evaluacionIA.habilidades) &&
      parsed.evaluacionIA.habilidades.length > 0 &&
      typeof parsed.evaluacionIA.habilidades[0]?.queSignifica === 'string' &&
      Boolean(parsed.evaluacionIA.vidaReal?.queSeHace) &&
      Boolean(parsed.evaluacionIA.brujulaAfinidad?.teGustaraSi)
        ? parsed.evaluacionIA
        : null;

    const etapaSegura =
      typeof parsed.etapaActual === 'number' && !Number.isNaN(parsed.etapaActual)
        ? Math.min(4, Math.max(0, parsed.etapaActual))
        : 0;

    return {
      ...base,
      ...parsed,
      etapaActual: etapaSegura,
      metricasActuales: parsed.metricasActuales || base.metricasActuales,
      nodosCompletados: Array.isArray(parsed.nodosCompletados) ? parsed.nodosCompletados : [],
      historialErrores: Array.isArray(parsed.historialErrores) ? parsed.historialErrores : [],
      correosRecibidos: Array.isArray(parsed.correosRecibidos) ? parsed.correosRecibidos : [],
      propuestaFinal: { ...base.propuestaFinal, ...(parsed.propuestaFinal || {}) },
      evaluacionIA: evaluacionValida,
    };
  } catch {
    return crearEstadoInicial();
  }
}

export default function App() {
  const [progreso, setProgreso] = useState<ProgresoGuardado>(() => cargarProgresoGuardado());
  const [vistaPrincipal, setVistaPrincipal] = useState<'home' | 'carreras' | 'retos'>('home');
  const [carreraSeleccionadaId, setCarreraSeleccionadaId] = useState<string | null>(null);
  const [ultimoImpactoBadge, setUltimoImpactoBadge] = useState<{
    texto: string;
    positivo: boolean;
  } | null>(null);
  const [cargandoIA, setCargandoIA] = useState(false);
  const [errorEvaluacionIA, setErrorEvaluacionIA] = useState<string | null>(null);
  const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);

  const retoActivo = RETOS.find((r) => r.id === progreso.retoActivoId) || RETO_INICIAL;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
    } catch {
      // Ignora error si localStorage está restringido
    }
  }, [progreso]);

  // Calcular etapa máxima desbloqueada secuencialmente
  const calcularEtapaMaxima = (): number => {
    if (progreso.evaluacionIA) return 4;
    if (progreso.nodosCompletados.length >= retoActivo.nodos.length) {
      return Math.min(4, Math.max(3, progreso.etapaActual));
    }
    return Math.min(4, Math.max(progreso.etapaActual, 0));
  };

  const etapaMaximaDesbloqueada = calcularEtapaMaxima();

  const aplicarImpactoMetricas = (
    actual: ProgresoGuardado['metricasActuales'],
    impacto?: ImpactoMetrica
  ) => {
    if (!impacto) return actual;
    return {
      ...actual,
      disponibilidad: Math.max(
        25,
        Math.min(99, actual.disponibilidad + (impacto.disponibilidad || 0))
      ),
      latenciaMs: Math.max(120, actual.latenciaMs + (impacto.latenciaMs || 0)),
      presupuestoUsd: Math.min(
        actual.presupuestoLimiteUsd + 1500,
        actual.presupuestoUsd + (impacto.presupuestoUsd || 0)
      ),
    };
  };

  const handleEntrarReto = (retoId: string) => {
    const retoDestino = RETOS.find((r) => r.id === retoId) || RETO_INICIAL;
    setMenuLateralAbierto(false);
    setProgreso((prev) => ({
      ...prev,
      retoActivoId: retoDestino.id,
      metricasActuales:
        prev.retoActivoId === retoDestino.id
          ? prev.metricasActuales
          : { ...retoDestino.metricasIniciales },
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCambiarEtapa = (nuevaEtapa: number) => {
    setMenuLateralAbierto(false);
    setProgreso((prev) => ({
      ...prev,
      etapaActual: Math.min(4, Math.max(0, nuevaEtapa)),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReintentarReto = () => {
    setMenuLateralAbierto(false);
    window.localStorage.removeItem(STORAGE_KEY);
    const limpio: ProgresoGuardado = {
      ...crearEstadoInicial(),
      retoActivoId: retoActivo.id,
      etapaActual: 0,
    };
    setProgreso(limpio);
    setUltimoImpactoBadge(null);
    setErrorEvaluacionIA(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrarErrorNodo = (
    nodoId: string,
    nodoTitulo: string,
    opcion: OpcionNodo
  ) => {
    const impacto = opcion.impactoMetricas;
    const correo: CorreoConsecuencia | null = opcion.correoConsecuencia
      ? {
          id: `correo-${nodoId}-${Date.now()}`,
          nodoId,
          hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          ...opcion.correoConsecuencia,
        }
      : null;

    setProgreso((prev) => ({
      ...prev,
      metricasActuales: aplicarImpactoMetricas(prev.metricasActuales, impacto),
      historialErrores: [
        ...prev.historialErrores,
        {
          nodoId,
          nodoTitulo,
          opcionElegidaId: opcion.id,
          opcionElegidaTexto: opcion.texto,
          impactoMetricas: impacto || {},
          impactoResumen: opcion.impactoResumen || 'Impacto en métricas operativas',
          timestamp: new Date().toISOString(),
        },
      ],
      correosRecibidos: correo ? [...prev.correosRecibidos, correo] : prev.correosRecibidos,
    }));

    if (opcion.impactoResumen) {
      setUltimoImpactoBadge({ texto: opcion.impactoResumen, positivo: false });
    }
  };

  const handleCompletarNodo = (nodoId: string, impacto?: ImpactoMetrica) => {
    setProgreso((prev) => ({
      ...prev,
      metricasActuales: aplicarImpactoMetricas(prev.metricasActuales, impacto),
      nodosCompletados: prev.nodosCompletados.includes(nodoId)
        ? prev.nodosCompletados
        : [...prev.nodosCompletados, nodoId],
    }));

    if (impacto) {
      const partes: string[] = [];
      if (impacto.disponibilidad) {
        partes.push(
          `Entran sin error ${impacto.disponibilidad > 0 ? '+' : ''}${impacto.disponibilidad} de cada 100`
        );
      }
      if (impacto.latenciaMs) {
        partes.push(
          `Tiempo ${formatearDeltaSegundos(impacto.latenciaMs)}`
        );
      }
      setUltimoImpactoBadge({
        texto: partes.length > 0 ? partes.join(' · ') : 'Decisión aplicada',
        positivo: true,
      });
    }
  };

  const handleActualizarPropuesta = (patch: Partial<PropuestaFinalData>) => {
    setProgreso((prev) => ({
      ...prev,
      propuestaFinal: {
        ...prev.propuestaFinal,
        ...patch,
      },
    }));
  };

  const handleEnviarYAnalizar = async () => {
    setCargandoIA(true);
    setErrorEvaluacionIA(null);
    setProgreso((prev) => ({
      ...prev,
      etapaActual: 4,
      evaluacionIA: null,
      propuestaFinal: {
        ...prev.propuestaFinal,
        enviadaEn: new Date().toISOString(),
      },
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const resultado = await evaluarPropuestaConIA({
        reto: retoActivo,
        metricasActuales: progreso.metricasActuales,
        historialErrores: progreso.historialErrores,
        propuestaFinal: progreso.propuestaFinal,
      });

      setProgreso((prev) => ({
        ...prev,
        etapaActual: 4,
        evaluacionIA: resultado,
      }));
      setErrorEvaluacionIA(null);
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : 'No se pudo conectar con Gemini IA.';
      setErrorEvaluacionIA(mensaje);
    } finally {
      setCargandoIA(false);
    }
  };

  const enWorkspace = Boolean(progreso.retoActivoId);
  const enDetalleCarrera =
    !enWorkspace && vistaPrincipal === 'carreras' && Boolean(carreraSeleccionadaId);
  const tieneMenuLateral = enWorkspace || enDetalleCarrera;
  const tieneProgresoActivo =
    progreso.etapaActual > 0 || progreso.nodosCompletados.length > 0;

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F172A] flex flex-col">
      {/* Top Bar limpio */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-8">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {tieneMenuLateral && (
              <button
                type="button"
                onClick={() => setMenuLateralAbierto((prev) => !prev)}
                aria-expanded={menuLateralAbierto}
                aria-controls="navigation-drawer"
                aria-label={menuLateralAbierto ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2D6CDF] hover:border-[#BFDBFE] transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6CDF]"
              >
                <Menu className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMenuLateralAbierto(false);
                setProgreso((prev) => ({ ...prev, retoActivoId: null }));
                setCarreraSeleccionadaId(null);
                setVistaPrincipal('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-sans text-xl font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 hover:text-[#2D6CDF] transition-colors cursor-pointer"
            >
              RoleLab
            </button>
          </div>

          <nav aria-label="Navegación principal" className="flex items-center gap-3.5 sm:gap-6 text-xs sm:text-sm font-medium text-[#475569]">
            <button
              type="button"
              onClick={() => {
                setMenuLateralAbierto(false);
                setProgreso((prev) => ({ ...prev, retoActivoId: null }));
                setCarreraSeleccionadaId(null);
                setVistaPrincipal('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={!enWorkspace && vistaPrincipal === 'home' ? 'page' : undefined}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                !enWorkspace && vistaPrincipal === 'home'
                  ? 'text-[#2D6CDF] font-semibold border-b-2 border-[#2D6CDF]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuLateralAbierto(false);
                setProgreso((prev) => ({ ...prev, retoActivoId: null }));
                setCarreraSeleccionadaId(null);
                setVistaPrincipal('carreras');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={!enWorkspace && vistaPrincipal === 'carreras' ? 'page' : undefined}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                !enWorkspace && vistaPrincipal === 'carreras'
                  ? 'text-[#2D6CDF] font-semibold border-b-2 border-[#2D6CDF]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Carreras
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuLateralAbierto(false);
                setProgreso((prev) => ({ ...prev, retoActivoId: null }));
                setCarreraSeleccionadaId(null);
                setVistaPrincipal('retos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={!enWorkspace && vistaPrincipal === 'retos' ? 'page' : undefined}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                !enWorkspace && vistaPrincipal === 'retos'
                  ? 'text-[#2D6CDF] font-semibold border-b-2 border-[#2D6CDF]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Retos
            </button>
          </nav>
        </div>
      </header>

      {/* Vista principal: Home, Carreras, Retos o Workspace */}
      <div className="flex-1">
        {enWorkspace ? (
          <WorkspaceView
            reto={retoActivo}
            etapaActual={progreso.etapaActual}
            etapaMaximaDesbloqueada={etapaMaximaDesbloqueada}
            metricasActuales={progreso.metricasActuales}
            ultimoImpactoBadge={ultimoImpactoBadge}
            nodosCompletados={progreso.nodosCompletados}
            historialErrores={progreso.historialErrores}
            correosRecibidos={progreso.correosRecibidos}
            propuestaFinal={progreso.propuestaFinal}
            evaluacionIA={progreso.evaluacionIA}
            cargandoIA={cargandoIA}
            errorEvaluacionIA={errorEvaluacionIA}
            menuLateralAbierto={menuLateralAbierto}
            onCerrarMenuLateral={() => setMenuLateralAbierto(false)}
            onCambiarEtapa={handleCambiarEtapa}
            onVolverCarreras={() => {
              setMenuLateralAbierto(false);
              setProgreso((prev) => ({ ...prev, retoActivoId: null }));
              setVistaPrincipal('carreras');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReintentarReto={handleReintentarReto}
            onRegistrarErrorNodo={handleRegistrarErrorNodo}
            onCompletarNodo={handleCompletarNodo}
            onActualizarPropuesta={handleActualizarPropuesta}
            onEnviarYAnalizar={handleEnviarYAnalizar}
            onExplorarPiramide={() => {
              setMenuLateralAbierto(false);
              setProgreso((prev) => ({ ...prev, retoActivoId: null }));
              setVistaPrincipal('carreras');
              setCarreraSeleccionadaId('ingenieria-software-cloud');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : vistaPrincipal === 'home' ? (
          <LandingHomeView
            onExplorarCarreras={() => {
              setMenuLateralAbierto(false);
              setCarreraSeleccionadaId(null);
              setVistaPrincipal('carreras');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExplorarRetos={() => {
              setMenuLateralAbierto(false);
              setCarreraSeleccionadaId(null);
              setVistaPrincipal('retos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : vistaPrincipal === 'retos' ? (
          <RetosView
            carreras={CARRERAS}
            tieneProgresoActivo={tieneProgresoActivo}
            onEntrarReto={handleEntrarReto}
          />
        ) : (
          <HomeView
            carreras={CARRERAS}
            carreraSeleccionadaId={carreraSeleccionadaId}
            tieneProgresoActivo={tieneProgresoActivo}
            menuLateralAbierto={menuLateralAbierto}
            onCerrarMenuLateral={() => setMenuLateralAbierto(false)}
            onSeleccionarCarrera={(id) => {
              setMenuLateralAbierto(false);
              setCarreraSeleccionadaId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEntrarReto={handleEntrarReto}
          />
        )}
      </div>
    </div>
  );
}
