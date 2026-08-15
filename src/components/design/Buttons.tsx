import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
} & ComponentProps<"button">;

export function Button({ children, icon, href, variant = "primary", className = "", ...props }: ButtonProps) {
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  const classes = `button button-${variant} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
