"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  IconArrowLeft,
  IconTrash,
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconClock,
  IconMoodSmile,
  IconGavel,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";

import { Header } from "@/components/dynamic-header";
import { MarkdownContent } from "./_components/MarkdownContent";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { Tags } from "./_components/Tags";
import { FormattingToolbar } from "./_components/FormattingToolbar";
import { MoodPicker } from "./_components/MoodPicker";

import {
  Note,
  Tag,
  Mood,
  fetchNoteById,
  updateNote,
  createNote,
  fetchAvailableTags,
  fetchAvailableMoods,
  toggleNoteStarred,
  deleteNote,
  ApiError
} from "@/services/note.service";

export default function NotePage() {
  // Get noteId from URL params
  const params = useParams();
  const noteId = typeof params?.id === 'string' ? params.id : '';
  const isNewNote = noteId === 'new';
  
  // Router and auth
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  // State for the note
  const [note, setNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState<boolean>(isNewNote);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for available tags and moods
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableMoods, setAvailableMoods] = useState<Mood[]>([]);
  
  // Refs
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Check authentication
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);
  
  // Initialize new note template
  useEffect(() => {
    if (isNewNote) {
      setNote({
        id: '',
        userId: '',
        title: '',
        content: '',
        tags: [],
        mood: null,
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      });
      setIsLoading(false);
    }
  }, [isNewNote]);

  // Fetch note data for existing notes
  useEffect(() => {
    // Skip if we're creating a new note
    if (isNewNote) return;
    
    const fetchData = async () => {
      // Wait for auth to be ready
      if (!isLoaded) return;
      
      // Redirect if not signed in
      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }
      
      try {
        setIsLoading(true);
        
        const token = await getToken();
        if (!token) {
          router.push("/sign-in");
          return;
        }

        if (!noteId) {
          setError("Note ID is required");
          setIsLoading(false);
          return;
        }

        // Fetch note details and available tags/moods in parallel
        const [noteData, tagsData, moodsData] = await Promise.all([
          fetchNoteById(noteId, token),
          fetchAvailableTags(token),
          fetchAvailableMoods(token)
        ]);
        
        // Update state with fetched data
        setNote(noteData);
        setAvailableTags(tagsData.tags);
        setAvailableMoods(moodsData.moods);
        setError(null);
      } catch (err) {
        console.error("Error fetching note data:", err);
        
        // Check for unauthorized error
        if (err instanceof ApiError && err.status === 401) {
          router.push("/sign-in");
        } else if (err instanceof ApiError && err.status === 404) {
          setError("Note not found");
        } else {
          setError("Failed to load the note. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, router, getToken, noteId, isNewNote]);
  
  // Fetch tags and moods for new note
  useEffect(() => {
    // Only for new notes - fetch tags and moods
    if (!isNewNote) return;
    
    const fetchTagsAndMoods = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      try {
        const token = await getToken();
        if (!token) {
          router.push("/sign-in");
          return;
        }
        
        // Fetch available tags and moods
        const [tagsData, moodsData] = await Promise.all([
          fetchAvailableTags(token),
          fetchAvailableMoods(token)
        ]);
        
        setAvailableTags(tagsData.tags);
        setAvailableMoods(moodsData.moods);
      } catch (err) {
        console.error("Error fetching tags and moods:", err);
        
        if (err instanceof ApiError && err.status === 401) {
          router.push("/sign-in");
        }
      }
    };
    
    fetchTagsAndMoods();
  }, [isNewNote, isLoaded, isSignedIn, getToken, router]);

  // Handle title change with auto-resize
  useEffect(() => {
    if (titleRef.current && editMode && note) {
      titleRef.current.style.height = "0";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.title, editMode]);

  // Handle content change with auto-resize
  useEffect(() => {
    if (contentRef.current && editMode && note) {
      contentRef.current.style.height = "0";
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.content, editMode]);
  
  // Focus on title when entering edit mode
  useEffect(() => {
    if (editMode && titleRef.current) {
      // For new notes, focus immediately
      // For existing notes, focus only when switching to edit mode
      if (isNewNote || document.activeElement !== titleRef.current) {
        setTimeout(() => {
          titleRef.current?.focus();
        }, 100);
      }
    }
  }, [editMode, isNewNote]);

  useEffect(() => {
    if (editMode && titleRef.current) {
      titleRef.current.focus();
    }
  }, [editMode]);

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Exit edit mode (save changes)
      handleSave();
    } else {
      // Enter edit mode
      setEditMode(true);
    }
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!note) return;
    setNote(prev => prev ? { ...prev, title: e.target.value } : null);
    
    // For new notes, auto-focus on content after typing title
    if (isNewNote && e.target.value && !note.content && contentRef.current) {
      if (e.target.value.length > 10) { // Once title has reasonable length
        setTimeout(() => {
          contentRef.current?.focus();
        }, 100);
      }
    }
  };

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!note) return;
    setNote(prev => prev ? { ...prev, content: e.target.value } : null);
    
    // Auto-resize the textarea to fit content
    if (contentRef.current) {
      contentRef.current.style.height = "0";
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  };

  // Handler for updating content (used by FormattingToolbar)
  const updateContent = (newContent: string) => {
    if (!note) return;
    setNote(prev => prev ? { ...prev, content: newContent } : null);
  };

  // Handle content key presses
  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!note) return;
    
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      // Call updateContent directly to add line-break
      const cursorPos = e.currentTarget.selectionStart;
      const cursorEnd = e.currentTarget.selectionEnd;
      const currentContent = note.content;
      const newContent = currentContent.substring(0, cursorPos) + '\n\n' + currentContent.substring(cursorEnd);
      updateContent(newContent);
      
      // Set cursor position after update
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
          contentRef.current.setSelectionRange(cursorPos + 2, cursorPos + 2);
        }
      }, 0);
    }
  };

  // Toggle starred status
  const toggleStar = async () => {
    if (!note) return;
    
    try {
      const token = await getToken();
      if (!token) return;
      
      const updatedNote = await toggleNoteStarred(note.id, !note.starred, token);
      
      // Update local state
      setNote(updatedNote);
    } catch (error) {
      console.error("Error toggling star status:", error);
    }
  };

  // Change mood
  const changeMood = (moodName: string | null) => {
    if (!note) return;
    setNote(prev => prev ? { ...prev, mood: moodName ? { id: '', name: moodName } : null } : null);
  };

  // Add new tag
  const addTag = (tagName: string) => {
    if (!note) return;
    
    // Get current tag names
    const currentTagNames = note.tags.map(tag => tag.name);
    
    // Only add if not already present
    if (!currentTagNames.includes(tagName)) {
      setNote(prev => {
        if (!prev) return null;
        
        // Create a new tag object with an empty ID (will be assigned by the server)
        const newTag = { id: '', name: tagName };
        
        // Add the new tag to the existing tags
        return {
          ...prev,
          tags: [...prev.tags, newTag]
        };
      });
    }
  };

  // Remove tag
  const removeTag = (tagName: string) => {
    if (!note) return;
    
    setNote(prev => {
      if (!prev) return null;
      
      // Filter out the tag with the matching name
      return {
        ...prev,
        tags: prev.tags.filter(tag => tag.name !== tagName)
      };
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!note) return;
    
    try {
      setIsSaving(true);
      
      const token = await getToken();
      if (!token) return;
      
      // Prepare note data
      const noteData = {
        title: note.title,
        content: note.content,
        tags: note.tags.map(tag => tag.name),
        mood: note.mood?.name || null,
        starred: note.starred
      };
      
      if (isNewNote) {
        // Create a new note
        const createdNote = await createNote(noteData, token);
        
        // Update state with the created note
        setNote(createdNote);
        
        // Redirect to the new note page
        router.replace(`/notes/${createdNote.id}`);
      } else {
        // Update existing note
        const updatedNote = await updateNote(note.id, noteData, token);
        setNote(updatedNote);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      
      if (error instanceof ApiError) {
        setError(`Failed to save note: ${error.message}`);
      } else {
        setError("Failed to save note. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!note) return;
    
    try {
      const token = await getToken();
      if (!token) return;
      
      await deleteNote(note.id, token);
      
      // Redirect to notes list
      router.push("/notes");
    } catch (error) {
      console.error("Error deleting note:", error);
      
      if (error instanceof ApiError) {
        setError(`Failed to delete note: ${error.message}`);
      } else {
        setError("Failed to delete note. Please try again.");
      }
    }
  };

  // Format timestamp
  const formatTimestamp = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const now = new Date();
      
      // If today
      if (date.toDateString() === now.toDateString()) {
        return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      }
      
      // If yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      }
      
      // Standard format for other dates
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return "Invalid date";
    }
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

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+S / Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (editMode) handleSave();
    }
    
    // Exit on Escape
    if (e.key === 'Escape' && editMode) {
      e.preventDefault();
      setEditMode(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-18px)]" onKeyDown={handleKeyDown}>
      <Header>
        {isNewNote ? "New Note" : editMode ? "Editing Note" : note?.title || "Note"}
      </Header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <IconLoader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-zinc-600">Loading note...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl border border-zinc-200 text-center">
            <div className="text-red-500 mb-3 text-xl">!</div>
            <h3 className="text-lg font-medium mb-1 text-zinc-900">Error</h3>
            <p className="text-sm text-zinc-500 max-w-md mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors"
              >
                Retry
              </button>
              <Link
                href="/notes" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-sm transition-colors"
              >
                Back to Notes
              </Link>
            </div>
          </div>
        )}

        {/* Note content */}
        {!isLoading && !error && note && (
          <>
            {/* Header area with actions */}
            <div className="flex flex-col space-y-4 mb-6">
              {/* Top row with back button and actions */}
              <div className="flex items-center justify-between">
                <Link 
                  href="/notes" 
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-zinc-200 text-zinc-900 hover:text-zinc-600 transition-colors shrink-0"
                  onClick={(e) => {
                    // Confirm before navigating away from unsaved new note
                    if (isNewNote && note && (note.title || note.content)) {
                      if (!confirm("You have unsaved changes. Are you sure you want to leave?")) {
                        e.preventDefault();
                      }
                    }
                  }}
                >
                  <IconArrowLeft className="w-5 h-5" />
                </Link>
                
                <div className="flex items-center gap-2">
                  {!isNewNote && (
                    <button 
                      onClick={toggleStar}
                      className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                        note.starred 
                          ? 'bg-amber-50 border-amber-200 text-amber-500' 
                          : 'bg-white border-zinc-200 text-zinc-400 hover:text-amber-500 hover:border-amber-200'
                      }`}
                      aria-label={note.starred ? "Remove from favorites" : "Add to favorites"}
                    >
                      {note.starred ? <IconStarFilled className="w-5 h-5" /> : <IconStar className="w-5 h-5" />}
                    </button>
                  )}
                  
                  <button 
                    onClick={toggleEditMode}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
                      editMode
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    disabled={isSaving}
                  >
                    {editMode ? (
                      isSaving ? (
                        <span className="flex items-center">
                          <IconLoader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          <span>Saving...</span>
                        </span>
                      ) : (
                        <>
                          <IconGavel className="w-4 h-4" />
                          <span>{isNewNote ? "Create Note" : "Save"}</span>
                        </>
                      )
                    ) : (
                      <span>Edit Note</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
              
            {/* Note content section */}
            <div className={`bg-white rounded-xl border ${editMode ? 'border-amber-300 shadow-lg shadow-amber-100' : 'border-zinc-200'} overflow-hidden mb-6`}>
              {/* Title area */}
              <div className={`px-6 pt-5 pb-3 ${editMode ? 'bg-amber-50' : ''}`}>
                {editMode ? (
                  <textarea
                    ref={titleRef}
                    value={note.title}
                    onChange={handleTitleChange}
                    className="w-full text-2xl font-bold text-zinc-900 bg-transparent border-none outline-none resize-none overflow-hidden"
                    rows={1}
                    placeholder={isNewNote ? "Enter note title..." : "Note title"}
                    autoFocus={isNewNote}
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-zinc-900">{note.title || "Untitled Note"}</h1>
                )}
                
                <div className="flex items-center text-sm text-zinc-500 mt-2">
                  <IconCalendar className="w-4 h-4 mr-1.5" />
                  <span>{formatTimestamp(note.createdAt)}</span>
                  
                  {note.mood && !editMode && (
                    <div className="flex items-center ml-4">
                      <IconMoodSmile className="w-4 h-4 mr-1.5" />
                      <span>Feeling {note.mood.name} {getMoodEmoji(note.mood.name)}</span>
                    </div>
                  )}
                  
                  {editMode && (
                    <div className="relative ml-4">
                      <MoodPicker
                        selectedMood={note.mood?.name}
                        existingMoods={availableMoods.map(mood => mood.name)}
                        onChange={changeMood}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tags area */}
              <div className="px-6 py-3 border-b border-zinc-100">
                <Tags 
                  tags={note.tags.map(tag => tag.name)} 
                  editMode={editMode}
                  existingTags={availableTags.map(tag => tag.name)} 
                  onAddTag={addTag} 
                  onRemoveTag={removeTag} 
                />
              </div>
              
              {/* Formatting toolbar - only in edit mode */}
              {editMode && (
                <FormattingToolbar 
                  contentRef={contentRef}
                  noteContent={note.content}
                  onContentChange={updateContent}
                />
              )}
              
              {/* Content area */}
              <div className="p-6">
                {editMode ? (
                  <textarea
                    ref={contentRef}
                    value={note.content}
                    onChange={handleContentChange}
                    onKeyDown={handleContentKeyDown}
                    className="w-full min-h-[300px] text-zinc-800 bg-transparent border-none outline-none resize-none leading-relaxed whitespace-pre-wrap"
                    placeholder="Start typing your note here..."
                  />
                ) : (
                  <MarkdownContent content={note.content} />
                )}
              </div>
            </div>
            
            {/* Bottom action bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex items-center text-sm text-zinc-500">
                <IconClock className="w-4 h-4 mr-1.5" />
                <span>
                  {isNewNote ? "Not saved yet" : `Last updated: ${formatTimestamp(note.updatedAt)}`}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {!isNewNote && (
                  <ConfirmationDialog
                    trigger={
                      <button 
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 border border-red-200 text-white hover:bg-red-600 transition-colors"
                      >
                        <IconTrash className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    }
                    title="Delete Note"
                    description={`Are you sure you want to delete "${note.title || 'this note'}"? This action cannot be undone.`}
                    confirmText="Delete"
                    confirmVariant="destructive"
                    onConfirm={handleDelete}
                  />
                )}
                
                {isNewNote && (
                  <button
                    onClick={() => router.push('/notes')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-500 border border-zinc-200 text-white hover:bg-zinc-600 transition-colors"
                  >
                    <IconX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}