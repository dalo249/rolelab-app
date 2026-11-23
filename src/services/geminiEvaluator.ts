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
    vidaReal: {
      type: 'OBJECT',
      properties: {
        queSeHace: { type: 'ARRAY', items: { type: 'STRING' } },
        ladoNoGlamoroso: { type: 'ARRAY', items: { type: 'STRING' } },
        conQuienesColaboras: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              rol: { type: 'STRING' },
              paraQue: { type: 'STRING' },
            },
            required: ['rol', 'paraQue'],
          },
        },
      },
      required: ['queSeHace', 'ladoNoGlamoroso', 'conQuienesColaboras'],
    },
    brujulaAfinidad: {
      type: 'OBJECT',
      properties: {
        teGustaraSi: { type: 'ARRAY', items: { type: 'STRING' } },
        exploraOtrasSi: { type: 'ARRAY', items: { type: 'STRING' } },
      },
      required: ['teGustaraSi', 'exploraOtrasSi'],
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
    'vidaReal',
    'brujulaAfinidad',
    'rolesAfines',
  ],
};

function construirSystemInstruction(reto: Reto): string {
  return `${reto.perfilProfesionalDefinido}

AUDIENCIA Y ESTILO DE COMUNICACIÓN (OBLIGATORIO):
- Hablas de tú con un estudiante de colegio (16 a 18 años, 10.º u 11.º grado) sin experiencia previa en programación.
- Usa español cotidiano, directo y cercano, con frases breves (1–2 líneas por tarjeta/punto, sin muros de texto).
- Traduce cualquier palabra técnica a lenguaje diario ("tiempo de respuesta" en lugar de "latencia", "ventanillas ocupadas" en lugar de "pool", "copia lista de asistencia" en lugar de "caché") y conecta siempre con lo que vive el estudiante.
- Cero tono de regaño: distingue con respeto un "error_simulacion" (tropiezo practicando) de un "area_por_fortalecer" (algo que faltó explicar).
- FIDELIDAD ESTRICTA: Cada afirmación debe salir de lo que eligió o escribió hoy. Si algo quedó vacío, vago o incompleto, dilo con sinceridad sin inventar aciertos.`;
}

function construirContentsPrompt(payload: EvaluacionPayload): string {
  const { reto, metricasActuales, historialErrores, propuestaFinal } = payload;
  const entranDe100 = Math.max(0, Math.min(100, Math.round(metricasActuales.disponibilidad)));
  const tiempoSegundos = (metricasActuales.latenciaMs / 1000).toFixed(1);

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
Indicadores finales de EduCloud Live:
- Entran sin error: ${entranDe100} de cada 100 estudiantes (meta >= 95 de cada 100)
- Tiempo de respuesta: ${tiempoSegundos} s (meta < 0.4 s)

Tropiezos durante los 3 pasos de práctica:
${erroresTexto}

Elecciones del Paso 3A:
- Orden de acción elegido: "${propuestaFinal.ordenPrioridadTexto || '(Sin seleccionar)'}"
- Sacrificio consciente elegido: "${propuestaFinal.tradeOffTexto || '(Sin seleccionar)'}"

Respuestas escritas del Paso 3B:
1. Qué causó la caída y qué 2 datos lo demuestran:
"${propuestaFinal.problemaYEvidencias.trim() || '(Sin respuesta)'}"

2. Qué haría primero, qué revisaría después y qué arreglaría al final:
"${propuestaFinal.recomendacionYOrden.trim() || '(Sin respuesta)'}"

3. Qué molestia acepta hoy, cómo protege los datos y cómo fallaría una IA:
"${propuestaFinal.riesgoCalidadYLimitesIA.trim() || '(Sin respuesta)'}"

=== INSTRUCCIONES ESTRICTAS PARA EL JSON DE SALIDA ===
1. "resumenGeneral": Máximo 2 oraciones breves y honestas resumiendo lo logrado hoy según la evidencia real.
2. "coincidencias": 2 a 3 puntos cortos y concretos sobre lo correcto en esta sesión (sin inventar si faltaron datos).
3. "oportunidadesMejora": 2 a 3 tarjetas breves y constructivas (tipo="error_simulacion" o "area_por_fortalecer") con un título corto, qué pasó, por qué importa y una acción concreta para la próxima vez.
4. "criterioYComunicacion": Máximo 2 oraciones honestas evaluando la claridad de su plan y si usó cifras reales; si dejó algo vago o vacío, indícalo con respeto.
5. "habilidades": Exactamente estas 4 habilidades en lenguaje cotidiano (sin jerga):
   - "Detectar el problema con pruebas"
   - "Mantener la calma bajo presión"
   - "Equilibrar rapidez y datos seguros"
   - "Explicar el plan con claridad"
   Para cada una: puntaje (0-100 según evidencia real), nivel, queSignifica (1 oración simple), queHiciste (1 oración factual de hoy) y microReto (1 consejo práctico corto).
6. "efectoDomino": 3 tarjetas cortas sobre cómo sintieron sus decisiones los estudiantes, el equipo de soporte y el sistema.
7. "vidaReal": Explica cómo es este trabajo en la vida real:
   - "queSeHace": 4 puntos cortos (leer métricas/registros, hablar con soporte o producto, decidir sin tener todos los datos, probar cambios y documentar).
   - "ladoNoGlamoroso": 3 puntos cortos (presión en hora pico, revisar detalles repetitivos, tiempo paciente de pruebas).
   - "conQuienesColaboras": 4 tarjetas cortas (Soporte, Backend, QA / Calidad, Producto / Liderazgo).
8. "brujulaAfinidad":
   - "teGustaraSi": 3 frases cortas para "Probablemente te guste si...".
   - "exploraOtrasSi": 3 frases cortas para "Quizás prefieras explorar otras áreas si...".
9. "rolesAfines": 3 caminos o roles afines explicados en palabras simples para jóvenes de 16–18 años.
`.trim();
}

function esEvaluacionValida(data: unknown): data is Omit<EvaluacionIA, 'origen' | 'modeloUsado' | 'generadaEn'> {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  const vidaReal = d.vidaReal as Record<string, unknown> | undefined;
  const brujula = d.brujulaAfinidad as Record<string, unknown> | undefined;
  return (
    typeof d.resumenGeneral === 'string' &&
    Array.isArray(d.coincidencias) &&
    Array.isArray(d.efectoDomino) &&
    Array.isArray(d.oportunidadesMejora) &&
    typeof d.criterioYComunicacion === 'string' &&
    Array.isArray(d.habilidades) &&
    d.habilidades.length > 0 &&
    Boolean(
      vidaReal &&
        Array.isArray(vidaReal.queSeHace) &&
        Array.isArray(vidaReal.ladoNoGlamoroso) &&
        Array.isArray(vidaReal.conQuienesColaboras)
    ) &&
    Boolean(
      brujula &&
        Array.isArray(brujula.teGustaraSi) &&
        Array.isArray(brujula.exploraOtrasSi)
    ) &&
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
