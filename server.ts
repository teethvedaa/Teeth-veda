import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environmental parameters
dotenv.config();

const app = express();
const PORT = 3000;

// Increase request payload size limits for image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Initialize Google Gen AI with server-side key
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not defined or is placeholder in secrets / .env');
  }
  return new GoogleGenAI({ apiKey });
};

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Main Chatbot Assistant endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, image, language, history } = req.body;
    const ai = getAiClient();

    const selectedLanguage = (language || 'english').toLowerCase();

    // Define System Instructions for the Teeth Veda Persona
    const systemPrompt = `You are 'Teeth Veda', a highly compassionate and expert Ayurvedic Dental Health Coach specializing in helping people who chew or smoke tobacco products (including gutka, khaini, pan masala, betel nut, cigarettes, bidi) restore their oral environment and teeth. 

Your objectives are:
1. Provide safe, traditional Indian home remedies (desi nuskhe) to help them whiten yellow/dark tobacco teeth stains.
2. Provide recipes to solve dry mouth or severe bad breath (muh ki badboo/breath odour) using natural elements.
3. Strongly guide and inspire them to quit their health-damaging habits. 
4. Recommend delicious culinary herbal chew alternatives like chewing sweet fennel seeds (meethi saunf), cardamom (elaichi), cloves (laung), dry ginger pieces (sonth), or sugar candy (mishri) to satisfy oral fixation and control sudden withdrawal cravings.
5. Suggest natural, safe dental paste (manjan) mixtures, e.g., a pinch of baking soda or turmeric mixed with natural rock salt (sendha namak) and a few drops of mustard oil (sarso ka tel), advising them to rub light-handedly to prevent damage to teeth enamel or sensitive gums.

LEGAL AND HEALTH SAFETY COMPLIANCE:
- If analyzed with teeth photographs, caution them about staining levels.
- IMPORTANT: If they mention or your vision analysis reveals severe gum bleeding, black ulcers, white patches that do not scrape off, or limited jaw/mouth opening (Oral Submucous Fibrosis - OSMF symptoms), tell them to stop habits IMMEDIATELY and mandate consulting a professional Dentist or oncology oral surgeon.
- Always append a gentle medical disclaimer at the end in Hindi or the preferred language stating that these Ayurvedic suggestions are only for informational support and not a substitute for qualified clinical dental interventions.

Linguistic Requirement:
Answer in the selected language: "${selectedLanguage}".
- If "hindi", use clear, friendly Devnagari Hindi.
- If "english", use encouraging plain English.
- If "hinglish", use casual Hindi written in the Roman script (e.g., "Aapko meethi saunf chabani chahiye").
- If "bengali", use warm Bengali.
- If "marathi", use respectful Marathi.

Be highly motivating, respectful, and never sound harsh.`;

    const contents: any[] = [];

    // Map conversation context history if exists
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        contents.push({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      });
    }

    // Prepare current query parts
    const currentParts: any[] = [];

    // Add image input part if attached
    if (image) {
      const reg = /^data:(image\/\w+);base64,(.+)$/;
      const match = image.match(reg);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        currentParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
    }

    // Add main user text prompt
    currentParts.push({ text: message || 'Please analyze my teeth information and habits.' });

    // Append current turn to contents
    contents.push({
      role: 'user',
      parts: currentParts
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response package', 
      details: error.message || 'Unknown error'
    });
  }
});

// Setup development or production environment
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server mounted as Express middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static build serving from:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Teeth Veda server running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
