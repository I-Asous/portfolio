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
    <div className="md:overflow-y-auto">
      <div className="px-5 pt-10 pb-10 text-center md:pt-14">
        <h1 className="text-[clamp(1.7rem,3.3vw,2.7rem)] leading-[1.15]">
          where you from?
        </h1>
        <p className="mx-auto mt-4 max-w-xl">
          Click anywhere on the globe, drop a pin, and let me know where
          you're saying hi from.
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-16 md:px-6">
        <CheckInGlobe initialCheckIns={checkIns} />
      </div>
    </div>
  )
}
