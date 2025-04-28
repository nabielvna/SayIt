import { useAuth } from "@clerk/nextjs";

export const useAuthToken = () => {
  const { getToken } = useAuth();
  
  /**
   * Gets the auth token from Clerk
   * @returns A promise that resolves to the auth token string
   */
  const getAuthToken = async (): Promise<string | null> => {
    try {
      // Get the JWT token from Clerk
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  };

  return { getAuthToken };
};