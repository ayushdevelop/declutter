"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { EntryCard } from "./entry-card";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";
import { isToday } from "date-fns";

interface Entry {
  _id: string;
  _creationTime: number;
  mood: string;
  content: string;
  date: string;
}

interface EntryListProps {
  entries: Entry[] | undefined;
  selectedDate: Date;
  isLoading?: boolean;
  className?: string;
}

// Animation variants defined outside component for performance
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export function EntryList({
  entries,
  selectedDate,
  isLoading = false,
  className,
}: EntryListProps) {
  // Sort entries by creation time (newest first)
  const sortedEntries = React.useMemo(() => {
    if (!entries) return [];
    return [...entries].sort((a, b) => b._creationTime - a._creationTime);
  }, [entries]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-lg bg-stone-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (!sortedEntries || sortedEntries.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <EmptyState isToday={isToday(selectedDate)} />
      </div>
    );
  }

  // Entries list with animation
  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence mode="popLayout">
        {sortedEntries.map((entry, index) => (
          <motion.div
            key={entry._id}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            style={{ zIndex: sortedEntries.length - index }}
          >
            <EntryCard entry={entry} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
