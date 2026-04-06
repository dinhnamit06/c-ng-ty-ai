import type { ReactNode } from "react";
import { HelpHint } from "./HelpHint";

interface SidebarSectionProps {
  label: string;
  children: ReactNode;
  helpText?: string;
}

export function SidebarSection({ label, children, helpText }: SidebarSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest font-mono text-muted-foreground/60">
        <span>{label}</span>
        {helpText ? <HelpHint text={helpText} className="h-3.5 w-3.5 text-[9px]" /> : null}
      </div>
      <div className="flex flex-col gap-0.5 mt-0.5">{children}</div>
    </div>
  );
}
