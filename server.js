const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const fs = require('fs');
const path = require('path');

// Import routes
const languageRoutes = require("./routes/languageRoutes");
const alphabetRoutes = require("./routes/alphabetRoutes");
const communicationRoutes = require("./routes/commbasicsRoutes");
const questionFormRoutes = require("./routes/questionFormRoutes");
const vocabularyExpansionRoutes = require("./routes/vocabularyExpansionRoutes");
const authRoutes = require("./routes/authRoutes");
const essentialVocabRoutes = require("./routes/essentialVocabRoutes");
const prepositionRoutes = require("./routes/prepositionRoutes");
const basicTenseRoutes = require("./routes/basicTenseRoutes");
const pronounsRoutes = require("./routes/pronounsRoutes");
const pronunciationRoutes = require("./routes/pronunciationRoutes");
const pronunciationQRoutes = require('./routes/pronunciationQRoutes');
const readingRoutes = require("./routes/readingRoutes");
const translateRoutes = require("./routes/translateRoutes");
const textToSpeech = require('@google-cloud/text-to-speech');
const uiTranslateRoutes = require("./routes/uiTranslateRoutes");
const modulesRoutes = require("./routes/modules");
const questionRoutes = require("./routes/questionRoutes");
const scoreRoutes = require('./routes/scoreRoutes');
const questionFormsQuestionsRoutes = require("./routes/questionformsquestionsRoutes");
const vocabularyRoutes = require('./routes/vocabularyRoutes');
const vocabularyQuestionRoutes = require('./routes/vocabularyQuestionRoutes');
const blankQuestionsRoutes = require('./routes/blankQuestions');
const grammarRoutes = require('./routes/grammarRoutes');
const grammarQuestionRoutes = require('./routes/grammarQuestionRoutes');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 🔧 TTS CLIENT - WORKS BOTH LOCALLY AND ON RAILWAY
// ============================================
let client;
let ttsInitialized = false;

try {
  console.log('🚀 Initializing TTS client...');

  // METHOD 1: Environment variable (Railway)
  if (process.env.GOOGLE_TTS_CREDENTIALS) {
    console.log('✅ Using GOOGLE_TTS_CREDENTIALS from environment');
    const credentials = JSON.parse(process.env.GOOGLE_TTS_CREDENTIALS);
    client = new textToSpeech.TextToSpeechClient({ 
      credentials: credentials 
    });
    ttsInitialized = true;
    console.log('✅ TTS initialized from environment variable');
  } 
  // METHOD 2: Local file (development)
  else {
    const localKeyPath = path.join(__dirname, 'google-tts-key.json');
    console.log('🔍 Looking for local key at:', localKeyPath);
    if (fs.existsSync(localKeyPath)) {
      console.log('✅ Using local key file');
      client = new textToSpeech.TextToSpeechClient({
        keyFilename: localKeyPath,
      });
      ttsInitialized = true;
      console.log('✅ TTS initialized from local file');
    } else {
      console.error('❌ No TTS credentials found');
    }
  }

} catch (error) {
  console.error('❌ Failed to initialize TTS:', error.message);
  client = null;
  ttsInitialized = false;
}

console.log(`📊 TTS Status: ${ttsInitialized ? '✅ Initialized' : '❌ Not Initialized'}`);
console.log('Registering TTS route at /api/tts/speak');

// ============================================
// 🔧 TTS ENDPOINT - FIXED VOICE ISSUE
// ============================================
app.post('/api/tts/speak', async (req, res) => {
  try {
    console.log('📢 TTS request received:', req.body);
    const { text, languageCode } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ttsInitialized || !client) {
      return res.status(503).json({ 
        error: 'TTS service not configured',
        details: 'Client not initialized. Check server logs.'
      });
    }

    // Fixed: Use FEMALE instead of NEUTRAL
    const request = {
      input: { text },
      voice: { 
        languageCode: languageCode || 'en-US', 
        ssmlGender: 'FEMALE'  // Changed from NEUTRAL to FEMALE
      },
      audioConfig: { 
        audioEncoding: 'MP3', 
        speakingRate: 0.85 
      },
    };

    console.log('⏳ Sending to Google TTS...');
    const [response] = await client.synthesizeSpeech(request);

    if (!response || !response.audioContent) {
      throw new Error('No audio content received');
    }

    console.log('✅ TTS success! Audio size:', response.audioContent.length);

    res.json({ 
      audioContent: response.audioContent.toString('base64'),
      success: true 
    });

  } catch (error) {
    console.error('❌ TTS backend error:', error);
    res.status(500).json({ 
      error: 'TTS failed',
      details: error.message 
    });
  }
});

// ============================================
// 🔧 DEBUG ENDPOINT
// ============================================
app.get('/api/tts-debug', (req, res) => {
  res.json({
    ttsInitialized: ttsInitialized,
    hasClient: !!client,
    hasCredentials: !!process.env.GOOGLE_TTS_CREDENTIALS,
    credentialsLength: process.env.GOOGLE_TTS_CREDENTIALS?.length || 0,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register routes
app.use("/api/languages", languageRoutes);
app.use("/api/alphabet", alphabetRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/questionforms", questionFormRoutes);
app.use("/api/vocabularyexpansion", vocabularyExpansionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/essential-vocab", essentialVocabRoutes);
app.use("/api/prepositions", prepositionRoutes);
app.use("/api/basictenses", basicTenseRoutes);
app.use("/api/pronouns", pronounsRoutes);
app.use("/api/reading", readingRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/vocabulary/questions', vocabularyQuestionRoutes);

// Pronunciation routes
app.use("/api/pronunciation", pronunciationRoutes);
app.use("/api/pronunciation-questions", pronunciationQRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/grammar/questions', grammarQuestionRoutes);

app.use("/api/translate", translateRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/ui-translate", uiTranslateRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/scores', scoreRoutes);
app.use("/api/blank-questions", blankQuestionsRoutes);
app.use("/api/questionformsquestions", questionFormsQuestionsRoutes);

// MongoDB connect and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
      console.log(`📊 TTS Status: ${ttsInitialized ? '✅ Initialized' : '❌ Not Initialized'}`);
    });
  })
  .catch((err) => console.log(err));
