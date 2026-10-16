import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { pool, ensureSchema, toDrawing, type DrawingRow } from 'app/lib/db'
import { MAX_AUTHOR, validateStrokes } from 'app/lib/drawing'

export const dynamic = 'force-dynamic'

const RATE_LIMIT_SECONDS = 60
const LIST_LIMIT = 24

export async function GET() {
  await ensureSchema()
  const { rows } = await pool.query<DrawingRow>(
    `select id, author, strokes, created_at from drawings order by created_at desc limit ${LIST_LIMIT}`
  )
  return NextResponse.json(rows.map(toDrawing))
}

export async function POST(request: NextRequest) {
  await ensureSchema()

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Honeypot, same as check-ins: pretend success without writing anything.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const author =
    typeof body.author === 'string' ? body.author.trim().toUpperCase() : ''
  if (!author || author.length > MAX_AUTHOR) {
    return NextResponse.json(
      { error: `Initials are required (max ${MAX_AUTHOR} characters).` },
      { status: 400 }
    )
  }

  const strokes = validateStrokes(body.strokes)
  if (!strokes) {
    return NextResponse.json({ error: 'Invalid drawing.' }, { status: 400 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ipHash = createHash('sha256').update(ip).digest('hex')

  const { rows: recent } = await pool.query(
    `select 1 from drawings where ip_hash = $1 and created_at > now() - interval '${RATE_LIMIT_SECONDS} seconds' limit 1`,
    [ipHash]
  )
  if (recent.length > 0) {
    return NextResponse.json(
      { error: 'Please wait a bit before drawing again.' },
      { status: 429 }
    )
  }

  const { rows } = await pool.query<DrawingRow>(
    `insert into drawings (author, strokes, ip_hash)
     values ($1, $2, $3)
     returning id, author, strokes, created_at`,
    [author, JSON.stringify(strokes), ipHash]
  )

  return NextResponse.json(toDrawing(rows[0]), { status: 201 })
}
