export const PIN_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
] as const

export type PinColor = (typeof PIN_COLORS)[number]

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i

// A pin's color can be one of the presets or any custom hex the user picked
// via the RGB color input, so validation just checks the format is safe to
// feed into inline CSS / a Three.js material color, not allowlist membership.
export function isValidHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_RE.test(value)
}
