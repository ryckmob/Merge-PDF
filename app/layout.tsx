import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
  openGraph: {
    siteName: 'Juntar PDF - Ferramentas online para PDF',
    title: 'Combine arquivos PDF online. O serviço é gratuito para mesclar PDF',
    description:
      'Selecione vários arquivos PDF e combine-os em segundos. Mescle e combine arquivos PDF online, fácil e gratuito.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://merge-pdf-alpha.vercel.app/',
  },
  twitter: {
    card: 'summary',
    title: 'Combine arquivos PDF online. O serviço é gratuito para mesclar PDF',
    description:
      'Selecione vários arquivos PDF e combine-os em segundos. Mescle e combine arquivos PDF online, fácil e gratuito.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
