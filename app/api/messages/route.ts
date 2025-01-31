import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const user = await auth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await openDb()
    const messages = await db.all(`
      SELECT messages.*, users.name as sender_name 
      FROM messages 
      JOIN users ON messages.sender_id = users.id 
      ORDER BY messages.created_at DESC 
      LIMIT 50
    `)

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await auth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { content } = await req.json()
    const db = await openDb()

    const result = await db.run("INSERT INTO messages (sender_id, content) VALUES (?, ?)", [user.userId, content])

    return NextResponse.json({
      id: result.lastID,
      content,
      sender_id: user.userId,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 })
  }
}

