'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  CrmCustomer,
  CrmCustomerTag,
  CrmCampaign,
  CrmCampaignTarget,
  CrmCampaignChannel,
} from '@/types';
import { CRM_CAMPAIGN_TEMPLATES } from '@/data/crmData';
import {
  Users,
  UserCheck,
  Mail,
  Send,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Sparkles,
  MessageSquare,
  Smartphone,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Eye,
  FileText,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Tag,
  ShieldCheck,
  Download,
  Share2,
} from 'lucide-react';

export function CrmManager() {
  const {
    crmCustomers,
    crmCampaigns,
    crmMetrics,
    sendCrmCampaign,
    deleteCrmCampaign,
    addOrUpdateCrmCustomer,
    deleteCrmCustomer,
    updateCrmCustomerNotes,
    products,
    showToast,
  } = useShop();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'recent_buyers' | 'inactive_30d' | 'newsletter_only' | 'vip_only'
  >('all');

  // Modal State for New Campaign
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignTarget, setCampaignTarget] = useState<CrmCampaignTarget>('all');
  const [targetProductName, setTargetProductName] = useState('Windows 11 Professionnel');
  const [campaignChannel, setCampaignChannel] = useState<CrmCampaignChannel>('email');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('upsell');
  const [campaignSubject, setCampaignSubject] = useState(
    '🎁 -30% VIP Membre : Complétez votre suite logicielle avec NOVALYS'
  );
  const [campaignPromoCode, setCampaignPromoCode] = useState('VIP30PRO');
  const [campaignMessageBody, setCampaignMessageBody] = useState(
    CRM_CAMPAIGN_TEMPLATES[0].body
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Modal State for Customer Notes / Detail
  const [selectedCustomerForNotes, setSelectedCustomerForNotes] = useState<CrmCustomer | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Quick Action for 1-Click Retargeting from Table
  const handleOpenDirectRetarget = (customer: CrmCustomer) => {
    setCampaignTitle(`Relance directe : ${customer.name}`);
    setCampaignTarget('all');
    if (customer.purchasedProducts.length > 0) {
      setTargetProductName(customer.purchasedProducts[0]);
    }
    setCampaignChannel(customer.phone ? 'whatsapp' : 'email');
    setIsCampaignModalOpen(true);
  };

  // Filter contacts dynamically
  const filteredCustomers = useMemo(() => {
    return crmCustomers.filter((customer) => {
      // 1. Text Search Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        (customer.phone && customer.phone.toLowerCase().includes(q)) ||
        customer.countryLabel.toLowerCase().includes(q) ||
        customer.purchasedProducts.some((p) => p.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 2. Segment Filter
      const now = new Date().getTime();
      const lastContactTime = new Date(customer.lastContactDate).getTime();
      const daysSinceLastContact = Math.floor((now - lastContactTime) / (1000 * 3600 * 24));

      if (selectedFilter === 'recent_buyers') {
        return (
          (customer.tag === 'Acheteur 1 produit' || customer.tag === 'Acheteur VIP') &&
          daysSinceLastContact <= 14
        );
      }
      if (selectedFilter === 'inactive_30d') {
        return daysSinceLastContact >= 30;
      }
      if (selectedFilter === 'newsletter_only') {
        return customer.tag === 'Lead Newsletter';
      }
      if (selectedFilter === 'vip_only') {
        return customer.tag === 'Acheteur VIP';
      }

      return true;
    });
  }, [crmCustomers, searchQuery, selectedFilter]);

  // Recipient Count estimate for Campaign
  const recipientCountEstimate = useMemo(() => {
    if (campaignTarget === 'all') return crmCustomers.length;
    if (campaignTarget === 'newsletter_only') {
      return crmCustomers.filter((c) => c.tag === 'Lead Newsletter').length;
    }
    if (campaignTarget === 'vip_only') {
      return crmCustomers.filter((c) => c.tag === 'Acheteur VIP').length;
    }
    if (campaignTarget === 'specific_product') {
      return crmCustomers.filter((c) =>
        c.purchasedProducts.some(
          (p) =>
            p.toLowerCase().includes(targetProductName.toLowerCase()) ||
            targetProductName.toLowerCase().includes(p.toLowerCase())
        )
      ).length;
    }
    return crmCustomers.length;
  }, [crmCustomers, campaignTarget, targetProductName]);

  // Render Template with dynamic variables
  const renderPreviewText = (text: string) => {
    const sampleCustomer = crmCustomers[0] || {
      name: 'Karim Benali',
      purchasedProducts: ['Windows 11 Professionnel'],
    };
    const prod =
      sampleCustomer.purchasedProducts.length > 0
        ? sampleCustomer.purchasedProducts[0]
        : targetProductName || 'votre licence';

    return text
      .replace(/{{nom_client}}/g, sampleCustomer.name)
      .replace(/{{produit_achete}}/g, prod)
      .replace(/{{code_promo_prive}}/g, campaignPromoCode || 'VIP30PRO')
      .replace(/{{lien_boutique}}/g, 'https://novalys.shop');
  };

  // Template switch handler
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = CRM_CAMPAIGN_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setCampaignSubject(tmpl.defaultSubject);
      setCampaignChannel(tmpl.defaultChannel);
      setCampaignMessageBody(tmpl.body);
    }
  };

  // Variable insertion in editor
  const handleInsertVariable = (varName: string) => {
    setCampaignMessageBody((prev) => `${prev} {{${varName}}}`);
  };

  // Send campaign submit
  const handleSendCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) {
      showToast('Veuillez donner un titre à votre campagne.', 'warning');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      sendCrmCampaign({
        title: campaignTitle,
        target: campaignTarget,
        targetProductName: campaignTarget === 'specific_product' ? targetProductName : undefined,
        channel: campaignChannel,
        templateId: selectedTemplateId,
        subject: campaignSubject,
        messageBody: campaignMessageBody,
        promoCode: campaignPromoCode,
        recipientCount: Math.max(1, recipientCountEstimate),
        estimatedOpenRate: campaignChannel === 'whatsapp' ? 88.5 : 71.4,
      });

      setIsSending(false);
      setIsCampaignModalOpen(false);
    }, 600);
  };

  // Export Contacts to CSV
  const handleExportCsv = () => {
    const headers = [
      'Nom',
      'Email',
      'Telephone',
      'Pays',
      'Tag',
      'Commandes',
      'Total_Depense',
      'Devise',
      'Produits_Achetes',
      'Dernier_Contact',
    ];
    const rows = crmCustomers.map((c) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone || ''}"`,
      `"${c.countryLabel}"`,
      `"${c.tag}"`,
      c.ordersCount,
      c.totalSpent,
      c.currency,
      `"${c.purchasedProducts.join(', ')}"`,
      `"${c.lastContactDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `novalys_crm_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export CSV des contacts CRM téléchargé !', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              CRM &amp; Fidélisation Clients
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {crmCustomers.length} Contacts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Base de données clients unifiée, segmentation avancée et campagnes d&apos;email &amp; WhatsApp marketing pour fidéliser et relancer le réachat.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title="Exporter la base au format CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCampaignTitle('Campagne Retargeting VIP');
              setIsCampaignModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nouvelle Campagne / Relance</span>
          </button>
        </div>
      </div>

      {/* SECTION A: MÉTRIQUES GLOBALES DU CRM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Clients Actifs */}
        <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Clients Actifs (Acheteurs)
            </span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {crmMetrics.totalActiveClients}
            </span>
            <span className="text-xs text-blue-400 font-semibold">
              {Math.round((crmMetrics.totalActiveClients / Math.max(1, crmCustomers.length)) * 100)}% de la base
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Clients ayant effectué au moins 1 commande validée
          </p>
        </div>

        {/* Metric 2: Abonnés Newsletter */}
        <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Abonnés Newsletter (Leads)
            </span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Mail className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-300 font-mono">
              {crmMetrics.newsletterSubscribers}
            </span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">
              Prêts pour Upsell
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Prospects qualifiés capturés via les landing pages
          </p>
        </div>

        {/* Metric 3: Taux de Réachat / LTV */}
        <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Taux de Réachat &amp; LTV
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {crmMetrics.repeatPurchaseRate}%
            </span>
            <span className="text-xs text-slate-300 font-semibold font-mono">
              LTV: ${crmMetrics.averageLtvUsd}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Valeur moyenne à vie par client (~{Math.round(crmMetrics.averageLtvUsd * 230).toLocaleString()} DZD)
          </p>
        </div>

        {/* Metric 4: Campagnes & Taux d'Ouverture */}
        <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Campagnes &amp; Taux d&apos;Ouverture
            </span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Send className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-300 font-mono">
              {crmMetrics.campaignsSentCount}
            </span>
            <span className="text-xs text-purple-400 font-semibold font-mono">
              ~{crmMetrics.averageOpenRate}% Ouvertures
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Campagnes Email &amp; WhatsApp marketing délivrées
          </p>
        </div>
      </div>

      {/* SECTION B: BASE DE DONNÉES CLIENTS & FILTRES DE SEGMENTATION */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Base de Données Clients &amp; Segmentation
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Filtrez et segmentez vos acheteurs pour maximiser l&apos;impact de vos offres.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher nom, email, wilaya, logiciel..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Quick 1-Click Segmentation Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Segments :
          </span>

          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Tous les contacts ({crmCustomers.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('recent_buyers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'recent_buyers'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Acheteurs récents (Prêts pour Upsell)
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('vip_only')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'vip_only'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Acheteurs VIP (2+ achats)
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('newsletter_only')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'newsletter_only'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Abonnés Newsletter uniquement
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('inactive_30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'inactive_30d'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Clients inactifs (+30 jours)
          </button>
        </div>

        {/* Dynamic Contacts Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0a101d] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Contact (Nom / Email / Téléphone)</th>
                <th className="py-3 px-3">Pays / Région</th>
                <th className="py-3 px-3">Produits Achetés</th>
                <th className="py-3 px-3 text-right">Total Dépensé (LTV)</th>
                <th className="py-3 px-3 text-center">Statut / Tag</th>
                <th className="py-3 px-3">Dernier Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aucun contact trouvé pour cette sélection ou recherche.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const tagColors: Record<CrmCustomerTag, string> = {
                    'Acheteur VIP': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                    'Acheteur 1 produit': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                    'Lead Newsletter': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                    'Panier Incomplet': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
                  };

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-900/40 transition-colors group"
                    >
                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 border border-slate-700">
                            {customer.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{customer.name}</span>
                              {customer.notes && (
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
                                  title={customer.notes}
                                />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                <span>{customer.phone}</span>
                                <a
                                  href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300"
                                  title="Ouvrir WhatsApp"
                                >
                                  <Smartphone className="w-3 h-3 inline" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Country & Region */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-base">{customer.flag}</span>
                          <span className="text-slate-300 truncate max-w-[120px]">
                            {customer.countryLabel}
                          </span>
                        </div>
                      </td>

                      {/* Purchased Products */}
                      <td className="py-3 px-3">
                        {customer.purchasedProducts.length === 0 ? (
                          <span className="text-[11px] text-slate-500 italic">
                            Aucun achat (Lead prospect)
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {customer.purchasedProducts.map((p, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium truncate max-w-[160px]"
                                title={p}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Total Spent LTV */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-mono font-bold text-white text-xs">
                          {customer.totalSpent > 0 ? (
                            <>
                              {customer.totalSpent.toLocaleString()} {customer.currency}
                            </>
                          ) : (
                            <span className="text-slate-500 font-normal">0 {customer.currency}</span>
                          )}
                        </div>
                        {customer.totalSpentUsd > 0 && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            ~${customer.totalSpentUsd} USD
                          </div>
                        )}
                      </td>

                      {/* Status / Tag */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                            tagColors[customer.tag] || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {customer.tag}
                        </span>
                      </td>

                      {/* Last Contact */}
                      <td className="py-3 px-3">
                        <div className="text-[11px] text-slate-300">
                          {new Date(customer.lastContactDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(customer.lastContactDate).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDirectRetarget(customer)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors cursor-pointer"
                            title="Relancer ce client par Email ou WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomerForNotes(customer);
                              setTempNotes(customer.notes || '');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                            title="Consulter ou modifier les notes"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Supprimer le contact ${customer.name} ?`)) {
                                deleteCrmCustomer(customer.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                            title="Supprimer le contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION C: GESTIONNAIRE DE CAMPAGNES & LETTRES DE RELANCE */}
      <div className="bg-[#0e1626] rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-400" />
              Gestionnaire de Campagnes &amp; Lettres de Relance (Email / WhatsApp)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historique des envois marketing, templates CRO haute conversion et suivi des ouvertures.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Créer une Campagne de Relance</span>
          </button>
        </div>

        {/* Campaign History Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0a101d] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Titre de la Campagne</th>
                <th className="py-3 px-3">Cible / Segment</th>
                <th className="py-3 px-3 text-center">Canal</th>
                <th className="py-3 px-3 text-center">Destinataires</th>
                <th className="py-3 px-3">Taux d&apos;Ouverture Estimé</th>
                <th className="py-3 px-3">Statut &amp; Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {crmCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aucune campagne enregistrée. Cliquez sur &quot;Créer une Campagne&quot; pour lancer votre première relance.
                  </td>
                </tr>
              ) : (
                crmCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{camp.title}</div>
                      <div className="text-[11px] text-slate-400 italic truncate max-w-sm">
                        {camp.subject}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                        {camp.target === 'specific_product'
                          ? `Acheteurs: ${camp.targetProductName}`
                          : camp.target === 'newsletter_only'
                          ? 'Abonnés Newsletter'
                          : camp.target === 'vip_only'
                          ? 'Acheteurs VIP'
                          : 'Tous les contacts'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          camp.channel === 'whatsapp'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : camp.channel === 'telegram'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {camp.channel === 'whatsapp' ? (
                          <>
                            <Smartphone className="w-3 h-3" />
                            WhatsApp
                          </>
                        ) : camp.channel === 'telegram' ? (
                          <>
                            <Send className="w-3 h-3" />
                            Telegram
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3" />
                            Email
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-white">
                      {camp.recipientCount}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                            style={{ width: `${camp.estimatedOpenRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {camp.estimatedOpenRate}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Envoyé</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(camp.sentAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => deleteCrmCampaign(camp.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Supprimer la campagne de l'historique"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: NOUVELLE CAMPAGNE & ÉDITEUR CRO ================= */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0e1626] border border-slate-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Éditeur de Campagne &amp; Lettre de Relance CRO
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Personnalisez votre message avec des variables dynamiques et ciblez votre audience.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSendCampaignSubmit} className="space-y-5">
              {/* Row 1: Titre Campagne & Canal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Nom Interne de la Campagne *
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="Ex: Upsell Windows 11 vers Office 2024 (-30%)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Canal de Diffusion *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCampaignChannel('email')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                        campaignChannel === 'email'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCampaignChannel('whatsapp')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                        campaignChannel === 'whatsapp'
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCampaignChannel('telegram')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                        campaignChannel === 'telegram'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Sélecteur de Cible & Produit Cible */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Audience Cible *
                  </label>
                  <select
                    value={campaignTarget}
                    onChange={(e) => setCampaignTarget(e.target.value as CrmCampaignTarget)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">Tous les contacts enregistrés</option>
                    <option value="specific_product">Acheteurs d&apos;un logiciel spécifique (Upsell)</option>
                    <option value="newsletter_only">Inscrits Newsletter uniquement (Prospects chauds)</option>
                    <option value="vip_only">Acheteurs VIP uniquement (Clients fidèles)</option>
                  </select>
                </div>

                {campaignTarget === 'specific_product' ? (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Produit Acheté par la Cible
                    </label>
                    <select
                      value={targetProductName}
                      onChange={(e) => setTargetProductName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.title || p.name}>
                          {p.title || p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Code Promo Privé Associé
                    </label>
                    <input
                      type="text"
                      value={campaignPromoCode}
                      onChange={(e) => setCampaignPromoCode(e.target.value.toUpperCase())}
                      placeholder="Ex: VIP30PRO"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Row 3: Modèles de lettres pré-rédigés sélectionnables (Templates CRO) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Modèles de lettres pré-rédigés (Templates CRO Haute Conversion) :
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CRM_CAMPAIGN_TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTemplateId === tmpl.id
                          ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{tmpl.name}</span>
                        {selectedTemplateId === tmpl.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {tmpl.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: Sujet & Variables */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Objet du Message / Titre *
                </label>
                <input
                  type="text"
                  required
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="Objet accrocheur de votre email ou message WhatsApp..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Dynamic Variables Pill Bar */}
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  Insérer Variable :
                </span>
                <button
                  type="button"
                  onClick={() => handleInsertVariable('nom_client')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-purple-300 border border-purple-500/30 cursor-pointer"
                >
                  &#123;&#123;nom_client&#125;&#125;
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertVariable('produit_achete')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-cyan-500/30 cursor-pointer"
                >
                  &#123;&#123;produit_achete&#125;&#125;
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertVariable('code_promo_prive')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-emerald-300 border border-emerald-500/30 cursor-pointer"
                >
                  &#123;&#123;code_promo_prive&#125;&#125;
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertVariable('lien_boutique')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-blue-300 border border-blue-500/30 cursor-pointer"
                >
                  &#123;&#123;lien_boutique&#125;&#125;
                </button>

                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isPreviewMode ? 'Mode Éditeur' : 'Prévisualiser en Direct'}</span>
                  </button>
                </div>
              </div>

              {/* Message Body or Live Preview */}
              {isPreviewMode ? (
                <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">
                      Aperçu tel que reçu par un client type (ex: Karim Benali) :
                    </span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Variables Résolues
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-white border-b border-slate-800/80 pb-2">
                      Objet : {renderPreviewText(campaignSubject)}
                    </div>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                      {renderPreviewText(campaignMessageBody)}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    rows={8}
                    required
                    value={campaignMessageBody}
                    onChange={(e) => setCampaignMessageBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
              )}

              {/* Bottom Target Reassurance & Action */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>
                    Cette campagne sera délivrée à{' '}
                    <strong className="text-white font-mono">
                      {Math.max(1, recipientCountEstimate)} contacts ciblés
                    </strong>{' '}
                    via <strong className="text-purple-300 uppercase">{campaignChannel}</strong>.
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsCampaignModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer la Campagne Maintenant</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NOTES CLIENT ================= */}
      {selectedCustomerForNotes && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0e1626] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Notes &amp; Historique : {selectedCustomerForNotes.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCustomerForNotes(null)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Annotations internes pour l&apos;équipe commerciale :
              </label>
              <textarea
                rows={4}
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Ex: Client très réactif par BaridiMob. Souhaite être prévenu pour Office 2024 Pro."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustomerForNotes(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  updateCrmCustomerNotes(selectedCustomerForNotes.id, tempNotes);
                  setSelectedCustomerForNotes(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 cursor-pointer"
              >
                Enregistrer les Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
