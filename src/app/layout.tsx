'use client'
import './globals.css'
import styles from '@/app/layout.module.css'

import { Inter } from 'next/font/google'

import { ThemeProvider } from './components/theme-provider'
import { SessionProvider } from 'next-auth/react'
import { SquareDashedMousePointer } from 'lucide-react'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html suppressHydrationWarning>
      <body className={`${styles.appContainer} ${inter.className}`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-1/4 w-[28rem] h-[28rem] bg-blue-500/25 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-[#0d0d0f]" />
            </div>
            <div className={styles.navbarArea}>
            </div>
            <div className={styles.sidebarArea}>
            </div>
            <div className={styles.mainArea}>
              {children}
            </div>
            <div className={styles.footerArea}>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
