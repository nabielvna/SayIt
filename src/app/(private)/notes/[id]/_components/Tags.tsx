"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconHash, IconCheck, IconX, IconSearch, IconPlus } from "@tabler/icons-react";

// Define types
type TagType = 'personal' | 'work' | 'goals' | 'planning' | 'books' | 'learning' | 'dreams' | 'travel' | 'gratitude' | string;

type TagColorsType = {
  [key in TagType]?: string;
};

// Tag colors
const tagColors: TagColorsType = {
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

interface TagsProps {
  tags: TagType[];
  editMode: boolean;
  existingTags?: TagType[]; // Added prop for existing tags
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
}

export function Tags({ tags, editMode, existingTags = [], onAddTag, onRemoveTag }: TagsProps) {
  const [showTagInput, setShowTagInput] = useState<boolean>(false);
  const [showTagSelector, setShowTagSelector] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>("");
  const [tagSearchQuery, setTagSearchQuery] = useState<string>("");
  const [localAvailableTags, setLocalAvailableTags] = useState<TagType[]>(existingTags);
  const newTagRef = useRef<HTMLInputElement>(null);
  const searchTagRef = useRef<HTMLInputElement>(null);
  
  // Update local available tags when existingTags prop changes
  useEffect(() => {
    setLocalAvailableTags(existingTags);
  }, [existingTags]);
  
  // Combine current tags with existing tags, removing duplicates
  const allAvailableTags = Array.from(new Set([...localAvailableTags])).filter(tag => !tags.includes(tag));
  
  // Filtered tags based on search query
  const filteredTags = allAvailableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );
  
  // Focus on new tag input when showing tag input
  useEffect(() => {
    if (showTagInput && newTagRef.current) {
      newTagRef.current.focus();
    }
  }, [showTagInput]);
  
  // Focus on search input when showing tag selector
  useEffect(() => {
    if (showTagSelector && searchTagRef.current) {
      searchTagRef.current.focus();
    }
  }, [showTagSelector]);

  // Add new tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && onAddTag) {
      // Add the tag to the note
      onAddTag(newTag.trim());
      
      // Also add to local available tags if it's not already there
      if (!localAvailableTags.includes(newTag.trim())) {
        setLocalAvailableTags(prev => [...prev, newTag.trim()]);
      }
      
      setNewTag("");
    }
    setShowTagInput(false);
  };
  
  // Select an existing tag
  const selectTag = (tag: string) => {
    if (onAddTag) {
      onAddTag(tag);
    }
    setShowTagSelector(false);
    setTagSearchQuery("");
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-zinc-500 mr-1">Tags:</span>
      
      {tags.length > 0 ? (
        tags.map(tag => (
          <div 
            key={tag} 
            className={`group flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tagColors[tag] || 'bg-zinc-100 text-zinc-800'}`}
          >
            <span>#{tag}</span>
            {editMode && onRemoveTag && (
              <button 
                onClick={() => onRemoveTag(tag)}
                className="ml-1 w-4 h-4 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${tag} tag`}
              >
                <IconX className="w-3 h-3" />
              </button>
            )}
          </div>
        ))
      ) : (
        <span className="text-xs text-zinc-400">No tags</span>
      )}
      
      {editMode && onAddTag && (
        <div className="relative">
          {!showTagInput && !showTagSelector ? (
            <div className="flex gap-1">
              {/* Single button for selecting or creating tags */}
              <button
                onClick={() => setShowTagSelector(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
              >
                <IconHash className="w-3 h-3" />
                <span>Add tag</span>
              </button>
            </div>
          ) : showTagInput ? (
            <div className="flex items-center gap-1 bg-white rounded-full border border-amber-300 overflow-hidden">
              <input
                ref={newTagRef}
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setShowTagInput(false);
                  }
                }}
                placeholder="New tag"
                className="px-2.5 py-1 text-xs outline-none min-w-[80px] max-w-[120px]"
              />
              <div className="flex items-center">
                <button
                  onClick={addTag}
                  className="w-6 h-6 flex items-center justify-center text-emerald-500 hover:text-emerald-600"
                  aria-label="Add tag"
                >
                  <IconCheck className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowTagInput(false)}
                  className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-600"
                  aria-label="Cancel"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute z-20 mt-1 bg-white rounded-lg shadow-lg border border-zinc-200 p-2 w-60">
              <div className="flex items-center gap-1 bg-zinc-50 rounded-md border border-zinc-200 mb-2">
                <IconSearch className="w-3.5 h-3.5 ml-2 text-zinc-400" />
                <input
                  ref={searchTagRef}
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      setShowTagSelector(false);
                      setTagSearchQuery("");
                    }
                  }}
                  placeholder="Search or create tag..."
                  className="w-full px-2 py-1.5 text-xs outline-none bg-transparent"
                />
                <button
                  onClick={() => {
                    setShowTagSelector(false);
                    setTagSearchQuery("");
                  }}
                  className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-red-500"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="max-h-48 overflow-y-auto">
                {/* Show option to create new tag if there's text in the search box and it doesn't match existing tags */}
                {tagSearchQuery && !filteredTags.some(tag => tag.toLowerCase() === tagSearchQuery.toLowerCase()) && (
                  <button
                    onClick={() => {
                      if (onAddTag) {
                        const newTag = tagSearchQuery.trim();
                        onAddTag(newTag);
                        
                        // Add to local available tags
                        if (!localAvailableTags.includes(newTag)) {
                          setLocalAvailableTags(prev => [...prev, newTag]);
                        }
                        
                        setShowTagSelector(false);
                        setTagSearchQuery("");
                      }
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-2 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs text-left mb-1"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Create tag: <strong>#{tagSearchQuery}</strong></span>
                  </button>
                )}
              
                {filteredTags.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {filteredTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => selectTag(tag)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs ${tagColors[tag] || 'bg-zinc-100 text-zinc-800'} hover:opacity-80 transition-opacity text-left`}
                      >
                        <span className="truncate">#{tag}</span>
                      </button>
                    ))}
                  </div>
                ) : tagSearchQuery ? (
                  <div className="py-2 text-center text-xs text-zinc-500">
                    No matching tags found
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs text-zinc-500">
                    No available tags
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}