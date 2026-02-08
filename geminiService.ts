
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, ManhwaStory, Page, Panel, Character } from "./types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.API_KEY || ''
});


const STORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    plot: { type: Type.STRING },
    characters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          appearance: { type: Type.STRING, description: "Detailed physical description for AI image generation" },
          personality: { type: Type.STRING },
          role: { type: Type.STRING }
        },
        required: ["name", "appearance", "personality", "role"]
      }
    },
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pageNumber: { type: Type.INTEGER },
          panels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                visualPrompt: { type: Type.STRING, description: "Detailed prompt for an image model including character actions, camera angle, and background" },
                dialogue: { type: Type.STRING },
                sfx: { type: Type.STRING, description: "Onomatopoeia like BAM, WHOOSH, etc" },
                narration: { type: Type.STRING }
              },
              required: ["visualPrompt", "dialogue", "sfx"]
            }
          }
        },
        required: ["pageNumber", "panels"]
      }
    },
    twistMoment: { type: Type.STRING }
  },
  required: ["title", "plot", "characters", "pages", "twistMoment"]
};

export async function generateManhwaStructure(config: AppState): Promise<ManhwaStory> {
  const prompt = `
    Create a detailed Japanese-style manhwa/webtoon script based on this idea: "${config.prompt}".
    
    Genre: ${config.genre}
    Tone: ${config.tone}
    Length: ${config.pageCount} pages
    Panels per page: ${config.panelsPerPage}
    Twist: ${config.twistIntensity}
    
    Instructions:
    1. Create a compelling title and characters with very detailed physical descriptions (hair color, eye shape, outfit) to maintain consistency.
    2. Expand the idea into a full narrative with a distinct setup, build-up, a major twist (${config.twistIntensity}), and aftermath.
    3. For each panel, provide a 'visualPrompt' that describes the scene, the character's pose, the camera angle (e.g., Dutch angle, close-up, wide shot), and the background.
    4. Style: Vibrant colored manhwa, clean lines, high quality.
    5. Ensure characters have distinct names used in visual prompts.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: STORY_SCHEMA
    }
  });

  const storyData = JSON.parse(response.text || '{}');
  
  // Inject unique IDs
  const story: ManhwaStory = {
    ...storyData,
    pages: storyData.pages.map((page: any, pIdx: number) => ({
      ...page,
      id: `page-${pIdx}`,
      panels: page.panels.map((panel: any, panIdx: number) => ({
        ...panel,
        id: `panel-${pIdx}-${panIdx}`,
        status: 'pending'
      }))
    }))
  };

  return story;
}

export async function generatePanelImage(panel: Panel, characters: Character[]): Promise<string> {
  const characterContext = characters.map(c => `${c.name} looks like: ${c.appearance}`).join('. ');
  const fullPrompt = `
    Manhwa webtoon style, vibrant digital colors, clean ink lines.
    Character Context: ${characterContext}.
    Scene Description: ${panel.visualPrompt}.
    Perspective: Professional manga framing.
    No text in the image.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }]
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("Image generation failed");
  return imageUrl;
}
