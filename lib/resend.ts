/**
 * Resend client configuration
 * Server-side only
 */

import 'server-only';
import { Resend } from 'resend';

// Initialize Resend client
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn('RESEND_API_KEY is not set - newsletter functionality will be disabled');
}

export const resend = apiKey ? new Resend(apiKey) : null;

// Resend configuration
export const RESEND_CONFIG = {
  fromEmail: process.env.RESEND_FROM_EMAIL || 'hello@ragtechdev.com',
  fromName: 'ragTech',
  audienceId: process.env.RESEND_AUDIENCE_ID,
  enabled: !!apiKey,
};

/**
 * Check if Resend is properly configured
 */
export function isResendConfigured(): boolean {
  return RESEND_CONFIG.enabled && !!RESEND_CONFIG.audienceId;
}
