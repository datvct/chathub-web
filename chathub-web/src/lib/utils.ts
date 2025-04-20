import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString)

  const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  return `${timeFormatter.format(date)} ${dateFormatter.format(date)}`
}

export const formatRelativeTime = (dateString: string) => {
  const now = new Date()
  const messageDate = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} phút trước`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  } else if (diffInSeconds < 30 * 86400) {
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  } else {
    return messageDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
}

const formatLastMessageTime = (timestamp: string) => {
  const messageDate = moment(timestamp)
  const now = moment()

  if (messageDate.isSame(now, "day")) {
    return messageDate.format("hh:mm A")
  } else if (messageDate.isSame(now.subtract(1, "day"), "day")) {
    return "Yesterday"
  } else {
    return messageDate.format("MMM DD")
  }
}

export default formatLastMessageTime

// export const getFileName = (url: string) => {
//   const fileName = url.split("/").pop()
//   return fileName.split("_")[0]
// }
export const getFileName = (url: string): string => {
  const fileName = url.split("/").pop() || ""

  const lastUnderscoreIndex = fileName.lastIndexOf("_")
  const lastDotIndex = fileName.lastIndexOf(".")

  if (lastUnderscoreIndex !== -1 && lastDotIndex !== -1 && lastUnderscoreIndex < lastDotIndex) {
    const nameWithoutSuffix = fileName.slice(0, lastUnderscoreIndex)
    const extension = fileName.slice(lastDotIndex)
    return `${nameWithoutSuffix}${extension}`
  }

  return fileName
}

export const formatDisplayDate = (dateString: string) => {
  const today = moment().format("YYYY-MM-DD")
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD")

  if (dateString === today) return "Today"
  if (dateString === yesterday) return "Yesterday"

  return moment(dateString).format("MMM DD, YYYY")
}

export const formatTimeSendAt = (dateString: string) => {
  return moment(dateString).format("h:mm A")
}
