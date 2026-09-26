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
        
        {/* LETTRE OFFICIELLE DE CESSION COMMERCIALE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
                Official Commercial Handover Certificate
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                Handover & Customization Guide
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                DigiHub Pro / Novalys Core • Next.js & Tailwind CSS Architecture
              </p>
            </div>

            {/* Nom dynamique de l'acheteur */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl min-w-[240px]">
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Licensed Owner
              </span>
              {isEditingName ? (
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                  className="mt-1 w-full bg-slate-900 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                />
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="mt-1 text-sm font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center justify-between"
                  title="Click to change buyer name"
                >
                  <span>{buyerName}</span>
                  <span className="text-xs text-slate-400 ml-2">✎</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm leading-relaxed text-slate-300 space-y-3">
            <p className="text-base text-white font-medium">
              Dear <span className="text-emerald-400 font-bold underline">{buyerName}</span>,
            </p>
            <p>
              Thank you for acquiring the official source code of <strong>DigiHub Pro</strong>. You now possess full commercial rights to deploy, brand, and extend this platform. All automated digital delivery pipelines and theme templates are ready for production.
            </p>
          </div>

          {/* Raccourcis d'actions : Identifiants et Téléchargement ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  🔒 Security & Credentials
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Immediately update your master administrator email and dashboard password below.
                </p>
              </div>
              <a
                href="#security-settings"
                className="mt-4 w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-lg transition"
              >
                Change Admin Login & Password &rarr;
              </a>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  📦 Full Source Code Package (.ZIP)
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Download the complete uncompiled project archive directly to your computer.
                </p>
              </div>
              <a
                href="/code-source.zip"
                download="code-source.zip"
                className="mt-4 w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-lg transition inline-block"
              >
                Download code-source.zip
              </a>
            </div>
          </div>

          {/* Stack technique & Système de création */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              🛠️ Technology Stack & Tools Used
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <li>• <strong>Framework :</strong> Next.js (App Router), React 19, TypeScript</li>
              <li>• <strong>Styling :</strong> Tailwind CSS avec Dark Mode natif</li>
              <li>• <strong>Artificial Intelligence :</strong> Google Gemini API / AI Studio</li>
              <li>• <strong>Data & Deliveries :</strong> Sync Google Sheets & Catalogues dans <code>data/</code></li>
            </ul>
          </div>

          {/* Recommandations de personnalisation */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              📋 Customization Roadmap for Resale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div>1. <strong>Branding :</strong> Replace logos in <code>components/ui/BrandLogo.tsx</code>.</div>
              <div>2. <strong>API Keys :</strong> Put your Gemini & Stripe keys in your <code>.env</code> file.</div>
              <div>3. <strong>Catalog :</strong> Edit your licenses and prices in <code>data/products.ts</code>.</div>
              <div>4. <strong>Domain :</strong> Connect your custom domain in Vercel settings.</div>
            </div>
          </div>
        </div>

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