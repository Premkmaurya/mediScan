const { GoogleGenAI } = require("@google/genai");

//
// ⭐ STEP 1: Get your API key from environment variables.
// On Render, you MUST set an environment variable called GEMINI_API_KEY.
//
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

//
// ⭐ STEP 2: Define your persona details just ONCE.
// I'm just copying what you already wrote.
//
const personaConfig = {
  persona_name: "MediScan Health Companion",
  role: "Digital Health Guide and Document Simplifier.",
  goals: [
    "Translate complex medical reports and jargon (from text, PDF, or images) into simple, clear, actionable advice.",
    "Summarize health documents by highlighting key results and deviations from the normal range.",
    "Provide clear explanations of medical terms.",
  ],
  tone_and_style: {
    primary: "Empathetic, Calm, Reassuring, and Highly Professional.",
    language:
      "Clear English/Hinglish (Simple vocabulary, avoiding complex fillers).",
    focus: "Action-Oriented (Telling the user what to do next).",
  },
  mandatory_guidelines: [
    "NEVER provide medical diagnosis, prescribe medication, or offer emergency treatment suggestions.",
    "ALWAYS include a disclaimer emphasizing that the information is informational and not a replacement for a qualified doctor.",
    "When summarizing a report, structure the response clearly by identifying Normal, Slight Deviation, and Significant Deviation results.",
    "In multimodal responses (file + text), prioritize responding to the user's explicit question about the file.",
  ],
  example_disclaimer:
    "DISCLAIMER: This information is provided by an AI assistant for informational purposes only and is based solely on the data provided. Always consult with a qualified healthcare professional regarding any medical concerns or treatment decisions.",
};

//
// ⭐ STEP 3: Turn that object into a single string.
// This is the actual prompt text the AI will read.
//
const systemPrompt = `
**Persona:** ${personaConfig.persona_name}
**Role:** ${personaConfig.role}

**Goals:**
${personaConfig.goals.map((g) => `- ${g}`).join("\n")}

**Tone and Style:**
- Primary: ${personaConfig.tone_and_style.primary}
- Language: ${personaConfig.tone_and_style.language}
- Focus: ${personaConfig.tone_and_style.focus}

**Mandatory Guidelines:**
${personaConfig.mandatory_guidelines.map((g) => `- ${g}`).join("\n")}

**Example Disclaimer:**
${personaConfig.example_disclaimer}
`;

//
// ⭐ STEP 4: Create the FINAL systemInstruction object in the
// correct format that the API expects.
//
const systemInstruction = {
  role: "system",
  parts: [{ text: systemPrompt }],
};

//
// ⭐ STEP 5: Use this in your functions.
//
async function genrateResponse(stm, data) {
  const userMessage = data.parts[0].text ? data.parts[0].text.trim() : "";
  let contents = [...stm];
  if (userMessage && data.file) {
    const summarizeText = await summarizeFile(data);
    return summarizeText;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    systemInstruction: systemInstruction, // <-- MOVED here
    config: {
      temperature: 0.7,
      // The system instruction is REMOVED from here
    },
  });
  return response.text;
}

async function summarizeFile(fileData) {
  const userMessage = fileData.parts[0].text
    ? fileData.parts[0].text.trim()
    : "";

  const contents = [
    { text: userMessage },
    {
      inlineData: {
        mimeType: fileData.fileType,
        data: fileData.file,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    systemInstruction: systemInstruction, // <-- MOVED here
    config: {
      temperature: 0.7,
      // The system instruction is REMOVED from here
    },
  });
  return response.text;
}

module.exports = {
  genrateResponse,
};