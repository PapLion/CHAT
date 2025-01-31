import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const user = await auth(req)
    if (!user || user.role !== "authority") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { content } = await req.json()
    const db = await openDb()

    // Insert the announcement
    const result = await db.run("INSERT INTO announcements (content, created_by) VALUES (?, ?)", [content, user.id])

    // Get all chat IDs
    const chats = await db.all("SELECT id FROM chats")

    // Insert the announcement as a message in all chats
    for (const chat of chats) {
      await db.run("INSERT INTO messages (sender_id, content, chat_id) VALUES (?, ?, ?)", [
        user.id,
        `[ANUNCIO] ${content}`,
        chat.id,
      ])
    }

    return NextResponse.json({ message: "Anuncio enviado exitosamente" })
  } catch (error) {
    return NextResponse.json({ error: "Error al enviar anuncio" }, { status: 500 })
  }
}

