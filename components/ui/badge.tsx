import * as React from "react"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
      variant === 'secondary' 
        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        : 'bg-primary text-primary-foreground hover:bg-primary/80'
    } ${className}`}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge } 