'use client';

import React from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function AnalyticsAdminContent() {
  const { isAdminAuthenticated } = useShop();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialTab="analytics" />;
}

export default function AdminAnalyticsPage() {
  return (
    <ShopProvider>
      <AnalyticsAdminContent />
    </ShopProvider>
  );
}
