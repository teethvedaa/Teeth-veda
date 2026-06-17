import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Load environmental parameters
dotenv.config();

const app = express();
const PORT = 3000;

// Increase request payload size limits for image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Lazy initializer for Razorpay Client
let razorpayClient: any | null = null;
const getRazorpayClient = () => {
  if (!razorpayClient) {
    const keyId = process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error('Razorpay VITE_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variable is missing.');
    }
    // Using standard constructor with dynamic key verification
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayClient;
};

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

// Razorpay config check endpoint
app.get('/api/razorpay/config', (req, res) => {
  const hasKeys = !!(process.env.VITE_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  res.json({
    isLive: hasKeys,
    keyId: process.env.VITE_RAZORPAY_KEY_ID || null
  });
});

// Razorpay create order endpoint
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId || !['basic', 'standard', 'premium'].includes(planId)) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const PLAN_PRICES: Record<string, number> = {
      basic: 49,
      standard: 99,
      premium: 199
    };

    const priceINR = PLAN_PRICES[planId];
    if (priceINR === undefined) {
       return res.status(400).json({ error: 'Plan pricing not configured' });
    }

    const priceInPaise = priceINR * 100; // Razorpay operates in sub-units (paise for INR)

    try {
      const rzp = getRazorpayClient();
      const order = await rzp.orders.create({
        amount: priceInPaise,
        currency: 'INR',
        receipt: `receipt_plan_${planId}_${Date.now().toString().slice(-6)}`,
      });

      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.VITE_RAZORPAY_KEY_ID
      });
    } catch (rzpErr: any) {
      console.error('Razorpay SDK Order Creation Failed:', rzpErr);
      res.status(512).json({
        error: 'Razorpay keys are invalid or merchant account not initialized in Live Mode.',
        details: rzpErr.description || rzpErr.message || rzpErr
      });
    }
  } catch (error: any) {
    console.error('Create Order Global Error:', error);
    res.status(500).json({ error: error.message || 'Internal server payment setup error' });
  }
});

// Razorpay signature verification endpoint
app.post('/api/razorpay/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing parameters for payment response signature verification' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ error: 'Razorpay secret key is not configured on this server container.' });
    }

    const hmacSource = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(hmacSource)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({
        success: true,
        verified: true,
        message: 'Payment signature verified successfully.'
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid payment signature security check failed.'
      });
    }
  } catch (error: any) {
    console.error('Verify Payment error:', error);
    res.status(500).json({ error: error.message || 'Signature security validation failed.' });
  }
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
