import type { Metadata } from "next"
import "../styles/globals.css"
import { robotoFont } from "~/lib/get-font"
import { ReduxProvider } from "~/lib/reudx/provider"
import { ToastContainer } from "react-toastify"

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
        <ReduxProvider>
          <ToastContainer position="top-center" autoClose={3000} closeOnClick />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
