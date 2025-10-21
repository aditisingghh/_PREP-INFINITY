"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="w-full pt-36 md:pt-48 pb-10 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, #0f172a, #1e293b, #020617)",
        color: "white",
      }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-repeat"></div>

      <div className="relative z-10 space-y-6 text-center">
        {/* Main Title */}
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl text-gray-300">
            PREP-INFINITY
            <br />
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400 animate-softGlow">
              Your AI Career Coach for
              <br />
              Professional Success
            </span>
          </h1>

          <p className="mx-auto max-w-[600px] text-sky-300 md:text-xl animate-glowText">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>

        </div>

        <p className="mx-auto max-w-[700px] text-base md:text-lg font-semibold pt-4 text-gray-400 italic">
          &quot;It's not just preparation—it’s the power to go limitless.&quot;
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-300"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="hero-image-wrapper mt-10 md:mt-12">
          <div ref={imageRef} className="hero-image transition-transform duration-500">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={620}
              alt="Dashboard Preview"
              className="rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.4)] border border-purple-800 mx-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Custom Animation Style */}
      <style jsx>{`
        @keyframes glowText {
          0% {
            opacity: 0.8;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 20px rgba(236, 72, 153, 0.6),
              0 0 30px rgba(147, 51, 234, 0.5);
          }
          100% {
            opacity: 0.8;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
          }
        }

        .animate-glowText {
          animation: glowText 2.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
