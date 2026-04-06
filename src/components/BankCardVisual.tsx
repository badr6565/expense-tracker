'use client';

import { BankCard, CARD_THEMES } from '@/types/bankCard';
import { Wifi } from 'lucide-react';

interface BankCardVisualProps {
  card: BankCard;
  /** Shrink the card for compact contexts */
  compact?: boolean;
}

export default function BankCardVisual({ card, compact = false }: BankCardVisualProps) {
  const { gradient } = CARD_THEMES[card.theme];

  return (
    <div
      className={`relative bg-gradient-to-br ${gradient} rounded-2xl text-white shadow-lg select-none overflow-hidden ${
        compact ? 'w-48 h-28 p-4' : 'w-full aspect-[1.586] p-6'
      }`}
    >
      {/* Subtle circle decorations */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full bg-white/10" />

      {/* Top row */}
      <div className={`relative flex items-start justify-between ${compact ? 'mb-2' : 'mb-4'}`}>
        <span className={`font-semibold tracking-wide truncate ${compact ? 'text-xs' : 'text-sm'}`}>
          {card.bankName}
        </span>
        <Wifi size={compact ? 14 : 18} className="text-white/80 shrink-0 ml-2" />
      </div>

      {/* Chip */}
      <div
        className={`relative bg-yellow-300/90 rounded-md ${
          compact ? 'w-6 h-4 mb-2' : 'w-10 h-7 mb-4'
        }`}
      >
        <div
          className={`absolute inset-0 border border-yellow-500/40 rounded-md grid ${
            compact ? 'grid-cols-2' : 'grid-cols-2'
          }`}
        >
          <div className="border-r border-yellow-500/40" />
        </div>
      </div>

      {/* Card number */}
      <div className={`relative font-mono tracking-widest ${compact ? 'text-xs mb-2' : 'text-base mb-4'}`}>
        •••• •••• •••• {card.lastFour}
      </div>

      {/* Bottom row */}
      <div className="relative flex items-end justify-between">
        <div>
          <p className={`uppercase font-semibold tracking-wide truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {card.cardholderName}
          </p>
          {card.isDefault && !compact && (
            <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <span
          className={`uppercase font-bold tracking-widest text-white/80 ${
            compact ? 'text-xs' : 'text-sm'
          }`}
        >
          {card.cardType}
        </span>
      </div>
    </div>
  );
}
