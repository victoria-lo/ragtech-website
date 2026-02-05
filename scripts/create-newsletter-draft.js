#!/usr/bin/env node

/**
 * Create Newsletter Draft Script
 * Creates a broadcast draft in Resend without sending it
 * 
 * Usage:
 *   npm run newsletter:draft <slug>
 *   npm run newsletter:draft introducing-markdown-blog-posts
 * 
 * Note: Make sure the dev server is running (npm run dev)
 * and you have configured Resend API keys in .env.local
 */

const http = require('http');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('\n❌ Error: Missing required argument\n');
  console.log('Usage: npm run newsletter:draft <slug>');
  console.log('Example: npm run newsletter:draft introducing-markdown-blog-posts\n');
  process.exit(1);
}

const [slug] = args;

// Prepare request data
const postData = JSON.stringify({
  slug,
  draftOnly: true,
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/newsletter/create-draft',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('\n📝 Creating newsletter draft...');
console.log(`   Post: ${slug}\n`);

// Make the request
const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Check if response is HTML (404 error)
    if (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html')) {
      console.error('❌ API route not found (404)\n');
      console.error('   The newsletter API endpoint is not available.\n');
      console.error('   This usually means:\n');
      console.error('   1. The dev server needs to be restarted\n');
      console.error('   2. Or the API routes were not loaded\n\n');
      console.error('   Try this:\n');
      console.error('   1. Stop the dev server (Ctrl+C)\n');
      console.error('   2. Run: npm run dev\n');
      console.error('   3. Wait for "Ready" message\n');
      console.error('   4. Try this command again\n');
      process.exit(1);
    }

    try {
      const response = JSON.parse(data);

      if (res.statusCode === 200 && response.success) {
        console.log('✅ Success! Newsletter draft created.\n');
        console.log(`   Broadcast ID: ${response.broadcastId}`);
        console.log(`   ${response.message}\n`);
        console.log('📊 View draft in Resend dashboard → Broadcasts\n');
        console.log('To send this draft:');
        console.log(`   npm run newsletter:send-broadcast ${response.broadcastId}\n`);
      } else {
        console.error('❌ Failed to create newsletter draft\n');
        console.error(`   Status: ${res.statusCode}`);
        console.error(`   Error: ${response.error || 'Unknown error'}\n`);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error parsing response\n');
      console.error(`   ${error.message}\n`);
      console.error(`   Response preview: ${data.substring(0, 200)}...\n`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request failed\n');
  console.error(`   ${error.message}\n`);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('   Make sure the dev server is running: npm run dev\n');
  }
  
  process.exit(1);
});

// Send the request
req.write(postData);
req.end();
