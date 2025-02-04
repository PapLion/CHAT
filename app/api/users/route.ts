import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const user = await auth(req)
    if (!user || user.role !== "authority") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await openDb()
    const users = await db.all("SELECT id, email, name, role FROM users")

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

