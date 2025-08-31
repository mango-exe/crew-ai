'use client'
import './globals.css'
import styles from '@/app/layout.module.css'

import { Inter } from 'next/font/google'

import { ThemeProvider } from './components/theme-provider'
import { SessionProvider } from 'next-auth/react'

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
              {/* Existing circles, spread out */}
              {/* Existing circles, spread out and bigger */}
               <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-purple-600/30 rounded-full blur-3xl" />
               <div className="absolute bottom-0 right-0 w-[48rem] h-[48rem] bg-blue-500/25 rounded-full blur-3xl" />
               <div className="absolute top-1/5 left-1/4 w-[36rem] h-[36rem] bg-pink-500/20 rounded-full blur-2xl" />

               {/* New circles, bigger for overlap */}
               <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-3xl" />
               <div className="absolute bottom-1/3 left-0 w-[36rem] h-[36rem] bg-red-500/15 rounded-full blur-2xl" />

               {/* Gradient overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-[#0d0d0f]" />
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
