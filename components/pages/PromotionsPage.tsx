'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS, PROMO_BUNDLES } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { Sparkles, Tag, Check, ArrowRight, Zap, Gift } from 'lucide-react';

export function PromotionsPage() {
  const { openProductPage, formatPrice, addToCart, applyPromoCode, products } = useShop();

  const flashDeals = products.filter((p) => p.isFlashDeal);
  const bigDiscounts = products.filter((p) => p.discountPercentage >= 40);

  const handleApplyCoupon = (code: string) => {
    applyPromoCode(code);
  };

  return (
    <div className="py-10 sm:py-16 bg-[#0B0F17] min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Offres Spéciales &amp; Packs Économiques</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Économisez jusqu&apos;à -92% sur vos logiciels &amp; abonnements
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Profitez de remises exclusives et de nos packs groupés tout-en-un pour maximiser votre budget.
          </p>
        </div>

        {/* Coupons banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-blue-950/50 border border-cyan-500/30 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Coupon de bienvenue</span>
            </div>
            <h3 className="text-xl font-bold text-white">10% de réduction supplémentaire sur tout le site</h3>
            <p className="text-xs text-slate-300">
              Valable sur votre panier dès maintenant. Cumulable avec les réductions déjà appliquées aux fiches produits.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-400 text-cyan-300 font-mono font-extrabold text-sm tracking-wider">
              NOVALYS10
            </div>
            <button
              onClick={() => handleApplyCoupon('NOVALYS10')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
            >
              Appliquer au panier
            </button>
          </div>
        </div>

        {/* Exclusive Promo Bundles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Nos Packs Groupés Exclusifs</h2>
              <p className="text-xs text-slate-400">Des suites complémentaires associées à des tarifs imbattables.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PROMO_BUNDLES.map((bundle) => {
              const savings = bundle.originalPrice - bundle.bundlePrice;
              return (
                <div
                  key={bundle.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all p-6 flex flex-col justify-between space-y-6 shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {bundle.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        -{bundle.discountPercent}%
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{bundle.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{bundle.subtitle}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Contenu du pack :
                      </div>
                      {bundle.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-white font-mono">
                          {formatPrice(bundle.bundlePrice)}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono ml-2">
                          {formatPrice(bundle.originalPrice)}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        Économie de {formatPrice(savings)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        // redirect to a representative product or add to cart
                        openProductPage('chatgpt-plus-abonnement');
                      }}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Découvrir le pack</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flash Deals and Top Discounts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Remises Exceptionnelles du Jour</h2>
              <p className="text-xs text-slate-400">Licences avec réduction immédiate jusqu&apos;à épuisement des stocks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bigDiscounts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
