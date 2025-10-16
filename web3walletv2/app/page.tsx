"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const socialHandles = [
  {
    link: "https://x.com/manojofficialmj",
    icon: FaTwitter,
    label: "Twitter/X",
  },
  {
    link: "https://www.linkedin.com/in/manojofficialmj",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  {
    link: "https://github.com/BCAPATHSHALA/WEB3-PRACTICE/tree/web3wallet/web3wallet",
    icon: FaGithub,
    label: "GitHub",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-3xl md:text-8xl font-bold font-serif">
              Web3 Wallet
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              Create and manage{" "}
              <span className="font-semibold text-foreground">Solana</span> and{" "}
              <span className="font-semibold text-foreground">Ethereum</span>{" "}
              wallets locally.{" "}
              <span className="text-foreground font-medium">
                This fun project is designed to help you understand how multiple
                wallets can be derived from a single master seed phrase in Web3.
              </span>
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild>
                <Link href="/onboarding">Get Started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href="https://github.com/BCAPATHSHALA/WEB3-PRACTICE/tree/web3wallet/web3wallet"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Source
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-sm">
              Built by <span className="font-semibold">Manoj Kumar</span>
            </p>

            <div className="mt-4 flex items-center justify-center gap-4">
              {socialHandles.map(({ link, icon: Icon, label }) => (
                <Link
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:bg-muted hover:scale-105 hover:shadow-sm"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Text Hover Animation Section */}
      <section className="relative z-10 py-12 md:py-10 h-[15rem] flex items-center justify-center">
        <TextHoverEffect text="WEB3" />
      </section>
    </main>
  );
}