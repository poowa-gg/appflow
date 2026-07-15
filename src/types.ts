/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EligibilityInputs {
  appName: string;
  mrr: number;
  mrrGrowthRate: number; // Month-over-Month growth rate as a percentage, e.g. 10 for 10%
  revenueSource: string;
  payoutPlatform: string;
  email: string;
  country: string;
  consent: boolean;
}

export interface CapitalEstimate {
  eligibleAdvance: number;
  feeRate: number;
  feeAmount: number;
  netCash: number;
  repaymentPercentage: number;
  repaymentTermMonths: number;
}

export interface WaitlistSubmission extends EligibilityInputs {
  id: string;
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'additional_info_needed' | 'funding_ready';
  estimate: CapitalEstimate;
}

export interface MarketingCopy {
  headline: string;
  subheading: string;
  ctaText: string;
}
