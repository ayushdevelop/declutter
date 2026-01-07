"use client";

import Image from "next/image";
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
import { Button } from "@/components/ui/base-button";

const faqSections = [
  {
    title: "Account Management",
    content:
      "Navigate to the registration page, provide the required information, and verify your email address. You can sign up using your email or through social media platforms.",
  },
  {
    title: "Payment and Billing",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. If you face issues, check your payment details or contact our support team.",
  },
  {
    title: "Subscription Plans",
    content:
      "Choose a plan that fits your needs. Upgrade, downgrade, or cancel at any time from the subscription settings page in your account.",
  },
  {
    title: "Technical Support",
    content:
      "Our support team is available 24/7 via live chat or email. Check our Help Center for troubleshooting guides and tips.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Show Dialog
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg sm:max-h-[min(650px,80vh)]">
              <DialogHeader>
                <DialogTitle>Frequently Asked Questions(FAQ)</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>

              <div className="space-y-4 [&_h3]:font-semibold [&_h3]:text-foreground">
                {faqSections.map((faq, index) => (
                  <div key={index} className="text-accent-foreground space-y-1">
                    <h3>{faq.title}</h3>
                    <p>{faq.content}</p>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose>Cancel</DialogClose>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
