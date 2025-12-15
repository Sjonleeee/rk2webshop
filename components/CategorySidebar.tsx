"use client";
interface CategorySidebarProps {
  categories: string[];
  setHoveredCategory: (cat: string | null) => void;
}

export default function CategorySidebar({
  categories,
  setHoveredCategory,
}: CategorySidebarProps) {
  // Sorteer de categorieën alfabetisch (hoofdletterongevoelig)
  const sortedCategories = [...categories].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  return (
    <aside className="w-[200px] min-w-[180px] max-w-xs">
      <h2 className="text-lg font-semibold mb-6">Categories</h2>
      <nav className="group/category-menu">
        {/* Mobiel: grid met wrapping, filtering via click (geen Link) */}
        <div className="sm:hidden flex flex-wrap gap-2 mb-4 w-screen max-w-none -ml-4 pl-4 pr-4">
          <button
            type="button"
            key="all-mobile"
            className="text-sm px-2 py-1 rounded font-medium text-left hover:text-[#2B3AE1] hover:font-bold transition-colors border border-gray-200"
            onClick={() => setHoveredCategory(null)}
            aria-label="Toon alle categorieën"
          >
            All
          </button>
          {sortedCategories.map((category) => (
            <button
              type="button"
              key={category + "-mobile"}
              className="text-sm px-2 py-1 rounded font-medium text-left hover:text-[#2B3AE1] hover:font-bold transition-colors border border-gray-200"
              onClick={() => setHoveredCategory(category)}
              aria-label={`Filter op categorie ${category}`}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Desktop: verticale lijst met hover preview en click filter, a11y-proof */}
        <div className="hidden sm:flex flex-col">
          <button
            type="button"
            key="all"
            className="text-sm px-2 py-1 rounded font-medium text-left group-hover/category-menu:text-gray-400 hover:text-[#2B3AE1] hover:font-bold cursor-pointer transition-all duration-200 hover:translate-x-4 hover:scale-110 "
            onMouseEnter={() => setHoveredCategory(null)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => setHoveredCategory(null)}
            aria-label="Show all categories"
          >
            All
          </button>
          {sortedCategories.map((category) => (
            <button
              type="button"
              key={category}
              className="text-sm px-2 py-1 rounded font-medium text-left group-hover/category-menu:text-gray-400 hover:text-[#2B3AE1] hover:font-bold cursor-pointer transition-all duration-200 hover:translate-x-4 hover:scale-110 "
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => setHoveredCategory(category)}
              aria-label={`Filter op categorie ${category}`}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
