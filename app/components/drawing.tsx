'use client'

import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react'
import type { Drawing } from 'app/lib/db'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_AUTHOR,
  STROKE_WIDTH,
  strokeToPath,
  type Strokes,
} from 'app/lib/drawing'

// Presentation-agnostic drawing pieces. Each layout wraps these in its own
// chrome; all state lives in useDrawingBoard.

const MIN_POINT_DISTANCE = 2

function StrokePaths({ strokes }: { strokes: Strokes }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {strokes.map((stroke, index) => (
        <path key={index} d={strokeToPath(stroke)} />
      ))}
    </g>
  )
}

export function DrawingImage({
  strokes,
  className,
  label,
}: {
  strokes: Strokes
  className?: string
  label?: string
}) {
  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label ?? 'Visitor drawing'}
    >
      <StrokePaths strokes={strokes} />
    </svg>
  )
}

export function DrawingPad({
  strokes,
  onChange,
  className,
}: {
  strokes: Strokes
  onChange: (strokes: Strokes) => void
  className?: string
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const drawing = useRef(false)

  function toCanvasPoint(event: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix) return null
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse()
    )
    return [
      Math.round(Math.min(CANVAS_WIDTH, Math.max(0, point.x))),
      Math.round(Math.min(CANVAS_HEIGHT, Math.max(0, point.y))),
    ]
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    const point = toCanvasPoint(event)
    if (!point) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = true
    onChange([...strokes, point])
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!drawing.current || strokes.length === 0) return
    const point = toCanvasPoint(event)
    if (!point) return
    const current = strokes[strokes.length - 1]
    const lastX = current[current.length - 2]
    const lastY = current[current.length - 1]
    if (Math.hypot(point[0] - lastX, point[1] - lastY) < MIN_POINT_DISTANCE) {
      return
    }
    onChange([...strokes.slice(0, -1), [...current, ...point]])
  }

  function handlePointerUp() {
    drawing.current = false
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className={className}
      style={{ touchAction: 'none', cursor: 'crosshair' }}
      shapeRendering="crispEdges"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Drawing canvas"
    >
      <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="transparent" />
      <StrokePaths strokes={strokes} />
    </svg>
  )
}

export function useDrawingBoard() {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loaded, setLoaded] = useState(false)
  const [index, setIndex] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Strokes>([])
  const [author, setAuthor] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/drawings')
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Drawing[]) => setDrawings(data))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const start = useCallback(() => {
    setStrokes([])
    setError(null)
    setIsDrawing(true)
  }, [])

  const cancel = useCallback(() => {
    setIsDrawing(false)
    setError(null)
  }, [])

  const undo = useCallback(() => setStrokes((prev) => prev.slice(0, -1)), [])
  const clear = useCallback(() => setStrokes([]), [])

  // Resolves to true once the drawing is saved.
  const submit = useCallback(async () => {
    if (strokes.length === 0) {
      setError('Draw something first.')
      return false
    }
    if (!author.trim()) {
      setError('Sign it with your initials.')
      return false
    }
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/drawings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, strokes, website }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        setError(data?.error ?? 'Something went wrong.')
        return false
      }
      if (data?.id) {
        setDrawings((prev) => [data as Drawing, ...prev])
        setIndex(0)
      }
      setIsDrawing(false)
      return true
    } catch {
      setError('Something went wrong.')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [author, strokes, website])

  const current = drawings[index] ?? null

  return {
    drawings,
    loaded,
    current,
    index,
    setIndex,
    next: () => setIndex((i) => (drawings.length ? (i + 1) % drawings.length : 0)),
    prev: () =>
      setIndex((i) =>
        drawings.length ? (i - 1 + drawings.length) % drawings.length : 0
      ),
    isDrawing,
    strokes,
    setStrokes,
    author,
    setAuthor: (value: string) => setAuthor(value.slice(0, MAX_AUTHOR)),
    website,
    setWebsite,
    error,
    submitting,
    start,
    cancel,
    undo,
    clear,
    submit,
  }
}
