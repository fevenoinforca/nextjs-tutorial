import './ui/global.css';
import { inter } from './ui/fonts';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata } from 'next';
import { ToastProvider } from './ui/toastProvider';
import { ErrorHandler } from './ui/errorHandler';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.app'),
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ErrorHandler />
        <ToastProvider />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
