import Link from 'next/link'

type Project = {
  slug: string
  dateRange: string
  name: string
  tagline: string
  tech: string[]
  description?: string[]
  link?: { href: string; label: string }
}

const projects: Project[] = [
  {
    slug: 'sisyphus',
    dateRange: 'May – Present',
    name: 'Project Sisyphus',
    tagline:
      'Analytics for an NSF-funded study on how people actually authenticate.',
    tech: [
      'Vue 3',
      'TypeScript',
      'Supabase',
      'Postgres RLS',
      'TanStack Query',
      'Cloudflare Workers',
    ],
    description: [
      'Built a read-only analytics dashboard over auth-event telemetry collected by Chronos, a companion browser extension — participant coverage, event trends, and automated data-quality checks for an NSF-funded human-factors study (Award #2521037) into secure-authentication usability.',
      'Replaced magic-link sign-in with Google OAuth and moved access control into Postgres Row-Level Security itself (domain + allowlist gate), closing a gap where aggregation views were reading past RLS under definer privileges.',
      'Shipped a live notification and admin-announcement system on Supabase Realtime, and iterated 13 SQL migrations building out filterable, indexed rollup views so every page stays thin on the client.',
    ],
    link: {
      href: 'https://www.nsf.gov/awardsearch/show-award/?AWD_ID=2521037',
      label: 'NSF Award #2521037',
    },
  },
]

function renderDescriptionLine(line: string) {
  const parts = line.split('Chronos')
  if (parts.length === 1) return line

  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && (
        <Link
          href="/projects/chronos"
          className="pointer-events-auto underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          Chronos
        </Link>
      )}
    </span>
  ))
}

export function Projects() {
  return (
    <div>
      {projects.map((entry, index) => (
        <div
          key={index}
          className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 mb-6"
        >
          <p className="text-neutral-600 dark:text-neutral-400 w-[100px] shrink-0 tabular-nums">
            {entry.dateRange}
          </p>
          <div className="flex flex-col">
            <div className="group relative inline-block w-fit text-neutral-900 dark:text-neutral-100 tracking-tight">
              <Link
                href={`/projects/${entry.slug}`}
                className="underline decoration-dotted decoration-neutral-400 dark:decoration-neutral-600 underline-offset-4 outline-none hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {entry.name}
              </Link>
              <span className="pointer-events-none absolute left-0 top-full z-20 mt-3 w-[32rem] max-w-[90vw] origin-top-left scale-95 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 opacity-0 shadow-xl transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100">
                <span className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />
                {entry.description && entry.description.length > 0 && (
                  <ul className="list-disc list-outside space-y-2 pl-4 text-base font-normal leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {entry.description.map((line, lineIndex) => (
                      <li key={lineIndex}>{renderDescriptionLine(line)}</li>
                    ))}
                  </ul>
                )}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-lg">
              {entry.tagline}
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
              {entry.tech.map((item) => (
                <span
                  key={item}
                  className="text-xs text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-full px-2 py-0.5"
                >
                  {item}
                </span>
              ))}
            </div>
            {entry.link && (
              <a
                href={entry.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-200 w-fit"
              >
                {entry.link.label} ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
