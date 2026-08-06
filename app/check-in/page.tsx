import { CheckInGlobe } from 'app/components/check-in-globe'
import { pool, ensureSchema, toCheckIn, type CheckInRow, type CheckIn } from 'app/lib/db'

export const dynamic = 'force-dynamic'

async function getCheckIns(): Promise<CheckIn[]> {
  try {
    await ensureSchema()
    const { rows } = await pool.query<CheckInRow>(
      'select id, name, message, location_label, lat, lng, color, created_at from check_ins order by created_at desc limit 1000'
    )
    return rows.map(toCheckIn)
  } catch {
    return []
  }
}

export default async function Page() {
  const checkIns = await getCheckIns()

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Where you from?
      </h1>
      <p className="mb-4 text-neutral-600 dark:text-neutral-400">
        Click anywhere on the globe, drop a pin, and let me know where
        you're saying hi from.
      </p>
      <div className="md:relative md:left-1/2 md:w-screen md:-translate-x-1/2">
        <div className="md:mx-auto md:max-w-4xl md:px-6 lg:px-10">
          <CheckInGlobe initialCheckIns={checkIns} />
        </div>
      </div>
    </section>
  )
}
