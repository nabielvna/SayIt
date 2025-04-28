"use client";

import { Header } from "@/components/dynamic-header";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useState } from "react";
import {
  IconMessageCircle,
  IconUser,
  IconBriefcase,
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
    <div className="grid grid-rows-[auto_1fr_auto] min-h-[calc(100vh-var(--header-height)-18px)] dark:bg-zinc-900/20">
      <Header>
        {siteConfig.appDescription}
      </Header>

      <main className="row-start-2 w-full max-w-6xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Welcome back to {siteConfig.appName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, idx) => (
            <Link
              key={feature.title}
              href={feature.href}
              onMouseEnter={() => setHoverCard(idx)}
              onMouseLeave={() => setHoverCard(null)}
              className={`group relative overflow-hidden rounded-2xl border ${hoverCard === idx ? feature.border : 'border-zinc-200 dark:border-zinc-800'} bg-white dark:bg-zinc-800/90 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="p-6 flex gap-5">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} transition-all duration-300 ${hoverCard === idx ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-100 dark:bg-zinc-700'}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div 
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${feature.bgColor} flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    <IconChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-base font-medium mb-1 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div 
                className={`absolute bottom-0 left-0 h-1 ${feature.bgColor} transition-all duration-500 ease-out`}
                style={{
                  width: hoverCard === idx ? '100%' : '0%'
                }}
              ></div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-800/90 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Recent Activity</h2>
            <Link 
              href="/activities" 
              className="text-xs text-primary flex items-center hover:underline"
            >
              See all <IconChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center px-4 py-3 rounded-xl border border-zinc-100 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                <div className={`w-8 h-8 rounded-full ${item === 1 ? 'bg-sky-500' : item === 2 ? 'bg-violet-500' : 'bg-emerald-500'} flex items-center justify-center text-white shrink-0`}>
                  {item === 1 ? (
                    <IconMessageCircle className="w-4 h-4" />
                  ) : item === 2 ? (
                    <IconUser className="w-4 h-4" />
                  ) : (
                    <IconBriefcase className="w-4 h-4" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium">
                    {item === 1 ? 'New anonymous chat created' : item === 2 ? 'Sayit answered your question' : 'Consulted with Dr. Rahma'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {item === 1 ? '2 hours ago' : item === 2 ? 'Yesterday, 7:30 PM' : '3 days ago'}
                  </p>
                </div>
                <IconChevronRight className="w-4 h-4 text-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
