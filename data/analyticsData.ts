import {
  TrafficSourceId,
  FunnelVisitRecord,
  AnalyticsSummary,
  TrafficSourceMetric,
  FunnelPerformanceMetric,
} from '@/types';
import { FUNNEL_PRODUCTS } from '@/data/funnelOffers';

export const STORAGE_KEY_ANALYTICS = 'novalys_funnel_analytics_v1';

export const TRAFFIC_SOURCES_INFO: Record<
  TrafficSourceId,
  { label: string; channel: string; color: string; adSpendEstPerVisit: number }
> = {
  tiktok_ads: {
    label: 'TikTok Ads',
    channel: 'Paid Social (Spark / Video Ads)',
    color: '#00f2fe',
    adSpendEstPerVisit: 0.22,
  },
  meta_ads: {
    label: 'Meta Ads (Facebook)',
    channel: 'Paid Social (Feed / Stories)',
    color: '#1877f2',
    adSpendEstPerVisit: 0.38,
  },
  instagram_reels: {
    label: 'Instagram Reels',
    channel: 'Paid Social (Reels & Explore)',
    color: '#e1306c',
    adSpendEstPerVisit: 0.34,
  },
  google_ads: {
    label: 'Google Search & PMax',
    channel: 'Paid Search (High Intent)',
    color: '#ea4335',
    adSpendEstPerVisit: 0.55,
  },
  influencer_affiliate: {
    label: 'Influenceurs & Discord',
    channel: 'Partenariats Gaming & Créateurs',
    color: '#8b5cf6',
    adSpendEstPerVisit: 0.18,
  },
  direct: {
    label: 'Trafic Direct & Partages',
    channel: 'Bouche-à-oreille & Viral',
    color: '#10b981',
    adSpendEstPerVisit: 0.0,
  },
};

// Seed realistic historical sample visits
export function generateInitialVisits(): FunnelVisitRecord[] {
  const records: FunnelVisitRecord[] = [];
  const sources: TrafficSourceId[] = [
    'tiktok_ads',
    'tiktok_ads',
    'tiktok_ads',
    'meta_ads',
    'meta_ads',
    'instagram_reels',
    'google_ads',
    'influencer_affiliate',
    'direct',
  ];
  const slugs = ['windows-11-pro-retail', 'chatgpt-plus', 'office-2024-pro-plus', 'black-myth-wukong'];
  const locales = ['dz', 'dz', 'sa', 'sa', 'ae', 'intl'];

  const now = Date.now();
  // 145 simulated visits over the last 48 hours with ~18 conversions
  for (let i = 0; i < 180; i++) {
    const timeOffset = Math.floor(Math.random() * 48 * 3600 * 1000);
    const source = sources[Math.floor(Math.random() * sources.length)];
    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    const loc = locales[Math.floor(Math.random() * locales.length)];
    const device: 'mobile' | 'desktop' = source === 'tiktok_ads' || source === 'instagram_reels' ? 'mobile' : Math.random() > 0.3 ? 'mobile' : 'desktop';

    // 8.5% conversion probability for TikTok/Meta funnels
    const isConverted = Math.random() < 0.088;
    const bumpAccepted = isConverted ? Math.random() < 0.42 : false;
    const upsellAccepted = isConverted ? Math.random() < 0.31 : false;

    let baseRev = slug === 'windows-11-pro-retail' ? 14.99 : slug === 'chatgpt-plus' ? 12.99 : slug === 'office-2024-pro-plus' ? 16.99 : 34.99;
    if (bumpAccepted) baseRev += 1.99;
    if (upsellAccepted) baseRev += 9.99;

    records.push({
      id: `vis-${i + 1}`,
      timestamp: new Date(now - timeOffset).toISOString(),
      funnelSlug: slug,
      locale: loc,
      source,
      device,
      converted: isConverted,
      orderId: isConverted ? `ord-seed-${i + 1}` : undefined,
      bumpAccepted,
      upsellAccepted,
      revenueUsd: isConverted ? Math.round(baseRev * 100) / 100 : 0,
    });
  }

  return records;
}

/**
 * Compute analytics summary from visit records
 */
export function computeAnalyticsSummary(visits: FunnelVisitRecord[]): AnalyticsSummary {
  const totalVisits = visits.length;
  const convertedVisits = visits.filter((v) => v.converted);
  const totalOrders = convertedVisits.length;

  const conversionRate = totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;
  const ratioNumber = totalOrders > 0 ? (totalVisits / totalOrders).toFixed(1) : '0';
  const visitToOrderRatio = totalOrders > 0 ? `1 : ${ratioNumber}` : 'N/A';

  const totalRevenueUsd = convertedVisits.reduce((acc, v) => acc + (v.revenueUsd || 0), 0);
  const aovUsd = totalOrders > 0 ? totalRevenueUsd / totalOrders : 0;

  const bumpCount = convertedVisits.filter((v) => v.bumpAccepted).length;
  const bumpTakeRate = totalOrders > 0 ? (bumpCount / totalOrders) * 100 : 0;

  const upsellCount = convertedVisits.filter((v) => v.upsellAccepted).length;
  const upsellTakeRate = totalOrders > 0 ? (upsellCount / totalOrders) * 100 : 0;

  // Breakdown by Traffic Source
  const sourceKeys = Object.keys(TRAFFIC_SOURCES_INFO) as TrafficSourceId[];
  let totalAdSpend = 0;

  const sources: TrafficSourceMetric[] = sourceKeys.map((sId) => {
    const sVisits = visits.filter((v) => v.source === sId);
    const sOrders = sVisits.filter((v) => v.converted);
    const sRev = sOrders.reduce((acc, v) => acc + (v.revenueUsd || 0), 0);
    const sCr = sVisits.length > 0 ? (sOrders.length / sVisits.length) * 100 : 0;
    const sRatio = sOrders.length > 0 ? `1 : ${(sVisits.length / sOrders.length).toFixed(1)}` : 'N/A';
    const sAov = sOrders.length > 0 ? sRev / sOrders.length : 0;

    const info = TRAFFIC_SOURCES_INFO[sId];
    const adSpend = Math.round(sVisits.length * info.adSpendEstPerVisit * 10) / 10;
    totalAdSpend += adSpend;
    const roas = adSpend > 0 ? Math.round((sRev / adSpend) * 10) / 10 : sRev > 0 ? 99 : 0;

    return {
      sourceId: sId,
      label: info.label,
      channel: info.channel,
      color: info.color,
      visits: sVisits.length,
      orders: sOrders.length,
      conversionRate: Math.round(sCr * 10) / 10,
      visitToOrderRatio: sRatio,
      revenueUsd: Math.round(sRev * 100) / 100,
      aovUsd: Math.round(sAov * 100) / 100,
      estimatedAdSpendUsd: adSpend,
      roas,
    };
  });

  // Breakdown by Funnel
  const funnels: FunnelPerformanceMetric[] = FUNNEL_PRODUCTS.map((prod) => {
    const fVisits = visits.filter((v) => v.funnelSlug === prod.slug || v.funnelSlug === prod.id);
    const fOrders = fVisits.filter((v) => v.converted);
    const fRev = fOrders.reduce((acc, v) => acc + (v.revenueUsd || 0), 0);
    const fCr = fVisits.length > 0 ? (fOrders.length / fVisits.length) * 100 : 0;
    const fRatio = fOrders.length > 0 ? `1 : ${(fVisits.length / fOrders.length).toFixed(1)}` : 'N/A';
    const fBump = fOrders.filter((v) => v.bumpAccepted).length;
    const fUpsell = fOrders.filter((v) => v.upsellAccepted).length;

    return {
      slug: prod.slug,
      title: prod.title,
      visits: fVisits.length,
      orders: fOrders.length,
      conversionRate: Math.round(fCr * 10) / 10,
      visitToOrderRatio: fRatio,
      bumpTakeRate: fOrders.length > 0 ? Math.round((fBump / fOrders.length) * 1000) / 10 : 0,
      upsellTakeRate: fOrders.length > 0 ? Math.round((fUpsell / fOrders.length) * 1000) / 10 : 0,
      revenueUsd: Math.round(fRev * 100) / 100,
      aovUsd: fOrders.length > 0 ? Math.round((fRev / fOrders.length) * 100) / 100 : 0,
    };
  });

  const estimatedRoas = totalAdSpend > 0 ? Math.round((totalRevenueUsd / totalAdSpend) * 10) / 10 : 0;

  return {
    totalVisits,
    totalOrders,
    conversionRate: Math.round(conversionRate * 10) / 10,
    visitToOrderRatio,
    totalRevenueUsd: Math.round(totalRevenueUsd * 100) / 100,
    aovUsd: Math.round(aovUsd * 100) / 100,
    bumpTakeRate: Math.round(bumpTakeRate * 10) / 10,
    upsellTakeRate: Math.round(upsellTakeRate * 10) / 10,
    estimatedRoas,
    sources,
    funnels,
  };
}
