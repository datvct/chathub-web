import Image from "next/image"
import { Images } from "../constants/images"
import ChatList from "../components/chat-list"

export default function Home() {
  return (
    <div className="flex flex-row justify-between h-screen">
      <ChatList />
      <div className="flex flex-1 items-center justify-center relative">
        <Image 
          src={Images.Background} 
          alt="background-image" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0" 
        />
        <div className="absolute inset-0 bg-black opacity-30" />
      </div>
    </div>
  )
}
