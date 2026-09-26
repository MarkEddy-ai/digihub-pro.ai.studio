'use client';

import React from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function FunnelsAdminContent() {
  const { isAdminAuthenticated } = useShop();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialTab="funnels" />;
}

export default function AdminFunnelsPage() {
  return (
    <ShopProvider>
      <FunnelsAdminContent />
    </ShopProvider>
  );
}
