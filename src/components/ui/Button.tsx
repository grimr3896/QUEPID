import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent-cyan/10 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary',
      secondary: 'bg-accent-purple/10 border border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-bg-primary',
      ghost: 'bg-transparent border border-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
      danger: 'bg-danger/10 border border-danger text-danger hover:bg-danger hover:text-white',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    const glowClass = glow ? 'shadow-[0_0_15px_rgba(0,229,255,0.3)]' : '';

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
          // Cut corners effect
          "clip-corners", 
          variants[variant],
          sizes[size],
          glowClass,
          className
        )}
        style={{
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
        }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
