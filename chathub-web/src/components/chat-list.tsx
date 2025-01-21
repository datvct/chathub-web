import Image from "next/image"
import { Images } from "../constants/images"
import "../styles/custom-scroll.css"
const ChatList = () => {
  const chats = [
    { id: 1, name: "Sweetie", message: "I love you so much!", time: "8:32 PM", type: "text", pinned: true },
    { id: 2, name: "Jane Cooper", message: "Photo", time: "3:27 PM", type: "photo", pinned: true },
    { id: 3, name: "Design Review Chat", message: "Document", time: "2:49 AM", type: "document", unread: 34 },
    { id: 4, name: "R4IN80W", message: "That is how you do it!", time: "7:21 PM", type: "text" },
    { id: 5, name: "ptec", message: "You: lets do this quick", time: "6:18 PM", type: "text" },
    { id: 6, name: "480 Design", message: "Check out this new claymorphism design!", time: "1:58 PM", type: "text" },
    { id: 7, name: "help! I'm in the hole", message: "", time: "10:54 AM", type: "text" },
    { id: 8, name: "kiguk", message: "Photo", time: "3:36 AM", type: "photo" },
    { id: 9, name: "iceChat", message: "I reeeeally love this animation!", time: "Thu", unread: 57 },
    { id: 10, name: "iceDSGN", message: "Happy New Year! 🎉", time: "Thu" },
  ]

  return (
    <div className="bg-[#240B48] text-white w-1/4 h-screen p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-start gap-5 mb-4">
        <Image src={Images.IconChatList} alt="Chat Icon" width={50} height={50} />
        <h1 className="text-[30px] font-bold">Chat</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded bg-purple-800 text-white placeholder-gray-400 rounded-lg"
        />
      </div>

      {/* Chat List */}
      <ul className="space-y-3 overflow-y-scroll custom-scrollbar h-[calc(100%-150px)]">
        {chats.map(chat => (
          <li
            key={chat.id}
            className={`flex items-center gap-3 p-2 rounded-lg 
            `}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center rounded-[100px]">
              {chat.name[0]}
            </div>
            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{chat.name}</span>
                <span className="text-[14px] text-[#838383]">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#838383] truncate">{chat.message}</p>
                {chat.unread && (
                  <span className="bg-[#0078D4] text-xs font-bold text-white rounded-[20px] px-1 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
            {/* Pin */}
            {chat.pinned && <Image src={Images.IconPin} alt="Pin Icon" width={20} height={20} />}
          </li>
        ))}
      </ul>

      {/* Floating Button */}
      <button className="absolute bottom-6 right-12 bg-[#8B6EB1] w-[70px] h-[70px] rounded-full flex items-center justify-center rounded-[100px] text-white text-[30px]">
        <Image src={Images.IconPlus} alt="Plus Icon" width={30} height={30} />
      </button>
    </div>
  )
}

export default ChatList
