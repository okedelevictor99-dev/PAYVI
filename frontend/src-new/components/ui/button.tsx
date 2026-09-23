import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading = false,
      variant = "primary",
      disabled,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const baseStyles =
      "flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60";

    const variantStyles =
      variant === "primary"
        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
        : "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]";

    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={
          isDisabled
            ? undefined
            : {
                y: -2,
                boxShadow:
                  variant === "primary"
                    ? "0 6px 16px var(--color-primary-shadow)"
                    : "0 6px 16px var(--color-secondary-shadow)",
                backgroundColor:
                  variant === "primary"
                    ? "var(--color-primary-hover)"
                    : "var(--color-secondary-hover)",
              }
        }
        whileTap={isDisabled ? undefined : { scale: 0.97, y: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`${baseStyles} ${variantStyles} ${className}`}
        {...rest}
      >
        {isLoading && (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        <span className={isLoading ? "opacity-90" : ""}>{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";