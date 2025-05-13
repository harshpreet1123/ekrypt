/* eslint-disable react/display-name */
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  border?: boolean;
}

// eslint-disable-next-line react/display-name
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, border = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all",
          glass && "backdrop-blur-lg bg-white/10",
          border && "border border-white/20",
          className
        )}
        {...props}
      />
    );
  }
);

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withSeparator?: boolean;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withSeparator = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5 p-6",
          withSeparator && "border-b border-white/20",
          className
        )}
        {...props}
      />
    );
  }
);

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight text-white", className)}
        {...props}
      />
    );
  }
);

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-white/80", className)}
        {...props}
      />
    );
  }
);

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 pt-0", className)}
        {...props}
      />
    );
  }
);

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
      />
    );
  }
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };