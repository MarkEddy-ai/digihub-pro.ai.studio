'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { CheckCircle2, X, Zap } from 'lucide-react';

interface ProofNotification {
  id: string;
  name: string;
  city: string;
  flag: string;
  productTitle: string;
  timeAgo: string;
  image?: string;
}

const SAMPLE_NOTIFICATIONS: ProofNotification[] = [
  {
    id: 'n1',
    name: 'Karim B.',
    city: 'Constantine',
    flag: '🇩🇿',
    productTitle: 'Windows 11 Pro (Retail)',
    timeAgo: 'il y a 3 min',
    image: 'https://picsum.photos/seed/win11/80/80',
  },
  {
    id: 'n2',
    name: 'عبدالرحمن الشمري',
    city: 'الرياض',
    flag: '🇸🇦',
    productTitle: 'ChatGPT Plus (Accès Garanti)',
    timeAgo: 'منذ 6 دقائق',
    image: 'https://picsum.photos/seed/chatgpt/80/80',
  },
  {
    id: 'n3',
    name: 'Sofiane M.',
    city: 'Alger (Hydra)',
    flag: '🇩🇿',
    productTitle: 'Office 2024 Pro Plus',
    timeAgo: 'il y a 11 min',
    image: 'https://picsum.photos/seed/office2024/80/80',
  },
  {
    id: 'n4',
    name: 'سلطان الدوسري',
    city: 'جدة',
    flag: '🇸🇦',
    productTitle: 'Adobe Creative Cloud (1 An)',
    timeAgo: 'منذ 15 دقيقة',
    image: 'https://picsum.photos/seed/adobe/80/80',
  },
  {
    id: 'n5',
    name: 'Thomas L.',
    city: 'Paris',
    flag: '🌐',
    productTitle: 'Canva Pro Équipe (À Vie)',
    timeAgo: 'il y a 22 min',
    image: 'https://picsum.photos/seed/canva/80/80',
  },
];

export function SocialProofToast() {
  const [currentNotification, setCurrentNotification] = useState<ProofNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    let index = 0;
    // Initial delay of 4 seconds after page load
    const initialTimer = setTimeout(() => {
      showNextNotification();
    }, 4000);

    function showNextNotification() {
      if (isDismissed) return;
      const notif = SAMPLE_NOTIFICATIONS[index % SAMPLE_NOTIFICATIONS.length];
      setCurrentNotification(notif);
      setIsVisible(true);
      index++;

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }

    // Interval every 14 seconds
    const intervalTimer = setInterval(() => {
      showNextNotification();
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isDismissed]);

  if (!currentNotification || !isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      <div className="bg-[#0e1626]/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl shadow-cyan-500/10 flex items-center gap-3 relative group">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-[10px] border border-slate-700 transition-colors shadow cursor-pointer"
          title="Fermer"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Flag badge */}
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-inner">
          {currentNotification.flag}
        </div>

        <div className="flex-1 min-w-0 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white leading-tight truncate">
            <span>{currentNotification.name}</span>
            <span className="text-[10px] text-slate-400 font-normal">({currentNotification.city})</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>

          <div className="text-[11px] text-cyan-300 font-medium truncate mt-0.5">
            A commandé {currentNotification.productTitle}
          </div>

          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-2.5 h-2.5 fill-current" />
              Livré &lt; 60s
            </span>
            <span>•</span>
            <span>{currentNotification.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
