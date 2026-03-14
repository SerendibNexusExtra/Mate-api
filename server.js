// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();
// const dns = require("dns");
// dns.setDefaultResultOrder("ipv4first");


// const languageRoutes = require("./routes/languageRoutes");
// const alphabetRoutes = require("./routes/alphabetRoutes");
// const communicationRoutes = require("./routes/commbasicsRoutes");
// const questionFormRoutes = require("./routes/questionFormRoutes");
// const vocabularyExpansionRoutes = require("./routes/vocabularyExpansionRoutes");
// const authRoutes = require("./routes/authRoutes");
// const essentialVocabRoutes = require("./routes/essentialVocabRoutes");
// const prepositionRoutes = require("./routes/prepositionRoutes");
// const basicTenseRoutes = require("./routes/basicTenseRoutes");
// const pronounsRoutes = require("./routes/pronounsRoutes");
// const pronunciationRoutes = require("./routes/pronunciationRoutes"); // Original
// const pronunciationQRoutes = require('./routes/pronunciationQRoutes'); // New one with questions
// const readingRoutes = require("./routes/readingRoutes");
// const translateRoutes = require("./routes/translateRoutes");
// const textToSpeech = require('@google-cloud/text-to-speech');
// const uiTranslateRoutes = require("./routes/uiTranslateRoutes");
// const modulesRoutes = require("./routes/modules");
// const questionRoutes = require("./routes/questionRoutes");
// const scoreRoutes = require('./routes/scoreRoutes');
// //const questionformsquestionsroutes = require("./routes/questionformsquestionsroutes");
// const vocabularyRoutes = require('./routes/vocabularyRoutes');
// const vocabularyQuestionRoutes = require('./routes/vocabularyQuestionRoutes');
// const blankQuestionsRoutes = require('./routes/blankQuestions');
// const grammarRoutes = require('./routes/grammarRoutes');
// const grammarQuestionRoutes = require('./routes/grammarQuestionRoutes');


// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Initialize TTS client
// const client = new textToSpeech.TextToSpeechClient({
//   keyFilename: 'google-tts-key.json',
// });

// console.log('Registering TTS route at /api/tts/speak');

// // POST /tts endpoint
// app.post('/api/tts/speak', async (req, res) => {
//   try {
//     console.log('TTS request received:', req.body);
//     const { text, languageCode } = req.body;

//     const request = {
//       input: { text },
//       voice: { languageCode: languageCode || 'en-US', ssmlGender: 'NEUTRAL' },
//       audioConfig: { audioEncoding: 'MP3', speakingRate: 0.85 },
//     };

//     const [response] = await client.synthesizeSpeech(request);
//     res.json({ audioContent: response.audioContent.toString('base64') });
//   } catch (error) {
//     console.error('TTS backend error:', error);
//     res.status(500).json({ error: 'TTS failed' });
//   }
// });

// // Register routes on DIFFERENT paths
// app.use("/api/languages", languageRoutes);
// app.use("/api/alphabet", alphabetRoutes);
// app.use("/api/communication", communicationRoutes);
// app.use("/api/questionforms", questionFormRoutes);
// app.use("/api/vocabularyexpansion", vocabularyExpansionRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/essential-vocab", essentialVocabRoutes);
// app.use("/api/prepositions", prepositionRoutes);
// app.use("/api/basictenses", basicTenseRoutes);
// app.use("/api/pronouns", pronounsRoutes);
// app.use("/api/reading", readingRoutes);
// app.use('/api/vocabulary', vocabularyRoutes);
// app.use('/api/vocabulary/questions', vocabularyQuestionRoutes);

// // Pronunciation routes - DIFFERENT PATHS
// app.use("/api/pronunciation", pronunciationRoutes);      
// app.use("/api/pronunciation-questions", pronunciationQRoutes);
// app.use('/api/grammar', grammarRoutes);
// app.use('/api/grammar/questions', grammarQuestionRoutes);


// app.use("/api/translate", translateRoutes);
// app.use("/api/modules", modulesRoutes);
// app.use("/api/ui-translate", uiTranslateRoutes);
// app.use("/api/questions", questionRoutes);
// app.use('/api/scores', scoreRoutes);
// app.use('/api/vocabulary/questions', vocabularyQuestionRoutes);
// app.use('/', blankQuestionsRoutes);
// //app.use("/api/questionformsquestions", questionformsquestionsroutes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(5000, () => console.log("Server running on port 5000"));
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });










const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

// Routes
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
const uiTranslateRoutes = require("./routes/uiTranslateRoutes");
const modulesRoutes = require("./routes/modules");
const questionRoutes = require("./routes/questionRoutes");
const scoreRoutes = require('./routes/scoreRoutes');
const vocabularyRoutes = require('./routes/vocabularyRoutes');
const vocabularyQuestionRoutes = require('./routes/vocabularyQuestionRoutes');
const blankQuestionsRoutes = require('./routes/blankQuestions');
const grammarRoutes = require('./routes/grammarRoutes');
const grammarQuestionRoutes = require('./routes/grammarQuestionRoutes');

// Initialize Google TTS Client with better credential handling
let textToSpeechClient;
try {
  const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
  
  const credentials = process.env.GOOGLE_CREDENTIALS_JSON ? 
    JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON) : undefined;
  
  textToSpeechClient = new TextToSpeechClient({
    keyFilename: credentials ? undefined : 'google-tts-key.json',
    credentials: credentials
  });
  
  console.log('✅ Google TTS client initialized successfully');
} catch (error) {
  console.error('❌ TTS initialization failed:', error.message);
  textToSpeechClient = null;
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://yourdomain.com', 'https://yourfrontend.vercel.app'] : 
    true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    ttsAvailable: !!textToSpeechClient 
  });
});

// TTS Endpoint - Fixed and improved
app.post('/api/tts/speak', async (req, res) => {
  if (!textToSpeechClient) {
    return res.status(503).json({ 
      error: 'TTS service unavailable. Please check credentials.' 
    });
  }

  try {
    console.log('TTS request:', { text: req.body.text?.substring(0, 50), language: req.body.languageCode });
    
    const { text, languageCode = 'en-US' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Valid "text" parameter is required' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 chars)' });
    }

    const request = {
      input: { text: text.trim() },
      voice: { 
        languageCode, 
        ssmlGender: 'NEUTRAL',
        name: `${languageCode}-Standard-A` // More reliable voice selection
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 0.85,
        pitch: 0,
        volumeGainDb: 0
      },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    const audioBase64 = response.audioContent.toString('base64');
    
    console.log('✅ TTS generated successfully');
    res.json({ 
      success: true,
      audioContent: audioBase64,
      contentType: 'audio/mpeg',
      duration: response.audioConfig?.timeSeconds || 0
    });
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ 
      error: 'TTS generation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route registration - Fixed duplicate paths
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
app.use("/api/pronunciation", pronunciationRoutes);
app.use("/api/pronunciation-questions", pronunciationQRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/ui-translate", uiTranslateRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/vocabulary/questions", vocabularyQuestionRoutes);
app.use("/api/grammar", grammarRoutes);
app.use("/api/grammar/questions", grammarQuestionRoutes);

// Root route for blank questions
app.use('/', blankQuestionsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔊 TTS test: POST http://localhost:${PORT}/api/tts/speak`);
  });
};

startServer().catch(console.error);

