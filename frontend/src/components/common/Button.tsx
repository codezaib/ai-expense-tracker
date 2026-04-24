import React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading,
  icon: Icon,
  disabled,
  ...props
}: any) => {
  const variants: Record<string, string> = {
    primary:
      "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/25",
    secondary:
      "bg-surface border border-app hover:bg-muted/10 hover:border-primary/40",
    ghost: "hover:bg-muted/10 text-muted-app hover:text-app",
    danger:
      "bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white",
    success:
      "bg-success/10 text-success border border-success/20 hover:bg-success hover:text-white",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
