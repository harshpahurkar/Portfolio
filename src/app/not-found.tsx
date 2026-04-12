import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-mono text-accent text-sm mb-4 tracking-wide">404</p>
      <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
        Page Not Found
      </h1>
      <p className="text-muted max-w-md leading-relaxed mb-8">
        Unlike my API endpoints, which always return proper status codes, this page
        doesn&apos;t exist. You might have the wrong URL, or this route was never built.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono text-accent border border-accent rounded hover:bg-accent/10 transition-colors"
      >
        Go Home
      </Link>
    </main>
  );
}
