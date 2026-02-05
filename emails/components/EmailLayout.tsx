import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
}

export default function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://ragtechdev.com/assets/logo.png"
              width="120"
              height="40"
              alt="ragTech"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to the ragTech newsletter.
            </Text>
            <Text style={footerText}>
              <Link href="https://ragtechdev.com" style={link}>
                Visit our website
              </Link>
              {' • '}
              <Link href="{{unsubscribe_url}}" style={link}>
                Unsubscribe
              </Link>
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} ragTech. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  height: 'auto',
};

const content = {
  padding: '0 40px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footer = {
  padding: '0 40px',
  textAlign: 'center' as const,
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
