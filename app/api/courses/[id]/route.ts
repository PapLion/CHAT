import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await auth(req)
    if (!user || user.role !== "authority") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await openDb()

    // Delete associated chats
    await db.run("DELETE FROM chats WHERE course_id = ?", [params.id])

    // Delete course
    await db.run("DELETE FROM courses WHERE id = ?", [params.id])

    return NextResponse.json({ message: "Curso eliminado exitosamente" })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar curso" }, { status: 500 })
  }
}

