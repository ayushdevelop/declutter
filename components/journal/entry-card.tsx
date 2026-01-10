"use client";

import * as React from "react";
import { cardVariants } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { moodOptions } from "./mood-selector";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EntryCardProps {
  entry: {
    _id: string;
    _creationTime: number;
    mood: string;
    content: string;
    date: string;
  };
  className?: string;
}

export const EntryCard = React.memo<EntryCardProps>(function EntryCard({ entry, className }) {
  const mood = moodOptions.find((m) => m.value === entry.mood);
  const Icon = mood?.icon;

  // Format timestamp
  const timestamp = format(entry._creationTime, "h:mm a");
  const dateLabel = format(new Date(entry.date), "MMMM d, yyyy");
  const isoDateTime = new Date(entry._creationTime).toISOString();

  return (
    <article
      data-slot="card"
      className={cn(
        cardVariants({ variant: "elevated", padding: "md", hover: "subtle" }),
        "w-full",
        className
      )}
      aria-label={`Journal entry from ${timestamp}`}
    >
      {/* Header with Mood Badge and Timestamp */}
      <header className="flex items-start justify-between gap-4 mb-3">
        {mood && Icon && (
          <Badge
            variant="secondary"
            appearance="light"
            size="md"
            className={cn(
              "flex items-center gap-1.5",
              mood.bgColor,
              mood.color
            )}
            aria-label={`Mood: ${mood.label}`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span>{mood.label}</span>
          </Badge>
        )}
        <time
          dateTime={isoDateTime}
          className="text-xs text-stone-500 flex-shrink-0"
        >
          {timestamp}
        </time>
      </header>

      {/* Entry Content */}
      <div className="prose prose-stone prose-sm max-w-none">
        <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
          {entry.content}
        </p>
      </div>

      {/* Footer with Date (if not obvious from context) */}
      <footer className="mt-3 pt-3 border-t border-stone-100">
        <p className="text-xs text-stone-400">{dateLabel}</p>
      </footer>
    </article>
  );
});
