'use client';

import React from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function VaultAdminContent() {
  const { isAdminAuthenticated } = useShop();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard initialTab="vault" />;
}

export default function AdminVaultPage() {
  return (
    <ShopProvider>
      <VaultAdminContent />
    </ShopProvider>
  );
}
