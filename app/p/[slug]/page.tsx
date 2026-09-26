import React from 'react';
import { FunnelDynamicRenderer } from '@/components/funnel/FunnelDynamicRenderer';
import { FunnelLocale } from '@/data/funnelOffers';
import { ShopProvider } from '@/context/ShopContext';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ country?: string; locale?: string }>;
}

export default async function ProductLandingRoute({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Resolve locale from country parameter or locale parameter
  const rawCountry = (resolvedSearchParams.country || resolvedSearchParams.locale || 'dz').toLowerCase();
  let locale: FunnelLocale = 'dz';
  if (rawCountry === 'sa' || rawCountry === 'gulf' || rawCountry === 'ksa') {
    locale = 'sa';
  } else if (rawCountry === 'ae' || rawCountry === 'uae') {
    locale = 'ae';
  } else if (rawCountry === 'global' || rawCountry === 'intl' || rawCountry === 'world') {
    locale = 'intl';
  } else {
    locale = 'dz';
  }

  return (
    <ShopProvider>
      <FunnelDynamicRenderer slug={slug} initialLocale={locale} />
    </ShopProvider>
  );
}
