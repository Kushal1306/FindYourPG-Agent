import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden",
      // Hide the native scrollbar for Webkit-based browsers
      "[&::-webkit-scrollbar]:hidden",
      // Hide the native scrollbar for Firefox
      "[-ms-overflow-style:none] [scrollbar-width:none]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport 
      className="h-full w-full rounded-[inherit]"
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors opacity-0",
        orientation === "vertical" && "h-full w-0",
        orientation === "horizontal" && "h-0",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb 
        className="relative flex-1 rounded-full bg-transparent"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
);

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
