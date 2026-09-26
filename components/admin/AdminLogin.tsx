'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export function AdminLogin() {
  const { loginAdmin, setActiveTab } = useShop();
  const [email, setEmail] = useState('admin@novalys.dz');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(email, password);
    if (!success) {
      setError(true);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@novalys.dz');
    setPassword('admin123');
    setError(false);
  };

  return (
    <div className="min-h-screen bg-[#070A0F] flex flex-col justify-center items-center p-4">
      {/* Back to store button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            setActiveTab('home');
            window.location.href = '/';
          }}
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à la boutique client</span>
        </button>
        <span className="text-[11px] font-mono text-cyan-400/80">Espace Sécurisé</span>
      </div>

      <div className="w-full max-w-md bg-[#0F172A] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandLogo size="md" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portail Administrateur Back-Office</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Connexion au Tableau de Bord
          </h1>
          <p className="text-xs text-slate-400">
            Gestion des commandes clients, catalogue produits et statistiques.
          </p>
        </div>

        {/* Quick Fill Credentials Banner for easy evaluation */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Identifiants de démonstration :</span>
            <button
              onClick={handleQuickFill}
              className="text-cyan-400 font-semibold hover:underline text-[11px]"
            >
              Remplir automatiquement
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 truncate">
              admin@novalys.dz
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              admin123
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Adresse e-mail administrateur
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg text-center">
              Identifiants invalides. Utilisez <strong>admin@novalys.dz</strong> / <strong>admin123</strong>.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-98"
          >
            <Lock className="w-4 h-4" />
            <span>Accéder au Back-Office (/admin)</span>
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400 border-t border-slate-800 pt-3">
          Session persistante via stockage local sécurisé.
        </div>
      </div>
    </div>
  );
}
