import { create } from "zustand";
import { getSubscriptionStatus } from "@/services/subscription.service";

// Definisikan bentuk state kita
interface TokenState {
  tokenBalance: number | null;
  isLoading: boolean;
  // Fungsi untuk mengambil saldo token dari API
  fetchTokenBalance: (getToken: () => Promise<string | null>) => Promise<void>;
  // Fungsi untuk meng-update saldo secara manual dari komponen lain
  setTokenBalance: (newBalance: number) => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  tokenBalance: null,
  isLoading: true,

  // Aksi untuk meng-update saldo secara langsung
  setTokenBalance: (newBalance) => {
    set({ tokenBalance: newBalance });
  },

  // Aksi untuk mengambil data awal dari API
  fetchTokenBalance: async (getToken) => {
    set({ isLoading: true });
    try {
      const authToken = await getToken();
      if (!authToken) {
        set({ isLoading: false, tokenBalance: 0 }); // Anggap 0 jika tidak login
        return;
      }
      const statusResult = await getSubscriptionStatus(authToken);
      set({ tokenBalance: statusResult.tokenBalance, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch token balance for store:", error);
      set({ tokenBalance: 0, isLoading: false }); // Gagal fetch, set ke 0
    }
  },
}));