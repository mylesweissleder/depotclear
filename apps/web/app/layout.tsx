import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bay Area Dog Daycare Directory - Find the Perfect Playdate for Your Pup',
  description: 'The Bay Area\'s most comprehensive directory of dog daycares. Compare 2,500+ verified daycares across 9 counties with ratings, reviews, and real pet parent experiences.',
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
