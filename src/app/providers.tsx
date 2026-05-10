"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
