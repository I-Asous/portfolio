import Link from 'next/link'
import { bio, certificates, projects, roles } from 'app/lib/content'

export const metadata = { title: 'Information' }

const linkClass = 'underline underline-offset-4 hover:no-underline'

export default function Page() {
  return (
    // On desktop the page is exactly one screen: the bio centered in the
    // space left above the columns, which sit at the bottom. Phones scroll.
    <div className="flex flex-col md:min-h-0 md:flex-1 md:overflow-hidden">
      <div className="flex flex-1 items-center justify-center px-5 py-12 md:py-4">
        <p className="title max-w-6xl text-center text-[clamp(1.2rem,min(2.6vw,3.8vh),2.2rem)] leading-[1.18] lowercase">
          {bio}
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-x-6 gap-y-12 px-5 pb-8 text-center text-sm leading-snug sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <section>
          <h2 className="mb-[min(1rem,1.6vh)] uppercase">Roles</h2>
          <ul className="space-y-[min(1rem,1.5vh)]">
            {roles.map((role) => (
              <li key={role.role}>
                <p>{role.role}</p>
                <p className="text-neutral-500">
                  {role.dateRange}
                  {role.location ? ` · ${role.location}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-[min(1rem,1.6vh)] uppercase">Projects</h2>
          <ul className="space-y-[min(1rem,1.5vh)]">
            {projects.map((project) => (
              <li key={project.slug}>
                {project.hasCaseStudy ? (
                  <Link href={`/projects/${project.slug}`} className={linkClass}>
                    {project.name}
                  </Link>
                ) : (
                  <p>{project.name}</p>
                )}
                <p className="text-neutral-500">{project.tech.join(', ')}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="certificates" className="scroll-mt-6">
          <h2 className="mb-[min(1rem,1.6vh)] uppercase">Certificates</h2>
          <ul className="space-y-[min(1rem,1.5vh)]">
            {certificates.map((cert) => (
              <li key={cert.name}>
                {cert.link ? (
                  <a href={cert.link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {cert.name}
                  </a>
                ) : (
                  <p>{cert.name}</p>
                )}
                <p className="text-neutral-500">
                  {cert.issuer} · {cert.date}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-[min(1rem,1.6vh)] uppercase">Elsewhere</h2>
          <ul className="space-y-1">
            <li>
              <a href="https://github.com/I-Asous" target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub
              </a>
            </li>
            <li>
              <a href="/resume.pdf" target="_blank" className={linkClass}>
                Résumé
              </a>
            </li>
            <li>
              <Link href="/check-in" className={linkClass}>
                Check in
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
