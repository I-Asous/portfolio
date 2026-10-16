import { Pool } from 'pg'

const rawConnectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

// Neon connection strings include `sslmode=require`, which makes pg's own
// connection-string parser emit a deprecation warning about future libpq
// semantics. Strip it and set SSL behavior explicitly instead.
let connectionString = rawConnectionString
let requiresSsl = false
if (rawConnectionString) {
  const url = new URL(rawConnectionString)
  requiresSsl = url.searchParams.get('sslmode') === 'require'
  url.searchParams.delete('sslmode')
  connectionString = url.toString()
}

export const pool = new Pool({
  connectionString,
  ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
})

let schemaReady: Promise<void> | null = null

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `
        create table if not exists check_ins (
          id serial primary key,
          name text not null,
          message text not null,
          location_label text not null,
          lat double precision not null,
          lng double precision not null,
          ip_hash text,
          created_at timestamptz not null default now()
        );
        create index if not exists check_ins_created_at_idx on check_ins (created_at desc);
        alter table check_ins add column if not exists color text not null default '#ef4444';
        alter table check_ins add column if not exists delete_token_hash text;
        create table if not exists drawings (
          id serial primary key,
          author text not null,
          strokes jsonb not null,
          ip_hash text,
          created_at timestamptz not null default now()
        );
        create index if not exists drawings_created_at_idx on drawings (created_at desc);
        `
      )
      .then(() => undefined)
  }
  return schemaReady
}

export type CheckInRow = {
  id: number
  name: string
  message: string
  location_label: string
  lat: number
  lng: number
  color: string
  created_at: string
}

export type CheckIn = {
  id: number
  name: string
  message: string
  locationLabel: string
  lat: number
  lng: number
  color: string
  createdAt: string
}

export function toCheckIn(row: CheckInRow): CheckIn {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    locationLabel: row.location_label,
    lat: row.lat,
    lng: row.lng,
    color: row.color,
    createdAt: row.created_at,
  }
}


export type DrawingRow = {
  id: number
  author: string
  strokes: number[][]
  created_at: string
}

export type Drawing = {
  id: number
  author: string
  strokes: number[][]
  createdAt: string
}

export function toDrawing(row: DrawingRow): Drawing {
  return {
    id: row.id,
    author: row.author,
    strokes: row.strokes,
    createdAt: row.created_at,
  }
}
