import { GoogleGenAI, Type } from "@google/genai";
import { DetailedMarketReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function researchMarket(country: string, industry: string): Promise<DetailedMarketReport> {
  const prompt = `Realiza una investigación de mercado OBJETIVA y CRÍTICA para la industria de "${industry}" en "${country}". 
  Identifica con precisión:
  - Demanda actual (Alta, Media, Baja)
  - Nivel de precios (Alto, Medio, Bajo) y rango de precios reales.
  - Nivel de competencia (Alta, Media, Baja)
  - Oportunidades de negocio concretas.
  - 3-5 Puntos Clave (Highlights) que resuman la oportunidad.
  - Un resumen ejecutivo conciso.
  - Competidores clave y proveedores principales (suppliers). Para los proveedores, incluye su nombre, ubicación, especialización y datos de contacto (sitio web, email, teléfono si están disponibles).
  - Los principales países exportadores de "${industry}" a nivel mundial. Para cada país, incluye volumen estimado, pros, contras y un puntaje de idoneidad (suitabilityScore 0-100) para importar hacia "${country}".
  - Una recomendación específica del "Origen Ideal" (Recommended Origin) justificando por qué ese país es la mejor opción (tratados, logística, calidad/precio).
  - Un análisis de confiabilidad (Reliability Analysis) que indique qué tan viable y seguro es el mercado (score 0-100 y razonamiento). Incluye 3-4 métricas específicas (ej: Estabilidad Política, Facilidad de Negocio, Inflación, Crecimiento del PIB local, etc.) que respalden el puntaje.
  No seas excesivamente optimista; si el mercado está saturado o la demanda es baja, indícalo claramente.
  Proporciona también una proyección de tendencias (demanda y precio) para los últimos 5 años y los próximos 2 años.
  Incluye barreras de entrada y entorno regulatorio.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          opportunity: {
            type: Type.OBJECT,
            properties: {
              country: { type: Type.STRING },
              industry: { type: Type.STRING },
              demandLevel: { type: Type.STRING, enum: ["Alta", "Media", "Baja"] },
              averagePriceRange: { type: Type.STRING },
              priceLevel: { type: Type.STRING, enum: ["Alto", "Medio", "Bajo"] },
              competitionLevel: { type: Type.STRING, enum: ["Alta", "Media", "Baja"] },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING }
            },
            required: ["country", "industry", "demandLevel", "averagePriceRange", "priceLevel", "competitionLevel", "opportunities", "risks", "keyHighlights", "summary"]
          },
          trends: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                demand: { type: Type.NUMBER },
                price: { type: Type.NUMBER }
              },
              required: ["year", "demand", "price"]
            }
          },
          keyCompetitors: { type: Type.ARRAY, items: { type: Type.STRING } },
          keySuppliers: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                location: { type: Type.STRING },
                specialization: { type: Type.STRING },
                website: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING }
              },
              required: ["name", "location", "specialization"]
            } 
          },
          topExporters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                country: { type: Type.STRING },
                exportVolume: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                suitabilityScore: { type: Type.NUMBER }
              },
              required: ["country", "exportVolume", "pros", "cons", "suitabilityScore"]
            }
          },
          recommendedOrigin: {
            type: Type.OBJECT,
            properties: {
              country: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              keyAdvantages: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["country", "reasoning", "keyAdvantages"]
          },
          entryBarriers: { type: Type.ARRAY, items: { type: Type.STRING } },
          regulatoryEnvironment: { type: Type.STRING },
          reliabilityAnalysis: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ["positive", "neutral", "negative"] }
                  },
                  required: ["label", "value", "status"]
                }
              }
            },
            required: ["score", "reasoning", "metrics"]
          }
        },
        required: ["opportunity", "trends", "keyCompetitors", "keySuppliers", "topExporters", "recommendedOrigin", "entryBarriers", "regulatoryEnvironment", "reliabilityAnalysis"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as DetailedMarketReport;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Error al procesar la investigación de mercado.");
  }
}
