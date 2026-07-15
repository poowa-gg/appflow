/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  MessageSquare, 
  ThumbsUp, 
  Vote, 
  Sparkles, 
  Plus, 
  Send,
  User,
  Heart,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface IndieHackersPostProps {
  onScrollToCalculator: () => void;
}

interface ValidationComment {
  id: string;
  author: string;
  role: string;
  content: string;
  likes: number;
  timeAgo: string;
}

export default function IndieHackersPost({ onScrollToCalculator }: IndieHackersPostProps) {
  // State for copiable blocks
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Marketing Copy Options
  const copyBlocks = [
    {
      label: 'Indie Hackers Post Headline',
      text: 'Show IH: App Capital — Get up to 4x MRR advanced instantly. No equity dilution, no personal guarantees.',
    },
    {
      label: 'Supporting Pitch (Post Intro)',
      text: 'Hey Indie Hackers! Traditional bank debt is impossible for micro-studios, and VC dilution is too expensive. We built App Capital to let you get instant non-dilutive advances on your future app receipts. Hook up your feed, get cash, keep 100% of your equity. Check your numbers inside!',
    },
    {
      label: 'Call to Action (CTA)',
      text: '👉 Calculate your pre-approved limit instantly: https://app-capital.co/estimator',
    }
  ];

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Roadmaps/feature upvoting state
  const [features, setFeatures] = useState([
    { id: 'connect-plaid', title: 'Direct Plaid / Bank settlement link', desc: 'Allows instant automatic cash payout transfers.', votes: 42, userVoted: false },
    { id: 'underwrite-admob', title: 'AdMob & Ad Revenue underwriting', desc: 'Factor in mobile ad network payouts for eligibility.', votes: 29, userVoted: false },
    { id: 'underwrite-ltv', title: 'LTV / Churn rate prediction model', desc: 'Unlock higher multipliers for apps with outstanding user retention.', votes: 56, userVoted: false },
    { id: 'multiple-stores', title: 'Multi-store consolidated dashboard', desc: 'Combine iOS App Store, Google Play, and Steam revenue.', votes: 34, userVoted: false },
  ]);

  const handleVote = (id: string) => {
    setFeatures(prev => 
      prev.map(item => {
        if (item.id === id) {
          const userVoted = !item.userVoted;
          return {
            ...item,
            userVoted,
            votes: userVoted ? item.votes + 1 : item.votes - 1
          };
        }
        return item;
      })
    );
  };

  // Mock Comment boards state
  const [comments, setComments] = useState<ValidationComment[]>([
    {
      id: '1',
      author: 'Alex Rivera',
      role: 'Solopreneur, Creator of "BlurFilter"',
      content: 'This is brilliant. As an iOS developer, waiting 45 days for Apple payouts is a massive bottleneck when running Meta ads. If this integrates smoothly, I would easily pay a 6% flat fee to accelerate cash and double down on growth.',
      likes: 12,
      timeAgo: '2 hours ago'
    },
    {
      id: '2',
      author: 'Marcus Chen',
      role: 'SaaS Founder, Lead developer',
      content: 'I love that there are no personal guarantees. Traditional banks treat software businesses like risk-hazards because we do not have physical collateral. Linking read-only Stripe APIs is a perfect way to evaluate cashflow.',
      likes: 8,
      timeAgo: '4 hours ago'
    },
    {
      id: '3',
      author: 'Elena Rostova',
      role: 'Co-Founder, TinyPixel Studio',
      content: 'Could you support Shopify App payouts soon? Most of our clients are on Shopify subscription models and that recurring revenue is incredibly stable.',
      likes: 15,
      timeAgo: '1 day ago'
    }
  ]);

  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) {
      setCommentError('Please fill in both name and comment.');
      return;
    }

    const comment: ValidationComment = {
      id: Date.now().toString(),
      author: newCommentAuthor.trim(),
      role: 'App Founder / Indie Hacker',
      content: newCommentText.trim(),
      likes: 1,
      timeAgo: 'Just now'
    };

    setComments(prev => [comment, ...prev]);
    setNewCommentAuthor('');
    setNewCommentText('');
    setCommentError('');
  };

  const handleLikeComment = (id: string) => {
    setComments(prev => 
      prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c)
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-zinc-200">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
          VALIDATION KIT & COMMUNITY
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mt-3">
          Startup Validation & Traction Center
        </h2>
        <p className="mt-2 text-zinc-500 max-w-2xl mx-auto text-sm">
          A preview of marketing copy optimized for launch validation (e.g. Indie Hackers or Product Hunt) along with an interactive feature roadmap voting desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Indie Hackers Copiable Copy & Comments Thread (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Pitch Copier Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
              <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
              Launch Copy Media Kit
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Use these copy formulas for launching on developer hubs to drive high-converting waitlist signups.
            </p>

            <div className="space-y-5">
              {copyBlocks.map((block, index) => (
                <div key={index} className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 relative">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{block.label}</span>
                    <button
                      onClick={() => handleCopyText(block.text, index)}
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-950 flex items-center gap-1 bg-white border border-zinc-200 px-2.5 py-1 rounded-lg hover:bg-zinc-50 transition-all active:scale-95 cursor-pointer"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-zinc-700 font-sans leading-relaxed select-all">
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Indie Hackers Mock Comments Section */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2 mb-2">
              <MessageSquare className="h-4.5 w-4.5 text-zinc-500" />
              Founder Feedback Board
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Live feedback received from pre-approved founders during our alpha validation phase.
            </p>

            {/* Comment Submission Form */}
            <form onSubmit={handleAddComment} className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 mb-6 space-y-4">
              <span className="text-xs font-bold text-zinc-700 block uppercase tracking-wider">Leave Feedback / Ask Question</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Sarah J.)"
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  className="w-full text-xs rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                <span className="text-xs text-zinc-400 flex items-center bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-lg font-medium">
                  Role: Founder / Indie Hacker
                </span>
              </div>
              <textarea
                placeholder="Write your constructive feedback or feature suggestion..."
                rows={3}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {commentError && <p className="text-xs text-rose-600 font-semibold">{commentError}</p>}
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-zinc-400">All submissions help guide our underwriting algorithms.</span>
                <button
                  type="submit"
                  className="flex items-center gap-1 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  <span>Submit Comment</span>
                </button>
              </div>
            </form>

            {/* Comments Stream */}
            <div className="space-y-5">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-zinc-100 pb-5 last:border-none last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-zinc-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-950">{comment.author}</h4>
                        <span className="text-[10px] text-zinc-400">{comment.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400">{comment.timeAgo}</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-normal pl-9">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 pl-9">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="text-[10px] font-semibold text-zinc-500 hover:text-emerald-700 flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded transition-all active:scale-95"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Roadmap voting Desk (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Interactive Feature voting Roadmap */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Vote className="h-5 w-5 text-emerald-600" />
              <h3 className="font-display text-base font-bold text-zinc-950">
                Underwriting Roadmap
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mb-6 leading-normal">
              Upvote specific capabilities you need to see. We build what the community requests most.
            </p>

            <div className="space-y-3">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                    feature.userVoted
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="pr-3">
                    <h4 className="text-xs font-bold text-zinc-900">{feature.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                      {feature.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleVote(feature.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border w-11 shrink-0 transition-all active:scale-95 cursor-pointer ${
                      feature.userVoted
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${feature.userVoted ? 'fill-current text-white' : 'text-zinc-400'}`} />
                    <span className="text-[10px] font-bold font-mono mt-1 leading-none">{feature.votes}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
              <button
                onClick={onScrollToCalculator}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-950 transition-colors"
              >
                <span>Calculate your advance & suggest dynamic terms</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Social Proof Checklist */}
          <div className="bg-zinc-900 text-white rounded-2xl p-6 border border-zinc-800">
            <h4 className="font-display text-sm font-bold text-zinc-100 flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
              Validation Playbook
            </h4>
            <ul className="text-xs text-zinc-400 space-y-2.5 leading-normal">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span><strong>Step 1:</strong> Enter your App MRR in our calculator to model risk scenarios.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span><strong>Step 2:</strong> Pre-approve your App, copying the customized IH Launch template.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span><strong>Step 3:</strong> Gather feedback from fellow bootstrappers to optimize capital multipliers.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
