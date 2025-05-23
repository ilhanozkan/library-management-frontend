import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, label, error, onChange, fullWidth = false, className, ...props },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

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
        <select
          ref={ref}
          className={cn(
            "rounded-md shadow-sm border border-gray-300",
            "focus:border-primary-500 focus:ring-primary-500",
            "block w-full sm:text-sm py-2 pl-3 pr-10",
            error
              ? "border-error-500 focus:border-error-500 focus:ring-error-500"
              : "",
            className,
          )}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
