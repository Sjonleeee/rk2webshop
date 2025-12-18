"use client";

interface CategorySidebarProps {
  categories: string[];
  setHoveredCategory: (cat: string | null) => void;
}

export default function CategorySidebar({
  categories,
  setHoveredCategory,
}: CategorySidebarProps) {
  // Sorteer alfabetisch (case-insensitive)
  const sortedCategories = [...categories].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  /* ========= SHARED STYLES ========= */
  const desktopButton =
    "text-[11px] font-medium leading-tight px-1 py-[2px] text-left transition-colors duration-150";

  const mobileButton =
    "text-[12px] px-2 py-1 rounded font-medium text-left border border-gray-200 transition-colors hover:text-[#2B3AE1]";

  return (
    <aside
      className="
        pointer-events-auto
        sm:sticky sm:top-24
        sm:z-20
        sm:w-[180px]
        sm:ml-8
      "
    >
      <nav className="group/category-menu">
        {/* ================= MOBILE ================= */}
        <div className="sm:hidden flex flex-wrap gap-2 mb-4 w-screen max-w-none -ml-4 px-4">
          <button
            type="button"
            className={mobileButton}
            onClick={() => setHoveredCategory(null)}
            aria-label="Show all categories"
          >
            All
          </button>

          {sortedCategories.map((category) => (
            <button
              key={`${category}-mobile`}
              type="button"
              className={mobileButton}
              onClick={() => setHoveredCategory(category)}
              aria-label={`Filter by category ${category}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden sm:flex flex-col gap-0 bg-white/70 backdrop-blur-sm p-2 rounded-md">
          <button
            type="button"
            className={`${desktopButton} group-hover/category-menu:text-gray-400 hover:text-[#1c2de7]`}
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
              className={`${desktopButton} group-hover/category-menu:text-gray-400 hover:text-[#1c2de7]`}
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
