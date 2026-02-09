#!/usr/bin/env node

/**
 * Send Broadcast Script
 * Sends an existing broadcast draft with optional scheduling
 * 
 * Usage:
 *   npm run newsletter:send-broadcast <broadcast-id> [schedule]
 *   npm run newsletter:send-broadcast abc123 now
 *   npm run newsletter:send-broadcast abc123 "in 1 hour"
 *   npm run newsletter:send-broadcast abc123 "2026-02-05T15:00:00Z"
 * 
 * Note: Make sure the dev server is running (npm run dev)
 */

const http = require('http');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('\n❌ Error: Missing required argument\n');
  console.log('Usage: npm run newsletter:send-broadcast <broadcast-id> [schedule]');
  console.log('Examples:');
  console.log('  npm run newsletter:send-broadcast abc123');
  console.log('  npm run newsletter:send-broadcast abc123 now');
  console.log('  npm run newsletter:send-broadcast abc123 "in 1 hour"');
  console.log('  npm run newsletter:send-broadcast abc123 "2026-02-05T15:00:00Z"\n');
  process.exit(1);
}

const [broadcastId, scheduledAt = 'now'] = args;

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const scheduleText = scheduledAt === 'now' ? 'immediately' : `at ${scheduledAt}`;

console.log('\n⚠️  WARNING: This will send the broadcast to your audience\n');
console.log(`   Broadcast ID: ${broadcastId}`);
console.log(`   Schedule: ${scheduleText}\n`);

rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Cancelled. No broadcast sent.\n');
    process.exit(0);
  }

  sendBroadcastNow();
});

function sendBroadcastNow() {
  // Prepare request data
  const postData = JSON.stringify({
    broadcastId,
    scheduledAt,
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/newsletter/send-broadcast',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  console.log('\n📧 Sending broadcast...\n');

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
          console.log('✅ Success! Broadcast sent.\n');
          console.log(`   Broadcast ID: ${response.broadcastId}`);
          console.log(`   ${response.message}\n`);
          console.log('📊 Check Resend dashboard for delivery stats.\n');
        } else {
          console.error('❌ Failed to send broadcast\n');
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
