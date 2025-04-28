"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useState } from "react";
import {
  IconMessageCircle,
  IconRobot,
  IconUserHeart,
  IconNotebook,
  IconArrowRight,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconChevronRight,
  IconUser
} from "@tabler/icons-react";

const features = [
  {
    title: "Anonymous Chat",
    description: "Chat freely without revealing your identity. Perfect for private discussions and sensitive topics.",
    href: "/anonymous",
    icon: IconMessageCircle,
    color: "text-sky-500",
    bgColor: "bg-sky-500",
    border: "border-sky-200"
  },
  {
    title: "Sayit AI Chat",
    description: "Get instant answers and assistance from Sayit, your personal AI assistant available 24/7.",
    href: "/sayit",
    icon: IconRobot,
    color: "text-violet-500",
    bgColor: "bg-violet-500",
    border: "border-violet-200"
  },
  {
    title: "Professional Consultation",
    description: "Connect with verified experts and professionals for personalized advice and guidance.",
    href: "/professional",
    icon: IconUserHeart,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    border: "border-emerald-200"
  },
  {
    title: "Smart Notes",
    description: "Capture and organize important information from your conversations automatically.",
    href: "/notes",
    icon: IconNotebook,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    border: "border-amber-200"
  }
];

const testimonials = [
  {
    quote: "Sayit has transformed how I communicate online. The anonymous chat feature gives me peace of mind when discussing sensitive topics.",
    author: "Sarah J.",
    title: "Product Designer"
  },
  {
    quote: "As a busy professional, having access to expert consultations through this platform has saved me countless hours and provided invaluable guidance.",
    author: "Michael T.",
    title: "Business Consultant"
  },
  {
    quote: "The AI assistant is incredibly intuitive. It feels like chatting with a knowledgeable friend rather than a robot.",
    author: "Aisha R.",
    title: "Software Developer"
  }
];

export default function LandingPage() {
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 dark:opacity-10 -z-50"></div>
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">S</div>
              <span className="text-xl font-semibold">{siteConfig.appName}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm hover:text-primary transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
              <Link href="/about" className="text-sm hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            </div>
            <div className="flex gap-3">
              <Link href="/sign-in" className="px-4 py-2 text-sm cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-primary dark:hover:border-primary transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="px-4 py-2 text-sm cursor-pointer rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
          </nav>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Chat Smarter, <span className="text-primary">Connect</span> Better
              </h1>
              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                {siteConfig.appDescription} Unlock new possibilities for communication with AI assistance, anonymous chats, and professional consultations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors text-center flex items-center justify-center gap-2">
                  Start for free <IconArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/demo" className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium hover:border-primary dark:hover:border-primary transition-colors text-center">
                  Watch demo
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 ${['bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'][i]}`}></div>
                  ))}
                </div>
                <p className="ml-4 text-sm text-zinc-600 dark:text-zinc-400">
                  Joined by 2,000+ users in the last month
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur opacity-30 dark:opacity-40"></div>
              <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-700 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="flex-1 text-center text-xs text-zinc-500">Sayit AI Chat</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                      <IconRobot className="w-4 h-4" />
                    </div>
                    <div className="bg-violet-50 dark:bg-zinc-700/50 p-3 rounded-xl rounded-tl-none text-sm">
                      Hello! I&apos;m Sayit, your AI assistant. How can I help you today?
                    </div>
                  </div>
                  <div className="flex gap-4 items-start justify-end">
                    <div className="bg-primary/10 p-3 rounded-xl rounded-tr-none text-sm max-w-xs">
                      I need help planning my week. Can you suggest a productivity method?
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                      <IconUser className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                      <IconRobot className="w-4 h-4" />
                    </div>
                    <div className="bg-violet-50 dark:bg-zinc-700/50 p-3 rounded-xl rounded-tl-none text-sm">
                      Of course! I&apos;d recommend the Pomodoro Technique for focus or time blocking for organization. Would you like me to explain either in detail?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Communication <span className="text-primary">Reimagined</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Discover a new way to connect, share, and learn with our suite of innovative communication tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <Link
                key={feature.title}
                href={feature.href}
                onMouseEnter={() => setHoverCard(idx)}
                onMouseLeave={() => setHoverCard(null)}
                className={`group relative overflow-hidden rounded-2xl border ${hoverCard === idx ? feature.border : 'border-zinc-200 dark:border-zinc-800'} bg-white dark:bg-zinc-800/90 shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className="p-8 flex flex-col gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color} transition-all duration-300 ${hoverCard === idx ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-100 dark:bg-zinc-700'}`}>
                    <feature.icon className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center text-sm font-medium group-hover:text-primary transition-colors">
                    Learn more <IconChevronRight className="w-4 h-4 ml-1" />
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              What Our Users <span className="text-primary">Say</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Don&apos;t just take our word for it. See what others are saying about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-700">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-primary to-violet-600 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-12 md:p-16 text-white">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Ready to transform your communications?
              </h2>
              <p className="mt-4 text-white/90 text-lg max-w-2xl">
                Join thousands of users already experiencing the future of communication. Start your journey today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="px-8 py-4 rounded-xl bg-white text-primary font-medium hover:bg-zinc-100 transition-colors text-center">
                  Get started for free
                </Link>
                <Link href="/contact" className="px-8 py-4 rounded-xl border border-white/30 text-white font-medium hover:bg-white/10 transition-colors text-center">
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 py-16 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">S</div>
                <span className="text-xl font-semibold">{siteConfig.appName}</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Revolutionizing how we communicate in the digital age.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white transition-colors">
                  <IconBrandTwitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white transition-colors">
                  <IconBrandFacebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white transition-colors">
                  <IconBrandInstagram className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Security</Link></li>
                <li><Link href="/roadmap" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/careers" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/cookies" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Cookies</Link></li>
                <li><Link href="/licensing" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">Licensing</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} {siteConfig.appName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}