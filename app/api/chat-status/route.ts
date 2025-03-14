import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Obtener el estado de los chats del usuario
    const chatStatus = await db.collection("chatStatus").findOne({
      userId: session.user.id,
    })

    return NextResponse.json({ status: chatStatus || { userId: session.user.id, status: "online" } })
  } catch (error) {
    console.error("Error fetching chat status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { status } = await req.json()

    if (!status || !["online", "away", "busy", "offline"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Actualizar el estado del chat del usuario
    await db
      .collection("chatStatus")
      .updateOne({ userId: session.user.id }, { $set: { status, updatedAt: new Date() } }, { upsert: true })

    return NextResponse.json({ message: "Status updated successfully" })
  } catch (error) {
    console.error("Error updating chat status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

