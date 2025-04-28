"use client";

import { Header } from "@/components/dynamic-header";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  IconArrowLeft,
  IconSend,
  IconUser,
  IconStar,
  IconShare,
  IconDotsVertical,
  IconMask,
  IconRefresh,
} from "@tabler/icons-react";

// Sample anonymous chat data
const sampleChat = {
  id: "chat-1",
  title: "Anonymous Chat #4281",
  date: "Today, 2:30 PM",
  starred: false,
  messages: [
    {
      id: "msg-1",
      type: "stranger",
      content: "Hi there! Looking for someone to chat with about photography. Anyone here interested in that?",
      timestamp: "2:30 PM"
    },
    {
      id: "msg-2",
      type: "you",
      content: "Hey! I'm into photography as well. Mostly landscape and street photography. What about you?",
      timestamp: "2:31 PM"
    },
    {
      id: "msg-3",
      type: "stranger",
      content: "That's awesome! I'm more into portrait photography but I've been wanting to try landscapes. What camera do you use?",
      timestamp: "2:33 PM"
    },
    {
      id: "msg-4",
      type: "you",
      content: "I use a Sony Alpha a7III. It's great for both landscapes and low-light situations. Have you been doing portrait photography for long?",
      timestamp: "2:35 PM"
    },
    {
      id: "msg-5",
      type: "stranger",
      content: "About 3 years now. Started as a hobby but now I occasionally do paid gigs for friends and family. The Sony Alpha series is great! I'm using a Canon EOS R6 myself.",
      timestamp: "2:38 PM"
    },
  ]
};

export default function AnonymousChatPage() {
  const [messages, setMessages] = useState(sampleChat.messages);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatInfo, setChatInfo] = useState(sampleChat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    
    // Add user message
    const newUserMessage = {
      id: `msg-${messages.length + 1}`,
      type: "you",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    
    // Simulate stranger typing response after a random delay
    if (Math.random() > 0.3) { // 70% chance the stranger responds
      setIsConnecting(true);
      
      // Random typing delay between 2-5 seconds
      const typingDelay = Math.floor(Math.random() * 3000) + 2000;
      
      setTimeout(() => {
        // Example stranger responses - in a real app, this would be from another user
        const strangerResponses = [
          "That's interesting! Tell me more about that.",
          "I've had similar experiences. It's nice to connect with someone who understands.",
          "I've never thought about it that way before. Thanks for sharing your perspective!",
          "Wow, that's pretty cool. Have you been interested in this for long?",
          "I agree with you. I think a lot of people overlook that aspect.",
          "Interesting! I have a slightly different take on that, but I see your point.",
          "That reminds me of something I read recently. Have you heard about that new development in this area?",
          "I'm fairly new to this topic. Any resources you'd recommend for someone just getting started?",
          "Haha, that's exactly how I feel about it too!",
          "That's a unique approach. How did you come up with that idea?"
        ];
        
        // Pick a random response
        const randomResponse = strangerResponses[Math.floor(Math.random() * strangerResponses.length)];
        
        const strangerResponse = {
          id: `msg-${messages.length + 2}`,
          type: "stranger",
          content: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, strangerResponse]);
        setIsConnecting(false);
      }, typingDelay);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleStar = () => {
    setChatInfo(prev => ({
      ...prev,
      starred: !prev.starred
    }));
  };
  
  const findNewStranger = () => {
    setIsConnecting(true);
    setMessages([]);
    
    // Simulate connecting to a new stranger
    setTimeout(() => {
      const systemMessage = {
        id: "system-1",
        type: "system",
        content: "Connected to a new person! Say hello to start the conversation.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([systemMessage]);
      setIsConnecting(false);
      
      // Update chat ID and title
      const newChatId = Math.floor(Math.random() * 9000) + 1000;
      setChatInfo(prev => ({
        ...prev,
        id: `chat-${Date.now()}`,
        title: `Anonymous Chat #${newChatId}`,
        date: "Just now"
      }));
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-18px)]">
      <Header>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/sayit" className="mr-3 flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-700">
              <IconArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2">
                <IconMask className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-medium text-zinc-900 text-sm md:text-base">{chatInfo.title}</h1>
                <p className="text-xs text-zinc-500">{chatInfo.date}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              className={`p-2 rounded-full ${chatInfo.starred ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-900'}`}
              onClick={toggleStar}
            >
              <IconStar className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full text-zinc-500 hover:text-zinc-900">
              <IconShare className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full text-zinc-500 hover:text-zinc-900">
              <IconDotsVertical className="w-5 h-5" />
            </button>
            <button 
              onClick={findNewStranger}
              className="mr-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors shadow-sm whitespace-nowrap"
            >
              <IconRefresh className="w-4 h-4" />
              <span>New Stranger</span>
            </button>
          </div>
        </div>
      </Header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${
                message.type === 'you' 
                  ? 'justify-end' 
                  : message.type === 'system' 
                    ? 'justify-center' 
                    : 'justify-start'
              }`}
            >
              {message.type === 'system' ? (
                <div className="bg-zinc-100 rounded-full px-4 py-2 text-xs text-zinc-600">
                  {message.content}
                </div>
              ) : (
                <div className={`flex items-start max-w-3xl ${message.type === 'you' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'you' 
                      ? 'bg-blue-600 text-white ml-3' 
                      : 'bg-purple-600 text-white mr-3'
                  }`}>
                    {message.type === 'you' 
                      ? <IconUser className="w-4 h-4" /> 
                      :               <IconMask className="w-4 h-4" />
                    }
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'you' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-zinc-200'
                  }`}>
                    <div className={`whitespace-pre-wrap text-sm ${
                      message.type === 'you' ? 'text-white' : 'text-zinc-800'
                    }`}>
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 text-right ${
                      message.type === 'you' ? 'text-blue-200' : 'text-zinc-400'
                    }`}>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isConnecting && (
            <div className="flex justify-center">
              <div className="bg-zinc-100 rounded-full px-4 py-2 text-xs text-zinc-600 flex items-center">
                <div className="flex space-x-2 mr-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                Connecting...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 bg-transparent py-3 px-4">
        <div className="max-w-3xl mx-auto bg-white">
          <div className="flex items-center border border-zinc-200 rounded-lg shadow-lg focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-transparent">
            <textarea
              ref={textareaRef}
              className="flex-1 py-3 px-4 outline-none resize-none text-sm"
              placeholder="Type a message..."
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isConnecting || messages.length === 0}
            />
            <div className="flex items-center p-2 space-x-1">
              <button 
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === "" || isConnecting || messages.length === 0}
                className={`p-2 rounded-full ${
                  inputMessage.trim() === "" || isConnecting || messages.length === 0
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