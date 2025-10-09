import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'container' | 'full' | 'centered';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Layout responsivo unificado que mantém a identidade visual desktop
 * em todas as plataformas (Mobile, App, PWA)
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  variant = 'container',
  spacing = 'md'
}) => {
  const baseClasses = {
    container: 'fluxo-container',
    full: 'w-full',
    centered: 'fluxo-container flex flex-col items-center'
  };

  const spacingClasses = {
    xs: 'fluxo-spacing-xs',
    sm: 'fluxo-spacing-sm',
    md: 'fluxo-spacing-md',
    lg: 'fluxo-spacing-lg',
    xl: 'fluxo-spacing-xl'
  };

  return (
    <div className={cn(
      baseClasses[variant],
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 'auto';
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * Grid responsivo que mantém proporções e espaçamentos consistentes
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 'auto',
  className,
  gap = 'md'
}) => {
  const gridClasses = {
    1: 'fluxo-grid-1',
    2: 'fluxo-grid-2',
    3: 'fluxo-grid-3',
    4: 'fluxo-grid-4',
    auto: 'fluxo-grid-auto'
  };

  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };

  return (
    <div className={cn(
      gridClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Card responsivo com design system unificado
 */
export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  header,
  footer
}) => {
  const variantClasses = {
    default: 'fluxo-card',
    elevated: 'fluxo-card shadow-colorful-lg',
    outlined: 'fluxo-card border-2 border-blue-200'
  };

  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      {header && (
        <div className="fluxo-card-header">
          {header}
        </div>
      )}
      <div className={cn('fluxo-card-content', paddingClasses[padding])}>
        {children}
      </div>
      {footer && (
        <div className="fluxo-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

interface ResponsiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Botão responsivo com design system unificado
 */
export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const variantClasses = {
    primary: 'fluxo-btn-primary',
    secondary: 'fluxo-btn-secondary',
    ghost: 'fluxo-btn-ghost'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        'mobile-touch transition-all duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};

interface ResponsiveInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Input responsivo com design system unificado
 */
export const ResponsiveInput: React.FC<ResponsiveInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  required = false
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      style={{ 
        background: 'white', 
        backgroundColor: 'white',
        color: '#374151'
      }}
      className={cn(
        'fluxo-input mobile-touch',
        'bg-white text-gray-700 border-gray-300',
        'focus:bg-white focus:text-gray-700',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    />
  );
};

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Tabela responsiva com scroll horizontal em mobile
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  children,
  className
}) => {
  return (
    <div className="fluxo-table-container mobile-table-scroll">
      <table className={cn('fluxo-table', className)}>
        {children}
      </table>
    </div>
  );
};

interface ResponsiveSelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Select responsivo com fundo branco forçado
 */
export const ResponsiveSelect: React.FC<ResponsiveSelectProps> = ({
  children,
  value,
  onValueChange,
  className,
  disabled = false
}) => {
  return (
    <div 
      className={cn(
        'relative',
        className
      )}
      style={{ 
        background: 'white', 
        backgroundColor: 'white'
      }}
    >
      {children}
    </div>
  );
};

interface ResponsiveSelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Trigger do Select com fundo branco garantido
 */
export const ResponsiveSelectTrigger: React.FC<ResponsiveSelectTriggerProps> = ({
  children,
  className
}) => {
  return (
    <button
      className={cn(
        'fluxo-select mobile-touch',
        'bg-white text-gray-700 border-gray-300',
        'focus:bg-white focus:text-gray-700',
        'w-full flex items-center justify-between',
        className
      )}
      style={{ 
        background: 'white !important', 
        backgroundColor: 'white !important',
        color: '#374151 !important'
      }}
    >
      {children}
    </button>
  );
};

interface ResponsiveSelectContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Content do Select com fundo branco garantido
 */
export const ResponsiveSelectContent: React.FC<ResponsiveSelectContentProps> = ({
  children,
  className
}) => {
  return (
    <div
      className={cn(
        'absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg',
        'max-h-60 overflow-auto',
        className
      )}
      style={{ 
        background: 'white !important', 
        backgroundColor: 'white !important',
        color: '#374151 !important'
      }}
    >
      {children}
    </div>
  );
};

// Exportar todos os componentes
export {
  ResponsiveLayout as Layout,
  ResponsiveGrid as Grid,
  ResponsiveCard as Card,
  ResponsiveButton as Button,
  ResponsiveInput as Input,
  ResponsiveTable as Table,
  ResponsiveSelect as Select,
  ResponsiveSelectTrigger as SelectTrigger,
  ResponsiveSelectContent as SelectContent
};