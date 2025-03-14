import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ChatPage from "@/components/chat-page"

export default async function ChatRoute() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <ChatPage user={session.user} />
}

