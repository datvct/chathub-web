// hooks/useStringeeCall.ts
import { useRef } from "react"

export const useStringeeCall = (client: any) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const makeCall = (to: string, isVideo: boolean) => {
    if (!client) {
      console.warn("Client not connected")
      return
    }

    const call = client.makeCall({
      from: client.userId,
      to,
      isVideoCall: isVideo,
      videoElement: {
        local: localVideoRef.current,
        remote: remoteVideoRef.current,
      },
    })

    call.on("addstream", (stream: any) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
        remoteVideoRef.current.play()
      }
    })

    call.on("ended", () => {
      console.log("Call ended")
    })

    return call
  }

  return {
    makeCall,
    localVideoRef,
    remoteVideoRef,
  }
}
