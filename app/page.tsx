"use client";

import { Button } from "@/components/ui/base-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/base-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SignUpButton, useUser } from "@clerk/nextjs";
import * as motion from "motion/react-client";
import {
  Heart,
  Shield,
  Sparkles,
  Feather,
  Moon,
  Sun,
  Leaf,
  ArrowRight,
  Quote,
} from "lucide-react";
import Link from "next/link";

/* Animation variants for staggered reveals */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100/50 overflow-hidden">
      {/* Refined ambient background with layered depth */}
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
        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.015]" />
      </div>

      {/* Main content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            {/* Refined brand mark */}
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
                  <Feather
                    className="w-9 h-9 text-stone-600"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </motion.div>

            {/* Trust badge */}
            <motion.div variants={itemVariants}>
              <Badge variant="warm" size="md" className="backdrop-blur-sm">
                <Leaf className="w-3.5 h-3.5" />A gentler approach to clarity
              </Badge>
            </motion.div>

            {/* Elegant headline with refined typography */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight">
                A quieter space
                <span className="block mt-2 font-normal bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 bg-clip-text text-transparent">
                  for your thoughts
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-stone-600/90 leading-relaxed max-w-2xl mx-auto font-light">
                Sometimes our minds carry more than they need to. Declutter is
                here to help you gently sort through what matters, at your own
                pace, with warmth and understanding.
              </p>
            </motion.div>

            {/* Supportive sub-message */}
            <motion.p
              variants={itemVariants}
              className="text-stone-500 text-base leading-relaxed max-w-md mx-auto"
            >
              No pressure. No judgment. Just a calm companion for your mental
              wellness journey.
            </motion.p>

            {/* Refined call to action */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
            >
              <SignUpButton mode="modal" forceRedirectUrl="/onboard">
                <Button
                  variant="mono"
                  size="lg"
                  radius="full"
                  className="group px-8 py-6 bg-stone-800 hover:bg-stone-700 text-stone-50 shadow-xl shadow-stone-400/20 transition-all duration-500 hover:shadow-2xl hover:shadow-stone-400/30 hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <motion.span
                    className="inline-block ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                </Button>
              </SignUpButton>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="lg"
                      radius="full"
                      className="px-6 text-stone-600 hover:text-stone-800 hover:bg-stone-100/80 transition-all duration-300"
                    />
                  }
                >
                  Discover how it works
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-gradient-to-b from-stone-50 to-white border-stone-200/70 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-stone-800 text-xl">
                      How Declutter supports you
                    </DialogTitle>
                    <DialogDescription className="text-stone-600">
                      A gentle approach to finding mental clarity
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-6">
                    <HowItWorksItem
                      number={1}
                      title="Share what is on your mind"
                      description="Write freely about your thoughts, worries, or feelings. There is no right or wrong way to express yourself here."
                    />
                    <HowItWorksItem
                      number={2}
                      title="Receive gentle reflections"
                      description="We help you see patterns and perspectives you might have missed, without telling you what to think or feel."
                    />
                    <HowItWorksItem
                      number={3}
                      title="Find clarity at your own pace"
                      description="Take breaks whenever you need. Come back when you are ready. Your journey is uniquely yours."
                    />
                  </div>

                  <DialogFooter className="gap-3">
                    <DialogClose className="text-stone-600 border-stone-200 hover:bg-stone-50">
                      Maybe later
                    </DialogClose>
                    {isSignedIn ? (
                      <Link href="/onboard">
                        <Button className="bg-stone-800 hover:bg-stone-700 shadow-md">
                          Go to App
                        </Button>
                      </Link>
                    ) : (
                      <SignUpButton mode="modal" forceRedirectUrl="/onboard">
                        <Button className="bg-stone-800 hover:bg-stone-700 shadow-md">
                          Get started
                        </Button>
                      </SignUpButton>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section - Elegant cards with depth */}
        <section className="py-16 px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <Badge variant="stone" size="md" className="mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Thoughtfully designed
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-light text-stone-800 mb-4">
                Built around your wellbeing
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto">
                Every feature is crafted to support you without adding pressure
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Shield className="w-6 h-6" />}
                  title="Your space, your pace"
                  description="Everything you share stays private. Take all the time you need to process and reflect."
                  accent="amber"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Heart className="w-6 h-6" />}
                  title="Kindness first"
                  description="No judgment, no pressure. Just understanding and genuine support for wherever you are."
                  accent="rose"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="Gentle clarity"
                  description="Small steps toward understanding yourself better, one thought at a time."
                  accent="stone"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-transparent via-stone-100/50 to-transparent">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-light text-stone-800 mb-4">
                Words from our community
              </h2>
              <p className="text-stone-500">
                Real experiences from people finding their calm
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <TestimonialCard
                  quote="Finally, a space that feels like a warm conversation rather than a clinical tool. I feel heard here."
                  author="Sarah M."
                  role="Finding peace daily"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <TestimonialCard
                  quote="It helped me see patterns in my thoughts I had never noticed before. Small revelations that made a big difference."
                  author="James K."
                  role="On his mindfulness journey"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariants}
            className="max-w-3xl mx-auto"
          >
            <div className="flex flex-wrap justify-center gap-6 text-stone-400">
              <TrustIndicator
                icon={<Moon className="w-5 h-5" />}
                label="Always available"
              />
              <TrustIndicator
                icon={<Shield className="w-5 h-5" />}
                label="Private & secure"
              />
              <TrustIndicator
                icon={<Sun className="w-5 h-5" />}
                label="Judgment-free"
              />
              <TrustIndicator
                icon={<Leaf className="w-5 h-5" />}
                label="At your own pace"
              />
            </div>
          </motion.div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div variants={itemVariants}>
              <Card
                variant="glass"
                padding="lg"
                className="border-stone-200/30 shadow-2xl shadow-stone-300/20"
              >
                <CardContent className="space-y-8 py-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                    <Feather
                      className="w-7 h-7 text-stone-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-light text-stone-800">
                      Ready to find some clarity?
                    </h2>
                    <p className="text-stone-500 max-w-md mx-auto">
                      Your thoughts deserve a peaceful place to land. Start
                      whenever feels right.
                    </p>
                  </div>
                  {isSignedIn ? (
                    <Link href="/onboard">
                      <Button
                        variant="mono"
                        size="lg"
                        radius="full"
                        className="px-10 bg-stone-800 hover:bg-stone-700 text-stone-50 shadow-lg shadow-stone-300/30"
                      >
                        Go to App
                      </Button>
                    </Link>
                  ) : (
                    <SignUpButton mode="modal" forceRedirectUrl="/onboard">
                      <Button
                        variant="mono"
                        size="lg"
                        radius="full"
                        className="px-10 bg-stone-800 hover:bg-stone-700 text-stone-50 shadow-lg shadow-stone-300/30"
                      >
                        Get Started
                      </Button>
                    </SignUpButton>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-stone-200/50">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-4"
          >
            <div className="flex justify-center gap-1 items-center text-stone-400">
              <Feather className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm font-medium tracking-wide">
                Declutter
              </span>
            </div>
            <p className="text-stone-400 text-sm">
              Taking care of your mind is not a luxury. It is essential.
            </p>
            <Separator
              variant="warm"
              className="max-w-[100px] mx-auto opacity-50"
            />
            <p className="text-stone-400/60 text-xs">
              Made with care for those seeking calm
            </p>
          </motion.div>
        </footer>
      </main>
    </div>
  );
}

/* Helper component for "How it works" dialog items */
function HowItWorksItem({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-stone-100 text-stone-600 flex items-center justify-center text-sm font-medium border border-amber-200/30">
        {number}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-medium text-stone-800">{title}</h3>
        <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* Feature card component using ReUI Card */
function FeatureCard({
  icon,
  title,
  description,
  accent = "amber",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: "amber" | "rose" | "stone";
}) {
  const accentStyles = {
    amber: "from-amber-50 to-orange-50/50 text-amber-700 border-amber-200/30",
    rose: "from-rose-50 to-pink-50/50 text-rose-700 border-rose-200/30",
    stone: "from-stone-100 to-stone-50 text-stone-700 border-stone-200/30",
  };

  return (
    <Card
      variant="glass"
      padding="lg"
      hover="lift"
      className="h-full border-stone-200/40 bg-white/70 backdrop-blur-sm"
    >
      <CardContent className="space-y-4">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accentStyles[accent]} border`}
        >
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-stone-800 text-lg">{title}</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* Testimonial card component */
function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      className="h-full bg-white border-stone-200/50"
    >
      <CardContent className="space-y-6">
        <Quote className="w-8 h-8 text-amber-300" strokeWidth={1.5} />
        <p className="text-stone-600 leading-relaxed italic">{quote}</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
            <span className="text-stone-600 font-medium text-sm">
              {author.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-stone-800 font-medium text-sm">{author}</p>
            <p className="text-stone-400 text-xs">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* Trust indicator component */
function TrustIndicator({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-stone-400 hover:text-stone-500 transition-colors duration-300">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
