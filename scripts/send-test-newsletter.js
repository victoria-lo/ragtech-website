#!/usr/bin/env node

/**
 * Send Test Newsletter Script
 * 
 * Usage:
 *   npm run newsletter:test <slug> <email>
 *   npm run newsletter:test introducing-markdown-blog-posts hello@ragtechdev.com
 */

const http = require('http');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('\n❌ Error: Missing required arguments\n');
  console.log('Usage: npm run newsletter:test <slug> <email>');
  console.log('Example: npm run newsletter:test introducing-markdown-blog-posts hello@ragtechdev.com\n');
  process.exit(1);
}

const [slug, testEmail] = args;

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(testEmail)) {
  console.error(`\n❌ Error: Invalid email format: ${testEmail}\n`);
  process.exit(1);
}

// Prepare request data
const postData = JSON.stringify({
  slug,
  testEmail,
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/newsletter/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('\n📧 Sending test newsletter...');
console.log(`   Post: ${slug}`);
console.log(`   To: ${testEmail}\n`);

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
        console.log('✅ Success! Test newsletter sent.\n');
        console.log(`   Message ID: ${response.messageId}`);
        console.log(`   ${response.message}\n`);
        console.log('📬 Check your inbox!\n');
      } else {
        console.error('❌ Failed to send newsletter\n');
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
