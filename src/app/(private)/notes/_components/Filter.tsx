// NotesFilter.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  IconFilter,
  IconChevronDown,
  IconCalendar,
  IconMoodSmile,
  IconStar,
  IconCircleCheck,
  IconX,
  IconHash,
  // IconSearch,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
  IconChevronsRight,
  IconWindowMaximize,
  IconWindowMinimize,
} from "@tabler/icons-react";

// Define types
type MoodType = 'happy' | 'sad' | 'motivated' | 'inspired' | 'curious' | 'excited' | 'thankful' | 'anxious' | 'calm' | 'tired' | string;
// type TagType = 'personal' | 'work' | 'goals' | 'planning' | 'books' | 'learning' | 'dreams' | 'travel' | 'gratitude' | string;
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'recently-updated';

interface NotesFilterProps {
  uniqueTags: string[];
  filterTag: string;
  onFilterChange: (filterType: string, value: string) => void;
  onReset: () => void;
  notesCount: {
    total: number;
    filtered: number;
    byTag: Record<string, number>;
    byMood: Record<string, number>;
  };
  onSortChange?: (option: SortOption) => void;
  currentSort?: SortOption;
  availableMoods?: MoodType[];
}

export function NotesFilter({
  uniqueTags,
  filterTag,
  onFilterChange,
  onReset,
  notesCount,
  onSortChange,
  currentSort = 'newest',
  availableMoods = []
}: NotesFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  
  const filtersRef = useRef<HTMLDivElement>(null);
  
  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filterTag !== "all") count++;
    if (dateRange.from || dateRange.to) count++;
    
    setActiveFilterCount(count);
  }, [filterTag, dateRange]);
  
  // Handle clicks outside filter panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Generate tag color based on the tag name
  const generateTagColor = (tag: string): string => {
    // Default tag colors
    const defaultTagColors: Record<string, string> = {
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
    
    // If it's a default tag, return its color
    if (defaultTagColors[tag]) {
      return defaultTagColors[tag];
    }
    
    // For custom tags, generate a color based on the tag's string
    const colorOptions = [
      "bg-pink-100 text-pink-800",
      "bg-orange-100 text-orange-800",
      "bg-lime-100 text-lime-800",
      "bg-cyan-100 text-cyan-800",
      "bg-fuchsia-100 text-fuchsia-800",
      "bg-yellow-100 text-yellow-800",
      "bg-blue-100 text-blue-800",
      "bg-red-100 text-red-800",
      "bg-green-100 text-green-800"
    ];
    
    // Simple hash function to consistently map a string to a number
    const hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    // Use the hash to pick a color from our options
    const colorIndex = hashString(tag) % colorOptions.length;
    return colorOptions[colorIndex];
  };
  
  // Dynamic mood emoji mapping
  const getMoodEmoji = (mood: MoodType): string => {
    // Default mood emojis
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
    
    // Additional custom moods
    const customMoodEmojis: Record<string, string> = {
      focused: "🎯",
      creative: "🎨",
      confused: "😕",
      nostalgic: "🕰️",
      optimistic: "🌟"
    };
    
    // Combine both maps
    const allMoodEmojis = { ...defaultMoodEmojis, ...customMoodEmojis };
    
    // Return the emoji if it exists, or a default emoji
    return allMoodEmojis[mood] || "😐";
  };
  
  // Toggle expanded sections
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Handle sort option change
  const handleSortChange = (option: SortOption) => {
    if (onSortChange) {
      onSortChange(option);
    }
  };
  
  return (
    <div className="relative" ref={filtersRef}>
      {/* Main Filter Trigger Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
            activeFilterCount > 0 
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <IconFilter className="w-4 h-4" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
          <IconChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Sort Options Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 text-sm transition-colors">
            <IconArrowsSort className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Sort by:</span>
            <span className="font-medium text-amber-600">
              {currentSort === 'newest' && 'Newest first'}
              {currentSort === 'oldest' && 'Oldest first'}
              {currentSort === 'alphabetical' && 'A to Z'}
              {currentSort === 'recently-updated' && 'Recently updated'}
            </span>
            <IconChevronDown className="w-4 h-4" />
          </button>
          
          <div className="absolute right-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-zinc-200 z-10 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <div className="space-y-1">
              <button
                onClick={() => handleSortChange('newest')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left text-sm ${
                  currentSort === 'newest' ? 'bg-amber-100 text-amber-800' : 'hover:bg-zinc-100'
                }`}
              >
                <IconSortDescending className="w-4 h-4" />
                <span>Newest first</span>
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left text-sm ${
                  currentSort === 'oldest' ? 'bg-amber-100 text-amber-800' : 'hover:bg-zinc-100'
                }`}
              >
                <IconSortAscending className="w-4 h-4" />
                <span>Oldest first</span>
              </button>
              <button
                onClick={() => handleSortChange('alphabetical')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left text-sm ${
                  currentSort === 'alphabetical' ? 'bg-amber-100 text-amber-800' : 'hover:bg-zinc-100'
                }`}
              >
                <IconHash className="w-4 h-4" />
                <span>Alphabetical</span>
              </button>
              <button
                onClick={() => handleSortChange('recently-updated')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left text-sm ${
                  currentSort === 'recently-updated' ? 'bg-amber-100 text-amber-800' : 'hover:bg-zinc-100'
                }`}
              >
                <IconCalendar className="w-4 h-4" />
                <span>Recently updated</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute left-0 right-0 mt-1 p-4 bg-white rounded-xl shadow-lg border border-zinc-200 z-20 transition-all duration-300 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-zinc-900">
              Filter Notes
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompact(!isCompact)}
                className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
                title={isCompact ? "Expand view" : "Compact view"}
              >
                {isCompact ? <IconWindowMaximize className="w-4 h-4" /> : <IconWindowMinimize className="w-4 h-4" />}
              </button>
              <button
                onClick={onReset}
                className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                Reset all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>
          

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tags Section */}
            <div className={`bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden ${isCompact ? 'h-auto' : ''}`}>
              <button
                onClick={() => toggleSection('tags')}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconHash className="w-4 h-4" />
                  <span className="font-medium">Tags</span>
                  {filterTag !== 'all' && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      1 selected
                    </span>
                  )}
                </div>
                <IconChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'tags' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`px-4 py-3 transition-all duration-300 overflow-hidden ${
                expandedSection === 'tags' || !isCompact ? 'max-h-64' : 'max-h-0 py-0'
              }`}>
                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => onFilterChange('tag', 'all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                      filterTag === 'all' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                    } transition-colors`}
                  >
                    <span>All notes</span>
                    <span className="text-xs opacity-75">({notesCount.total})</span>
                  </button>
                  
                  {uniqueTags.filter(tag => tag !== 'all').map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onFilterChange('tag', tag)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                        filterTag === tag 
                          ? generateTagColor(tag)
                          : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                      } transition-colors`}
                    >
                      <span>#{tag}</span>
                      <span className="text-xs opacity-75">({notesCount.byTag[tag] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Moods Section */}
            <div className={`bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden ${isCompact ? 'h-auto' : ''}`}>
              <button
                onClick={() => toggleSection('moods')}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconMoodSmile className="w-4 h-4" />
                  <span className="font-medium">Moods</span>
                </div>
                <IconChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'moods' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`px-4 py-3 transition-all duration-300 overflow-hidden ${
                expandedSection === 'moods' || !isCompact ? 'max-h-64' : 'max-h-0 py-0'
              }`}>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                  {availableMoods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => onFilterChange('mood', mood)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-zinc-200 hover:border-amber-200 hover:bg-amber-50 transition-colors text-sm"
                    >
                      <span className="text-lg">{getMoodEmoji(mood)}</span>
                      <span className="capitalize">{mood}</span>
                      <span className="text-xs text-zinc-500 ml-auto">({notesCount.byMood[mood] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Date Range Section */}
            <div className={`bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden ${isCompact ? 'h-auto' : ''}`}>
              <button
                onClick={() => toggleSection('dateRange')}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconCalendar className="w-4 h-4" />
                  <span className="font-medium">Date Range</span>
                  {(dateRange.from || dateRange.to) && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <IconChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'dateRange' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`px-4 py-3 transition-all duration-300 overflow-hidden ${
                expandedSection === 'dateRange' || !isCompact ? 'max-h-64' : 'max-h-0 py-0'
              }`}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">From:</label>
                    <input
                      type="date"
                      value={dateRange.from || ''}
                      onChange={(e) => {
                        setDateRange(prev => ({ ...prev, from: e.target.value }));
                        // You can call a callback to filter notes based on date range
                      }}
                      className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">To:</label>
                    <input
                      type="date"
                      value={dateRange.to || ''}
                      onChange={(e) => {
                        setDateRange(prev => ({ ...prev, to: e.target.value }));
                        // You can call a callback to filter notes based on date range
                      }}
                      className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>
                
                {/* Preset date filters */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      // Set date range for today
                      const today = new Date().toISOString().split('T')[0];
                      setDateRange({ from: today, to: today });
                    }}
                    className="px-2.5 py-1 text-xs bg-zinc-200 hover:bg-zinc-300 rounded-md transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      // Set date range for this week
                      const today = new Date();
                      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
                      const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                      setDateRange({
                        from: firstDay.toISOString().split('T')[0],
                        to: lastDay.toISOString().split('T')[0]
                      });
                    }}
                    className="px-2.5 py-1 text-xs bg-zinc-200 hover:bg-zinc-300 rounded-md transition-colors"
                  >
                    This week
                  </button>
                  <button
                    onClick={() => {
                      // Set date range for this month
                      const date = new Date();
                      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                      setDateRange({
                        from: firstDay.toISOString().split('T')[0],
                        to: lastDay.toISOString().split('T')[0]
                      });
                    }}
                    className="px-2.5 py-1 text-xs bg-zinc-200 hover:bg-zinc-300 rounded-md transition-colors"
                  >
                    This month
                  </button>
                  <button
                    onClick={() => setDateRange({})}
                    className="px-2.5 py-1 text-xs bg-zinc-200 hover:bg-zinc-300 rounded-md transition-colors"
                  >
                    Clear dates
                  </button>
                </div>
              </div>
            </div>
            
            {/* Additional Options */}
            <div className={`bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden ${isCompact ? 'h-auto' : ''}`}>
              <button
                onClick={() => toggleSection('moreOptions')}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconChevronsRight className="w-4 h-4" />
                  <span className="font-medium">More Options</span>
                </div>
                <IconChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'moreOptions' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`px-4 py-3 transition-all duration-300 overflow-hidden ${
                expandedSection === 'moreOptions' || !isCompact ? 'max-h-64' : 'max-h-0 py-0'
              }`}>
                <div className="space-y-2">
                  <button
                    onClick={() => onFilterChange('starred', 'true')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-amber-50 border border-zinc-200 hover:border-amber-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <IconStar className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">Show starred notes only</span>
                    </div>
                    <IconCircleCheck className="w-4 h-4 text-amber-500 opacity-0 hover:opacity-100" />
                  </button>
                  
                  <button
                    onClick={() => onFilterChange('untagged', 'true')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-amber-50 border border-zinc-200 hover:border-amber-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <IconHash className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm">Show untagged notes</span>
                    </div>
                    <IconCircleCheck className="w-4 h-4 text-amber-500 opacity-0 hover:opacity-100" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-amber-800">Active Filters</h4>
                <button
                  onClick={onReset}
                  className="text-xs text-amber-600 hover:text-amber-800 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filterTag !== 'all' && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-amber-200 text-xs">
                    <span>Tag: #{filterTag}</span>
                    <button
                      onClick={() => onFilterChange('tag', 'all')}
                      className="text-amber-500 hover:text-amber-700"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {(dateRange.from || dateRange.to) && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-amber-200 text-xs">
                    <span>
                      Date: {dateRange.from ? new Date(dateRange.from).toLocaleDateString() : 'Any'} 
                      {' to '} 
                      {dateRange.to ? new Date(dateRange.to).toLocaleDateString() : 'Any'}
                    </span>
                    <button
                      onClick={() => setDateRange({})}
                      className="text-amber-500 hover:text-amber-700"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Result Count */}
          <div className="mt-4 text-sm text-zinc-500 flex justify-between items-center">
            <div>
              <span className="font-medium text-zinc-700">{notesCount.filtered}</span> of {notesCount.total} notes match your filters
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}