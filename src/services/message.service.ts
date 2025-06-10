import { getApiUrl } from '@/lib/api-url';

// Message type definition
export interface Message {
  id: string;
  chatId: string;
  type: 'user' | 'ai';
  content: string;
  createdAt: string;
  timestamp?: string;
}

// Chat info type definition
export interface ChatInfo {
  id: string;
  userId: string;
  title: string;
  preview: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  starred: boolean;
  deletedAt: string | null;
  date?: string;
}

export interface ChatResponse {
  chat: ChatInfo;
  messages: Message[];
}

// Diperbarui untuk mendukung respon dengan newTitle
export interface MessageResponse {
  userMessage: Message;
  aiMessage: Message;
  newTokenBalance: number; // <-- Tambahkan properti ini
  costDetails: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
  chatUpdated?: boolean; // Opsional
  newTitle?: string;     // Opsional
}

export const fetchChatDetails = async (chatId: string, token: string): Promise<ChatResponse> => {
  const response = await fetch(getApiUrl(`ai-chat/${chatId}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat details');
  }

  return await response.json();
};

export const createNewChat = async (title: string, token: string): Promise<ChatInfo> => {
  const response = await fetch(getApiUrl('ai-chat'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title || 'Percakapan Baru', // Default judul jika tidak ada
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create new chat');
  }

  return await response.json();
};

export const toggleChatStar = async (chatId: string, isStarred: boolean, token: string): Promise<ChatInfo> => {
  const response = await fetch(getApiUrl(`ai-chat/${chatId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      starred: !isStarred,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update star status');
  }

  return await response.json();
};

export const updateChatTitle = async (chatId: string, title: string, token: string): Promise<ChatInfo> => {
  const response = await fetch(getApiUrl(`ai-chat/${chatId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update chat title');
  }

  return await response.json();
};

export const sendMessage = async (chatId: string, content: string, token: string): Promise<MessageResponse> => {
  const response = await fetch(getApiUrl(`ai-chat/${chatId}/message`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return await response.json();
};

export const deleteChat = async (chatId: string, token: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(getApiUrl(`ai-chat/${chatId}`), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete chat');
  }

  return await response.json();
};