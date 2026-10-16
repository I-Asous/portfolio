import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-24 text-center">
      <p className="title text-[clamp(1.7rem,3.3vw,2.7rem)] leading-[1.15]">
        404. this page doesn&apos;t exist.
      </p>
      <Link href="/" className="text-sm uppercase underline underline-offset-4">
        Back home
      </Link>
    </section>
  )
}
