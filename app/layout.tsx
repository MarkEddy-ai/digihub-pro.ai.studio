import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NOVALYS Digital | Marketplace de Produits Numériques & Licences',
  description: 'Plateforme e-commerce premium spécialisée dans la vente de produits numériques, abonnements IA, logiciels, licences officielles et gaming avec livraison instantanée.',
  openGraph: {
    title: 'NOVALYS Digital | Marketplace de Produits Numériques & Licences',
    description: 'Plateforme e-commerce premium de produits numériques, abonnements IA, logiciels et licences officielles avec livraison en moins de 60 secondes.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVALYS Digital | Marketplace de Produits Numériques & Licences',
    description: 'Achetez vos licences logicielles, outils IA et abonnements numériques au meilleur prix avec livraison instantanée.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-300" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

