# Portfolio

This is my portfolio site. Includes:

- Optimized for SEO (sitemap, robots, JSON-LD schema)
- Dynamic OG images
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) — React framework
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Geist](https://vercel.com/font) font
- [Vercel Analytics](https://vercel.com/analytics) & [Speed Insights](https://vercel.com/docs/speed-insights)
- [pnpm](https://pnpm.io/) — package manager
- Deployed on [Vercel](https://vercel.com/)

## Architecture

```
app/
├── layout.tsx        Root layout: fonts, metadata, dark-mode init script,
│                      wraps every page with Navbar + Footer + Analytics
├── page.tsx           Home page (bio + "Current Roles" section)
├── not-found.tsx       404 page
├── sitemap.ts          Generates /sitemap.xml
├── robots.ts           Generates /robots.txt
├── og/route.tsx         Route Handler that renders dynamic OG images
├── global.css           Tailwind v4 entry point + theme tokens
└── components/
    ├── nav.tsx              Top navigation
    ├── footer.tsx            Footer w/ social links
    ├── theme-toggle.tsx       Light/dark toggle (persists to localStorage)
    ├── typing-heading.tsx      Animated typing effect for the hero heading
    └── experience.tsx          "Current Roles" list
```