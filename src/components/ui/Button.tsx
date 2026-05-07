import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50',
        {
          primary:
            'bg-brand-500 text-white shadow-sm hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400',
          secondary:
            'bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-900/40 dark:text-brand-100',
          ghost:
            'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
          whatsapp:
            'border-2 border-[#25D366] bg-white text-[#128C7E] hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30',
          outline:
            'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
        }[variant],
        {
          sm: 'min-h-9 px-4 text-sm',
          md: 'min-h-11 px-6 text-sm',
          lg: 'min-h-12 px-8 text-base',
        }[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
