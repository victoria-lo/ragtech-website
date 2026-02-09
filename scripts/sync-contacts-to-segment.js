#!/usr/bin/env node

/**
 * Sync Contacts to General Segment Script
 * Adds all Resend audience contacts to the general segment if not already added
 * 
 * Usage:
 *   node scripts/sync-contacts-to-segment.js
 *   node scripts/sync-contacts-to-segment.js <source_audience_id> <target_audience_id>
 * 
 * Required environment variables:
 *   RESEND_API_KEY - Your Resend API key
 *   RESEND_GENERAL_SEGMENT_ID - The audience/segment ID to sync contacts to
 * 
 * Note: Run this from the project root directory
 * You can load env vars with: set -a && source .env.local && set +a (bash)
 * Or on Windows PowerShell: Get-Content .env.local | ForEach-Object { if ($_ -match '^([^#][^=]*)=(.*)$') { [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2]) } }
 */

// Load .env.local manually without dotenv
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value !== undefined) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_GENERAL_SEGMENT_ID = process.env.RESEND_GENERAL_SEGMENT_ID;

if (!RESEND_API_KEY) {
  console.error('❌ Error: RESEND_API_KEY is not set in .env.local');
  process.exit(1);
}

if (!RESEND_GENERAL_SEGMENT_ID) {
  console.error('❌ Error: RESEND_GENERAL_SEGMENT_ID is not set in .env.local');
  process.exit(1);
}

const BASE_URL = 'https://api.resend.com';

async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

async function listContacts(audienceId) {
  console.log(`\n📋 Fetching contacts from audience ${audienceId}...`);
  
  const result = await makeRequest('GET', `/audiences/${audienceId}/contacts`);
  
  if (!result.data) {
    return [];
  }
  
  console.log(`   Found ${result.data.length} contacts`);
  return result.data;
}

async function addContactToAudience(audienceId, contact) {
  try {
    const result = await makeRequest('POST', `/audiences/${audienceId}/contacts`, {
      email: contact.email,
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      unsubscribed: contact.unsubscribed || false,
    });
    return { success: true, id: result.id };
  } catch (error) {
    // Check if contact already exists (Resend returns error for duplicates)
    if (error.message && error.message.includes('already exists')) {
      return { success: true, alreadyExists: true };
    }
    return { success: false, error: error.message };
  }
}

async function syncContactsToSegment() {
  console.log('🔄 Starting contact sync to general segment...\n');
  console.log(`   Target Segment ID: ${RESEND_GENERAL_SEGMENT_ID}`);

  try {
    // Get all contacts from the general segment (this is our target audience)
    const existingContacts = await listContacts(RESEND_GENERAL_SEGMENT_ID);
    
    // Create a set of existing emails for quick lookup
    const existingEmails = new Set(
      existingContacts.map(c => c.email.toLowerCase())
    );

    console.log(`\n✅ Sync complete!`);
    console.log(`   Total contacts in segment: ${existingContacts.length}`);
    
    // List all contacts
    console.log('\n📧 Current contacts in general segment:');
    existingContacts.forEach((contact, index) => {
      const status = contact.unsubscribed ? '🔕' : '✅';
      console.log(`   ${index + 1}. ${status} ${contact.email} (${contact.first_name || 'No name'})`);
    });

  } catch (error) {
    console.error('\n❌ Error during sync:', error.message);
    process.exit(1);
  }
}

// Alternative: Sync from one audience to another
async function syncBetweenAudiences(sourceAudienceId, targetAudienceId) {
  console.log('🔄 Starting contact sync between audiences...\n');
  console.log(`   Source Audience ID: ${sourceAudienceId}`);
  console.log(`   Target Audience ID: ${targetAudienceId}`);

  try {
    // Get contacts from source
    const sourceContacts = await listContacts(sourceAudienceId);
    
    // Get contacts from target
    const targetContacts = await listContacts(targetAudienceId);
    
    // Create a set of existing emails in target
    const targetEmails = new Set(
      targetContacts.map(c => c.email.toLowerCase())
    );

    // Find contacts that need to be added
    const contactsToAdd = sourceContacts.filter(
      c => !targetEmails.has(c.email.toLowerCase())
    );

    console.log(`\n📊 Sync Summary:`);
    console.log(`   Source contacts: ${sourceContacts.length}`);
    console.log(`   Target contacts: ${targetContacts.length}`);
    console.log(`   Contacts to add: ${contactsToAdd.length}`);

    if (contactsToAdd.length === 0) {
      console.log('\n✅ All contacts are already synced!');
      return;
    }

    console.log(`\n➕ Adding ${contactsToAdd.length} contacts to target audience...`);
    
    let added = 0;
    let failed = 0;
    let skipped = 0;

    for (const contact of contactsToAdd) {
      const result = await addContactToAudience(targetAudienceId, contact);
      
      if (result.success) {
        if (result.alreadyExists) {
          skipped++;
          console.log(`   ⏭️  ${contact.email} (already exists)`);
        } else {
          added++;
          console.log(`   ✅ ${contact.email}`);
        }
      } else {
        failed++;
        console.log(`   ❌ ${contact.email}: ${result.error}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Results:`);
    console.log(`   Added: ${added}`);
    console.log(`   Skipped (already exists): ${skipped}`);
    console.log(`   Failed: ${failed}`);

  } catch (error) {
    console.error('\n❌ Error during sync:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Default: list contacts in general segment
    await syncContactsToSegment();
  } else if (args.length === 2) {
    // Sync from source to target audience
    const [sourceId, targetId] = args;
    await syncBetweenAudiences(sourceId, targetId);
  } else {
    console.log('Usage:');
    console.log('  node scripts/sync-contacts-to-segment.js');
    console.log('    - Lists all contacts in the general segment\n');
    console.log('  node scripts/sync-contacts-to-segment.js <source_audience_id> <target_audience_id>');
    console.log('    - Syncs contacts from source audience to target audience');
    process.exit(1);
  }
}

main();
