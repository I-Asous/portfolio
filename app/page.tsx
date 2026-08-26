import { Experience } from 'app/components/experience'
import { TypingHeading } from 'app/components/typing-heading'

export default function Page() {
  return (
    <section>
      <TypingHeading className="mb-8 text-2xl font-semibold tracking-tighter" />
      <p className="mb-4">
        {`I'm Islam.
        I'm a computer science student at Hunter College who spends more time debugging authentication flows than I'd like to admit.
        I'm a Software Engineer REU on Project Sisyphus, an NSF-funded research effort at Clemson University's HATLab studying authentication-fatigue-driven password reuse,
        and I'm interning with the NYC Department of Transportation, scoping and delivering small-scale applications.
        Outside of that, I'm helping 600+ students survive computer architecture, theory, and DSA & OOP as a TA,
        or digging into machine learning and SQL as a CUNY Tech Prep Data Science Fellow.`}
      </p>
      <div className="my-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tighter">
          Current Roles
        </h2>
        <Experience />
      </div>
    </section>
  )
}
