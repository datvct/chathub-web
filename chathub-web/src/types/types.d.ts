// File này dùng để config types khi call api về (Nói chung chung là tạo interface)
interface Friend {
    userId: number | string
    name: string
    dateOfBirth?: string | Date
    gender: "Male" | "Female"
    phoneNumber: string
    status?: "Online" | "Offline"
    avatar?: any
}

interface ProfileData {
    displayName: string
    dateOfBirth?: string | Date
    gender: "Male" | "Female"
    phone?: string
    status?: "Online" | "Offline"
    image?: any
}

export type {
    Friend,
    ProfileData
}
