import { getApiUrl } from "@/lib/api-url";

export class ApiError extends Error {
    status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
      this.name = "ApiError";
    }
  }
  
  // --- API Response Handler ---
export const handleResponse = async (response: Response) => {
    if (!response.ok) {
      // Try to parse the error, but provide a fallback
      const errorData = await response.json().catch(() => ({ error: "An unknown API error occurred" }));
      throw new ApiError(errorData.error || "Failed to handle API response", response.status);
    }
  
    return response.json();
};
  

// --- 1. Define Interfaces ---

export interface SubscriptionDetails {
  planName: string;
  status: string | null;
  currentPeriodEnd: string;
  priceId: string;
}

export interface SubscriptionStatusResponse {
  tokenBalance: number;
  subscription: SubscriptionDetails | null;
}

export interface CancelSubscriptionResponse {
    message: string;
    canceledAt: string;
}

export const getSubscriptionStatus = async (token: string): Promise<SubscriptionStatusResponse> => {
  try {
    const response = await fetch(getApiUrl(`subscription/status`), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    throw error;
  }
};

export const cancelSubscription = async (token: string): Promise<CancelSubscriptionResponse> => {
    try {
      const response = await fetch(getApiUrl(`subscription/cancel`), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  };
