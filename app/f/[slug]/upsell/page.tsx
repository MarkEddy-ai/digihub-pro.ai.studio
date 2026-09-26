import React from 'react';
import { FunnelOneClickUpsell } from '@/components/funnel/FunnelOneClickUpsell';
import { ShopProvider } from '@/context/ShopContext';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function UpsellPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <ShopProvider>
      <FunnelOneClickUpsell slug={slug} />
    </ShopProvider>
  );
}
