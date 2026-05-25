import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";

/**
 * Label — accessible form field label.
 *
 * Always pair with an `<Input>` via `htmlFor` / `id`.
 * Shows a red asterisk when `required` is true.
 *
 * @example
 *   <Label htmlFor="email">Email address</Label>
 *   <Label htmlFor="pan" required>PAN Number</Label>
 */
export interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-body-xs font-medium text-body-primary leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  ),
);

Label.displayName = "Label";
