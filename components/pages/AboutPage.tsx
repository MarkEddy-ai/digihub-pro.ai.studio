'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  ShieldCheck,
  Zap,
  Target,
  Eye,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export function AboutPage() {
  const { setActiveTab } = useShop();

  return (
    <div className="py-12 sm:py-20 bg-[#0B0F17] text-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero About */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center mb-2">
            <BrandLogo size="xl" showTagline={false} />
          </div>
          <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            Notre Histoire &amp; Notre Mission
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Démocratiser l&apos;accès aux meilleurs outils numériques &amp; logiciels
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            NOVALYS Digital est née d&apos;un constat sans appel : l&apos;achat de licences logicielles et d&apos;abonnements d&apos;intelligence artificielle est trop souvent opaque, prohibitif et source de déconvenues. Nous avons bâti une plateforme de confiance absolue, délivrant des clés officielles en moins de 60 secondes.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 w-fit">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Notre Mission</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Permettre à chaque créateur, étudiant, développeur, indépendant et entreprise d&apos;accéder aux technologies de premier plan (OpenAI, Anthropic, Microsoft, Canva, CapCut, suites antivirus) au prix le plus juste, sans friction administrative ni attente inutile.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40 w-fit">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Notre Vision</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Devenir la référence francophone et internationale du e-commerce numérique en combinant l&apos;ergonomie fluide d&apos;un SaaS moderne, la puissance de l&apos;automatisation instantanée et un support client humain ultra-réactif.
            </p>
          </div>
        </div>

        {/* Comment fonctionne la livraison numérique ? */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Comment fonctionne la livraison instantanée ?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Un pipeline 100% automatisé pour supprimer tout temps d&apos;attente entre votre paiement et votre utilisation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-cyan-400 font-mono font-bold text-lg">Étape 01</div>
              <h3 className="text-base font-bold text-white">Paiement Sécurisé</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vous réglez votre commande par Carte Bancaire 3D Secure, PayPal ou Crypto sur une passerelle chiffrée SSL.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-cyan-400 font-mono font-bold text-lg">Étape 02</div>
              <h3 className="text-base font-bold text-white">Attribution Automatisée</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notre serveur alloue une clé certifiée unique issue de notre stock sous scellé et prépare le guide d&apos;installation dédié.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-cyan-400 font-mono font-bold text-lg">Étape 03</div>
              <h3 className="text-base font-bold text-white">Réception &amp; Activation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                La clé apparaît à l&apos;écran, dans votre coffre-fort client et dans votre boîte de réception en moins de 60 secondes.
              </p>
            </div>
          </div>
        </div>

        {/* Nos Valeurs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Nos 4 Piliers Inébranlables</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Authenticité &amp; Conformité</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Chaque licence est vérifiable sur les serveurs d&apos;activation des éditeurs officiels.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Vitesse d&apos;exécution</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Pas de délai d&apos;expédition postal : 100% dématérialisé et disponible 24/7/365.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
              <HeartHandshake className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Accompagnement Client Réel</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Une équipe dédiée basée en France répondant à toutes vos questions d&apos;installation.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
              <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Garantie 30 Jours Satisfait ou Remplacé</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Zéro risque pour vous : si une clé ne fonctionne pas, nous la remplaçons immédiatement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              setActiveTab('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>Découvrir notre catalogue complet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
