import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    resumenGeneral: {
      type: Type.STRING,
      description:
        "Resumen breve (máximo 2 oraciones) en lenguaje claro para estudiantes de 16-18 años, fiel únicamente a lo que eligió y escribió en esta sesión.",
    },
    coincidencias: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        "Exactamente 2 a 3 puntos cortos y concretos sobre lo que hizo bien en esta sesión. Nunca inventes aciertos si no hay evidencia en sus elecciones o textos.",
    },
    efectoDomino: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          afectado: {
            type: Type.STRING,
            description: "Quién o qué siente el efecto (ej. Estudiantes en clase, Soporte, Archivo de datos, Estabilidad).",
          },
          rolOArea: {
            type: Type.STRING,
            description: "Área o persona del equipo (ej. Carlos Ruiz · Soporte).",
          },
          efectoInmediato: {
            type: Type.STRING,
            description: "Una oración corta sobre qué viven las personas al instante según lo decidido.",
          },
          efectoSistemaOPresupuesto: {
            type: Type.STRING,
            description: "Una oración corta sobre qué pasa con la rapidez o estabilidad del sistema.",
          },
        },
        required: ["afectado", "rolOArea", "efectoInmediato", "efectoSistemaOPresupuesto"],
      },
      description:
        "3 a 4 tarjetas cortas con las consecuencias de las decisiones reales de esta sesión.",
    },
    oportunidadesMejora: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tipo: {
            type: Type.STRING,
            enum: ["error_simulacion", "area_por_fortalecer"],
            description:
              "error_simulacion si hubo un tropiezo durante los pasos; area_por_fortalecer si faltó evidencia, claridad o quedó incompleta alguna respuesta.",
          },
          titulo: { type: Type.STRING, description: "Título corto de máximo 6 palabras." },
          quePaso: { type: Type.STRING, description: "1 oración breve describiendo exactamente qué ocurrió o faltó." },
          porQueImporta: { type: Type.STRING, description: "1 oración breve explicando por qué importa en la vida real." },
          comoMejorarlo: {
            type: Type.STRING,
            description: "1 acción concreta y directa para aplicar en el próximo intento.",
          },
        },
        required: ["tipo", "titulo", "quePaso", "porQueImporta", "comoMejorarlo"],
      },
      description: "2 a 3 puntos cortos y constructivos para mejorar la próxima vez.",
    },
    criterioYComunicacion: {
      type: Type.STRING,
      description:
        "Máximo 2 oraciones honestas evaluando cómo explicó sus ideas y si citó datos reales; si algo estuvo vacío, vago o incompleto, dilo con claridad y respeto.",
    },
    habilidades: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nombre: { type: Type.STRING },
          puntaje: {
            type: Type.INTEGER,
            description: "Puntaje de 0 a 100 basado estrictamente en evidencia real de la sesión.",
          },
          nivel: {
            type: Type.STRING,
            enum: ["En desarrollo", "Sólido", "Destacado"],
          },
          queSignifica: {
            type: Type.STRING,
            description: "1 oración corta y sin jerga para jóvenes de 16-18 años.",
          },
          queHiciste: {
            type: Type.STRING,
            description: "1 oración corta sobre qué hiciste o faltó hoy en esta habilidad.",
          },
          microReto: {
            type: Type.STRING,
            description: "1 consejo breve y práctico para practicar la próxima vez.",
          },
        },
        required: ["nombre", "puntaje", "nivel", "queSignifica", "queHiciste", "microReto"],
      },
    },
    vidaReal: {
      type: Type.OBJECT,
      properties: {
        queSeHace: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "3 a 4 puntos cortos de tareas reales: leer métricas y registros, conversar con soporte o producto, decidir sin tener todos los datos, probar cambios y documentar.",
        },
        ladoNoGlamoroso: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "2 a 3 puntos cortos sobre lo menos glamoroso del trabajo: presión en hora pico, revisar detalles repetitivos y dedicar tiempo exigente a pruebas.",
        },
        conQuienesColaboras: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rol: { type: Type.STRING, description: "Nombre cercano del área (ej. Soporte, Backend, QA / Calidad, Producto)." },
              paraQue: { type: Type.STRING, description: "1 frase corta explicando para qué conversas con esa persona o área." },
            },
            required: ["rol", "paraQue"],
          },
          description: "3 a 4 áreas con las que colaboras en el día a día.",
        },
      },
      required: ["queSeHace", "ladoNoGlamoroso", "conQuienesColaboras"],
      description: "Cómo se vive este trabajo en la práctica real dentro de una empresa de software.",
    },
    brujulaAfinidad: {
      type: Type.OBJECT,
      properties: {
        teGustaraSi: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 puntos cortos completando 'Probablemente te guste si...'.",
        },
        exploraOtrasSi: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 puntos cortos completando 'Quizás prefieras explorar otras áreas si...'.",
        },
      },
      required: ["teGustaraSi", "exploraOtrasSi"],
      description: "Brújula honesta para ayudar al estudiante a descubrir si este campo encaja con su forma de trabajar.",
    },
    rolesAfines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rol: { type: Type.STRING },
          razon: {
            type: Type.STRING,
            description: "1 a 2 oraciones simples y claras para jóvenes de 16-18 años sin experiencia previa.",
          },
        },
        required: ["rol", "razon"],
      },
    },
  },
  required: [
    "resumenGeneral",
    "coincidencias",
    "efectoDomino",
    "oportunidadesMejora",
    "criterioYComunicacion",
    "habilidades",
    "vidaReal",
    "brujulaAfinidad",
    "rolesAfines",
  ],
};

const SERVER_SYSTEM_INSTRUCTION = `REGLAS INQUEBRANTABLES DE FIDELIDAD Y CONCISIÓN (OBLIGATORIO):
1. Ancla cada afirmación únicamente en las elecciones, tropiezos y textos reales que envió el estudiante en esta sesión.
2. Si el estudiante dejó algo vacío, muy corto, vago o incompleto, señálalo con amabilidad y honestidad; jamás inventes aciertos ni supongas datos que no escribió.
3. Escribe para jóvenes de 16 a 18 años sin experiencia en software: frases cortas (1 a 2 líneas por tarjeta/punto), cero muros de texto y cero jerga técnica sin explicar en palabras cotidianas.
4. Mantén "coincidencias" en 2-3 puntos breves y "oportunidadesMejora" en 2-3 puntos breves con una acción concreta para la próxima vez.
5. En "vidaReal" muestra tanto las tareas reales (leer gráficas/registros, hablar con soporte/producto, decidir con información incompleta, probar cambios y documentar) como el lado menos glamoroso (presión en hora pico, detalles repetitivos, tiempo de pruebas) y las áreas con las que se colabora (soporte, backend, QA/calidad, producto).
6. En "brujulaAfinidad" ofrece señales honestas y equilibradas tanto de por qué podría gustarle como de por qué podría preferir otra área.`;

function isValidEvaluation(data: any): boolean {
  return Boolean(
    data &&
      typeof data.resumenGeneral === "string" &&
      Array.isArray(data.coincidencias) &&
      Array.isArray(data.efectoDomino) &&
      Array.isArray(data.oportunidadesMejora) &&
      typeof data.criterioYComunicacion === "string" &&
      Array.isArray(data.habilidades) &&
      data.habilidades.length > 0 &&
      data.vidaReal &&
      Array.isArray(data.vidaReal.queSeHace) &&
      Array.isArray(data.vidaReal.ladoNoGlamoroso) &&
      Array.isArray(data.vidaReal.conQuienesColaboras) &&
      data.brujulaAfinidad &&
      Array.isArray(data.brujulaAfinidad.teGustaraSi) &&
      Array.isArray(data.brujulaAfinidad.exploraOtrasSi) &&
      Array.isArray(data.rolesAfines) &&
      data.rolesAfines.length > 0
  );
}

app.post("/api/evaluate", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "MISSING_API_KEY",
      message: "No se encontró GEMINI_API_KEY configurada en el servidor.",
    });
  }

  const { systemInstruction, contentsPrompt } = req.body ?? {};
  if (!systemInstruction || !contentsPrompt) {
    return res.status(400).json({
      error: "INVALID_REQUEST",
      message: "systemInstruction y contentsPrompt son obligatorios.",
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const activeModel = "gemini-3.1-flash-lite";
    const fullSystemInstruction = `${systemInstruction}\n\n${SERVER_SYSTEM_INSTRUCTION}`;
    let responseText = "";

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: activeModel,
          contents: contentsPrompt,
          config: {
            systemInstruction: fullSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: evaluationSchema,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          },
        });
        responseText = (response.text ?? "").trim();
        break;
      } catch (attemptErr: any) {
        const errMsg = String(attemptErr?.message ?? attemptErr ?? "");
        const isTransient =
          errMsg.includes("503") || errMsg.includes("UNAVAILABLE");
        if (attempt === 1 && isTransient) {
          await new Promise((r) => setTimeout(r, 900));
          continue;
        }
        throw attemptErr;
      }
    }

    const text = responseText;
    if (!text) {
      return res.status(502).json({
        error: "EMPTY_GEMINI_RESPONSE",
        message: "Gemini IA devolvió una respuesta vacía.",
      });
    }

    const parsed = JSON.parse(text);
    if (!isValidEvaluation(parsed)) {
      return res.status(502).json({
        error: "INVALID_GEMINI_SCHEMA",
        message: "La respuesta de Gemini IA no cumplió con la estructura esperada.",
      });
    }

    return res.json({ evaluation: parsed, modelUsed: activeModel });
  } catch (err: any) {
    console.error("Gemini evaluation error:", err?.message ?? err);
    return res.status(502).json({
      error: "GEMINI_UPSTREAM_ERROR",
      message: err?.message ?? "Error de conexión con Gemini IA.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RoleLab server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
