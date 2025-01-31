import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  try {
    const user = await auth(req)
    if (!user || user.role !== "authority") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await openDb()
    const { id, action } = params

    let query
    switch (action) {
      case "ban":
        query = "UPDATE users SET is_banned = 1 WHERE id = ?"
        break
      case "unban":
        query = "UPDATE users SET is_banned = 0 WHERE id = ?"
        break
      case "mute":
        query = "UPDATE users SET is_muted = 1 WHERE id = ?"
        break
      case "unmute":
        query = "UPDATE users SET is_muted = 0 WHERE id = ?"
        break
      default:
        return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }

    await db.run(query, [id])

    return NextResponse.json({
      message: `Usuario ${action === "ban" || action === "mute" ? "" : "des"}${action === "ban" || action === "unban" ? "baneado" : "silenciado"} exitosamente`,
    })
  } catch (error) {
    return NextResponse.json({ error: `Error al ${params.action} usuario` }, { status: 500 })
  }
}

