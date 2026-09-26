import React from 'react';
import { FunnelDynamicRenderer } from '@/components/funnel/FunnelDynamicRenderer';
import { FunnelLocale } from '@/data/funnelOffers';
import { ShopProvider } from '@/context/ShopContext';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export default async function FunnelPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = (resolvedSearchParams.locale as FunnelLocale) || 'dz';

  return (
    <ShopProvider>
      <FunnelDynamicRenderer slug={slug} initialLocale={locale} />
    </ShopProvider>
  );
}
