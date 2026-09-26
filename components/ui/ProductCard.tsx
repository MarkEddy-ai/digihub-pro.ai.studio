'use client';

import React from 'react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Star, Zap, ShoppingBag, Eye, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { openProductPage, addToCart, formatPrice } = useShop();

  const handleCardClick = () => {
    openProductPage(product.slug);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-cyan-950/20 ${
        featured ? 'ring-1 ring-cyan-500/30' : ''
      }`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {product.badge && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm ${
                product.badge === 'Bestseller'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : product.badge === 'Nouveauté'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-rose-500 text-white font-bold'
              }`}
            >
              {product.badge}
            </span>
          )}
          <span className="bg-slate-950/80 backdrop-blur text-[10px] text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
            {product.productTypeLabel}
          </span>
        </div>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 text-xs font-mono font-extrabold px-1.5 py-0.5 rounded shadow-sm">
            -{product.discountPercentage}%
          </div>
        )}

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Voir la landing page
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="text-cyan-400 font-medium text-[11px] truncate max-w-[65%]">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-slate-300 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xs font-semibold">{product.rating}</span>
              <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Benefit / Tagline */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Delivery & Security indicators */}
          <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
            <div className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3 h-3" />
              <span>{product.deliveryTime}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Garantie 30j</span>
            </div>
          </div>
        </div>

        {/* Price & Buy Button */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">Paiement unique / Pas d&apos;engagement</div>
          </div>

          <button
            onClick={handleQuickAdd}
            className="p-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-400 transition-all active:scale-95"
            title="Ajouter au panier"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
