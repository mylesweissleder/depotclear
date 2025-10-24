import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  subscriberEmail?: string;
  unsubscribeToken?: string;
}

export default function WelcomeEmail({
  subscriberEmail = 'voter@example.com',
  unsubscribeToken = 'sample-token',
}: WelcomeEmailProps) {
  const unsubscribeUrl = unsubscribeToken
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}/newsletter/unsubscribe?token=${unsubscribeToken}`
    : '#';

  return (
    <Html>
      <Head />
      <Preview>Welcome to Woof Spots! 🐕 Thanks for voting!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🐕 Welcome to Woof Spots!</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={paragraph}>
              Hey there, dog lover! 👋
            </Text>

            <Text style={paragraph}>
              Thanks for voting in our <strong>Dogs Doing Ridiculous Things Contest</strong>!
              Your vote helps us celebrate the silliest, goofiest, and most lovable pups on the internet.
            </Text>

            <Text style={paragraph}>
              🎉 <strong>You're now part of the Woof Spots pack!</strong>
            </Text>

            <Section style={box}>
              <Text style={boxText}>
                <strong>Here's what you can expect from us:</strong>
              </Text>
              <Text style={bulletPoint}>🏆 Monthly contest winners & hilarious entries</Text>
              <Text style={bulletPoint}>📸 Featured pups doing ridiculous things</Text>
              <Text style={bulletPoint}>🏠 Top-rated daycares, boarding & dog services</Text>
              <Text style={bulletPoint}>🎁 Exclusive updates & dog care tips</Text>
              <Text style={bulletPoint}>💰 Special offers from our partners</Text>
            </Section>

            <Text style={paragraph}>
              We'll send you one email per month – no spam, just the good stuff. And you can
              unsubscribe anytime (but we hope you'll stick around!).
            </Text>

            <Section style={ctaBox}>
              <Text style={ctaText}>
                <strong>🔍 Looking for dog care near you?</strong>
              </Text>
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}/search`}
                style={button}
              >
                Browse Dog Daycares & Services
              </Link>
            </Section>

            <Section style={ctaBox}>
              <Text style={ctaText}>
                <strong>🤪 Got a funny dog photo?</strong>
              </Text>
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}/contest`}
                style={buttonSecondary}
              >
                Enter the Contest
              </Link>
            </Section>

            <Text style={paragraph}>
              Thanks for being awesome! 🐾
            </Text>

            <Text style={signature}>
              — The Woof Spots Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because you voted in our dog photo contest.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
              {' • '}
              <Link href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}`} style={footerLink}>
                Visit Woof Spots
              </Link>
            </Text>
            <Text style={footerText}>
              © 2025 Woof Spots • Made with 🐾 and ❤️ for dogs everywhere
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#fef6e4',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#ffffff',
  borderRadius: '12px 12px 0 0',
  padding: '32px 24px',
  textAlign: 'center' as const,
  borderBottom: '4px solid #f97316',
};

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '0 0 12px 12px',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const box = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const boxText = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const bulletPoint = {
  color: '#92400e',
  fontSize: '15px',
  margin: '8px 0',
  paddingLeft: '8px',
};

const ctaBox = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const ctaText = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0 0 12px 0',
};

const button = {
  backgroundColor: '#f97316',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  margin: '8px 0',
};

const buttonSecondary = {
  backgroundColor: '#8b5cf6',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  margin: '8px 0',
};

const signature = {
  color: '#6b7280',
  fontSize: '16px',
  fontStyle: 'italic',
  margin: '24px 0 0 0',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '4px 0',
};

const footerLink = {
  color: '#f97316',
  textDecoration: 'underline',
};
