import React from 'react';
import { FunnelDeliveryVault } from '@/components/funnel/FunnelDeliveryVault';
import { ShopProvider } from '@/context/ShopContext';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ThankYouPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <ShopProvider>
      <FunnelDeliveryVault slug={slug} />
    </ShopProvider>
  );
}
