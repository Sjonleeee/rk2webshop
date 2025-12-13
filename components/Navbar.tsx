import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-neutral-light border-b border-gray-200">
      <Link
        href="/"
        className="text-xl font-bold text-neutral-dark hover:text-primary transition-colors"
      >
        R/K2©
      </Link>
      <ul className="flex items-center space-x-6">
        <li>
          <Link
            href="/"
            className="text-gray-700 hover:text-primary font-medium transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="text-gray-700 hover:text-primary font-medium transition-colors"
          >
            Shop
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="text-gray-700 hover:text-primary font-medium transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-primary font-medium transition-colors"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
