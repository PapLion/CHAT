import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const { db } = await connectToDatabase()

    // Obtener mensajes de todos los chats del usuario
    const messages = await db
      .collection("messages")
      .aggregate([
        {
          $lookup: {
            from: "chats",
            localField: "chatId",
            foreignField: "_id",
            as: "chat",
          },
        },
        {
          $match: {
            "chat.participants": {
              $elemMatch: { userId: new ObjectId(session.user.id) },
            },
          },
        },
        { $sort: { timestamp: -1 } },
        { $skip: offset },
        { $limit: limit },
      ])
      .toArray()

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { chatId, content } = await req.json()

    if (!chatId || !ObjectId.isValid(chatId)) {
      return NextResponse.json({ message: "Valid chat ID is required" }, { status: 400 })
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ message: "Message content is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Verificar que el usuario tiene acceso al chat
    const chat = await db.collection("chats").findOne({
      _id: new ObjectId(chatId),
      participants: { $elemMatch: { userId: new ObjectId(session.user.id) } },
    })

    if (!chat) {
      return NextResponse.json({ message: "Chat not found or access denied" }, { status: 404 })
    }

    // Crear nuevo mensaje
    const message = {
      chatId: new ObjectId(chatId),
      sender: {
        userId: new ObjectId(session.user.id),
        name: session.user.name,
        image: session.user.image,
      },
      content,
      timestamp: new Date(),
      readBy: [{ userId: new ObjectId(session.user.id), readAt: new Date() }],
    }

    const result = await db.collection("messages").insertOne(message)

    // Actualizar la última actividad del chat
    await db.collection("chats").updateOne({ _id: new ObjectId(chatId) }, { $set: { lastActivity: new Date() } })

    return NextResponse.json({
      message: "Message sent successfully",
      messageId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

