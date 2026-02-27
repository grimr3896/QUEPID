import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-mono text-accent-cyan uppercase tracking-widest opacity-80">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              "flex h-10 w-full bg-bg-secondary/50 border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all font-body",
              "clip-corners-sm",
              error && "border-danger focus:border-danger focus:ring-danger",
              className
            )}
            style={{
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
            }}
            {...props}
          />
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 pointer-events-none group-focus-within:border-accent-cyan transition-colors" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 pointer-events-none group-focus-within:border-accent-cyan transition-colors" />
        </div>
        {error && <span className="text-xs text-danger font-mono">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
