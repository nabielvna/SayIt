"use client";

import { Header } from "@/components/dynamic-header";
import Link from "next/link";
import { useState } from "react";
import {
  IconMessageCircle,
  IconChevronRight,
  IconArrowLeft,
  IconTrash,
  IconSearch,
  IconStar,
  IconPlus,
  IconEyeOff,
  IconArchive,
  IconCheck
} from "@tabler/icons-react";

// Sample anonymous chat history data
const anonymousChatHistory = [
  {
    id: "anon-1",
    title: "Conversation with Anonymous #4291",
    date: "Today, 3:45 PM",
    preview: "Hello, I wanted to discuss something private...",
    messages: 15,
    starred: true,
    status: "active"
  },
  {
    id: "anon-2",
    title: "Conversation with Anonymous #1837",
    date: "Yesterday, 11:20 AM",
    preview: "I'm having trouble with a personal situation and need advice...",
    messages: 24,
    starred: false,
    status: "active"
  },
  {
    id: "anon-3",
    title: "Conversation with Anonymous #9058",
    date: "Apr 20, 2025",
    preview: "Thank you for being available to chat. I have some concerns about...",
    messages: 31,
    starred: false,
    status: "ended",
    endedDate: "Apr 21, 2025"
  },
  {
    id: "anon-4",
    title: "Conversation with Anonymous #6372",
    date: "Apr 16, 2025",
    preview: "I'm not sure where to start, but I've been feeling...",
    messages: 19,
    starred: true,
    status: "active"
  },
  {
    id: "anon-5",
    title: "Conversation with Anonymous #2104",
    date: "Apr 12, 2025",
    preview: "Can we talk about something that's been bothering me lately?",
    messages: 27,
    starred: false,
    status: "ended",
    endedDate: "Apr 14, 2025"
  },
  {
    id: "anon-6",
    title: "Conversation with Anonymous #5739",
    date: "Apr 8, 2025",
    preview: "Thanks for all your help today. This has been very useful.",
    messages: 22,
    starred: false,
    status: "ended",
    endedDate: "Apr 8, 2025"
  }
];

export default function AnonymousChatHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter chats based on search query
  const filteredChats = anonymousChatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Separate active and ended chats
  const activeChats = filteredChats.filter(chat => chat.status === "active");
  const endedChats = filteredChats.filter(chat => chat.status === "ended");

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-18px)]">
      <Header>
        Anonymous
      </Header>

      <main className="w-full max-w-4xl mx-auto px-6 py-8">
        {/* Header area */}
        <div className="flex flex-col space-y-4 mb-8">
            {/* Top row with back button and title */}
            <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-zinc-200 text-zinc-900 hover:text-zinc-600 transition-colors mr-4 shrink-0">
                <IconArrowLeft className="w-5 h-5" />
                </Link>
                
                <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 truncate">
                        Anonymous Chat History
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Your private anonymous conversations
                    </p>
                </div>
            </div>

            {/* Bottom row with search and action button */}
            <div className="flex items-center w-full">
                <div className="relative flex-1 mr-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconSearch className="w-4 h-4 text-zinc-400" />
                    </div>
                <input
                    type="text"
                    placeholder="Search anonymous chats..."
                    className="w-full py-2.5 pl-10 pr-4 rounded-full border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                
                <Link href="/anonymous/new" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors shadow-sm whitespace-nowrap shrink-0 ml-auto">
                    <IconPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Anonymous Chat</span>
                    <span className="sm:hidden">New Chat</span>
                </Link>
            </div>
        </div>

        {/* Privacy notice */}
        <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-4 mb-6 flex items-start">
          <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 mr-3">
            <IconEyeOff className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-900">Privacy Notice</h3>
            <p className="text-xs text-zinc-600 mt-1">
              Anonymous chats are private and encrypted. Only you can access your chat history. Ended chats are automatically archived but can be deleted permanently at any time.
            </p>
          </div>
        </div>

        {/* Active conversations section */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-zinc-700 mb-2">Active Conversations</h2>
          <div className="space-y-3">
            {activeChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 bg-white rounded-xl border border-zinc-200 text-center">
                <IconMessageCircle className="w-10 h-10 text-zinc-300 mb-3" />
                <h3 className="text-base font-medium mb-1 text-zinc-900">No active anonymous chats</h3>
                <p className="text-sm text-zinc-500 max-w-md mb-4">
                  {searchQuery ? "Try a different search term" : "You don't have any ongoing anonymous conversations"}
                </p>
                <Link href="/anonymous/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors">
                  <IconPlus className="w-4 h-4" />
                  <span>Start anonymous chat</span>
                </Link>
              </div>
            ) : (
              activeChats.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <Link href={`/anonymous/chat/${chat.id}`} className="p-4 block">
                    <div className="flex items-start">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                          <IconMessageCircle className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-base font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors truncate mr-2">
                            {chat.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {chat.starred && <IconStar className="w-4 h-4 text-zinc-900" />}
                            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                              {chat.date}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-zinc-700 mt-1 line-clamp-2">
                          {chat.preview}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100">
                          <span className="text-xs text-zinc-500">
                            {chat.messages} messages
                          </span>
                          <div className="flex items-center gap-3">
                            <button className="text-zinc-500 hover:text-zinc-900 transition-colors">
                              <IconStar className="w-4 h-4" />
                            </button>
                            <button className="text-zinc-500 hover:text-green-600 transition-colors" title="End conversation">
                              <IconCheck className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-zinc-900 font-medium group-hover:underline flex items-center">
                              Continue <IconChevronRight className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ended conversations section */}
        {endedChats.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-zinc-700 mb-2">Ended Conversations</h2>
            <div className="space-y-3">
              {endedChats.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <Link href={`/anonymous/chat/${chat.id}`} className="p-4 block">
                    <div className="flex items-start">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-zinc-400 flex items-center justify-center text-white">
                          <IconArchive className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-base font-medium text-zinc-700 group-hover:text-zinc-600 transition-colors truncate mr-2">
                            {chat.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {chat.starred && <IconStar className="w-4 h-4 text-zinc-600" />}
                            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                              Ended: {chat.endedDate}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
                          {chat.preview}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100">
                          <span className="text-xs text-zinc-500">
                            {chat.messages} messages
                          </span>
                          <div className="flex items-center gap-3">
                            <button className="text-zinc-500 hover:text-zinc-900 transition-colors">
                              <IconStar className="w-4 h-4" />
                            </button>
                            <button className="text-zinc-500 hover:text-red-500 transition-colors">
                              <IconTrash className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-zinc-700 font-medium group-hover:underline flex items-center">
                              View <IconChevronRight className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}