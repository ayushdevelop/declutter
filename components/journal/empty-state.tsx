"use client";

import * as React from "react";
import { Feather } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  isToday?: boolean;
  className?: string;
}

export function EmptyState({ isToday = false, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
        <Feather className="w-8 h-8 text-stone-400" />
      </div>
      <h3 className="text-lg font-medium text-stone-900 mb-2">
        {isToday ? "This moment is yours" : "A quiet day"}
      </h3>
      <p className="text-sm text-stone-600 max-w-sm">
        {isToday
          ? "No pressure. Write when you're ready. Even a few words can help."
          : "Some days speak louder in silence."}
      </p>
    </div>
  );
}
