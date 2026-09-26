import { Currency, CurrencyConfig, PaymentGatewayId, PaymentGatewaySettings, OrderPaymentMethod } from '@/types';

export const SUPPORTED_CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    name: 'Dollar Américain',
    symbol: '$',
    flag: '🌐',
    country: 'International',
    region: 'International',
    rateToUsd: 1.0,
    decimals: 2,
    defaultGateway: 'stripe',
    supportedMethods: ['stripe', 'paypal', 'apple_pay', 'google_pay', 'card'],
    enabled: true,
  },
  DZD: {
    code: 'DZD',
    name: 'Dinar Algérien',
    symbol: 'DA',
    flag: '🇩🇿',
    country: 'Algérie',
    region: 'Maghreb',
    rateToUsd: 230.0, // Taux de référence marché parallèle / importation licences
    decimals: 0,
    defaultGateway: 'baridimob',
    supportedMethods: ['baridimob', 'ccp'],
    enabled: true,
  },
  SAR: {
    code: 'SAR',
    name: 'Riyal Saoudien',
    symbol: 'SAR',
    flag: '🇸🇦',
    country: 'Arabie Saoudite',
    region: 'GCC',
    rateToUsd: 3.75,
    decimals: 2,
    defaultGateway: 'tap_payments',
    supportedMethods: ['mada', 'apple_pay', 'stc_pay', 'card'],
    enabled: true,
  },
  AED: {
    code: 'AED',
    name: 'Dirham des Émirats',
    symbol: 'AED',
    flag: '🇦🇪',
    country: 'Émirats Arabes Unis',
    region: 'GCC',
    rateToUsd: 3.67,
    decimals: 2,
    defaultGateway: 'tap_payments',
    supportedMethods: ['card', 'apple_pay', 'google_pay'],
    enabled: true,
  },
  KWD: {
    code: 'KWD',
    name: 'Dinar Koweïtien',
    symbol: 'KD',
    flag: '🇰🇼',
    country: 'Koweït',
    region: 'GCC',
    rateToUsd: 0.308,
    decimals: 3,
    defaultGateway: 'tap_payments',
    supportedMethods: ['knet', 'apple_pay', 'card'],
    enabled: true,
  },
  QAR: {
    code: 'QAR',
    name: 'Riyal Qatari',
    symbol: 'QR',
    flag: '🇶🇦',
    country: 'Qatar',
    region: 'GCC',
    rateToUsd: 3.64,
    decimals: 2,
    defaultGateway: 'tap_payments',
    supportedMethods: ['naps', 'apple_pay', 'card'],
    enabled: true,
  },
  BHD: {
    code: 'BHD',
    name: 'Dinar Bahreïni',
    symbol: 'BD',
    flag: '🇧🇭',
    country: 'Bahreïn',
    region: 'GCC',
    rateToUsd: 0.377,
    decimals: 3,
    defaultGateway: 'tap_payments',
    supportedMethods: ['benefit_pay', 'apple_pay', 'card'],
    enabled: true,
  },
  OMR: {
    code: 'OMR',
    name: 'Rial Omanais',
    symbol: 'OMR',
    flag: '🇴🇲',
    country: 'Oman',
    region: 'GCC',
    rateToUsd: 0.385,
    decimals: 3,
    defaultGateway: 'tap_payments',
    supportedMethods: ['omannet', 'apple_pay', 'card'],
    enabled: true,
  },
};

export const INITIAL_GATEWAY_SETTINGS: Record<PaymentGatewayId, PaymentGatewaySettings> = {
  stripe: {
    id: 'stripe',
    name: 'Stripe International',
    providerType: 'international',
    enabled: true,
    testMode: true,
    currencies: ['USD', 'AED'],
    supportedMethods: ['stripe', 'apple_pay', 'google_pay', 'card'],
    credentials: {
      publishableKey: 'pk_test_51MzNOVALYS_DIGITAL_DEMO_KEY_LIVE',
      secretKey: 'sk_test_51MzNOVALYS_SECRET_DEMO_KEY',
      webhookSecret: 'whsec_novalys_stripe_webhook_demo',
    },
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal Checkout',
    providerType: 'international',
    enabled: true,
    testMode: true,
    currencies: ['USD'],
    supportedMethods: ['paypal'],
    credentials: {
      clientId: 'AU_PayPal_Client_Demo_NovalysDigital_2026',
      secretKey: 'EEnv_Secret_PayPal_Key_Demo',
    },
  },
  baridimob: {
    id: 'baridimob',
    name: 'BaridiMob / Algérie Poste & CCP',
    providerType: 'algeria_manual',
    enabled: true,
    testMode: false,
    currencies: ['DZD'],
    supportedMethods: ['baridimob', 'ccp'],
    credentials: {
      accountRip: '007 99999 0023456789 42',
      accountCcp: '23456789 Clé 42',
      accountHolder: 'NOVALYS DIGITAL SERVICES (ALGÉRIE)',
    },
  },
  tap_payments: {
    id: 'tap_payments',
    name: 'Tap Payments (Passerelle Unifiée Golfe / GCC)',
    providerType: 'gcc_unified',
    enabled: true,
    testMode: true,
    currencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
    supportedMethods: ['mada', 'apple_pay', 'stc_pay', 'knet', 'benefit_pay', 'naps', 'omannet', 'card'],
    credentials: {
      publishableKey: 'pk_test_TAP_GULF_UNIFIED_mada_knet_demo',
      secretKey: 'sk_test_TAP_GULF_SECRET_KEY_demo',
      accountHolder: 'Novalys Gulf FZCO',
    },
  },
  paytabs: {
    id: 'paytabs',
    name: 'PayTabs (Passerelle GCC Alternative)',
    providerType: 'gcc_unified',
    enabled: false,
    testMode: true,
    currencies: ['SAR', 'AED', 'OMR', 'BHD'],
    supportedMethods: ['mada', 'apple_pay', 'card'],
    credentials: {
      publishableKey: 'profile_id_paytabs_98412',
      secretKey: 'server_key_paytabs_live_demo',
    },
  },
  crypto: {
    id: 'crypto',
    name: 'Crypto USDT (TRC20 / ERC20)',
    providerType: 'crypto',
    enabled: true,
    testMode: false,
    currencies: ['USD'],
    supportedMethods: ['crypto'],
    credentials: {
      accountRip: 'TXvNovalysUSDTAddressTRC20DepositOnly789',
      accountHolder: 'Binance Pay / TRON USDT',
    },
  },
};

/**
 * Format any currency price properly with its symbol and decimals
 */
export function formatCurrencyAmount(amount: number, currency: Currency = 'DZD'): string {
  const cfg = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const num = Number(amount) || 0;

  if (currency === 'DZD') {
    return `${Math.round(num).toLocaleString('fr-FR')} ${cfg.symbol}`;
  }

  return `${num.toLocaleString('fr-FR', {
    minimumFractionDigits: cfg.decimals,
    maximumFractionDigits: cfg.decimals,
  })} ${cfg.symbol}`;
}

/**
 * Convert any amount between two supported currencies based on rates to USD
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  customRates?: Record<Currency, number>
): number {
  if (from === to) return amount;
  const fromRate = customRates?.[from] ?? SUPPORTED_CURRENCIES[from]?.rateToUsd ?? 1.0;
  const toRate = customRates?.[to] ?? SUPPORTED_CURRENCIES[to]?.rateToUsd ?? 1.0;

  // Convert to USD first
  const inUsd = amount / fromRate;
  // Convert from USD to target
  return inUsd * toRate;
}

/**
 * Calculate net profit in USD and local currency
 * Sale Price in Currency - (Source Cost in USD * Exchange Rate)
 */
export function calculateNetMargin(
  salePrice: number,
  currency: Currency,
  costPriceUsd: number,
  customRates?: Record<Currency, number>
): {
  marginInCurrency: number;
  marginInUsd: number;
  marginPercent: number;
  isProfitable: boolean;
} {
  const rate = customRates?.[currency] ?? SUPPORTED_CURRENCIES[currency]?.rateToUsd ?? 1.0;
  const costInCurrency = costPriceUsd * rate;
  const marginInCurrency = salePrice - costInCurrency;
  const marginInUsd = marginInCurrency / rate;
  const marginPercent = salePrice > 0 ? (marginInCurrency / salePrice) * 100 : 0;

  return {
    marginInCurrency,
    marginInUsd,
    marginPercent: Math.round(marginPercent * 10) / 10,
    isProfitable: marginInCurrency > 0,
  };
}
