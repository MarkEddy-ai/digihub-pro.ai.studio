'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  ProductOption,
  CartItem,
  Order,
  OrderStatus,
  CategoryId,
  AdminUser,
  CustomerDetails,
  DeliveryType,
  DigitalItem,
  Currency,
  OrderPaymentMethod,
  PaymentGatewayId,
  PaymentGatewaySettings,
  FunnelVisitRecord,
  AnalyticsSummary,
  TrafficSourceId,
  Affiliate,
  AffiliateSale,
  AbandonedCart,
  VerifiedReview,
  CrmCustomer,
  CrmCampaign,
  CrmMetrics,
  CrmCustomerTag,
  CrmCampaignTarget,
  CrmCampaignChannel,
} from '@/types';
import { INITIAL_PRODUCTS } from '@/data/products';
import { INITIAL_DIGITAL_ITEMS } from '@/data/initialDigitalItems';
import {
  INITIAL_AFFILIATES,
  INITIAL_AFFILIATE_SALES,
  INITIAL_ABANDONED_CARTS,
  INITIAL_VERIFIED_REVIEWS,
} from '@/data/growthMarketingData';
import {
  INITIAL_CRM_CUSTOMERS,
  INITIAL_CRM_CAMPAIGNS,
  CRM_CAMPAIGN_TEMPLATES,
} from '@/data/crmData';
import {
  SUPPORTED_CURRENCIES,
  INITIAL_GATEWAY_SETTINGS,
  formatCurrencyAmount,
  convertCurrency,
  calculateNetMargin,
} from '@/data/paymentGateways';
import {
  STORAGE_KEY_ANALYTICS,
  generateInitialVisits,
  computeAnalyticsSummary,
} from '@/data/analyticsData';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  totalKeysRemaining: number;
  revenueByCurrency: Record<Currency, number>;
  todayRevenueByCurrency: Record<Currency, number>;
  totalRevenueUsdConverted: number;
  todayRevenueUsdConverted: number;
  estimatedNetProfitUsd: number;
}

export interface ProfitMetrics {
  costUsd: number;
  priceUsd: number;
  priceDzd: number;
  priceSar: number;
  priceAed: number;
  priceKwd: number;
  priceQar: number;
  priceBhd: number;
  priceOmr: number;
  marginUsd: number;
  marginPercentUsd: number;
  marginDzdEstimated: number;
  marginPercentDzd: number;
  marginSarEstimated: number;
  marginPercentSar: number;
  isProfitHealthy: boolean;
}

interface ShopContextType {
  // Navigation & Page State
  activeTab: 'home' | 'catalog' | 'product-detail' | 'promotions' | 'about' | 'contact' | 'legal' | 'admin';
  setActiveTab: (tab: 'home' | 'catalog' | 'product-detail' | 'promotions' | 'about' | 'contact' | 'legal' | 'admin') => void;
  selectedProductSlug: string | null;
  openProductPage: (slug: string) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeLegalPage: 'cgv' | 'privacy' | 'refund' | 'delivery' | 'faq';
  openLegalPage: (page: 'cgv' | 'privacy' | 'refund' | 'delivery' | 'faq') => void;

  // Selected Store Currency
  selectedCurrency: Currency;
  setSelectedCurrency: (c: Currency) => void;

  // Products Database (Reactive & Editable by Admin)
  products: Product[];
  addProduct: (productData: Partial<Product>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;
  resetDefaultCatalog: () => void;

  // Digital Vault / Inventory Management (Module 1)
  digitalItems: DigitalItem[];
  addDigitalKeys: (productId: string, rawKeysText: string) => { addedCount: number; totalAvailable: number };
  deleteDigitalKey: (keyId: string) => void;
  getAvailableKeysCount: (productId: string) => number;
  getProductKeys: (productId: string) => DigitalItem[];
  resetDigitalInventory: () => void;

  // Multi-Currency & Profit Margin (Module 2)
  calculateProfitMetrics: (product: Product) => ProfitMetrics;

  // Payment Gateways & Configuration (Multi-Region Module)
  paymentGateways: Record<PaymentGatewayId, PaymentGatewaySettings>;
  updateGatewaySettings: (gatewayId: PaymentGatewayId, settings: Partial<PaymentGatewaySettings>) => void;
  toggleGateway: (gatewayId: PaymentGatewayId) => void;
  exchangeRates: Record<Currency, number>;
  updateExchangeRate: (currency: Currency, rate: number) => void;

  // Orders & Validation Workflow (Module 3 & 4)
  orders: Order[];
  placeOrder: (
    customer: CustomerDetails,
    deliveryFee?: number,
    paymentMethod?: OrderPaymentMethod,
    currency?: Currency,
    gateway?: PaymentGatewayId,
    paymentProofUrl?: string
  ) => Order;
  addUpsellToOrder: (
    orderId: string,
    upsellItem: { title: string; price: number; productId: string; image?: string }
  ) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  submitOrderPaymentProof: (orderId: string, proofUrl: string, transactionRef?: string) => void;
  validateAndDeliverOrder: (orderId: string) => { success: boolean; deliveredKey?: string; message: string };
  rejectOrder: (orderId: string, reason?: string) => void;
  simulateIncomingOrder: (
    type: 'baridimob_manual' | 'stripe_auto' | 'applepay_auto' | 'crypto_auto' | 'tap_mada_auto' | 'tap_knet_auto' | 'paypal_auto',
    productId?: string
  ) => Order;
  latestOrder: Order | null;
  setLatestOrder: (order: Order | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, option?: ProductOption, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  promoCode: string;
  appliedPromo: { code: string; percent: number } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  discountAmount: number;
  finalTotal: number;

  // Admin Auth & Stats
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  adminStats: AdminStats;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isVaultOpen: boolean;
  setIsVaultOpen: (open: boolean) => void;
  isFseSpecsOpen: boolean;
  setIsFseSpecsOpen: (open: boolean) => void;

  // Formatting
  formatPrice: (amount: number, currency?: Currency) => string;

  // Funnel Analytics & CRO
  funnelVisits: FunnelVisitRecord[];
  analyticsSummary: AnalyticsSummary;
  recordFunnelVisit: (
    funnelSlug: string,
    locale?: string,
    source?: TrafficSourceId,
    device?: 'mobile' | 'desktop'
  ) => string;
  recordFunnelConversion: (
    visitId: string,
    orderId: string,
    bumpAccepted: boolean,
    upsellAccepted: boolean,
    revenueUsd: number
  ) => void;
  simulateBatchTraffic: (
    source: TrafficSourceId,
    count?: number,
    funnelSlug?: string
  ) => void;
  resetAnalyticsData: () => void;

  // Affiliation System
  affiliates: Affiliate[];
  affiliateSales: AffiliateSale[];
  activeReferralCode: string | null;
  registerAffiliate: (data: {
    name: string;
    email: string;
    platform: Affiliate['platform'];
    socialHandle: string;
    payoutMethod: Affiliate['payoutMethod'];
    payoutDetails: string;
  }) => Affiliate;
  recordAffiliateClick: (code: string) => void;
  validateAffiliatePayout: (affiliateId: string) => void;
  updateAffiliateCommissionRate: (affiliateId: string, rate: number) => void;
  globalAffiliateCommissionRate: number;
  setGlobalAffiliateCommissionRate: (rate: number) => void;

  // Abandoned Carts & Recovery
  abandonedCarts: AbandonedCart[];
  recordAbandonedCart: (cart: Omit<AbandonedCart, 'id' | 'createdAt' | 'status'>) => void;
  markAbandonedCartContacted: (cartId: string, note?: string) => void;
  deleteAbandonedCart: (cartId: string) => void;

  // Verified Reviews & Social Proof
  verifiedReviews: VerifiedReview[];
  addVerifiedReview: (review: Omit<VerifiedReview, 'id' | 'date'>) => void;
  deleteVerifiedReview: (id: string) => void;
  toggleReviewFeatured: (id: string) => void;

  // CRM & Retargeting System
  crmCustomers: CrmCustomer[];
  crmCampaigns: CrmCampaign[];
  crmMetrics: CrmMetrics;
  subscribeNewsletter: (email: string, firstName?: string) => { success: boolean; message: string };
  addOrUpdateCrmCustomer: (customer: Partial<CrmCustomer> & { email: string }) => void;
  deleteCrmCustomer: (id: string) => void;
  updateCrmCustomerNotes: (id: string, notes: string) => void;
  sendCrmCampaign: (campaign: Omit<CrmCampaign, 'id' | 'sentAt' | 'status'>) => CrmCampaign;
  deleteCrmCampaign: (id: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'novalys_dz_products_v3';
const STORAGE_KEY_DIGITAL_ITEMS = 'novalys_dz_digital_items_v3';
const STORAGE_KEY_ORDERS = 'novalys_dz_orders_v4';
const STORAGE_KEY_ADMIN = 'novalys_dz_admin_auth_v3';
const STORAGE_KEY_GATEWAYS = 'novalys_dz_gateways_v4';
const STORAGE_KEY_RATES = 'novalys_dz_rates_v4';
const STORAGE_KEY_VISITS = 'novalys_dz_funnel_visits_v1';
const STORAGE_KEY_AFFILIATES = 'novalys_affiliates_v2';
const STORAGE_KEY_AFFILIATE_SALES = 'novalys_affiliate_sales_v2';
const STORAGE_KEY_ABANDONED_CARTS = 'novalys_abandoned_carts_v2';
const STORAGE_KEY_REVIEWS = 'novalys_verified_reviews_v2';
const STORAGE_KEY_REF_CODE = 'novalys_ref_code';
const STORAGE_KEY_CRM_CUSTOMERS = 'novalys_crm_customers_v1';
const STORAGE_KEY_CRM_CAMPAIGNS = 'novalys_crm_campaigns_v1';

// Realistic sample initial orders for immediate testing of multi-region and automated vs manual workflows
const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-baridimob-01',
    orderNumber: 'NVX-78210',
    customer_email: 'karim.benali@gmail.com',
    customer_phone: '0550 12 34 56',
    currency: 'DZD',
    total_amount: 7900,
    gateway: 'baridimob',
    payment_method: 'baridimob',
    paymentMethod: 'baridimob',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80',
    status: 'pending_verification',
    delivered_item_id: null,
    delivered_secret_data: null,
    cost_price_usd: 24,
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    customer: {
      firstName: 'Karim',
      lastName: 'Benali',
      phone: '0550 12 34 56',
      email: 'karim.benali@gmail.com',
      wilaya: '16 - Alger',
      city: 'Bab Ezzouar',
      address: 'Cité 5 Juillet, Bâtiment 14',
      notes: 'Virement BaridiMob effectué ce matin, reçu en pièce jointe.',
    },
    items: [
      {
        productId: 'prod-black-myth-wukong',
        productName: 'Black Myth: Wukong - Clé Steam Global',
        productImage: 'https://picsum.photos/seed/black-myth-wukong-game/800/600',
        unitPrice: 7900,
        quantity: 1,
        optionLabel: 'Clé Steam Global',
      },
    ],
    subtotal: 7900,
    deliveryFee: 0,
    discount: 0,
    total: 7900,
  },
  {
    id: 'ord-baridimob-02',
    orderNumber: 'NVX-78209',
    customer_email: 'sofiane.hadj@outlook.com',
    customer_phone: '0770 45 67 89',
    currency: 'DZD',
    total_amount: 3800,
    gateway: 'baridimob',
    payment_method: 'baridimob',
    paymentMethod: 'baridimob',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=900&auto=format&fit=crop&q=80',
    status: 'pending_verification',
    delivered_item_id: null,
    delivered_secret_data: null,
    cost_price_usd: 8.5,
    createdAt: new Date(Date.now() - 3600000 * 3.2).toISOString(),
    customer: {
      firstName: 'Sofiane',
      lastName: 'Hadj',
      phone: '0770 45 67 89',
      email: 'sofiane.hadj@outlook.com',
      wilaya: '25 - Constantine',
      city: 'Ali Mendjeli',
      address: 'UV 14, Résidence El Bahdja',
      notes: 'Reçu BaridiMob envoyé, merci de me livrer rapidement pour le bureau.',
    },
    items: [
      {
        productId: 'prod-office-2024-pro',
        productName: 'Microsoft Office 2024 Professionnel Plus',
        productImage: 'https://picsum.photos/seed/microsoft-office-pro-plus/800/600',
        unitPrice: 3800,
        quantity: 1,
        optionLabel: 'Licence 1 PC - À vie',
      },
    ],
    subtotal: 3800,
    deliveryFee: 0,
    discount: 0,
    total: 3800,
  },
  {
    id: 'ord-stripe-03',
    orderNumber: 'NVX-78205',
    customer_email: 'david.miller@techcorp.io',
    customer_phone: '+1 415 890 2234',
    currency: 'USD',
    total_amount: 18,
    gateway: 'stripe',
    payment_method: 'stripe',
    paymentMethod: 'stripe',
    payment_proof_url: undefined,
    status: 'completed',
    delivered_item_id: 'key-win-001',
    delivered_secret_data: 'W269N-WFGWX-YVC9B-4J6C9-T83GX',
    cost_price_usd: 4.5,
    net_profit_usd: 13.5,
    createdAt: new Date(Date.now() - 3600000 * 5.0).toISOString(),
    customer: {
      firstName: 'David',
      lastName: 'Miller',
      phone: '+1 415 890 2234',
      email: 'david.miller@techcorp.io',
      city: 'San Francisco',
    },
    items: [
      {
        productId: 'prod-windows-11-pro',
        productName: 'Windows 11 Professionnel - Clé Officielle OEM/Retail',
        productImage: 'https://picsum.photos/seed/windows-11-pro-system/800/600',
        unitPrice: 18,
        quantity: 1,
        optionLabel: 'Clé OEM (1 PC) - À vie',
      },
    ],
    subtotal: 18,
    deliveryFee: 0,
    discount: 0,
    total: 18,
  },
  {
    id: 'ord-tap-mada-04',
    orderNumber: 'NVX-78201',
    customer_email: 'faisal.alotaibi@riyadh.sa',
    customer_phone: '+966 50 123 9988',
    currency: 'SAR',
    total_amount: 88,
    gateway: 'tap_payments',
    payment_method: 'mada',
    paymentMethod: 'mada',
    payment_proof_url: undefined,
    status: 'completed',
    delivered_item_id: 'key-xb-001',
    delivered_secret_data: 'XBOX-ULT-4M99-KLP8-9921-ZZ88',
    cost_price_usd: 12,
    net_profit_usd: 11.47,
    createdAt: new Date(Date.now() - 3600000 * 8.5).toISOString(),
    customer: {
      firstName: 'Faisal',
      lastName: 'Al-Otaibi',
      phone: '+966 50 123 9988',
      email: 'faisal.alotaibi@riyadh.sa',
      city: 'Riyadh',
    },
    items: [
      {
        productId: 'prod-xbox-game-pass',
        productName: 'Xbox Game Pass Ultimate - PC & Console',
        productImage: 'https://picsum.photos/seed/xbox-game-pass-gaming/800/600',
        unitPrice: 88,
        quantity: 1,
        optionLabel: '1 Mois Ultimate',
      },
    ],
    subtotal: 88,
    deliveryFee: 0,
    discount: 0,
    total: 88,
  },
  {
    id: 'ord-tap-knet-05',
    orderNumber: 'NVX-78198',
    customer_email: 'salem.kuwait@gmail.com',
    customer_phone: '+965 99 88 7766',
    currency: 'KWD',
    total_amount: 7.7,
    gateway: 'tap_payments',
    payment_method: 'knet',
    paymentMethod: 'knet',
    payment_proof_url: undefined,
    status: 'completed',
    delivered_item_id: 'key-gpt-001',
    delivered_secret_data: 'openai_account_vip1@fastmail.com:TempPass2026!# (Auth Token: sk-proj-9921xx882)',
    cost_price_usd: 14,
    net_profit_usd: 11.0,
    createdAt: new Date(Date.now() - 3600000 * 11.0).toISOString(),
    customer: {
      firstName: 'Salem',
      lastName: 'Al-Mutawa',
      phone: '+965 99 88 7766',
      email: 'salem.kuwait@gmail.com',
      city: 'Kuwait City',
    },
    items: [
      {
        productId: 'prod-chatgpt-plus',
        productName: 'ChatGPT Plus & Team (OpenAI)',
        productImage: 'https://picsum.photos/seed/chatgpt-ai-plus/800/600',
        unitPrice: 7.7,
        quantity: 1,
        optionLabel: '1 Mois - Accès Privé',
      },
    ],
    subtotal: 7.7,
    deliveryFee: 0,
    discount: 0,
    total: 7.7,
  },
  {
    id: 'ord-paypal-06',
    orderNumber: 'NVX-78195',
    customer_email: 'jean.dupont@laposte.net',
    customer_phone: '+33 6 12 34 56 78',
    currency: 'USD',
    total_amount: 35,
    gateway: 'paypal',
    payment_method: 'paypal',
    paymentMethod: 'paypal',
    payment_proof_url: undefined,
    status: 'completed',
    delivered_item_id: 'key-ea-001',
    delivered_secret_data: 'FC25-ORIG-99XX-AA88-1122-GG77',
    cost_price_usd: 21,
    net_profit_usd: 14.0,
    createdAt: new Date(Date.now() - 3600000 * 14.0).toISOString(),
    customer: {
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+33 6 12 34 56 78',
      email: 'jean.dupont@laposte.net',
      city: 'Paris',
    },
    items: [
      {
        productId: 'prod-ea-sports-fc-25',
        productName: 'EA SPORTS FC 25 - Clé EA App / Origin Global',
        productImage: 'https://picsum.photos/seed/ea-sports-fc-25-football/800/600',
        unitPrice: 35,
        quantity: 1,
        optionLabel: 'Clé EA App Global',
      },
    ],
    subtotal: 35,
    deliveryFee: 0,
    discount: 0,
    total: 35,
  },
  {
    id: 'ord-refunded-07',
    orderNumber: 'NVX-78180',
    customer_email: 'fake.payment@mail.dz',
    customer_phone: '0662 00 11 22',
    currency: 'DZD',
    total_amount: 7900,
    gateway: 'baridimob',
    payment_method: 'baridimob',
    paymentMethod: 'baridimob',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80',
    status: 'refunded',
    delivered_item_id: null,
    delivered_secret_data: null,
    cost_price_usd: 24,
    createdAt: new Date(Date.now() - 3600000 * 24.0).toISOString(),
    customer: {
      firstName: 'Anis',
      lastName: 'Mansour',
      phone: '0662 00 11 22',
      email: 'fake.payment@mail.dz',
      wilaya: '06 - Béjaïa',
      city: 'Béjaïa',
      notes: 'Reçu rejeté car le numéro de transaction ne correspondait pas.',
    },
    items: [
      {
        productId: 'prod-black-myth-wukong',
        productName: 'Black Myth: Wukong - Clé Steam Global',
        productImage: 'https://picsum.photos/seed/black-myth-wukong-game/800/600',
        unitPrice: 7900,
        quantity: 1,
      },
    ],
    subtotal: 7900,
    deliveryFee: 0,
    discount: 0,
    total: 7900,
  },
];

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'product-detail' | 'promotions' | 'about' | 'contact' | 'legal' | 'admin'>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLegalPage, setActiveLegalPage] = useState<'cgv' | 'privacy' | 'refund' | 'delivery' | 'faq'>('cgv');

  // Digital Items (The physical key stock) with persistence
  const [digitalItems, setDigitalItems] = useState<DigitalItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_DIGITAL_ITEMS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_DIGITAL_ITEMS;
  });

  // Products Database with LocalStorage persistence
  const [rawProducts, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders with LocalStorage persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return SAMPLE_INITIAL_ORDERS;
  });

  // Admin authentication state with persistence
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ADMIN);
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');

  // Selected Store Currency
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('DZD');

  // Multi-Region Payment Gateways Configuration
  const [paymentGateways, setPaymentGateways] = useState<Record<PaymentGatewayId, PaymentGatewaySettings>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_GATEWAYS);
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_GATEWAY_SETTINGS;
  });

  // Reference Exchange Rates (relative to 1 USD)
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_RATES);
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      USD: 1.0,
      DZD: 230.0,
      SAR: 3.75,
      AED: 3.67,
      KWD: 0.308,
      QAR: 3.64,
      BHD: 0.377,
      OMR: 0.385,
    };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isFseSpecsOpen, setIsFseSpecsOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Funnel Analytics Visits state
  const [funnelVisits, setFunnelVisits] = useState<FunnelVisitRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_VISITS);
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return generateInitialVisits();
  });

  // Affiliates State
  const [affiliates, setAffiliates] = useState<Affiliate[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_AFFILIATES);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AFFILIATES;
  });

  const [affiliateSales, setAffiliateSales] = useState<AffiliateSale[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_AFFILIATE_SALES);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AFFILIATE_SALES;
  });

  const [activeReferralCode, setActiveReferralCode] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref') || urlParams.get('aff');
        if (ref) {
          const cleanRef = ref.toLowerCase().trim();
          localStorage.setItem(STORAGE_KEY_REF_CODE, cleanRef);
          return cleanRef;
        }
        return localStorage.getItem(STORAGE_KEY_REF_CODE) || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [globalAffiliateCommissionRate, setGlobalAffiliateCommissionRate] = useState<number>(0.25);

  // Abandoned Carts State
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ABANDONED_CARTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ABANDONED_CARTS;
  });

  // Verified Reviews State
  const [verifiedReviews, setVerifiedReviews] = useState<VerifiedReview[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VERIFIED_REVIEWS;
  });

  // CRM Contacts & Customers State
  const [crmCustomers, setCrmCustomers] = useState<CrmCustomer[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CRM_CUSTOMERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CRM_CUSTOMERS;
  });

  // CRM Marketing Campaigns State
  const [crmCampaigns, setCrmCampaigns] = useState<CrmCampaign[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CRM_CAMPAIGNS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CRM_CAMPAIGNS;
  });

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Sync visits to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VISITS, JSON.stringify(funnelVisits));
    } catch {
      // ignore
    }
  }, [funnelVisits]);

  // Compute live analytics summary
  const analyticsSummary = useMemo(() => {
    return computeAnalyticsSummary(funnelVisits);
  }, [funnelVisits]);

  const recordFunnelVisit = useCallback(
    (funnelSlug: string, locale = 'dz', source: TrafficSourceId = 'tiktok_ads', device: 'mobile' | 'desktop' = 'mobile'): string => {
      const visitId = `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newRecord: FunnelVisitRecord = {
        id: visitId,
        timestamp: new Date().toISOString(),
        funnelSlug,
        locale,
        source,
        device,
        converted: false,
      };
      setFunnelVisits((prev) => [newRecord, ...prev]);
      return visitId;
    },
    []
  );

  const recordFunnelConversion = useCallback(
    (visitId: string, orderId: string, bumpAccepted: boolean, upsellAccepted: boolean, revenueUsd: number) => {
      setFunnelVisits((prev) =>
        prev.map((v) =>
          v.id === visitId || (!visitId && v.orderId === undefined && !v.converted)
            ? {
                ...v,
                converted: true,
                orderId,
                bumpAccepted,
                upsellAccepted,
                revenueUsd,
              }
            : v
        )
      );
    },
    []
  );

  const simulateBatchTraffic = useCallback(
    (source: TrafficSourceId, count = 25, funnelSlug = 'windows-11-pro-retail') => {
      const newBatch: FunnelVisitRecord[] = [];
      const now = Date.now();
      const locales = ['dz', 'dz', 'sa', 'sa', 'ae', 'intl'];

      for (let i = 0; i < count; i++) {
        const loc = locales[Math.floor(Math.random() * locales.length)];
        const isConverted = Math.random() < 0.095; // ~9.5% conversion rate
        const bump = isConverted ? Math.random() < 0.44 : false;
        const upsell = isConverted ? Math.random() < 0.32 : false;
        let rev = funnelSlug.includes('windows') ? 14.99 : funnelSlug.includes('chatgpt') ? 12.99 : 24.99;
        if (bump) rev += 1.99;
        if (upsell) rev += 9.99;

        newBatch.push({
          id: `vis-sim-${Date.now()}-${i}`,
          timestamp: new Date(now - Math.floor(Math.random() * 3600000)).toISOString(),
          funnelSlug,
          locale: loc,
          source,
          device: source === 'tiktok_ads' ? 'mobile' : Math.random() > 0.3 ? 'mobile' : 'desktop',
          converted: isConverted,
          orderId: isConverted ? `ord-sim-${Date.now()}-${i}` : undefined,
          bumpAccepted: bump,
          upsellAccepted: upsell,
          revenueUsd: isConverted ? Math.round(rev * 100) / 100 : 0,
        });
      }

      setFunnelVisits((prev) => [...newBatch, ...prev]);
      const convCount = newBatch.filter((b) => b.converted).length;
      showToast(
        `Batch simulé : +${count} visites depuis ${source.toUpperCase()} (${convCount} commandes générées) !`,
        'success'
      );
    },
    [showToast]
  );

  const resetAnalyticsData = useCallback(() => {
    const fresh = generateInitialVisits();
    setFunnelVisits(fresh);
    showToast('Données analytiques et historiques des tunnels réinitialisés.', 'info');
  }, [showToast]);

  // Sync Affiliates to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AFFILIATES, JSON.stringify(affiliates));
    } catch {}
  }, [affiliates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AFFILIATE_SALES, JSON.stringify(affiliateSales));
    } catch {}
  }, [affiliateSales]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ABANDONED_CARTS, JSON.stringify(abandonedCarts));
    } catch {}
  }, [abandonedCarts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(verifiedReviews));
    } catch {}
  }, [verifiedReviews]);

  // Increment clicks for active referral code once on session start
  useEffect(() => {
    if (!activeReferralCode) return;
    const timer = setTimeout(() => {
      setAffiliates((prev) =>
        prev.map((a) =>
          a.code.toLowerCase() === activeReferralCode.toLowerCase()
            ? { ...a, clicks: a.clicks + 1 }
            : a
        )
      );
    }, 150);
    return () => clearTimeout(timer);
  }, [activeReferralCode]);

  // Affiliates methods
  const registerAffiliate = useCallback(
    (data: {
      name: string;
      email: string;
      platform: Affiliate['platform'];
      socialHandle: string;
      payoutMethod: Affiliate['payoutMethod'];
      payoutDetails: string;
    }): Affiliate => {
      const baseCode = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
      const code = baseCode || `aff${Math.floor(1000 + Math.random() * 9000)}`;

      const newAff: Affiliate = {
        id: `aff-${Date.now()}`,
        code,
        name: data.name.trim(),
        email: data.email.trim(),
        platform: data.platform,
        socialHandle: data.socialHandle.trim(),
        payoutMethod: data.payoutMethod,
        payoutDetails: data.payoutDetails.trim(),
        commissionRate: globalAffiliateCommissionRate,
        clicks: 0,
        salesCount: 0,
        totalRevenueUsd: 0,
        totalCommissionUsd: 0,
        totalCommissionDzd: 0,
        totalCommissionSar: 0,
        paidCommissionUsd: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      setAffiliates((prev) => [newAff, ...prev]);
      showToast(`Compte affilié activé ! Votre code unique : "${code}"`, 'success');
      return newAff;
    },
    [globalAffiliateCommissionRate, showToast]
  );

  const recordAffiliateClick = useCallback((code: string) => {
    setAffiliates((prev) =>
      prev.map((a) =>
        a.code.toLowerCase() === code.toLowerCase() ? { ...a, clicks: a.clicks + 1 } : a
      )
    );
  }, []);

  const validateAffiliatePayout = useCallback(
    (affiliateId: string) => {
      setAffiliates((prev) =>
        prev.map((aff) =>
          aff.id === affiliateId
            ? {
                ...aff,
                paidCommissionUsd: aff.totalCommissionUsd,
                lastPayoutDate: new Date().toISOString(),
              }
            : aff
        )
      );
      setAffiliateSales((prev) =>
        prev.map((sale) =>
          sale.affiliateId === affiliateId ? { ...sale, status: 'paid' } : sale
        )
      );
      showToast('Paiement de commission validé et enregistré !', 'success');
    },
    [showToast]
  );

  const updateAffiliateCommissionRate = useCallback(
    (affiliateId: string, rate: number) => {
      setAffiliates((prev) =>
        prev.map((aff) => (aff.id === affiliateId ? { ...aff, commissionRate: rate } : aff))
      );
      showToast(`Taux de commission mis à jour à ${Math.round(rate * 100)}%`, 'info');
    },
    [showToast]
  );

  // Abandoned Carts methods
  const recordAbandonedCart = useCallback(
    (cartData: Omit<AbandonedCart, 'id' | 'createdAt' | 'status'>) => {
      const newCart: AbandonedCart = {
        ...cartData,
        id: `ab-cart-${Date.now()}`,
        status: 'abandoned',
        createdAt: new Date().toISOString(),
      };
      setAbandonedCarts((prev) => [newCart, ...prev]);
    },
    []
  );

  const markAbandonedCartContacted = useCallback(
    (cartId: string, note?: string) => {
      setAbandonedCarts((prev) =>
        prev.map((c) =>
          c.id === cartId
            ? {
                ...c,
                status: 'contacted',
                recoveryNote: note || 'Relancé avec coupon de réduction -10%',
                recoveryCoupon: 'REPRISE10',
                lastContactedAt: new Date().toISOString(),
              }
            : c
        )
      );
      showToast('Panier marqué comme relancé !', 'success');
    },
    [showToast]
  );

  const deleteAbandonedCart = useCallback(
    (cartId: string) => {
      setAbandonedCarts((prev) => prev.filter((c) => c.id !== cartId));
      showToast('Panier abandonné supprimé.', 'info');
    },
    [showToast]
  );

  // Verified Reviews methods
  const addVerifiedReview = useCallback(
    (reviewData: Omit<VerifiedReview, 'id' | 'date'>) => {
      const newReview: VerifiedReview = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
      };
      setVerifiedReviews((prev) => [newReview, ...prev]);
      showToast('Témoignage certifié ajouté avec succès !', 'success');
    },
    [showToast]
  );

  const deleteVerifiedReview = useCallback(
    (id: string) => {
      setVerifiedReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('Avis supprimé.', 'info');
    },
    [showToast]
  );

  const toggleReviewFeatured = useCallback((id: string) => {
    setVerifiedReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r))
    );
  }, []);

  // Sync CRM contacts to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CRM_CUSTOMERS, JSON.stringify(crmCustomers));
    } catch {
      // ignore
    }
  }, [crmCustomers]);

  // Sync CRM campaigns to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CRM_CAMPAIGNS, JSON.stringify(crmCampaigns));
    } catch {
      // ignore
    }
  }, [crmCampaigns]);

  // CRM Analytics and Metrics Calculation
  const crmMetrics = useMemo((): CrmMetrics => {
    const activeClients = crmCustomers.filter(
      (c) => c.ordersCount > 0 || c.tag === 'Acheteur VIP' || c.tag === 'Acheteur 1 produit'
    );
    const repeatBuyers = activeClients.filter((c) => c.ordersCount >= 2 || c.tag === 'Acheteur VIP');
    const newsletterSubscribers = crmCustomers.filter(
      (c) => c.tag === 'Lead Newsletter' || c.source === 'newsletter'
    );
    const totalActiveClients = activeClients.length;
    const repeatPurchaseRate =
      totalActiveClients > 0
        ? Math.round((repeatBuyers.length / totalActiveClients) * 1000) / 10
        : 0;
    const totalLtvUsd =
      Math.round(crmCustomers.reduce((acc, c) => acc + (c.totalSpentUsd || 0), 0) * 100) / 100;
    const averageLtvUsd =
      totalActiveClients > 0 ? Math.round((totalLtvUsd / totalActiveClients) * 100) / 100 : 0;
    const sentCampaigns = crmCampaigns.filter((c) => c.status === 'sent');
    const averageOpenRate =
      sentCampaigns.length > 0
        ? Math.round(
            (sentCampaigns.reduce((acc, c) => acc + (c.estimatedOpenRate || 70), 0) /
              sentCampaigns.length) *
              10
          ) / 10
        : 72.4;

    return {
      totalActiveClients,
      newsletterSubscribers: newsletterSubscribers.length,
      repeatPurchaseRate,
      averageLtvUsd,
      totalLtvUsd,
      campaignsSentCount: sentCampaigns.length,
      averageOpenRate,
    };
  }, [crmCustomers, crmCampaigns]);

  // Newsletter Subscription from Showcase or Landing Pages
  const subscribeNewsletter = useCallback(
    (email: string, firstName?: string): { success: boolean; message: string } => {
      if (!email || !email.includes('@')) {
        showToast('Veuillez saisir une adresse email valide.', 'error');
        return { success: false, message: 'Adresse email invalide' };
      }

      const cleanEmail = email.trim().toLowerCase();
      const customerName = firstName?.trim() || cleanEmail.split('@')[0];
      const countryCode =
        selectedCurrency === 'DZD' ? 'dz' : selectedCurrency === 'SAR' ? 'sa' : selectedCurrency === 'AED' ? 'ae' : 'intl';
      const countryLabel =
        selectedCurrency === 'DZD' ? 'Algérie' : selectedCurrency === 'SAR' ? 'Arabie Saoudite' : selectedCurrency === 'AED' ? 'Émirats' : 'International';
      const flag =
        selectedCurrency === 'DZD' ? '🇩🇿' : selectedCurrency === 'SAR' ? '🇸🇦' : selectedCurrency === 'AED' ? '🇦🇪' : '🌐';

      let isNewLead = false;

      setCrmCustomers((prev) => {
        const existing = prev.find((c) => c.email.toLowerCase() === cleanEmail);
        if (existing) {
          // If already exists, keep tag (don't downgrade buyers) but update contact date
          return prev.map((c) =>
            c.email.toLowerCase() === cleanEmail
              ? { ...c, lastContactDate: new Date().toISOString() }
              : c
          );
        }

        isNewLead = true;
        const newLead: CrmCustomer = {
          id: `crm-${Date.now()}`,
          name: customerName,
          email: cleanEmail,
          country: countryCode,
          countryLabel,
          flag,
          purchasedProducts: [],
          totalSpent: 0,
          totalSpentUsd: 0,
          currency: selectedCurrency,
          ordersCount: 0,
          tag: 'Lead Newsletter',
          lastContactDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          source: 'newsletter',
          notes: 'Inscrit via le formulaire Cercle Privilégié / Newsletter.',
        };

        return [newLead, ...prev];
      });

      try {
        confetti({
          particleCount: 85,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6'],
        });
      } catch {
        // fallback
      }

      const successMsg =
        'Merci ! Vous êtes bien inscrit(e). Votre code de bienvenue -10% arrive par email.';
      showToast(successMsg, 'success');
      return { success: true, message: successMsg };
    },
    [selectedCurrency, showToast]
  );

  // Manual CRM Customer Upsert
  const addOrUpdateCrmCustomer = useCallback(
    (customerData: Partial<CrmCustomer> & { email: string }) => {
      const cleanEmail = customerData.email.trim().toLowerCase();
      setCrmCustomers((prev) => {
        const idx = prev.findIndex((c) => c.email.toLowerCase() === cleanEmail);
        if (idx >= 0) {
          const updated = { ...prev[idx], ...customerData };
          const clone = [...prev];
          clone[idx] = updated;
          return clone;
        }
        const newCust: CrmCustomer = {
          id: `crm-${Date.now()}`,
          name: customerData.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: customerData.phone,
          country: customerData.country || 'dz',
          countryLabel: customerData.countryLabel || 'Algérie',
          flag: customerData.flag || '🇩🇿',
          purchasedProducts: customerData.purchasedProducts || [],
          totalSpent: customerData.totalSpent || 0,
          totalSpentUsd: customerData.totalSpentUsd || 0,
          currency: customerData.currency || 'DZD',
          ordersCount: customerData.ordersCount || 0,
          tag: customerData.tag || 'Lead Newsletter',
          lastContactDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          source: customerData.source || 'manual',
          notes: customerData.notes,
        };
        return [newCust, ...prev];
      });
      showToast(`Contact ${cleanEmail} mis à jour dans le CRM.`, 'success');
    },
    [showToast]
  );

  const deleteCrmCustomer = useCallback(
    (id: string) => {
      setCrmCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast('Contact supprimé du CRM.', 'info');
    },
    [showToast]
  );

  const updateCrmCustomerNotes = useCallback(
    (id: string, notes: string) => {
      setCrmCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, notes, lastContactDate: new Date().toISOString() } : c))
      );
      showToast('Notes du client mises à jour.', 'success');
    },
    [showToast]
  );

  // Send Marketing Campaign
  const sendCrmCampaign = useCallback(
    (campaignData: Omit<CrmCampaign, 'id' | 'sentAt' | 'status'>): CrmCampaign => {
      const newCampaign: CrmCampaign = {
        ...campaignData,
        id: `cmp-${Date.now()}`,
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      setCrmCampaigns((prev) => [newCampaign, ...prev]);

      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b'],
        });
      } catch {
        // ignore
      }

      showToast(
        `Campagne "${newCampaign.title}" envoyée avec succès à ${newCampaign.recipientCount} destinataires !`,
        'success'
      );
      return newCampaign;
    },
    [showToast]
  );

  const deleteCrmCampaign = useCallback(
    (id: string) => {
      setCrmCampaigns((prev) => prev.filter((c) => c.id !== id));
      showToast('Campagne supprimée.', 'info');
    },
    [showToast]
  );

  // Sync payment gateways to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GATEWAYS, JSON.stringify(paymentGateways));
    } catch {
      // ignore
    }
  }, [paymentGateways]);

  // Sync exchange rates to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(exchangeRates));
    } catch {
      // ignore
    }
  }, [exchangeRates]);

  const updateGatewaySettings = useCallback((gatewayId: PaymentGatewayId, settings: Partial<PaymentGatewaySettings>) => {
    setPaymentGateways((prev) => {
      const current = prev[gatewayId];
      if (!current) return prev;
      return {
        ...prev,
        [gatewayId]: {
          ...current,
          ...settings,
          credentials: {
            ...current.credentials,
            ...(settings.credentials || {}),
          },
        },
      };
    });
    showToast(`Configuration de la passerelle "${gatewayId.toUpperCase()}" enregistrée !`, 'success');
  }, []);

  const toggleGateway = useCallback((gatewayId: PaymentGatewayId) => {
    setPaymentGateways((prev) => {
      const current = prev[gatewayId];
      if (!current) return prev;
      const updated = { ...current, enabled: !current.enabled };
      showToast(`Passerelle ${current.name} ${updated.enabled ? 'activée' : 'désactivée'}.`, 'info');
      return { ...prev, [gatewayId]: updated };
    });
  }, []);

  const updateExchangeRate = useCallback((currency: Currency, rate: number) => {
    if (rate <= 0) return;
    setExchangeRates((prev) => ({ ...prev, [currency]: rate }));
    showToast(`Taux de change pour ${currency} mis à jour : 1 USD = ${rate} ${currency}`, 'info');
  }, []);

  // Sync digital items to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DIGITAL_ITEMS, JSON.stringify(digitalItems));
    } catch {
      // ignore
    }
  }, [digitalItems]);

  // Dynamically compute product stockCount based on unassigned keys in Digital_Items
  const products = useMemo(() => {
    return rawProducts.map((prod) => {
      const availableKeys = digitalItems.filter(
        (item) => item.product_id === prod.id && !item.is_delivered
      ).length;
      return {
        ...prod,
        stockCount: availableKeys,
        inStock: availableKeys > 0,
      };
    });
  }, [rawProducts, digitalItems]);

  // Sync products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(rawProducts));
    } catch {
      // ignore
    }
  }, [rawProducts]);

  // Sync orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Sync admin auth to LocalStorage
  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_ADMIN);
      }
    } catch {
      // ignore
    }
  }, [adminUser]);

  const openProductPage = (slug: string) => {
    setSelectedProductSlug(slug);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLegalPage = (page: 'cgv' | 'privacy' | 'refund' | 'delivery' | 'faq') => {
    setActiveLegalPage(page);
    setActiveTab('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Module 1: Vault / Digital Inventory Management
  const getAvailableKeysCount = useCallback((productId: string): number => {
    return digitalItems.filter((i) => i.product_id === productId && !i.is_delivered).length;
  }, [digitalItems]);

  const getProductKeys = useCallback((productId: string): DigitalItem[] => {
    return digitalItems.filter((i) => i.product_id === productId);
  }, [digitalItems]);

  const addDigitalKeys = (productId: string, rawKeysText: string): { addedCount: number; totalAvailable: number } => {
    const lines = rawKeysText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      showToast('Aucune clé valide détectée dans le texte.', 'warning');
      return { addedCount: 0, totalAvailable: getAvailableKeysCount(productId) };
    }

    const now = new Date().toISOString();
    const newItems: DigitalItem[] = lines.map((keyText, idx) => ({
      id: `key-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      product_id: productId,
      secret_data: keyText,
      is_delivered: false,
      order_id: null,
      date_added: now,
    }));

    setDigitalItems((prev) => [...newItems, ...prev]);

    const targetProduct = products.find((p) => p.id === productId);
    const updatedCount = getAvailableKeysCount(productId) + lines.length;

    showToast(
      `${lines.length} clé(s) ajoutée(s) avec succès pour "${targetProduct?.title || targetProduct?.name || 'Produit'}" ! Stock total : ${updatedCount}`,
      'success'
    );

    return { addedCount: lines.length, totalAvailable: updatedCount };
  };

  const deleteDigitalKey = (keyId: string) => {
    const target = digitalItems.find((k) => k.id === keyId);
    if (!target) return;
    if (target.is_delivered) {
      showToast('Impossible de supprimer une clé déjà délivrée à un client.', 'error');
      return;
    }
    setDigitalItems((prev) => prev.filter((k) => k.id !== keyId));
    showToast('Clé supprimée du coffre avec succès.', 'info');
  };

  const resetDigitalInventory = () => {
    setDigitalItems(INITIAL_DIGITAL_ITEMS);
    showToast('Stock de clés réinitialisé avec les données de démonstration.', 'info');
  };

  // Module 2: Profit Margin Calculator
  const calculateProfitMetrics = useCallback((product: Product): ProfitMetrics => {
    const costUsd = product.cost_price_usd || 0;
    const rateDzd = exchangeRates.DZD || 230;
    const rateSar = exchangeRates.SAR || 3.75;
    const rateAed = exchangeRates.AED || 3.67;
    const rateKwd = exchangeRates.KWD || 0.308;
    const rateQar = exchangeRates.QAR || 3.64;
    const rateBhd = exchangeRates.BHD || 0.377;
    const rateOmr = exchangeRates.OMR || 0.385;

    const priceUsd = product.price_usd || (product.price_dzd ? Math.round((product.price_dzd / rateDzd) * 10) / 10 : 0);
    const priceDzd = product.price_dzd || product.price || Math.round(priceUsd * rateDzd);
    const priceSar = product.price_sar || Math.round(priceUsd * rateSar * 10) / 10;
    const priceAed = product.price_aed || Math.round(priceUsd * rateAed * 10) / 10;
    const priceKwd = product.price_kwd || Math.round(priceUsd * rateKwd * 100) / 100;
    const priceQar = product.price_qar || Math.round(priceUsd * rateQar * 10) / 10;
    const priceBhd = product.price_bhd || Math.round(priceUsd * rateBhd * 100) / 100;
    const priceOmr = product.price_omr || Math.round(priceUsd * rateOmr * 100) / 100;

    // Margins
    const marginUsd = Math.round((priceUsd - costUsd) * 100) / 100;
    const marginPercentUsd = priceUsd > 0 ? Math.round((marginUsd / priceUsd) * 100) : 0;

    // Converted cost in DZD (Parallel rate ~ 230 DZD/USD for gaming keys imported via crypto/binance)
    const costDzdEstimated = Math.round(costUsd * rateDzd);
    const marginDzdEstimated = priceDzd - costDzdEstimated;
    const marginPercentDzd = priceDzd > 0 ? Math.round((marginDzdEstimated / priceDzd) * 100) : 0;

    // Converted cost in SAR (1 USD = 3.75 SAR)
    const costSarEstimated = Math.round(costUsd * rateSar * 10) / 10;
    const marginSarEstimated = Math.round((priceSar - costSarEstimated) * 10) / 10;
    const marginPercentSar = priceSar > 0 ? Math.round((marginSarEstimated / priceSar) * 100) : 0;

    const isProfitHealthy = marginPercentUsd >= 15 && marginUsd > 0;

    return {
      costUsd,
      priceUsd,
      priceDzd,
      priceSar,
      priceAed,
      priceKwd,
      priceQar,
      priceBhd,
      priceOmr,
      marginUsd,
      marginPercentUsd,
      marginDzdEstimated,
      marginPercentDzd,
      marginSarEstimated,
      marginPercentSar,
      isProfitHealthy,
    };
  }, [exchangeRates]);

  // Module 3: Validation and Delivery Workflow
  const validateAndDeliverOrder = (orderId: string): { success: boolean; deliveredKey?: string; message: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      showToast('Commande introuvable.', 'error');
      return { success: false, message: 'Commande introuvable' };
    }

    if (order.status === 'completed') {
      showToast('Cette commande est déjà validée et livrée.', 'info');
      return { success: true, deliveredKey: order.delivered_secret_data || undefined, message: 'Déjà livrée' };
    }

    // Determine targeted product
    const primaryItem = order.items && order.items[0];
    const targetProductId = primaryItem?.productId;

    if (!targetProductId) {
      showToast('Aucun article trouvé dans cette commande.', 'error');
      return { success: false, message: 'Article manquant' };
    }

    // Search for an available key
    const availableKey = digitalItems.find((k) => k.product_id === targetProductId && !k.is_delivered);

    if (!availableKey) {
      showToast(
        `STOCK ÉPUISÉ pour "${primaryItem?.productName}". Ajoutez des clés dans le Coffre avant de valider !`,
        'error'
      );
      return {
        success: false,
        message: 'Stock insuffisant dans le coffre. Veuillez insérer de nouvelles clés.',
      };
    }

    // Mark key as delivered
    setDigitalItems((prev) =>
      prev.map((k) =>
        k.id === availableKey.id ? { ...k, is_delivered: true, order_id: orderId } : k
      )
    );

    // Update order status to completed and attach key
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'completed',
              delivered_item_id: availableKey.id,
              delivered_secret_data: availableKey.secret_data,
            }
          : ord
      )
    );

    // Celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'],
      });
    } catch {
      // fallback
    }

    showToast(`Commande ${order.orderNumber} validée et clé délivrée avec succès !`, 'success');

    return {
      success: true,
      deliveredKey: availableKey.secret_data,
      message: 'Commande validée et clé délivrée',
    };
  };

  const rejectOrder = (orderId: string, reason = 'Reçu BaridiMob non valide') => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'refunded',
              customer: {
                ...ord.customer,
                notes: `${ord.customer.notes ? ord.customer.notes + ' | ' : ''}Rejeté : ${reason}`,
              },
            }
          : ord
      )
    );
    showToast(`Commande rejetée. Statut passé à "Annulée / Refusée".`, 'info');
  };

  // Simulate an incoming order for live testing
  const simulateIncomingOrder = (
    type: 'baridimob_manual' | 'stripe_auto' | 'applepay_auto' | 'crypto_auto' | 'tap_mada_auto' | 'tap_knet_auto' | 'paypal_auto',
    productId = 'prod-black-myth-wukong'
  ): Order => {
    const targetProduct = products.find((p) => p.id === productId) || products[0];
    const orderNumber = `NVX-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord-${Date.now()}`;

    if (type === 'baridimob_manual') {
      const newOrder: Order = {
        id: orderId,
        orderNumber,
        customer_email: 'client.test@baridimob.dz',
        customer_phone: '0555 ' + Math.floor(100000 + Math.random() * 900000),
        currency: 'DZD',
        total_amount: targetProduct.price_dzd || targetProduct.price || 3500,
        gateway: 'baridimob',
        payment_method: 'baridimob',
        paymentMethod: 'baridimob',
        payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80',
        status: 'pending_verification',
        delivered_item_id: null,
        delivered_secret_data: null,
        cost_price_usd: targetProduct.cost_price_usd || 15,
        createdAt: new Date().toISOString(),
        customer: {
          firstName: 'Mohamed',
          lastName: 'Larbi',
          phone: '0555 99 88 77',
          email: 'client.test@baridimob.dz',
          wilaya: '16 - Alger',
          city: 'Kouba',
          notes: 'Virement effectué via BaridiMob. Clé attendue après validation du reçu.',
        },
        items: [
          {
            productId: targetProduct.id,
            productName: targetProduct.title || targetProduct.name,
            productImage: targetProduct.image,
            unitPrice: targetProduct.price_dzd || targetProduct.price || 3500,
            quantity: 1,
            optionLabel: 'Version Digitale',
          },
        ],
        subtotal: targetProduct.price_dzd || targetProduct.price || 3500,
        deliveryFee: 0,
        discount: 0,
        total: targetProduct.price_dzd || targetProduct.price || 3500,
      };

      setOrders((prev) => [newOrder, ...prev]);
      showToast(`Nouvelle commande BaridiMob reçue (${newOrder.orderNumber}) ! En attente de vérification du reçu.`, 'info');
      return newOrder;
    }

    // Automated order (Stripe / PayPal / Tap Payments / Crypto) -> Auto-delivered immediately!
    const availableKey = digitalItems.find((k) => k.product_id === targetProduct.id && !k.is_delivered);
    const assignedKeyData = availableKey ? availableKey.secret_data : `OFFICIAL-KEY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    if (availableKey) {
      setDigitalItems((prev) =>
        prev.map((k) =>
          k.id === availableKey.id ? { ...k, is_delivered: true, order_id: orderId } : k
        )
      );
    }

    let cur: Currency = 'USD';
    let gtw: PaymentGatewayId = 'stripe';
    let method: OrderPaymentMethod = 'stripe';
    let amount = targetProduct.price_usd || 25;

    if (type === 'tap_mada_auto') {
      cur = 'SAR';
      gtw = 'tap_payments';
      method = 'mada';
      amount = targetProduct.price_sar || Math.round((targetProduct.price_usd || 25) * 3.75);
    } else if (type === 'tap_knet_auto') {
      cur = 'KWD';
      gtw = 'tap_payments';
      method = 'knet';
      amount = targetProduct.price_kwd || Math.round((targetProduct.price_usd || 25) * 0.308 * 10) / 10;
    } else if (type === 'applepay_auto') {
      cur = 'SAR';
      gtw = 'tap_payments';
      method = 'apple_pay';
      amount = targetProduct.price_sar || 85;
    } else if (type === 'paypal_auto') {
      cur = 'USD';
      gtw = 'paypal';
      method = 'paypal';
      amount = targetProduct.price_usd || 25;
    } else if (type === 'crypto_auto') {
      cur = 'USD';
      gtw = 'crypto';
      method = 'crypto';
      amount = targetProduct.price_usd || 25;
    }

    const costUsd = targetProduct.cost_price_usd || 10;
    const amountInUsd = convertCurrency(amount, cur, 'USD', exchangeRates);
    const netProfitUsd = Math.max(0, Math.round((amountInUsd - costUsd) * 10) / 10);

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer_email: `gamer.${Math.floor(100 + Math.random() * 900)}@digital-hub.com`,
      customer_phone: '+1 555 ' + Math.floor(100000 + Math.random() * 900000),
      currency: cur,
      total_amount: amount,
      gateway: gtw,
      payment_method: method,
      paymentMethod: method,
      payment_proof_url: undefined,
      status: 'completed',
      delivered_item_id: availableKey ? availableKey.id : null,
      delivered_secret_data: assignedKeyData,
      cost_price_usd: costUsd,
      net_profit_usd: netProfitUsd,
      createdAt: new Date().toISOString(),
      customer: {
        firstName: 'Client',
        lastName: cur === 'SAR' ? 'Saoudien' : cur === 'KWD' ? 'Koweïtien' : 'International',
        phone: cur === 'SAR' ? '+966 50 998 877' : cur === 'KWD' ? '+965 99 11 22 33' : '+1 555 123 4567',
        email: `gamer@${cur.toLowerCase()}.com`,
        city: cur === 'SAR' ? 'Riyadh' : cur === 'KWD' ? 'Kuwait City' : 'New York',
      },
      items: [
        {
          productId: targetProduct.id,
          productName: targetProduct.title || targetProduct.name,
          productImage: targetProduct.image,
          unitPrice: amount,
          quantity: 1,
        },
      ],
      subtotal: amount,
      deliveryFee: 0,
      discount: 0,
      total: amount,
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(
      `Passerelle ${gtw.toUpperCase()} confirmée : Commande ${newOrder.orderNumber} complétée & clé délivrée immédiatement !`,
      'success'
    );
    return newOrder;
  };

  // Cart operations
  const addToCart = (product: Product, option?: ProductOption, quantity = 1) => {
    const opt = option || (product.options && product.options[0]);
    const unitPrice = opt ? product.price + opt.priceDelta : product.price;
    const cartItemId = `${product.id}-${opt?.value || 'default'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedOption: opt,
          unitPrice,
          quantity,
        },
      ];
    });

    showToast(`"${product.name}" ajouté au panier`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Article retiré du panier', 'info');
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'NOVALYS10' || cleaned === 'PROMO10' || cleaned === 'BIENVENUE') {
      setAppliedPromo({ code: cleaned, percent: 10 });
      showToast('Code promo validé : 10% de réduction immédiate !');
      return { success: true, message: 'Code de 10% appliqué' };
    }
    if (cleaned === 'VIP20') {
      setAppliedPromo({ code: cleaned, percent: 20 });
      showToast('Code VIP validé : 20% de réduction appliquée !');
      return { success: true, message: 'Code de 20% appliqué' };
    }
    showToast('Code promo non valide ou expiré', 'warning');
    return { success: false, message: 'Code invalide' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Code promo retiré', 'info');
  };

  const discountAmount = appliedPromo ? Math.round((cartTotal * appliedPromo.percent) / 100) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  // Place Order from Client Storefront
  const placeOrder = (
    customer: CustomerDetails,
    deliveryFee = 0,
    paymentMethod: OrderPaymentMethod = 'baridimob',
    currency: Currency = selectedCurrency,
    gateway?: PaymentGatewayId,
    paymentProofUrl?: string
  ): Order => {
    const orderNumber = `NVX-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord-${Date.now()}`;
    const calculatedTotal = finalTotal + deliveryFee;

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      optionLabel: item.selectedOption?.label,
    }));

    const isAutoPayment =
      paymentMethod === 'stripe' ||
      paymentMethod === 'paypal' ||
      paymentMethod === 'apple_pay' ||
      paymentMethod === 'google_pay' ||
      paymentMethod === 'mada' ||
      paymentMethod === 'knet' ||
      paymentMethod === 'benefit_pay' ||
      paymentMethod === 'naps' ||
      paymentMethod === 'omannet' ||
      paymentMethod === 'stc_pay' ||
      paymentMethod === 'card' ||
      paymentMethod === 'crypto';

    const status: OrderStatus = isAutoPayment ? 'completed' : 'pending_verification';

    let deliveredKeyData: string | null = null;
    let deliveredItemId: string | null = null;

    if (isAutoPayment && cart.length > 0) {
      const targetProdId = cart[0].productId;
      const keyObj = digitalItems.find((k) => k.product_id === targetProdId && !k.is_delivered);
      if (keyObj) {
        deliveredKeyData = keyObj.secret_data;
        deliveredItemId = keyObj.id;
        setDigitalItems((prev) =>
          prev.map((k) => (k.id === keyObj.id ? { ...k, is_delivered: true, order_id: orderId } : k))
        );
      }
    }

    const assignedGateway: PaymentGatewayId = gateway || (
      paymentMethod === 'baridimob' || paymentMethod === 'ccp' ? 'baridimob'
      : paymentMethod === 'paypal' ? 'paypal'
      : ['mada', 'knet', 'benefit_pay', 'naps', 'omannet', 'stc_pay'].includes(paymentMethod) ? 'tap_payments'
      : paymentMethod === 'crypto' ? 'crypto'
      : 'stripe'
    );

    const primaryProd = cart[0]?.product;
    const costUsd = (primaryProd?.cost_price_usd || 10) * (cart[0]?.quantity || 1);
    const amountInUsd = convertCurrency(calculatedTotal, currency, 'USD', exchangeRates);
    const netProfitUsd = Math.max(0, Math.round((amountInUsd - costUsd) * 10) / 10);

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer_email: customer.email,
      customer_phone: customer.phone,
      currency,
      total_amount: calculatedTotal,
      gateway: assignedGateway,
      payment_method: paymentMethod,
      paymentMethod,
      payment_proof_url:
        paymentProofUrl ||
        (paymentMethod === 'baridimob' || paymentMethod === 'ccp'
          ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80'
          : undefined),
      status,
      delivered_item_id: deliveredItemId,
      delivered_secret_data: deliveredKeyData,
      cost_price_usd: costUsd,
      net_profit_usd: netProfitUsd,
      createdAt: new Date().toISOString(),
      customer,
      items: orderItems,
      subtotal: cartTotal,
      deliveryFee,
      discount: discountAmount,
      total: calculatedTotal,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCart([]);
    setAppliedPromo(null);

    // Attribute commission if customer arrived via affiliate link
    if (activeReferralCode) {
      const matchedAff = affiliates.find(
        (a) => a.code.toLowerCase() === activeReferralCode.toLowerCase()
      );
      if (matchedAff) {
        const commRate = matchedAff.commissionRate || 0.25;
        const commAmt = Math.round(calculatedTotal * commRate * 10) / 10;
        const commUsd = Math.round(convertCurrency(commAmt, currency, 'USD', exchangeRates) * 100) / 100;
        const saleId = `sale-${Date.now()}`;
        const newSale: AffiliateSale = {
          id: saleId,
          affiliateId: matchedAff.id,
          affiliateCode: matchedAff.code,
          orderId,
          orderNumber,
          customerName: `${customer.firstName} ${customer.lastName}`.trim(),
          orderTotal: calculatedTotal,
          currency,
          commissionAmount: commAmt,
          commissionCurrency: currency,
          commissionUsd: commUsd,
          status: 'approved',
          timestamp: new Date().toISOString(),
        };
        setAffiliateSales((prev) => [newSale, ...prev]);
        setAffiliates((prev) =>
          prev.map((a) =>
            a.id === matchedAff.id
              ? {
                  ...a,
                  salesCount: a.salesCount + 1,
                  totalRevenueUsd: Math.round((a.totalRevenueUsd + amountInUsd) * 100) / 100,
                  totalCommissionUsd: Math.round((a.totalCommissionUsd + commUsd) * 100) / 100,
                  totalCommissionDzd: Math.round(
                    a.totalCommissionDzd +
                      (currency === 'DZD' ? commAmt : convertCurrency(commAmt, currency, 'DZD', exchangeRates))
                  ),
                  totalCommissionSar: Math.round(
                    a.totalCommissionSar +
                      (currency === 'SAR' ? commAmt : convertCurrency(commAmt, currency, 'SAR', exchangeRates))
                  ),
                }
              : a
          )
        );
      }
    }

    // Sync customer purchase to CRM Base
    if (customer.email) {
      const cleanEmail = customer.email.trim().toLowerCase();
      const boughtProducts = orderItems.map((i) => i.productName);

      setCrmCustomers((prev) => {
        const existingIdx = prev.findIndex((c) => c.email.toLowerCase() === cleanEmail);
        const customerName =
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || cleanEmail.split('@')[0];
        const countryCode =
          currency === 'DZD' ? 'dz' : currency === 'SAR' ? 'sa' : currency === 'AED' ? 'ae' : 'intl';
        const countryLabel =
          currency === 'DZD'
            ? 'Algérie'
            : currency === 'SAR'
            ? 'Arabie Saoudite'
            : currency === 'AED'
            ? 'Émirats'
            : 'International';
        const flag =
          currency === 'DZD' ? '🇩🇿' : currency === 'SAR' ? '🇸🇦' : currency === 'AED' ? '🇦🇪' : '🌐';

        if (existingIdx >= 0) {
          const existing = prev[existingIdx];
          const newOrdersCount = existing.ordersCount + 1;
          const updatedTag: CrmCustomerTag =
            newOrdersCount >= 2 ? 'Acheteur VIP' : 'Acheteur 1 produit';
          const mergedProducts = Array.from(
            new Set([...existing.purchasedProducts, ...boughtProducts])
          );

          const updated: CrmCustomer = {
            ...existing,
            name: customerName || existing.name,
            phone: customer.phone || existing.phone,
            ordersCount: newOrdersCount,
            tag: updatedTag,
            purchasedProducts: mergedProducts,
            totalSpent: existing.totalSpent + calculatedTotal,
            totalSpentUsd: Math.round((existing.totalSpentUsd + amountInUsd) * 100) / 100,
            lastContactDate: new Date().toISOString(),
            source: 'order',
          };

          const clone = [...prev];
          clone[existingIdx] = updated;
          return clone;
        } else {
          const newCustomer: CrmCustomer = {
            id: `crm-${Date.now()}`,
            name: customerName,
            email: cleanEmail,
            phone: customer.phone,
            country: countryCode,
            countryLabel,
            flag,
            purchasedProducts: boughtProducts,
            totalSpent: calculatedTotal,
            totalSpentUsd: Math.round(amountInUsd * 100) / 100,
            currency,
            ordersCount: 1,
            tag: 'Acheteur 1 produit',
            lastContactDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            source: 'order',
          };
          return [newCustomer, ...prev];
        }
      });
    }

    try {
      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch {
      // fallback
    }

    showToast(`Commande ${orderNumber} enregistrée avec succès !`);
    return newOrder;
  };

  const addUpsellToOrder = (
    orderId: string,
    upsellItem: { title: string; price: number; productId: string; image?: string }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedItems = [
            ...(ord.items || []),
            {
              productId: upsellItem.productId,
              productName: upsellItem.title,
              productImage: upsellItem.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
              unitPrice: upsellItem.price,
              quantity: 1,
              optionLabel: 'Upsell Flash -70%',
            },
          ];
          const newTotal = (ord.total || ord.total_amount || 0) + upsellItem.price;
          return {
            ...ord,
            items: updatedItems,
            total: newTotal,
            total_amount: newTotal,
            subtotal: (ord.subtotal || 0) + upsellItem.price,
          };
        }
        return ord;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Statut de la commande mis à jour : ${status.toUpperCase()}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast('Commande supprimée du tableau de bord', 'info');
  };

  const submitOrderPaymentProof = (orderId: string, proofUrl: string, transactionRef?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedNotes = transactionRef
            ? `${ord.customer.notes ? ord.customer.notes + ' | ' : ''}Réf BaridiMob : ${transactionRef}`
            : ord.customer.notes;
          return {
            ...ord,
            payment_proof_url: proofUrl,
            status: 'pending_verification' as OrderStatus,
            customer: {
              ...ord.customer,
              notes: updatedNotes,
            },
          };
        }
        return ord;
      })
    );
    showToast('Reçu BaridiMob envoyé avec succès ! Vérification en cours par notre équipe.', 'success');
  };

  // Product CRUD for Admin
  const addProduct = (productData: Partial<Product>): Product => {
    const title = productData.title || productData.name || 'Nouveau Produit';
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const pDzd = productData.price_dzd || productData.price || 2500;
    const pSar = productData.price_sar || Math.round(pDzd * 0.027);
    const pUsd = productData.price_usd || Math.round(pDzd / 140);
    const costUsd = productData.cost_price_usd || Math.round(pUsd * 0.55 * 10) / 10;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug,
      title,
      name: title,
      platform: productData.platform || 'Steam',
      category: productData.category || 'Jeux',
      categoryLabel: productData.categoryLabel || productData.category || 'Jeux',
      price_dzd: pDzd,
      price_sar: pSar,
      price_usd: pUsd,
      cost_price_usd: costUsd,
      delivery_type: (productData.delivery_type as DeliveryType) || 'key',
      price: pDzd,
      originalPrice: productData.originalPrice || Math.round(pDzd * 1.4),
      discountPercentage: 25,
      tagline: productData.tagline || 'Produit digital avec livraison instantanée.',
      shortDescription: productData.shortDescription || productData.tagline || '',
      fullDescription: productData.fullDescription || 'Description détaillée du produit digital.',
      rating: 5.0,
      reviewCount: 1,
      deliveryTime: '< 30 secondes',
      deliveryMethod: 'Clé CD digitale délivrée automatiquement',
      platforms: productData.platforms || ['Windows'],
      productType: 'key',
      productTypeLabel: 'Clé Digitale',
      image: productData.image || 'https://picsum.photos/seed/game-cover/800/600',
      stockCount: 0,
      inStock: false,
      features: ['Clé officielle authentique', 'Garantie d\'activation', 'Support client 7j/7'],
      whatIsIncluded: ['Clé CD produit officielle', 'Notice d\'activation immédiate'],
      systemRequirements: { os: 'Tous systèmes' },
      activationGuide: [{ step: 1, title: 'Activation', instruction: 'Activez la clé sur le lanceur officiel.' }],
      faqs: [{ question: 'La clé est-elle officielle ?', answer: 'Oui, 100% officielle avec garantie.' }],
      reviews: [],
      badge: productData.badge,
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produit "${newProduct.title}" créé avec succès ! Pensez à insérer des clés dans le coffre.`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const updatedProd = { ...prod, ...updated };
          if (updated.title) updatedProd.name = updated.title;
          if (updated.price_dzd !== undefined) updatedProd.price = updated.price_dzd;
          return updatedProd;
        }
        return prod;
      })
    );
    showToast('Produit mis à jour avec succès');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDigitalItems((prev) => prev.filter((k) => k.product_id !== id));
    showToast('Produit et ses clés associées supprimés', 'info');
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockCount: Math.max(0, newStock), inStock: newStock > 0 } : p
      )
    );
    showToast('Niveau de stock actualisé');
  };

  const resetDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setDigitalItems(INITIAL_DIGITAL_ITEMS);
    setOrders(SAMPLE_INITIAL_ORDERS);
    showToast('Catalogue, coffre de clés et commandes réinitialisés avec succès !');
  };

  // Admin Login
  const loginAdmin = (email: string, pass: string): boolean => {
    if (
      (email.trim().toLowerCase() === 'admin@novalys.dz' ||
        email.trim().toLowerCase() === 'cherchellsgpp@gmail.com' ||
        email.trim().toLowerCase() === 'admin') &&
      (pass === 'admin123' || pass === 'admin')
    ) {
      const user: AdminUser = {
        id: 'usr-admin-1',
        email: email.trim().toLowerCase(),
        name: 'Administrateur Principal',
        role: 'superadmin',
      };
      setAdminUser(user);
      showToast('Connexion réussie à l\'espace Administration !');
      return true;
    }
    showToast('Identifiants incorrects. Utilisez admin@novalys.dz / admin123', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    showToast('Déconnexion de l\'espace Administration effectuée.', 'info');
  };

  // Calculate stats rapides (Total ventes du jour par devise, clés restantes en stock, alertes < 3)
  const isToday = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const adminStats: AdminStats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'refunded' && o.status !== 'cancelled');
    const todayValidOrders = validOrders.filter((o) => isToday(o.createdAt));

    const revenueByCurrency: Record<Currency, number> = {
      USD: 0,
      DZD: 0,
      SAR: 0,
      AED: 0,
      KWD: 0,
      QAR: 0,
      BHD: 0,
      OMR: 0,
    };

    const todayRevenueByCurrency: Record<Currency, number> = {
      USD: 0,
      DZD: 0,
      SAR: 0,
      AED: 0,
      KWD: 0,
      QAR: 0,
      BHD: 0,
      OMR: 0,
    };

    let totalRevenueUsdConverted = 0;
    let todayRevenueUsdConverted = 0;
    let estimatedNetProfitUsd = 0;

    validOrders.forEach((o) => {
      const cur: Currency = (o.currency as Currency) || 'DZD';
      const amt = o.total_amount || o.total || 0;
      if (revenueByCurrency[cur] !== undefined) {
        revenueByCurrency[cur] += amt;
      }
      const inUsd = convertCurrency(amt, cur, 'USD', exchangeRates);
      totalRevenueUsdConverted += inUsd;

      // Net profit calculation
      if (o.net_profit_usd !== undefined) {
        estimatedNetProfitUsd += o.net_profit_usd;
      } else {
        const targetProdId = o.items?.[0]?.productId;
        const targetProd = products.find((p) => p.id === targetProdId);
        const cost = o.cost_price_usd ?? (targetProd?.cost_price_usd || 10);
        estimatedNetProfitUsd += Math.max(0, inUsd - cost);
      }
    });

    todayValidOrders.forEach((o) => {
      const cur: Currency = (o.currency as Currency) || 'DZD';
      const amt = o.total_amount || o.total || 0;
      if (todayRevenueByCurrency[cur] !== undefined) {
        todayRevenueByCurrency[cur] += amt;
      }
      todayRevenueUsdConverted += convertCurrency(amt, cur, 'USD', exchangeRates);
    });

    const pendingOrders = orders.filter((o) => o.status === 'pending_verification' || o.status === 'pending_proof' || o.status === 'pending').length;
    const totalKeysRemaining = digitalItems.filter((k) => !k.is_delivered).length;
    const lowStockCount = products.filter((p) => p.stockCount < 3).length; // Alerte < 3 unités comme demandé !

    return {
      totalRevenue: revenueByCurrency.DZD,
      totalOrders: orders.length,
      todayOrders: todayValidOrders.length,
      pendingOrders,
      lowStockCount,
      totalKeysRemaining,
      revenueByCurrency,
      todayRevenueByCurrency,
      totalRevenueUsdConverted: Math.round(totalRevenueUsdConverted * 100) / 100,
      todayRevenueUsdConverted: Math.round(todayRevenueUsdConverted * 100) / 100,
      estimatedNetProfitUsd: Math.round(estimatedNetProfitUsd * 10) / 10,
    };
  }, [orders, products, digitalItems, exchangeRates]);

  const formatPrice = useCallback((amount: number, currency: Currency = selectedCurrency): string => {
    return formatCurrencyAmount(amount, currency);
  }, [selectedCurrency]);

  return (
    <ShopContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProductSlug,
        openProductPage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeLegalPage,
        openLegalPage,

        selectedCurrency,
        setSelectedCurrency,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        resetDefaultCatalog,

        digitalItems,
        addDigitalKeys,
        deleteDigitalKey,
        getAvailableKeysCount,
        getProductKeys,
        resetDigitalInventory,

        calculateProfitMetrics,

        paymentGateways,
        updateGatewaySettings,
        toggleGateway,
        exchangeRates,
        updateExchangeRate,

        orders,
        placeOrder,
        addUpsellToOrder,
        updateOrderStatus,
        deleteOrder,
        submitOrderPaymentProof,
        validateAndDeliverOrder,
        rejectOrder,
        simulateIncomingOrder,
        latestOrder,
        setLatestOrder,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        promoCode: promoCodeInput,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        finalTotal,

        adminUser,
        isAdminAuthenticated: !!adminUser,
        loginAdmin,
        logoutAdmin,
        adminStats,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isVaultOpen,
        setIsVaultOpen,
        isFseSpecsOpen,
        setIsFseSpecsOpen,

        formatPrice,

        // Funnel Analytics & CRO
        funnelVisits,
        analyticsSummary,
        recordFunnelVisit,
        recordFunnelConversion,
        simulateBatchTraffic,
        resetAnalyticsData,

        // Affiliation System
        affiliates,
        affiliateSales,
        activeReferralCode,
        registerAffiliate,
        recordAffiliateClick,
        validateAffiliatePayout,
        updateAffiliateCommissionRate,
        globalAffiliateCommissionRate,
        setGlobalAffiliateCommissionRate,

        // Abandoned Carts
        abandonedCarts,
        recordAbandonedCart,
        markAbandonedCartContacted,
        deleteAbandonedCart,

        // Verified Reviews & Social Proof
        verifiedReviews,
        addVerifiedReview,
        deleteVerifiedReview,
        toggleReviewFeatured,

        // CRM & Retargeting System
        crmCustomers,
        crmCampaigns,
        crmMetrics,
        subscribeNewsletter,
        addOrUpdateCrmCustomer,
        deleteCrmCustomer,
        updateCrmCustomerNotes,
        sendCrmCampaign,
        deleteCrmCampaign,

        toasts,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-md w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-2xl text-sm font-medium border backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'bg-slate-950/95 text-slate-100 border-emerald-500/40 shadow-emerald-500/10'
                : toast.type === 'warning'
                ? 'bg-slate-950/95 text-amber-200 border-amber-500/40 shadow-amber-500/10'
                : toast.type === 'error'
                ? 'bg-slate-950/95 text-rose-200 border-rose-500/40 shadow-rose-500/10'
                : 'bg-slate-950/95 text-cyan-200 border-cyan-500/40 shadow-cyan-500/10'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-400 ring-4 ring-emerald-400/20'
                  : toast.type === 'warning'
                  ? 'bg-amber-400 ring-4 ring-amber-400/20'
                  : toast.type === 'error'
                  ? 'bg-rose-400 ring-4 ring-rose-400/20'
                  : 'bg-cyan-400 ring-4 ring-cyan-400/20'
              }`}
            />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
