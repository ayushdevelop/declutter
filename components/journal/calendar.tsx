"use client";

import * as React from "react";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isAfter, startOfToday, format } from "date-fns";

interface JournalCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
  datesWithEntries?: string[]; // Array of ISO date strings (YYYY-MM-DD)
  className?: string;
}

export function JournalCalendar({
  selectedDate,
  onDateSelect,
  onMonthChange,
  datesWithEntries = [],
  className,
}: JournalCalendarProps) {
  const today = startOfToday();

  // Disable future dates
  const disabledMatcher = (date: Date) => {
    return isAfter(date, today);
  };

  // Custom day content to show entry indicators
  const modifiers = {
    hasEntries: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return datesWithEntries.includes(dateStr);
    },
  };

  const modifiersClassNames = {
    hasEntries: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-amber-500",
  };

  return (
    <Card
      variant="glass"
      padding="md"
      className={cn("w-full max-w-sm", className)}
    >
      <BaseCalendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date && !isAfter(date, today)) {
            onDateSelect(date);
          }
        }}
        onMonthChange={onMonthChange}
        disabled={disabledMatcher}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className="w-full"
        classNames={{
          day_button: cn(
            "cursor-pointer relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground transition-colors",
            "hover:not-in-data-selected:bg-amber-50 hover:not-in-data-selected:text-foreground",
            "group-data-selected:bg-amber-100 group-data-selected:text-amber-900 group-data-selected:border group-data-selected:border-amber-300",
            "group-data-disabled:pointer-events-none group-data-disabled:text-stone-300 group-data-disabled:opacity-40",
            "focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
            "outline-none"
          ),
          today: cn(
            "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10",
            "*:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-amber-400",
            "*:after:ring-2 *:after:ring-amber-400/30"
          ),
        }}
      />
    </Card>
  );
}
