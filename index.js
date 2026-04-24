// index.js - Complete Backend and Frontend System for FAQ and Testimonials

import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const FAQ_FILE = './data/faqs.json';
const TEST_FILE = './data/testimonials.json';

// Helper function to load JSON data
const load = (file) => {
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  }
  return [];
};

// Helper function to save JSON data
const save = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// FAQ API - GET & POST
app.get('/api/faqs', (req, res) => {
  res.json(load(FAQ_FILE));
});

app.post('/api/faqs', (req, res) => {
  const db = load(FAQ_FILE);
  db.push(req.body);
  save(FAQ_FILE, db);
  res.json({ success: true });
});

// Testimonials API - GET & POST
app.get('/api/testimonials', (req, res) => {
  res.json(load(TEST_FILE));
});

app.post('/api/testimonials', (req, res) => {
  const db = load(TEST_FILE);
  db.push(req.body);
  save(TEST_FILE, db);
  res.json({ success: true });
});

// Serve Static Files (HTML frontend)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Generate FAQ Data (Automated)
const generateFAQs = () => {
  const categories = [
    "Amazon FBA", "Product Research", "Jungle Scout", "Helium 10", "Profit Margins",
    "Supplier Sourcing", "SEO Listings", "PPC Ads", "Scaling Store", "Common Mistakes"
  ];
  
  const faqs = [];
  
  for (let i = 0; i < 100; i++) {
    const cat = categories[i % categories.length];
    
    faqs.push({
      id: i + 1,
      question: `What should I know about ${cat}?`,
      answer: `Understanding ${cat} is important for Amazon FBA success. Focus on strategy, data, and consistency.`
    });
  }

  save(FAQ_FILE, faqs);
  console.log('✅ 100 FAQs generated');
};

// Generate Testimonials Data (Automated)
const generateTestimonials = () => {
  const names = [
    "Alex M.", "Jordan K.", "Taylor R.", "Morgan S.", "Casey T.", "Riley D.", "Avery L.", "Parker W."
  ];
  
  const cities = [
    "New York", "London", "Toronto", "Berlin", "Sydney", "Dubai", "Tokyo", "Paris"
  ];

  const testimonials = [];
  
  for (let i = 0; i < 100; i++) {
    testimonials.push({
      id: i + 1,
      name: names[i % names.length],
      location: cities[i % cities.length],
      rating: 5,
      text: "Used the platform and found it extremely helpful for research and decision making."
    });
  }

  save(TEST_FILE, testimonials);
  console.log('✅ 100 testimonials generated');
};

// Generate Data on Server Start
generateFAQs();
generateTestimonials();

// Frontend HTML - FAQ Page
app.get('/public/faq.html', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ System</title>
  </head>
  <body>
    <h1>FAQ System</h1>
    <div id="faq"></div>
    <script>
      fetch('/api/faqs')
        .then(res => res.json())
        .then(data => {
          const container = document.getElementById('faq');
          data.forEach(faq => {
            const div = document.createElement('div');
            div.innerHTML = \`
              <h3>\${faq.question}</h3>
              <p>\${faq.answer}</p>
              <hr/>
            \`;
            container.appendChild(div);
          });
        });
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

// Frontend HTML - Testimonials Page
app.get('/public/testimonials.html', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Testimonials</title>
  </head>
  <body>
    <h1>Customer Testimonials</h1>
    <div id="testimonials"></div>
    <script>
      fetch('/api/testimonials')
        .then(res => res.json())
        .then(data => {
          const container = document.getElementById('testimonials');
          data.forEach(t => {
            const div = document.createElement('div');
            div.innerHTML = \`
              <strong>\${t.name}</strong> (\${t.location})<br/>
              ⭐⭐⭐⭐⭐<br/>
              <p>\${t.text}</p>
              <hr/>
            \`;
            container.appendChild(div);
          });
        });
    </script>
  </body>
  </html>
  `;
  res.send(html);
});

// Start Server
app.listen(3000, () => {
  console.log('🚀 SaaS Engine running on http://localhost:3000');
});
