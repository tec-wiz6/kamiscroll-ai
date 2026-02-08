// api/generate-manhwa-structure.ts

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const config = req.body; // AppState from frontend

    const prompt = `
You are a creative manga / manhwa writer.

Create a full webtoon script based on this idea: "${config.prompt}".

Details:
- Genre: ${config.genre}
- Tone: ${config.tone}
- Length: ${config.pageCount} pages
- Panels per page: ${config.panelsPerPage}
- Twist intensity: ${config.twistIntensity}

IMPORTANT:
- Respond with JSON ONLY (no markdown, no explanation).
- Do not include any text before or after the JSON.
- Follow this structure exactly.

Return this JSON object:
{
  "title": "string",
  "plot": "string",
  "characters": [
    {
      "name": "string",
      "appearance": "string",
      "personality": "string",
      "role": "string"
    }
  ],
  "pages": [
    {
      "pageNumber": 1,
      "panels": [
        {
          "visualPrompt": "string",
          "dialogue": "string",
          "sfx": "string",
          "narration": "string"
        }
      ]
    }
  ],
  "twistMoment": "string"
}
`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is not set");
      return res.status(500).json({ error: "Server misconfigured: missing API key" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // good, fast, cheap model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Groq error:", response.status, text);
      return res.status(500).json({ error: "AI provider error" });
    }

    const json = await response.json();
    const content: string = json.choices?.[0]?.message?.content || "{}";

    function extractJson(text: string): any {
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
        throw new Error("No JSON object found");
      }
      const jsonString = text.slice(firstBrace, lastBrace + 1);
      return JSON.parse(jsonString);
    }

    let storyData: any;
    try {
      storyData = extractJson(content);
    } catch (e) {
      console.error("Failed to parse story JSON:", e, "content:", content);
      storyData = {
        title: "",
        plot: "",
        characters: [],
        pages: [],
        twistMoment: "",
      };
    }

    const story = {
      ...storyData,
      pages: (storyData.pages || []).map((page: any, pIdx: number) => ({
        ...page,
        id: `page-${pIdx}`,
        panels: (page.panels || []).map((panel: any, panIdx: number) => ({
          ...panel,
          id: `panel-${pIdx}-${panIdx}`,
          status: "pending",
        })),
      })),
    };

    return res.status(200).json(story);
  } catch (err) {
    console.error("Manhwa structure API error:", err);
    return res.status(500).json({ error: "Failed to generate manhwa structure" });
  }
}
