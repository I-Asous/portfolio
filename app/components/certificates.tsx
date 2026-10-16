import { certificates } from 'app/lib/content'

export function Certificates() {
  return (
    <div>
      {certificates.map((entry, index) => (
        <div
          key={index}
          className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 mb-4"
        >
          <p className="text-neutral-600 w-[100px] shrink-0 tabular-nums">
            {entry.date}
          </p>
          <div className="flex flex-col">
            <p className="text-neutral-900 tracking-tight">
              {entry.name}
            </p>
            <p className="text-neutral-600 text-sm">
              {entry.issuer}
            </p>
            {entry.link && (
              <a
                href={entry.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-neutral-600 underline decoration-neutral-400 underline-offset-2 hover:text-neutral-900 w-fit"
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
