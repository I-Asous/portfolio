import { roles } from 'app/lib/content'

export function Experience() {
  return (
    <div>
      {roles.map((entry, index) => (
        <div
          key={index}
          className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 mb-4"
        >
          <p className="text-neutral-600 w-[100px] shrink-0 tabular-nums">
            {entry.dateRange}
          </p>
          <div className="flex flex-col">
            {entry.description && entry.description.length > 0 ? (
              <div
                tabIndex={0}
                className="group relative inline-block w-fit text-neutral-900 tracking-tight cursor-help underline decoration-dotted decoration-neutral-400 underline-offset-4 outline-none"
              >
                {entry.role}
                <span className="pointer-events-none absolute left-0 top-full z-20 mt-3 w-[32rem] max-w-[90vw] origin-top-left scale-95 rounded-lg border border-neutral-200 bg-white p-5 opacity-0 shadow-xl transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100">
                  <span className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-neutral-200 bg-white" />
                  {entry.description.length === 1 ? (
                    <span className="block text-base font-normal leading-relaxed text-neutral-700">
                      {entry.description[0]}
                    </span>
                  ) : (
                    <ul className="list-disc list-outside space-y-2 pl-4 text-base font-normal leading-relaxed text-neutral-700">
                      {entry.description.map((line, lineIndex) => (
                        <li key={lineIndex}>{line}</li>
                      ))}
                    </ul>
                  )}
                </span>
              </div>
            ) : (
              <p className="text-neutral-900 tracking-tight">
                {entry.role}
              </p>
            )}
            {entry.location && (
              <p className="text-neutral-600 text-sm">
                {entry.location}
              </p>
            )}
            {entry.bullets && entry.bullets.length > 0 && (
              <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-sm text-neutral-700">
                {entry.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
