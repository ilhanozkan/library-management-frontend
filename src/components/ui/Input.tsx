import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("flex flex-col", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "rounded-md shadow-sm border border-gray-300 focus:border-primary-500 focus:ring-primary-500",
              "block w-full sm:text-sm",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              "py-2",
              error
                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                : "",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
