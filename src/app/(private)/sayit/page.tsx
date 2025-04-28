"use client";

import { Header } from "@/components/dynamic-header";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  IconMessageCircle,
  IconArrowLeft,
  IconRobot,
  IconTrash,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconPlus,
  IconLoader2,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Chat, fetchChats, toggleChatStar, deleteChat, ApiError } from "@/services/chat.service";
import ConfirmationDialog from "@/components/confirmation-dialog";

export default function ChatbotHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  // Fetch chat history
  useEffect(() => {
    const loadChats = async () => {
      try {
        // Wait for Clerk to load
        if (!isLoaded) return;
        
        // Redirect to login if not signed in
        if (!isSignedIn) {
          router.push("/sign-in");
          return;
        }
        
        setLoading(true);
        
        // Get token from Clerk
        const token = await getToken();
        
        if (!token) {
          router.push("/sign-in");
          return;
        }

        const data = await fetchChats(token);
        setChats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching chats:", err);
        
        // Check if it's an API error with 401 status
        if (err instanceof ApiError && err.status === 401) {
          // Handle unauthorized (token expired or invalid)
          router.push("/sign-in");
        } else {
          setError("Failed to load your chat history. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [isLoaded, isSignedIn, router, getToken]);

  // Filter chats based on search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.preview &&
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format date to relative time
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handle starring/unstarring a chat
  const handleToggleStar = async (chatId: string, isStarred: boolean, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the link from being followed
    e.stopPropagation(); // Stop event from bubbling up

    try {
      const token = await getToken();
      
      if (!token) {
        router.push("/sign-in");
        return;
      }

      await toggleChatStar(chatId, isStarred, token);

      // Update the local state
      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, starred: !isStarred } : chat
        )
      );
    } catch (error) {
      console.error("Error updating star status:", error);
    }
  };

  // Handle deleting a chat
  const handleDeleteChat = async (chatId: string, token: string) => {
    try {
      await deleteChat(chatId, token);

      // Remove the chat from state
      setChats(chats.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-18px)]">
      <Header>Sayit</Header>

      <main className="w-full max-w-4xl mx-auto px-6 py-8">
        {/* Header area */}
        <div className="flex flex-col space-y-4 mb-8">
          {/* Top row with back button and title */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-zinc-200 text-zinc-900 hover:text-zinc-600 transition-colors mr-4 shrink-0"
            >
              <IconArrowLeft className="w-5 h-5" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 truncate">
                Chat History
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Your conversations with Sayit AI
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
                placeholder="Search chats..."
                className="w-full py-2.5 pl-10 pr-4 rounded-full border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link
              href="/sayit/new-chat"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors shadow-sm whitespace-nowrap shrink-0 ml-auto"
            >
              <IconPlus className="w-4 h-4" />
              <span>New Chat</span>
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <IconLoader2 className="w-10 h-10 text-zinc-400 animate-spin mb-4" />
            <p className="text-zinc-600">Loading your conversations...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl border border-zinc-200 text-center">
            <div className="text-red-500 mb-3 text-xl">!</div>
            <h3 className="text-lg font-medium mb-1 text-zinc-900">Error</h3>
            <p className="text-sm text-zinc-500 max-w-md mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Conversations section */}
        {!loading && !error && (
          <div>
            <div className="space-y-3">
              {filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl border border-zinc-200 text-center">
                  <IconMessageCircle className="w-12 h-12 text-zinc-300 mb-3" />
                  <h3 className="text-lg font-medium mb-1 text-zinc-900">
                    No conversations found
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-md mb-4">
                    {searchQuery
                      ? "Try a different search term"
                      : "You haven't started any chats yet"}
                  </p>
                  <Link
                    href="/sayit/new-chat"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors"
                  >
                    <IconPlus className="w-4 h-4" />
                    <span>Start a new chat</span>
                  </Link>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="group relative bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <Link href={`/sayit/${chat.id}`} className="p-4 block">
                      <div className="flex items-start">
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                            <IconRobot className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className="text-base font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors truncate mr-2">
                              {chat.title}
                            </h3>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                                {formatDate(chat.updatedAt)}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-zinc-700 mt-1 line-clamp-2">
                            {chat.preview || "No preview available"}
                          </p>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100">
                            <span className="text-xs text-zinc-500">
                              {formatDate(chat.createdAt)}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) =>
                                  handleToggleStar(chat.id, chat.starred, e)
                                }
                                className={`transition-colors hover:cursor-pointer ${
                                  chat.starred
                                    ? "text-amber-500 hover:text-amber-600"
                                    : "text-zinc-500 hover:text-amber-500"
                                }`}
                              >
                                {chat.starred ? (
                                  <IconStarFilled className="w-4 h-4" />
                                ) : (
                                  <IconStar className="w-4 h-4" />
                                )}
                              </button>
                              
                              {/* Replace the delete button with ConfirmationDialog */}
                              <ConfirmationDialog
                                trigger={
                                  <button 
                                    type="button"
                                    className="text-zinc-500 hover:text-red-500 transition-colors"
                                  >
                                    <IconTrash className="w-4 h-4" />
                                  </button>
                                }
                                title="Delete Chat"
                                description={`Are you sure you want to delete "${chat.title}"? This action cannot be undone.`}
                                confirmText="Delete"
                                confirmVariant="destructive"
                                onConfirm={async () => {
                                  const token = await getToken();
                                  if (token) {
                                    handleDeleteChat(chat.id, token);
                                  }
                                }}
                              />
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
        )}
      </main>
    </div>
  );
}