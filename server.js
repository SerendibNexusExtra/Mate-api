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
const fs = require('fs'); // Add this
const path = require('path'); // Add this
dns.setDefaultResultOrder("ipv4first");

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

// TTS Client Initialization with better error handling
let client;

async function initializeTTSClient() {
  try {
    if (process.env.GOOGLE_TTS_KEY_BASE64) {
      console.log('📥 Loading TTS key from environment variable...');
      console.log(`Base64 length: ${process.env.GOOGLE_TTS_KEY_BASE64.length}`);
      
      // Decode base64
      const keyJson = Buffer.from(process.env.GOOGLE_TTS_KEY_BASE64, 'base64').toString('utf8');
      console.log(`📄 Decoded JSON length: ${keyJson.length}`);
      
      // Parse JSON
      const credentials = JSON.parse(keyJson);
      console.log(`✅ JSON parsed. Project: ${credentials.project_id}`);
      console.log(`📧 Client email: ${credentials.client_email}`);
      
      // Initialize client with credentials
      client = new textToSpeech.TextToSpeechClient({
        credentials: credentials
      });
      
      // Test the client
      console.log('🔄 Testing TTS client...');
      const testRequest = {
        input: { text: 'test' },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };
      
      await client.synthesizeSpeech(testRequest);
      console.log('✅ TTS client initialized and tested successfully!');
      
    } else {
      console.log('⚠️ GOOGLE_TTS_KEY_BASE64 not found, trying file...');
      
      // Check if file exists
      const keyFilePath = path.join(__dirname, 'google-tts-key.json');
      if (fs.existsSync(keyFilePath)) {
        console.log('📁 Found google-tts-key.json file');
        client = new textToSpeech.TextToSpeechClient({
          keyFilename: keyFilePath
        });
        console.log('✅ TTS client initialized with file');
      } else {
        console.error('❌ No TTS key found in environment or file!');
        client = null;
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize TTS client:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    client = null;
  }
}

// Initialize TTS before starting server
initializeTTSClient().then(() => {
  console.log('TTS initialization complete');
});

console.log('Registering TTS route at /api/tts/speak');

// POST /tts endpoint with better error handling
app.post('/api/tts/speak', async (req, res) => {
  try {
    console.log('TTS request received:', req.body);
    
    // Check if client is initialized
    if (!client) {
      console.error('TTS client not initialized');
      return res.status(503).json({ 
        error: 'TTS service unavailable',
        details: 'TTS client failed to initialize'
      });
    }
    
    const { text, languageCode } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const request = {
      input: { text },
      voice: { 
        languageCode: languageCode || 'en-US', 
        ssmlGender: 'NEUTRAL' 
      },
      audioConfig: { 
        audioEncoding: 'MP3', 
        speakingRate: 0.85 
      },
    };

    console.log('Sending request to Google TTS...');
    const [response] = await client.synthesizeSpeech(request);
    console.log('✅ TTS successful');
    
    res.json({ 
      audioContent: response.audioContent.toString('base64')
    });
    
  } catch (error) {
    console.error('❌ TTS backend error:', error);
    
    // Send more detailed error
    res.status(500).json({ 
      error: 'TTS failed',
      message: error.message,
      code: error.code
    });
  }
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
app.use("/api/pronunciation", pronunciationRoutes);      
app.use("/api/pronunciation-questions", pronunciationQRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/grammar/questions', grammarQuestionRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/ui-translate", uiTranslateRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/', blankQuestionsRoutes);

// MongoDB connect and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.log("❌ MongoDB error:", err));
