// components/StringeeScriptLoader.tsx
"use client"
import Script from "next/script"

export default function StringeeScriptLoader() {
  return (
    <Script
      src="https://cdn.stringee.com/sdk/web/latest/stringee-web-sdk.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("✅ Stringee SDK loaded!")
      }}
    />
  )
}
