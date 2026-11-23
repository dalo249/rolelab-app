export type AreaCarrera = 'Tecnología & Cloud' | 'Datos & Analítica' | 'Operaciones & Negocio';

export type IconoHerramienta =
  | 'activity'
  | 'terminal'
  | 'database'
  | 'gauge'
  | 'shield'
  | 'layers'
  | 'code'
  | 'server'
  | 'cpu'
  | 'network';

export interface HerramientaCargo {
  nombre: string;
  terminoGlosario: string;
  definicionAnalogia?: string;
  resumenUso: string;
  icono: IconoHerramienta;
}

export interface CargoNivel {
  id: string;
  titulo: string;
  descripcionBreve: string;
  queHaceEnJornada: string[];
  problemasQueResuelve: string[];
  herramientas: HerramientaCargo[];
}

export interface DiferenciacionNivel {
  cargosResumen: string;
  actividades: string[];
  habilidades: string[];
  problemasResumen: string;
}

export interface ExperienciaPracticaNivel {
  tituloReto: string;
  duracionEstimada: string;
  disponible: boolean;
  notaEstado?: string;
}

export interface NivelPiramide {
  nivel: 1 | 2 | 3 | 4;
  titulo: string;
  rangoExperiencia: string;
  etapa: string;
  activoEnReto: boolean;
  roles: string[];
  enfoque: string;
  responsabilidades: string[];
  descripcionEtapa: string;
  cargosDisponibles: CargoNivel[];
  diferenciacion: DiferenciacionNivel;
  experienciaPractica: ExperienciaPracticaNivel;
}

export interface PasoTimelineCarrera {
  paso: number;
  titulo: string;
  descripcion: string;
}

export interface Carrera {
  id: string;
  titulo: string;
  area: AreaCarrera;
  activa: boolean;
  retoId?: string;
  retoTitulo?: string;
  duracionEstimada: string;
  nivelEntrada: string;
  imagenPortada: string;
  videoExplicativoUrl?: string;
  resumenCorto: string;
  acercaDe: {
    queTrata: string;
    habilidadesClave: string[];
    requerimientos: string[];
    actividadesGenerales: string[];
  };
  piramideProgresion: NivelPiramide[];
  timelinePasos: PasoTimelineCarrera[];
}

export interface MetricasSistema {
  disponibilidad: number; // % objetivo >= 95
  latenciaMs: number; // ms objetivo < 400
  presupuestoUsd: number; // USD usados de 3000
  presupuestoLimiteUsd: number;
}

export interface ImpactoMetrica {
  disponibilidad?: number;
  latenciaMs?: number;
  presupuestoUsd?: number;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  cargo: string;
  relacionConRol: string;
  avatarUrl: string;
  iniciales: string;
  especialidad: string;
}

export interface TurnoReunion {
  id: string;
  minuto: string;
  duracionSegundos: number;
  hablanteId: string;
  hablanteNombre: string;
  hablanteCargo: string;
  mensaje: string;
  datoClave: string;
}

export interface PuntoTelemetria {
  hora: string;
  latenciaMs: number;
  erroresHttp500Pct: number;
  usuariosActivos: number;
  esPicoCritico?: boolean;
  nota?: string;
}

export interface LogPeticion {
  id: string;
  timestamp: string;
  metodo: 'GET' | 'POST';
  endpoint: string;
  status: number;
  duracionMs: number;
  subconsultasSql: number;
  poolConexionesUso: string;
  nivel: 'INFO' | 'WARN' | 'ERROR';
  payloadResumen: string;
  trazaDetalle: string;
  sqlMuestra?: string;
}

export interface CorreoConsecuencia {
  id: string;
  nodoId: string;
  remitente: string;
  cargoRemitente: string;
  emailRemitente: string;
  asunto: string;
  hora: string;
  cuerpo: string;
  impactoEtiqueta: string;
}

export interface OpcionNodo {
  id: string;
  texto: string;
  esCorrecta: boolean;
  explicacionCorrecta?: string;
  impactoMetricas?: ImpactoMetrica;
  impactoResumen?: string;
  correoConsecuencia?: Omit<CorreoConsecuencia, 'id' | 'nodoId' | 'hora'>;
}

export interface NodoDecision {
  id: string;
  numero: number;
  titulo: string;
  contextoPregunta: string;
  pista: string;
  opciones: OpcionNodo[];
}

export interface SlideHerramienta {
  titulo: string;
  subtitulo: string;
  tipoVisual: 'grafana-latencia' | 'grafana-pool' | 'datadog-apm' | 'datadog-errores' | 'postgres-slow' | 'postgres-explain';
  leyenda: string;
}

export interface HerramientaReal {
  id: 'grafana' | 'datadog' | 'postgres-slow-log';
  nombre: string;
  categoria: string;
  queHaceEnEmpresa: string;
  relacionConCaso: string;
  documentacionUrl: string;
  documentacionLabel: string;
  slides: SlideHerramienta[];
}

export interface Reto {
  id: string;
  carreraId: string;
  titulo: string;
  empresaFicticia: string;
  empresaDescripcion: string;
  rolEstudiante: string;
  nivelPosicionamiento: string;
  videoUrl: string;
  metricasIniciales: MetricasSistema;
  equipo: MiembroEquipo[];
  camposCarrera: { nombre: string; foco: string; activoEnReto?: boolean }[];
  responsabilidadesRol: string[];
  turnosReunion: TurnoReunion[];
  cierreLider: {
    autor: string;
    cargo: string;
    problematica: string;
    tareaAsignada: string;
    explicacionMetricas: string;
  };
  telemetria: PuntoTelemetria[];
  logs: LogPeticion[];
  herramientasReales: Record<string, HerramientaReal>;
  nodos: NodoDecision[];
  opcionesOrdenPrioridad: { id: string; etiqueta: string; secuencia: string[]; esOptimo: boolean }[];
  opcionesTradeOff: { id: string; etiqueta: string; esOptimo: boolean }[];
  perfilProfesionalDefinido: string;
  solucionReferenciaProfesional: string;
}

export interface ErrorHistorial {
  nodoId: string;
  nodoTitulo: string;
  opcionElegidaId: string;
  opcionElegidaTexto: string;
  impactoMetricas: ImpactoMetrica;
  impactoResumen: string;
  timestamp: string;
}

export interface PropuestaFinalData {
  ordenPrioridadId: string;
  ordenPrioridadTexto: string;
  tradeOffId: string;
  tradeOffTexto: string;
  problemaYEvidencias: string;
  recomendacionYOrden: string;
  riesgoCalidadYLimitesIA: string;
  enviadaEn?: string;
}

export type NivelHabilidad = 'En desarrollo' | 'Sólido' | 'Destacado';

export interface HabilidadEvaluada {
  nombre: string;
  puntaje: number;
  nivel: NivelHabilidad;
  queSignifica: string;
  queHiciste: string;
  microReto: string;
}

export interface EfectoDominoItem {
  afectado: string;
  rolOArea: string;
  efectoInmediato: string;
  efectoSistemaOPresupuesto: string;
}

export interface OportunidadMejoraItem {
  tipo: 'error_simulacion' | 'area_por_fortalecer';
  titulo: string;
  quePaso: string;
  porQueImporta: string;
  comoMejorarlo: string;
}

export interface EvaluacionIA {
  origen: 'gemini-api';
  modeloUsado: string;
  generadaEn: string;
  resumenGeneral: string;
  coincidencias: string[];
  efectoDomino: EfectoDominoItem[];
  oportunidadesMejora: OportunidadMejoraItem[];
  criterioYComunicacion: string;
  habilidades: HabilidadEvaluada[];
  vidaReal: {
    queSeHace: string[];
    ladoNoGlamoroso: string[];
    conQuienesColaboras: {
      rol: string;
      paraQue: string;
    }[];
  };
  brujulaAfinidad: {
    teGustaraSi: string[];
    exploraOtrasSi: string[];
  };
  rolesAfines: {
    rol: string;
    razon: string;
  }[];
}

export interface ProgresoGuardado {
  retoActivoId: string | null;
  etapaActual: number; // 0 a 4
  metricasActuales: MetricasSistema;
  nodosCompletados: string[];
  historialErrores: ErrorHistorial[];
  correosRecibidos: CorreoConsecuencia[];
  propuestaFinal: PropuestaFinalData;
  evaluacionIA: EvaluacionIA | null;
}
