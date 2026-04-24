const fs = require('fs');
const axios = require('axios');
const OpenAI = require("openai");
const Twitter = require('twitter');

// Set up OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up Twitter API credentials
const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Function to generate blog article using OpenAI API
async function generateArticle(keyword = "Amazon FBA product research", language = "en") {
  const prompt = `
You are an expert SEO content writer specializing in Amazon FBA.

Write a HIGH QUALITY blog article.

Topic: ${keyword}

Requirements:
- 1500–2500 words
- SEO optimized but NOT spammy
- Natural tone, human readable
- Include sections:
  1. Introduction
  2. Problem explanation
  3. Step-by-step guide
  4. Tools section (include JungleScout naturally)
  5. Mistakes to avoid
  6. Conclusion with actionable advice

Affiliate requirement:
- Mention JungleScout as a recommended tool naturally
- Include this link ONCE: https://get.junglescout.com/wloofjbvk5mp
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  let articleContent = res.choices[0].message.content;

  // Translate the article if not in English (use Google Translate API)
  if (language !== "en") {
    articleContent = await translateContent(articleContent, language);
  }

  return articleContent;
}

// Function to translate content using Google Translate API
async function translateContent(text, targetLanguage) {
  const response = await axios.post(
    `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
    {
      q: text,
      target: targetLanguage,
    }
  );

  return response.data.data.translations[0].translatedText;
}

// Function to save the article as HTML
async function saveArticle(title, content, language) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const filePath = `./posts/${language}/${slug}.html`;

  const html = `
    <html lang="${language}">
    <head>
      <title>${title}</title>
      <meta name="description" content="${title}">
    </head>
    <body>
      <article>
        <h1>${title}</h1>
        <div>${content.replace(/\n/g, "<br>")}</div>
      </article>
    </body>
    </html>
  `;

  await fs.promises.writeFile(filePath, html);

  return filePath;
}

// Function to submit article URL to Google Indexing API
async function submitToGoogleIndexingAPI(url) {
  const response = await axios.post('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    url: url,
    type: 'URL_UPDATED'
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`
    }
  });

  console.log("Submitted to Google:", response.data);
}

// Function to post content to Twitter
async function postToTwitter(content) {
  try {
    await twitterClient.post('statuses/update', { status: content });
    console.log("Posted to Twitter successfully!");
  } catch (error) {
    console.error("Error posting to Twitter:", error);
  }
}

// Main generation and posting function
async function runGenerator() {
  const keywords = [
    "best Amazon FBA products 2026",
    "how to find winning products on Amazon",
    "JungleScout product research guide",
    "Amazon FBA beginner strategy",
    "low competition Amazon niches"
  ];

  const languages = ['en', 'es', 'fr', 'de', 'pt'];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const language = languages[Math.floor(Math.random() * languages.length)];

  const article = await generateArticle(keyword, language);
  const path = await saveArticle(keyword, article, language);

  console.log("Generated article at:", path);

  // Submit to Google Index API
  await submitToGoogleIndexingAPI(path);

  // Promote on social media
  const message = `Check out our latest blog: ${keyword} - ${path} #AmazonFBA #JungleScout #ProductResearch #Ecommerce`;
  await postToTwitter(message);
}

// Run the generator (can be automated via cron or API)
runGenerator();
