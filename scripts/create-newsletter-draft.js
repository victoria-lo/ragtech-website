#!/usr/bin/env node

/**
 * Create Newsletter Draft Script
 * Creates a broadcast draft in Resend without sending it
 * 
 * Usage:
 *   npm run newsletter:draft <slug> [topics...]
 *   npm run newsletter:draft introducing-markdown-blog-posts
 *   npm run newsletter:draft my-post ragTech FutureNet
 *   npm run newsletter:draft my-post "Techie Taboo"
 * 
 * Available topics: ragTech, FutureNet, "Techie Taboo"
 * If no topics specified, uses topics from post frontmatter
 * 
 * Note: Make sure the dev server is running (npm run dev)
 * and you have configured Resend API keys in .env.local
 */

const http = require('http');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('\n❌ Error: Missing required argument\n');
  console.log('Usage: npm run newsletter:draft <slug> [topics...]');
  console.log('Examples:');
  console.log('  npm run newsletter:draft introducing-markdown-blog-posts');
  console.log('  npm run newsletter:draft my-post ragTech');
  console.log('  npm run newsletter:draft my-post ragTech FutureNet');
  console.log('  npm run newsletter:draft my-post "Techie Taboo"\n');
  console.log('Available topics: ragTech, FutureNet, "Techie Taboo"\n');
  process.exit(1);
}

const [slug, ...topics] = args;

// Prepare request data
const requestBody = {
  slug,
};

// Add topics if provided via CLI
if (topics.length > 0) {
  requestBody.topics = topics;
}

const postData = JSON.stringify(requestBody);

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
console.log(`   Post: ${slug}`);
if (topics.length > 0) {
  console.log(`   Topics: ${topics.join(', ')}`);
}
console.log('');

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
        console.log('✅ Success! Newsletter draft(s) created.\n');
        
        if (response.broadcastIds && response.broadcastIds.length > 1) {
          console.log(`   Created ${response.broadcastIds.length} broadcasts (one per topic)`);
          if (response.topics) {
            console.log(`   Topics: ${response.topics.join(', ')}`);
          }
          console.log(`   Broadcast IDs:`);
          response.broadcastIds.forEach((id, i) => {
            const topic = response.topics ? response.topics[i] : '';
            console.log(`     - ${id}${topic ? ` [${topic}]` : ''}`);
          });
        } else {
          console.log(`   Broadcast ID: ${response.broadcastId}`);
          if (response.topics && response.topics.length > 0) {
            console.log(`   Topic: ${response.topics[0]}`);
          }
        }
        
        console.log(`\n   ${response.message}\n`);
        console.log('📊 View draft(s) in Resend dashboard → Broadcasts\n');
        
        if (response.broadcastIds && response.broadcastIds.length > 1) {
          console.log('To send these drafts:');
          response.broadcastIds.forEach(id => {
            console.log(`   npm run newsletter:send-broadcast ${id}`);
          });
          console.log('');
        } else {
          console.log('To send this draft:');
          console.log(`   npm run newsletter:send-broadcast ${response.broadcastId}\n`);
        }
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
