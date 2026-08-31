import Link from 'next/link'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Chronos
      </h1>
      <p className="mb-4 text-neutral-600 dark:text-neutral-400">
        A companion browser extension that collects auth-event telemetry for
        an NSF-funded human-factors study (Award #2521037) into
        secure-authentication usability.
      </p>
      <p className="mb-4 text-neutral-600 dark:text-neutral-400">
        Chronos feeds the read-only analytics dashboard built in{' '}
        <Link
          href="/projects"
          className="underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          Project Sisyphus
        </Link>
        , which tracks participant coverage, event trends, and automated
        data-quality checks.
      </p>
    </section>
  )
}
