'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { Product, DigitalItem } from '@/types';
import {
  KeyRound,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Search,
  Layers,
  Sparkles,
  Gamepad2,
  ShieldAlert,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

export function KeyVaultManager() {
  const { products, digitalItems, addDigitalKeys, deleteDigitalKey, showToast, formatPrice } = useShop();

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return products[0]?.id || 'prod-windows-11-pro';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [filterKeyStatus, setFilterKeyStatus] = useState<'all' | 'available' | 'delivered'>('all');

  // Textarea bulk input
  const [rawKeysInput, setRawKeysInput] = useState('');
  const [isInserting, setIsInserting] = useState(false);

  // Hidden/revealed keys state
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});

  // Active product
  const activeProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Keys for active product
  const productKeys = useMemo(() => {
    if (!activeProduct) return [];
    return digitalItems.filter((item) => item.product_id === activeProduct.id);
  }, [digitalItems, activeProduct]);

  // Available vs Delivered counts
  const availableCount = useMemo(() => {
    return productKeys.filter((k) => !k.is_delivered).length;
  }, [productKeys]);

  const deliveredCount = useMemo(() => {
    return productKeys.filter((k) => k.is_delivered).length;
  }, [productKeys]);

  // Filtered keys
  const filteredKeys = useMemo(() => {
    return productKeys.filter((item) => {
      const matchesSearch = item.secret_data.toLowerCase().includes(keySearch.toLowerCase()) ||
        (item.order_id && item.order_id.toLowerCase().includes(keySearch.toLowerCase()));

      if (!matchesSearch) return false;
      if (filterKeyStatus === 'available') return !item.is_delivered;
      if (filterKeyStatus === 'delivered') return item.is_delivered;
      return true;
    });
  }, [productKeys, keySearch, filterKeyStatus]);

  // Filtered product list for sidebar selector
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.platform?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  // Count lines in textarea
  const detectedKeysCount = useMemo(() => {
    return rawKeysInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0).length;
  }, [rawKeysInput]);

  // Handle bulk submission
  const handleBulkInsert = () => {
    if (!activeProduct) return;
    if (detectedKeysCount === 0) {
      showToast('Veuillez saisir au moins une clé dans le champ texte.', 'warning');
      return;
    }

    setIsInserting(true);
    setTimeout(() => {
      addDigitalKeys(activeProduct.id, rawKeysInput);
      setRawKeysInput('');
      setIsInserting(false);
    }, 200);
  };

  const toggleReveal = (keyId: string) => {
    setRevealedKeyIds((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const handleCopyKey = (secretData: string) => {
    navigator.clipboard.writeText(secretData);
    showToast('Clé copiée dans le presse-papier !', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-wide">
              Coffre de Clés &amp; Stock Digital (Inventory)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Insérez vos clés CD et comptes en masse. Suivez le stock restant en temps réel et prévenez les ruptures (&lt; 3 unités).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex items-center gap-2">
            <span className="text-slate-400">Total clés dans le coffre :</span>
            <span className="font-mono font-bold text-cyan-300 text-sm">
              {digitalItems.filter((k) => !k.is_delivered).length} disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Products List / Right Selected Product Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Sélectionnez un Produit
            </h2>
            <span className="text-xs text-slate-400">{filteredProducts.length} produits</span>
          </div>

          {/* Search Product */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer jeu ou logiciel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Products List */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => {
              const isSelected = prod.id === selectedProductId;
              const isCritical = prod.stockCount < 3;

              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {prod.platform || 'Digital'}
                      </span>
                      <p className="text-xs font-bold text-white truncate">{prod.title || prod.name}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{prod.category}</span>
                      <span>•</span>
                      <span className="font-mono text-cyan-300">{formatPrice(prod.price_dzd || prod.price)}</span>
                    </div>
                  </div>

                  {/* Stock Badge with < 3 alert */}
                  <div className="text-right shrink-0">
                    {isCritical ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10px] font-extrabold animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>{prod.stockCount} dispo</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{prod.stockCount} dispo</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Product Vault (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeProduct ? (
            <>
              {/* Product Header & Live Stock Alert */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.title || activeProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          {activeProduct.platform || 'Plateforme'}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                          {activeProduct.category}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 rounded">
                          Type : {activeProduct.delivery_type || 'key'}
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-white mt-1">
                        {activeProduct.title || activeProduct.name}
                      </h2>
                    </div>
                  </div>

                  {/* Stock counter indicators */}
                  <div className="flex items-center gap-3">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Disponibles</span>
                      <span className={`text-xl font-black font-mono ${availableCount < 3 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                        {availableCount}
                      </span>
                    </div>

                    <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Délivrées</span>
                      <span className="text-xl font-black font-mono text-blue-400">
                        {deliveredCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Alert Warning Banner if < 3 */}
                {availableCount < 3 && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        ALERTE STOCK CRITIQUE : Il ne reste que <strong>{availableCount} unité(s)</strong> pour ce produit ! Insérez de nouvelles clés ci-dessous.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 1: Bulk Insertion Textarea */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Insertion en masse de Clés / Comptes (Textarea)
                    </h3>
                  </div>

                  {detectedKeysCount > 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                      {detectedKeysCount} clé{detectedKeysCount > 1 ? 's' : ''} détectée{detectedKeysCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Collez vos clés d&apos;activation, comptes ou identifiants (achetés sur Plati.market, GGsel ou FunPay). Insérez <strong>une clé par ligne</strong>.
                </p>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={rawKeysInput}
                    onChange={(e) => setRawKeysInput(e.target.value)}
                    placeholder={`Exemple :\nSTEAM-ABC12-DEF34-GHI56\nSTEAM-JKL78-MNO90-PQR12\nuser_pro@fastmail.com:Password2026!`}
                    className="w-full p-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-y"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRawKeysInput('')}
                    disabled={!rawKeysInput}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    Effacer le champ
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkInsert}
                    disabled={detectedKeysCount === 0 || isInserting}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {isInserting
                        ? 'Ajout en cours...'
                        : `Ajouter ${detectedKeysCount > 0 ? detectedKeysCount : ''} Clé${detectedKeysCount > 1 ? 's' : ''} au Coffre`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Section 2: Table of Keys in Vault */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Inventaire des Clés Enregistrées ({productKeys.length})
                    </h3>
                  </div>

                  {/* Filter by status */}
                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                      <button
                        onClick={() => setFilterKeyStatus('all')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          filterKeyStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Toutes ({productKeys.length})
                      </button>
                      <button
                        onClick={() => setFilterKeyStatus('available')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          filterKeyStatus === 'available' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Disponibles ({availableCount})
                      </button>
                      <button
                        onClick={() => setFilterKeyStatus('delivered')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          filterKeyStatus === 'delivered' ? 'bg-blue-500/20 text-blue-300 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Délivrées ({deliveredCount})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search in keys */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Chercher une clé ou numéro de commande..."
                    value={keySearch}
                    onChange={(e) => setKeySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-3">Données Secrètes (Clé / Compte)</th>
                        <th className="py-2.5 px-3">Statut</th>
                        <th className="py-2.5 px-3">Commande Liée</th>
                        <th className="py-2.5 px-3">Date Ajout</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredKeys.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">
                            Aucune clé trouvée pour ce filtre. Utilisez le formulaire ci-dessus pour en insérer.
                          </td>
                        </tr>
                      ) : (
                        filteredKeys.map((item) => {
                          const isRevealed = !!revealedKeyIds[item.id];

                          return (
                            <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 font-mono">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-200">
                                    {isRevealed
                                      ? item.secret_data
                                      : item.secret_data.slice(0, 5) + '••••••••••••••••' + item.secret_data.slice(-4)}
                                  </span>

                                  <button
                                    onClick={() => toggleReveal(item.id)}
                                    className="p-1 text-slate-400 hover:text-white rounded"
                                    title={isRevealed ? 'Masquer la clé' : 'Afficher la clé'}
                                  >
                                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>

                                  <button
                                    onClick={() => handleCopyKey(item.secret_data)}
                                    className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                                    title="Copier la clé"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                {item.is_delivered ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                    Délivrée au client
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Disponible en stock
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 font-mono text-[11px]">
                                {item.order_id ? (
                                  <span className="text-cyan-400 font-semibold">{item.order_id}</span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                                {new Date(item.date_added).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>

                              <td className="py-2.5 px-3 text-right">
                                {!item.is_delivered ? (
                                  <button
                                    onClick={() => deleteDigitalKey(item.id)}
                                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                                    title="Supprimer du stock"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-600">Verrouillée</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center text-slate-500">
              Sélectionnez un produit dans la liste pour gérer son coffre de clés.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
