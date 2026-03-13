const Translation = require("../models/Translation");
const User = require("../models/User");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const translateUI = async (req, res) => {
  try {
    const { uid, texts } = req.body;

    if (!uid || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "uid and texts array required",
      });
    }

    // 1️⃣ Find user
    const user = await User.findOne({ uid });
    if (!user || !user.nativeLanguage?.name) {
      return res.status(400).json({
        success: false,
        message: "User native language not set",
      });
    }

    const targetLanguage = user.nativeLanguage.name;
    console.log("Target language:", targetLanguage);
    console.log("Texts:", texts);

    let result = {};
    let missing = [];

    // 2️⃣ Cache lookup
    for (let text of texts) {
      const saved = await Translation.findOne({
        key: text,
        language: targetLanguage,
      });

      if (saved) result[text] = saved.value;
      else missing.push(text);
    }

    // 3️⃣ Gemini translate missing
    if (missing.length > 0) {
      const prompt = `
Translate the following UI labels into ${targetLanguage}.
Return ONLY translations separated by "||". Do NOT add anything else.

${missing.join("\n")}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const translated = response.text.split("||").map((t) => t.trim());

      for (let i = 0; i < missing.length; i++) {
        await Translation.create({
          key: missing[i],
          language: targetLanguage,
          value: translated[i],
        });

        result[missing[i]] = translated[i];
      }
    }

    res.json({ success: true, translations: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Translation failed" });
  }
};

module.exports = { translateUI };
