'use client';

import React from 'react';
import {
  Zap,
  ShieldCheck,
  FileCheck2,
  Headphones,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export function PlatformGuarantees() {
  const guarantees = [
    {
      icon: Zap,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40 border-cyan-800/40',
      title: 'Délivrance Automatisée en < 60s',
      description:
        'Votre clé numérique officielle et son tutoriel d\'activation sont générés et expédiés immédiatement par e-mail et enregistrés dans votre coffre-fort client.',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800/40',
      title: 'Clés 100% Officielles & Certifiées',
      description:
        'Provenant directement des canaux partenaires de distribution agréés. Aucune clé piratée ou temporaire : activation pérenne et mises à jour officielles préservées.',
    },
    {
      icon: RefreshCw,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-800/40',
      title: 'Garantie de Remplacement 30 Jours',
      description:
        'En cas de moindre problème technique à l\'activation, notre système vérifie l\'incident et génère une nouvelle clé sous quelques minutes.',
    },
    {
      icon: Headphones,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-800/40',
      title: 'Assistance Technique Francophone 7j/7',
      description:
        'Une équipe dédiée joignable directement par email à cherchellsgpp@gmail.com et WhatsApp pour vous guider pas à pas dans l\'installation.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#0B0F17] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Engagements &amp; Sécurité</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pourquoi choisir NOVALYS Digital ?
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Une infrastructure pensée spécifiquement pour la distribution fluide, sécurisée et instantanée de licences numériques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className={`p-3 rounded-lg w-fit ${item.bgColor} border`}>
                  <IconComp className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
