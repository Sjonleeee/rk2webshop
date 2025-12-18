"use client";
import React from "react";
import { CartProvider } from "@/components/providers/CartContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
