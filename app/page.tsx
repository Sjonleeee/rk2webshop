import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Welcome to R/K2© Webshop
        </h1>
        <p className="text-lg mb-8 text-neutral-dark">
          Discover our amazing products.
        </p>
        <Link
          href="/shop"
          className="bg-primary px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
