"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { JournalCalendar } from "@/components/journal/calendar";
import { EntryForm } from "@/components/journal/entry-form";
import { EntryList } from "@/components/journal/entry-list";
import { JournalErrorBoundary } from "@/components/journal/error-boundary";
import { UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

// Page animation variants defined outside component for performance
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function JournalPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [displayedMonth, setDisplayedMonth] = React.useState<Date>(new Date());
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);

  // Convex queries
  const currentUser = useQuery(api.users.current);
  const entries = useQuery(api.journal.getEntriesByDate, {
    date: format(selectedDate, "yyyy-MM-dd"),
  });

  const datesWithEntries = useQuery(api.journal.getDatesWithEntries, {
    month: format(displayedMonth, "yyyy-MM"),
  });

  // Handle successful entry creation
  const handleEntrySuccess = React.useCallback(() => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  }, []);

  // Handle month navigation in calendar
  const handleMonthChange = React.useCallback((month: Date) => {
    setDisplayedMonth(month);
  }, []);

  // Show loading state while user data loads
  if (currentUser === undefined) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-10 bg-stone-200 rounded w-48 mb-2"></div>
          <div className="h-6 bg-stone-100 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 h-96 bg-stone-100 rounded-lg"></div>
            <div className="lg:col-span-5 h-96 bg-stone-100 rounded-lg"></div>
            <div className="lg:col-span-4 h-96 bg-stone-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show auth error if user not logged in (shouldn't happen due to middleware)
  if (currentUser === null) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <p className="text-stone-600">
            Please sign in to access your journal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <JournalErrorBoundary>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-6 max-w-7xl"
      >
        {/* Success Toast with ARIA live region */}
        {showSuccessToast && (
          <motion.div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
            <p className="text-sm font-medium text-green-900">
              Entry saved successfully!
            </p>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-light text-stone-900 mb-2">Journal</h1>
            <p className="text-stone-600">
              A quiet space for your thoughts and feelings
            </p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Calendar (spans 3 columns on desktop) */}
          <aside className="lg:col-span-3" aria-label="Calendar navigation">
            <div className="lg:sticky lg:top-6">
              <JournalCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onMonthChange={handleMonthChange}
                datesWithEntries={datesWithEntries || []}
              />
            </div>
          </aside>

          {/* Middle Column: Entry Form (spans 5 columns on desktop) */}
          <main className="lg:col-span-5" aria-label="Create journal entry">
            <EntryForm
              selectedDate={selectedDate}
              onSuccess={handleEntrySuccess}
            />
          </main>

          {/* Right Column: Entry List (spans 4 columns on desktop) */}
          <section
            className="lg:col-span-4"
            aria-labelledby="entries-heading"
          >
            <div className="mb-4">
              <h2 id="entries-heading" className="text-lg font-medium text-stone-900">
                {entries && entries.length > 0 ? "Your reflections" : "No entries yet"}
              </h2>
              {entries && entries.length > 0 && (
                <p className="text-sm text-stone-500" aria-live="polite">
                  {entries.length === 1
                    ? "One moment captured"
                    : `${entries.length} moments captured`}
                </p>
              )}
            </div>
            <EntryList
              entries={entries}
              selectedDate={selectedDate}
              isLoading={entries === undefined}
            />
          </section>
        </div>
      </motion.div>
    </JournalErrorBoundary>
  );
}
