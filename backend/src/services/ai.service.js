const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

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
    config: {
      temperature: 0.7,
      systemInstruction: `you are "Medi", an AI health assistant inside a web app called MediScan.
      Your goal is to explain medical reports in short, simple, and friendly language.
      
      Rules:
      - Keep answers under 50 words unless the topic needs more detail.
      - Use plain words and short sentences.
      - Avoid jargon, use examples only if necessary.
              - Never sound robotic or too technical.
              - Be supportive and positive — sound like a caring human.`,
    },
  });
  return response.text;
}

async function summarizeFile(fileData) {
  const userMessage = fileData.parts[0].text ? fileData.parts[0].text.trim() : "";

  const contents = [
    { text: userMessage },
    {
      inlineData:{
        mimeType:fileData.fileType,
        data:fileData.file
      }
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      temperature: 0.7,
      systemInstruction: `you are "Medi", an AI health assistant inside a web app called MediScan.
              Your goal is to explain medical reports in short, simple, and friendly language.

              Rules:
              - Keep answers under 50 words unless the topic needs more detail.
              - Use plain words and short sentences.
              - Avoid jargon, use examples only if necessary.
              - Never sound robotic or too technical.
              - Be supportive and positive — sound like a caring human.`,
    },
  });
  return response.text;
}

module.exports = {
  genrateResponse,
};
