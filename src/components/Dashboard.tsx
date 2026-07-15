/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Download, 
  Building2, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Check, 
  Mail, 
  ArrowRight,
  Sparkles,
  Info,
  Share2
} from 'lucide-react';
import { WaitlistSubmission } from '../types';
import CelebrationConfetti from './CelebrationConfetti';

interface DashboardProps {
  submission: WaitlistSubmission;
  onReset: () => void;
}

export default function Dashboard({ submission, onReset }: DashboardProps) {
  const { appName, mrr, revenueSource, payoutPlatform, email, country, id, estimate, submittedAt } = submission;

  const [copiedShare, setCopiedShare] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Trigger an initial burst on dashboard mount
  useEffect(() => {
    setConfettiTrigger(1);
    const timer = setTimeout(() => {
      setConfettiTrigger(0);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const triggerConfettiAgain = () => {
    setConfettiTrigger(prev => prev + 1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Pre-Approval ID',
      'App Name',
      'Monthly Recurring Revenue (MRR)',
      'MoM Growth Rate',
      'Revenue Model',
      'Payout Platform',
      'Country',
      'Business Email',
      'Eligible Capital Advance',
      'Flat Fee Percentage',
      'Flat Fee Amount',
      'Net Cash Transferred',
      'Repayment Percentage',
      'Repayment Term (Months)',
      'Timestamp'
    ];

    const data = [
      id,
      appName,
      `$${mrr}`,
      `${submission.mrrGrowthRate ?? 12}%`,
      revenueSource,
      payoutPlatform,
      country,
      email,
      `$${estimate.eligibleAdvance}`,
      `${(estimate.feeRate * 100).toFixed(1)}%`,
      `$${estimate.feeAmount}`,
      `$${estimate.netCash}`,
      `${estimate.repaymentPercentage}%`,
      `${estimate.repaymentTermMonths}`,
      submittedAt
    ];

    const csvContent = [
      headers.join(','),
      data.map(val => {
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') ? `"${str}"` : str;
      }).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AppCapital_Offer_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/?offer=${id}&mrr=${mrr}&growth=${submission.mrrGrowthRate ?? 12}&source=${encodeURIComponent(revenueSource)}`;
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (e) {
      console.error('Failed to copy share link', e);
    }
  };

  // Checklist item verification states
  const [checklist, setChecklist] = useState([
    { id: 'payout', title: `Link Read-Only ${payoutPlatform} Access`, desc: 'Enables safe automated validation of your historical receipts.', state: 'pending', actionText: 'Connect API Feed' },
    { id: 'bank', title: 'Verify Settlement Bank Account', desc: 'Securely link the bank where funds will be transferred.', state: 'pending', actionText: 'Link with Plaid' },
    { id: 'kyc', title: 'Upload Founder ID & Business License', desc: 'Required for standard anti-money laundering compliance checks.', state: 'pending', actionText: 'Upload Documents' },
    { id: 'term', title: 'Review & Sign Non-Binding Term Sheet', desc: 'Digitally confirm the estimated terms of your advance.', state: 'pending', actionText: 'Review Term Sheet' },
  ]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Calculate percentage progress of checklist
  const completedCount = checklist.filter(item => item.state === 'completed').length;
  const progressPercent = Math.round((completedCount / checklist.length) * 105); // 0, 25, 50, 75, 100

  // Click handler to simulate linking/completing a task
  const handleVerifyItem = (itemId: string) => {
    if (checklist.find(item => item.id === itemId)?.state === 'completed') return;
    
    setLoadingId(itemId);
    
    setTimeout(() => {
      setChecklist(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, state: 'completed' } : item
        )
      );
      setLoadingId(null);
    }, 1200);
  };

  // Generate a realistic 6-month or 12-month projected repayment schedule table based on MRR
  const generateSchedule = () => {
    const schedule = [];
    let remainingBalance = estimate.eligibleAdvance;
    const monthlyRevenue = mrr;
    const repaymentRate = estimate.repaymentPercentage / 100;
    
    // Simulate month by month
    for (let month = 1; month <= estimate.repaymentTermMonths; month++) {
      // Assume slight conservative revenue growth of 3% MoM
      const projectedRevenue = Math.round(monthlyRevenue * Math.pow(1.03, month - 1));
      let projectedRemittance = Math.round(projectedRevenue * repaymentRate);
      
      // If remaining balance is less than projected remittance, adjust last month's payment
      if (remainingBalance < projectedRemittance || month === estimate.repaymentTermMonths) {
        projectedRemittance = Math.round(remainingBalance);
      }
      
      remainingBalance = Math.max(0, remainingBalance - projectedRemittance);
      
      schedule.push({
        month: `Month ${month}`,
        projectedRevenue,
        projectedRemittance,
        remainingBalance,
      });

      if (remainingBalance <= 0) break;
    }
    return schedule;
  };

  const scheduleData = generateSchedule();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Celebration animation trigger */}
      {confettiTrigger > 0 && <CelebrationConfetti key={confettiTrigger} />}

      {/* Top Banner Alert */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 mb-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-emerald-950">Pre-Approved Capital Lock-In Successful</span>
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">ACTIVE OFFER</span>
            </div>
            <p className="text-sm text-emerald-800/90 mt-1 max-w-2xl leading-normal">
              Congratulations! Your pre-approval ID <strong className="font-mono text-emerald-950 font-bold">{id}</strong> is registered. Secure your final payout slot by completing the self-service verification steps below.
            </p>
          </div>
        </div>

        {/* Action Button Suite */}
        <div className="flex flex-wrap gap-2.5 shrink-0 w-full xl:w-auto">
          <button
            onClick={handleShareLink}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer ${
              copiedShare 
                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700' 
                : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copiedShare ? 'Link Copied!' : 'Share Offer'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 transition-all active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={triggerConfettiAgain}
            className="text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 transition-all active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>🎉 Celebrate</span>
          </button>

          <button
            onClick={onReset}
            className="text-xs font-semibold text-emerald-950 bg-emerald-200/50 hover:bg-emerald-200/80 px-4 py-2.5 rounded-xl border border-emerald-300/40 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            Modify Estimates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Offer Details and Verification Checklist (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Onboarding Verification Checklist */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-zinc-900">
                  Verification Dashboard
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Complete these read-only steps to release funds to your bank account.
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-zinc-900 font-mono">{progressPercent}%</span>
                <span className="text-xs text-zinc-400 block">Complete</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-8 border border-zinc-200/40">
              <div 
                className="bg-emerald-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                    item.state === 'completed'
                      ? 'bg-zinc-50/50 border-zinc-200'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex gap-3 max-w-md">
                    {item.state === 'completed' ? (
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300" />
                    )}
                    <div>
                      <h4 className={`text-sm font-semibold ${item.state === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 text-right">
                    {item.state === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyItem(item.id)}
                        disabled={loadingId !== null}
                        className="w-full sm:w-auto text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-200/80 transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {loadingId === item.id ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-zinc-700" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <span>{item.actionText}</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 100% Verification Success Banner */}
            {progressPercent >= 100 && (
              <div className="mt-8 rounded-xl bg-gradient-to-r from-zinc-950 to-zinc-900 text-white p-6 shadow-md ring-1 ring-zinc-800 relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />
                <h4 className="font-display text-base font-bold text-emerald-400 flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" />
                  All Checks Passed • Desk Alerted
                </h4>
                <p className="text-xs text-zinc-300 leading-normal mb-4">
                  Our underwriting team has been automatically pinged with your complete metadata report. Your designated Capital Manager is preparing your closing documents.
                </p>
                <div className="rounded-lg bg-zinc-850 p-3.5 border border-zinc-800 flex items-center gap-2 text-xs text-zinc-200">
                  <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    A final signing link has been queued for <strong className="text-white">{email}</strong>. Expected response within 4 hours.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Underwriting Terms & Disclaimers Box */}
          <div className="bg-zinc-100 rounded-xl p-5 border border-zinc-200 text-xs text-zinc-500 space-y-3">
            <h5 className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-zinc-600" />
              Underwriting Disclaimers & Regulatory Transparency
            </h5>
            <p className="leading-normal">
              App Capital (or UpCap) provides non-dilutive purchase agreements of future receipts. It is not structured as an interest-bearing loan, regulated consumer credit, or retail lending product. All calculations are estimated models based on historic payment trends.
            </p>
            <p className="leading-normal">
              No personal collateral, equity dilution, or negative interest rates apply. Final funding contracts are contingent upon secure verification of App Store Connect and Stripe developer credentials in downstream review.
            </p>
          </div>
        </div>

        {/* Right Column: Capital Summary and Dynamic Projected Schedule (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Locked-In Offer Statistics */}
          <div className="bg-zinc-950 text-white rounded-2xl p-6 shadow-lg border border-zinc-850 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
            
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              Current Contract Proposal
            </span>
            <h3 className="font-display text-lg font-bold text-zinc-100 mt-0.5 mb-6">
              Lock-In Capital Summary
            </h3>

            {/* Money Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border-r border-zinc-800/80 pr-2">
                <span className="text-[11px] text-zinc-400 block">Eligible Advance</span>
                <span className="font-mono text-xl font-bold text-white block mt-0.5">
                  ${estimate.eligibleAdvance.toLocaleString()}
                </span>
              </div>
              <div className="pl-2">
                <span className="text-[11px] text-zinc-400 block">Transfer Net Cash</span>
                <span className="font-mono text-xl font-bold text-emerald-400 block mt-0.5">
                  ${estimate.netCash.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Revenue & Growth Metrics Row */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
              <div className="border-r border-zinc-800/60 pr-2">
                <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Verified MRR</span>
                <span className="font-mono text-sm font-bold text-zinc-200 block mt-0.5">
                  ${mrr.toLocaleString()}
                </span>
              </div>
              <div className="pl-2">
                <span className="text-[10px] text-zinc-400 block uppercase font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  MoM Growth
                </span>
                <span className={`font-mono text-sm font-bold block mt-0.5 ${
                  (submission.mrrGrowthRate ?? 12) > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  { (submission.mrrGrowthRate ?? 12) > 0 ? `+${submission.mrrGrowthRate ?? 12}%` : `${submission.mrrGrowthRate ?? 12}%` }
                </span>
              </div>
            </div>

            {/* Fee parameters */}
            <div className="space-y-3.5 border-t border-zinc-800/80 pt-5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Flat Administration Fee</span>
                <span className="font-mono text-zinc-200">
                  ${estimate.feeAmount.toLocaleString()} ({ (estimate.feeRate * 100).toFixed(1) }%)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Disbursement Bank</span>
                <span className="text-zinc-200">
                  {checklist.find(i => i.id === 'bank')?.state === 'completed' ? 'Linked Settlement Account' : 'Verification Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Revenue Recouper</span>
                <span className="text-zinc-200">
                  {estimate.repaymentPercentage}% of receipts
                </span>
              </div>
              <div className="flex justify-between">
                <span>Underwriting Model</span>
                <span className="text-zinc-200 font-mono text-[11px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-emerald-400">
                  UPCAP-V1.4-FAST
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Monthly Repayment Simulation */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-1.5 mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h4 className="font-display text-sm font-bold text-zinc-900">
                Projected Repayment Schedule
              </h4>
            </div>
            
            <p className="text-xs text-zinc-500 mb-4 leading-normal">
              Based on your MRR of <strong className="text-zinc-700">${mrr.toLocaleString()}</strong>, here is how the advance recovers dynamically over time:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left text-zinc-500">
                <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th scope="col" className="px-2 py-2">Period</th>
                    <th scope="col" className="px-2 py-2 text-right">Proj. Sales</th>
                    <th scope="col" className="px-2 py-2 text-right">Remit ({estimate.repaymentPercentage}%)</th>
                    <th scope="col" className="px-2 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {scheduleData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="px-2 py-2.5 font-medium text-zinc-900">{row.month}</td>
                      <td className="px-2 py-2.5 text-right font-mono">${row.projectedRevenue.toLocaleString()}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-emerald-700 font-semibold">${row.projectedRemittance.toLocaleString()}</td>
                      <td className="px-2 py-2.5 text-right font-mono">${row.remainingBalance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-[10px] text-zinc-500 leading-normal">
              <strong className="text-zinc-700">Dynamic Adjustments:</strong> If your revenue drop below projections, your actual monthly remittance slows down automatically. There are no compound interest fees or penalties.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
