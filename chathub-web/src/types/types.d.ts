// File này dùng để config types khi call api về (Nói chung chung là tạo interface)
interface Friend {
	name: string
	dateOfBirth?: string | Date
	gender: "Male" | "Female"
	phone: string
	online?: boolean
	image: any
}

interface ProfileData {
	displayName: string
	dateOfBirth?: string | Date
	gender: string
}