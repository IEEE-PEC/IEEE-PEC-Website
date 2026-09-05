"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";
import { getAssetPath } from "@/lib/utils";

const heroSlides = [
  {
    image: "/images/hero/hero-crowd.jpeg",
    badge: "Outstanding Student Branch • IEEE Chandigarh Subsection",
    heading: "Innovate. Code. Build with IEEE PEC.",
    description:
      "One of the largest technical societies at PEC — fostering hands-on learning in robotics, C++, and competitive engineering.",
    cta1: "Explore Projects",
    cta1Link: "/project",
    cta2: "Our 3 Chapters",
    cta2Link: "/chapters",
  },
  {
    image: "/images/hero/hero-bots.jpeg",
    badge: "Hardware & Robotics Workshops",
    heading: "Robo-Soccer, Combat Bots & Circuit Design",
    description:
      "From competitive Robo-Soccer and RC Hovercrafts to PCB design in EasyEDA — real engineering, hands-on.",
    cta1: "View Events",
    cta1Link: "/events",
    cta2: "Meet Our Team",
    cta2Link: "/team",
  },
  {
    image: "/images/hero/hero-arena.png",
    badge: "Techadroit Flagship Symposium",
    heading: "Competitive Coding & Expert Tech Sessions",
    description:
      "HackerRank challenges, AI/ML tracks, Bug-Busters sprints, and inter-college championships — all under one roof.",
    cta1: "Explore Events",
    cta1Link: "/events",
    cta2: "Technical Resources",
    cta2Link: "/resources",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[currentIndex];

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image Carousel with Cross-Fade */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${getAssetPath(currentSlide.image)})`,
              }}
            />
            {/* Deep gradient overlay for optimal readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-[#002855]/75 backdrop-blur-[2px]" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#00A3E0]" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              {currentSlide.heading}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {currentSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-[#00629B] hover:bg-[#004B7A] text-white shadow-lg hover:shadow-blue-500/25 transition-all rounded-xl px-7 py-6 text-sm sm:text-base font-semibold"
              >
                <Link href={currentSlide.cta1Link}>
                  {currentSlide.cta1}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all rounded-xl px-7 py-6 text-sm sm:text-base font-semibold"
              >
                <Link href={currentSlide.cta2Link}>
                  {currentSlide.cta2}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2.5 bg-[#00A3E0]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
