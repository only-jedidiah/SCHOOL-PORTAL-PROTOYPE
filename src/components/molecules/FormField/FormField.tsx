import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../../atoms/Typography/Typography';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  hint,
  error,
  children,
  className,
}) => {
  return (
    <div className={twMerge(clsx('space-y-1.5 w-full', className))}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-text-secondary">
          {label} {required && <span className="text-accent-rose">*</span>}
        </label>
        {hint && <span className="text-[11px] text-text-muted">{hint}</span>}
      </div>
      {children}
      {error && (
        <Typography variant="caption" className="text-accent-rose">
          {error}
        </Typography>
      )}
    </div>
  );
};
