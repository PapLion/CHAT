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

    // Count total messages sent by the user
    const messageCount = await db.collection("messages").countDocuments({
      "sender.userId": new ObjectId(userId),
    })

    // Count active chats (chats with messages in the last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const activeChatsResult = await db
      .collection("chats")
      .aggregate([
        {
          $match: {
            "participants.userId": new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "_id",
            foreignField: "chatId",
            as: "recentMessages",
          },
        },
        {
          $match: {
            "recentMessages.timestamp": { $gte: oneWeekAgo },
          },
        },
        {
          $count: "count",
        },
      ])
      .toArray()

    const activeChats = activeChatsResult.length > 0 ? activeChatsResult[0].count : 0

    return NextResponse.json({
      messageCount,
      activeChats,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

