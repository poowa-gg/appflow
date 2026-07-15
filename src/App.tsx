/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WaitlistSubmission } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import IndieHackersPost from './components/IndieHackersPost';
import Footer from './components/Footer';

export default function App() {
  const [submission, setSubmission] = useState<WaitlistSubmission | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check for existing submissions on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('appcapital_submission');
      if (stored) {
        setSubmission(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading submission from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Handle new submission
  const handleSubmission = (newSubmission: WaitlistSubmission) => {
    setSubmission(newSubmission);
    try {
      localStorage.setItem('appcapital_submission', JSON.stringify(newSubmission));
    } catch (e) {
      console.error('Error saving submission to localStorage', e);
    }
    
    // Smooth scroll to the top of the viewport to showcase the dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset/Clear submission to test different numbers
  const handleResetApp = () => {
    setSubmission(null);
    try {
      localStorage.removeItem('appcapital_submission');
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
    
    // Smooth scroll to the calculator form
    setTimeout(() => {
      const calcSection = document.getElementById('calculator-section');
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Helper scroll actions
  const scrollToCalculator = () => {
    const calcSection = document.getElementById('calculator-section');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToIndiePost = () => {
    const indieSection = document.getElementById('indie-post-section');
    if (indieSection) {
      indieSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="font-display text-sm font-semibold text-zinc-600">
            Loading App Capital Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Navbar always accessible */}
      <Navbar 
        onNavigateToCalculator={scrollToCalculator}
        onNavigateToIndiePost={scrollToIndiePost}
        onResetApp={handleResetApp}
        hasSubmission={submission !== null}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {submission === null ? (
            // Landing View Flow
            <motion.div
              key="landing-flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {/* Hero Banner with value propositions */}
              <Hero onScrollToCalculator={scrollToCalculator} />

              {/* Central Core Calculator and Waitlist lock-in */}
              <div className="border-t border-zinc-200">
                <Calculator onSubmit={handleSubmission} />
              </div>
            </motion.div>
          ) : (
            // Private Founder Dashboard Flow
            <motion.div
              key="dashboard-flow"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Dashboard submission={submission} onReset={handleResetApp} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Kit & Indie Hackers post Section (Always available for validation reviews) */}
        <div id="indie-post-section" className="bg-zinc-50">
          <IndieHackersPost onScrollToCalculator={scrollToCalculator} />
        </div>
      </main>

      {/* Corporate and Regulatory Compliant Footer */}
      <Footer 
        onScrollToCalculator={scrollToCalculator}
        onNavigateToIndiePost={scrollToIndiePost}
      />
    </div>
  );
}
