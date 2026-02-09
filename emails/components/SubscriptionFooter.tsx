import { Section, Text, Link, Hr } from '@react-email/components';
import * as React from 'react';

export type SubscriptionSource = 'newsletter' | 'waitlist' | 'general';

interface SubscriptionFooterProps {
  source?: SubscriptionSource;
}

/**
 * Reusable footer component explaining why the user received this email
 * and providing unsubscribe options.
 * 
 * Unsubscribe is handled two ways:
 * 1. List-Unsubscribe header (set when sending) - email clients show unsubscribe button
 * 2. Visible link in footer - directs to our unsubscribe page
 * 
 * See: https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails
 */
export default function SubscriptionFooter({ source = 'general' }: SubscriptionFooterProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ragtechdev.com';
  const unsubscribeUrl = `${baseUrl}/unsubscribe`;
  const getSubscriptionMessage = () => {
    switch (source) {
      case 'waitlist':
        return "You're receiving this email because you joined the waitlist for Techie Taboo cards on our website.";
      case 'newsletter':
        return "You're receiving this email because you subscribed to our newsletter.";
      default:
        return "You're receiving this email because you subscribed through our ragTech website, FutureNet website, or by joining our Techie Taboo cards waitlist.";
    }
  };

  return (
    <>
      <Hr style={hr} />
      <Section style={footer}>
        <Text style={subscriptionText}>
          {getSubscriptionMessage()}
        </Text>
        <Text style={footerText}>
          <Link href="https://ragtechdev.com" style={link}>
            Visit ragTech
          </Link>
          {' • '}
          <Link href="https://futurenet.ragtechdev.com" style={link}>
            Visit FutureNet
          </Link>
          {' • '}
          <Link href={unsubscribeUrl} style={link}>
            Unsubscribe
          </Link>
        </Text>
        <Text style={footerCopyright}>
          © {new Date().getFullYear()} ragTech. All rights reserved.
        </Text>
      </Section>
    </>
  );
}

// Styles
const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footer = {
  padding: '0 40px',
  textAlign: 'center' as const,
};

const subscriptionText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 16px',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
};

const footerCopyright = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '16px',
};
