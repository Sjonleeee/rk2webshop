import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo and Text */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Image
              src="/logos/rk2logo.png"
              alt="R/K2"
              width={100}
              height={40}
              className="h-8 w-auto"
              priority
            />

            {/* Text next to logo */}
            <div className="text-foreground font-mono text-[9px] leading-tight">
              <div>Designed For motion</div>
              <div className="-mt-0.5">Made to last</div>
            </div>
          </div>

          {/* Navigation underneath */}
          <nav className="flex items-center gap-8 bg-background/60 backdrop-blur-xl px-6 py-3 rounded-lg">
            <Link
              href="/ss26"
              className="text-xs font-mono text-foreground hover:text-[#1c2de7] transition-colors"
            >
              ss26
            </Link>
            <Link
              href="/projects"
              className="text-xs font-mono text-foreground hover:text-[#1c2de7] transition-colors"
            >
              projects
            </Link>
            <Link
              href="/shop"
              className="text-xs font-mono text-foreground hover:text-[#1c2de7] transition-colors"
            >
              shop all
            </Link>
            <Link
              href="/archive"
              className="text-xs font-mono text-foreground hover:text-[#1c2de7] transition-colors"
            >
              archive
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
