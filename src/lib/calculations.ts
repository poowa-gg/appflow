/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EligibilityInputs, CapitalEstimate } from '../types';

/**
 * Calculates a non-dilutive capital estimate based on basic founder inputs.
 * The logic is deterministic, realistic for fintech, and easy to adjust.
 */
export function calculateEstimate(inputs: EligibilityInputs): CapitalEstimate {
  const { mrr, mrrGrowthRate = 0, revenueSource, payoutPlatform, country } = inputs;

  // Base multiplier for eligible advance is 3.0x MRR
  let multiplier = 3.0;

  // Growth-driven multiplier boost: faster growing companies represent less credit risk
  if (mrrGrowthRate > 0) {
    multiplier += Math.min(0.8, mrrGrowthRate * 0.025); // e.g. +0.25 for 10% MoM growth
  }

  // Predictable subscription revenue increases multipliers
  if (revenueSource === 'Subscriptions (recurring)') {
    multiplier += 0.4;
  } else if (revenueSource === 'In-App Purchases / Transactions') {
    multiplier += 0.2;
  } else if (revenueSource === 'SaaS Contracts / Invoices') {
    multiplier += 0.5;
  }

  // Strong automated payout platforms decrease risk & increase multipliers
  if (payoutPlatform === 'Stripe' || payoutPlatform === 'App Store Connect') {
    multiplier += 0.4;
  } else if (payoutPlatform === 'Google Play Console' || payoutPlatform === 'Paddle') {
    multiplier += 0.2;
  }

  // Stronger jurisdiction increases multipliers slightly
  if (['United States', 'United Kingdom', 'Canada', 'Australia'].includes(country)) {
    multiplier += 0.2;
  }

  // Clamp multiplier between 2.0x and 5.0x MRR
  multiplier = Math.max(2.0, Math.min(5.0, multiplier));

  // Eligible advance amount
  let eligibleAdvance = Math.round(mrr * multiplier);

  // Apply sensible limits for MVP stage
  if (eligibleAdvance < 1000) {
    eligibleAdvance = Math.max(0, eligibleAdvance);
  }
  if (eligibleAdvance > 1500000) {
    eligibleAdvance = 1500000;
  }

  // Base fee rate is 8.0%
  let feeRate = 0.08;

  // Growth-driven fee discount: fast scaling companies receive more competitive rates
  if (mrrGrowthRate > 0) {
    feeRate -= Math.min(0.02, (mrrGrowthRate / 100) * 0.1); // e.g. -1.0% discount for 10% growth
  }

  // Deduct fee rate for high trust inputs
  if (payoutPlatform === 'Stripe' || payoutPlatform === 'App Store Connect') {
    feeRate -= 0.015; // -1.5%
  } else if (payoutPlatform === 'Google Play Console') {
    feeRate -= 0.005; // -0.5%
  }

  if (revenueSource === 'Subscriptions (recurring)') {
    feeRate -= 0.01; // -1%
  }

  if (['United States', 'United Kingdom', 'Canada'].includes(country)) {
    feeRate -= 0.005; // -0.5%
  }

  // Clamp fee rate between 4.0% and 9.5%
  feeRate = Math.max(0.040, Math.min(0.095, feeRate));

  // Round values
  const feeAmount = Math.round(eligibleAdvance * feeRate);
  const netCash = eligibleAdvance - feeAmount;

  // Repayment parameters
  // Typically 8-12% of future daily/monthly receipts until paid off
  const repaymentPercentage = revenueSource === 'Subscriptions (recurring)' ? 10 : 12;
  
  // Calculate average expected duration in months
  // If we take 10% of revenue to repay the advance:
  // Duration = eligibleAdvance / (mrr * repaymentPercentage)
  // Let's make it a nice aesthetic display term (6, 9 or 12 months)
  let repaymentTermMonths = 12;
  const ratio = eligibleAdvance / (mrr || 1);
  if (ratio <= 2.5) {
    repaymentTermMonths = 6;
  } else if (ratio <= 3.5) {
    repaymentTermMonths = 9;
  } else {
    repaymentTermMonths = 12;
  }

  return {
    eligibleAdvance,
    feeRate,
    feeAmount,
    netCash,
    repaymentPercentage,
    repaymentTermMonths,
  };
}
