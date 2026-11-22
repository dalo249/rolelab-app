import {
  ErrorHistorial,
  EvaluacionIA,
  MetricasSistema,
  PropuestaFinalData,
  Reto,
} from '../types/rolelab';

interface EvaluacionPayload {
  reto: Reto;
  metricasActuales: MetricasSistema;
  historialErrores: ErrorHistorial[];
  propuestaFinal: PropuestaFinalData;
}

export class GeminiConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiConnectionError';
  }
}

const RESPONSE_SCHEMA_REST = {
  type: 'OBJECT',
  properties: {
    resumenGeneral: { type: 'STRING' },
    coincidencias: { type: 'ARRAY', items: { type: 'STRING' } },
    efectoDomino: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          afectado: { type: 'STRING' },
          rolOArea: { type: 'STRING' },
          efectoInmediato: { type: 'STRING' },
          efectoSistemaOPresupuesto: { type: 'STRING' },
        },
        required: ['afectado', 'rolOArea', 'efectoInmediato', 'efectoSistemaOPresupuesto'],
      },
    },
    oportunidadesMejora: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          tipo: {
            type: 'STRING',
            enum: ['error_simulacion', 'area_por_fortalecer'],
          },
          titulo: { type: 'STRING' },
          quePaso: { type: 'STRING' },
          porQueImporta: { type: 'STRING' },
          comoMejorarlo: { type: 'STRING' },
        },
        required: ['tipo', 'titulo', 'quePaso', 'porQueImporta', 'comoMejorarlo'],
      },
    },
    criterioYComunicacion: { type: 'STRING' },
    habilidades: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          nombre: { type: 'STRING' },
          puntaje: { type: 'INTEGER' },
          nivel: {
            type: 'STRING',
            enum: ['En desarrollo', 'Sólido', 'Destacado'],
          },
          queSignifica: { type: 'STRING' },
          queHiciste: { type: 'STRING' },
          microReto: { type: 'STRING' },
        },
        required: ['nombre', 'puntaje', 'nivel', 'queSignifica', 'queHiciste', 'microReto'],
      },
    },
    rolesAfines: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          rol: { type: 'STRING' },
          razon: { type: 'STRING' },
        },
        required: ['rol', 'razon'],
      },
    },
  },
  required: [
    'resumenGeneral',
    'coincidencias',
    'efectoDomino',
    'oportunidadesMejora',
    'criterioYComunicacion',
    'habilidades',
    'rolesAfines',
  ],
};

function construirSystemInstruction(reto: Reto): string {
  return `${reto.perfilProfesionalDefinido}

AUDIENCIA Y ESTILO DE COMUNICACIÓN (OBLIGATORIO):
- Hablas de tú con un estudiante de colegio (16 años, 10.º u 11.º grado) que nunca ha trabajado ni programado antes.
- Usa español cotidiano, claro y cercano, con frases cortas (máximo 2–3 líneas por tarjeta).
- Traduce cualquier palabra técnica a lenguaje diario (por ejemplo: "tiempo de espera al cargar" en lugar de "latencia", "ventanillas ocupadas" en lugar de "pool", "copia rápida" en lugar de "caché") y explica siempre qué siente el estudiante que usa EduCloud Live.
- Cero tono de regaño: distingue con amabilidad un "error_simulacion" (tropiezo normal practicando) de un "area_por_fortalecer" (algo que faltó explicar o conectar).
- SINCERIDAD ANTE RESPUESTAS VACÍAS O INCOMPLETAS: Si una respuesta es muy corta o no menciona un dato, dilo con respeto y claridad sin inventar ideas que no escribió.`;
}

function construirContentsPrompt(payload: EvaluacionPayload): string {
  const { reto, metricasActuales, historialErrores, propuestaFinal } = payload;

  const erroresTexto =
    historialErrores.length === 0
      ? 'Ninguno: completó los 3 pasos de decisión al primer intento.'
      : historialErrores
          .map(
            (e, idx) =>
              `${idx + 1}. ${e.nodoTitulo} | Eligió: "${e.opcionElegidaTexto}" | Impacto: ${e.impactoResumen}`
          )
          .join('\n');

  return `
SOLUCIÓN DE REFERENCIA DEL CASO:
${reto.solucionReferenciaProfesional}

=== LO QUE HIZO REALMENTE EL ESTUDIANTE EN ESTA SESIÓN ===
Resultados finales en el simulador:
- Estudiantes que pueden entrar: ${metricasActuales.disponibilidad}% (meta >= 95%)
- Tiempo de carga de la página: ${metricasActuales.latenciaMs} ms (meta < 400 ms)
- Gasto mensual en servidores: $${metricasActuales.presupuestoUsd} USD de $${metricasActuales.presupuestoLimiteUsd} USD

Tropiezos durante los 3 pasos de práctica:
${erroresTexto}

Elecciones del Paso 3A:
- Orden de acción elegido: "${propuestaFinal.ordenPrioridadTexto || '(Sin seleccionar)'}"
- Sacrificio consciente elegido: "${propuestaFinal.tradeOffTexto || '(Sin seleccionar)'}"

Respuestas escritas del Paso 3B:
1. Qué causó la caída y qué 2 pruebas vio:
"${propuestaFinal.problemaYEvidencias.trim() || '(Sin respuesta)'}"

2. Qué haría primero, qué comprobaría después y por qué:
"${propuestaFinal.recomendacionYOrden.trim() || '(Sin respuesta)'}"

3. Riesgo, cuidado de datos y dónde puede fallar una IA:
"${propuestaFinal.riesgoCalidadYLimitesIA.trim() || '(Sin respuesta)'}"

=== INSTRUCCIONES ESTRICTAS PARA EL JSON DE SALIDA ===
1. "resumenGeneral": 2 oraciones breves, cercanas y honestas resumiendo cómo le fue en este reto.
2. "coincidencias": 2-4 aciertos reales y comprobables en lo que hizo o escribió (en lenguaje sencillo).
3. "efectoDomino": 3-4 tarjetas mostrando reacciones en cadena dentro de EduCloud Live (Estudiantes en clase, Soporte / Carlos Ruiz, Archivo de datos / Sofía Torres, Presupuesto). Explica en palabras simples qué sienten las personas al instante vs. qué pasa en el sistema o el dinero.
4. "oportunidadesMejora": 2-4 tarjetas constructivas. Usa tipo="error_simulacion" para tropiezos de práctica o tipo="area_por_fortalecer" si faltó explicar algo en su texto. En cada una sé breve: quePaso, porQueImporta (con ejemplo cotidiano) y comoMejorarlo (qué dato concreto mirar).
5. "criterioYComunicacion": Evaluación honesta, cercana y corta de cómo explicó sus ideas; si algo quedó vago o faltó, dilo con amabilidad sin inventar.
6. "habilidades": Exactamente estas 4 habilidades en este orden:
   - "Diagnóstico con evidencia"
   - "Manejo de fallas bajo presión"
   - "Balance entre rapidez, datos y costo"
   - "Comunicación clara con el equipo"
   Para cada una incluye puntaje (0-100), nivel ("En desarrollo" | "Sólido" | "Destacado"), queSignifica (explicado para alguien de 16 años sin experiencia previa), queHiciste (hecho real de esta partida) y microReto (1 consejo corto y práctico para su próximo intento).
7. "rolesAfines": 3 roles o carreras afines explicadas sin jerga para un estudiante de 16 años, manteniendo qué hace realmente cada rol en la industria.
`.trim();
}

function esEvaluacionValida(data: unknown): data is Omit<EvaluacionIA, 'origen' | 'modeloUsado' | 'generadaEn'> {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.resumenGeneral === 'string' &&
    Array.isArray(d.coincidencias) &&
    Array.isArray(d.efectoDomino) &&
    Array.isArray(d.oportunidadesMejora) &&
    typeof d.criterioYComunicacion === 'string' &&
    Array.isArray(d.habilidades) &&
    d.habilidades.length > 0 &&
    Array.isArray(d.rolesAfines) &&
    d.rolesAfines.length > 0
  );
}

async function fetchConTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 28000
): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

export async function evaluarPropuestaConIA(payload: EvaluacionPayload): Promise<EvaluacionIA> {
  const systemInstruction = construirSystemInstruction(payload.reto);
  const contentsPrompt = construirContentsPrompt(payload);
  const viteApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // 1. Intentar ruta de servidor (/api/evaluate) con Gemini API del proyecto
  try {
    const serverRes = await fetchConTimeout('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction,
        contentsPrompt,
      }),
    });

    if (serverRes.ok) {
      const json = await serverRes.json();
      if (esEvaluacionValida(json?.evaluation)) {
        return {
          ...json.evaluation,
          origen: 'gemini-api',
          modeloUsado: json.modelUsed || 'gemini-3.1-flash-lite',
          generadaEn: new Date().toISOString(),
        };
      }
      throw new GeminiConnectionError('La respuesta recibida desde Gemini IA no fue válida.');
    }

    // Si falta la API key en el servidor pero existe VITE_GEMINI_API_KEY, probamos llamada directa antes de fallar
    if (serverRes.status !== 503 || !viteApiKey) {
      const errData = await serverRes.json().catch(() => null);
      throw new GeminiConnectionError(
        errData?.message || `Error HTTP ${serverRes.status} al conectar con Gemini IA.`
      );
    }
  } catch (err) {
    if (!viteApiKey) {
      if (err instanceof GeminiConnectionError) throw err;
      throw new GeminiConnectionError(
        'No se pudo establecer conexión con el servicio de Gemini IA.'
      );
    }
  }

  // 2. Llamada directa a Gemini (gemini-3.1-flash-lite) si se proveyó VITE_GEMINI_API_KEY
  if (viteApiKey) {
    const modelName = 'gemini-3.1-flash-lite';
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
        viteApiKey
      )}`;
      const res = await fetchConTimeout(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: contentsPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA_REST,
          },
        }),
      });

      if (!res.ok) {
        throw new GeminiConnectionError(
          `Error HTTP ${res.status} al conectar con ${modelName}.`
        );
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new GeminiConnectionError(`Gemini IA (${modelName}) devolvió una respuesta vacía.`);
      }

      const parsed = JSON.parse(rawText);
      if (!esEvaluacionValida(parsed)) {
        throw new GeminiConnectionError(
          `La respuesta de Gemini IA (${modelName}) tiene un formato inválido.`
        );
      }

      return {
        ...parsed,
        origen: 'gemini-api',
        modeloUsado: modelName,
        generadaEn: new Date().toISOString(),
      };
    } catch (err) {
      if (err instanceof GeminiConnectionError) throw err;
      throw new GeminiConnectionError(
        `Error de red o timeout al conectar con Gemini IA (${modelName}).`
      );
    }
  }

  throw new GeminiConnectionError('No hay conexión disponible con Gemini IA.');
}
