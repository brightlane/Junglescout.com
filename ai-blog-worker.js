import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create posts folder if not exists
if (!fs.existsSync("./posts")) {
  fs.mkdirSync("./posts");
}

const keywords = [
  "best Amazon FBA products 2026",
  "how to find winning Amazon products",
  "JungleScout product research guide",
  "Amazon FBA beginner strategy",
  "low competition Amazon niches",
  "how to scale Amazon FBA business",
  "product research tools for Amazon sellers",
  "how to start Amazon FBA with no experience"
];

function pickKeyword() {
  return keywords[Math.floor(Math.random() * keywords.length)];
}

/**
 * AI ARTICLE GENERATION
 */
async function generateArticle(keyword) {
  const prompt = `
Write a HIGH QUALITY SEO blog article about Amazon FBA.

Topic: ${keyword}

Rules:
- 1500–2500 words
- Clear structure with headings
- No spam, no repetition
- Natural human tone
- Include JungleScout as a recommended tool
- Include this affiliate link once:
https://get.junglescout.com/wloofjbvk5mp

Sections:
1. Introduction
2. Problem breakdown
3. Step-by-step strategy
4. Tools (mention JungleScout naturally)
5. Common mistakes
6. Final advice
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
}

/**
 * SAVE HTML FILE
 */
function saveArticle(title, content) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const filePath = path.join("./posts", `${slug}.html`);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="description" content="${title}">
</head>
<body style="font-family:Arial;max-width:800px;margin:auto;padding:20px;">
  <h1>${title}</h1>
  <article>${content.replace(/\n/g, "<br>")}</article>
</body>
</html>
`;

  fs.writeFileSync(filePath, html);
  console.log("Saved:", filePath);
}

/**
 * WAIT FUNCTION (controls API safety)
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 🔁 MAIN INFINITE WORKER LOOP
 */
async function startWorker() {
  console.log("🚀 AI Blog Worker Started...");

  while (true) {
    try {
      const keyword = pickKeyword();

      console.log("🧠 Generating:", keyword);

      const article = await generateArticle(keyword);

      saveArticle(keyword, article);

      console.log("✅ Done:", keyword);

      // ⏱ SAFE DELAY (prevents API spam / bans)
      await wait(60 * 60 * 1000); // 1 article per hour

    } catch (err) {
      console.error("❌ Error:", err.message);

      // wait before retry if failure
      await wait(5 * 60 * 1000);
    }
  }
}

// START WORKER
startWorker();
