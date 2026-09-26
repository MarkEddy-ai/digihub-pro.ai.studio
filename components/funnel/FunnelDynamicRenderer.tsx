'use client';

import React, { useState } from 'react';
import { FunnelLandingHero } from '@/components/funnel/FunnelLandingHero';
import { HighConversionFunnelView } from '@/components/funnel/HighConversionFunnelView';
import { getFunnelProductBySlug, FunnelLocale, FunnelProductOffer } from '@/data/funnelOffers';
import { CustomFunnelConfig } from '@/types';

interface FunnelDynamicRendererProps {
  slug: string;
  initialLocale: FunnelLocale;
}

export function FunnelDynamicRenderer({ slug, initialLocale }: FunnelDynamicRendererProps) {
  const [customFunnel] = useState<CustomFunnelConfig | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('novalys_custom_funnels_v1');
      if (stored) {
        const list: CustomFunnelConfig[] = JSON.parse(stored);
        return list.find((f) => f.slug.toLowerCase() === slug.toLowerCase()) || null;
      }
    } catch (e) {
      console.error('Error reading custom funnels', e);
    }
    return null;
  });

  const [dynamicProduct] = useState<FunnelProductOffer>(() => {
    if (typeof window === 'undefined') return getFunnelProductBySlug(slug);
    try {
      const stored = localStorage.getItem('novalys_funnel_products_v2');
      if (stored) {
        const list: FunnelProductOffer[] = JSON.parse(stored);
        const match = list.find(
          (p) =>
            p.slug.toLowerCase() === slug.toLowerCase() ||
            p.id.toLowerCase() === slug.toLowerCase() ||
            p.slug.includes(slug.toLowerCase()) ||
            slug.toLowerCase().includes(p.slug)
        );
        if (match) return match;
      }
    } catch (e) {
      console.error('Error reading dynamic products', e);
    }
    return getFunnelProductBySlug(slug);
  });

  // If a custom funnel was configured for this slug, render HighConversionFunnelView
  if (customFunnel) {
    return <HighConversionFunnelView funnel={customFunnel} />;
  }

  // Otherwise render standard high-conversion landing with dynamic product data
  return <FunnelLandingHero product={dynamicProduct} initialLocale={initialLocale} />;
}
