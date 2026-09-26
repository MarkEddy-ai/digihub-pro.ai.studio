import { Currency } from '@/types';

export type FunnelLocale = 'dz' | 'sa' | 'ae' | 'intl';

export interface FunnelPackOption {
  id: string;
  name: string;
  durationLabel: string;
  multiplier: number; // multiplier of base price
  discountPercent: number;
  badge?: string;
  isPopular?: boolean;
}

export interface FunnelProductOffer {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  rating: number;
  reviewCount: number;
  image: string;
  originalPriceUsd: number;
  priceUsd: number;
  priceDzd: number;
  priceSar: number;
  priceAed: number;
  priceKwd: number;
  costPriceUsd?: number;
  highlights: string[];
  stockRemaining: number;
  packs: FunnelPackOption[];
  activationSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  palette?: 'cyber_dark' | 'gold_luxury' | 'emerald_clean';
  trafficSource?: 'tiktok' | 'meta' | 'google';
  urgencyMinutes?: number;
  guaranteeNotice?: string;
}

export interface FunnelOrderBumpOffer {
  id: string;
  enabled?: boolean;
  title: Record<FunnelLocale, string>;
  description: Record<FunnelLocale, string>;
  priceUsd: number;
  priceDzd: number;
  priceSar: number;
  priceAed: number;
  priceKwd: number;
}

export interface FunnelUpsellOffer {
  id: string;
  enabled?: boolean;
  productId: string;
  title: Record<FunnelLocale, string>;
  headline: Record<FunnelLocale, string>;
  description: Record<FunnelLocale, string>;
  image: string;
  originalPriceUsd: number;
  priceUsd: number;
  priceDzd: number;
  priceSar: number;
  priceAed: number;
  discountPercentage: number;
  features: string[];
  urgencyMinutes?: number;
}

export interface FunnelRetentionSettings {
  thankYouHeadline: string;
  thankYouMessage: string;
  couponCode: string;
  couponDiscountPercent: number;
  whatsappSupportNumber: string;
  emailSupport: string;
  autoRevealLicense: boolean;
}

export interface LocalizedDialectContent {
  locale: FunnelLocale;
  countryName: string;
  flag: string;
  currency: Currency;
  bannerNotice: string;
  heroPitch: string;
  guaranteeNotice: string;
  orderBumpLabel: string;
  paymentNotice: string;
  reviews: {
    name: string;
    location: string;
    avatar: string;
    rating: number;
    timeAgo: string;
    comment: string;
    verifiedMethod: string;
  }[];
}

export const FUNNEL_PRODUCTS: FunnelProductOffer[] = [
  // 1. Windows 11 Professionnel
  {
    id: 'prod-windows-11-pro',
    slug: 'windows-11-pro-retail',
    title: 'Windows 11 Professionnel (Licence Retail Permanente)',
    subtitle: 'Clé officielle Microsoft authentique • Activation directe sans crack • Transfert sur nouveau PC autorisé',
    badge: 'TOP VENTE TIKTOK & META',
    rating: 4.96,
    reviewCount: 3840,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 199.99,
    priceUsd: 14.99,
    priceDzd: 1850,
    priceSar: 49,
    priceAed: 48,
    priceKwd: 4.2,
    costPriceUsd: 2.50,
    palette: 'cyber_dark',
    trafficSource: 'tiktok',
    urgencyMinutes: 15,
    guaranteeNotice: 'Garantie 100% activation légale auprès des serveurs Microsoft',
    highlights: [
      'Clé Retail officielle authentique 100% permanente à vie',
      'Activation directe dans Paramètres > Système > Activation',
      'Mises à jour de sécurité et fonctionnalités Microsoft garanties',
      'Compatible 32/64 bits pour toutes les langues (Français, Arabe, Anglais)',
    ],
    stockRemaining: 5,
    packs: [
      {
        id: 'pack-1pc',
        name: 'Pack 1 PC (Standard)',
        durationLabel: '1 Licence Permanente',
        multiplier: 1.0,
        discountPercent: 70,
      },
      {
        id: 'pack-2pc',
        name: 'Pack Duo 2 PC (Recommandé)',
        durationLabel: '2 Licences Retail',
        multiplier: 1.7,
        discountPercent: 80,
        badge: 'LE PLUS POPULAIRE',
        isPopular: true,
      },
      {
        id: 'pack-5pc',
        name: 'Pack Bureau 5 PC (Famille & PME)',
        durationLabel: '5 Licences Retail',
        multiplier: 3.2,
        discountPercent: 88,
        badge: 'MEILLEURE ÉCONOMIE',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Accédez aux Paramètres',
        description: 'Ouvrez Paramètres sur votre PC > Système > Activation (ou tapez "Activer Windows" dans la barre de recherche).',
      },
      {
        step: 2,
        title: 'Saisissez votre Clé Retail',
        description: 'Cliquez sur "Modifier la clé de produit" et collez la clé 25 caractères fournie dans votre coffre.',
      },
      {
        step: 3,
        title: 'Activation Immédiate',
        description: 'Cliquez sur "Suivant" puis "Activer". Votre Windows 11 Pro est instantanément authentifié à vie auprès des serveurs Microsoft !',
      },
    ],
  },

  // 2. ChatGPT Plus
  {
    id: 'prod-chatgpt-plus',
    slug: 'chatgpt-plus',
    title: 'ChatGPT Plus (Compte Garanti GPT-4o & Canvas)',
    subtitle: 'Accès sans limitation aux modèles GPT-4o, génération d\'images DALL-E 3 et mode vocal avancé',
    badge: 'TENDANCE VIRALE 2026',
    rating: 4.98,
    reviewCount: 2190,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 25.0,
    priceUsd: 12.99,
    priceDzd: 2200,
    priceSar: 45,
    priceAed: 44,
    priceKwd: 3.9,
    costPriceUsd: 3.00,
    palette: 'emerald_clean',
    trafficSource: 'tiktok',
    urgencyMinutes: 12,
    guaranteeNotice: 'Garantie remplacement 30 jours continue en cas de souci',
    highlights: [
      'Accès immédiat sans file d\'attente ni restriction d\'heures de pointe',
      'Modèle GPT-4o le plus intelligent au monde avec Canvas interactif',
      'Génération d\'images ultra-réalistes DALL-E 3 intégrée',
      'Garantie de fonctionnement 30 jours sans risque de blocage',
    ],
    stockRemaining: 3,
    packs: [
      {
        id: 'pack-1m',
        name: 'Pass 1 Mois',
        durationLabel: '30 Jours d\'accès illimité',
        multiplier: 1.0,
        discountPercent: 50,
      },
      {
        id: 'pack-3m',
        name: 'Pass 3 Mois (Le Plus Choisi)',
        durationLabel: '90 Jours avec garantie continue',
        multiplier: 2.4,
        discountPercent: 65,
        badge: 'LE PLUS POPULAIRE',
        isPopular: true,
      },
      {
        id: 'pack-12m',
        name: 'Pass 1 An VIP',
        durationLabel: '365 Jours VIP sans interruption',
        multiplier: 6.8,
        discountPercent: 78,
        badge: 'ÉCONOMIE MAXIMALE',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Accédez à chatgpt.com',
        description: 'Rendez-vous sur le site officiel OpenAI ou ouvrez l\'application officielle ChatGPT.',
      },
      {
        step: 2,
        title: 'Connexion Sécurisée',
        description: 'Connectez-vous à l\'aide des identifiants premium réservés délivrés dans votre coffre.',
      },
      {
        step: 3,
        title: 'Profitez de GPT-4o',
        description: 'Vérifiez le badge "Plus" actif et générez sans limite textes, codes, images et analyses de données !',
      },
    ],
  },

  // 3. Microsoft Office 2024 Professionnel Plus
  {
    id: 'prod-office-2024-pro',
    slug: 'office-2024-pro-plus',
    title: 'Microsoft Office 2024 Professionnel Plus (Licence à Vie)',
    subtitle: 'Word, Excel, PowerPoint, Outlook 2024 • Zéro abonnement mensuel • Lié à votre compte Microsoft',
    badge: 'INDISPENSABLE PRODUCTIVITÉ',
    rating: 4.97,
    reviewCount: 2950,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 249.0,
    priceUsd: 16.99,
    priceDzd: 2400,
    priceSar: 59,
    priceAed: 58,
    priceKwd: 4.9,
    costPriceUsd: 2.80,
    palette: 'gold_luxury',
    trafficSource: 'meta',
    urgencyMinutes: 10,
    guaranteeNotice: 'Licence perpétuelle liée à votre compte personnel setup.office.com',
    highlights: [
      'Suite Office 2024 officielle complète (Word, Excel, PPT, Outlook, Access)',
      'Licence perpétuelle sans frais annuels ni abonnement',
      'Téléchargement direct depuis setup.office.com',
      'Support multilingue complet (Français, Arabe, Anglais, Espagnol)',
    ],
    stockRemaining: 6,
    packs: [
      {
        id: 'pack-1pc',
        name: 'Licence 1 PC',
        durationLabel: 'Usage Personnel à Vie',
        multiplier: 1.0,
        discountPercent: 75,
      },
      {
        id: 'pack-2pc',
        name: 'Pack 2 Postes (PC / Laptop)',
        durationLabel: '2 Postes de travail',
        multiplier: 1.7,
        discountPercent: 82,
        badge: 'LE PLUS POPULAIRE',
        isPopular: true,
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Connectez-vous sur setup.office.com',
        description: 'Ouvrez le portail officiel Microsoft setup.office.com avec votre compte Microsoft.',
      },
      {
        step: 2,
        title: 'Entrez la Clé 25 Caractères',
        description: 'Collez la clé reçue. La licence sera automatiquement associée de manière définitive à votre compte.',
      },
      {
        step: 3,
        title: 'Téléchargez et Installez',
        description: 'Lancez l\'installateur officiel Microsoft. Vos logiciels Word, Excel et PowerPoint sont prêts à vie !',
      },
    ],
  },

  // 4. Black Myth: Wukong
  {
    id: 'prod-black-myth-wukong',
    slug: 'black-myth-wukong',
    title: 'Black Myth: Wukong (Clé Steam Globale PC)',
    subtitle: 'Le chef-d\'œuvre RPG phénomène mondial • Clé Steam officielle Region Free • Jouable immédiatement',
    badge: 'BESTSELLER GAMING',
    rating: 4.95,
    reviewCount: 1850,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 59.99,
    priceUsd: 34.99,
    priceDzd: 4900,
    priceSar: 129,
    priceAed: 125,
    priceKwd: 10.5,
    costPriceUsd: 18.00,
    palette: 'cyber_dark',
    trafficSource: 'tiktok',
    urgencyMinutes: 20,
    guaranteeNotice: 'Clé Steam officielle globale activable dans le monde entier',
    highlights: [
      'Clé officielle Steam Region Free (Algérie, Golfe, Monde)',
      'Livraison instantanée dans le coffre numérique',
      'Téléchargement officiel à pleine vitesse sur Steam',
      'Garantie d\'activation permanente sur votre propre compte',
    ],
    stockRemaining: 4,
    packs: [
      {
        id: 'pack-standard',
        name: 'Édition Standard Globale',
        durationLabel: 'Jeu complet Steam',
        multiplier: 1.0,
        discountPercent: 42,
        isPopular: true,
        badge: 'ÉDITION OFFICIELLE',
      },
      {
        id: 'pack-deluxe',
        name: 'Édition Deluxe + Bonus d\'Armure',
        durationLabel: 'Jeu + Armures + Bande-son',
        multiplier: 1.25,
        discountPercent: 48,
        badge: 'DELUXE RECOMMANDÉE',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Ouvrez le client Steam',
        description: 'Connectez-vous à votre application Steam sur votre PC Windows.',
      },
      {
        step: 2,
        title: 'Ajouter un jeu',
        description: 'En bas à gauche, cliquez sur "+ Ajouter un jeu" puis "Activer un produit sur Steam...".',
      },
      {
        step: 3,
        title: 'Téléchargez et Jouez !',
        description: 'Collez la clé du coffre. Le jeu est ajouté définitivement à votre bibliothèque Steam officielle !',
      },
    ],
  },

  // 5. Canva Pro Équipe
  {
    id: 'prod-canva-pro',
    slug: 'canva-pro-equipe',
    title: 'Canva Pro Équipe (Accès Annuel Garanti)',
    subtitle: 'Accès illimité à tous les modèles premium, Brand Kit et suppression d\'arrière-plan en 1 clic',
    badge: 'TOP CRÉATEURS TIKTOK',
    rating: 4.97,
    reviewCount: 3120,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 119.99,
    priceUsd: 9.99,
    priceDzd: 1600,
    priceSar: 39,
    priceAed: 38,
    priceKwd: 3.2,
    costPriceUsd: 1.50,
    palette: 'emerald_clean',
    trafficSource: 'tiktok',
    urgencyMinutes: 15,
    guaranteeNotice: 'Activation sur votre propre adresse email Canva avec garantie 365 jours',
    highlights: [
      'Plus de 100 millions de photos, vidéos et éléments graphiques débloqués',
      'Outils IA magiques : suppression d\'arrière-plan et redimensionnement automatique',
      'Exportation transparente haute résolution et kits de marque personnalisés',
      'Activation simple sur votre compte personnel sans perte de vos designs',
    ],
    stockRemaining: 8,
    packs: [
      {
        id: 'pack-canva-1y',
        name: 'Pass 1 An Personnel',
        durationLabel: '365 Jours Pro Garantis',
        multiplier: 1.0,
        discountPercent: 88,
        isPopular: true,
        badge: 'LE PLUS DEMANDÉ',
      },
      {
        id: 'pack-canva-life',
        name: 'Pass 2 Ans Créateur',
        durationLabel: '730 Jours Sans Interruption',
        multiplier: 1.6,
        discountPercent: 92,
        badge: 'OFFRE LIMITÉE',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Fournissez votre Email Canva',
        description: 'Indiquez l\'adresse email liée à votre compte Canva lors de la commande.',
      },
      {
        step: 2,
        title: 'Acceptez l\'Invitation Équipe',
        description: 'Vous recevez instantanément un lien d\'invitation officiel Canva Pro dans votre boîte de réception.',
      },
      {
        step: 3,
        title: 'Créez Sans Limite',
        description: 'Tous les assets, filtres et polices Pro sont débloqués immédiatement !',
      },
    ],
  },

  // 6. Adobe Creative Cloud
  {
    id: 'prod-adobe-creative-cloud',
    slug: 'adobe-creative-cloud',
    title: 'Adobe Creative Cloud (Abonnement 1 An Tous Produits)',
    subtitle: 'Photoshop, Illustrator, Premiere Pro, After Effects et 20+ applications officielles avec cloud',
    badge: 'SUITE PRO GRAPHISME',
    rating: 4.99,
    reviewCount: 1420,
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 599.99,
    priceUsd: 49.99,
    priceDzd: 7500,
    priceSar: 189,
    priceAed: 185,
    priceKwd: 15.0,
    costPriceUsd: 15.00,
    palette: 'gold_luxury',
    trafficSource: 'meta',
    urgencyMinutes: 10,
    guaranteeNotice: 'Activation officielle Adobe ID avec accès Creative Cloud Desktop',
    highlights: [
      'Accès complet à Photoshop 2025, Illustrator, Premiere Pro et After Effects',
      'Mises à jour automatiques via l\'application officielle Adobe Desktop',
      'Outils Firefly Génératif IA inclus pour retouche et création d\'images',
      'Compatible Windows, Mac et tablettes iPad',
    ],
    stockRemaining: 4,
    packs: [
      {
        id: 'pack-adobe-1y',
        name: 'Licence 1 An Complète',
        durationLabel: 'Tous les 20+ logiciels Adobe',
        multiplier: 1.0,
        discountPercent: 91,
        isPopular: true,
        badge: 'OFFRE CRÉATIF',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Invitation officielle Adobe',
        description: 'L\'accès est rattaché à votre compte Adobe officiel sous 5 minutes.',
      },
      {
        step: 2,
        title: 'Connectez Creative Cloud',
        description: 'Téléchargez les logiciels directement depuis le gestionnaire Adobe Creative Cloud.',
      },
      {
        step: 3,
        title: 'Mises à jour certifiées',
        description: 'Bénéficiez de la synchronisation cloud et des fonctionnalités IA Firefly.',
      },
    ],
  },

  // 7. NordVPN Premium
  {
    id: 'prod-nordvpn-premium',
    slug: 'nordvpn-premium-2ans',
    title: 'NordVPN Premium (Licence 2 Ans Multi-Appareils)',
    subtitle: 'Serveurs ultra-rapides 111 pays • Débloquez Netflix, streaming et naviguez en anonymat complet',
    badge: 'SÉCURITÉ & STREAMING',
    rating: 4.94,
    reviewCount: 2680,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 189.0,
    priceUsd: 18.99,
    priceDzd: 2900,
    priceSar: 69,
    priceAed: 68,
    priceKwd: 5.6,
    costPriceUsd: 4.00,
    palette: 'cyber_dark',
    trafficSource: 'tiktok',
    urgencyMinutes: 15,
    guaranteeNotice: 'Compte officiel vérifié avec garantie de fonctionnement 2 ans',
    highlights: [
      'Plus de 6 000 serveurs ultra-rapides répartis dans 111 pays',
      'Protection contre les menaces web, blocage des pubs et traqueurs',
      'Connexion simultanée jusqu\'à 10 appareils (PC, Mac, iPhone, Android, TV)',
      'Déblocage garanti des catalogues Netflix US/UK, BeIN Sports et plateformes géo-bloquées',
    ],
    stockRemaining: 7,
    packs: [
      {
        id: 'pack-nord-2y',
        name: 'Pass 2 Ans Premium',
        durationLabel: '730 Jours de Protection',
        multiplier: 1.0,
        discountPercent: 88,
        isPopular: true,
        badge: 'TOP STREAMING',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Téléchargez NordVPN',
        description: 'Installez l\'application NordVPN sur votre téléphone ou ordinateur.',
      },
      {
        step: 2,
        title: 'Connexion directe',
        description: 'Entrez les identifiants sécurisés fournis dans votre coffre.',
      },
      {
        step: 3,
        title: 'Protection active',
        description: 'Cliquez sur Quick Connect pour sécuriser instantanément vos transferts.',
      },
    ],
  },

  // 8. Spotify Premium
  {
    id: 'prod-spotify-premium',
    slug: 'spotify-premium-12mois',
    title: 'Spotify Premium (Abonnement Personnel 12 Mois)',
    subtitle: 'Écoute hors-ligne illimitée, son très haute qualité et zapping illimité sur votre propre compte',
    badge: 'MUSIQUE SANS PUB',
    rating: 4.96,
    reviewCount: 4210,
    image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 119.88,
    priceUsd: 14.99,
    priceDzd: 1950,
    priceSar: 49,
    priceAed: 48,
    priceKwd: 4.0,
    costPriceUsd: 3.20,
    palette: 'emerald_clean',
    trafficSource: 'tiktok',
    urgencyMinutes: 12,
    guaranteeNotice: 'Remplacement garanti sous 15 minutes en cas de problème',
    highlights: [
      'Zéro interruption publicitaire sur mobile, desktop et consoles',
      'Téléchargement de vos playlists pour écoute sans connexion internet',
      'Qualité audio supérieure 320 kbps et accès illimité aux paroles',
      'Conservation intacte de vos playlists, favoris et algorithme d\'écoute',
    ],
    stockRemaining: 9,
    packs: [
      {
        id: 'pack-spotify-1y',
        name: 'Abonnement 12 Mois',
        durationLabel: '365 Jours Musique Illimitée',
        multiplier: 1.0,
        discountPercent: 86,
        isPopular: true,
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Réception du lien VIP',
        description: 'Récupérez votre lien d\'activation immédiat délivré dans le coffre.',
      },
      {
        step: 2,
        title: 'Activation du compte',
        description: 'Suivez le lien pour upgrader votre compte Spotify existant en Premium.',
      },
      {
        step: 3,
        title: 'Écoutez sans pub',
        description: 'Profitez de votre musique préférée sans restriction pendant 1 an !',
      },
    ],
  },

  // 9. Autodesk AutoCAD 2025
  {
    id: 'prod-autocad-2025',
    slug: 'autodesk-autocad-2025',
    title: 'Autodesk AutoCAD 2025 (Licence Concepteur 1 An)',
    subtitle: 'Conception 2D/3D officielle Autodesk liée à votre adresse email constructeur • Support inclus',
    badge: 'ARCHITECTURE & INGÉNIERIE',
    rating: 4.98,
    reviewCount: 980,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 1999.0,
    priceUsd: 45.00,
    priceDzd: 6800,
    priceSar: 175,
    priceAed: 170,
    priceKwd: 13.9,
    costPriceUsd: 12.00,
    palette: 'gold_luxury',
    trafficSource: 'google',
    urgencyMinutes: 15,
    guaranteeNotice: 'Licence éducation/pro officielle activée sur le portail autodesk.com',
    highlights: [
      'Licence officielle pour professionnels du bâtiment, architectes et ingénieurs',
      'Téléchargement direct des exécutables depuis manage.autodesk.com',
      'Ensembles d\'outils spécialisés inclus : Architecture, Mechanical, Electrical',
      'Validité 1 an complète avec possibilité de renouvellement continu',
    ],
    stockRemaining: 3,
    packs: [
      {
        id: 'pack-cad-1y',
        name: 'Licence 1 An Plein Accès',
        durationLabel: 'Usage 365 Jours',
        multiplier: 1.0,
        discountPercent: 97,
        isPopular: true,
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Invitation Autodesk',
        description: 'Votre email est configuré dans le pool de licences Autodesk officiel.',
      },
      {
        step: 2,
        title: 'Connexion manage.autodesk.com',
        description: 'Téléchargez AutoCAD 2025 en français ou anglais directement sur le site constructeur.',
      },
      {
        step: 3,
        title: 'Activation par login',
        description: 'Connectez-vous dans le logiciel pour travailler immédiatement sur vos projets.',
      },
    ],
  },

  // 10. JetBrains All Products Pack
  {
    id: 'prod-jetbrains-all',
    slug: 'jetbrains-all-products',
    title: 'JetBrains All Products Pack (Clé Développeur 1 An)',
    subtitle: 'IntelliJ IDEA Ultimate, WebStorm, PyCharm Pro, PhpStorm et toute la suite officielle JetBrains',
    badge: 'ESSENTIEL DÉVELOPPEUR',
    rating: 4.99,
    reviewCount: 1640,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 499.0,
    priceUsd: 36.99,
    priceDzd: 5400,
    priceSar: 139,
    priceAed: 135,
    priceKwd: 11.2,
    costPriceUsd: 8.50,
    palette: 'cyber_dark',
    trafficSource: 'google',
    urgencyMinutes: 10,
    guaranteeNotice: 'Clé d\'activation officielle pour tous les IDE JetBrains',
    highlights: [
      'Accès illimité à tous les IDE : IntelliJ IDEA, WebStorm, PyCharm, PhpStorm, GoLand, Rider',
      'Plugins avancés, débogueurs intelligents et assistance IA pour développeurs',
      'Activation simple par code d\'activation ou jeton de serveur de licence',
      'Multi-plateforme : Windows, Linux et macOS (compatible puces Apple Silicon M1/M2/M3)',
    ],
    stockRemaining: 5,
    packs: [
      {
        id: 'pack-jetbrains-1y',
        name: 'Pass Développeur 1 An',
        durationLabel: 'Suite Complète 10+ IDEs',
        multiplier: 1.0,
        discountPercent: 92,
        isPopular: true,
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Ouvrez votre IDE JetBrains',
        description: 'Lancez IntelliJ, WebStorm ou PyCharm sur votre machine.',
      },
      {
        step: 2,
        title: 'Menu d\'enregistrement',
        description: 'Allez dans Help > Register... et sélectionnez "Activation code".',
      },
      {
        step: 3,
        title: 'Collez le code de licence',
        description: 'Collez le certificat fourni. Tous les IDEs de la suite sont instantanément déverrouillés !',
      },
    ],
  },

  // 11. Midjourney Pro
  {
    id: 'prod-midjourney-pro',
    slug: 'midjourney-pro',
    title: 'Midjourney Pro (Accès Génération Illimitée)',
    subtitle: 'Générations rapides en mode Stealth, accès illimité aux dernières versions V6 et v7 privées',
    badge: 'IA GÉNÉRATIVE ÉLITE',
    rating: 4.97,
    reviewCount: 1890,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 60.0,
    priceUsd: 21.99,
    priceDzd: 3200,
    priceSar: 79,
    priceAed: 78,
    priceKwd: 6.4,
    costPriceUsd: 5.50,
    palette: 'cyber_dark',
    trafficSource: 'tiktok',
    urgencyMinutes: 15,
    guaranteeNotice: 'Accès Discord officiel avec mode privé Stealth inclus',
    highlights: [
      'Génération illimitée en mode Relax et 30 heures de GPU rapide par mois',
      'Mode Stealth : vos créations restent 100% privées et cachées de la galerie publique',
      'Résolution 4K native et réglages artistiques avancés pour créateurs et agences',
      'Support immédiat et intégration Discord directe',
    ],
    stockRemaining: 4,
    packs: [
      {
        id: 'pack-midjourney-1m',
        name: 'Pass 1 Mois Illimité',
        durationLabel: 'Génération Sans Limite',
        multiplier: 1.0,
        discountPercent: 63,
        isPopular: true,
      },
      {
        id: 'pack-midjourney-3m',
        name: 'Pass 3 Mois Créateur',
        durationLabel: 'Économie Trimestrielle',
        multiplier: 2.6,
        discountPercent: 72,
        badge: 'OFFRE PRO',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Accès au serveur Discord',
        description: 'Rejoignez le salon réservé via les accès délivrés dans votre coffre.',
      },
      {
        step: 2,
        title: 'Activez /imagine',
        description: 'Tapez votre prompt pour générer vos visuels en quelques secondes.',
      },
      {
        step: 3,
        title: 'Téléchargez en 4K',
        description: 'Exportez vos chefs-d\'œuvre en pleine résolution commerciale libre de droits.',
      },
    ],
  },

  // 12. Windows 10 Pro + Office 2021
  {
    id: 'prod-windows-office-bundle',
    slug: 'pack-windows10-office2021',
    title: 'Windows 10 Pro + Office 2021 (Pack Bundle Économique)',
    subtitle: 'Le bundle parfait pour équiper votre PC : Windows 10 Pro officiel Retail + Office 2021 Pro Plus à vie',
    badge: 'PACK ÉCONOMIQUE -85%',
    rating: 4.96,
    reviewCount: 3410,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    originalPriceUsd: 349.0,
    priceUsd: 17.99,
    priceDzd: 2600,
    priceSar: 65,
    priceAed: 64,
    priceKwd: 5.2,
    costPriceUsd: 3.50,
    palette: 'emerald_clean',
    trafficSource: 'meta',
    urgencyMinutes: 12,
    guaranteeNotice: 'Double clé Retail officielle certifiée avec activation garantie à vie',
    highlights: [
      'Contient 2 licences authentiques : 1x Windows 10 Pro Retail + 1x Office 2021 Pro Plus',
      'Activation permanente à vie sans aucun abonnement ni renouvellement',
      'Possibilité de migrer gratuitement vers Windows 11 Pro en 1 clic plus tard',
      'Idéal pour reconditionner un ancien PC ou équiper un nouvel ordinateur au meilleur prix',
    ],
    stockRemaining: 6,
    packs: [
      {
        id: 'pack-bundle-1pc',
        name: 'Pack 1 Machine Complète',
        durationLabel: 'Windows 10 Pro + Office 2021',
        multiplier: 1.0,
        discountPercent: 85,
        isPopular: true,
        badge: 'MEILLEURE VENTE BUNDLE',
      },
    ],
    activationSteps: [
      {
        step: 1,
        title: 'Activez Windows 10 Pro',
        description: 'Utilisez la première clé dans Paramètres > Mise à jour et sécurité > Activation.',
      },
      {
        step: 2,
        title: 'Activez Office 2021 Pro Plus',
        description: 'Rendez-vous sur setup.office.com et liez la seconde clé à votre compte.',
      },
      {
        step: 3,
        title: 'PC 100% Opérationnel',
        description: 'Votre système d\'exploitation et vos outils bureautiques sont prêts pour toujours !',
      },
    ],
  },
];

export const FUNNEL_ORDER_BUMP: FunnelOrderBumpOffer = {
  id: 'bump-vip-warranty',
  enabled: true,
  title: {
    dz: 'Garantie VIP Remplacement 1 An + Support Dédié WhatsApp',
    sa: 'الضمان الذهبي للاستبدال الفوري لمدة سنة + دعم واتساب فوري',
    ae: 'VIP 1-Year Instant Replacement Guarantee + Dedicated WhatsApp',
    intl: 'VIP 1-Year Instant Replacement Guarantee & 24/7 Priority Support',
  },
  description: {
    dz: 'Garantie 365 jours kemla : ida srat ay mochkla f la clé ou formatait l-pc, n3awdoulek clé jdida f 15 d9i9a direct via WhatsApp !',
    sa: 'إذا واجهت أي مشكلة بالتفعيل أو قمت بتهيئة جهازك خلال 365 يوماً، نرسل لك كود بديل جديد كلياً في أقل من 15 دقيقة فوراً وبدون تعقيد.',
    ae: 'Comprehensive 365-day warranty: instant replacement in under 15 minutes if you format your PC or face any activation hurdle.',
    intl: 'If your license experiences any issue or you reformat your PC within 365 days, we issue a brand-new replacement in under 15 minutes, no questions asked.',
  },
  priceUsd: 1.99,
  priceDzd: 290,
  priceSar: 8,
  priceAed: 7.5,
  priceKwd: 0.65,
};

export const FUNNEL_UPSELL_OFFER: FunnelUpsellOffer = {
  id: 'upsell-office-2024-pro',
  enabled: true,
  productId: 'prod-office-2024-pro',
  title: {
    dz: 'Pack Microsoft Office 2024 Pro Plus Officiel (Licence Démak à Vie)',
    sa: 'حزمة مايكروسوفت أوفيس 2024 برو بلس الرسمية (مدى الحياة)',
    ae: 'Microsoft Office 2024 Professional Plus (Lifetime Lifetime Key)',
    intl: 'Microsoft Office 2024 Professional Plus (Genuine Lifetime License)',
  },
  headline: {
    dz: 'SBER D9I9A ! Offre VIP Spéciale Nouveaux Clients (-70%)',
    sa: 'انتظر لحظة! عرض حصري للعملاء الجدد فقط بخصم 70% لمرة واحدة',
    ae: 'WAIT! Exclusive One-Time Offer for New Customers (-70% OFF)',
    intl: 'WAIT! Special New Customer Add-on Offer (-70% OFF)',
  },
  description: {
    dz: 'Kemmel l-PC ta3ek b Office 2024 officiel (Word, Excel, PowerPoint) b souma khayaliya ghir lyoum m3a had la commande !',
    sa: 'أكمل جهازك بحزمة الأوفيس الأصلية الرسمية (وورد، إكسل، باوربوينت) مدى الحياة بهذا السعر الاستثنائي قبل إغلاق الصفحة.',
    ae: 'Equip your device with genuine permanent Word, Excel, PowerPoint & Outlook 2024. Only available before leaving this page.',
    intl: 'Complete your machine setup with genuine permanent Word, Excel, PowerPoint and Outlook 2024. Available exclusively right now.',
  },
  image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  originalPriceUsd: 149.0,
  priceUsd: 9.99,
  priceDzd: 1450,
  priceSar: 38,
  priceAed: 37,
  discountPercentage: 70,
  urgencyMinutes: 5,
  features: [
    'Word, Excel, PowerPoint, Outlook, Access & Publisher 2024',
    'Licence à vie liée à votre compte Microsoft',
    'Activation en ligne officielle en 1 minute',
    'Zéro abonnement mensuel • Payez une seule fois',
  ],
};

export const FUNNEL_RETENTION_SETTINGS: FunnelRetentionSettings = {
  thankYouHeadline: 'Félicitations pour votre achat ! Votre commande est déverrouillée.',
  thankYouMessage: 'Votre reçu officiel et vos clés de licence ont été validés avec succès et transmis par email.',
  couponCode: 'NOVALYS20',
  couponDiscountPercent: 20,
  whatsappSupportNumber: '+213 550 00 00 00',
  emailSupport: 'cherchellsgpp@gmail.com',
  autoRevealLicense: true,
};

export const LOCALIZED_DIALECT_DATA: Record<FunnelLocale, LocalizedDialectContent> = {
  dz: {
    locale: 'dz',
    countryName: 'Algérie',
    flag: '🇩🇿',
    currency: 'DZD',
    bannerNotice: '⚡ OFFRE SPÉCIALE ALGERIE • PAIEMENT BARIDIMOB DISPONIBLE • LIVRAISON 30 SECONDES',
    heroPitch: 'Khlis b BaridiMob fel hssab officiel w ddi la clé ta3ek direct ! Pas besoin de carte visa internationale.',
    guaranteeNotice: 'Garantie 100% activation légale • Support algérien 7j/7 sur WhatsApp • Plus de 14 000 clients satisfaits en Algérie.',
    orderBumpLabel: 'AJOUT CONSEILLÉ (+290 DA)',
    paymentNotice: 'Paiement sécurisé par virement BaridiMob / CCP avec validation ultra-rapide du reçu.',
    reviews: [
      {
        name: 'Amine Benali',
        location: 'Alger (Kouba)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: 'Il y a 14 minutes',
        comment: 'Wallah top ! Khallast b BaridiMob w b3atht la capture fel site, ma fatetch 2 minutes la clé weslet f l\'email w activit direct. Ya3tikom saha khawa !',
        verifiedMethod: 'Virement BaridiMob vérifié',
      },
      {
        name: 'Kamel Zerrouki',
        location: 'Oran (Bir El Djir)',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: 'Il y a 32 minutes',
        comment: 'Kont khayef f le début psk bezzaf arnaqueurs f Facebook, mé m3a Novalys la clé Retail marche 10/10. En plus le prix 1850 DA khir b bezzaf men les boutiques.',
        verifiedMethod: 'Achat vérifié 🇩🇿',
      },
      {
        name: 'Sara M.',
        location: 'Constantine',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: 'Il y a 1 heure',
        comment: 'Service client hayel bzaf sur WhatsApp. Ils m\'ont guidé pour l\'activation de Windows et Office. Je recommande les yeux fermés !',
        verifiedMethod: 'Support WhatsApp 7j/7',
      },
    ],
  },
  sa: {
    locale: 'sa',
    countryName: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    currency: 'SAR',
    bannerNotice: '⚡ عرض حصري تيك توك وسناب شات • دفع فوري عبر مدى وأبل باي • تسليم فوري',
    heroPitch: 'ادفع عبر مدى أو أبل باي واستلم كود التفعيل فوراً على الشاشة والإيميل. ضمان ذهبي وضمان استبدال فوري.',
    guaranteeNotice: 'ضمان التفعيل الرسمي 100% • مفاتيح معتمدة عالمياً • دعم فني خليجي سريع على مدار الساعة.',
    orderBumpLabel: 'عرض إضافي موصى به (+8 ر.س)',
    paymentNotice: 'بوابة Tap Payments الموحدة: بطاقات مدى، Apple Pay، STC Pay، KNET.',
    reviews: [
      {
        name: 'عبدالرحمن الشمري',
        location: 'الرياض',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: 'منذ 8 دقائق',
        comment: 'ما شاء الله تبارك الله، دفعت بـ Apple Pay ووصلني كود التفعيل فوراً على الشاشة وعلى الإيميل. تم التفعيل بنجاح وبأقل من 50 ريال!',
        verifiedMethod: 'دفع مؤكد عبر Apple Pay',
      },
      {
        name: 'فيصل القحطاني',
        location: 'جدة',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: 'منذ 25 دقيقة',
        comment: 'خدمة احترافية وسريعة جداً. أخذت حزمة الويندوز والأوفيس مع بعض، وفرت أكثر من 80% من سعر مايكروسوفت الرسمي. أنصح بالتعامل معهم.',
        verifiedMethod: 'شراء موثق بطاقة مدى 🇸🇦',
      },
      {
        name: 'مها الحربي',
        location: 'الدمام',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: 'منذ ساعة',
        comment: 'المفتاح أصلي ريتيل واشتغل معي من أول مرة وبدون أي تعقيد. شكراً على المصداقية والسرعة.',
        verifiedMethod: 'عميل موثق',
      },
    ],
  },
  ae: {
    locale: 'ae',
    countryName: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    currency: 'AED',
    bannerNotice: '⚡ UAE FLASH SALE • INSTANT DIGITAL VAULT DELIVERY • APPLE PAY & CARD CHECKOUT',
    heroPitch: 'Buy genuine digital keys in UAE with zero markup. Instant checkout with Apple Pay or credit cards and instant key issuance.',
    guaranteeNotice: 'Permanent Genuine Key • 100% Activation Guarantee • 24/7 UAE Customer Support.',
    orderBumpLabel: 'SPECIAL VIP ADD-ON (+7.5 AED)',
    paymentNotice: 'Secured Tap Payments gateway: Visa, Mastercard, Apple Pay & Google Pay.',
    reviews: [
      {
        name: 'Rashid Al Nuaimi',
        location: 'Dubai (Downtown)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: '12 minutes ago',
        comment: 'Smooth and seamless Apple Pay purchase. Key worked on the spot without any issues. Super convenient.',
        verifiedMethod: 'Apple Pay Verified 🇦🇪',
      },
      {
        name: 'Zayed Al Mansoori',
        location: 'Abu Dhabi',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: '40 minutes ago',
        comment: 'Great pricing compared to local retail stores. Got my Windows and Office licenses within 30 seconds.',
        verifiedMethod: 'Verified Buyer',
      },
    ],
  },
  intl: {
    locale: 'intl',
    countryName: 'International / Global',
    flag: '🌐',
    currency: 'USD',
    bannerNotice: '⚡ VIRAL META & TIKTOK FLASH SALE • INSTANT DIGITAL VAULT DELIVERY • 100% OFFICIAL',
    heroPitch: 'Official genuine digital licenses with instant automated delivery. Verified payment via Stripe, Apple Pay or PayPal with 100% money-back guarantee.',
    guaranteeNotice: 'Permanent Retail License • Direct Microsoft/Steam Activation • 24/7 Dedicated Priority Support.',
    orderBumpLabel: 'HIGHLY RECOMMENDED ADD-ON (+$1.99)',
    paymentNotice: 'Instant automated delivery via Stripe, Visa, Mastercard, Apple Pay, PayPal & Crypto.',
    reviews: [
      {
        name: 'Lucas Martin',
        location: 'Paris, France',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: '9 minutes ago',
        comment: 'Impressed! Paid with Apple Pay and the retail key was delivered immediately on the screen and by email. Clean, official, and activated in 10 seconds.',
        verifiedMethod: 'Verified Stripe Checkout',
      },
      {
        name: 'David Reynolds',
        location: 'London, UK',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: '27 minutes ago',
        comment: 'Best deal found through TikTok. Genuine license, prompt activation and the order bump guarantee gives full peace of mind. 5 stars.',
        verifiedMethod: 'Verified International Buyer',
      },
      {
        name: 'Elena Rossi',
        location: 'Milan, Italy',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        rating: 5,
        timeAgo: '1 hour ago',
        comment: 'Quick and transparent checkout. Key activated without any error on Windows 11 Pro. Great customer experience.',
        verifiedMethod: 'Verified Purchase',
      },
    ],
  },
};

export function getFunnelProductBySlug(slug: string): FunnelProductOffer {
  const normalized = slug?.toLowerCase().trim();
  
  // Check client-side localStorage if available
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('novalys_funnel_products_v2');
      if (stored) {
        const list: FunnelProductOffer[] = JSON.parse(stored);
        const match = list.find(
          (p) =>
            p.slug.toLowerCase() === normalized ||
            p.id.toLowerCase() === normalized ||
            p.slug.includes(normalized) ||
            normalized.includes(p.slug)
        );
        if (match) return match;
      }
    } catch (e) {
      // fallback to static list
    }
  }

  const found = FUNNEL_PRODUCTS.find(
    (p) =>
      p.slug.toLowerCase() === normalized ||
      p.id.toLowerCase() === normalized ||
      p.slug.includes(normalized) ||
      normalized.includes(p.slug)
  );
  return found || FUNNEL_PRODUCTS[0];
}
