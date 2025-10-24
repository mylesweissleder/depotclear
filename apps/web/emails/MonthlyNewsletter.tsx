import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Hr,
  Button,
  Img,
  Row,
  Column,
} from '@react-email/components';

interface ContestEntry {
  id: number;
  pup_name: string;
  photo_url: string;
  caption: string;
  category: string;
  votes: number;
}

interface FeaturedDaycare {
  id: number;
  name: string;
  city: string;
  rating: number;
  review_count: number;
  website?: string;
  phone?: string;
}

interface MonthlyNewsletterProps {
  month: string; // "November 2025"
  contestEntries?: ContestEntry[];
  contestWinners?: ContestEntry[];
  featuredDaycares?: FeaturedDaycare[];
  customMessage?: string;
  subscriberEmail?: string;
  unsubscribeToken?: string;
}

export default function MonthlyNewsletter({
  month = 'November 2025',
  contestEntries = [],
  contestWinners = [],
  featuredDaycares = [],
  customMessage,
  subscriberEmail,
  unsubscribeToken,
}: MonthlyNewsletterProps) {
  const unsubscribeUrl = unsubscribeToken
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}/newsletter/unsubscribe?token=${unsubscribeToken}`
    : '#';

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}/logo.png`}
              width="60"
              height="60"
              alt="Woof Spots"
              style={{ margin: '0 auto 16px' }}
            />
            <Heading style={h1}>Woof Spots Monthly</Heading>
            <Text style={headerDate}>{month}</Text>
          </Section>

          {/* Custom Message */}
          {customMessage && (
            <Section style={section}>
              <div style={messageBox}>{customMessage}</div>
            </Section>
          )}

          {/* Contest Winners */}
          {contestWinners && contestWinners.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>🏆 Contest Winners!</Heading>
              <Text style={paragraph}>
                Congratulations to this month's winners of our Dogs Doing Ridiculous Things contest!
              </Text>
              {contestWinners.map((winner, index) => (
                <div key={winner.id} style={winnerCard}>
                  <Text style={winnerPlace}>
                    {index === 0 ? '🥇 1st Place' : index === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
                  </Text>
                  <Img
                    src={winner.photo_url}
                    alt={winner.pup_name}
                    style={winnerImage}
                  />
                  <Heading style={h3}>{winner.pup_name}</Heading>
                  <Text style={caption}>"{winner.caption}"</Text>
                  <Text style={voteCount}>{winner.votes} votes</Text>
                </div>
              ))}
            </Section>
          )}

          {/* Contest Entries Showcase */}
          {contestEntries && contestEntries.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>📸 This Month's Hilarious Entries</Heading>
              <Text style={paragraph}>
                Check out some of the funniest pup photos from this month's contest!
              </Text>
              <Row>
                {contestEntries.slice(0, 6).map((entry) => (
                  <Column key={entry.id} style={{ width: '50%', padding: '8px' }}>
                    <div style={entryCard}>
                      <Img
                        src={entry.photo_url}
                        alt={entry.pup_name}
                        style={entryImage}
                      />
                      <Text style={entryName}>{entry.pup_name}</Text>
                      <Text style={entryCaption}>"{entry.caption}"</Text>
                    </div>
                  </Column>
                ))}
              </Row>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                  href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}/contest`}
                  style={button}
                >
                  View All Entries & Vote
                </Button>
              </div>
            </Section>
          )}

          {/* Featured Premium Daycares */}
          {featuredDaycares && featuredDaycares.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>⭐ Featured Daycares</Heading>
              <Text style={paragraph}>
                These top-rated daycares are providing the best care for Bay Area pups!
              </Text>
              {featuredDaycares.map((daycare) => (
                <div key={daycare.id} style={daycareCard}>
                  <Heading style={h3}>{daycare.name}</Heading>
                  <Text style={location}>📍 {daycare.city}</Text>
                  <Text style={rating}>
                    ⭐ {daycare.rating}/5.0 ({daycare.review_count} reviews)
                  </Text>
                  {daycare.website && (
                    <Button
                      href={daycare.website}
                      style={smallButton}
                    >
                      Visit Website
                    </Button>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Heading style={h2}>Want to get featured?</Heading>
            <Text style={paragraph}>
              Business owners: Claim your free listing and get discovered by thousands of pet parents!
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}/claim`}
              style={button}
            >
              Claim Your Listing (Free!)
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you voted or submitted a photo to our contest.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe
              </Link>{' '}
              |{' '}
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://woofspots.com'}`}
                style={link}
              >
                Woof Spots
              </Link>
            </Text>
            <Text style={footerText}>
              {subscriberEmail && `Sent to ${subscriberEmail}`}
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
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: 'linear-gradient(135deg, #ff8a00 0%, #e52e71 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: '900',
  margin: '0',
  textAlign: 'center' as const,
};

const headerDate = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '8px 0 0',
  textAlign: 'center' as const,
};

const section = {
  padding: '32px 20px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 16px',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '700',
  margin: '12px 0 8px',
};

const paragraph = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const messageBox = {
  backgroundColor: '#fff7ed',
  borderLeft: '4px solid #fb923c',
  padding: '16px',
  borderRadius: '4px',
  color: '#7c2d12',
  fontSize: '16px',
  lineHeight: '24px',
};

const winnerCard = {
  backgroundColor: '#fef3c7',
  border: '3px solid #fbbf24',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const winnerPlace = {
  fontSize: '18px',
  fontWeight: '800',
  color: '#92400e',
  margin: '0 0 12px',
};

const winnerImage = {
  width: '100%',
  maxWidth: '400px',
  height: 'auto',
  borderRadius: '12px',
  margin: '0 auto 16px',
};

const caption = {
  fontSize: '16px',
  fontStyle: 'italic',
  color: '#525252',
  margin: '8px 0',
};

const voteCount = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#7c2d12',
  margin: '8px 0 0',
};

const entryCard = {
  textAlign: 'center' as const,
  marginBottom: '16px',
};

const entryImage = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: '8px',
};

const entryName = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '4px 0',
};

const entryCaption = {
  fontSize: '13px',
  fontStyle: 'italic',
  color: '#737373',
  margin: '4px 0',
};

const daycareCard = {
  backgroundColor: '#f9fafb',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
};

const location = {
  fontSize: '14px',
  color: '#525252',
  margin: '4px 0',
};

const rating = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#f59e0b',
  margin: '8px 0 12px',
};

const button = {
  backgroundColor: '#f97316',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '12px 0',
};

const smallButton = {
  backgroundColor: '#8b5cf6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 20px',
  margin: '8px 0',
};

const ctaSection = {
  backgroundColor: '#ede9fe',
  padding: '32px 20px',
  textAlign: 'center' as const,
  borderRadius: '8px',
  margin: '20px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  padding: '0 20px 20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#737373',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '4px 0',
};

const link = {
  color: '#f97316',
  textDecoration: 'underline',
};
