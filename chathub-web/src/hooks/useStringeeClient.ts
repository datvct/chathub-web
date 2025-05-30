"use client"

import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../lib/reudx/store"

declare global {
  interface Window {
    StringeeClient: any
    StringeeCall: any
  }
}

export const useStringee = (
  userId: string,
  localVideoRef?: React.RefObject<HTMLVideoElement>,
  remoteVideoRef?: React.RefObject<HTMLVideoElement>,
) => {
  const clientRef = useRef<any>(null)
  const callRef = useRef<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkSDKReady = setInterval(() => {
      if (typeof window.StringeeClient === "function" && typeof window.StringeeCall === "function") {
        clearInterval(checkSDKReady)
        init()
      }
    }, 300)

    const init = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/call/stringee-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        const stringeeToken = data.message

        const client = new window.StringeeClient()
        clientRef.current = client
        client.connect(stringeeToken)

        client.on("connect", () => setIsConnected(true))
        client.on("authen", (res: any) => console.log("Authenticated:", res))
        client.on("disconnect", () => setIsConnected(false))

        client.on("otherdeviceauthen", () => {
          console.warn("⚠️ Đăng nhập từ thiết bị khác. Đóng kết nối này.")
          client.disconnect()
        })

        client.on("incomingcall2", (incomingCall: any) => {
          console.log("📞 Incoming call received", incomingCall)

          // Gán vào ref để xử lý sau
          callRef.current = incomingCall

          // Lắng nghe stream
          incomingCall.on("addstream", (stream: MediaStream) => {
            console.log("Remote stream received")
            if (remoteVideoRef?.current) remoteVideoRef.current.srcObject = stream
          })

          incomingCall.on("localstream", (stream: MediaStream) => {
            console.log("Local stream received")
            if (localVideoRef?.current) localVideoRef.current.srcObject = stream
          })

          // Yêu cầu quyền truy cập mic/camera trước khi answer
          navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: incomingCall.isVideoCall,
            })
            .then(() => {
              incomingCall.answer()
              console.log("Answered call automatically")
            })
            .catch(err => {
              console.error("Không thể truy cập mic/camera:", err)
              incomingCall.reject()
            })

          incomingCall.on("hangup", () => {
            console.log("Call ended by remote")
            callRef.current = null
          })

          incomingCall.on("error", (error: any) => {
            console.error("Call error:", error)
          })
        })
      } catch (err) {
        console.error("Error initializing Stringee:", err)
      }
    }

    return () => clearInterval(checkSDKReady)
  }, [token])

  const makeCall = (toUserId: string, isVideo = false) => {
    if (!clientRef.current) return

    const call = new window.StringeeCall(clientRef.current, userId, toUserId, isVideo)
    callRef.current = call

    call.on("addstream", (stream: MediaStream) => {
      if (remoteVideoRef?.current) remoteVideoRef.current.srcObject = stream
    })

    call.on("localstream", (stream: MediaStream) => {
      if (localVideoRef?.current) localVideoRef.current.srcObject = stream
    })

    call.makeCall()
  }

  const endCall = () => {
    if (callRef.current) {
      callRef.current.hangup()
    }
  }

  return {
    makeCall,
    endCall,
    isConnected,
  }
}
