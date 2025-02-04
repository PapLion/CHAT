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
    const result = await db.get("SELECT value FROM settings WHERE key = 'chat_open'")
    const chatAbierto = result?.value === "true"

    return NextResponse.json({ chatAbierto })
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el estado del chat" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await auth(req)
    if (!user || user.role !== "authority") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { chatAbierto } = await req.json()
    const db = await openDb()

    await db.run("UPDATE settings SET value = ? WHERE key = 'chat_open'", [chatAbierto ? "true" : "false"])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el estado del chat" }, { status: 500 })
  }
}

