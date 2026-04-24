const Twitter = require('twitter');
const axios = require('axios');

// Twitter credentials
const twitterClient = new Twitter({
  consumer_key: 'YOUR_TWITTER_API_KEY',
  consumer_secret: 'YOUR_TWITTER_API_SECRET',
  access_token_key: 'YOUR_TWITTER_ACCESS_TOKEN',
  access_token_secret: 'YOUR_TWITTER_ACCESS_TOKEN_SECRET'
});

// Facebook credentials
const facebookPageToken = 'YOUR_FACEBOOK_PAGE_ACCESS_TOKEN';
const facebookPageId = 'YOUR_FACEBOOK_PAGE_ID'; // e.g., 'your_page_id'

// Function to post to Twitter
async function postToTwitter(content) {
  try {
    await twitterClient.post('statuses/update', { status: content });
    console.log('Posted to Twitter:', content);
  } catch (error) {
    console.error('Error posting to Twitter:', error);
  }
}

// Function to post to Facebook
async function postToFacebook(content) {
  try {
    const url = `https://graph.facebook.com/${facebookPageId}/feed?message=${encodeURIComponent(content)}&access_token=${facebookPageToken}`;
    const response = await axios.post(url);
    console.log('Posted to Facebook:', content);
  } catch (error) {
    console.error('Error posting to Facebook:', error);
  }
}

// Function to generate social media post
async function generateSocialMediaPost(blogUrl) {
  const postContent = `
  Check out our latest blog post: ${blogUrl}!

  💡 Learn more about the JungleScout tool and how it can help you succeed in Amazon FBA product research.

  🌟 Explore: https://get.junglescout.com/wloofjbvk5mp

  #AmazonFBA #ProductResearch #JungleScout #AffiliateMarketing
  `;
  return postContent;
}

// Main function to generate and post to Twitter and Facebook
async function postToSocialMedia(blogUrl) {
  const content = await generateSocialMediaPost(blogUrl);

  // Post to Twitter
  await postToTwitter(content);

  // Post to Facebook
  await postToFacebook(content);
}

// Example usage: posting a blog URL to social media
const blogUrl = 'https://brightlane.github.io/Junglescout.com/blog/latest-article'; // replace with dynamic blog URL
postToSocialMedia(blogUrl);
