'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

// Icons
import { 
  ArrowLeft as IconArrowLeft,
  Bot as IconRobot,
  Star as IconStar,
  MoreVertical as IconDotsVertical,
  MessageCircle as IconMessageCircle,
  User as IconUser,
  Send as IconSend
} from 'lucide-react';
import { Header } from '@/components/dynamic-header';
import {
  Message,
  ChatInfo,
  fetchChatDetails,
  createNewChat,
  toggleChatStar,
  sendMessage,
  MessageResponse
} from '@/services/message.service';

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const isNewChat = chatId === 'new-chat';
  
  const { userId, getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [chatInfo, setChatInfo] = useState<ChatInfo>({
    id: isNewChat ? '' : chatId,
    userId: '',
    title: isNewChat ? 'New Chat' : 'Loading...',
    preview: null,
    createdAt: null,
    updatedAt: null,
    starred: false,
    deletedAt: null,
    date: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch chat details on load (only if not new chat)
  useEffect(() => {
    if (!userId || isNewChat) return;

    const loadChatDetails = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        
        const data = await fetchChatDetails(chatId, token);
        
        // Format the chat info
        const chatData = {
          ...data.chat,
          date: data.chat.createdAt 
            ? `Created ${formatDistanceToNow(new Date(data.chat.createdAt), { addSuffix: true })}` 
            : '',
        };
        
        setChatInfo(chatData);
        
        // Format messages with timestamps
        const formattedMessages = data.messages.map((msg: Message) => ({
          ...msg,
          timestamp: msg.createdAt 
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    };

    loadChatDetails();
  }, [userId, chatId, getToken, isNewChat]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle star status
  const handleToggleStar = async () => {
    if (isNewChat) return; // Don't allow starring a new chat
    
    try {
      const token = await getToken();
      if (!token) return;
      
      const updatedChat = await toggleChatStar(chatInfo.id, chatInfo.starred, token);
      setChatInfo(prev => ({ ...prev, starred: updatedChat.starred }));
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Process received messages from API
  const processMessages = (data: MessageResponse): { userMessage: Message, aiMessage: Message } => {
    // Format timestamps for both messages
    const userMessage = {
      ...data.userMessage,
      timestamp: new Date(data.userMessage.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
    
    const aiMessage = {
      ...data.aiMessage,
      timestamp: new Date(data.aiMessage.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    // Update chat title if this is the first message and AI generated a title
    if (data.chatUpdated && data.newTitle) {
      setChatInfo(prev => ({ 
        ...prev, 
        title: data.newTitle || prev.title // Gunakan judul lama jika newTitle undefined
      }));
    }

    return { userMessage, aiMessage };
  };

  // Send message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const currentMessage = inputMessage;
    setInputMessage(''); // Clear input immediately for better UX
    
    try {
      const token = await getToken();
      if (!token) return;
      
      let currentChatId = chatInfo.id;
      
      // If this is a new chat, create it first
      if (isNewChat) {
        // Create a temporary user message object for UI display before API response
        const tempUserMessage: Message = {
          id: 'temp-id-' + Date.now(),
          chatId: 'temp',
          type: 'user',
          content: currentMessage,
          createdAt: new Date().toISOString(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Add temporary user message to UI immediately
        setMessages(prev => [...prev, tempUserMessage]);
        
        // Set loading state
        setIsLoading(true);
        
        // Create new chat with a generic title (AI will update it)
        const newChat = await createNewChat('Percakapan Baru', token);
        currentChatId = newChat.id;
        
        // Update chat info
        setChatInfo(prev => ({ 
          ...prev, 
          id: currentChatId,
          title: 'Percakapan Baru' // Will be updated by AI
        }));
        
        // Change URL without page reload
        window.history.pushState({}, '', `/sayit/${currentChatId}`);
        
        // Now send the message to the chat
        const data = await sendMessage(currentChatId, currentMessage, token);
        
        // Process messages and update title if needed
        const { userMessage, aiMessage } = processMessages(data);
        
        // Replace the temporary message with the actual one and add AI response
        setMessages([userMessage, aiMessage]);
        
        // Navigate to the new chat page
        router.replace(`/sayit/${currentChatId}`);
      } else {
        // Create a temporary user message for existing chat
        const tempUserMessage: Message = {
          id: 'temp-id-' + Date.now(),
          chatId: currentChatId,
          type: 'user',
          content: currentMessage,
          createdAt: new Date().toISOString(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Add temporary user message to UI immediately
        setMessages(prev => [...prev, tempUserMessage]);
        
        // Set loading state
        setIsLoading(true);
        
        // Send the message to the existing chat
        const data = await sendMessage(currentChatId, currentMessage, token);
        
        // Process messages and update title if needed
        const { userMessage, aiMessage } = processMessages(data);
        
        // Replace the temporary message with the actual one and add AI response
        setMessages(prev => 
          prev.map(msg => msg.id === tempUserMessage.id ? userMessage : msg).concat(aiMessage)
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Keep the temporary message but add an error indicator if needed
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, show nothing until redirect happens
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-18px)]">
      <Header>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/sayit" className="mr-3 flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-700">
              <IconArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white mr-2">
                <IconRobot className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-medium text-zinc-900 text-sm md:text-base">{chatInfo.title}</h1>
                <p className="text-xs text-zinc-500">{isNewChat ? 'New conversation' : chatInfo.date}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {!isNewChat && (
              <button 
                className={`p-2 rounded-full ${chatInfo.starred ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-900'}`}
                onClick={handleToggleStar}
              >
                <IconStar className="w-5 h-5" />
              </button>
            )}
            {!isNewChat && (
              <button className="p-2 rounded-full text-zinc-500 hover:text-zinc-900">
                <IconDotsVertical className="w-5 h-5" />
              </button>
            )}
            <Link href="/new-chat" className="mr-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm transition-colors shadow-sm whitespace-nowrap">
              <IconMessageCircle className="w-4 h-4" />
              <span>New</span>
            </Link>
          </div>
        </div>
      </Header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {isNewChat && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-white mb-4">
                <IconRobot className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-medium text-zinc-900 mb-2">Mulai percakapan baru</h2>
              <p className="text-zinc-500 max-w-md mb-6">
                Kirim pesan pertama Anda untuk memulai percakapan dengan AI asisten.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white ml-3' 
                      : 'bg-zinc-900 text-white mr-3'
                  }`}>
                    {message.type === 'user' 
                      ? <IconUser className="w-4 h-4" /> 
                      : <IconRobot className="w-4 h-4" />
                    }
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-zinc-200'
                  }`}>
                    <div className={`whitespace-pre-wrap text-sm ${
                      message.type === 'user' ? 'text-white' : 'text-zinc-800'
                    }`}>
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 text-right ${
                      message.type === 'user' ? 'text-blue-200' : 'text-zinc-400'
                    }`}>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-3xl">
                <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white mr-3">
                  <IconRobot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white border border-zinc-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 bg-transparent py-3 px-4">
        <div className="max-w-3xl mx-auto bg-white">
          <div className="flex items-center border border-zinc-200 rounded-lg shadow-lg focus-within:ring-2 focus-within:ring-zinc-500/50 focus-within:border-transparent">
            <textarea
              ref={textareaRef}
              className="flex-1 py-3 px-4 outline-none resize-none text-sm"
              placeholder={isNewChat ? "Ketik pesan untuk memulai chat baru..." : "Ketik pesan..."}
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center p-2 space-x-1">
              <button 
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ""}
                className={`p-2 rounded-full ${
                  inputMessage.trim() === "" 
                    ? "text-zinc-300" 
                    : "text-zinc-900 hover:text-zinc-700"
                }`}
              >
                <IconSend className="w-5 h-5 p-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}