import type { ReactNode } from 'react'

export const metadata = { title: 'Token Watching' }

const linkClass = 'underline underline-offset-4 hover:no-underline'

const meta = [
  { label: 'Role', value: 'Agents & orchestration' },
  { label: 'Timeline', value: 'Aug 2026 – Present' },
  { label: 'Team', value: 'Capstone, CUNY Hunter' },
  { label: 'Pipeline', value: 'Auditor → Optimizer → Validator' },
]

const tech = [
  'Python',
  'Anthropic API',
  'Claude Sonnet & Haiku',
  'tiktoken',
  'Pydantic',
  'pytest',
  'GitHub Actions',
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
    title: 'Auditor',
    body: 'Counts a prompt’s tokens the way the target model bills them, estimates its cost, and flags waste: filler words, an unusually high token-to-word ratio, runs of blank lines. Only a long prompt that passes every rule check gets a second look from Claude Haiku, which reports issues through a tool call so they arrive as a list.',
  },
  {
    title: 'Optimizer',
    body: 'Rewrites the prompt using the Auditor’s issues, through a structured-output schema (Pydantic) so the rewrite lands in its own field and no “Here’s your optimized prompt:” preamble can leak into what the user sees. On a representative prompt it went from 31 tokens to 8, a 74% cut, with the request intact.',
  },
  {
    title: 'Validator',
    body: 'Checks the rewrite against the original and returns a 1–10 score, a pass/fail verdict and a one-sentence reason. Before scoring, the model writes out READ, ANSWER, CITE and THINK steps: list the original’s requirements, check each one, quote anything lost, decide whether it matters. That trace is kept, so a verdict can be inspected rather than trusted.',
  },
  {
    title: 'Orchestrator',
    body: 'Runs the three agents in order and decides when to stop. A clean prompt never reaches the Optimizer. A rewrite that saves nothing is dropped before validation. A rejected rewrite goes back to the Optimizer with the Validator’s reason, up to three attempts, and if none pass the user gets their original prompt back.',
  },
  {
    title: 'Shared token counting',
    body: 'One module counts tokens for every agent: locally with tiktoken’s o200k_base encoding for ChatGPT, or through Anthropic’s count_tokens endpoint for Claude, with the message framing measured once and subtracted. Counts are cached, so the Auditor and Optimizer share one API call per prompt.',
  },
]

const decisions = [
  {
    title: 'Don’t waste tokens to save tokens',
    body: 'Every stage takes the cheapest route first. Deterministic checks run before any model call, identical prompts pass validation without one, and most prompts finish the pipeline on rule checks alone.',
  },
  {
    title: 'Meaning over length',
    body: 'A rewrite the Validator rejects is never shown, even if it is shorter. Getting the same answer for more tokens beats a different answer for fewer.',
  },
  {
    title: 'Retries carry their history',
    body: 'Each failed attempt goes back to the Optimizer as the rejected rewrite plus the reason, and every earlier rejection is included, so the next try sees exactly what it wrote and what that broke.',
  },
  {
    title: 'Prompts are data',
    body: 'The prompt under review is wrapped in tags with an instruction to treat it only as text, so a prompt that says “ignore previous instructions” or “say none found” can’t steer its own audit or rewrite.',
  },
  {
    title: 'Failures fall back',
    body: 'If the Auditor’s Claude review hits a rate limit or network error, it logs a warning and returns the rule-based result. A refused or cut-off rewrite keeps the original prompt.',
  },
]

const difficulties = [
  {
    title: 'Almost every prompt was flagged',
    problem:
      'The token-to-word check fired above 1 token per word, but normal English averages about 1.3, so even “What is the capital of France?” was flagged and severity was almost never Low.',
    fix: 'Raised the threshold to 1.6, just above the average, and turned the clean-prompt test from an expected failure into a passing test.',
  },
  {
    title: 'Every prompt cost $0.000',
    problem:
      'The cost estimate rounded to three decimals, and a single prompt costs a fraction of a cent, so anything under about 170 tokens showed as free.',
    fix: 'The function returns the raw value and rounding moved to display. The comparison table shows cost per 1,000 runs, which is also closer to how real apps pay.',
  },
  {
    title: '“Return it unchanged” wasn’t reliable',
    problem:
      'Asking the model to copy an already-concise prompt back exactly failed on one-word differences, which then counted as a rewrite.',
    fix: 'Added an explicit unchanged flag to the schema, generated before the rewrite. When it is set, the original is kept no matter what else the model wrote.',
  },
  {
    title: 'Retries repeated the same mistake',
    problem:
      'The Validator’s reason reached the Optimizer as one more line in the issue list, without the rewrite it referred to.',
    fix: 'Rejections are passed as (rewrite, reason) pairs in their own list, kept apart from the Auditor’s issues.',
  },
  {
    title: 'Every rewrite would fail validation',
    problem:
      'After the Validator switched to step-by-step reasoning, its 300-token reply limit cut it off before the SCORE line, so every rewrite parsed as score 1 and the pipeline would burn three attempts for nothing.',
    fix: 'Raised the limit to 1,024 tokens. An unparseable reply still counts as a fail, never a pass.',
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
          token watching: three agents that cut prompt costs without changing
          the answer.
        </h1>
      </header>
      <article className="mx-auto max-w-2xl px-5 pb-20 text-lg leading-snug">
        <p className="mb-8">
          The agent pipeline behind a Chrome extension that trims wasted tokens
          from prompts inside ChatGPT and Claude.
        </p>

        <dl className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="uppercase">{item.label}</dt>
              <dd className="text-neutral-600">{item.value}</dd>
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
          Token Watching is a capstone project at CUNY Hunter: a Chrome
          extension that audits a prompt as you write it in ChatGPT or Claude
          and offers a shorter version with one click.
        </p>
        <p className={bodyClass}>
          My part is the agent layer. I built the three agents that audit,
          rewrite and check each prompt, the orchestrator that chains them, and
          the shared token counting they rely on.
        </p>

        <SectionHeading id="problem" index="02">
          The problem
        </SectionHeading>
        <p className={bodyClass}>
          Prompts are full of tokens that don’t change the answer: greetings,
          hedging, repeated instructions. Every one of them is billed, on every
          call.
        </p>
        <p className={bodyClass}>
          Cutting them is easy. Cutting them safely is not. A rewrite that drops
          a word limit, a negation or a line of code is cheaper and wrong, and
          one bad rewrite costs more trust than any number of tokens saved. The
          tool also can’t spend more tokens finding waste than it saves.
        </p>

        <SectionHeading id="built" index="03">
          What I built
        </SectionHeading>
        <ul className="space-y-6">
          {built.map((item) => (
            <li key={item.title}>
              <p className="text-sm uppercase">{item.title}</p>
              <p className="mt-1">{item.body}</p>
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
              <p>{item.body}</p>
            </div>
          ))}
        </div>

        <SectionHeading id="difficulties" index="05">
          Difficulties &amp; fixes
        </SectionHeading>
        <p className={bodyClass}>
          Most of the hard problems were about trusting a model’s output. These
          took the most care.
        </p>
        <div className="space-y-8">
          {difficulties.map((item, index) => (
            <div key={item.title}>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-sm tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm uppercase">{item.title}</h3>
              </div>
              <p className="mb-2">{item.problem}</p>
              <div className="flex gap-3">
                <span className="text-sm uppercase pt-1">FIX</span>
                <p className="text-neutral-600">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>

        <SectionHeading id="testing" index="06">
          Testing
        </SectionHeading>
        <p className={bodyClass}>
          The agents call a paid API, so the main test suite never does. Each
          agent and the orchestrator have offline pytest suites that swap in a
          fake client, checking what gets sent, how replies are handled, the
          order of calls between agents and when the retry loop stops. They run
          in CI on every pull request across Python 3.12 to 3.14, alongside a
          pylint quality gate.
        </p>
        <p className={bodyClass}>
          To test the Validator’s judgment, not just its code, a separate live
          suite calls the real API with two known cases: a rewrite that only
          removes filler must pass, and one that drops a word limit and a JSON
          format must fail. It runs on its own workflow whenever the Validator
          changes.
        </p>

        <a
          href="https://github.com/I-Asous/TokenWatching"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-12 inline-block text-sm uppercase ${linkClass}`}
        >
          View on GitHub ↗
        </a>
      </article>
    </div>
  )
}
