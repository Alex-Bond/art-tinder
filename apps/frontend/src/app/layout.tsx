import '@radix-ui/themes/styles.css'
import './globals.css'
import React from 'react'
import { Theme } from '@radix-ui/themes'
import { Providers } from '@/app/providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
    <head>
      <title>Art Tinder</title>
    </head>
    <body>

    <Theme>
      <Providers>
        {children}
      </Providers>
    </Theme>

    </body>
    </html>
  )
}
