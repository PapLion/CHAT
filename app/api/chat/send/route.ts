import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { chatId, content, attachments } = await request.json()

    if (!chatId || !content) {
      return NextResponse.json({ message: "Chat ID and content are required" }, { status: 400 })
    }

    if (!ObjectId.isValid(chatId)) {
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

    // Create the message
    const message = {
      chatId: new ObjectId(chatId),
      content,
      sender: {
        userId: new ObjectId(userId),
        name: session.user.name,
      },
      timestamp: new Date(),
      readBy: [{ userId: new ObjectId(userId), readAt: new Date() }],
      attachments: attachments || [],
    }

    const result = await db.collection("messages").insertOne(message)

    // Update the chat's updatedAt timestamp
    await db.collection("chats").updateOne({ _id: new ObjectId(chatId) }, { $set: { updatedAt: new Date() } })

    return NextResponse.json({
      message: "Message sent successfully",
      messageId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

