const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const fs = require('fs');
const path = require('path');

// routes
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

let client;
let ttsInitialized = false;

try {
  console.log("🚀 Initializing TTS client...");

  let credentials;

  // 1. Prefer Base64 (Reliable in Railway)
  if (process.env.GOOGLE_TTS_CREDENTIALS_BASE64) {
    console.log("✅ GOOGLE_TTS_CREDENTIALS_BASE64 found");
    const decoded = Buffer.from(
      process.env.GOOGLE_TTS_CREDENTIALS_BASE64,
      "base64"
    ).toString("utf-8");
    credentials = JSON.parse(decoded);
  } else if (process.env.GOOGLE_TTS_CREDENTIALS) {
    // 2. Fallback to raw string if present
    let raw = process.env.GOOGLE_TTS_CREDENTIALS;
    if (typeof raw === "string") {
      credentials = JSON.parse(raw);
      if (typeof credentials === "string") credentials = JSON.parse(credentials);
    }
  }

  if (credentials && credentials.private_key) {
    // Normalize newlines in RSA key
    credentials.private_key = credentials.private_key
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .trim();

    client = new textToSpeech.TextToSpeechClient({
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });

    ttsInitialized = true;
    console.log("✅ TTS client initialized successfully!");
  } else {
    // 3. Local key fallback
    const localKeyPath = path.join(__dirname, "google-tts-key.json");
    if (fs.existsSync(localKeyPath)) {
      client = new textToSpeech.TextToSpeechClient({ keyFilename: localKeyPath });
      ttsInitialized = true;
      console.log("✅ TTS initialized from local file");
    } else {
      console.error("❌ No valid credentials found");
    }
  }
} catch (error) {
  console.error("❌ Failed to initialize TTS:", error);
  client = null;
  ttsInitialized = false;
}

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
app.get("/api/tts-debug", (req, res) => {
  let credentialInfo = {};
  const hasBase64 = !!process.env.GOOGLE_TTS_CREDENTIALS_BASE64;
  const hasRaw = !!process.env.GOOGLE_TTS_CREDENTIALS;

  try {
    let creds;
    if (hasBase64) {
      const decoded = Buffer.from(process.env.GOOGLE_TTS_CREDENTIALS_BASE64, "base64").toString("utf-8");
      creds = JSON.parse(decoded);
    } else if (hasRaw) {
      let raw = process.env.GOOGLE_TTS_CREDENTIALS;
      creds = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (typeof creds === "string") creds = JSON.parse(creds);
    }

    if (creds) {
      credentialInfo = {
        hasEnvVar: true,
        source: hasBase64 ? "base64" : "raw_json",
        projectId: creds.project_id,
        clientEmail: creds.client_email,
        hasPrivateKey: !!creds.private_key,
        privateKeyLength: creds.private_key?.length || 0,
        privateKeyStartsCorrectly: creds.private_key?.startsWith("-----BEGIN PRIVATE KEY-----"),
      };
    } else {
      credentialInfo = {
        hasEnvVar: false,
        message: "Neither GOOGLE_TTS_CREDENTIALS_BASE64 nor GOOGLE_TTS_CREDENTIALS found",
      };
    }
  } catch (error) {
    credentialInfo = {
      hasEnvVar: hasBase64 || hasRaw,
      parseError: error.message,
    };
  }

  res.json({
    ttsInitialized,
    hasClient: !!client,
    credentials: credentialInfo,
    environment: process.env.NODE_ENV || "development",
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
