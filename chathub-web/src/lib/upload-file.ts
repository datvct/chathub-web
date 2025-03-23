import { Aws } from "~/codegen/Aws"

const UploadFileInstance = new Aws({ baseUrl: process.env.API_URL })

export async function uploadFile(fileName: string, contentType: string, token?: string) {
  try {
    const response = await UploadFileInstance.getPreSignedUrl(
      { fileName, contentType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}
