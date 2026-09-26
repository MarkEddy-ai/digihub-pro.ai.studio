'use client';

import React from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function AdminContent() {
  const { isAdminAuthenticated } = useShop();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}

export default function AdminPage() {
  return (
    <ShopProvider>
      <AdminContent />
    </ShopProvider>
  );
}
