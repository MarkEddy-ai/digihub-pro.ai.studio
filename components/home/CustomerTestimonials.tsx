'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export function CustomerTestimonials() {
  const testimonials = [
    {
      id: 't-1',
      author: 'Maxime Dupont',
      role: 'Développeur Full-Stack Freelance',
      productBought: 'ChatGPT Plus & Claude Pro',
      rating: 5,
      date: 'Il y a 3 jours',
      text: 'Achat de ChatGPT Plus et de Claude 3.5 Sonnet pour mon activité dev. Les identifiants et l\'activation étaient disponibles dans le coffre-fort client en 45 secondes chrono. C\'est propre, rapide et beaucoup plus avantageux !',
    },
    {
      id: 't-2',
      author: 'Élodie Renard',
      role: 'Community Manager & Créatrice TikTok',
      productBought: 'Canva Pro + CapCut Pro',
      rating: 5,
      date: 'Il y a 5 jours',
      text: 'Le pack Créateur est juste parfait. J\'avais peur que mes anciens dossiers Canva disparaissent lors de l\'activation Pro, mais tout est resté parfaitement intact. CapCut débloqué instantanément également.',
    },
    {
      id: 't-3',
      author: 'Thierry Marchand',
      role: 'Gérant de cabinet d\'expertise',
      productBought: 'Microsoft Office 2024 Pro Plus (3 PC)',
      rating: 5,
      date: 'Il y a 1 semaine',
      text: 'Nous avons équipé nos 3 nouveaux postes sans devoir souscrire à un abonnement mensuel contraignant. Clé officielle reconnue immédiatement sur setup.office.com et facture avec TVA reçue dans la boîte mail.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#090D14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Retours d&apos;expérience vérifiés</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ce que nos clients disent de notre service
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Plus de 45 000 commandes traitées avec une moyenne certifiée de 4.9/5 étoiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between relative shadow-sm"
            >
              <Quote className="w-8 h-8 text-slate-800 absolute top-4 right-4 pointer-events-none" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-xs font-mono text-slate-400">{item.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              {/* Author & Product */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.author}</h4>
                  <div className="text-[11px] text-slate-400">{item.role}</div>
                  <div className="text-[10px] text-cyan-400 font-medium mt-0.5">
                    Produit : {item.productBought}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3 shrink-0" />
                  <span>Avis vérifié</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
