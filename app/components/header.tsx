import Link from 'next/link'

function Smiley({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8.5" />
      <path d="M7 8.2v.6M12 8.2v.6" strokeLinecap="round" strokeWidth="1.4" />
      <path d="M6.8 12c1.6 1.8 4.8 1.8 6.4 0" strokeLinecap="round" />
    </svg>
  )
}

export function Header() {
  return (
    <header className="shrink-0 flex items-center justify-between px-5 py-4 text-lg md:px-6">
      <Link href="/" className="tracking-tight">
        islamASOUS
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/information" className="hover:underline underline-offset-4">
          INFORMATION
        </Link>
        <Link
          href="/check-in"
          aria-label="Check in"
          title="Say hi: drop a pin"
          className="transition-transform hover:rotate-12"
        >
          <Smiley className="w-5" />
        </Link>
      </nav>
    </header>
  )
}
