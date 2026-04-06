import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HelpHintProps {
  text: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function HelpHint({ text, className, side = "top" }: HelpHintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          aria-label={text}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          className={cn(
            "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/50 align-middle text-[10px] font-semibold leading-none text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50",
            className,
          )}
        >
          ?
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} sideOffset={6} className="max-w-72 whitespace-pre-wrap leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
