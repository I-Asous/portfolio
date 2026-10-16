'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { certificates, projects, roles } from 'app/lib/content'
import { STARTER_DRAWING } from 'app/lib/starter-drawing'
import type { Strokes } from 'app/lib/drawing'
import { DrawingImage, DrawingPad, useDrawingBoard } from './drawing'

const MAX_DRAWING_SLIDES = 5

type Slide =
  | { kind: 'intro' }
  | {
      kind: 'text'
      big: string
      small?: string
      link?: { href: string; label: string }
    }
  | { kind: 'drawing'; author: string; strokes: Strokes }

type Group = {
  title: [string, string?]
  slides: Slide[]
  // The trailing link after the slide numbers, like "ABC" on the reference.
  extra: { label: string; href?: string; action?: 'draw' }
}

const staticGroups: Group[] = [
  {
    title: ['Projects', 'Sisyphus, Token Watching & Gridlock'],
    slides: projects.map(
      (project): Slide => ({
        kind: 'text',
        big: project.name,
        small: [
          project.tagline,
          project.description?.join(' '),
          project.tech.join(' · '),
        ]
          .filter(Boolean)
          .join('\n\n'),
        link: project.hasCaseStudy
          ? { href: `/projects/${project.slug}`, label: 'Read the case study' }
          : undefined,
      })
    ),
    extra: { label: 'ABC', href: '/information' },
  },
  {
    title: ['Current roles', 'Research, industry & teaching'],
    slides: roles.map(
      (role): Slide => ({
        kind: 'text',
        big: role.role,
        small: [
          `${role.dateRange}${role.location ? ` · ${role.location}` : ''}`,
          role.description?.join(' '),
        ]
          .filter(Boolean)
          .join('\n'),
      })
    ),
    extra: { label: 'ABC', href: '/information' },
  },
  {
    title: ['Certificates', 'Earned & in progress'],
    slides: certificates.map(
      (cert): Slide => ({
        kind: 'text',
        big: cert.name,
        small: `${cert.issuer} · ${cert.date}`,
        link: cert.link,
      })
    ),
    extra: { label: 'ABC', href: '/information#certificates' },
  },
]

function sizeFor(text: string) {
  return text.length > 160
    ? 'text-[clamp(1.2rem,2.1vw,1.85rem)] max-w-4xl'
    : 'text-[clamp(1.7rem,3.3vw,2.7rem)] max-w-3xl'
}

function SlideView({ slide }: { slide: Slide }) {
  if (slide.kind === 'intro') {
    return (
      <div className="title max-w-3xl space-y-[1.1em] text-[clamp(1.7rem,3.3vw,2.7rem)] leading-[1.15] lowercase">
        <p>
          i&apos;m islam, a nyc based computer science student at hunter
          college and software engineer.
        </p>
        <p>
          i&apos;m keen on authentication flows, research data, and helping
          600+ students survive computer architecture.
        </p>
      </div>
    )
  }

  if (slide.kind === 'drawing') {
    return (
      <figure className="flex h-full flex-col items-center justify-center gap-3">
        <DrawingImage
          strokes={slide.strokes}
          label={`Drawing by ${slide.author}`}
          className="h-full max-h-[52vh] w-auto aspect-[4/5]"
        />
        <figcaption className="text-sm uppercase">
          Drawn by [{slide.author}]
        </figcaption>
      </figure>
    )
  }

  return (
    <div className={`title leading-[1.15] lowercase ${sizeFor(slide.big)}`}>
      <p>{slide.big}</p>
      {slide.small && (
        <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-sm normal-case leading-snug md:text-base">
          {slide.small}
        </p>
      )}
      {slide.link &&
        (slide.link.href.startsWith('/') ? (
          <Link
            href={slide.link.href}
            className="mt-4 inline-block text-sm uppercase underline underline-offset-4"
          >
            {slide.link.label}
          </Link>
        ) : (
          <a
            href={slide.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm uppercase underline underline-offset-4"
          >
            {slide.link.label} ↗
          </a>
        ))}
    </div>
  )
}

export function Carousel() {
  const board = useDrawingBoard()
  const [position, setPosition] = useState(0)

  const groups = useMemo<Group[]>(() => {
    const drawings = board.drawings.length
      ? board.drawings.slice(0, MAX_DRAWING_SLIDES)
      : [STARTER_DRAWING]
    return [
      ...staticGroups,
      {
        title: ['Visitor drawings', 'Leave one behind'],
        slides: drawings.map(
          (d): Slide => ({ kind: 'drawing', author: d.author, strokes: d.strokes })
        ),
        extra: { label: 'DRAW', action: 'draw' },
      },
    ]
  }, [board.drawings])

  // Position 0 is the intro; group slides follow in order.
  const offsets = useMemo(() => {
    let next = 1
    return groups.map((group) => {
      const start = next
      next += group.slides.length
      return start
    })
  }, [groups])
  const total = 1 + groups.reduce((sum, g) => sum + g.slides.length, 0)

  const slide: Slide = useMemo(() => {
    if (position === 0) return { kind: 'intro' }
    for (let g = groups.length - 1; g >= 0; g--) {
      if (position >= offsets[g]) {
        return groups[g].slides[position - offsets[g]] ?? { kind: 'intro' }
      }
    }
    return { kind: 'intro' }
  }, [position, groups, offsets])

  const go = (delta: number) =>
    setPosition((p) => (p + delta + total) % total)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (board.isDrawing) return
      if (event.target instanceof HTMLInputElement) return
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // A freshly pinned drawing lands at the front of the drawings group.
  async function submit() {
    if (await board.submit()) setPosition(offsets[groups.length - 1])
  }

  const activeGroup = offsets.findLastIndex((start) => position >= start)

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <section className="relative flex flex-1 min-h-[60vh] items-center justify-center px-10 py-6 text-center md:min-h-0 md:px-24">
        {!board.isDrawing && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-2xl md:left-5"
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-2xl md:right-5"
            >
              ›
            </button>
          </>
        )}

        {board.isDrawing ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <DrawingPad
              strokes={board.strokes}
              onChange={board.setStrokes}
              className="h-full max-h-[52vh] w-auto max-w-full aspect-[4/5] outline outline-1 outline-black"
            />
            <label className="text-sm uppercase">
              Drawn by [
              <input
                type="text"
                value={board.author}
                onChange={(e) => board.setAuthor(e.target.value)}
                placeholder="initials"
                autoFocus
                className="mx-1 w-20 border-b border-black bg-transparent text-center uppercase outline-none placeholder:text-neutral-400"
              />
              ]
            </label>
            {/* Honeypot: hidden from people, tempting to bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={board.website}
              onChange={(e) => board.setWebsite(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            {board.error && <p className="text-sm uppercase">{board.error}</p>}
            <div className="flex gap-5 text-sm [&>*]:uppercase">
              <button onClick={board.undo} disabled={!board.strokes.length} className="hover:underline disabled:opacity-30">
                Undo
              </button>
              <button onClick={board.clear} disabled={!board.strokes.length} className="hover:underline disabled:opacity-30">
                Clear
              </button>
              <button onClick={board.cancel} className="hover:underline">
                Cancel
              </button>
              <button onClick={submit} disabled={board.submitting} className="underline underline-offset-4 disabled:opacity-30">
                {board.submitting ? 'Pinning…' : 'Pin it'}
              </button>
            </div>
          </div>
        ) : (
          <SlideView slide={slide} />
        )}
      </section>

      <nav className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-8 px-5 pb-6 pt-4 text-xs uppercase leading-tight md:grid-cols-4 md:px-6 md:text-[13px]">
        {groups.map((group, g) => (
          <div key={group.title[0]}>
            <button
              onClick={() => setPosition(offsets[g])}
              className="block w-full text-center uppercase"
            >
              <span className="mb-2 block text-center">{g + 1}</span>
              <span className={g === activeGroup ? 'underline underline-offset-2' : ''}>
                {group.title[0]}
                {group.title[1] && <br />}
                {group.title[1]}
              </span>
            </button>
            <div className="mt-3 flex flex-wrap justify-center gap-x-2.5 gap-y-1 [&>*]:uppercase">
              {group.slides.map((_, s) => (
                <button
                  key={s}
                  onClick={() => {
                    board.cancel()
                    setPosition(offsets[g] + s)
                  }}
                  aria-label={`${group.title[0]}, slide ${s + 1}`}
                  className={
                    position === offsets[g] + s && !board.isDrawing
                      ? 'underline underline-offset-2'
                      : 'hover:underline underline-offset-2'
                  }
                >
                  {s + 1}
                </button>
              ))}
              {group.extra.href ? (
                <Link href={group.extra.href} className="hover:underline underline-offset-2">
                  {group.extra.label}
                </Link>
              ) : (
                <button
                  onClick={board.start}
                  className={board.isDrawing ? 'underline underline-offset-2' : 'hover:underline underline-offset-2'}
                >
                  {group.extra.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
