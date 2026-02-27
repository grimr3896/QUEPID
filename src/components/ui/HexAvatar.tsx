import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface HexAvatarProps {
  src: string;
  alt: string;
  status?: 'active_signal' | 'standby' | 'cloaked' | 'offline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function HexAvatar({ src, alt, status = 'offline', size = 'md', className }: HexAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const statusColors = {
    active_signal: 'border-accent-cyan shadow-[0_0_10px_var(--color-accent-cyan)]',
    standby: 'border-warning shadow-[0_0_5px_var(--color-warning)]',
    cloaked: 'border-text-secondary opacity-50',
    offline: 'border-text-secondary',
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Hexagon Clip Path Container */}
      <div 
        className={cn(
          "absolute inset-0 z-10 border-2 transition-all duration-300",
          statusColors[status],
          "hexagon-border" // We'll need custom CSS for true hex borders or SVG
        )}
        style={{
           clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
           background: 'transparent',
           zIndex: 20
        }}
      />
      
      {/* Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      />

      {/* Status Indicator Glow (Optional extra ring) */}
      {status === 'active_signal' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-accent-cyan opacity-20 z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
             clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
      )}
    </div>
  );
}
