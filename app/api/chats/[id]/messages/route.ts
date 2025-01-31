import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await auth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await openDb()
    const messages = await db.all(
      `SELECT messages.*, users.username 
       FROM messages 
       JOIN users ON messages.user_id = users.id 
       WHERE chat_id = ? 
       ORDER BY created_at ASC`,
      [params.id],
    )

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await auth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { content } = await req.json()
    const db = await openDb()

    const result = await db.run("INSERT INTO messages (chat_id, user_id, content) VALUES (?, ?, ?)", [
      params.id,
      user.userId,
      content,
    ])

    return NextResponse.json({
      id: result.lastID,
      content,
      user_id: user.userId,
      chat_id: params.id,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 })
  }
}

