'use client';

import React from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function PricingAdminContent() {
  const { isAdminAuthenticated } = useShop();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialTab="pricing" />;
}

export default function AdminPricingPage() {
  return (
    <ShopProvider>
      <PricingAdminContent />
    </ShopProvider>
  );
}
