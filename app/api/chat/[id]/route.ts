import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const chatId = params.id

    if (!chatId || !ObjectId.isValid(chatId)) {
      return NextResponse.json({ message: "Invalid chat ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userId = session.user.id

    // Check if the user is a participant in the chat
    const chat = await db.collection("chats").findOne({
      _id: new ObjectId(chatId),
      "participants.userId": new ObjectId(userId),
    })

    if (!chat) {
      return NextResponse.json({ message: "Chat not found or you don't have access" }, { status: 404 })
    }

    // Get messages for the chat
    const messages = await db
      .collection("messages")
      .find({ chatId: new ObjectId(chatId) })
      .sort({ timestamp: 1 })
      .toArray()

    // Mark messages as read
    await db.collection("messages").updateMany(
      {
        chatId: new ObjectId(chatId),
        "readBy.userId": { $ne: new ObjectId(userId) },
        "sender.userId": { $ne: new ObjectId(userId) },
      },
      {
        $push: { readBy: { userId: new ObjectId(userId), readAt: new Date() } },
      },
    )

    // Format messages for the frontend
    const formattedMessages = messages.map((message) => {
      const isCurrentUser = message.sender.userId.toString() === userId

      return {
        id: message._id.toString(),
        content: message.content,
        sender: message.sender.name,
        timestamp: message.timestamp,
        isCurrentUser,
      }
    })

    return NextResponse.json({ messages: formattedMessages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

