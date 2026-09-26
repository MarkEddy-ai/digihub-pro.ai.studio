export type Currency = 'USD' | 'DZD' | 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR';

export type PaymentGatewayId = 'stripe' | 'paypal' | 'baridimob' | 'tap_payments' | 'paytabs' | 'crypto';

export type OrderPaymentMethod =
  | 'baridimob'
  | 'ccp'
  | 'stripe'
  | 'paypal'
  | 'mada'
  | 'apple_pay'
  | 'google_pay'
  | 'stc_pay'
  | 'knet'
  | 'benefit_pay'
  | 'naps'
  | 'omannet'
  | 'card'
  | 'crypto'
  | 'cod'
  | (string & {});

export type DeliveryType = 'key' | 'account_text' | 'manual_service';

export type ProductType =
  | 'subscription'
  | 'lifetime'
  | 'license_key'
  | 'key'
  | 'credits'
  | 'gift-card'
  | 'software'
  | 'account'
  | 'service'
  | (string & {});

export interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  region: 'Maghreb' | 'GCC' | 'International';
  rateToUsd: number; // e.g. 1 USD = 230 DZD, 1 USD = 3.75 SAR
  decimals: number;
  defaultGateway: PaymentGatewayId;
  supportedMethods: OrderPaymentMethod[];
  enabled: boolean;
}

export interface PaymentGatewaySettings {
  id: PaymentGatewayId;
  name: string;
  providerType: 'international' | 'gcc_unified' | 'algeria_manual' | 'crypto';
  enabled: boolean;
  testMode: boolean;
  currencies: Currency[];
  supportedMethods: OrderPaymentMethod[];
  credentials: {
    publishableKey?: string;
    secretKey?: string;
    clientId?: string;
    webhookSecret?: string;
    accountRip?: string; // For BaridiMob
    accountCcp?: string; // For CCP Algérie
    accountHolder?: string;
  };
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'pending_proof'
  | 'pending_verification'
  | 'completed'
  | 'refunded';

export type CategoryId =
  | 'ia-productivity'
  | 'streaming'
  | 'design-creation'
  | 'software'
  | 'microsoft-windows'
  | 'gaming'
  | 'antivirus-security'
  | 'digital-subscriptions'
  | 'other'
  | (string & {});

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  productCount: number;
}

export type Platform = 'Steam' | 'Epic' | 'PSN' | 'Xbox' | 'Office' | 'Windows' | 'OpenAI' | 'Android' | 'iOS' | 'Web' | 'macOS';

export interface ProductOption {
  label: string;
  value: string;
  priceDelta: number; // in DZD
  durationLabel?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  title: string;
}

/**
 * Table: Products
 * ├── id (UUID)
 * ├── title (Nom du jeu ou service)
 * ├── platform (Steam, Epic, PSN, Office...)
 * ├── category (Jeux, Abonnements, Logiciels, Monnaie virtuelle)
 * ├── price_dzd (Prix en Dinars)
 * ├── price_sar (Prix en Riyals)
 * ├── price_usd (Prix international)
 * ├── cost_price_usd (Coût d'achat sur Plati/GGsel)
 * └── delivery_type (key, account_text, manual_service)
 */
export interface Product {
  id: string; // UUID
  title?: string; // Nom du jeu ou service
  name: string; // Alias for UI compatibility
  slug: string;
  platform?: string; // Steam, Epic, PSN, Office...
  platforms: Platform[];
  category: string; // Jeux, Abonnements, Logiciels, Monnaie virtuelle
  categoryLabel: string;
  subcategory?: string;
  price_dzd?: number; // Prix en Dinars
  price_sar?: number; // Prix en Riyals
  price_usd?: number; // Prix international
  price_aed?: number; // Prix Émirats
  price_kwd?: number; // Prix Koweït
  price_qar?: number; // Prix Qatar
  price_bhd?: number; // Prix Bahreïn
  price_omr?: number; // Prix Oman
  prices?: Partial<Record<Currency, number>>; // Multi-currency map
  cost_price_usd?: number; // Coût d'achat sur Plati/GGsel
  delivery_type?: DeliveryType; // key, account_text, manual_service
  
  // Backwards compatibility / UI helper getters
  price: number; // Defaults to price_dzd
  originalPrice: number;
  discountPercentage: number;
  stockCount: number; // Computed dynamically from Digital_Items where is_delivered == false
  inStock: boolean;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  galleryImages?: string[];
  badge?: 'Bestseller' | 'Populaire' | 'Offre Flash' | 'Nouveauté' | 'Promo -50%' | 'Stock Limité';
  productTypeLabel: string;
  deliveryTime: string;
  deliveryMethod: string;
  productType?: string;
  rating: number;
  reviewCount: number;
  features: string[];
  whatIsIncluded: string[];
  systemRequirements: {
    os: string;
    processor?: string;
    ram?: string;
    disk?: string;
    extra?: string;
  };
  activationGuide: {
    step: number;
    title: string;
    instruction: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  reviews: ProductReview[];
  options?: ProductOption[];
  isPopular?: boolean;
  isFlashDeal?: boolean;
  isNew?: boolean;
}

/**
 * Table: Digital_Items (Le stock réel)
 * ├── id (UUID)
 * ├── product_id (Lien vers Products)
 * ├── secret_data (La clé CD, le login:password, ou le lien)
 * ├── is_delivered (true / false)
 * ├── order_id (Lien vers la commande une fois vendu)
 * └── date_added
 */
export interface DigitalItem {
  id: string; // UUID
  product_id: string; // UUID of Products
  secret_data: string; // Clé CD, login:password, lien privé
  is_delivered: boolean;
  order_id: string | null;
  date_added: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedOption?: ProductOption;
  unitPrice: number;
  quantity: number;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  wilaya?: string;
  city?: string;
  address?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  optionLabel?: string;
}

/**
 * Table: Orders
 * ├── id (UUID)
 * ├── customer_email
 * ├── customer_phone
 * ├── currency (DZD, SAR, AED, USD)
 * ├── total_amount
 * ├── payment_method (baridimob, apple_pay, stripe, crypto)
 * ├── payment_proof_url (Capture du reçu BaridiMob si applicable)
 * ├── status (pending_proof, pending_verification, completed, refunded)
 * └── delivered_item_id (Clé envoyée au client)
 */
export interface Order {
  id: string; // UUID
  orderNumber: string; // Human-friendly display code
  customer_email?: string;
  customer_phone?: string;
  currency?: Currency;
  total_amount?: number;
  gateway?: PaymentGatewayId;
  payment_method?: OrderPaymentMethod;
  paymentMethod?: OrderPaymentMethod;
  payment_proof_url?: string;
  status: OrderStatus;
  delivered_item_id?: string | null; // UUID from Digital_Items
  delivered_secret_data?: string | null; // The exact key/account delivered
  cost_price_usd?: number; // Source purchase cost on Plati/GGsel in USD
  net_profit_usd?: number; // Calculated net profit in USD
  createdAt: string;

  // UI helpers
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number; // equal to total_amount
  licenses?: {
    id: string;
    productName: string;
    licenseKey: string;
    platform: string;
    status: string;
    productImage?: string;
  }[];
}

export interface PromoBundle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  originalPrice: number;
  bundlePrice: number;
  discountPercent: number;
  badge: string;
  image: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'manager' | 'editor';
}

export interface Wilaya {
  code: string;
  name: string;
  deliveryFee: number;
}

// ================= ANALYTICS & CRO TYPES =================
export type TrafficSourceId =
  | 'tiktok_ads'
  | 'meta_ads'
  | 'instagram_reels'
  | 'google_ads'
  | 'influencer_affiliate'
  | 'direct';

export interface FunnelVisitRecord {
  id: string;
  timestamp: string;
  funnelSlug: string;
  locale: string;
  source: TrafficSourceId;
  device: 'mobile' | 'desktop';
  converted: boolean;
  orderId?: string;
  bumpAccepted?: boolean;
  upsellAccepted?: boolean;
  revenueUsd?: number;
}

export interface TrafficSourceMetric {
  sourceId: TrafficSourceId;
  label: string;
  channel: string;
  color: string;
  visits: number;
  orders: number;
  conversionRate: number; // in %
  visitToOrderRatio: string; // e.g. "1 : 14.5"
  revenueUsd: number;
  aovUsd: number;
  estimatedAdSpendUsd: number;
  roas: number; // e.g. 4.2x
}

export interface FunnelPerformanceMetric {
  slug: string;
  title: string;
  visits: number;
  orders: number;
  conversionRate: number;
  visitToOrderRatio: string;
  bumpTakeRate: number; // in %
  upsellTakeRate: number; // in %
  revenueUsd: number;
  aovUsd: number;
}

export interface AnalyticsSummary {
  totalVisits: number;
  totalOrders: number;
  conversionRate: number;
  visitToOrderRatio: string;
  totalRevenueUsd: number;
  aovUsd: number;
  bumpTakeRate: number;
  upsellTakeRate: number;
  estimatedRoas: number;
  sources: TrafficSourceMetric[];
  funnels: FunnelPerformanceMetric[];
}

export type FunnelArchitecture = 'direct' | 'longform' | 'flash';
export type FunnelThemePalette = 'cyber_dark' | 'gold_luxury' | 'emerald_clean' | 'custom';
export type FunnelBackgroundPattern = 'tech_grid' | 'radial_glow' | 'clean_minimal';
export type FunnelTargetRegion = 'gulf' | 'dz' | 'intl';
export type FunnelAdPlatform = 'tiktok' | 'meta' | 'search';

export interface CustomFunnelConfig {
  id: string;
  slug: string;
  productId: string;
  title: string;
  hookHeadline: string;
  subheadline: string;
  architecture: FunnelArchitecture;
  themePalette: FunnelThemePalette;
  customColorHex?: string;
  bgPattern: FunnelBackgroundPattern;
  targetRegion: FunnelTargetRegion;
  adPlatform: FunnelAdPlatform;
  priceUsd: number;
  compareAtPriceUsd: number;
  priceDzd: number;
  priceSar: number;
  heroImage: string;
  bullets: string[];
  stockCount: number;
  urgencyMinutes?: number;
  guaranteeText?: string;
  orderBumpEnabled: boolean;
  upsellEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ================= AFFILIATION & CREATOR RECRUITMENT TYPES =================
export interface Affiliate {
  id: string;
  code: string; // unique referral code e.g. "karim", "techalgerie"
  name: string;
  email: string;
  platform: 'tiktok' | 'instagram' | 'telegram' | 'youtube' | 'website' | 'other';
  socialHandle: string;
  payoutMethod: 'baridimob' | 'ccp' | 'bank_transfer' | 'stc_pay' | 'paypal' | 'crypto';
  payoutDetails: string;
  commissionRate: number; // e.g. 0.25 (25%)
  clicks: number;
  salesCount: number;
  totalRevenueUsd: number;
  totalCommissionUsd: number;
  totalCommissionDzd: number;
  totalCommissionSar: number;
  paidCommissionUsd: number;
  status: 'active' | 'pending' | 'suspended';
  lastPayoutDate?: string;
  createdAt: string;
}

export interface AffiliateSale {
  id: string;
  affiliateId: string;
  affiliateCode: string;
  orderId: string;
  orderNumber: string;
  customerName?: string;
  orderTotal: number;
  currency: Currency;
  commissionAmount: number;
  commissionCurrency: Currency;
  commissionUsd: number;
  status: 'pending' | 'approved' | 'paid';
  timestamp: string;
}

// ================= ABANDONED CARTS & RECOVERY =================
export interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  wilaya?: string;
  country: 'dz' | 'sa' | 'ae' | 'intl';
  items: {
    productId: string;
    productTitle: string;
    price: number;
    currency: Currency;
    quantity: number;
  }[];
  totalAmount: number;
  currency: Currency;
  stepAbandoned: 'cart' | 'checkout_details' | 'payment_selection';
  status: 'abandoned' | 'recovered' | 'contacted';
  recoveryCoupon?: string;
  recoveryNote?: string;
  lastContactedAt?: string;
  createdAt: string;
}

// ================= VERIFIED REVIEWS & SOCIAL PROOF =================
export interface VerifiedReview {
  id: string;
  productId?: string;
  productName: string;
  authorName: string;
  country: 'dz' | 'sa' | 'ae' | 'intl';
  countryLabel: string;
  flag: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedMethod: string; // e.g. "Virement BaridiMob vérifié", "Apple Pay 🇸🇦"
  timeAgo: string;
  date: string;
  featured: boolean;
  avatarUrl?: string;
}

// ================= CRM & RETARGETING TYPES =================
export type CrmCustomerTag =
  | 'Acheteur VIP'
  | 'Acheteur 1 produit'
  | 'Lead Newsletter'
  | 'Panier Incomplet';

export interface CrmCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: 'dz' | 'sa' | 'ae' | 'intl';
  countryLabel: string;
  flag: string;
  purchasedProducts: string[];
  totalSpent: number; // In customer's preferred currency
  totalSpentUsd: number; // Converted for unified LTV calculation
  currency: Currency;
  ordersCount: number;
  tag: CrmCustomerTag;
  lastContactDate: string; // ISO string
  createdAt: string;
  source: 'order' | 'newsletter' | 'abandoned_cart' | 'manual';
  notes?: string;
}

export type CrmCampaignChannel = 'email' | 'whatsapp' | 'telegram';
export type CrmCampaignTarget = 'all' | 'specific_product' | 'newsletter_only' | 'vip_only' | 'recent_buyers';

export interface CrmCampaignTemplate {
  id: string;
  name: string;
  description: string;
  defaultSubject: string;
  defaultChannel: CrmCampaignChannel;
  body: string;
  recommendedTag?: CrmCustomerTag;
}

export interface CrmCampaign {
  id: string;
  title: string;
  target: CrmCampaignTarget;
  targetProductName?: string;
  channel: CrmCampaignChannel;
  templateId?: string;
  subject: string;
  messageBody: string;
  promoCode?: string;
  recipientCount: number;
  estimatedOpenRate: number; // Percentage e.g. 72.4
  status: 'sent' | 'draft' | 'scheduled';
  sentAt: string;
}

export interface CrmMetrics {
  totalActiveClients: number;
  newsletterSubscribers: number;
  repeatPurchaseRate: number; // e.g. 24.5 (%)
  averageLtvUsd: number;
  totalLtvUsd: number;
  campaignsSentCount: number;
  averageOpenRate: number;
}


