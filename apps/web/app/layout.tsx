import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Woof Houses - Find the Perfect Dog Daycare Near You',
  description: 'The nation\'s most comprehensive directory of dog daycares. Compare 5,000+ verified daycares across major US cities with ratings, reviews, and real pet parent experiences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
