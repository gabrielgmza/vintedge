import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: 'default' | 'dark';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full px-4 py-2 text-base font-cormorant transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'default' && [
            'border border-[#ddd] bg-white text-[#1A1A1A]',
            'focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20',
          ],
          variant === 'dark' && [
            'border border-white/20 bg-white/5 text-white placeholder:text-white/40',
            'focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20',
          ],
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
