
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type HeaderContextType = {
  headerContent: ReactNode;
  setHeaderContent: (content: ReactNode) => void;
};

const HeaderContext = createContext<HeaderContextType | null>(null);

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);

  return (
    <HeaderContext.Provider value={{ headerContent, setHeaderContent }}>
      {children}
    </HeaderContext.Provider>
  );
}
