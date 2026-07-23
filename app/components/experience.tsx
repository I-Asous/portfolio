type Role = {
  dateRange: string
  role: string
  location?: string
  bullets?: string[]
}

const roles: Role[] = [
  {
    dateRange: 'Jun 2026',
    role: 'Software Engineer, REU @ HATlab, Clemson University',
    location: 'Remote',
  },
  {
    dateRange: 'May 2026',
    role: 'Undergraduate Researcher @ Visualization and Virtuality Lab, CUNY Hunter',
    location: 'New York, NY',
  },
  {
    dateRange: 'May 2026',
    role: 'Data Science Fellow @ CUNY Tech Prep',
    location: 'New York, NY',
  },
  {
    dateRange: 'Aug 2025',
    role: 'Teaching Assistant @ CUNY Hunter Computer Science Department',
    location: 'New York, NY',
  },
]

export function Experience() {
  return (
    <div>
      {roles.map((entry, index) => (
        <div
          key={index}
          className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 mb-4"
        >
          <p className="text-neutral-600 dark:text-neutral-400 w-[100px] shrink-0 tabular-nums">
            {entry.dateRange}
          </p>
          <div className="flex flex-col">
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
              {entry.role}
            </p>
            {entry.location && (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {entry.location}
              </p>
            )}
            {entry.bullets && entry.bullets.length > 0 && (
              <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
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
