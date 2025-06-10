"use client";

import { Header } from "@/components/dynamic-header";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useState } from "react";
import {
  IconMessageCircle,
  IconChevronRight,
  IconRobot,
  IconUserHeart,
  IconNotebook
} from "@tabler/icons-react";

const features = [
  {
    title: "Anonymous Chat",
    description: "Chat freely without identity.",
    href: "/anonymous",
    icon: IconMessageCircle,
    color: "text-sky-500",
    bgColor: "bg-sky-500",
    border: "border-sky-200"
  },
  {
    title: "Sayit AI Chat",
    description: "Talk directly to Sayit, your AI.",
    href: "/sayit",
    icon: IconRobot,
    color: "text-violet-500",
    bgColor: "bg-violet-500",
    border: "border-violet-200"
  },
  {
    title: "Talk to a Professional",
    description: "Consult with trusted professionals.",
    href: "/professional",
    icon: IconUserHeart,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    border: "border-emerald-200"
  },
  {
    title: "Notes",
    description: "Jot down important things from your chats.",
    href: "/notes",
    icon: IconNotebook,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    border: "border-amber-200"
  }
];

export default function DashboardPage() {
  const [hoverCard, setHoverCard] = useState<number | null>(null);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-[calc(100vh-var(--header-height)-18px)] dark:bg-zinc-900/20 items-center">
      <Header>
        {siteConfig.appDescription}
      </Header>

      <main className="row-start-2 w-full max-w-6xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-1">
              Welcome back to {siteConfig.appName}
            </p>
          </div>
        </div>

        {/* Change: Increased the gap between cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <Link
              key={feature.title}
              href={feature.href}
              onMouseEnter={() => setHoverCard(idx)}
              onMouseLeave={() => setHoverCard(null)}
              className={`group relative overflow-hidden rounded-2xl border ${hoverCard === idx ? feature.border : 'border-zinc-200 dark:border-zinc-800'} bg-white dark:bg-zinc-800/90 shadow-sm hover:shadow-lg transition-all duration-300`}
            >
              {/* Change: Increased padding inside the card */}
              <div className="p-8 flex gap-6 items-center">
                <div className="relative">
                  {/* Change: Increased icon container size */}
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${feature.color} transition-all duration-300 ${hoverCard === idx ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-100 dark:bg-zinc-700'}`}>
                    {/* Change: Increased icon size */}
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div 
                    // Change: Adjusted position and size of the chevron icon indicator
                    className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full ${feature.bgColor} flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    {/* Change: Increased chevron icon size */}
                    <IconChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1">
                  {/* Change: Increased title font size */}
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h2>
                  {/* Change: Increased description font size */}
                  <p className="text-base text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div 
                className={`absolute bottom-0 left-0 h-1.5 ${feature.bgColor} transition-all duration-500 ease-out`}
                style={{
                  width: hoverCard === idx ? '100%' : '0%'
                }}
              ></div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}