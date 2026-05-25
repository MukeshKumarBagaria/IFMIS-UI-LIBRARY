import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

const inputVariants = cva(
  [
    "w-full rounded-md border bg-background font-sans text-body-sm text-body-primary",
    "placeholder:text-body-secondary",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-body-xs file:font-medium",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-3 py-1 text-body-xs",
        md: "h-10 px-3 py-2",
        lg: "h-11 px-4 py-2 text-body-md",
      },
      state: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  },
);

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Shows a start adornment (icon or text) inside the input on the left. */
  startAdornment?: React.ReactNode;
  /** Shows an end adornment (icon or text) inside the input on the right. */
  endAdornment?: React.ReactNode;
}

/**
 * Input — single-line text field.
 *
 * Use `state="error"` to show a red border, then render an error message
 * below using `<FormError>`.
 *
 * @example
 *   <Input placeholder="Search beneficiaries..." />
 *   <Input state="error" />
 *   <Input startAdornment={<MagnifyingGlass />} />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, size, state, startAdornment, endAdornment, type = "text", ...props },
    ref,
  ) => {
    if (startAdornment || endAdornment) {
      return (
        <div className="relative flex items-center">
          {startAdornment && (
            <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              inputVariants({ size, state }),
              startAdornment && "pl-9",
              endAdornment && "pr-9",
              className,
            )}
            {...props}
          />
          {endAdornment && (
            <span className="absolute right-3 flex items-center text-muted-foreground">
              {endAdornment}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ size, state }), className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { inputVariants };
