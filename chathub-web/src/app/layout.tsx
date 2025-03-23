import type { Metadata } from "next"
import "../styles/globals.css"
import { robotoFont } from "~/lib/get-font"
import { ReduxProvider } from "~/lib/reudx/provider"

export const metadata: Metadata = {
  title: "ChatHub App",
  description: "ChatHub App",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${robotoFont.className} antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
