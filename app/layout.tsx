import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'St. John Bulletin Generator',
  description: 'Generate weekly bulletin prompts for St. John Armenian Church',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
