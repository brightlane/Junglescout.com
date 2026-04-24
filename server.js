// server.js

// Import required libraries
const express = require('express');
const { generateArticle, saveArticle } = require('./ai-blog-generator'); // Assuming this file contains the logic to generate and save articles
const path = require('path');

// Create an express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Route for homepage
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Content Generator</h1>');
});

// Route to trigger article generation
app.get('/generate-article', async (req, res) => {
  try {
    const keyword = req.query.keyword || "Amazon FBA tips"; // Get the keyword from query parameters
    const article = await generateArticle(keyword); // Call the function that generates the article
    const filePath = await saveArticle(keyword, article); // Save the article to an HTML file
    res.send(`<h1>Article Generated and Saved!</h1><p>File saved to: ${filePath}</p>`);
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).send("Error generating article");
  }
});

// Serve the generated articles from a static directory
app.use('/posts', express.static(path.join(__dirname, 'posts')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
