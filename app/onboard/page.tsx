"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/base-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as motion from "motion/react-client";
import {
  Feather,
  ArrowRight,
  CheckCircle2,
  Target,
  Sparkles,
  Leaf,
} from "lucide-react";

const TOTAL_STEPS = 3;

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function OnboardPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const onboardingStatus = useQuery(api.users.getOnboardingStatus);
  const markCompleted = useMutation(api.users.markOnboardingCompleted);
  const markSkipped = useMutation(api.users.markOnboardingSkipped);

  // Redirect if not signed in
  useEffect(() => {
    if (clerkLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [clerkLoaded, isSignedIn, router]);

  // Redirect if onboarding already completed
  useEffect(() => {
    if (onboardingStatus?.onboardingCompleted) {
      router.push("/home");
    }
  }, [onboardingStatus, router]);

  const handleSkip = async () => {
    try {
      setIsCompleting(true);
      setError(null);
      await markSkipped();
      router.push("/home");
    } catch {
      setError("Failed to skip onboarding. Please try again.");
      setIsCompleting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      setError(null);
      await markCompleted();
      router.push("/home");
    } catch {
      setError("Failed to complete onboarding. Please try again.");
      setIsCompleting(false);
    }
  };

  // Show loading state while checking auth or onboarding status
  if (!clerkLoaded || onboardingStatus === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-600 rounded-full animate-spin mx-auto" />
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if redirecting
  if (onboardingStatus?.onboardingCompleted || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100/50 overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-amber-100/50 to-orange-100/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }}
          className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-gradient-to-bl from-stone-200/40 to-stone-300/20 rounded-full blur-3xl"
        />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Indicator */}
        <div className="pt-8 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-stone-600">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                disabled={isCompleting}
                className="text-stone-600 hover:text-stone-800"
              >
                Skip
              </Button>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-400 to-stone-600 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl mx-auto w-full">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <Card
                variant="glass"
                padding="lg"
                className="border-stone-200/70 shadow-2xl bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="space-y-8 py-8">
                  {currentStep === 1 && <Step1Welcome />}
                  {currentStep === 2 && <Step2Goals />}
                  {currentStep === 3 && <Step3Complete />}

                  {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 justify-end pt-4">
                    {currentStep < TOTAL_STEPS ? (
                      <Button
                        variant="mono"
                        size="lg"
                        radius="full"
                        onClick={handleNext}
                        className="px-8 bg-stone-800 hover:bg-stone-700 text-stone-50"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        variant="mono"
                        size="lg"
                        radius="full"
                        onClick={handleComplete}
                        disabled={isCompleting}
                        className="px-8 bg-stone-800 hover:bg-stone-700 text-stone-50 disabled:opacity-50"
                      >
                        {isCompleting ? "Completing..." : "Complete"}
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Step1Welcome() {
  return (
    <div className="space-y-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-200/60 to-stone-300/40 blur-xl"
          />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 via-stone-100 to-stone-200 flex items-center justify-center shadow-lg shadow-amber-900/5 border border-white/50">
            <Feather className="w-9 h-9 text-stone-600" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-light text-stone-800">
          Welcome to Declutter
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed max-w-md mx-auto">
          We&apos;re so glad you&apos;re here. This is a safe space for you to
          explore your thoughts and find clarity at your own pace.
        </p>
        <p className="text-base text-stone-500 max-w-md mx-auto">
          Let&apos;s take a few moments to personalize your experience.
        </p>
      </div>
    </div>
  );
}

function Step2Goals() {
  const goals = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Find clarity",
      description: "Sort through thoughts and feelings",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Build awareness",
      description: "Understand patterns in your thinking",
    },
    {
      icon: <Feather className="w-5 h-5" />,
      title: "Practice self-care",
      description: "Take time for your mental wellbeing",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-stone-800">
          What brings you here?
        </h2>
        <p className="text-stone-600">
          Choose what resonates with you (you can always change this later)
        </p>
      </div>

      <div className="grid gap-4 pt-4">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              variant="glass"
              padding="md"
              hover="lift"
              className="border-stone-200/50 bg-stone-50/50 cursor-pointer transition-all"
            >
              <CardContent className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-stone-100 text-stone-600 flex items-center justify-center border border-amber-200/30">
                  {goal.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-stone-800 mb-1">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-stone-500">{goal.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-stone-400 text-center pt-2">
        This helps us tailor your experience, but it&apos;s completely optional.
      </p>
    </div>
  );
}

function Step3Complete() {
  return (
    <div className="space-y-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center border-4 border-amber-300/50">
          <CheckCircle2 className="w-10 h-10 text-amber-600" strokeWidth={2} />
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-light text-stone-800">
          You&apos;re all set!
        </h2>
        <p className="text-lg text-stone-600 leading-relaxed max-w-md mx-auto">
          You&apos;re ready to begin your journey with Declutter. Remember,
          there&apos;s no pressure—take your time and be gentle with yourself.
        </p>
        <Badge variant="warm" size="md" className="mt-4">
          <Leaf className="w-3.5 h-3.5" />
          Your space, your pace
        </Badge>
      </div>
    </div>
  );
}
