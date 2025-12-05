import { GoogleGenAI } from "@google/genai";
import { Lead, LeadStatus, LeadTemperature } from "../types";

// Helper to get client with current key
export const getGeminiClient = () => {
    const apiKey = process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey });
};

export const searchLeads = async (industry: string, location: string): Promise<Lead[]> => {
  const ai = getGeminiClient();
  
  const prompt = `Find 5 real businesses in ${location} related to the ${industry} industry. 
  For each business, provide the name, a hypothetical but realistic lead score (0-100) based on online presence, 
  and a brief categorization (Hot/Warm/Cold).
  
  Return the data as a JSON array. 
  Each object should have: businessName, website (if found, else empty), phone (if found), brief description (notes).
  Do not include markdown formatting like \`\`\`json. Just the raw JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text;
    if (!text) return [];

    // Extract grounding chunks if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let sources: { title: string; uri: string }[] = [];
    
    if (groundingChunks) {
      sources = groundingChunks
        .map((chunk: any) => {
          if (chunk.web) {
            return { title: chunk.web.title, uri: chunk.web.uri };
          }
          return null;
        })
        .filter((s: any) => s !== null);
    }

    // Clean up potential markdown code blocks
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    // Remove any text before the first [ and after the last ]
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
        text = text.substring(start, end + 1);
    }

    const rawLeads = JSON.parse(text);
    
    return rawLeads.map((l: any, index: number) => ({
      id: `generated-${Date.now()}-${index}`,
      businessName: l.businessName,
      industry: industry,
      location: location,
      website: l.website,
      phone: l.phone,
      notes: l.notes,
      score: l.score,
      temperature: l.temperature as LeadTemperature,
      status: LeadStatus.PROSPECT,
      source: 'AI Search',
      searchSources: sources.length > 0 ? sources : undefined
    }));

  } catch (error) {
    console.error("Error searching leads:", error);
    return [];
  }
};

export const generateOutreachMessage = async (lead: Lead, type: 'email' | 'linkedin' | 'sms'): Promise<string> => {
  const ai = getGeminiClient();
  
  const prompt = `Write a ${type} outreach message to ${lead.businessName} in the ${lead.industry} industry.
  The goal is to offer our services to help them grow.
  The tone should be professional but conversational.
  Keep it under ${type === 'sms' ? '160 characters' : '200 words'}.
  Context: They are located in ${lead.location}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate message.";
  } catch (e) {
    console.error(e);
    return "Error generating message.";
  }
}