import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const userId = session.user.id

    // Get all chats where the user is a participant
    const chats = await db
      .collection("chats")
      .find({
        participants: { $elemMatch: { userId: new ObjectId(userId) } },
      })
      .toArray()

    // Format the chats for the frontend
    const formattedChats = await Promise.all(
      chats.map(async (chat) => {
        // Get the last message in the chat
        const lastMessage = await db
          .collection("messages")
          .find({ chatId: chat._id })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray()

        // Get the other participants (not the current user)
        const otherParticipants = chat.participants.filter((p: any) => p.userId.toString() !== userId)

        // Get user details for other participants
        const otherUsers = await db
          .collection("users")
          .find({
            _id: { $in: otherParticipants.map((p: any) => p.userId) },
          })
          .toArray()

        // Count unread messages
        const unreadCount = await db.collection("messages").countDocuments({
          chatId: chat._id,
          "readBy.userId": { $ne: new ObjectId(userId) },
          "sender.userId": { $ne: new ObjectId(userId) },
        })

        return {
          id: chat._id.toString(),
          name: chat.name || otherUsers.map((u: any) => u.name).join(", "),
          lastMessage: lastMessage.length > 0 ? lastMessage[0].content : "No messages yet",
          timestamp: lastMessage.length > 0 ? lastMessage[0].timestamp : chat.createdAt,
          unreadCount,
        }
      }),
    )

    return NextResponse.json({ chats: formattedChats })
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { participants, name } = await request.json()

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ message: "Participants are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userId = session.user.id

    // Format participants to include the current user
    const formattedParticipants = [
      { userId: new ObjectId(userId) },
      ...participants.map((p: string) => ({ userId: new ObjectId(p) })),
    ]

    // Create a new chat
    const result = await db.collection("chats").insertOne({
      name,
      participants: formattedParticipants,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Chat created successfully",
        chatId: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

