export const loadStringeeSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).StringeeClient) {
      resolve() // SDK đã có
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdn.stringee.com/sdk/web/latest/stringee-web-sdk.min.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject("❌ Không thể tải Stringee SDK")
    document.head.appendChild(script)
  })
}
