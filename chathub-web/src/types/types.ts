// File này dùng để config types khi call api về (Nói chung chung là tạo interface)
export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  LINK = "LINK",
}
export interface Friend {
  name: string
  dateOfBirth?: string | Date
  gender: "Male" | "Female"
  phone: string
  online?: boolean
  image: any
}

export interface ProfileData {
  displayName: string
  dateOfBirth?: string | Date
  gender: string
}
