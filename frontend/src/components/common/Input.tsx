import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const Input = ({ label, error, type = 'text', className, icon: Icon, ...props }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-app ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-app transition-colors group-focus-within:text-app">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            "w-full bg-surface border border-app rounded-xl px-3 py-2.5 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted/30",
            Icon && "pl-10",
            error && "border-danger focus:ring-danger/10",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-app hover:text-app"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-danger font-medium ml-1">{error}</span>}
    </div>
  );
};

export default Input;