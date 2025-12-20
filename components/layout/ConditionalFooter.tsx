"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on homepage
  if (pathname === "/") {
    return null;
  }
  
  return <Footer />;
}

