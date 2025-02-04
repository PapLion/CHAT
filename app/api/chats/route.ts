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
    const chats = await db.all("SELECT * FROM chats ORDER BY created_at DESC")

    return NextResponse.json(chats)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener chats" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await auth(req)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name } = await req.json()
    const db = await openDb()

    const result = await db.run("INSERT INTO chats (name) VALUES (?)", [name])

    return NextResponse.json({ id: result.lastID, name })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear chat" }, { status: 500 })
  }
}

