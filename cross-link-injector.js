import fs from 'fs';
import path from 'path';

// Function to perform cross-linking on the article content
function injectCrossLinks(content, language) {
  // Define a list of pages to link to, this should be updated with your actual URLs
  const crossLinks = [
    { keyword: 'Amazon FBA', url: `https://yourdomain.com/${language}/best-amazon-fba-products-2026.html` },
    { keyword: 'JungleScout', url: `https://get.junglescout.com/wloofjbvk5mp` },
    { keyword: 'FBA product research', url: `https://yourdomain.com/${language}/fba-product-research-guide.html` },
    // Add more links as needed
  ];

  // Iterate over the cross-links and replace matching keywords in content with anchor tags
  crossLinks.forEach(link => {
    const regex = new RegExp(`\\b${link.keyword}\\b`, 'gi');
    content = content.replace(regex, `<a href="${link.url}" target="_blank">${link.keyword}</a>`);
  });

  return content;
}

// Function to inject meta tags into the head of the HTML
function injectMetaTags(html, title) {
  const metaTags = `
    <meta name="description" content="${title} - JungleScout Affiliate">
    <meta name="keywords" content="${title}, JungleScout, Amazon FBA, Affiliate Marketing">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${title} - JungleScout Affiliate">
    <meta property="og:url" content="https://yourdomain.com/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html">
    <meta property="og:type" content="article">
    <meta name="robots" content="index, follow">
  `;
  
  // Inject meta tags into the head section of the HTML
  const headIndex = html.indexOf('<head>');
  const closingHeadIndex = html.indexOf('</head>');

  // Insert meta tags just after the <head> tag
  if (headIndex !== -1 && closingHeadIndex !== -1) {
    html = html.slice(0, closingHeadIndex) + metaTags + html.slice(closingHeadIndex);
  }

  return html;
}

// Function to update article with cross-links and meta tags
function updateArticleWithCrossLinksAndMetaTags(filePath, language) {
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Extract title from the HTML content (this assumes title is wrapped in <title> tag)
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'No title found';

  // Inject cross-links and meta tags
  const updatedContent = injectCrossLinks(html, language);
  const updatedHtml = injectMetaTags(updatedContent, title);

  // Save the updated HTML file
  fs.writeFileSync(filePath, updatedHtml);
  console.log(`Updated cross-links and meta tags in ${filePath}`);
}

// Update all generated HTML files with cross-links and meta tags
function updateAllArticles() {
  const languages = ['en', 'es', 'fr', 'de', 'it']; // Adjust to your languages
  languages.forEach(language => {
    const dirPath = path.join(__dirname, 'posts', language);
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);
      updateArticleWithCrossLinksAndMetaTags(filePath, language);
    });
  });
}

// Run the cross-link and meta tag injection
updateAllArticles();
