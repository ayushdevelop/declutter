"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/base-button";
import { cn } from "@/lib/utils";
import {
  Sun,
  Cloud,
  Zap,
  Waves,
  Sparkles,
  Moon,
  Flame,
  Leaf,
} from "lucide-react";

export type MoodType =
  | "Happy"
  | "Sad"
  | "Anxious"
  | "Calm"
  | "Energetic"
  | "Tired"
  | "Angry"
  | "Peaceful";

interface MoodOption {
  value: MoodType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const moodOptions: MoodOption[] = [
  {
    value: "Happy",
    label: "Happy",
    icon: Sun,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    hoverColor: "hover:bg-amber-100",
  },
  {
    value: "Sad",
    label: "Sad",
    icon: Cloud,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    value: "Anxious",
    label: "Anxious",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
  },
  {
    value: "Calm",
    label: "Calm",
    icon: Waves,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    hoverColor: "hover:bg-cyan-100",
  },
  {
    value: "Energetic",
    label: "Energetic",
    icon: Sparkles,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    hoverColor: "hover:bg-yellow-100",
  },
  {
    value: "Tired",
    label: "Tired",
    icon: Moon,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    hoverColor: "hover:bg-indigo-100",
  },
  {
    value: "Angry",
    label: "Frustrated",
    icon: Flame,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    hoverColor: "hover:bg-rose-100",
  },
  {
    value: "Peaceful",
    label: "Peaceful",
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100",
  },
];

interface MoodSelectorProps {
  value?: MoodType;
  onChange: (mood: MoodType) => void;
  className?: string;
  disabled?: boolean;
}

// Animation variants defined outside component for performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function MoodSelector({
  value,
  onChange,
  className,
  disabled = false,
}: MoodSelectorProps) {

  return (
    <div className={cn("w-full", className)}>
      <div
        id="mood-selector-label"
        className="block text-sm font-medium text-stone-700 mb-3"
      >
        How are you feeling?
      </div>
      <motion.div
        role="radiogroup"
        aria-labelledby="mood-selector-label"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const isSelected = value === mood.value;

          return (
            <motion.div key={mood.value} variants={itemVariants}>
              <Button
                type="button"
                onClick={() => !disabled && onChange(mood.value)}
                disabled={disabled}
                variant="ghost"
                className={cn(
                  "relative w-full min-h-[44px] h-auto px-4 py-3 rounded-lg",
                  "flex flex-col items-center justify-center gap-2",
                  "border-2 transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  isSelected
                    ? [
                        "border-current shadow-sm",
                        mood.color,
                        mood.bgColor,
                      ]
                    : [
                        "border-stone-200 bg-white",
                        "hover:border-stone-300",
                        mood.hoverColor,
                      ]
                )}
                aria-label={`${mood.label} mood`}
                role="radio"
                aria-checked={isSelected}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isSelected ? mood.color : "text-stone-400"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isSelected ? mood.color : "text-stone-600"
                  )}
                >
                  {mood.label}
                </span>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="mood-selected"
                    className={cn(
                      "absolute inset-0 rounded-lg -z-10",
                      mood.bgColor,
                      "border-2 border-current",
                      mood.color
                    )}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Export mood options for use in validation schemas
export { moodOptions };
