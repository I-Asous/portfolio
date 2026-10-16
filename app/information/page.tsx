import Link from 'next/link'
import { bio, certificates, projects, roles } from 'app/lib/content'

export const metadata = { title: 'Information' }

const linkClass = 'underline underline-offset-4 hover:no-underline'

export default function Page() {
  return (
    <div className="md:overflow-y-auto">
      <p className="title mx-auto max-w-6xl px-5 pt-10 pb-56 text-center text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1.18] lowercase md:pt-16">
        {bio}
      </p>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-6 gap-y-12 px-5 pb-16 text-center text-sm leading-snug sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <section>
          <h2 className="mb-4 uppercase">Roles</h2>
          <ul className="space-y-4">
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
          <h2 className="mb-4 uppercase">Projects</h2>
          <ul className="space-y-4">
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
          <h2 className="mb-4 uppercase">Certificates</h2>
          <ul className="space-y-4">
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
          <h2 className="mb-4 uppercase">Elsewhere</h2>
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
