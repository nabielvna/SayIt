import { getApiUrl } from "@/lib/api-url";

// --- 1. Define Interfaces ---
export interface Price {
  id: string;
  unitAmount: number | null;
  currency: string | null;
  interval: "day" | "week" | "month" | "year" | null;
}

export interface BillingPlan {
  id: string;
  name: string | null;
  description: string | null;
  tokens: number | null;
  features: string[] | null;
  isFeatured: boolean;
  prices: Price[];
}

export interface PaymentTokenResponse {
  token: string;
}

// — NEW: history item interface —
export interface BillingHistoryItem {
  id: string;
  userId: string;
  subscriptionId: string | null;
  priceId: string | null;
  createdAt: string;                    // ISO 8601 date-time
  amount: number;
  currency: string;
  status: string;
  invoicePdf: string | null;
  paymentProviderInvoiceId: string | null;
}

// --- 2. Custom Error Class ---
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// --- 3. API Response Handler ---
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "An unknown API error occurred" }));
    throw new ApiError(errorData.error, response.status);
  }

  return response.json();
};

// --- 4. Service Functions ---

/**
 * Fetches all active billing plans from the API.
 * Requires an authentication token.
 * @param token The user's authentication token (JWT).
 */
export const fetchBillingPlans = async (token: string): Promise<BillingPlan[]> => {
  try {
    const response = await fetch(getApiUrl(`billing/plans`), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching billing plans:", error);
    throw error;
  }
};

/**
 * Creates a payment transaction for a selected price ID.
 * Requires an authentication token.
 * @param priceId The ID of the price being purchased.
 * @param token The user's authentication token (JWT).
 * @returns An object containing the payment token from Midtrans.
 */
export const createPaymentTransaction = async (
  priceId: string,
  token: string,
): Promise<PaymentTokenResponse> => {
  try {
    const response = await fetch(getApiUrl(`payment/charge`), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    throw error;
  }
};

/**
 * Fetches the authenticated user's billing history.
 * Requires an authentication token.
 * @param token The user's authentication token (JWT).
 * @returns The list of billing-history records, sorted by most recent.
 */
export const fetchBillingHistory = async (
  token: string,
): Promise<BillingHistoryItem[]> => {
  const response = await fetch(getApiUrl(`billing/history`), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) {
    // No billing history yet → just return empty list
    return [];
  }

  // for any other non-OK status, handleResponse will throw
  return handleResponse(response);
};
