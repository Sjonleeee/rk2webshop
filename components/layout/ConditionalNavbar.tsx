"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on homepage
  if (pathname === "/") {
    return null;
  }

  return <Navbar />;
}
