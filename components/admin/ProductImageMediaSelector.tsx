'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Search,
  Sparkles,
  CheckCircle2,
  Trash2,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen,
  Eye,
  Tag,
  Check,
  Filter,
  ExternalLink,
  Layers,
} from 'lucide-react';

export interface StockMediaItem {
  id: string;
  title: string;
  category: 'tech_saas' | 'gaming_keys' | 'ai_tools' | 'office_productivity' | 'cybersecurity';
  categoryLabel: string;
  source: 'Unsplash' | 'Pexels';
  url: string;
  thumbnailUrl: string;
  tags: string[];
}

export const CURATED_STOCK_MEDIA: StockMediaItem[] = [
  // TECH & SAAS
  {
    id: 'stock-tech-01',
    title: 'Code Source & Architecture Logicielle',
    category: 'tech_saas',
    categoryLabel: 'Tech & SaaS',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&auto=format&fit=crop&q=70',
    tags: ['code', 'logiciel', 'software', 'developpeur', 'saas', 'programming'],
  },
  {
    id: 'stock-tech-02',
    title: 'Tableau de bord Cloud & Analytics',
    category: 'tech_saas',
    categoryLabel: 'Tech & SaaS',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=320&auto=format&fit=crop&q=70',
    tags: ['dashboard', 'cloud', 'analytics', 'saas', 'donnees', 'serveur'],
  },
  {
    id: 'stock-tech-03',
    title: 'Poste de travail Développeur Minimaliste',
    category: 'tech_saas',
    categoryLabel: 'Tech & SaaS',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=320&auto=format&fit=crop&q=70',
    tags: ['ordinateur', 'laptop', 'macbook', 'setup', 'tech', 'work'],
  },
  {
    id: 'stock-tech-04',
    title: 'Plateforme Digitale & Interface Web',
    category: 'tech_saas',
    categoryLabel: 'Tech & SaaS',
    source: 'Pexels',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&auto=format&fit=crop&q=70',
    tags: ['web', 'graphique', 'business', 'growth', 'marketing', 'outils'],
  },

  // GAMING & CLÉS
  {
    id: 'stock-gaming-01',
    title: 'Setup Gaming RGB Haute Performance',
    category: 'gaming_keys',
    categoryLabel: 'Gaming & Clés',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=320&auto=format&fit=crop&q=70',
    tags: ['gaming', 'pc', 'gamer', 'steam', 'epic', 'rgb', 'carte graphique'],
  },
  {
    id: 'stock-gaming-02',
    title: 'Clavier Mécanique Gamer Néon',
    category: 'gaming_keys',
    categoryLabel: 'Gaming & Clés',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&auto=format&fit=crop&q=70',
    tags: ['clavier', 'keyboard', 'esport', 'neon', 'jeu', 'steam'],
  },
  {
    id: 'stock-gaming-03',
    title: 'Manette Pro Console & Cyberpunk',
    category: 'gaming_keys',
    categoryLabel: 'Gaming & Clés',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=320&auto=format&fit=crop&q=70',
    tags: ['manette', 'controller', 'ps5', 'xbox', 'playstation', 'jeu'],
  },
  {
    id: 'stock-gaming-04',
    title: 'Arène Esport & Ambiance Neon',
    category: 'gaming_keys',
    categoryLabel: 'Gaming & Clés',
    source: 'Pexels',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=320&auto=format&fit=crop&q=70',
    tags: ['arcade', 'retro', 'esport', 'competition', 'jeux'],
  },

  // INTELLIGENCE ARTIFICIELLE
  {
    id: 'stock-ai-01',
    title: 'Réseau Neuronal & Intelligence Artificielle',
    category: 'ai_tools',
    categoryLabel: 'Intelligence Artificielle',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=320&auto=format&fit=crop&q=70',
    tags: ['ai', 'chatgpt', 'openai', 'reseau neuronal', 'machine learning', 'gpt-4o'],
  },
  {
    id: 'stock-ai-02',
    title: 'Onde Générative 3D Abstraite',
    category: 'ai_tools',
    categoryLabel: 'Intelligence Artificielle',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=320&auto=format&fit=crop&q=70',
    tags: ['claude', 'midjourney', 'design 3d', 'abstrait', 'generatif', 'ia'],
  },
  {
    id: 'stock-ai-03',
    title: 'Cerveau Digital & Données Connectées',
    category: 'ai_tools',
    categoryLabel: 'Intelligence Artificielle',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=320&auto=format&fit=crop&q=70',
    tags: ['cerveau', 'brain', 'deep learning', 'algorithme', 'gemini'],
  },
  {
    id: 'stock-ai-04',
    title: 'Interaction Homme-Machine & Robotique',
    category: 'ai_tools',
    categoryLabel: 'Intelligence Artificielle',
    source: 'Pexels',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=320&auto=format&fit=crop&q=70',
    tags: ['robot', 'futur', 'automation', 'copilot', 'smart'],
  },

  // PRODUCTIVITÉ & OFFICE
  {
    id: 'stock-office-01',
    title: 'Bureau Moderne Windows & Bureautique',
    category: 'office_productivity',
    categoryLabel: 'Productivité Office',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=320&auto=format&fit=crop&q=70',
    tags: ['windows', 'windows 11', 'pc', 'bureau', 'office', 'microsoft'],
  },
  {
    id: 'stock-office-02',
    title: 'Espace de Travail Moderne & Épuré',
    category: 'office_productivity',
    categoryLabel: 'Productivité Office',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=320&auto=format&fit=crop&q=70',
    tags: ['office', 'bureautique', 'entreprise', 'productivite', 'tableur'],
  },
  {
    id: 'stock-office-03',
    title: 'Documents Professionnels & Tableurs Excel',
    category: 'office_productivity',
    categoryLabel: 'Productivité Office',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=320&auto=format&fit=crop&q=70',
    tags: ['excel', 'word', 'powerpoint', 'comptabilite', 'rapport'],
  },
  {
    id: 'stock-office-04',
    title: 'Tablette Graphique & Outils Créatifs',
    category: 'office_productivity',
    categoryLabel: 'Productivité Office',
    source: 'Pexels',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=320&auto=format&fit=crop&q=70',
    tags: ['canva', 'adobe', 'photoshop', 'illustrator', 'design', 'creatif'],
  },

  // CYBERSÉCURITÉ
  {
    id: 'stock-sec-01',
    title: 'Cadenas Numérique & Protection Données',
    category: 'cybersecurity',
    categoryLabel: 'Cybersécurité',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=320&auto=format&fit=crop&q=70',
    tags: ['antivirus', 'securite', 'kaspersky', 'cadenas', 'protection', 'firewall'],
  },
  {
    id: 'stock-sec-02',
    title: 'Bouclier de Sécurité Cybernétique',
    category: 'cybersecurity',
    categoryLabel: 'Cybersécurité',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=320&auto=format&fit=crop&q=70',
    tags: ['vpn', 'shield', 'bouclier', 'protection web', 'nordvpn'],
  },
  {
    id: 'stock-sec-03',
    title: 'Code Matriciel & Défense Réseau',
    category: 'cybersecurity',
    categoryLabel: 'Cybersécurité',
    source: 'Unsplash',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=320&auto=format&fit=crop&q=70',
    tags: ['matrix', 'hacker', 'chiffrement', 'ssl', 'certificat'],
  },
  {
    id: 'stock-sec-04',
    title: 'Serveur Sécurisé en Baie Datacenter',
    category: 'cybersecurity',
    categoryLabel: 'Cybersécurité',
    source: 'Pexels',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=320&auto=format&fit=crop&q=70',
    tags: ['datacenter', 'serveur', 'stockage', 'cloud', 'backup'],
  },
];

interface ProductImageMediaSelectorProps {
  value: string;
  onChange: (newImageUrl: string) => void;
  badge?: string;
  productTitle?: string;
}

export function ProductImageMediaSelector({
  value,
  onChange,
  badge = 'Bestseller',
  productTitle = 'Aperçu du Produit',
}: ProductImageMediaSelectorProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'upload' | 'stock' | 'url'>('stock');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stock library search & filter
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [selectedStockCategory, setSelectedStockCategory] = useState<
    'all' | 'tech_saas' | 'gaming_keys' | 'ai_tools' | 'office_productivity' | 'cybersecurity'
  >('all');

  // Direct URL custom input state
  const [directUrlInput, setDirectUrlInput] = useState(value || '');

  // Handle local file read to base64
  const processImageFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (PNG, JPG, WebP).');
      return;
    }

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} Mo`
      : `${sizeInKb} Ko`;

    setFileDetails({
      name: file.name,
      size: sizeFormatted,
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        onChange(base64Data);
        setDirectUrlInput(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  // Filter curated stock images
  const filteredStockMedia = useMemo(() => {
    const q = stockSearchQuery.toLowerCase().trim();
    return CURATED_STOCK_MEDIA.filter((item) => {
      const matchesCategory =
        selectedStockCategory === 'all' || item.category === selectedStockCategory;

      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [stockSearchQuery, selectedStockCategory]);

  return (
    <div className="space-y-4">
      {/* Tab Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Depuis mon ordinateur (Upload)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Banque libre de droits (Unsplash / Pexels)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Lien URL direct</span>
          </button>
        </div>

        {value && (
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Visuel actif
          </span>
        )}
      </div>

      {/* Main Grid: Selector Source on Left + Real-time Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Source Selector Column (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          {/* TAB 1: LOCAL UPLOAD (DRAG & DROP) */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[220px] ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                    : 'border-slate-800 hover:border-cyan-500/50 bg-[#0e1626]'
                }`}
              >
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3 shadow-inner">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>

                <h4 className="text-xs font-bold text-white mb-1">
                  Glissez-déposez votre image produit ici
                </h4>
                <p className="text-[11px] text-slate-400 mb-4 max-w-xs">
                  Prise en charge instantanée : PNG, JPG, JPEG, WebP. Conversion automatique en haute définition.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-colors shadow-sm cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Parcourir mes fichiers</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {fileDetails && value && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-white truncate max-w-[200px]">
                        {fileDetails.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Taille : {fileDetails.size} &bull; Base64 prêt
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-cyan-400 hover:underline px-2 py-1 cursor-pointer"
                    >
                      Remplacer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChange('');
                        setFileDetails(null);
                        setDirectUrlInput('');
                      }}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURATED STOCK IMAGES (UNSPLASH / PEXELS) */}
          {activeTab === 'stock' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  placeholder="Rechercher par mot-clé (ex: Windows, AI, Gaming, Office, Antivirus...)"
                  className="w-full bg-[#0e1626] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner"
                />
                {stockSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStockSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Thematic Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {[
                  { id: 'all', label: 'Tous les visuels' },
                  { id: 'tech_saas', label: 'Tech & SaaS' },
                  { id: 'gaming_keys', label: 'Gaming & Clés' },
                  { id: 'ai_tools', label: 'Intelligence Artificielle' },
                  { id: 'office_productivity', label: 'Productivité Office' },
                  { id: 'cybersecurity', label: 'Cybersécurité' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedStockCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedStockCategory === cat.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Stock Images Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto p-1 rounded-2xl border border-slate-800/80 bg-slate-950/60 scrollbar-thin scrollbar-thumb-slate-800">
                {filteredStockMedia.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-xs text-slate-500">
                    Aucune image trouvée pour cette recherche. Essayez un autre terme ou filtre.
                  </div>
                ) : (
                  filteredStockMedia.map((media) => {
                    const isSelected = value === media.url;
                    return (
                      <div
                        key={media.id}
                        onClick={() => {
                          onChange(media.url);
                          setDirectUrlInput(media.url);
                        }}
                        className={`group relative rounded-xl overflow-hidden aspect-video border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-purple-400 ring-2 ring-purple-400/40 shadow-lg shadow-purple-500/20 scale-[0.98]'
                            : 'border-slate-800 hover:border-slate-600 hover:scale-[1.02]'
                        }`}
                        title={`Sélectionner : ${media.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={media.thumbnailUrl}
                          alt={media.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Top Source Badge */}
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/75 backdrop-blur-md text-slate-300 border border-white/10 font-mono">
                          {media.source}
                        </span>

                        {/* Selected Checkmark Overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="p-1.5 rounded-full bg-purple-500 text-white shadow-lg">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          </div>
                        )}

                        {/* Bottom Title on Hover */}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] font-bold text-white truncate">
                            {media.title}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT URL INPUT */}
          {activeTab === 'url' && (
            <div className="p-5 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Coller une URL directe d&apos;image (CDN, AWS S3, Supabase, Cloudinary)
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={directUrlInput}
                  onChange={(e) => {
                    setDirectUrlInput(e.target.value);
                    onChange(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/... ou https://cdn.monsite.com/image.png"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />

                {directUrlInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setDirectUrlInput('');
                      onChange('');
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                    title="Vider"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Assurez-vous que l&apos;URL est accessible publiquement en HTTPS pour un affichage optimal sur la vitrine.
              </p>
            </div>
          )}
        </div>

        {/* Real-time Preview Frame Column (5/12) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Rendu Miniature Vitrine
            </span>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setDirectUrlInput('');
                  setFileDetails(null);
                }}
                className="text-[10px] text-rose-400 hover:underline cursor-pointer"
              >
                Retirer l&apos;image
              </button>
            )}
          </div>

          {/* Product Card Styled Preview Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#070a12] shadow-2xl aspect-video flex items-center justify-center group">
            {value ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt={productTitle}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Badge (e.g. Bestseller / Top Vente) */}
                {badge && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      {badge}
                    </span>
                  </div>
                )}

                {/* Status bar */}
                <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30 font-mono shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Image prête pour le catalogue</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-600 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-6 h-6 stroke-1" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Aucune image sélectionnée</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Choisissez une photo libre de droits ou téléversez un fichier depuis votre PC.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </span>
            <p>
              Le visuel sélectionné est synchronisé instantanément avec le catalogue, le panier d&apos;achat et la page de commande.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
