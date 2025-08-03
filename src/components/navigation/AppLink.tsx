import { cn } from '@/lib';
import { Link, type LinkProps } from 'react-router';

interface AppLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  variant?: 'default' | 'button' | 'nav';
  active?: boolean;
}

export function AppLink({
  to,
  className,
  variant = 'default',
  active = false,
  children,
  ...props
}: AppLinkProps) {
  const baseStyles = 'transition-colors duration-200';

  const variants = {
    default: 'text-blue-600 hover:text-blue-800 underline',
    button:
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
    nav: cn(
      'block px-3 py-2 rounded-md text-base font-medium',
      active
        ? 'text-primary bg-primary/10'
        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
    ),
  };

  return (
    <Link
      to={to}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
