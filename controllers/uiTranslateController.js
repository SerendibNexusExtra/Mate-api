const Translation = require("../models/Translation");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const translateUI = async (req, res) => {
  try {
    const { texts, targetLanguage } = req.body;

    if (!texts || !targetLanguage) {
      return res
        .status(400)
        .json({ message: "texts & targetLanguage required" });
    }

    let result = {};
    let missing = [];

    // 1️⃣ Check DB cache
    for (let text of texts) {
      const saved = await Translation.findOne({
        key: text,
        language: targetLanguage,
      });

      if (saved) {
        result[text] = saved.value;
      } else {
        missing.push(text);
      }
    }

    // 2️⃣ If something missing → Gemini
    if (missing.length > 0) {
      const prompt = `
Translate the following UI labels into ${targetLanguage}.
Return ONLY translations separated by "||".

${missing.join("\n")}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const translatedList = response.text.split("||").map((t) => t.trim());

      // 3️⃣ Save to DB
      for (let i = 0; i < missing.length; i++) {
        await Translation.create({
          key: missing[i],
          language: targetLanguage,
          value: translatedList[i],
        });

        result[missing[i]] = translatedList[i];
      }
    }

    res.json({
      success: true,
      translations: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Translation failed" });
  }
};

module.exports = { translateUI };
