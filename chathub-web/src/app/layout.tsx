import type { Metadata } from "next"
import "../styles/globals.css"
import { robotoFont } from "~/lib/get-font"
import { ReduxProvider } from "~/lib/reudx/provider"
import { ToastContainer } from "react-toastify"
import Head from "next/head"

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
      <Head>
        <script src="https://cdn.stringee.com/sdk/web/latest/stringee-web-sdk.min.js" />
      </Head>
      <body className={`${robotoFont.className} antialiased`}>
        <ReduxProvider>
          <ToastContainer position="top-center" autoClose={3000} closeOnClick />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
