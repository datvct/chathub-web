import ChatList from "../components/chat-list"
import SignInPage from "./sign-in/page"
import SignUpPage from "./sign-up/page"
import ResetPasswordPage from "./reset-password/page"

export default function Home() {
  return (
    <div className="flex flex-row justify-between">
      <SignInPage />

    </div>
  )
}

