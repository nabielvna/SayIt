"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { format } from "date-fns";
import {
  IconArrowLeft,
  IconCalendar,
  IconChevronRight,
  IconLoader2,
  IconNotebook,
  IconPlus,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import { Header } from "@/components/dynamic-header";
import { NotesFilter } from "./_components/Filter";
import ConfirmationDialog from "@/components/confirmation-dialog";
import {
  Note,
  Tag,
  Mood,
  fetchNotes,
  fetchAvailableTags,
  fetchAvailableMoods,
  toggleNoteStarred,
  deleteNote,
  ApiError
} from "@/services/note.service";

// Types
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'recently-updated';

interface NoteFilters {
  starred?: boolean;
  tag?: string;
  mood?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface GroupedNotes {
  [date: string]: Note[];
}

export default function NotesPage() {
  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [filterMood, setFilterMood] = useState<string | null>(null);
  const [filterStarred, setFilterStarred] = useState(false);
  const [filterUntagged, setFilterUntagged] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  
  // State for notes data
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hooks
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  // Fetch notes data with filters
  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth to be ready
      if (!isLoaded) return;
      
      // Redirect if not signed in
      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }
      
      try {
        setLoading(true);
        
        const token = await getToken();
        if (!token) {
          router.push("/sign-in");
          return;
        }

        // Prepare filter options
        const filters: NoteFilters = {};
        if (searchQuery) filters.search = searchQuery;
        if (filterTag !== "all") filters.tag = filterTag;
        if (filterMood) filters.mood = filterMood;
        if (filterStarred) filters.starred = true;
        
        // Fetch all data in parallel
        const [notesData, tagsData, moodsData] = await Promise.all([
          fetchNotes(token, filters),
          fetchAvailableTags(token),
          fetchAvailableMoods(token)
        ]);
        
        // Update state with fetched data
        setNotes(notesData.notes);
        setTags(tagsData.tags);
        setMoods(moodsData.moods);
        setError(null);
      } catch (err) {
        console.error("Error fetching notes data:", err);
        
        // Check for unauthorized error
        if (err instanceof ApiError && err.status === 401) {
          router.push("/sign-in");
        } else {
          setError("Failed to load your notes. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, router, getToken, searchQuery, filterTag, filterMood, filterStarred]);

  // Sort notes based on selected option
  const sortedNotes = [...notes].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'recently-updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  // Calculate counts for filters
  const calculateNotesCount = () => {
    // Note counts by tag and mood
    const tagCounts: Record<string, number> = {};
    tags.forEach(tag => {
      tagCounts[tag.name] = tag.count || 0;
    });
    
    const moodCounts: Record<string, number> = {};
    moods.forEach(mood => {
      moodCounts[mood.name] = mood.count || 0;
    });
    
    return {
      total: notes.length,
      filtered: notes.length,
      byTag: tagCounts,
      byMood: moodCounts
    };
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'tag':
        setFilterTag(value);
        break;
      case 'mood':
        setFilterMood(value === filterMood ? null : value);
        break;
      case 'starred':
        setFilterStarred(value === 'true');
        break;
      case 'untagged':
        setFilterUntagged(value === 'true');
        break;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterTag("all");
    setFilterMood(null);
    setFilterStarred(false);
    setFilterUntagged(false);
    setSortOption("newest");
  };

  // Handle star/unstar note
  const handleToggleStar = async (noteId: string, isStarred: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = await getToken();
      if (!token) return;

      await toggleNoteStarred(noteId, !isStarred, token);

      // Update local state
      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, starred: !isStarred } : note
      ));
    } catch (error) {
      console.error("Error updating star status:", error);
    }
  };

  // Handle delete note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      await deleteNote(noteId, token);

      // Remove from local state
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // If today
      if (date.toDateString() === now.toDateString()) {
        return `Today, ${format(date, 'h:mm a')}`;
      }
      
      // If yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${format(date, 'h:mm a')}`;
      }
      
      // If within past week
      if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return format(date, 'EEEE, h:mm a');
      }
      
      // For older dates
      return format(date, 'MMM d, yyyy');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return ("Invalid date");
    }
  };

  // Group notes by date
  const groupNotesByDate = (): GroupedNotes => {
    return sortedNotes.reduce((groups: GroupedNotes, note: Note) => {
      const formattedDate = formatDate(note.createdAt);
      const dateHeader = formattedDate.includes("Today") 
        ? "Today" 
        : formattedDate.includes("Yesterday") 
          ? "Yesterday" 
          : formattedDate.split(",")[0];
      
      if (!groups[dateHeader]) {
        groups[dateHeader] = [];
      }
      
      // Add formatted date to note for display
      const noteWithDate = { 
        ...note, 
        formattedDate 
      };
      
      groups[dateHeader].push(noteWithDate as Note);
      return groups;
    }, {});
  };

  // Generate tag color
  const getTagColor = (tagName: string): string => {
    const defaultColors: Record<string, string> = {
      personal: "bg-blue-100 text-blue-800",
      work: "bg-purple-100 text-purple-800",
      goals: "bg-emerald-100 text-emerald-800",
      planning: "bg-amber-100 text-amber-800",
      books: "bg-rose-100 text-rose-800",
      learning: "bg-indigo-100 text-indigo-800",
      dreams: "bg-violet-100 text-violet-800",
      travel: "bg-sky-100 text-sky-800",
      gratitude: "bg-teal-100 text-teal-800"
    };
    
    if (defaultColors[tagName.toLowerCase()]) {
      return defaultColors[tagName.toLowerCase()];
    }
    
    // Generate color based on tag name
    const colorOptions = [
      "bg-pink-100 text-pink-800",
      "bg-orange-100 text-orange-800",
      "bg-lime-100 text-lime-800",
      "bg-cyan-100 text-cyan-800",
      "bg-fuchsia-100 text-fuchsia-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-green-100 text-green-800"
    ];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = ((hash << 5) - hash) + tagName.charCodeAt(i);
      hash |= 0;
    }
    
    const index = Math.abs(hash) % colorOptions.length;
    return colorOptions[index];
  };

  // Get emoji for mood
  const getMoodEmoji = (moodName: string): string => {
    const moodEmojis: Record<string, string> = {
      happy: "😊", motivated: "💪", inspired: "💡", curious: "🤔",
      excited: "😃", thankful: "🙏", sad: "😔", anxious: "😰",
      calm: "😌", tired: "😴", focused: "🎯", creative: "🎨",
      confused: "😕", nostalgic: "🕰️", optimistic: "🌟"
    };
    
    return moodEmojis[moodName.toLowerCase()] || "😐";
  };

  // Group notes by date for display
  const groupedNotes = groupNotesByDate();

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-18px)]">
      <Header>My Notes</Header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header section */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* Back button and title */}
          <div className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-zinc-200 text-zinc-900 hover:text-zinc-600 transition-colors mr-4 shrink-0"
            >
              <IconArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 truncate">
                My Diary & Notes
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Your personal journal of thoughts and memories
              </p>
            </div>
          </div>

          {/* Search bar and new note button */}
          <div className="flex items-center w-full gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Link 
              href="/notes/new" 
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <IconPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
          
          {/* Filter component */}
          <NotesFilter
            uniqueTags={["all", ...tags.map(tag => tag.name)]}
            filterTag={filterTag}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            notesCount={calculateNotesCount()}
            onSortChange={setSortOption}
            currentSort={sortOption}
            availableMoods={moods.map(mood => mood.name)}
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <IconLoader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-zinc-600">Loading your notes...</p>
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

        {/* Empty state */}
        {!loading && !error && Object.keys(groupedNotes).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-zinc-200 text-center">
            <IconNotebook className="w-16 h-16 text-zinc-300 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-zinc-900">No notes found</h3>
            <p className="text-sm text-zinc-500 max-w-md mb-4">
              {searchQuery || filterTag !== "all" || filterMood || filterStarred || filterUntagged
                ? "Try adjusting your filters or try a different keyword" 
                : "You haven't created any notes yet. Start capturing your thoughts!"
              }
            </p>
            {searchQuery || filterTag !== "all" || filterMood || filterStarred || filterUntagged ? (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-sm transition-colors mr-2"
              >
                Clear filters
              </button>
            ) : null}
            <Link 
              href="/notes/new" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors"
            >
              <IconPlus className="w-4 h-4" />
              <span>{searchQuery || filterTag !== "all" ? "Create new note" : "Create your first note"}</span>
            </Link>
          </div>
        )}

        {/* Notes listing */}
        {!loading && !error && Object.keys(groupedNotes).length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedNotes).map(([date, notes]) => (
              <div key={date} className="animate-fadeIn">
                <h2 className="text-sm font-medium text-zinc-500 mb-3 flex items-center">
                  <IconCalendar className="w-4 h-4 mr-2" />
                  {date}
                </h2>
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="group relative bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md hover:border-amber-200 transition-all duration-200"
                    >
                      <Link href={`/notes/${note.id}`} className="p-4 block">
                        <div className="flex items-start">
                          {/* Note icon */}
                          <div className="shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              note.starred ? 'bg-amber-500 text-white' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                              <IconNotebook className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <div className="ml-3 flex-1 min-w-0">
                            {/* Title and metadata */}
                            <div className="flex items-start justify-between">
                              <h3 className="text-base font-medium text-zinc-900 group-hover:text-amber-600 transition-colors truncate mr-2">
                                {note.title}
                              </h3>
                              
                              <div className="flex items-center gap-2 shrink-0">
                                {note.mood && (
                                  <div className="flex items-center">
                                    <span className="text-base" title={`Feeling: ${note.mood.name}`}>
                                      {getMoodEmoji(note.mood.name)}
                                    </span>
                                    <span className="ml-1 text-xs text-zinc-500 hidden sm:inline capitalize">
                                      {note.mood.name}
                                    </span>
                                  </div>
                                )}
                                <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                                   {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {(note as any).formattedDate?.split(",")[1] || format(new Date(note.createdAt), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                            
                            {/* Content preview */}
                            <p className="text-sm text-zinc-700 mt-1 line-clamp-2">
                              {note.content}
                            </p>
                            
                            {/* Tags and actions */}
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100">
                              <div className="flex flex-wrap gap-1.5">
                                {note.tags && note.tags.length > 0 ? (
                                  note.tags.map(tag => (
                                    <span 
                                      key={tag.id} 
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag.name)}`}
                                    >
                                      #{tag.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-zinc-400">No tags</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={(e) => handleToggleStar(note.id, note.starred, e)}
                                  className={`transition-colors hover:cursor-pointer ${
                                    note.starred
                                      ? "text-amber-500 hover:text-amber-600"
                                      : "text-zinc-500 hover:text-amber-500"
                                  }`}
                                >
                                  {note.starred ? (
                                    <IconStarFilled className="w-4 h-4" />
                                  ) : (
                                    <IconStar className="w-4 h-4" />
                                  )}
                                </button>
                                
                                <ConfirmationDialog
                                  trigger={
                                    <button 
                                      type="button"
                                      className="text-zinc-500 hover:text-red-500 transition-colors"
                                    >
                                      <IconTrash className="w-4 h-4" />
                                    </button>
                                  }
                                  title="Delete Note"
                                  description={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
                                  confirmText="Delete"
                                  confirmVariant="destructive"
                                  onConfirm={async () => {
                                    const token = await getToken();
                                    if (token) {
                                      handleDeleteNote(note.id);
                                    }
                                  }}
                                />
                                <span className="text-xs text-zinc-900 font-medium group-hover:underline flex items-center">
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}