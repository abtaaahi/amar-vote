import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Amar Vote',
  description: 'Voting and feedback platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
