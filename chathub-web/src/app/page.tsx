import ChatList from "../components/chat-list"

export default function Home() {
  return (
    <div className="flex flex-row justify-between">
      <ChatList />
      <div>không có chat nào</div>
    </div>
  )
}
