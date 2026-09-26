'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
} from '@/lib/googleWorkspaceAuth';
import {
  listNovalysSpreadsheets,
  createNovalysSpreadsheet,
  syncOrdersToSpreadsheet,
  syncLicensesToSpreadsheet,
  GoogleSpreadsheetItem,
} from '@/lib/googleSheets';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Plus,
  ArrowUpRight,
  Database,
  KeyRound,
  ShieldCheck,
  LogOut,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { User } from 'firebase/auth';

export function GoogleSheetsManager() {
  const { orders, digitalItems, showToast } = useShop();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState<GoogleSpreadsheetItem[]>([]);
  const [selectedSheetId, setSelectedSheetId] = useState<string>('');
  const [selectedSheetUrl, setSelectedSheetUrl] = useState<string>('');
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [isExportingOrders, setIsExportingOrders] = useState(false);
  const [isExportingKeys, setIsExportingKeys] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: async () => {},
  });

  const loadSpreadsheets = useCallback(async (authToken: string) => {
    setIsLoadingSheets(true);
    try {
      const list = await listNovalysSpreadsheets(authToken);
      setSpreadsheets(list);
      if (list.length > 0) {
        setSelectedSheetId((prevId) => {
          if (!prevId) {
            setSelectedSheetUrl(list[0].webViewLink || `https://docs.google.com/spreadsheets/d/${list[0].id}`);
            return list[0].id;
          }
          return prevId;
        });
      }
    } catch (err: any) {
      console.warn('Could not list Google Drive files:', err.message);
    } finally {
      setIsLoadingSheets(false);
    }
  }, []);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setCurrentUser(user);
        setToken(cachedToken);
        loadSpreadsheets(cachedToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [loadSpreadsheets]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setToken(res.accessToken);
        showToast(`Connecté avec succès (${res.user.email})`, 'success');
        await loadSpreadsheets(res.accessToken);
      }
    } catch (err: any) {
      console.error('Erreur de connexion Google:', err);
      showToast(err.message || 'Échec de la connexion à Google Workspace', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setToken(null);
    setSpreadsheets([]);
    setSelectedSheetId('');
    setSelectedSheetUrl('');
    showToast('Déconnecté de Google Workspace', 'info');
  };

  // User Confirmation Action Handler (Mandatory per workspace guidelines)
  const triggerWithConfirmation = (
    title: string,
    description: string,
    action: () => Promise<void>
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      action,
    });
  };

  const handleCreateNewSheet = async () => {
    if (!token) return;
    setIsCreatingSheet(true);
    try {
      const { spreadsheetId, spreadsheetUrl } = await createNovalysSpreadsheet(token);
      setSelectedSheetId(spreadsheetId);
      setSelectedSheetUrl(spreadsheetUrl);

      // Perform initial export of current orders and vault
      await syncOrdersToSpreadsheet(token, spreadsheetId, orders);
      await syncLicensesToSpreadsheet(token, spreadsheetId, digitalItems);

      setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
      await loadSpreadsheets(token);
      showToast('Nouvelle feuille Google Sheets créée et initialisée !', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la création de la feuille', 'error');
    } finally {
      setIsCreatingSheet(false);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleSyncOrders = async () => {
    if (!token || !selectedSheetId) {
      showToast('Veuillez d\'abord sélectionner ou créer une feuille Google Sheets', 'error');
      return;
    }
    setIsExportingOrders(true);
    try {
      const count = await syncOrdersToSpreadsheet(token, selectedSheetId, orders);
      setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
      showToast(`${count} commandes exportées avec succès dans Google Sheets !`, 'success');
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'exportation des commandes", 'error');
    } finally {
      setIsExportingOrders(false);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleSyncVault = async () => {
    if (!token || !selectedSheetId) {
      showToast('Veuillez d\'abord sélectionner ou créer une feuille Google Sheets', 'error');
      return;
    }
    setIsExportingKeys(true);
    try {
      const count = await syncLicensesToSpreadsheet(token, selectedSheetId, digitalItems);
      setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
      showToast(`${count} clés et licences exportées dans Google Sheets !`, 'success');
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'exportation des licences", 'error');
    } finally {
      setIsExportingKeys(false);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide">
                Intégration Google Sheets &amp; Workspace
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live Sync API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Exportez automatiquement et synchronisez vos commandes, transactions multi-devises (DZD, SAR, USD, EUR) et inventaires de licences logicielles directement sur Google Sheets.
            </p>
          </div>
        </div>

        {/* Auth / Account Controls */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 p-2 pl-3 rounded-xl">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-none">
                  {currentUser.displayName || currentUser.email}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Google Connecté</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors cursor-pointer"
                title="Déconnexion Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg shadow-white/10 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isAuthenticating ? 'Connexion en cours...' : 'Se connecter avec Google'}</span>
            </button>
          )}
        </div>
      </div>

      {!currentUser ? (
        /* Sign-in Call to Action */
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">
              Connectez votre compte Google pour activer l&apos;exportation
            </h3>
            <p className="text-xs text-slate-400">
              Avec votre autorisation, l&apos;application créera et synchronisera des classeurs Google Sheets dans votre espace Google Drive personnel pour vos commandes et licences.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Autoriser Google Sheets &amp; Drive</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Synchronizer Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Spreadsheet Selector & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Feuille Google Sheets Active
                </h3>
                <button
                  type="button"
                  onClick={() => token && loadSpreadsheets(token)}
                  disabled={isLoadingSheets}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Actualiser la liste des feuilles Google Drive"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSheets ? 'animate-spin' : ''}`} />
                  <span>Actualiser</span>
                </button>
              </div>

              {/* Spreadsheet Picker */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase block">
                  Sélectionnez un classeur :
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSheetId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedSheetId(id);
                      const found = spreadsheets.find((s) => s.id === id);
                      if (found?.webViewLink) {
                        setSelectedSheetUrl(found.webViewLink);
                      } else {
                        setSelectedSheetUrl(`https://docs.google.com/spreadsheets/d/${id}`);
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    {spreadsheets.length === 0 ? (
                      <option value="">Aucune feuille trouvée - Cliquez sur Créer ci-dessous</option>
                    ) : (
                      spreadsheets.map((sheet) => (
                        <option key={sheet.id} value={sheet.id}>
                          {sheet.name}
                        </option>
                      ))
                    )}
                  </select>

                  {selectedSheetUrl && (
                    <a
                      href={selectedSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Ouvrir directement dans Google Sheets"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ouvrir</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Create new spreadsheet button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    triggerWithConfirmation(
                      'Créer une nouvelle feuille Google Sheets',
                      'Cette action va créer un nouveau fichier nommé "Novalys Store - Commandes & Licences" dans votre compte Google Drive avec les onglets configurés.',
                      handleCreateNewSheet
                    )
                  }
                  disabled={isCreatingSheet}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isCreatingSheet ? 'Création en cours...' : 'Créer une Nouvelle Feuille Dédiée'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sync Controls Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Box 1: Sync Orders */}
              <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FileCheck className="w-5 h-5" />
                  </span>
                  <span className="font-mono text-xs text-slate-300 font-bold">
                    {orders.length} commandes en local
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Exporter les Commandes &amp; Ventes
                </h4>
                <p className="text-xs text-slate-400">
                  Transfère toutes les commandes avec statuts, devises, coordonnées clients et clés délivrées dans l&apos;onglet &quot;Commandes &amp; Ventes&quot;.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    triggerWithConfirmation(
                      'Exporter les commandes vers Google Sheets',
                      `Voulez-vous synchroniser ${orders.length} commande(s) vers la feuille sélectionnée ?`,
                      handleSyncOrders
                    )
                  }
                  disabled={isExportingOrders || !selectedSheetId}
                  className="w-full px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isExportingOrders ? 'animate-spin' : ''}`} />
                  <span>{isExportingOrders ? 'Synchronisation...' : 'Synchroniser les Commandes'}</span>
                </button>
              </div>

              {/* Box 2: Sync Licenses */}
              <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <KeyRound className="w-5 h-5" />
                  </span>
                  <span className="font-mono text-xs text-slate-300 font-bold">
                    {digitalItems.length} clés dans le coffre
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Exporter le Coffre de Licences
                </h4>
                <p className="text-xs text-slate-400">
                  Sauvegarde votre inventaire de clés logicielles, leur statut de consommation et leurs associations de commande dans l&apos;onglet &quot;Coffre de Licences&quot;.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    triggerWithConfirmation(
                      'Exporter les licences logicielles',
                      `Voulez-vous exporter l'inventaire complet de ${digitalItems.length} clé(s) vers Google Sheets ?`,
                      handleSyncVault
                    )
                  }
                  disabled={isExportingKeys || !selectedSheetId}
                  className="w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isExportingKeys ? 'animate-spin' : ''}`} />
                  <span>{isExportingKeys ? 'Synchronisation...' : 'Synchroniser les Licences'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Specifications & Structure Info */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Garanties &amp; Structure Google Sheets
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">Colonnes Exportées Commandes :</span>
                <p className="text-[11px] text-slate-400">
                  ID Commande, Date/Heure, Nom, Email, Téléphone, Produits, Devise, Total Payé, Statut, Mode de Paiement, Bump VIP, Upsell, Clés Fournies.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block">Colonnes Exportées Coffre :</span>
                <p className="text-[11px] text-slate-400">
                  ID Clé, Produit, Clé/Compte, Statut (Disponible / Attribué), Réf Commande, Date Création.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">Dernière Synchronisation :</span>
                <p className="text-xs font-mono text-white">
                  {lastSyncTime ? `Aujourd'hui à ${lastSyncTime}` : 'Aucune synchronisation récente'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <p>
                🔒 Connexion sécurisée OAuth 2.0 via Google Workspace. Les données restent strictement dans votre compte Drive privé.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Modal for Destructive/Mutating Operations */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0e1626] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{confirmDialog.title}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmDialog.description}
            </p>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => confirmDialog.action()}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Confirmer l&apos;action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
