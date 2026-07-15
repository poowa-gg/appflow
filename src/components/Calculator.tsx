/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  HelpCircle, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { EligibilityInputs, WaitlistSubmission } from '../types';
import { calculateEstimate } from '../lib/calculations';

interface CalculatorProps {
  onSubmit: (submission: WaitlistSubmission) => void;
}

export default function Calculator({ onSubmit }: CalculatorProps) {
  // Form state
  const [appName, setAppName] = useState('');
  const [mrr, setMrr] = useState(15000);
  const [mrrGrowthRate, setMrrGrowthRate] = useState(12); // Default is 12% Month-over-Month growth
  const [revenueSource, setRevenueSource] = useState('Subscriptions (recurring)');
  const [payoutPlatform, setPayoutPlatform] = useState('Stripe');
  const [country, setCountry] = useState('United States');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  // Error and UI states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [underwritingStep, setUnderwritingStep] = useState(0);

  // Preset MRR values for easy clicking
  const mrrPresets = [5000, 15000, 50000, 100000];

  // Helper object to pack state
  const currentInputs: EligibilityInputs = {
    appName,
    mrr,
    mrrGrowthRate,
    revenueSource,
    payoutPlatform,
    email,
    country,
    consent,
  };

  // Live draft estimate calculation
  const estimate = calculateEstimate(currentInputs);

  // Clean form errors when inputs change
  useEffect(() => {
    if (appName.trim()) setErrors(prev => ({ ...prev, appName: '' }));
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) setErrors(prev => ({ ...prev, email: '' }));
    if (consent) setErrors(prev => ({ ...prev, consent: '' }));
  }, [appName, email, consent]);

  // Form submit handler with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!appName.trim()) {
      newErrors.appName = 'App name or studio name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid business email';
    }
    if (mrr <= 0) {
      newErrors.mrr = 'MRR must be greater than zero';
    }
    if (!consent) {
      newErrors.consent = 'You must acknowledge the terms to get an estimate';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstErrorEl = document.getElementById('calculator-form-container');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Trigger beautiful underwriting micro-animation sequence
    setIsSubmitting(true);
    setUnderwritingStep(1);

    setTimeout(() => {
      setUnderwritingStep(2);
    }, 1000);

    setTimeout(() => {
      setUnderwritingStep(3);
    }, 2000);

    setTimeout(() => {
      // Create waitlist submission
      const submission: WaitlistSubmission = {
        id: 'APP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        appName,
        mrr,
        mrrGrowthRate,
        revenueSource,
        payoutPlatform,
        email,
        country,
        consent,
        submittedAt: new Date().toISOString(),
        status: 'pending_review',
        estimate,
      };

      onSubmit(submission);
      setIsSubmitting(false);
      setUnderwritingStep(0);
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="calculator-section">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Instantly Estimate Your Eligible Capital
        </h2>
        <p className="mt-3 text-zinc-500 max-w-2xl mx-auto">
          No obligation. Transparent pricing. Enter your details below and see what your future revenue is worth today.
        </p>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="calculator-form-container">
        {/* Left column: Interactive Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
          <h3 className="font-display text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">1</span>
            App Store & Revenue Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* App Name */}
            <div>
              <label htmlFor="appName" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                App / Product Name
              </label>
              <input
                type="text"
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. Acme Photo Editor or Acme Studios"
                className={`w-full rounded-xl border px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors.appName 
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20' 
                    : 'border-zinc-300 focus:ring-emerald-200 focus:border-emerald-600'
                }`}
              />
              {errors.appName && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.appName}</span>
                </p>
              )}
            </div>

            {/* Monthly Recurring Revenue */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="mrr" className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                  Monthly Recurring Revenue (MRR)
                  <span className="group relative cursor-help">
                    <HelpCircle className="h-4 w-4 text-zinc-400 hover:text-zinc-500" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 rounded-lg bg-zinc-950 p-2.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 leading-normal">
                      Your average monthly revenue net of app store cuts or payment fees over the last 3 months.
                    </span>
                  </span>
                </label>
                <div className="font-mono text-lg font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  ${mrr.toLocaleString()}
                </div>
              </div>

              {/* Slider controls */}
              <input
                type="range"
                id="mrr-range"
                min="1000"
                max="250000"
                step="1000"
                value={mrr}
                onChange={(e) => setMrr(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              {/* Quick Preset Buttons */}
              <div className="mt-3 flex flex-wrap gap-2 justify-between items-center text-xs">
                <span className="text-zinc-400">$1,000 min</span>
                <div className="flex gap-1.5">
                  {mrrPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMrr(val)}
                      className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        mrr === val
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                    >
                      ${(val / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
                <span className="text-zinc-400">$250,000+ max</span>
              </div>
            </div>

            {/* Month-over-Month Growth Rate Metric Slider */}
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/60">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="mrrGrowthRate" className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                  Month-over-Month (MoM) Growth
                  <span className="group relative cursor-help">
                    <HelpCircle className="h-4 w-4 text-zinc-400 hover:text-zinc-500" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 rounded-lg bg-zinc-950 p-2.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 leading-normal">
                      Your Month-over-Month percentage revenue growth. Higher growth rate reduces risks and lowers administrative fee percentages.
                    </span>
                  </span>
                </label>
                <div className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${
                  mrrGrowthRate > 0 
                    ? 'text-emerald-800 bg-emerald-50 border-emerald-100' 
                    : mrrGrowthRate < 0 
                    ? 'text-rose-800 bg-rose-50 border-rose-100' 
                    : 'text-zinc-600 bg-zinc-100 border-zinc-200'
                }`}>
                  {mrrGrowthRate > 0 ? `+${mrrGrowthRate}%` : `${mrrGrowthRate}%`} Growth
                </div>
              </div>

              {/* Slider controls for Growth Rate */}
              <input
                type="range"
                id="mrrGrowthRate-range"
                min="-10"
                max="50"
                step="1"
                value={mrrGrowthRate}
                onChange={(e) => setMrrGrowthRate(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 mt-1.5">
                <span>-10% (Decline)</span>
                <span>0% (Flat)</span>
                <span>25% (High Growth)</span>
                <span>50%+ (Hyper)</span>
              </div>
            </div>

            {/* Revenue Source & Payout Platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="revenueSource" className="block text-sm font-semibold text-zinc-700">
                    Revenue Model
                  </label>
                  
                  {/* Revenue Source Tooltip */}
                  <div className="group relative cursor-help flex items-center">
                    <span className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-0.5">
                      <Info className="h-3.5 w-3.5" />
                      <span>Impact guide</span>
                    </span>
                    <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-72 rounded-xl bg-zinc-950 p-3 text-xs text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 leading-normal border border-zinc-800">
                      <strong className="text-emerald-400 block mb-1">Underwriting Multipliers:</strong>
                      <ul className="space-y-1.5 list-none text-[11px]">
                        <li>• <span className="font-semibold text-zinc-200">Subscriptions:</span> 3.4x - 5.0x MRR. High stability, lowest risk.</li>
                        <li>• <span className="font-semibold text-zinc-200">In-App Purchases:</span> 3.2x - 4.2x MRR. Volume-driven.</li>
                        <li>• <span className="font-semibold text-zinc-200">SaaS Contracts:</span> 3.5x - 5.0x MRR. Stable but lumpier payouts.</li>
                        <li>• <span className="font-semibold text-zinc-200">Ad Revenue:</span> 2.0x - 3.2x MRR. High seasonal fluctuations.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <select
                  id="revenueSource"
                  value={revenueSource}
                  onChange={(e) => setRevenueSource(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="Subscriptions (recurring)">Subscriptions (Recurring)</option>
                  <option value="In-App Purchases / Transactions">In-App Purchases / Transactions</option>
                  <option value="SaaS Contracts / Invoices">SaaS Contracts / Invoices</option>
                  <option value="Ad Revenue / Mobile Ads">Ad Revenue / Mobile Ads</option>
                </select>
              </div>

              <div>
                <label htmlFor="payoutPlatform" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Primary Payout Platform
                </label>
                <select
                  id="payoutPlatform"
                  value={payoutPlatform}
                  onChange={(e) => setPayoutPlatform(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="Stripe">Stripe</option>
                  <option value="App Store Connect">App Store Connect</option>
                  <option value="Google Play Console">Google Play Console</option>
                  <option value="Paddle">Paddle</option>
                  <option value="Merchant Account / Braintree">Merchant Account / Braintree</option>
                  <option value="Other / Multiple">Other / Multiple</option>
                </select>
              </div>
            </div>

            {/* Email Address & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Business Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className={`w-full rounded-xl border px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.email 
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20' 
                      : 'border-zinc-300 focus:ring-emerald-200 focus:border-emerald-600'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Incorporation Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="India">India</option>
                  <option value="Other">Other Country</option>
                </select>
              </div>
            </div>

            {/* Compliance Consent Checkbox */}
            <div className="pt-2 border-t border-zinc-100">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4.5 w-4.5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-zinc-500 leading-normal">
                  I consent to receive calculations, agree that this is a non-binding mock evaluation for startup validation purposes, and confirm my data is accurate. 
                  <span className="font-semibold text-zinc-700"> No personal guarantee or credit impact.</span>
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.consent}</span>
                </p>
              )}
            </div>

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 px-6 font-semibold text-white shadow-md transition-all active:scale-98 cursor-pointer ${
                isSubmitting 
                  ? 'bg-zinc-800 text-zinc-300 cursor-not-allowed' 
                  : 'bg-zinc-950 hover:bg-zinc-850 hover:shadow-lg'
              }`}
              id="submit-calculator-btn"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>
                    {underwritingStep === 1 && 'Analyzing payment metrics...'}
                    {underwritingStep === 2 && 'Calibrating risk multi-tiers...'}
                    {underwritingStep === 3 && 'Generating custom funding offer...'}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="h-4.5 w-4.5 text-zinc-400" />
                  <span>Lock in Offer & Join Waitlist</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Dynamic Estimate Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-zinc-800">
            {/* Visual background gradient accents */}
            <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-48 w-48 bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-8 border-b border-zinc-800 pb-5">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  Estimate For {appName ? `"${appName}"` : 'Your App'}
                </span>
                <h4 className="font-display text-lg font-bold mt-1 text-zinc-100">
                  Pre-Approved Limit
                </h4>
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                <span>Instant estimate</span>
              </div>
            </div>

            {/* Big Money display */}
            <div className="relative mb-6">
              <span className="text-xs font-medium text-zinc-400 block mb-1">
                Estimated Capital Eligible
              </span>
              <div className="flex items-baseline font-mono">
                <span className="text-3xl font-bold text-zinc-300 mr-1">$</span>
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white animate-fade-in">
                  {estimate.eligibleAdvance.toLocaleString()}
                </span>
              </div>
              <p className="mt-2.5 text-xs text-zinc-400 leading-normal flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Based on a robust <span className="text-zinc-100 font-semibold">{(estimate.eligibleAdvance / (mrr || 1)).toFixed(1)}x multiplier</span> of your current MRR.
                </span>
              </p>
            </div>

            {/* Detail ledger */}
            <div className="relative space-y-4 border-t border-zinc-800 pt-6 mb-8 text-sm">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Estimated Flat Fee ({ (estimate.feeRate * 100).toFixed(1) }%)</span>
                <span className="font-mono text-zinc-100 font-semibold">
                  +${estimate.feeAmount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-zinc-400">
                <span>Net Cash Transferred</span>
                <span className="font-mono text-zinc-100 font-semibold">
                  ${estimate.netCash.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Flexible Repayment Rate</span>
                <span className="font-mono text-zinc-100 font-semibold">
                  {estimate.repaymentPercentage}% of sales
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Expected Payback Term</span>
                <span className="font-mono text-zinc-100 font-semibold">
                  ~{estimate.repaymentTermMonths} Months
                </span>
              </div>
            </div>

            {/* Bar visualization of Net Cash vs Fee */}
            <div className="relative mb-6">
              <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                <span>Estimated Net Cash ({ (100 - estimate.feeRate * 100).toFixed(1) }%)</span>
                <span>Fee ({ (estimate.feeRate * 100).toFixed(1) }%)</span>
              </div>
              <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{ width: `${100 - estimate.feeRate * 100}%` }}
                />
                <div 
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${estimate.feeRate * 100}%` }}
                />
              </div>
            </div>

            {/* Trust disclaimer */}
            <div className="relative rounded-xl bg-zinc-850 border border-zinc-800/80 p-4 text-xs text-zinc-400 leading-normal flex gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-200 block mb-0.5">Secure Underwriting Pledge</span>
                We use secure client-side tokens. No public data sharing. This evaluation is mock underwriting for startup fit analysis.
              </div>
            </div>
          </div>

          {/* Value Prop Reminder card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm text-xs text-zinc-500 space-y-3.5">
            <h5 className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Why App Capital is better than debt or VC:
            </h5>
            <ul className="space-y-2 pl-5 list-disc leading-normal">
              <li><strong className="text-zinc-700">Completely Non-Dilutive</strong>: You don't give away any percentage of your company. Keep control.</li>
              <li><strong className="text-zinc-700">Dynamic Repayment schedules</strong>: If your app sales experience a seasonal dip, your repayment amount drops proportionally.</li>
              <li><strong className="text-zinc-700">Frictionless connection</strong>: Unlocks fully with standard API read-only feeds from Stripe or App Store Connect.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
