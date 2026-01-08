"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/base-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as motion from "motion/react-client";
import {
  Feather,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PenTool,
  Lightbulb,
  Clock,
  Leaf,
} from "lucide-react";

const totalSteps = 4;

/* Animation variants for step transitions */
const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetStarted = () => {
    // Navigate to main app (placeholder for now - can be updated when dashboard exists)
    router.push("/");
  };

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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut", delay: 0.4 }}
          className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-amber-50/40 to-stone-100/30 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.015]" />
      </div>

      {/* Main content */}
      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Progress indicator */}
        <div className="pt-8 px-6 pb-4">
          <div className="max-w-2xl mx-auto">
            <div
              className="flex items-center justify-center gap-2"
              role="progressbar"
              aria-valuenow={currentStep + 1}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
            >
              {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: currentStep === index ? 1.1 : 1,
                    opacity: currentStep >= index ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentStep >= index
                      ? "bg-stone-600 w-8"
                      : "bg-stone-300 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="max-w-2xl w-full">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              {currentStep === 0 && <WelcomeStep />}
              {currentStep === 1 && <HowItWorksStep />}
              {currentStep === 2 && <KeyFeaturesStep />}
              {currentStep === 3 && <GettingStartedStep />}
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pb-8 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="lg"
                radius="full"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 text-stone-600 hover:text-stone-800 hover:bg-stone-100/80 transition-all duration-300 disabled:opacity-30"
                aria-label="Previous step"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button
                  variant="mono"
                  size="lg"
                  radius="full"
                  onClick={nextStep}
                  className="px-8 bg-stone-800 hover:bg-stone-700 text-stone-50 shadow-xl shadow-stone-400/20 transition-all duration-500 hover:shadow-2xl hover:shadow-stone-400/30 hover:-translate-y-0.5"
                  aria-label="Next step"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="mono"
                  size="lg"
                  radius="full"
                  onClick={handleGetStarted}
                  className="px-8 bg-stone-800 hover:bg-stone-700 text-stone-50 shadow-xl shadow-stone-400/20 transition-all duration-500 hover:shadow-2xl hover:shadow-stone-400/30 hover:-translate-y-0.5"
                  aria-label="Get started"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Step 1: Welcome */
function WelcomeStep() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-6"
    >
      <motion.div variants={itemVariants} className="flex justify-center">
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

      <motion.div variants={itemVariants}>
        <Badge variant="warm" size="md" className="backdrop-blur-sm">
          <Leaf className="w-3.5 h-3.5" />A gentler approach to clarity
        </Badge>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-stone-800 leading-[1.1] tracking-tight">
          Welcome to
          <span className="block mt-2 font-normal bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 bg-clip-text text-transparent">
            Declutter
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-stone-600/90 leading-relaxed max-w-xl mx-auto font-light">
          We're so glad you're here. This is a safe space where you can gently
          sort through what matters, at your own pace, with warmth and
          understanding.
        </p>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-stone-500 text-base leading-relaxed max-w-md mx-auto"
      >
        No pressure. No judgment. Just a calm companion for your mental wellness
        journey.
      </motion.p>
    </motion.div>
  );
}

/* Step 2: How It Works */
function HowItWorksStep() {
  const steps = [
    {
      number: 1,
      icon: PenTool,
      title: "Share what's on your mind",
      description:
        "Write freely about your thoughts, worries, or feelings. There's no right or wrong way to express yourself here.",
    },
    {
      number: 2,
      icon: Lightbulb,
      title: "Receive gentle reflections",
      description:
        "We help you see patterns and perspectives you might have missed, without telling you what to think or feel.",
    },
    {
      number: 3,
      icon: Clock,
      title: "Find clarity at your own pace",
      description:
        "Take breaks whenever you need. Come back when you're ready. Your journey is uniquely yours.",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-light text-stone-800">
          How it works
        </h2>
        <p className="text-stone-600 max-w-lg mx-auto">
          A simple, gentle process designed to support you
        </p>
      </motion.div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div key={step.number} variants={itemVariants}>
            <Card
              variant="glass"
              padding="lg"
              className="border-stone-200/40 bg-white/70 backdrop-blur-sm"
            >
              <CardContent className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-stone-100 text-stone-600 flex items-center justify-center border border-amber-200/30">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-stone-500">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="font-medium text-stone-800 text-lg">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* Step 3: Key Features */
function KeyFeaturesStep() {
  const features = [
    {
      icon: Shield,
      title: "Your space, your pace",
      description:
        "Everything you share stays private. Take all the time you need to process and reflect.",
      accent: "amber" as const,
    },
    {
      icon: Heart,
      title: "Kindness first",
      description:
        "No judgment, no pressure. Just understanding and genuine support for wherever you are.",
      accent: "rose" as const,
    },
    {
      icon: Sparkles,
      title: "Gentle clarity",
      description:
        "Small steps toward understanding yourself better, one thought at a time.",
      accent: "stone" as const,
    },
  ];

  const accentStyles = {
    amber: "from-amber-50 to-orange-50/50 text-amber-700 border-amber-200/30",
    rose: "from-rose-50 to-pink-50/50 text-rose-700 border-rose-200/30",
    stone: "from-stone-100 to-stone-50 text-stone-700 border-stone-200/30",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <Badge variant="stone" size="md" className="mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Thoughtfully designed
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-light text-stone-800">
          Built around your wellbeing
        </h2>
        <p className="text-stone-500 max-w-lg mx-auto">
          Every feature is crafted to support you without adding pressure
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-1 gap-6">
        {features.map((feature, index) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card
              variant="glass"
              padding="lg"
              hover="lift"
              className="h-full border-stone-200/40 bg-white/70 backdrop-blur-sm"
            >
              <CardContent className="space-y-4">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accentStyles[feature.accent]} border`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-stone-800 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* Step 4: Getting Started */
function GettingStartedStep() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-200/60 to-stone-300/40 blur-xl"
          />
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 via-stone-100 to-stone-200 flex items-center justify-center shadow-lg shadow-amber-900/5 border border-white/50">
            <Feather className="w-11 h-11 text-stone-600" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-3xl sm:text-4xl font-light text-stone-800">
          Ready to find some clarity?
        </h2>
        <p className="text-lg text-stone-600/90 leading-relaxed max-w-xl mx-auto font-light">
          Your thoughts deserve a peaceful place to land. Start whenever feels
          right.
        </p>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-stone-500 text-base leading-relaxed max-w-md mx-auto"
      >
        Remember: there's no rush. Take your time, and be gentle with yourself.
      </motion.p>
    </motion.div>
  );
}
