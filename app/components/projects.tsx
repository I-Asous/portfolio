import Link from 'next/link'
import { projects } from 'app/lib/content'

function renderDescriptionLine(line: string) {
  const parts = line.split('Chronos')
  if (parts.length === 1) return line

  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && (
        <Link
          href="/projects/chronos"
          className="pointer-events-auto underline decoration-neutral-400 underline-offset-2 hover:text-neutral-900"
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
          <p className="text-neutral-600 w-[100px] shrink-0 tabular-nums">
            {entry.dateRange}
          </p>
          <div className="flex flex-col">
            <div className="group relative inline-block w-fit text-neutral-900 tracking-tight">
              <Link
                href={`/projects/${entry.slug}`}
                className="underline decoration-dotted decoration-neutral-400 underline-offset-4 outline-none hover:text-neutral-600"
              >
                {entry.name}
              </Link>
              <span className="pointer-events-none absolute left-0 top-full z-20 mt-3 w-[32rem] max-w-[90vw] origin-top-left scale-95 rounded-lg border border-neutral-200 bg-white p-5 opacity-0 shadow-xl transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100">
                <span className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-neutral-200 bg-white" />
                {entry.description && entry.description.length > 0 && (
                  <ul className="list-disc list-outside space-y-2 pl-4 text-base font-normal leading-relaxed text-neutral-700">
                    {entry.description.map((line, lineIndex) => (
                      <li key={lineIndex}>{renderDescriptionLine(line)}</li>
                    ))}
                  </ul>
                )}
              </span>
            </div>
            <p className="text-neutral-600 text-sm max-w-lg">
              {entry.tagline}
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
              {entry.tech.map((item) => (
                <span
                  key={item}
                  className="text-xs text-neutral-600 border border-neutral-200 rounded-full px-2 py-0.5"
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
                className="mt-2 text-sm text-neutral-600 underline decoration-neutral-400 underline-offset-2 hover:text-neutral-900 w-fit"
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
