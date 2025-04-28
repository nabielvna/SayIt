// components/Header.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useHeader } from "@/components/header-context";

export function Header({ children }: { children: ReactNode }) {
  const { setHeaderContent } = useHeader();

  useEffect(() => {
    setHeaderContent(children);
  }, [children, setHeaderContent]);

  return null;
}
