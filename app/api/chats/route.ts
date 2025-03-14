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

    const { db } = await connectToDatabase()

    // Obtener todos los chats donde el usuario es participante
    const chats = await db
      .collection("chats")
      .find({
        participants: { $elemMatch: { userId: new ObjectId(session.user.id) } },
      })
      .sort({ lastActivity: -1 })
      .toArray()

    return NextResponse.json({ chats })
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, participants } = await req.json()

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ message: "At least one participant is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Crear un nuevo chat
    const chat = {
      name: name || "New Chat",
      participants: [
        { userId: new ObjectId(session.user.id) },
        ...participants.map((p: string) => ({ userId: new ObjectId(p) })),
      ],
      createdAt: new Date(),
      lastActivity: new Date(),
    }

    const result = await db.collection("chats").insertOne(chat)

    return NextResponse.json({
      message: "Chat created successfully",
      chatId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

