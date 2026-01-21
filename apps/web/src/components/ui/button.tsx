import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#722F37] text-white hover:bg-[#5a252c] shadow-sm hover:shadow-luxury',
        gold:
          'bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#E5C349] shadow-sm hover:shadow-gold',
        outline:
          'border-2 border-[#722F37] text-[#722F37] bg-transparent hover:bg-[#722F37] hover:text-white',
        outlineLight:
          'border-2 border-white/30 text-white bg-transparent hover:border-white hover:bg-white/10',
        outlineGold:
          'border-2 border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37] hover:text-[#0A0A0A]',
        ghost:
          'text-[#722F37] hover:bg-[#722F37]/10',
        ghostLight:
          'text-white/80 hover:bg-white/10 hover:text-white',
        link:
          'text-[#722F37] underline-offset-4 hover:underline',
        destructive:
          'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 py-4 text-base',
        xl: 'h-16 px-10 py-5 text-base',
        icon: 'h-10 w-10',
        iconSm: 'h-8 w-8',
        iconLg: 'h-12 w-12',
      },
      rounded: {
        default: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
