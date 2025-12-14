import React from "react";

interface CategorySidebarProps {
  categories: string[];
  hoveredCategory: string | null;
  setHoveredCategory: (cat: string | null) => void;
}

export default function CategorySidebar({
  categories,
  setHoveredCategory,
}: CategorySidebarProps) {
  return (
    <aside className="w-50 min-w-[180px] max-w-xs">
      <h2 className="text-lg font-semibold mb-6">Categories</h2>
      <nav className="flex flex-col group/category-menu">
        {/* Desktop: spans met hover, Mobiel: klikbare links */}
        <span
          key="all"
          className="hidden sm/block text-sm px-2 py-1 rounded transition-colors font-medium text-left group-hover/category-menu:text-gray-400 hover:text-[#2B3AE1] hover:font-bold cursor-pointer transition-all duration-200 hover:translate-x-4 hover:scale-110"
          onMouseEnter={() => setHoveredCategory(null)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          All
        </span>
        <a
          key="all-mobile"
          href="/shop"
          className="block sm:hidden text-sm px-2 py-1 rounded transition-colors font-medium text-left group-hover/category-menu:text-gray-400 hover:text-[#2B3AE1] hover:font-bold"
        >
          All
        </a>
        {categories.map((category) => (
          <React.Fragment key={category}>
            <span
              className="hidden sm:block text-sm px-2 py-1 rounded transition-colors font-medium text-left group-hover/category-menu:text-gray-400 hover:text-[#2B3AE1] hover:font-bold cursor-pointer transition-all duration-200 hover:translate-x-4 hover:scale-110"
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {category}
            </span>
            <a
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="block sm:hidden text-sm px-2 py-1 rounded transition-colors font-medium text-left group-hover/category-menu:text-gray-400 hover:text-[#2B3AE1] hover:font-bold"
            >
              {category}
            </a>
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
}
