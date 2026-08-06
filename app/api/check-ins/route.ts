import { createHash, randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { pool, ensureSchema, toCheckIn, type CheckInRow } from 'app/lib/db'
import { PIN_COLORS, isValidHexColor } from 'app/lib/pin-colors'

export const dynamic = 'force-dynamic'

const MAX_NAME = 60
const MAX_LOCATION = 100
const MAX_MESSAGE = 300
const RATE_LIMIT_SECONDS = 60

export async function GET() {
  await ensureSchema()
  const { rows } = await pool.query<CheckInRow>(
    'select id, name, message, location_label, lat, lng, color, created_at from check_ins order by created_at desc limit 1000'
  )
  return NextResponse.json(rows.map(toCheckIn))
}

export async function POST(request: NextRequest) {
  await ensureSchema()

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Honeypot: bots tend to fill every field, including ones hidden from
  // real users via CSS. Pretend success without writing anything.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const locationLabel =
    typeof body.locationLabel === 'string' ? body.locationLabel.trim() : ''
  const lat = Number(body.lat)
  const lng = Number(body.lng)
  const color = body.color === undefined ? PIN_COLORS[0] : body.color

  if (!isValidHexColor(color)) {
    return NextResponse.json({ error: 'Invalid pin color.' }, { status: 400 })
  }
  if (!name || name.length > MAX_NAME) {
    return NextResponse.json(
      { error: `Name is required (max ${MAX_NAME} characters).` },
      { status: 400 }
    )
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Message is required (max ${MAX_MESSAGE} characters).` },
      { status: 400 }
    )
  }
  if (!locationLabel || locationLabel.length > MAX_LOCATION) {
    return NextResponse.json(
      { error: `Location is required (max ${MAX_LOCATION} characters).` },
      { status: 400 }
    )
  }
  if (
    !Number.isFinite(lat) ||
    lat < -90 ||
    lat > 90 ||
    !Number.isFinite(lng) ||
    lng < -180 ||
    lng > 180
  ) {
    return NextResponse.json({ error: 'Invalid pin location.' }, { status: 400 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ipHash = createHash('sha256').update(ip).digest('hex')

  const { rows: recent } = await pool.query(
    `select 1 from check_ins where ip_hash = $1 and created_at > now() - interval '${RATE_LIMIT_SECONDS} seconds' limit 1`,
    [ipHash]
  )
  if (recent.length > 0) {
    return NextResponse.json(
      { error: 'Please wait a bit before checking in again.' },
      { status: 429 }
    )
  }

  const deleteToken = randomBytes(24).toString('hex')
  const deleteTokenHash = createHash('sha256').update(deleteToken).digest('hex')

  const { rows } = await pool.query<CheckInRow>(
    `insert into check_ins (name, message, location_label, lat, lng, color, ip_hash, delete_token_hash)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning id, name, message, location_label, lat, lng, color, created_at`,
    [name, message, locationLabel, lat, lng, color, ipHash, deleteTokenHash]
  )

  return NextResponse.json(
    { ...toCheckIn(rows[0]), deleteToken },
    { status: 201 }
  )
}
