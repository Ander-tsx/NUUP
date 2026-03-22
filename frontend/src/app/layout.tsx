import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToasterProvider from './ToasterProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ProofWork — Reputación On-Chain para Freelancers',
  description: 'Plataforma gamificada de freelancers con reputación on-chain sobre Stellar. Conecta freelancers con reclutadores a través de eventos de competencia y contratos 1:1.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
