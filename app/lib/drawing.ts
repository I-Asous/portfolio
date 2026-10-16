// Shared between the drawing API and the client drawing surface.
//
// A drawing is a list of strokes; each stroke is a flat list of integer
// coordinates [x0, y0, x1, y1, ...] inside a fixed CANVAS_WIDTH x
// CANVAS_HEIGHT box, so drawings render identically at any display size.

export const CANVAS_WIDTH = 400
export const CANVAS_HEIGHT = 500
export const STROKE_WIDTH = 3

export const MAX_AUTHOR = 12
export const MAX_STROKES = 400
export const MAX_POINTS = 8000

export type Strokes = number[][]

export function validateStrokes(value: unknown): Strokes | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_STROKES) {
    return null
  }

  let points = 0
  const strokes: Strokes = []
  for (const stroke of value) {
    if (!Array.isArray(stroke) || stroke.length < 2 || stroke.length % 2 !== 0) {
      return null
    }
    points += stroke.length / 2
    if (points > MAX_POINTS) return null

    const clean: number[] = []
    for (let i = 0; i < stroke.length; i += 2) {
      const x = stroke[i]
      const y = stroke[i + 1]
      if (
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        x < 0 ||
        x > CANVAS_WIDTH ||
        y < 0 ||
        y > CANVAS_HEIGHT
      ) {
        return null
      }
      clean.push(x, y)
    }
    strokes.push(clean)
  }
  return strokes
}

// SVG path data for one stroke. A single tap becomes a short dot so it still
// shows up.
export function strokeToPath(stroke: number[]) {
  if (stroke.length === 2) {
    return `M${stroke[0]} ${stroke[1]}h0.01`
  }
  let d = `M${stroke[0]} ${stroke[1]}`
  for (let i = 2; i < stroke.length; i += 2) {
    d += `L${stroke[i]} ${stroke[i + 1]}`
  }
  return d
}
