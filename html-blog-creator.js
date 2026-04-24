// html-blog-creator.js
// SAFE HTML BLOG CREATOR (Affiliate-safe SaaS core)

import fs from "fs";
import path from "path";

/**
 * CONFIG
 */
const OUTPUT_DIR = "./generated-posts";

/**
 * Ensure output folder exists
 */
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

/**
 * Generate SEO-friendly slug
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * HTML TEMPLATE ENGINE
 */
function buildHTML({ title, content, description, affiliateUrl }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="article" />

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 900px;
      margin: auto;
      padding: 40px;
      line-height: 1.7;
      color: #222;
    }
    h1 { font-size: 32px; }
    h2 { margin-top: 30px; }
    a { color: #0073ff; }
    .cta {
      margin: 30px 0;
      padding: 20px;
      background: #f5f5f5;
      border-left: 5px solid #0073ff;
    }
  </style>
</head>

<body>

  <article>
    <h1>${title}</h1>
    <p><strong>${description}</strong></p>

    <div>
      ${content}
    </div>

    <div class="cta">
      <h3>Recommended Tool</h3>
      <p>
        If you're serious about improving results, this tool is highly recommended:
        <a href="${affiliateUrl}" target="_blank" rel="nofollow sponsored">
          Click here to learn more
        </a>
      </p>
    </div>

    <hr />
    <p style="font-size:12px;color:#777;">
      Affiliate disclosure: This page may contain affiliate links.
    </p>
  </article>

</body>
</html>
`;
}

/**
 * MAIN CREATOR FUNCTION
 */
export function createBlogPage({
  title,
  description,
  content,
  affiliateUrl
}) {
  const slug = slugify(title);
  const filePath = path.join(OUTPUT_DIR, `${slug}.html`);

  const html = buildHTML({
    title,
    description,
    content,
    affiliateUrl
  });

  fs.writeFileSync(filePath, html, "utf-8");

  console.log("✅ Created:", filePath);

  return filePath;
}

/**
 * EXAMPLE USAGE
 */
createBlogPage({
  title: "How to Build a Profitable Amazon FBA Store",
  description: "A complete beginner guide to starting Amazon FBA in 2026.",
  content: `
    <p>Amazon FBA allows entrepreneurs to sell products with fulfillment handled by Amazon.</p>

    <h2>Step 1: Product Research</h2>
    <p>Find low competition, high demand products using data-driven tools.</p>

    <h2>Step 2: Supplier Sourcing</h2>
    <p>Work with reliable suppliers to maintain product quality.</p>

    <h2>Step 3: Launch Strategy</h2>
    <p>Optimize listings and use PPC campaigns for visibility.</p>
  `,
  affiliateUrl: "https://get.junglescout.com/wloofjbvk5mp"
});
