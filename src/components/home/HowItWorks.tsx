
"use client";

import { motion } from "motion/react";
import {
  Search,
  CalendarDays,
  PartyPopper,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover Services",
    description:
      "Browse wedding services and find professionals that match your celebration.",
    icon: Search,
  },
  {
    number: "02",
    title: "Request a Booking",
    description:
      "Choose your preferred service and send a request with your event details.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Plan Your Celebration",
    description:
      "Track vendor responses and continue planning your special day.",
    icon: PartyPopper,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-5 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c2338]">
            Simple & Convenient
          </span>

          <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
            How WedPlan Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#806c71]">
            Three simple steps to begin planning
            your dream wedding.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="relative text-center"
              >
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f8e9ed] text-[#8c2338]">
                  <Icon size={32} strokeWidth={1.6} />

                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#8c2338] text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[#806c71]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
