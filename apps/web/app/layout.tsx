import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DepotClear - Home Depot Clearance Finder',
  description: 'Find nationwide Home Depot clearance deals instantly',
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
