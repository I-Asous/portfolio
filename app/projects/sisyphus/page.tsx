import Link from 'next/link'
import type { ReactNode } from 'react'

const linkClass = 'underline underline-offset-4 hover:no-underline'

const meta = [
  { label: 'Role', value: 'Software engineer, extension' },
  { label: 'Timeline', value: 'July 2026 – Present' },
  { label: 'Team', value: 'HATlab, Clemson University' },
  { label: 'Funding', value: 'NSF Award #2521037' },
]

const tech = [
  'TypeScript',
  'Vue 3',
  'WXT',
  'Chrome MV3',
  'chrome.alarms',
  'IndexedDB',
  'Supabase',
  'Vitest',
]

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The problem' },
  { id: 'built', label: 'What I built' },
  { id: 'decisions', label: 'Design decisions' },
  { id: 'difficulties', label: 'Difficulties & fixes' },
  { id: 'testing', label: 'Testing' },
]

const built = [
  {
    title: 'Reminders',
    body: 'A floating bell in the popup opens a rule editor. Participants and researchers can schedule a one-time reminder or a recurring one (daily, weekly, monthly, or every N minutes), toggle it on and off, and delete it. Everything is stored in the extension and fires as a native notification.',
  },
  {
    title: 'Announcements',
    body: 'Admins broadcast messages from the Sisyphus dashboard. The extension polls for active announcements every 15 minutes and raises each one as a native notification, so a message reaches a participant even when no dashboard is open.',
  },
  {
    title: 'A popup that knows who is using it',
    body: 'Participants get a view-only notifications panel. Only the researcher view can create or edit rules, so the study cannot be nudged by accident from the wrong side.',
  },
]

const decisions = [
  {
    title: 'Local first',
    body: 'Reminders live in extension storage and never touch the network. They keep working offline and add no participant data to what the study already collects.',
  },
  {
    title: 'One alarm, not many timers',
    body: 'Manifest V3 service workers are suspended and restarted at will, so per-rule timers would be lost. A single one-minute alarm scans for due rules, which survives every restart.',
  },
  {
    title: 'Validate at the edge',
    body: 'A rule cannot be saved without a title and message, a future time (for one-time rules), or a valid time, weekday, or day of month (for recurring ones). Bad rules never reach storage, so the scheduler can trust what it reads.',
  },
  {
    title: 'Dedupe by cycle',
    body: 'Each announcement carries a cycle key, and the extension remembers the last key it showed per announcement. A repeating announcement appears once per cycle, not once per poll.',
  },
]

const difficulties = [
  {
    title: 'A late tick shifted the reminder time',
    problem:
      'Advancing a daily reminder from "now" means that if the tick fires a few minutes late, tomorrow’s reminder is a few minutes late too, and the error compounds each day.',
    fix: 'Daily, weekly, and monthly rules advance from their own scheduled slot instead of the current time, so the time of day never drifts no matter how late a tick runs.',
  },
  {
    title: 'A reminder on the 31st vanished in short months',
    problem:
      'Adding one month to the 31st overflows into the next month, or skips February entirely, so monthly reminders fired on the wrong day or not at all.',
    fix: 'Monthly recurrence clamps to the last day of the target month, so a rule on the 31st fires on Feb 28 or 29, and returns to the 31st when the month allows it.',
  },
  {
    title: 'Waking from sleep fired a burst of reminders',
    problem:
      'A custom-interval rule that lapsed while the laptop was asleep was still "due" for every missed interval, which risked a stack of notifications on wake.',
    fix: 'Custom intervals advance from the moment they fire rather than from their old slot, so a lapsed rule fires once and resumes its normal cadence.',
  },
  {
    title: 'Announcements re-notified on every poll',
    problem:
      'Polling every 15 minutes with no memory of what had been shown would raise the same announcement again on every pass.',
    fix: 'The extension stores the last cycle key shown per announcement and only notifies when it changes. A failed poll is caught and logged, so a network blip cannot take down the background worker.',
  },
  {
    title: 'Phone-number sign-ins were misread',
    problem:
      'Phone fields (type=tel, autocomplete=tel, or a "mobile number" placeholder) fell through to a generic username or unlabeled input, blurring what participants were actually entering.',
    fix: 'The content script now classifies phone fields as their own entry type and treats them as valid identifiers, so phone-first sign-ins are recorded accurately without being mistaken for a username.',
  },
]

function SectionHeading({
  id,
  index,
  children,
}: {
  id: string
  index: string
  children: ReactNode
}) {
  return (
    <div id={id} className="mt-16 mb-5 scroll-mt-8 text-sm uppercase">
      <span className="block tabular-nums">{Number(index)}</span>
      <h2>{children}</h2>
    </div>
  )
}

const bodyClass = 'mb-4'

export default function Page() {
  return (
    <div className="md:overflow-y-auto">
      <header className="px-5 pt-10 pb-12 text-center md:pt-16">
        <p className="mb-4 text-sm uppercase">Case study</p>
        <h1 className="title mx-auto max-w-3xl text-[clamp(1.7rem,3.3vw,2.7rem)] leading-[1.15] lowercase">
          chronos: giving a silent research extension a voice.
        </h1>
      </header>
      <article className="mx-auto max-w-2xl px-5 pb-20 text-lg leading-snug">
        <p className="mb-8">
          Reminders and announcements that reach study participants, built
          inside a Manifest V3 browser extension.
        </p>

        <dl className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="uppercase">{item.label}</dt>
              <dd className="text-neutral-600">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mb-6 flex flex-wrap gap-x-3 gap-y-1 text-sm uppercase text-neutral-600">
          {tech.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <nav
          aria-label="On this page"
          className="flex flex-wrap gap-x-4 gap-y-1 text-sm uppercase"
        >
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className={linkClass}>
              {section.label}
            </a>
          ))}
        </nav>

        <SectionHeading id="overview" index="01">
          Overview
        </SectionHeading>
        <p className={bodyClass}>
          Chronos is a companion browser extension for an NSF-funded human-factors
          study into secure-authentication usability. It quietly records auth
          events (logins, MFA prompts, logouts) as participants go about their
          normal browsing, and feeds the read-only analytics dashboard built in{' '}
          <Link href="/projects" className={linkClass}>
            Project Sisyphus
          </Link>
          .
        </p>
        <p className={bodyClass}>
          I joined the extension side of the project to debug and extend it,
          working alongside the team that built the detection engine.
        </p>

        <SectionHeading id="problem" index="02">
          The problem
        </SectionHeading>
        <p className={bodyClass}>
          A longitudinal study depends on people staying engaged, but Chronos was
          entirely passive. It collected data and said nothing. Researchers had no
          way to remind a participant to keep the extension running, and the
          broadcast messages admins could write in the dashboard had nowhere to
          land on the participant’s side.
        </p>
        <p className={bodyClass}>
          Separately, the detector could not tell a phone number from a username,
          which muddied the data for phone-first sign-in flows.
        </p>

        <SectionHeading id="built" index="03">
          What I built
        </SectionHeading>
        <ul className="space-y-6">
          {built.map((item) => (
            <li key={item.title}>
              <p className="text-sm uppercase">
                {item.title}
              </p>
              <p className="mt-1">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <SectionHeading id="decisions" index="04">
          Design decisions
        </SectionHeading>
        <div className="space-y-5">
          {decisions.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-1 sm:flex-row sm:gap-6"
            >
              <p className="text-sm uppercase sm:w-40 sm:shrink-0 sm:pt-1">
                {item.title}
              </p>
              <p>
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <SectionHeading id="difficulties" index="05">
          Difficulties &amp; fixes
        </SectionHeading>
        <p className={bodyClass}>
          Scheduling looks simple until real clocks get involved. These are the
          problems that took the most care.
        </p>
        <div className="space-y-8">
          {difficulties.map((item, index) => (
            <div key={item.title}>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-sm tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm uppercase">
                  {item.title}
                </h3>
              </div>
              <p className="mb-2">
                {item.problem}
              </p>
              <div className="flex gap-3">
                <span className="text-sm uppercase pt-1">
                  FIX
                </span>
                <p className="text-neutral-600">
                  {item.fix}
                </p>
              </div>
            </div>
          ))}
        </div>

        <SectionHeading id="testing" index="06">
          Testing
        </SectionHeading>
        <p className={bodyClass}>
          Time-based code is only trustworthy if the clock is under your control.
          Every scheduler function takes the current time as a parameter, which
          let me write over 700 lines of Vitest tests for the rule store,
          recurrence math, scheduler, announcement client, and popup composable,
          covering month-end clamping, late ticks, disabled rules, and one-shot
          rules that must disable themselves after firing.
        </p>

        <a
          href="https://www.nsf.gov/awardsearch/show-award/?AWD_ID=2521037"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-12 inline-block text-sm uppercase ${linkClass}`}
        >
          NSF Award #2521037 ↗
        </a>
      </article>
    </div>
  )
}
