type Certificate = {
  date: string
  name: string
  issuer: string
  link?: { href: string; label: string }
}

const certificates: Certificate[] = [
  {
    date: 'Jul 2026',
    name: 'Social and Behavioral Responsible Conduct of Research',
    issuer: 'CITI Program',
    link: {
      href: 'https://www.citiprogram.org/verify/?w2dbf57a6-1c5e-425e-9a0a-aef42fe86247-78102814',
      label: 'Verify credential',
    },
  },
  {
    date: 'Jul 2026',
    name: 'Human Subjects Protections: Group 1 Investigators Conducting Social and Behavioral Science Research (SBR)',
    issuer: 'CITI Program · Clemson University',
    link: {
      href: 'https://www.citiprogram.org/verify/?w246c4753-1418-48bf-b506-c55db2c65e82-78084148',
      label: 'Verify credential',
    },
  },
  {
    date: 'In progress',
    name: 'AI201: Applications of AI Engineering',
    issuer: 'CodePath',
  },
  {
    date: 'In progress',
    name: 'Getting Started with DevOps on AWS',
    issuer: 'AWS',
  },
  {
    date: 'In progress',
    name: 'AWS Cloud Practitioner Essentials',
    issuer: 'AWS',
  },
  {
    date: 'In progress',
    name: 'AWS Cloud Quest: Cloud Practitioner',
    issuer: 'AWS',
  },
]

export function Certificates() {
  return (
    <div>
      {certificates.map((entry, index) => (
        <div
          key={index}
          className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 mb-4"
        >
          <p className="text-neutral-600 dark:text-neutral-400 w-[100px] shrink-0 tabular-nums">
            {entry.date}
          </p>
          <div className="flex flex-col">
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
              {entry.name}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {entry.issuer}
            </p>
            {entry.link && (
              <a
                href={entry.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-200 w-fit"
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
