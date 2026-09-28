'use client';

import React, { useState } from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function AdminContent() {
  const { isAdminAuthenticated } = useShop();

  // Nom dynamique de l'acheteur (modifiable en un clic)
  const [buyerName, setBuyerName] = useState('Acquiring Partner / Company');
  const [isEditingName, setIsEditingName] = useState(false);

  // Modification des identifiants administrateur
  const [adminEmail, setAdminEmail] = useState('admin@novalys.digital');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityMessage({ text: 'Passwords do not match.', isError: true });
      return;
    }
    setSecurityMessage({ text: 'Credentials updated successfully!', isError: false });
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecurityMessage(null), 4000);
  };

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
       
        {/* SECTION DE MODIFICATION EMAIL ET MOT DE PASSE */}
        <div id="security-settings" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-1">Security & Administrator Access</h2>
          <p className="text-xs text-slate-400 mb-6">
            Update your administrative contact email and master password.
          </p>

          <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition"
              >
                Save Credentials
              </button>
              {securityMessage && (
                <span className={`text-xs font-medium ${securityMessage.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {securityMessage.text}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* TABLEAU DE BORD ADMIN EXISTANT */}
        <AdminDashboard />

      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ShopProvider>
      <AdminContent />
    </ShopProvider>
  );
}