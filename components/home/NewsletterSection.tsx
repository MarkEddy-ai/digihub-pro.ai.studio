'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Mail, User, Sparkles, CheckCircle2, ShieldCheck, Gift, ArrowRight } from 'lucide-react';

interface NewsletterSectionProps {
  variant?: 'standalone' | 'compact' | 'footer';
  className?: string;
}

export function NewsletterSection({ variant = 'standalone', className = '' }: NewsletterSectionProps) {
  const { subscribeNewsletter } = useShop();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = subscribeNewsletter(email, firstName);
      setIsSubmitting(false);

      if (result.success) {
        setIsSubmitted(true);
        setSuccessMessage(result.message);
        setEmail('');
        setFirstName('');
      }
    }, 400);
  };

  return (
    <section
      aria-label="Inscription Newsletter VIP"
      className={`relative overflow-hidden ${
        variant === 'footer'
          ? 'py-10 border-b border-slate-800/80 bg-gradient-to-b from-[#0a101f] to-[#070a0f]'
          : 'py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#070A0F]'
      } ${className}`}
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 shadow-2xl relative">
          {/* Subtle Top Accent Border */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Copywriting & Value Prop */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide">
                <Gift className="w-3.5 h-3.5 animate-pulse" />
                <span>Club Privilège NOVALYS &bull; Remise -10% Offerte</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Rejoignez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Cercle Privilégié</span> NOVALYS
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Recevez en avant-première nos arrivages de licences logicielles, nos codes promos exclusifs et nos analyses tech directement dans votre boîte mail.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  0 spam. Désinscription possible en un clic.
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  Arrivages réservés aux membres
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Subscription Form */}
            <div className="lg:col-span-6">
              {isSubmitted ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Félicitations et bienvenue !</h3>
                  <p className="text-xs sm:text-sm text-emerald-300 font-medium leading-relaxed max-w-md mx-auto">
                    {successMessage || 'Merci ! Vous êtes bien inscrit(e). Votre code de bienvenue -10% arrive par email.'}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                    >
                      Inscrire une autre adresse email
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3.5 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-inner"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="newsletter-email" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Votre adresse email professionnelle ou personnelle *</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Code -10% immédiat</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom.prenom@gmail.com"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="newsletter-firstname" className="text-xs font-medium text-slate-400 flex items-center justify-between">
                      <span>Prénom (facultatif)</span>
                      <span className="text-[10px] text-slate-500">Pour personnaliser vos alertes</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="newsletter-firstname"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ex: Karim ou Amine"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>S&apos;abonner aux offres VIP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center pt-1">
                    En validant, vous acceptez de recevoir les offres privilégiées NOVALYS. Désabonnement simple en 1 clic à tout moment.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
