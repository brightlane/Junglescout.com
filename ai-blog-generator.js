// ai-blog-generator.js

const OpenAI = require('openai'); // Assuming OpenAI API for generating content
const fs = require('fs');
const path = require('path');

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Use your OpenAI API key here
});

/**
 * Generate high-quality SEO-optimized article
 */
async function generateArticle(keyword = "JungleScout Amazon FBA guide") {
  const prompt = `
  Write a high-quality, SEO-optimized blog article about ${keyword}. Include the following:
  - 1500 to 2500 words
  - Clear headings and subheadings
  - The content should have:
    1. Introduction (Explain the importance of the keyword in context)
    2. Problem explanation (Discuss the challenges users face)
    3. Step-by-step guide (Provide actionable advice or instructions)
    4. Tools section (mention JungleScout and include the affiliate link naturally)
    5. Common mistakes to avoid
    6. Conclusion with actionable steps

  Be natural, informative, and engaging. Don't over-optimize for SEO, but ensure keywords appear appropriately. 
  Avoid keyword stuffing.
  Include affiliate link: https://get.junglescout.com/wloofjbvk5mp
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // You can specify which model you want to use
      messages: [{ role: "user", content: prompt }],
    });

    const article = response.choices[0].message.content;
    return article;
  } catch (error) {
    console.error("Error generating article:", error);
    throw new Error("Error generating article.");
  }
}

/**
 * Save the generated article to a file
 */
async function saveArticle(title, content) {
  // Convert the title to a valid file name (slugify)
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Define the file path where the article will be saved
  const filePath = path.join(__dirname, 'posts', `${slug}.html`);

  // Define the HTML structure for the article
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${title}">
    <meta name="keywords" content="${title}, JungleScout, Amazon FBA, product research">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${title}">
    <meta property="og:type" content="article">
    <title>${title}</title>
  </head>
  <body>
    <article>
      <h1>${title}</h1>
      <div>${content.replace(/\n/g, "<br>")}</div>
    </article>
  </body>
  </html>
  `;

  // Ensure the "posts" directory exists
  if (!fs.existsSync(path.join(__dirname, 'posts'))) {
    fs.mkdirSync(path.join(__dirname, 'posts'));
  }

  // Write the HTML content to the file
  fs.writeFileSync(filePath, htmlContent);

  return filePath;
}

/**
 * Main function to generate and save the article
 */
async function generateAndSaveArticle(keyword) {
  try {
    const article = await generateArticle(keyword);
    const filePath = await saveArticle(keyword, article);
    console.log(`Article saved to: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error generating and saving article:", error);
    throw new Error("Error generating and saving article.");
  }
}

// Export the functions to be used in other files
module.exports = {
  generateArticle,
  saveArticle,
  generateAndSaveArticle,
};
