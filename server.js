import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in .env file!");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = 3000;

// Directory helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root welcome route (optional)
app.get('/', (req, res) => {
  res.send('🤖 BuilPro Chat API is running. Visit /services.html');
});

// API route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message || error);
    res.status(500).json({ error: 'Something went wrong while contacting OpenAI.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
