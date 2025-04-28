"use client";

import { Header } from "@/components/dynamic-header";
import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconUser,
  IconCalendarEvent,
  IconNotebook,
  IconRobot,
  IconUserHeart,
  IconFilter,
  IconChevronRight,
  IconClock,
  IconActivity,
  IconMask,
  IconStar,
  IconTrash
} from "@tabler/icons-react";

// Define types
type ActivityType = 
  | 'chat'        // Anonymous chat
  | 'ai_chat'     // AI chat
  | 'note'        // Note created/edited
  | 'professional' // Professional consultation
  | 'login'       // Login activity
  | 'settings'    // Settings changed
  | 'starred'     // Item starred
  | 'deleted';    // Item deleted

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  relatedId?: string;
  relatedTitle?: string;
  isNew?: boolean;
}

// Sample activities data
const activitiesData: Activity[] = [
  {
    id: "act-1",
    type: "chat",
    title: "Anonymous chat started",
    description: "Started a new anonymous conversation with Anonymous #4291",
    timestamp: new Date(2025, 3, 22, 15, 45), // Apr 22, 2025, 3:45 PM
    relatedId: "anon-1",
    relatedTitle: "Conversation with Anonymous #4291",
    isNew: true
  },
  {
    id: "act-2",
    type: "note",
    title: "Note created",
    description: "Created a new note: 'Reflections on today's events'",
    timestamp: new Date(2025, 3, 22, 14, 30), // Apr 22, 2025, 2:30 PM
    relatedId: "note-1",
    relatedTitle: "Reflections on today's events",
    isNew: true
  },
  {
    id: "act-3",
    type: "ai_chat",
    title: "AI conversation",
    description: "Talked with Sayit about sleep quality improvement",
    timestamp: new Date(2025, 3, 22, 12, 15), // Apr 22, 2025, 12:15 PM
    relatedId: "chat-1",
    relatedTitle: "How to improve sleep quality",
    isNew: true
  },
  {
    id: "act-4",
    type: "professional",
    title: "Appointment scheduled",
    description: "Booked a session with Dr. Rahma Wijaya for April 24th, 4:30 PM",
    timestamp: new Date(2025, 3, 22, 11, 0), // Apr 22, 2025, 11:00 AM
    relatedId: "prof-1",
    relatedTitle: "Appointment with Dr. Rahma Wijaya",
    isNew: true
  },
  {
    id: "act-5",
    type: "chat",
    title: "Anonymous chat ended",
    description: "Ended conversation with Anonymous #9058",
    timestamp: new Date(2025, 3, 21, 19, 30), // Apr 21, 2025, 7:30 PM
    relatedId: "anon-3",
    relatedTitle: "Conversation with Anonymous #9058"
  },
  {
    id: "act-6",
    type: "note",
    title: "Note edited",
    description: "Edited note: 'Goals for the upcoming month'",
    timestamp: new Date(2025, 3, 21, 11, 20), // Apr 21, 2025, 11:20 AM
    relatedId: "note-2",
    relatedTitle: "Goals for the upcoming month"
  },
  {
    id: "act-7",
    type: "starred",
    title: "Chat starred",
    description: "Starred the anonymous chat with Anonymous #6372",
    timestamp: new Date(2025, 3, 21, 10, 0), // Apr 21, 2025, 10:00 AM
    relatedId: "anon-4",
    relatedTitle: "Conversation with Anonymous #6372"
  },
  {
    id: "act-8",
    type: "ai_chat",
    title: "AI conversation",
    description: "Talked with Sayit about recipe recommendations",
    timestamp: new Date(2025, 3, 21, 9, 45), // Apr 21, 2025, 9:45 AM
    relatedId: "chat-2",
    relatedTitle: "Recipe recommendations"
  },
  {
    id: "act-9",
    type: "login",
    title: "Account login",
    description: "Logged in from a new device in Jakarta, Indonesia",
    timestamp: new Date(2025, 3, 20, 8, 0), // Apr 20, 2025, 8:00 AM
  },
  {
    id: "act-10",
    type: "settings",
    title: "Settings updated",
    description: "Changed notification preferences",
    timestamp: new Date(2025, 3, 19, 21, 15), // Apr 19, 2025, 9:15 PM
  },
  {
    id: "act-11",
    type: "note",
    title: "Note created",
    description: "Created a new note: 'Book notes: Atomic Habits'",
    timestamp: new Date(2025, 3, 19, 16, 30), // Apr 19, 2025, 4:30 PM
    relatedId: "note-3",
    relatedTitle: "Book notes: 'Atomic Habits'"
  },
  {
    id: "act-12",
    type: "deleted",
    title: "Chat deleted",
    description: "Deleted an anonymous chat history",
    timestamp: new Date(2025, 3, 18, 14, 0), // Apr 18, 2025, 2:00 PM
  }
];

// Function to format date
const formatDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if date is today
  if (date >= today) {
    return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Check if date is yesterday
  if (date >= yesterday) {
    return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Otherwise return date and time
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Group activities by date
const groupActivitiesByDate = (activities: Activity[]): { [key: string]: Activity[] } => {
  const grouped: { [key: string]: Activity[] } = {};
  
  activities.forEach(activity => {
    const date = activity.timestamp.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!grouped[date]) {
      grouped[date] = [];
    }
    
    grouped[date].push(activity);
  });
  
  return grouped;
};

// Get activity icon and color
const getActivityIconInfo = (type: ActivityType): { icon: React.ElementType; color: string; bgColor: string } => {
  switch (type) {
    case 'chat':
      return { 
        icon: IconMask, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-100' 
      };
    case 'ai_chat':
      return { 
        icon: IconRobot, 
        color: 'text-zinc-800', 
        bgColor: 'bg-zinc-100' 
      };
    case 'note':
      return { 
        icon: IconNotebook, 
        color: 'text-amber-600', 
        bgColor: 'bg-amber-100' 
      };
    case 'professional':
      return { 
        icon: IconUserHeart, 
        color: 'text-emerald-600', 
        bgColor: 'bg-emerald-100' 
      };
    case 'login':
      return { 
        icon: IconUser, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100' 
      };
    case 'settings':
      return { 
        icon: IconActivity, 
        color: 'text-indigo-600', 
        bgColor: 'bg-indigo-100' 
      };
    case 'starred':
      return { 
        icon: IconStar, 
        color: 'text-amber-500', 
        bgColor: 'bg-amber-100' 
      };
    case 'deleted':
      return { 
        icon: IconTrash, 
        color: 'text-red-600', 
        bgColor: 'bg-red-100' 
      };
    default:
      return { 
        icon: IconActivity, 
        color: 'text-zinc-600', 
        bgColor: 'bg-zinc-100' 
      };
  }
};

// Function to get activity link
const getActivityLink = (activity: Activity): string => {
  if (!activity.relatedId) return '#';
  
  switch (activity.type) {
    case 'chat':
      return `/anonymous/chat/${activity.relatedId}`;
    case 'ai_chat':
      return `/chat/${activity.relatedId}`;
    case 'note':
      return `/notes/${activity.relatedId}`;
    case 'professional':
      return `/professional/appointments/${activity.relatedId}`;
    default:
      return '#';
  }
};

export default function RecentActivityPage() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([
    'chat', 'ai_chat', 'note', 'professional', 'login', 'settings', 'starred', 'deleted'
  ]);
  
  // Toggle activity type filter
  const toggleActivityType = (type: ActivityType) => {
    if (activityTypes.includes(type)) {
      setActivityTypes(activityTypes.filter(t => t !== type));
    } else {
      setActivityTypes([...activityTypes, type]);
    }
  };
  
  // Filter activities by selected types
  const filteredActivities = activitiesData.filter(activity => 
    activityTypes.includes(activity.type)
  );
  
  // Group activities by date
  const groupedActivities = groupActivitiesByDate(filteredActivities);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-18px)]">
      <Header>
        Activity
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
                Recent Activity
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Track your actions and interactions across the platform
              </p>
            </div>
          </div>

          {/* Filter options */}
          <div className="flex items-center overflow-x-auto py-2 no-scrollbar">
            <div className="flex items-center text-sm text-zinc-500 mr-3">
              <IconFilter className="w-4 h-4 mr-1" />
              <span>Filter:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleActivityType('chat')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('chat') 
                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconMask className="w-3.5 h-3.5 mr-1.5" />
                Anonymous Chats
              </button>
              
              <button
                onClick={() => toggleActivityType('ai_chat')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('ai_chat') 
                    ? 'bg-zinc-800 text-white border border-zinc-700' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconRobot className="w-3.5 h-3.5 mr-1.5" />
                AI Chats
              </button>
              
              <button
                onClick={() => toggleActivityType('note')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('note') 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconNotebook className="w-3.5 h-3.5 mr-1.5" />
                Notes
              </button>
              
              <button
                onClick={() => toggleActivityType('professional')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('professional') 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconUserHeart className="w-3.5 h-3.5 mr-1.5" />
                Professional
              </button>
              
              <button
                onClick={() => toggleActivityType('login')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('login') 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconUser className="w-3.5 h-3.5 mr-1.5" />
                Logins
              </button>
              
              <button
                onClick={() => toggleActivityType('settings')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('settings') 
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconActivity className="w-3.5 h-3.5 mr-1.5" />
                Settings
              </button>
              
              <button
                onClick={() => toggleActivityType('starred')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('starred') 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconStar className="w-3.5 h-3.5 mr-1.5" />
                Starred
              </button>
              
              <button
                onClick={() => toggleActivityType('deleted')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
                  ${activityTypes.includes('deleted') 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
              >
                <IconTrash className="w-3.5 h-3.5 mr-1.5" />
                Deleted
              </button>
            </div>
          </div>
        </div>

        {/* Activities list */}
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-200 text-center">
            <IconActivity className="w-16 h-16 text-zinc-300 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-zinc-900">No activities found</h3>
            <p className="text-sm text-zinc-500 max-w-md mb-4">
              Try selecting different activity types using the filters above
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date}>
                <h2 className="text-sm font-medium text-zinc-500 mb-3 flex items-center">
                  <IconCalendarEvent className="w-4 h-4 mr-2" />
                  {date}
                </h2>
                
                <div className="space-y-3">
                  {groupedActivities[date].map(activity => {
                    const { icon: ActivityIcon, color, bgColor } = getActivityIconInfo(activity.type);
                    const activityLink = getActivityLink(activity);
                    
                    return (
                      <div 
                        key={activity.id}
                        className={`relative bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all duration-200
                          ${activity.isNew ? 'ring-2 ring-blue-500/20' : ''}
                        `}
                      >
                        {activity.isNew && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            New
                          </div>
                        )}
                        
                        <Link href={activityLink} className="p-4 block">
                          <div className="flex items-start">
                            <div className="shrink-0">
                              <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center ${color}`}>
                                <ActivityIcon className="w-5 h-5" />
                              </div>
                            </div>
                            
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h3 className="text-base font-medium text-zinc-900 truncate mr-2">
                                  {activity.title}
                                </h3>
                                
                                <div className="flex items-center shrink-0">
                                  <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                                    {formatDate(activity.timestamp)}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-zinc-700 mt-1">
                                {activity.description}
                              </p>
                              
                              {activity.relatedId && (
                                <div className="flex items-center mt-3 pt-2 border-t border-zinc-100 justify-between">
                                  <div className="flex items-center">
                                    <IconClock className="w-3.5 h-3.5 text-zinc-400 mr-1.5" />
                                    <span className="text-xs text-zinc-500">
                                      {formatDate(activity.timestamp)}
                                    </span>
                                  </div>
                                  
                                  <span className="text-xs text-zinc-900 font-medium hover:underline flex items-center">
                                    View details <IconChevronRight className="w-3 h-3 ml-1" />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}