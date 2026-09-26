import { CustomFunnelConfig } from '@/types';

export const INITIAL_CUSTOM_FUNNELS: CustomFunnelConfig[] = [
  {
    id: 'funnel-win11-direct',
    slug: 'windows-11-pro-retail',
    productId: 'prod-windows-11-pro',
    title: 'Windows 11 Pro Retail (Licence Permanente)',
    hookHeadline: 'Activez Windows 11 Pro en 30 Secondes avec une Clé Officielle Microsoft',
    subheadline: 'Licence authentique à vie • Aucun abonnement • Transfert garanti sur nouveau PC',
    architecture: 'direct',
    themePalette: 'cyber_dark',
    bgPattern: 'tech_grid',
    targetRegion: 'gulf',
    adPlatform: 'tiktok',
    priceUsd: 14.99,
    compareAtPriceUsd: 199.99,
    priceDzd: 1850,
    priceSar: 55,
    heroImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    bullets: [
      'Clé authentique Microsoft Retail liée à votre compte',
      'Activation en ligne instantanée sans crack ni script tiers',
      'Mises à jour de sécurité et support constructeur à vie',
      'Garantie de remplacement immédiat 24/7',
    ],
    stockCount: 14,
    urgencyMinutes: 15,
    guaranteeText: 'Garantie satisfait ou remboursé sous 30 jours avec support en direct.',
    orderBumpEnabled: true,
    upsellEnabled: true,
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-25T14:30:00Z',
  },
  {
    id: 'funnel-chatgpt-longform',
    slug: 'chatgpt-plus-bundle',
    productId: 'prod-chatgpt-plus',
    title: 'ChatGPT Plus & Suite IA Pro (Pack Révolution)',
    hookHeadline: 'Multipliez votre Productivité par 10 Grâce aux Outils IA les Plus Puissants du Marché',
    subheadline: 'Accès premium garanti avec GPT-4o, génération d\'images et analyse de données en illimité',
    architecture: 'longform',
    themePalette: 'gold_luxury',
    bgPattern: 'radial_glow',
    targetRegion: 'intl',
    adPlatform: 'meta',
    priceUsd: 18.99,
    compareAtPriceUsd: 49.99,
    priceDzd: 2900,
    priceSar: 72,
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    bullets: [
      'Accès prioritaire sans file d\'attente aux heures de pointe',
      'Génération visuelle ultra-réaliste DALL-E 3 & vision IA',
      'Analyse de code, fichiers Excel et documents PDF en direct',
      'Bibliothèque de 500+ Prompts exclusifs offerte',
    ],
    stockCount: 8,
    urgencyMinutes: 30,
    guaranteeText: 'Accès testé et vérifié par notre équipe avant toute délivrance.',
    orderBumpEnabled: true,
    upsellEnabled: true,
    createdAt: '2026-09-22T11:00:00Z',
    updatedAt: '2026-09-25T15:00:00Z',
  },
  {
    id: 'funnel-office-flash',
    slug: 'office-2024-flash-deal',
    productId: 'prod-office-2024-pro',
    title: 'Pack Office 2024 Professionnel Plus (Vente Flash -85%)',
    hookHeadline: 'Vente Flash : Obtenez Word, Excel & PowerPoint 2024 pour le Prix d\'un Déjeuner',
    subheadline: 'Offre exclusive limitée aux 25 prochains acheteurs • Stock réservé en temps réel',
    architecture: 'flash',
    themePalette: 'emerald_clean',
    bgPattern: 'clean_minimal',
    targetRegion: 'dz',
    adPlatform: 'search',
    priceUsd: 19.99,
    compareAtPriceUsd: 249.99,
    priceDzd: 2400,
    priceSar: 75,
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    bullets: [
      'Suite complète : Word, Excel, PowerPoint, Outlook, OneNote, Access',
      'Licence définitive pour 1 PC sans mensualités cachées',
      'Paiement sécurisé BaridiMob, CCP ou Carte Bancaire',
      'Téléchargement direct depuis les serveurs officiels Microsoft',
    ],
    stockCount: 5,
    urgencyMinutes: 9,
    guaranteeText: 'Activation certifiée par téléphone ou en ligne en 1 clic.',
    orderBumpEnabled: true,
    upsellEnabled: true,
    createdAt: '2026-09-24T08:00:00Z',
    updatedAt: '2026-09-26T07:15:00Z',
  },
];

const STORAGE_KEY = 'novalys_custom_funnels_v2';

export function getStoredFunnels(): CustomFunnelConfig[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOM_FUNNELS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOM_FUNNELS));
      return INITIAL_CUSTOM_FUNNELS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CUSTOM_FUNNELS;
  } catch (err) {
    console.warn('Failed to load custom funnels from localStorage:', err);
    return INITIAL_CUSTOM_FUNNELS;
  }
}

export function saveStoredFunnels(funnels: CustomFunnelConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(funnels));
  } catch (err) {
    console.error('Failed to save funnels to localStorage:', err);
  }
}

export function getFunnelBySlug(slug: string): CustomFunnelConfig | undefined {
  const funnels = getStoredFunnels();
  return funnels.find((f) => f.slug === slug);
}
