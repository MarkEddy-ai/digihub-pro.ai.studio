'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  X,
  FileCode,
  Check,
  Copy,
  Layers,
  FolderTree,
  Code2,
  PackageCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export function FseSpecsModal() {
  const { isFseSpecsOpen, setIsFseSpecsOpen, showToast } = useShop();
  const [activeTab, setActiveTab] = useState<'architecture' | 'themeJson' | 'woocommerce' | 'blocks'>('architecture');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isFseSpecsOpen) return null;

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    showToast('Code copié dans votre presse-papier !');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const themeJsonCode = `{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "appearanceTools": true,
    "color": {
      "palette": [
        { "slug": "base-dark", "color": "#0B0F17", "name": "Dark Base Canvas" },
        { "slug": "surface-card", "color": "#0F172A", "name": "Surface Card" },
        { "slug": "border-hairline", "color": "#1E293B", "name": "Border Slate" },
        { "slug": "brand-cyan", "color": "#38BDF8", "name": "Electric Cyan" },
        { "slug": "brand-blue", "color": "#0284C7", "name": "Cobalt Blue" },
        { "slug": "accent-emerald", "color": "#10B981", "name": "Trust Emerald" },
        { "slug": "text-primary", "color": "#F8FAFC", "name": "Text Pure Light" },
        { "slug": "text-muted", "color": "#94A3B8", "name": "Text Muted" }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "Inter, system-ui, -apple-system, sans-serif",
          "slug": "inter",
          "name": "Inter"
        },
        {
          "fontFamily": "'JetBrains Mono', monospace",
          "slug": "mono",
          "name": "Monospace Data"
        }
      ]
    },
    "layout": {
      "contentSize": "1200px",
      "wideSize": "1440px"
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#0F172A] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Spécifications &amp; Blueprint WordPress FSE / WooCommerce
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Gutenberg 100% Natif
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Plan technique de conversion de la maquette HTML/CSS vers un thème basé sur les blocs.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFseSpecsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          {[
            { id: 'architecture', label: '1. Architecture FSE & Fichiers', icon: FolderTree },
            { id: 'themeJson', label: '2. theme.json (Palette & Typo)', icon: Code2 },
            { id: 'woocommerce', label: '3. Intégration WooCommerce Numérique', icon: PackageCheck },
            { id: 'blocks', label: '4. Blocs & Landing Page Produit', icon: Layers },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-t-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm text-slate-300">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Structure du Block Theme WordPress (FSE)</h3>
              <p className="text-slate-400 leading-relaxed">
                Le thème est conçu sans constructeur lourd (pas d&apos;Elementor, pas de Divi) pour garantir un score de performance Google PageSpeed &gt; 95, une sécurité maximale et une compatibilité FSE native.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-cyan-400 font-bold">wp-content/themes/novalys-digital-fse/</div>
                <div className="pl-4">├── theme.json <span className="text-slate-500">— Palette, espacements, typographies</span></div>
                <div className="pl-4">├── style.css <span className="text-slate-500">— Déclaration du thème FSE</span></div>
                <div className="pl-4">├── functions.php <span className="text-slate-500">— Déclarations WooCommerce &amp; License Vault hooks</span></div>
                <div className="pl-4">├── templates/</div>
                <div className="pl-8">├── index.html <span className="text-slate-500">— Template par défaut</span></div>
                <div className="pl-8">├── front-page.html <span className="text-slate-500">— Page d&apos;accueil (Hero, Ventes Flash, Best-sellers)</span></div>
                <div className="pl-8">├── single-product.html <span className="text-slate-500">— Landing page produit longue SEO</span></div>
                <div className="pl-8">├── archive-product.html <span className="text-slate-500">— Boutique avec filtres facettés</span></div>
                <div className="pl-8">└── page.html</div>
                <div className="pl-4">├── parts/</div>
                <div className="pl-8">├── header.html <span className="text-slate-500">— Navigation avec logo circulaire et mini-panier</span></div>
                <div className="pl-8">└── footer.html <span className="text-slate-500">— Réassurance, CGV, contact cherchellsgpp@gmail.com</span></div>
                <div className="pl-4">└── patterns/ <span className="text-slate-500">— Motifs Gutenberg réutilisables</span></div>
                <div className="pl-8">├── hero-marketplace.php</div>
                <div className="pl-8">├── product-guarantees.php</div>
                <div className="pl-8">├── sticky-buy-bar.php</div>
                <div className="pl-8">└── product-activation-guide.php</div>
              </div>
            </div>
          )}

          {activeTab === 'themeJson' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">theme.json généré pour Gutenberg FSE</h3>
                <button
                  onClick={() => copySnippet(themeJsonCode)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copié !' : 'Copier theme.json'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                {themeJsonCode}
              </pre>
            </div>
          )}

          {activeTab === 'woocommerce' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Paramétrage WooCommerce pour Produits Numériques</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-cyan-300">1. Types de produits : Virtuel &amp; Téléchargeable</h4>
                  <p className="text-xs text-slate-300">
                    Activation des cases &ldquo;Virtuel&rdquo; et &ldquo;Téléchargeable&rdquo; pour supprimer automatiquement les étapes d&apos;adresse de livraison physique lors du checkout.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-cyan-300">2. Gestionnaire de clés de licence (License Manager)</h4>
                  <p className="text-xs text-slate-300">
                    Attribution automatique d&apos;une clé alphanumérique unique pré-générée lors du passage de la commande au statut &ldquo;Terminée&rdquo;, transmise dans l&apos;e-mail transactionnel de WooCommerce et stockée dans l&apos;espace &ldquo;Mon Compte &gt; Mes Licences&rdquo;.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-cyan-300">3. Passerelles de paiement recommandées</h4>
                  <p className="text-xs text-slate-300">
                    WooCommerce Stripe Payment Gateway (CB, Apple Pay, Google Pay) + WooCommerce PayPal Payments + Passerelle Crypto non-custodial (BTCPay Server ou Crypto.com).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blocks' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Mapping des Blocs pour la Landing Page Produit SEO</h3>
              <p className="text-slate-400">
                Chaque bloc de la maquette actuelle se traduit en un Block Gutenberg natif :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-mono text-xs block mb-1">core/gallery + core/image</span>
                  <span className="text-white font-bold">Galerie visuelle &amp; Badges</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-mono text-xs block mb-1">woocommerce/product-price</span>
                  <span className="text-white font-bold">Prix barré &amp; Remise calculée</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-mono text-xs block mb-1">woocommerce/add-to-cart-form</span>
                  <span className="text-white font-bold">Sélecteur de formule &amp; Achat instantané</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-mono text-xs block mb-1">core/details (Accordéon)</span>
                  <span className="text-white font-bold">FAQ spécifique au produit</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-mono text-xs block mb-1">woocommerce/product-reviews</span>
                  <span className="text-white font-bold">Avis clients vérifiés &amp; Notes</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-mono text-xs block mb-1">novalys/sticky-buy-bar</span>
                  <span className="text-white font-bold">Barre d&apos;achat persistante au défilement</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F17] flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Support technique pour la conversion : <strong className="text-white">cherchellsgpp@gmail.com</strong>
          </span>
          <button
            onClick={() => setIsFseSpecsOpen(false)}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
          >
            Fermer les spécifications
          </button>
        </div>
      </div>
    </div>
  );
}
