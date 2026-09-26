'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export function HomeFaq() {
  const { openLegalPage, setActiveTab } = useShop();

  const faqs: FaqItem[] = [
    {
      question: 'En combien de temps reçois-je ma clé ou mon accès après commande ?',
      answer:
        'La délivrance est entièrement automatisée. Dans 99% des cas, vous recevez vos informations de licence en moins de 60 secondes directement par e-mail et sur votre écran de confirmation de commande (également accessible à tout moment dans votre coffre-fort de licences).',
    },
    {
      question: 'Les clés de licence vendues sont-elles officielles et légales ?',
      answer:
        'Oui, strictement 100%. Nous nous approvisionnons exclusivement via les canaux de distribution certifiés fabricants et partenaires agréés. Toutes les clés s\'activent directement sur les serveurs officiels (Microsoft, Bitdefender, OpenAI, etc.) et donnent droit aux mises à jour de sécurité légitimes.',
    },
    {
      question: 'Que se passe-t-il si j\'éprouve une difficulté lors de l\'activation ?',
      answer:
        'Chaque achat s\'accompagne d\'un guide illustré pas-à-pas en PDF. Si vous rencontrez la moindre difficulté, notre support client francophone intervient 7j/7 pour vous assister. Si une clé présente la moindre anomalie d\'activation, nous la remplaçons immédiatement ou procédons à votre remboursement intégral.',
    },
    {
      question: 'Quels sont les moyens de paiement acceptés et sont-ils sécurisés ?',
      answer:
        'Nous acceptons les Cartes Bancaires (Visa, Mastercard, American Express via protocole 3D Secure), PayPal, Apple Pay, Google Pay ainsi que les cryptomonnaies courantes (USDT, BTC). Toutes les données transitent par un tunnel de chiffrement bancaire SSL 256-bit.',
    },
    {
      question: 'Dois-je créer un compte avant de commander ?',
      answer:
        'Non, vous pouvez commander directement en indiquant simplement l\'adresse e-mail sur laquelle vous souhaitez recevoir vos clés et factures. Un coffre-fort client sécurisé est généré automatiquement avec votre commande.',
    },
    {
      question: 'Fournissez-vous une facture avec TVA pour les professionnels ?',
      answer:
        'Oui. Une facture au format PDF conforme aux normes comptables, précisant la TVA acquittée et les coordonnées de commande, est téléchargeable dès validation du paiement.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#0B0F17] border-b border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Réponses Claires</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Foire Aux Questions
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Tout ce que vous devez savoir sur nos licences, délais de livraison et garanties.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-white hover:text-cyan-300 font-semibold text-sm sm:text-base"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => openLegalPage('faq')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
          >
            <span>Consulter la foire aux questions complète</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
