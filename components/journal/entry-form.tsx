"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MoodSelector } from "./mood-selector";
import { Button } from "@/components/ui/base-button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";

// Zod schema for entry validation
const entrySchema = z.object({
  mood: z.enum([
    "Happy",
    "Sad",
    "Anxious",
    "Calm",
    "Energetic",
    "Tired",
    "Angry",
    "Peaceful",
  ] as const, {
    errorMap: () => ({ message: "How are you feeling right now?" }),
  }),
  content: z
    .string()
    .min(10, "Just a few more words to capture this moment")
    .max(5000, "You've written so much - consider saving some thoughts for tomorrow")
    .transform((val) => val.trim()),
});

type EntryFormValues = z.infer<typeof entrySchema>;

interface EntryFormProps {
  selectedDate: Date;
  onSuccess?: () => void;
  className?: string;
}

export function EntryForm({
  selectedDate,
  onSuccess,
  className,
}: EntryFormProps) {
  const createEntry = useMutation(api.journal.createEntry);
  const canEdit = isToday(selectedDate);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      mood: undefined,
      content: "",
    },
  });

  // Note: watch() triggers React Compiler warning but is required for real-time character count
  const content = watch("content");
  const characterCount = content?.length || 0;

  const onSubmit = async (data: EntryFormValues) => {
    try {
      await createEntry({
        date: format(selectedDate, "yyyy-MM-dd"),
        mood: data.mood,
        content: data.content,
      });

      // Reset form after successful submission
      reset();

      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create entry:", error);
    }
  };

  return (
    <Card variant="default" padding="lg" className={cn("w-full", className)}>
      <div className="mb-6">
        <h2 className="text-xl font-light text-stone-900 mb-2">
          {canEdit
            ? "Take a moment to reflect"
            : format(selectedDate, "MMMM d")}
        </h2>
        <p className="text-sm text-stone-500">
          {canEdit
            ? "This is your space. Write whatever feels right."
            : format(selectedDate, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {!canEdit && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
          <Leaf className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-stone-600">
            Past moments live here just as they were. Return to today when you're ready to write.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mood Selector */}
        <div>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <MoodSelector
                value={field.value}
                onChange={field.onChange}
                disabled={!canEdit}
              />
            )}
          />
          {errors.mood && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              {errors.mood.message}
            </p>
          )}
        </div>

        {/* Textarea */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-stone-700 mb-2"
          >
            What's on your mind?
          </label>
          <textarea
            id="content"
            {...register("content")}
            disabled={!canEdit}
            rows={8}
            aria-describedby="character-count"
            aria-invalid={!!errors.content}
            className={cn(
              "w-full px-4 py-3 rounded-lg border transition-colors resize-y",
              "focus:outline-none focus:ring-2",
              "disabled:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-500",
              errors.content
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-stone-200 focus:border-amber-300 focus:ring-amber-200"
            )}
            placeholder={
              canEdit
                ? "How are you really feeling right now?"
                : "Past moments live here just as they were"
            }
          />

          {/* Character Counter and Error */}
          <div className="mt-2 flex items-center justify-between">
            <div>
              {errors.content && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.content.message}
                </p>
              )}
            </div>
            <p
              id="character-count"
              aria-live="polite"
              aria-atomic="true"
              className={cn(
                "text-xs",
                characterCount > 5000
                  ? "text-red-600 font-medium"
                  : characterCount > 4500
                    ? "text-orange-600"
                    : "text-stone-500"
              )}
            >
              {characterCount} / 5000 characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          {!canEdit && (
            <p className="text-sm text-stone-500 italic">
              Cannot create entries for past dates
            </p>
          )}
          <Button
            type="submit"
            variant="mono"
            size="lg"
            disabled={!canEdit || isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Holding onto this...
              </>
            ) : (
              "Done"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
