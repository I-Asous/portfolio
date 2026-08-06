'use client'

import dynamic from 'next/dynamic'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { GlobeClickPoint, GlobeMethods } from 'react-globe.gl'
import type { CheckIn } from 'app/lib/db'
import { PIN_COLORS } from 'app/lib/pin-colors'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const MAX_NAME = 60
const MAX_LOCATION = 100
const MAX_MESSAGE = 300
const OWNED_PINS_KEY = 'checkin-owned-pins'

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(' ')

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const PIN_NEEDLE_HEIGHT = 6
const PIN_BALL_RADIUS = 2.4
const UP = new THREE.Vector3(0, 1, 0)

// Matches three-globe's own polar2Cartesian (GLOBE_RADIUS cancels out since
// we only need the *direction*, not the magnitude).
function radialDirection(lat: number, lng: number) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((90 - lng) * Math.PI) / 180
  const phiSin = Math.sin(phi)
  return new THREE.Vector3(phiSin * Math.cos(theta), Math.cos(phi), phiSin * Math.sin(theta))
}

// Builds a map-pin marker: a thin needle rooted at the globe surface with a
// round head at the outer end, rotated so it points radially outward at the
// given lat/lng. (three-globe's own `objectFacesSurface` does NOT do this —
// verified numerically that its rotation formula doesn't align with the
// true surface normal — so the orientation is computed directly here.)
function createPinObject(lat: number, lng: number, ballColor: string) {
  const group = new THREE.Group()

  const needle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, PIN_NEEDLE_HEIGHT, 8),
    new THREE.MeshLambertMaterial({ color: '#a1a1aa' })
  )
  needle.position.y = PIN_NEEDLE_HEIGHT / 2
  group.add(needle)

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(PIN_BALL_RADIUS, 16, 16),
    new THREE.MeshLambertMaterial({ color: ballColor })
  )
  ball.position.y = PIN_NEEDLE_HEIGHT + PIN_BALL_RADIUS * 0.5
  group.add(ball)

  group.quaternion.setFromUnitVectors(UP, radialDirection(lat, lng))

  return group
}

type PendingPin = { lat: number; lng: number }

type GlobePoint = {
  id: number
  lat: number
  lng: number
  name: string
  message: string
  locationLabel: string
  color: string
  kind: 'checkin' | 'pending'
}

type OwnedPin = { token: string; locationLabel: string }

function loadOwnedPins(): Record<number, OwnedPin> {
  try {
    const raw = window.localStorage.getItem(OWNED_PINS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveOwnedPins(pins: Record<number, OwnedPin>) {
  try {
    window.localStorage.setItem(OWNED_PINS_KEY, JSON.stringify(pins))
  } catch {
    // localStorage unavailable (private browsing, etc.) — ownership just won't persist
  }
}

// Stable accessors: `objectThreeObject` changing reference makes three-globe
// discard and rebuild every pin mesh, so these must not close over state —
// everything they need lives on the data point itself.
const objectLat = (d: unknown) => (d as GlobePoint).lat
const objectLng = (d: unknown) => (d as GlobePoint).lng
const objectThreeObject = (d: unknown) => {
  const p = d as GlobePoint
  return createPinObject(p.lat, p.lng, p.color)
}
const objectLabel = (d: unknown) => {
  const p = d as GlobePoint
  if (p.kind === 'pending') {
    return '<div style="font: 12px sans-serif; color: white;">Drop your pin here…</div>'
  }
  return `<div style="font: 12px sans-serif; color: white; max-width: 220px;">
      <strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.locationLabel)}<br/>
      ${escapeHtml(p.message)}
    </div>`
}

export function CheckInGlobe({
  initialCheckIns,
}: {
  initialCheckIns: CheckIn[]
}) {
  const globeRef = useRef<GlobeMethods | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedView = useRef(false)

  const [globeReady, setGlobeReady] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns)
  const [pendingPin, setPendingPin] = useState<PendingPin | null>(null)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [locationLabel, setLocationLabel] = useState('')
  const [color, setColor] = useState<string>(PIN_COLORS[0])
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ownedPins, setOwnedPins] = useState<Record<number, OwnedPin>>({})
  const [removingId, setRemovingId] = useState<number | null>(null)

  useEffect(() => {
    setOwnedPins(loadOwnedPins())
  }, [])

  // A ref callback (rather than a plain object ref) guarantees we notice the
  // moment react-globe.gl's lazily-loaded instance actually mounts, since it
  // can attach on a render where nothing else we depend on changed.
  const setGlobeRef = useCallback((instance: GlobeMethods | null) => {
    globeRef.current = instance
    if (instance) setGlobeReady(true)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    const controls = globe.controls()
    controls.autoRotate = !pendingPin
    controls.autoRotateSpeed = 0.5

    if (!initializedView.current) {
      globe.pointOfView({ altitude: 2.2 }, 0)
      initializedView.current = true
    }
  }, [globeReady, pendingPin, size])

  function handleGlobeClick(point: GlobeClickPoint) {
    setPendingPin({ lat: point.lat, lng: point.lng })
    setError(null)
  }

  function closeForm() {
    setPendingPin(null)
    setName('')
    setMessage('')
    setLocationLabel('')
    setColor(PIN_COLORS[0])
    setWebsite('')
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!pendingPin) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          message,
          locationLabel,
          color,
          lat: pendingPin.lat,
          lng: pendingPin.lng,
          website,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }
      const { deleteToken, ...checkIn } = data as CheckIn & { deleteToken: string }
      setCheckIns((prev) => [checkIn, ...prev])
      setOwnedPins((prev) => {
        const next = {
          ...prev,
          [checkIn.id]: { token: deleteToken, locationLabel: checkIn.locationLabel },
        }
        saveOwnedPins(next)
        return next
      })
      closeForm()
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(id: number) {
    const owned = ownedPins[id]
    if (!owned) return
    setRemovingId(id)
    try {
      const res = await fetch(`/api/check-ins/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteToken: owned.token }),
      })
      if (res.ok) {
        setCheckIns((prev) => prev.filter((c) => c.id !== id))
        setOwnedPins((prev) => {
          const next = { ...prev }
          delete next[id]
          saveOwnedPins(next)
          return next
        })
      }
    } finally {
      setRemovingId(null)
    }
  }

  const isPresetColor = (PIN_COLORS as readonly string[]).includes(color)

  const points: GlobePoint[] = [
    ...checkIns.map((c) => ({
      id: c.id,
      lat: c.lat,
      lng: c.lng,
      name: c.name,
      message: c.message,
      locationLabel: c.locationLabel,
      color: c.color,
      kind: 'checkin' as const,
    })),
    ...(pendingPin
      ? [
          {
            id: -1,
            lat: pendingPin.lat,
            lng: pendingPin.lng,
            name: '',
            message: '',
            locationLabel: '',
            color,
            kind: 'pending' as const,
          },
        ]
      : []),
  ]

  const myPins = Object.entries(ownedPins)
    .map(([id, owned]) => ({ id: Number(id), ...owned }))
    .filter((p) => checkIns.some((c) => c.id === p.id))

  return (
    <div>
      <div
        ref={containerRef}
        className="relative h-[560px] md:h-[760px] w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-black"
      >
        {size.width > 0 && (
          <Globe
            ref={setGlobeRef}
            width={size.width}
            height={size.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            showAtmosphere
            atmosphereColor="#3b82f6"
            objectsData={points}
            objectLat={objectLat}
            objectLng={objectLng}
            objectAltitude={0}
            objectThreeObject={objectThreeObject}
            objectLabel={objectLabel}
            onGlobeClick={handleGlobeClick}
          />
        )}

        {!pendingPin && (
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-neutral-400">
            Click anywhere on the globe to drop a pin
          </p>
        )}

        {pendingPin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xl"
            >
              <h3 className="mb-3 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Leave a pin at {pendingPin.lat.toFixed(1)}°, {pendingPin.lng.toFixed(1)}°
              </h3>

              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
                    Where are you from?
                  </label>
                  <input
                    required
                    maxLength={MAX_LOCATION}
                    value={locationLabel}
                    onChange={(e) => setLocationLabel(e.target.value)}
                    placeholder="Queens, NY, USA"
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-1.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
                    Your name
                  </label>
                  <input
                    required
                    maxLength={MAX_NAME}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-1.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
                    Pin color
                  </label>
                  <div className="flex gap-2">
                    {PIN_COLORS.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => setColor(swatch)}
                        aria-label={`Pin color ${swatch}`}
                        aria-pressed={color === swatch}
                        className={cx(
                          'h-6 w-6 rounded-full transition-transform',
                          color === swatch &&
                            'scale-110 ring-2 ring-neutral-900 ring-offset-2 ring-offset-white dark:ring-neutral-100 dark:ring-offset-neutral-900'
                        )}
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                    <label
                      title="Custom color"
                      aria-label="Choose a custom pin color"
                      className={cx(
                        'relative h-6 w-6 cursor-pointer overflow-hidden rounded-full transition-transform',
                        !isPresetColor &&
                          'scale-110 ring-2 ring-neutral-900 ring-offset-2 ring-offset-white dark:ring-neutral-100 dark:ring-offset-neutral-900'
                      )}
                      style={{
                        background: isPresetColor
                          ? 'conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)'
                          : color,
                      }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
                    Message
                  </label>
                  <textarea
                    required
                    maxLength={MAX_MESSAGE}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Say hi!"
                    rows={3}
                    className="w-full resize-none rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-1.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  {submitting ? 'Pinning…' : 'Drop pin'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {myPins.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Your pins
          </h3>
          <ul className="space-y-1.5">
            {myPins.map((pin) => (
              <li
                key={pin.id}
                className="flex items-center justify-between rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm"
              >
                <span className="text-neutral-700 dark:text-neutral-300">
                  {pin.locationLabel}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(pin.id)}
                  disabled={removingId === pin.id}
                  className="text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {removingId === pin.id ? 'Removing…' : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
