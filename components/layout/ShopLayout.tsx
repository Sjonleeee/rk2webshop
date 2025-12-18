import Navbar from "./navbar/Navbar";
import CategorySidebar from "@/components/product/CategorySidebar";
import React from "react";

interface ShopLayoutProps {
  categories: string[];
  setHoveredCategory: (cat: string | null) => void;
  children: React.ReactNode;
}

export default function ShopLayout({
  categories,
  setHoveredCategory,
  children,
}: ShopLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden sm:block">
          <CategorySidebar
            categories={categories}
            setHoveredCategory={setHoveredCategory}
          />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
