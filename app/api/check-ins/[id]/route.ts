import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { pool, ensureSchema } from 'app/lib/db'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSchema()

  const { id } = await params
  const checkInId = Number(id)
  if (!Number.isInteger(checkInId)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const deleteToken = typeof body?.deleteToken === 'string' ? body.deleteToken : ''
  if (!deleteToken) {
    return NextResponse.json({ error: 'Missing delete token.' }, { status: 400 })
  }

  const deleteTokenHash = createHash('sha256').update(deleteToken).digest('hex')

  const { rowCount } = await pool.query(
    'delete from check_ins where id = $1 and delete_token_hash = $2',
    [checkInId, deleteTokenHash]
  )

  if (!rowCount) {
    return NextResponse.json(
      { error: 'Pin not found, or you are not the one who created it.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true })
}
