'use client';

import React from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function GatewaysAdminContent() {
  const { isAdminAuthenticated } = useShop();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialTab="gateways" />;
}

export default function AdminGatewaysPage() {
  return (
    <ShopProvider>
      <GatewaysAdminContent />
    </ShopProvider>
  );
}
