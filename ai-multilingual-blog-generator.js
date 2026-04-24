import OpenAI from 'openai';
import { Translate } from '@google-cloud/translate';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI and Google Translate
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

// Initialize Google Indexing API
const indexer = google.indexing('v3');

// Google Indexing API setup
async function notifyGoogleOfNewContent(url) {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  const res = await indexer.urlNotifications.publish({
    requestBody: {
      url: url,
      type: 'URL_UPDATED',
    },
  });

  console.log('Google Indexing API notification sent for:', url);
}

// Generate Article
async function generateArticle(keyword, language = 'en') {
  const prompt = `
  Write a high-quality blog article in English. The topic is "${keyword}". It should include:
  - Introduction
  - Problem explanation
  - Step-by-step guide
  - Tools section (include JungleScout naturally)
  - Mistakes to avoid
  - Conclusion with actionable advice
  
  Include this link once: https://get.junglescout.com/wloofjbvk5mp
  Make sure the content is SEO optimized, readable, and engaging.
  `;
  
  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  let articleContent = res.choices[0].message.content;

  // Translate content into the desired language
  if (language !== 'en') {
    const [translation] = await translate.translate(articleContent, language);
    articleContent = translation;
  }

  return articleContent;
}

// Save the article to a file
async function saveArticle(title, content, language = 'en') {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const dirPath = path.join(__dirname, 'posts', language);
  const filePath = path.join(dirPath, `${slug}.html`);

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <title>${title}</title>
      <meta name="description" content="${title}">
      <meta name="keywords" content="${title}, JungleScout, Affiliate">
    </head>
    <body>
      <article>
        <h1>${title}</h1>
        <div>${content.replace(/\n/g, '<br>')}</div>
      </article>
    </body>
    </html>
  `;

  fs.writeFileSync(filePath, html);
  console.log(`Article saved: ${filePath}`);

  // Notify Google Indexing API
  const articleUrl = `https://yourdomain.com/posts/${language}/${slug}.html`;
  await notifyGoogleOfNewContent(articleUrl);

  return filePath;
}

// Main function for article generation
async function runGenerator() {
  const languages = ['en', 'es', 'fr', 'de', 'it']; // English, Spanish, French, German, Italian
  const keywords = [
    "Best Amazon FBA tools for 2026",
    "How to find winning Amazon products",
    "JungleScout vs Helium 10",
    "Product research guide for Amazon FBA",
    "How to scale your Amazon FBA business"
  ];

  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const language = languages[Math.floor(Math.random() * languages.length)];

  // Generate article in the selected language
  const article = await generateArticle(keyword, language);

  // Save article
  const path = await saveArticle(keyword, article, language);
  console.log(`Generated and saved article: ${path}`);
}

// Schedule the generator to run every hour
setInterval(runGenerator, 3600000); // 1 hour in milliseconds
