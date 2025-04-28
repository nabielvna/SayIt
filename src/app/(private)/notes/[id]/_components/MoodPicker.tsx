"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconMoodSmile, IconSearch, IconCheck, IconX, IconPlus } from "@tabler/icons-react";

// Define types
type MoodType = 'happy' | 'sad' | 'motivated' | 'inspired' | 'curious' | 'excited' | 'thankful' | 'anxious' | 'calm' | 'tired' | string;

interface MoodPickerProps {
  selectedMood?: MoodType;
  existingMoods?: MoodType[]; // Added prop for existing user-created moods
  onChange: (mood: MoodType) => void;
}

// Default mood emoji mapping
const defaultMoodEmojis: Record<string, string> = {
  happy: "😊",
  motivated: "💪",
  inspired: "💡",
  curious: "🤔",
  excited: "😃",
  thankful: "🙏",
  sad: "😔",
  anxious: "😰",
  calm: "😌",
  tired: "😴"
};

export function MoodPicker({ selectedMood, existingMoods = [], onChange }: MoodPickerProps) {
  const [showMoodPicker, setShowMoodPicker] = useState<boolean>(false);
  const [showCustomMoodInput, setShowCustomMoodInput] = useState<boolean>(false);
  const [customMood, setCustomMood] = useState<string>("");
  const [customEmoji, setCustomEmoji] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const customMoodRef = useRef<HTMLInputElement>(null);
  const searchMoodRef = useRef<HTMLInputElement>(null);
  
  // Combine default moods with any user-created custom moods
  const [moodEmojis, setMoodEmojis] = useState<Record<string, string>>(() => {
    // Start with the default mood emojis
    const result: Record<string, string> = {...defaultMoodEmojis};
    
    // Add any custom moods from existingMoods that aren't in defaultMoodEmojis
    existingMoods.forEach(mood => {
      if (typeof mood === 'string' && !defaultMoodEmojis[mood]) {
        // For moods without emojis, set a default emoji
        result[mood] = "😐";
      }
    });
    
    return result;
  });
  
  // Focus on custom mood input when showing
  useEffect(() => {
    if (showCustomMoodInput && customMoodRef.current) {
      customMoodRef.current.focus();
    }
  }, [showCustomMoodInput]);
  
  // Focus on search input when showing mood picker
  useEffect(() => {
    if (showMoodPicker && searchMoodRef.current) {
      searchMoodRef.current.focus();
    }
  }, [showMoodPicker]);
  
  // Filter moods based on search query
  const filteredMoods = Object.entries(moodEmojis).filter(([mood]) => 
    mood.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add custom mood
  const addCustomMood = () => {
    if (customMood.trim()) {
      const newMood = customMood.trim().toLowerCase();
      const emoji = customEmoji.trim() || "😐"; // Default emoji if none provided
      
      // Update mood emojis with the new custom mood
      setMoodEmojis(prev => ({
        ...prev,
        [newMood]: emoji
      }));
      
      // Select the new mood
      onChange(newMood);
      
      // Reset and close
      setCustomMood("");
      setCustomEmoji("");
      setShowCustomMoodInput(false);
      setShowMoodPicker(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMoodPicker(!showMoodPicker)}
        className="flex items-center text-sm text-zinc-600 hover:text-amber-600 transition-colors"
      >
        <IconMoodSmile className="w-4 h-4 mr-1.5" />
        <span>{selectedMood ? `${selectedMood} ${moodEmojis[selectedMood] || "😐"}` : "Add mood"}</span>
      </button>
      
      {showMoodPicker && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-white rounded-lg shadow-lg border border-zinc-200 z-10 w-64">
          {/* Search input */}
          <div className="flex items-center gap-1 bg-zinc-50 rounded-md border border-zinc-200 mb-3">
            <IconSearch className="w-3.5 h-3.5 ml-2 text-zinc-400" />
            <input
              ref={searchMoodRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search moods..."
              className="w-full px-2 py-1.5 text-xs outline-none bg-transparent"
            />
          </div>
          
          {!showCustomMoodInput ? (
            <>
              {/* Mood grid */}
              <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto mb-2">
                {filteredMoods.length > 0 ? (
                  filteredMoods.map(([mood, emoji]) => (
                    <button
                      key={mood}
                      onClick={() => {
                        onChange(mood as MoodType);
                        setShowMoodPicker(false);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-1.5 p-1.5 rounded ${
                        selectedMood === mood ? 'bg-amber-100' : 'hover:bg-zinc-100'
                      } text-sm transition-colors`}
                    >
                      <span className="text-lg">{emoji}</span>
                      <span className="capitalize truncate">{mood}</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 py-3 text-center text-xs text-zinc-500">
                    No matching moods found
                  </div>
                )}
              </div>
              
              {/* Custom mood button */}
              <button
                onClick={() => {
                  setShowCustomMoodInput(true);
                  setSearchQuery("");
                }}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 text-sm transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                <span>Create custom mood</span>
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Mood name:</label>
                <input
                  ref={customMoodRef}
                  type="text"
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                  placeholder="e.g., energetic, reflective..."
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomMood();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setShowCustomMoodInput(false);
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Emoji (optional):</label>
                <input
                  type="text"
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value)}
                  placeholder="e.g., 😎, 🌟, ✨"
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomMood();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setShowCustomMoodInput(false);
                    }
                  }}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomMoodInput(false)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm transition-colors"
                >
                  <IconX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={addCustomMood}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-sm transition-colors"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}