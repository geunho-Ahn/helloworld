/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    try {
      const { dataSample, stats } = req.body;
      
      const prompt = `
        You are an industrial data analyst for LS. 
        Analyze the following component data summary and provide insights.
        
        Data Stats:
        ${JSON.stringify(stats, null, 2)}
        
        Data Sample (First 5 rows):
        ${JSON.stringify(dataSample, null, 2)}
        
        Please provide:
        1. A brief summary of the data.
        2. 3-5 key insights (e.g., material concentration, supplier dependency, weight anomalies).
        3. 2-3 actionable recommendations for SCM/Quality teams.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              insights: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["summary", "insights", "recommendations"],
          },
        },
      });

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/map-columns", async (req, res) => {
    try {
      const { headers } = req.body;
      const standardFields = [
        "partNo", "partName", "material", "specification", "quantity", "weight", "supplier", "project"
      ];

      const prompt = `
        Map the following user-provided CSV headers to the standard LS component data fields.
        User Headers: ${headers.join(", ")}
        Standard Fields: ${standardFields.join(", ")}
        
        Return a JSON object where keys are User Headers and values are the corresponding Standard Field name (or null if no clear match).
        Be smart about synonyms (e.g., 'P/N' -> 'partNo', '업체명' -> 'supplier', '중량' -> 'weight').
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            additionalProperties: { type: Type.STRING, nullable: true }
          },
        },
      });

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("AI Column Mapping Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
