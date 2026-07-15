/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  shape: 'circle' | 'square' | 'triangle' | 'dollar' | 'star';
  duration: number;
  delay: number;
}

export default function CelebrationConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      'bg-emerald-500', 'bg-teal-400', 'bg-amber-400', 'bg-sky-400', 
      'bg-emerald-400', 'bg-teal-500', 'bg-yellow-300'
    ];
    const textColors = [
      'text-emerald-500', 'text-teal-400', 'text-amber-400', 'text-sky-400', 
      'text-yellow-300'
    ];
    const shapes: ('circle' | 'square' | 'triangle' | 'dollar' | 'star')[] = [
      'circle', 'square', 'triangle', 'dollar', 'star'
    ];

    const temp: Particle[] = [];
    // Generate 75 high-fidelity particle vectors for the initial burst
    for (let i = 0; i < 75; i++) {
      const isDollarOrStar = Math.random() > 0.5;
      const id = i;
      // Burst outwards from center bottom
      const x = (Math.random() - 0.5) * 450; // lateral scatter
      const y = -120 - Math.random() * 320;  // vertical launch height
      const colorClass = isDollarOrStar 
        ? textColors[Math.floor(Math.random() * textColors.length)]
        : colors[Math.floor(Math.random() * colors.length)];
      
      temp.push({
        id,
        x,
        y,
        color: colorClass,
        size: Math.floor(Math.random() * 12) + 10, // 10px to 22px
        rotation: Math.random() * 360,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        duration: 2.2 + Math.random() * 1.8, // 2.2s to 4.0s
        delay: Math.random() * 0.3
      });
    }
    setParticles(temp);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 flex items-end justify-center">
      {particles.map((p) => {
        const renderShape = () => {
          if (p.shape === 'dollar') {
            return (
              <span 
                className={`font-mono font-extrabold select-none ${p.color}`} 
                style={{ fontSize: `${p.size}px` }}
              >
                $
              </span>
            );
          }
          if (p.shape === 'star') {
            return (
              <svg className={`w-full h-full fill-current ${p.color}`} viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            );
          }
          if (p.shape === 'circle') {
            return <div className={`w-full h-full rounded-full ${p.color} opacity-80`} />;
          }
          if (p.shape === 'triangle') {
            return (
              <svg className={`w-full h-full fill-current ${p.color.replace('bg-', 'text-')}`} viewBox="0 0 24 24">
                <polygon points="12,2 22,22 2,22" />
              </svg>
            );
          }
          return <div className={`w-full h-full rotate-45 ${p.color} opacity-80`} />;
        };

        return (
          <motion.div
            key={p.id}
            initial={{ 
              x: 0, 
              y: 100, 
              opacity: 0, 
              scale: 0.1, 
              rotate: 0 
            }}
            animate={{ 
              x: p.x, 
              y: p.y, 
              opacity: [0, 1, 1, 0.7, 0], 
              scale: [0.1, 1.2, 1, 0.6, 0],
              rotate: p.rotation * 3
            }}
            transition={{ 
              duration: p.duration, 
              delay: p.delay, 
              ease: [0.12, 0.85, 0.3, 1] 
            }}
            className="absolute bottom-1/4"
            style={{ 
              width: `${p.size}px`, 
              height: `${p.size}px`,
            }}
          >
            {renderShape()}
          </motion.div>
        );
      })}
    </div>
  );
}
