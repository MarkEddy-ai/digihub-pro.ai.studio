'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    finalTotal,
    formatPrice,
    setIsCheckoutOpen,
    openProductPage,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromoCode(couponInput);
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F172A] border-l border-slate-800 flex flex-col justify-between shadow-2xl text-slate-100">
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Votre Panier Numérique</h2>
              <span className="text-xs text-slate-400 font-mono">({cartCount} articles)</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery notice */}
          <div className="bg-cyan-950/40 border-b border-cyan-900/30 px-4 py-2 text-xs flex items-center gap-2 text-cyan-300">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Livraison automatisée par email &lt; 60 secondes après paiement</span>
          </div>

          {/* Cart Items Scrollable list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">Votre panier est vide</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Découvrez nos outils IA, licences Windows, antivirus et abonnements au meilleur prix.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 relative"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4
                      onClick={() => {
                        setIsCartOpen(false);
                        openProductPage(item.product.slug);
                      }}
                      className="text-xs sm:text-sm font-bold text-white hover:text-cyan-300 cursor-pointer truncate"
                    >
                      {item.product.name}
                    </h4>

                    {item.selectedOption && (
                      <div className="text-[11px] text-slate-400">
                        Option : <span className="text-cyan-300">{item.selectedOption.label}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Diminuer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Augmenter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-extrabold text-white font-mono">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer with Coupon & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0B0F17] space-y-4">
              {/* Coupon input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code appliqué : <strong>{appliedPromo.code}</strong> (-{appliedPromo.percent}%)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-slate-400 hover:text-white text-xs underline ml-2"
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code promo (ex: NOVALYS10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 border border-slate-700"
                    >
                      Appliquer
                    </button>
                  </form>
                )}
              </div>

              {/* Total Summary */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2">
                <div className="flex justify-between">
                  <span>Sous-total HT :</span>
                  <span className="font-mono">{formatPrice(cartTotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Réduction promo ({appliedPromo.percent}%) :</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Frais de livraison :</span>
                  <span className="text-emerald-400 font-medium">Gratuit (Délivrance e-mail immédiate)</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total TTC à régler :</span>
                  <span className="font-mono text-cyan-300">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Commander &amp; Recevoir mes clés</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paiement chiffré SSL 256-bit &amp; Garantie 30 jours</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
