import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContentBuddy by WastedApe — AI Content Generator for Creators',
  description: 'Turn any topic into a week of content in 30 seconds. Generate YouTube scripts, blog posts, Instagram captions, TikTok scripts, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
