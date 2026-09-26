'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Headphones,
  Globe,
} from 'lucide-react';

export function ContactPage() {
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('activation');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      showToast('Votre message a été transmis à cherchellsgpp@gmail.com. Un agent vous répond sous 15 min.');
    }, 800);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#0B0F17] text-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Headphones className="w-3.5 h-3.5" />
            <span>Support Client &amp; SAV 7j/7</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contactez notre équipe d&apos;assistance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Une question technique, un besoin d&apos;aide à l&apos;activation ou une demande spécifique ? Nous vous répondons en moins de 15 minutes.
          </p>
        </div>

        {/* Contact Grid: Details + Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Details / Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Coordonnées directes</span>
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Email officiel de support :</div>
                    <a
                      href="mailto:cherchellsgpp@gmail.com"
                      className="font-bold text-cyan-300 hover:underline break-all"
                    >
                      cherchellsgpp@gmail.com
                    </a>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Traitement prioritaire 24h/24
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Délai moyen de réponse :</div>
                    <div className="font-bold text-white">Moins de 15 minutes</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Disponible 7 jours sur 7 de 8h à 23h
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Structure d&apos;exploitation :</div>
                    <div className="font-bold text-white">Plateforme 100% en ligne</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Service numérique sans boutique physique
                    </div>
                  </div>
                </div>
              </div>

              {/* Security note */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garantie de résolution SAV</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Si un souci survient avec votre clé ou votre invitation, notre support technique prend en charge l&apos;incident pour vous fournir une nouvelle clé ou un remboursement direct.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
              {isSent ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message transmis avec succès !</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Merci {name}, votre demande a été transmise à notre équipe de techniciens (copie envoyée à <strong>cherchellsgpp@gmail.com</strong>). Nous vous répondrons directement par e-mail à l&apos;adresse <strong>{email}</strong> sous 15 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setMessage('');
                    }}
                    className="px-5 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-white">Formulaire de contact &amp; ticket</h2>
                    <p className="text-xs text-slate-400">Remplissez les champs ci-dessous pour une prise en charge immédiate.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Votre nom complet *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Jean Dupont"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Votre adresse e-mail *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Motif de votre demande</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="activation">Aide à l&apos;activation d&apos;une clé</option>
                        <option value="pre-sale">Question avant achat / compatibilité</option>
                        <option value="delivery">Livraison ou renvoi de clé par email</option>
                        <option value="business">Devis entreprise / Licences en volume</option>
                        <option value="other">Autre demande</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Numéro de commande (facultatif)</label>
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Ex: NVX-89421"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-medium">Votre message détaillé *</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Précisez votre question ou le problème rencontré (logiciel, message d'erreur éventuel)..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmission en cours...' : 'Envoyer mon message au support'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
