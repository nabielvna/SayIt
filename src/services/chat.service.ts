import { getApiUrl } from "@/lib/api-url";

// Define types
export interface Chat {
  id: string;
  title: string;
  preview: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  deletedAt: string | null;
}

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new ApiError(errorText, response.status);
  }
  
  return response.json();
};

// Fetch all chats
export const fetchChats = async (token: string): Promise<Chat[]> => {
  try {
    const response = await fetch(getApiUrl(`chat`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

// Toggle star status for a chat
export const toggleChatStar = async (
  chatId: string, 
  isStarred: boolean, 
  token: string
): Promise<void> => {
  try {
    const response = await fetch(getApiUrl(`chat/${chatId}`), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ starred: !isStarred })
    });
    
    await handleResponse(response);
  } catch (error) {
    console.error("Error updating star status:", error);
    throw error;
  }
};

// Delete a chat
export const deleteChat = async (
  chatId: string, 
  token: string
): Promise<void> => {
  try {
    const response = await fetch(getApiUrl(`chat/${chatId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    await handleResponse(response);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};