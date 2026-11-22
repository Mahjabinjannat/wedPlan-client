"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[650px] items-center justify-center overflow-hidden bg-[#39262b] bg-cover bg-center px-5 py-24 text-center text-white md:min-h-[720px]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30,18,23,0.62),rgba(30,18,23,0.70)),url('/images/wedding-hero.jpg')",
      }}
    >
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm backdrop-blur-sm"
        >
          <Heart size={15} fill="currentColor" />
          Your Love Story, Beautifully Planned
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-7xl"
        >
          Every Beautiful Wedding
          <span className="block text-[#f5cbd1]">Begins with a Plan</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/85 md:text-lg"
        >
          Discover exceptional wedding venues, talented photographers, creative
          decorators, and trusted professionals to make your special day
          unforgettable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#8c2338] px-7 py-3.5 font-semibold text-white hover:bg-[#a32b44]"
          >
            Explore Wedding Services
            <ArrowRight size={18} />
          </Link>

          <Link
            href="#categories"
            className="rounded-xl border border-white/50 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm hover:bg-white/20"
          >
            Explore Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
