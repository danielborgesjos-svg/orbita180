'use client';

import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTA: O usuário deve configurar GOOGLE_GENERATIVE_AI_API_KEY no .env
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function processJarvisCommand(message: string, context: any) {
  if (!API_KEY) {
    return {
      text: "A chave da Antigravity (Gemini API) não foi detectada. Por favor, configure GOOGLE_GENERATIVE_AI_API_KEY no seu .env para ativar meu núcleo de inteligência real.",
      actions: []
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Você é o JARVIS (Powered by Antigravity), o assistente de IA da plataforma Órbita 180.
      Contexto do Usuário: ${JSON.stringify(context)}
      Mensagem do Usuário: "${message}"

      Objetivo: Ajudar o usuário a gerenciar sua startup, IES ou mentorias.
      Se o usuário pedir diagnósticos, analise KPIs como MRR, Coachability e Velocidade.
      Diferencie Bons Empreendedores (foco em execução) de Maus Empreendedores (foco em palco).

      Retorne um JSON com:
      {
        "text": "Sua resposta curta e direta em PT-BR",
        "redirect": "/rota/se/necessario",
        "analysis": "Insight analítico profundo sobre o fato pedido"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text().replace(/```json|```/g, ""));
    
    return data;
  } catch (error) {
    console.error("Erro na Antigravity AI:", error);
    return { text: "Estou tendo dificuldade em processar isso agora. Verifique sua conexão com o núcleo Antigravity.", actions: [] };
  }
}

export async function generateEntrepreneurDiagnostic(data: any) {
  // Lógica para gerar diagnóstico comportamental e técnico
  const score = (data.coachability + data.execution_speed + data.resilience) / 3;
  let type = "Executor";
  if (data.commercial_score > data.technical_score) type = "Comercial";
  if (data.technical_score > 8) type = "Visionário Técnico";
  
  return {
    score,
    personality_type: type,
    similarity_notes: "Similaridade alta com empreendedores de fase de Tração acelerada."
  };
}
