/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onScrollToCalculator: () => void;
  onNavigateToIndiePost: () => void;
}

export default function Footer({ onScrollToCalculator, onNavigateToIndiePost }: FooterProps) {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10 pb-10 border-b border-zinc-900 text-sm">
          {/* Logo and Pitch */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Landmark className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                App Capital
              </span>
            </div>
            <p className="text-zinc-400 max-w-md text-xs leading-normal">
              Empowering self-funded, independent app founders to scale user acquisition and hire engineers without selling equity or sacrificing voting rights.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onScrollToCalculator} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Capital Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={onScrollToCalculator} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Underwriting Rules
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateToIndiePost} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Validation Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Standards badges */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Security Pledge</h4>
            <div className="flex items-start gap-2 text-xs text-zinc-400 leading-normal">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                We protect developer secrets. Read-only API connections use standard industry OAuth scopes. We never sell, lease, or distribute business analytics data.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimers and copyright */}
        <div className="text-[11px] text-zinc-500 space-y-4 leading-normal">
          <p>
            <strong>Regulatory Transparency Statement:</strong> App Capital (including the UpCap platform) is a financial technology software provider. Revenue advances are structured exclusively as purchases of future business receivables. This product is not an interest-bearing personal loan, credit card, home mortgage, or consumer credit. No personal guarantees, credit checks, or company equity dilution is involved in our standard underwriting process.
          </p>
          <p>
            Evaluations and pre-approvals shown on this prototype are for validation and feedback collection. Final financing offers are subject to rigorous verification of App Store Connect, Google Play Console, and bank account credentials.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-zinc-900 text-zinc-600">
            <span>© 2026 App Capital Inc. All rights reserved.</span>
            <span className="mt-2 sm:mt-0">Designed for Bootstrapped App Studios Worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
