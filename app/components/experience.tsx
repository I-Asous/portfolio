type Role = {
  dateRange: string
  role: string
  location?: string
  description?: string[]
  bullets?: string[]
}

const roles: Role[] = [
  {
    dateRange: 'Jun 2026',
    role: 'Software Engineer, REU @ HATlab, Clemson University',
    location: 'Remote',
    description: [
      'Developing a browser extension (WXT, Vue 3, TypeScript, Dexie.js) to track user authentication behavior across enterprise and crowdsourcing platforms, supporting NSF SaTC 2.0 research (Award #2521037, $650K) on usable secure authentication.',
      'Designing and building a real-time broadcast notification system (Vue 3, Pinia, Supabase Realtime) enabling admins to push instant announcements to all authenticated dashboard users, with role-based access control via Postgres Row-Level Security.',
    ],
  },
  {
    dateRange: 'May 2026',
    role: 'Undergraduate Researcher @ Visualization and Virtuality Lab, CUNY Hunter',
    location: 'New York, NY',
    description: [
      'Conducting applied research within the Visualization and Virtual Reality Lab, contributing to ongoing experiments in visualization and virtual environment systems with a focus in Natural Language Processing.',
    ],
  },
  {
    dateRange: 'May 2026',
    role: 'Data Science Fellow @ CUNY Tech Prep',
    location: 'New York, NY',
    description: [
      'Selected as 1 of 200 Fellows for the competitive CUNY Tech Prep Data Science track, a year-long program placing top students from across the CUNY system into technical roles.',
      'Advancing proficiency in Python, machine learning, SQL, and end-to-end data analysis through intensive project-based curriculum.',
    ],
  },
  {
    dateRange: 'Aug 2025',
    role: 'Teaching Assistant @ CUNY Hunter Computer Science Department',
    location: 'New York, NY',
    description: [
      'Supported 600+ students across Computer Architecture I & II, Computer Theory, and Object-Oriented Programming/Data Structures & Algorithms through weekly review sessions and hosted office hours.',
      'Co-designed quizzes, midterms, and finals for courses enrolling 150–300+ students; reduced grading turnaround by implementing automated evaluation tools in collaboration with faculty.',
    ],
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
            {entry.description && entry.description.length > 0 ? (
              <div
                tabIndex={0}
                className="group relative inline-block w-fit text-neutral-900 dark:text-neutral-100 tracking-tight cursor-help underline decoration-dotted decoration-neutral-400 dark:decoration-neutral-600 underline-offset-4 outline-none"
              >
                {entry.role}
                <span className="pointer-events-none absolute left-0 top-full z-20 mt-3 w-[32rem] max-w-[90vw] origin-top-left scale-95 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 opacity-0 shadow-xl transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100">
                  <span className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />
                  {entry.description.length === 1 ? (
                    <span className="block text-base font-normal leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {entry.description[0]}
                    </span>
                  ) : (
                    <ul className="list-disc list-outside space-y-2 pl-4 text-base font-normal leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {entry.description.map((line, lineIndex) => (
                        <li key={lineIndex}>{line}</li>
                      ))}
                    </ul>
                  )}
                </span>
              </div>
            ) : (
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {entry.role}
              </p>
            )}
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
