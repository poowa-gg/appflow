/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, ArrowRight, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onNavigateToCalculator: () => void;
  onNavigateToIndiePost: () => void;
  onResetApp?: () => void;
  hasSubmission: boolean;
}

export default function Navbar({
  onNavigateToCalculator,
  onNavigateToIndiePost,
  onResetApp,
  hasSubmission,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={onResetApp || onNavigateToCalculator}
          id="nav-logo-container"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-zinc-900">
            App Capital
          </span>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={onNavigateToCalculator}
            className="text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            id="nav-btn-calculator"
          >
            {hasSubmission ? 'Dashboard' : 'Estimator'}
          </button>
          
          <button
            onClick={onNavigateToIndiePost}
            className="text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            id="nav-btn-indie"
          >
            <span className="hidden sm:inline">Validation </span>Media Kit
          </button>

          {hasSubmission ? (
            <button
              onClick={onResetApp}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95 cursor-pointer"
              id="nav-btn-new-estimate"
            >
              <RefreshCw className="h-3 w-3 text-zinc-500" />
              <span className="hidden sm:inline">New Estimate</span>
              <span className="sm:hidden">Reset</span>
            </button>
          ) : (
            <button
              onClick={onNavigateToCalculator}
              className="flex items-center gap-1 rounded-lg bg-zinc-950 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-sm cursor-pointer"
              id="nav-btn-apply"
            >
              <span>Get Funding</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
