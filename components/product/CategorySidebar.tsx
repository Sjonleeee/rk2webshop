"use client";

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string | null;
  setHoveredCategory: (cat: string | null) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  setHoveredCategory,
}: CategorySidebarProps) {
  // Sorteer alfabetisch (case-insensitive)
  const sortedCategories = [...categories].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  // Consistente styling-tokens
  const ACTIVE_TEXT_COLOR = "text-[#2433C4]";
  const HOVER_TEXT_COLOR = "hover:text-[#1c2de7]";
  const DIM_TEXT_COLOR = "group-hover/category-menu:text-gray-400";

  // Desktop: compact, dichter op elkaar
  const verticalButtonClasses =
    "text-[11px] font-medium leading-tight px-1 py-[2px] text-left transition-colors duration-150";

  const mobileButtonBase =
    "text-[14px] px-4 py-2 rounded-full font-medium text-left border bg-white/80 backdrop-blur-sm whitespace-nowrap transition-colors";

  const getMobileClasses = (isActive: boolean) =>
    [
      mobileButtonBase,
      isActive
        ? `border-[#2433C4] ${ACTIVE_TEXT_COLOR}`
        : `border-gray-200 text-gray-800 ${HOVER_TEXT_COLOR}`,
    ].join(" ");

  return (
    <aside
      className="
        pointer-events-auto
        sticky z-20
        top-16 sm:top-24
        w-full
        sm:w-[140px]
        sm:self-start
        sm:max-h-[calc(100vh-6rem)]
      "
    >
      <nav className="group/category-menu">
        {/* ================= MOBILE: sticky bar boven producten ================= */}
        <div className="sm:hidden w-full relative flex items-center gap-2 px-4 py-2">
          {/* 'All' blijft altijd zichtbaar links */}
          <button
            type="button"
            className={getMobileClasses(!selectedCategory)}
            onClick={() => setHoveredCategory(null)}
            aria-label="Show all categories"
          >
            All
          </button>

          {/* Overige categories horizontaal scrollbaar */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
              {sortedCategories.map((category) => (
                <button
                  key={`${category}-mobile`}
                  type="button"
                  className={getMobileClasses(selectedCategory === category)}
                  onClick={() => setHoveredCategory(category)}
                  aria-label={`Filter by category ${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Subtiele fade rechts als hint dat je kan scrollen */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white/90 to-transparent" />
        </div>

        {/* ================= DESKTOP: verticale sidebar ================= */}
        <div className="hidden sm:flex flex-col gap-0 bg-white/70 backdrop-blur-sm p-2 rounded-md max-h-[calc(100vh-8rem)] overflow-y-auto">
          <button
            type="button"
            className={`category-sidebar-link ${verticalButtonClasses} ${
              !selectedCategory
                ? `category-sidebar-link-active ${ACTIVE_TEXT_COLOR}`
                : `${DIM_TEXT_COLOR} ${HOVER_TEXT_COLOR}`
            }`}
            onMouseEnter={() => setHoveredCategory(null)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => setHoveredCategory(null)}
          >
            All
          </button>

          {sortedCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-sidebar-link ${verticalButtonClasses} ${
                selectedCategory === category
                  ? `category-sidebar-link-active ${ACTIVE_TEXT_COLOR}`
                  : `${DIM_TEXT_COLOR} ${HOVER_TEXT_COLOR}`
              }`}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => setHoveredCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
