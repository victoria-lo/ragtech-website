#!/usr/bin/env node

/**
 * Send All Pending Newsletters Script
 * 
 * Usage:
 *   npm run newsletter:send-pending
 */

const http = require('http');
const readline = require('readline');

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\n⚠️  WARNING: This will send ALL pending newsletters to your FULL AUDIENCE\n');
console.log('   This includes all posts with newsletter.send: true and newsletter.sent: false\n');

rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Cancelled. No newsletters sent.\n');
    process.exit(0);
  }

  sendPendingNewsletters();
});

function sendPendingNewsletters() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/newsletter/send-pending',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('\n📧 Sending all pending newsletters...\n');

  // Make the request
  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);

        if (res.statusCode === 200) {
          console.log(`✅ ${response.message}\n`);
          console.log(`   Sent: ${response.sent}/${response.total}\n`);

          if (response.results && response.results.length > 0) {
            console.log('   Results:');
            response.results.forEach((result) => {
              const icon = result.success ? '✓' : '✗';
              const status = result.success ? 'Sent' : 'Failed';
              console.log(`   ${icon} ${result.slug} - ${status}`);
              if (result.error) {
                console.log(`      Error: ${result.error}`);
              }
            });
            console.log('');
          }

          console.log('📊 Check Resend dashboard for delivery stats.\n');
        } else {
          console.error('❌ Failed to send newsletters\n');
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

  req.end();
}
