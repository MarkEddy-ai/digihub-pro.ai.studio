'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  X,
  KeyRound,
  Copy,
  Download,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export function LicenseVaultModal() {
  const { isVaultOpen, setIsVaultOpen, orders, showToast } = useShop();
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [vaultSearch, setVaultSearch] = useState('');

  if (!isVaultOpen) return null;

  // Flatten all licenses from all orders
  const allLicenses = orders.flatMap((ord) =>
    (ord.licenses || []).map((lic) => ({
      ...lic,
      orderNumber: ord.orderNumber,
      orderDate: ord.createdAt,
    }))
  );

  const filteredLicenses = allLicenses.filter((lic) => {
    if (!vaultSearch.trim()) return true;
    const q = vaultSearch.toLowerCase();
    return (
      lic.productName.toLowerCase().includes(q) ||
      lic.licenseKey.toLowerCase().includes(q) ||
      lic.orderNumber.toLowerCase().includes(q)
    );
  });

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    showToast('Clé copiée dans votre presse-papier !');
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Coffre-fort de Licences Numériques
              </h2>
              <p className="text-xs text-slate-400">
                Vos clés officielles sauvegardées et accessibles en permanence.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVaultOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside vault */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher parmi vos clés ou logiciels..."
              value={vaultSearch}
              onChange={(e) => setVaultSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {filteredLicenses.length} licence(s)
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredLicenses.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <KeyRound className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Aucune licence trouvée</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Toutes les clés achetées sur la boutique apparaîtront automatiquement ici avec leur statut d&apos;activation.
              </p>
            </div>
          ) : (
            filteredLicenses.map((lic) => (
              <div
                key={lic.id}
                className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    {lic.productImage ? (
                      <img
                        src={lic.productImage}
                        alt={lic.productName}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                        <KeyRound className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{lic.productName}</h4>
                      <div className="text-[11px] text-slate-400">
                        Commande <span className="font-mono text-cyan-400">{lic.orderNumber}</span> · {lic.platform}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Licence active &amp; certifiée</span>
                    </span>
                  </div>
                </div>

                {/* Key display with copy */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 font-medium">Clé d&apos;activation produit :</div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
                    <span className="select-all tracking-wider font-bold">{lic.licenseKey}</span>
                    <button
                      onClick={() => handleCopyKey(lic.licenseKey, lic.id)}
                      className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-sans font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKeyId === lic.id ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                {/* Actions: Guide & Support */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <button
                    onClick={() => showToast('Téléchargement du guide officiel en cours...')}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger le guide d&apos;installation (PDF)</span>
                  </button>

                  <a
                    href="mailto:cherchellsgpp@gmail.com?subject=Assistance%20Licence"
                    className="hover:text-white transition-colors"
                  >
                    Besoin d&apos;aide ?
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F17] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chiffrement AES 256-bit pour vos données de licence</span>
          </div>
          <button
            onClick={() => setIsVaultOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Fermer le coffre
          </button>
        </div>
      </div>
    </div>
  );
}
