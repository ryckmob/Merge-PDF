import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Combine arquivos PDF online. O serviço é gratuito para mesclar PDF',
  description:
    'Selecione vários arquivos PDF e combine-os em segundos. Mescle e combine arquivos PDF online, fácil e gratuito.',
  keywords:
    'Combinar PDF, dividir PDF, combine PDF, extrair PDF, comprimir PDF, converter PDF, Word para PDF, Excel para PDF, Powerpoint para PDF, PDF para JPG, JPG para PDF',
  authors: [{ name: 'Juntar PDF' }],
  creator: 'Juntar PDF',
  publisher: 'Juntar PDF',
  alternates: {
    canonical: 'https://merge-pdf-alpha.vercel.app/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-JRDYN8ZW4G"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JRDYN8ZW4G', { page_path: window.location.pathname });
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
