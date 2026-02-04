#!/usr/bin/env node

/**
 * Send Newsletter to Full Audience Script
 * 
 * Usage:
 *   npm run newsletter:send <slug>
 *   npm run newsletter:send introducing-markdown-blog-posts
 */

const http = require('http');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('\n❌ Error: Missing required argument\n');
  console.log('Usage: npm run newsletter:send <slug>');
  console.log('Example: npm run newsletter:send introducing-markdown-blog-posts\n');
  process.exit(1);
}

const [slug] = args;

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\n⚠️  WARNING: This will send the newsletter to your FULL AUDIENCE\n');
console.log(`   Post: ${slug}`);
console.log(`   Audience: All subscribers in Resend\n`);

rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Cancelled. No newsletter sent.\n');
    process.exit(0);
  }

  sendNewsletter();
});

function sendNewsletter() {
  // Prepare request data
  const postData = JSON.stringify({ slug });

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

  console.log('\n📧 Sending newsletter to full audience...\n');

  // Make the request
  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);

        if (res.statusCode === 200 && response.success) {
          console.log('✅ Success! Newsletter sent to audience.\n');
          console.log(`   Message ID: ${response.messageId}`);
          console.log(`   ${response.message}\n`);
          console.log('📊 Check Resend dashboard for delivery stats.\n');
        } else {
          console.error('❌ Failed to send newsletter\n');
          console.error(`   Status: ${res.statusCode}`);
          console.error(`   Error: ${response.error || 'Unknown error'}\n`);
          process.exit(1);
        }
      } catch (error) {
        console.error('❌ Error parsing response\n');
        console.error(`   ${error.message}\n`);
        console.error(`   Response: ${data}\n`);
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
}
