import { Experience } from 'app/components/experience'
import { TypingHeading } from 'app/components/typing-heading'

export default function Page() {
  return (
    <section>
      <TypingHeading className="mb-8 text-2xl font-semibold tracking-tighter" />
      <p className="mb-4">
        {`I'm Islam.
        I'm a computer science student at Hunter College who spends more time debugging authentication flows than I'd like to admit.
        Currently building a browser extension to study how people actually behave when they log in, as part of an NSF-funded research project.
        When I'm not knee-deep in TypeScript, I'm helping 600+ students survive computer theory and intro to DSA & OOP as a TA,
        or getting yelled at by a compiler in the Visualization and Virtual Reality Lab.`}
      </p>
      <div className="my-8">
        <Experience />
      </div>
    </section>
  )
}
