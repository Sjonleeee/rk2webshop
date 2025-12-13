import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e9ecef",
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        R/K2©
      </Link>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          gap: "1.5rem",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Shop
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
