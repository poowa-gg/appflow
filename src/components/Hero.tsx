/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Zap, Sparkles, Coins } from 'lucide-react';

interface HeroProps {
  onScrollToCalculator: () => void;
}

export default function Hero({ onScrollToCalculator }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-zinc-50 py-16 sm:py-24 dot-grid">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-zinc-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Pitch badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10 mb-8 animate-fade-in">
          <Sparkles className="h-3 w-3 text-emerald-600" />
          <span>Non-Dilutive Growth Capital for App Founders</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
          Turn your future app store revenue into{' '}
          <span className="relative bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            instant working capital.
          </span>
        </h1>

        {/* Supporting one-liner */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 leading-relaxed">
          Skip the pitch decks and personal guarantees. Get up to <span className="font-semibold text-zinc-900">4x your MRR</span> in non-dilutive capital to scale user acquisition, fund development, or cover operational runway.
        </p>

        {/* Primary Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onScrollToCalculator}
            className="w-full sm:w-auto rounded-xl bg-zinc-950 px-8 py-4 text-base font-semibold text-white hover:bg-zinc-800 transition-all active:scale-98 shadow-md hover:shadow-zinc-950/10 cursor-pointer"
            id="hero-cta-calculate"
          >
            Calculate Your Advance
          </button>
          
          <div className="text-sm font-medium text-zinc-500">
            Takes under 2 minutes • No impact on credit score
          </div>
        </div>

        {/* High-fidelity Trust Signals Grid */}
        <div className="mx-auto mt-16 max-w-5xl border-t border-zinc-200/80 pt-10">
          <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Designed for Modern App Entrepreneurs & Developers
          </p>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-left">
            <div className="rounded-xl border border-zinc-200/60 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <Coins className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900">Zero Equity Dilution</h3>
              <p className="mt-1 text-xs text-zinc-500 leading-normal">
                Retain 100% ownership. We advance funds against future sales with flat, fixed fees.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/60 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900">Instant Valuation</h3>
              <p className="mt-1 text-xs text-zinc-500 leading-normal">
                Enter your MRR and payout platform for an immediate algorithmic pre-approval estimate.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/60 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900">No Personal Guarantees</h3>
              <p className="mt-1 text-xs text-zinc-500 leading-normal">
                Repayment is tied exclusively to app receipts. If app sales slow down, repayments adjust.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/60 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <Coins className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900">Flexible Repayments</h3>
              <p className="mt-1 text-xs text-zinc-500 leading-normal">
                Fixed weekly/monthly percentages from recurring receipts with transparent flat fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
