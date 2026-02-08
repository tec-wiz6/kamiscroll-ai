// src/geminiService.ts
// (You can rename later, but keep name for now to avoid editing imports)

import { AppState, ManhwaStory, Panel, Character } from "./types";

// 1) STORY GENERATION – uses your Groq API route
export async function generateManhwaStructure(config: AppState): Promise<ManhwaStory> {
  const res = await fetch("/api/generate-manhwa-structure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    throw new Error("Failed to generate manhwa story. Please try again later.");
  }

  const story: ManhwaStory = await res.json();
  return story;
}

// 2) IMAGE GENERATION – temporarily disabled (no API, no errors)
export async function generatePanelImage(
  panel: Panel,
  characters: Character[]
): Promise<string> {
  // For now, no automatic images – just return empty string.
  // Your UI should handle imageUrl === "" by showing only text.
  return "";
}
