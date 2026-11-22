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
        "Resumen ejecutivo breve (2-3 oraciones) en lenguaje claro y cercano para estudiantes de 16-18 años, fiel a lo hecho en esta sesión.",
    },
    coincidencias: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        "Lista concisa de aciertos reales observables en la sesión comparados con la solución de referencia.",
    },
    efectoDomino: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          afectado: {
            type: Type.STRING,
            description: "Quién o qué se ve afectado (ej. Estudiantes en clase, Soporte, Base de datos PostgreSQL, Presupuesto).",
          },
          rolOArea: {
            type: Type.STRING,
            description: "Área o persona relacionada en la empresa (ej. Carlos Ruiz · Soporte).",
          },
          efectoInmediato: {
            type: Type.STRING,
            description: "Qué ocurre al instante en la operación según lo decidido por el estudiante.",
          },
          efectoSistemaOPresupuesto: {
            type: Type.STRING,
            description: "Impacto técnico o financiero resultante en latencia, disponibilidad o presupuesto.",
          },
        },
        required: ["afectado", "rolOArea", "efectoInmediato", "efectoSistemaOPresupuesto"],
      },
      description:
        "Reacciones en cadena dentro de la organización basadas en las decisiones reales del estudiante.",
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
              "error_simulacion si ocurrió un tropiezo durante los nodos de entrenamiento; area_por_fortalecer si faltó argumento, evidencia o claridad en la propuesta.",
          },
          titulo: { type: Type.STRING },
          quePaso: { type: Type.STRING },
          porQueImporta: { type: Type.STRING },
          comoMejorarlo: {
            type: Type.STRING,
            description: "Acción concreta con un ejemplo breve de qué dato mirar o qué paso revisar.",
          },
        },
        required: ["tipo", "titulo", "quePaso", "porQueImporta", "comoMejorarlo"],
      },
      description: "Puntos de mejora constructivos sin tono de regaño.",
    },
    criterioYComunicacion: {
      type: Type.STRING,
      description:
        "Evaluación sincera y directa de la claridad técnica, uso de evidencias y sinceridad ante respuestas vacías, ambiguas o incompletas.",
    },
    habilidades: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nombre: { type: Type.STRING },
          puntaje: {
            type: Type.INTEGER,
            description: "Puntaje de 0 a 100 basado estrictamente en evidencia de la sesión.",
          },
          nivel: {
            type: Type.STRING,
            enum: ["En desarrollo", "Sólido", "Destacado"],
          },
          queSignifica: {
            type: Type.STRING,
            description: "Explicación en palabras simples para un estudiante de 16-18 años.",
          },
          queHiciste: {
            type: Type.STRING,
            description: "Qué sumó o restó concretamente en esta partida.",
          },
          microReto: {
            type: Type.STRING,
            description: "Una acción concreta y breve para el próximo intento.",
          },
        },
        required: ["nombre", "puntaje", "nivel", "queSignifica", "queHiciste", "microReto"],
      },
    },
    rolesAfines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rol: { type: Type.STRING },
          razon: {
            type: Type.STRING,
            description: "Explicación cercana, motivadora y rigurosa para jóvenes de 10.º/11.º grado sin experiencia previa.",
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
    "rolesAfines",
  ],
};

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
    let responseText = "";

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: activeModel,
          contents: contentsPrompt,
          config: {
            systemInstruction,
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
