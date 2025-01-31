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
    let chats

    if (user.role === "authority") {
      // Authorities can see all chats
      chats = await db.all("SELECT * FROM chats")
    } else if (user.role === "student") {
      // Students can see their course chat
      chats = await db.all(`SELECT * FROM chats WHERE course_id = ?`, [user.course_id])
    } else if (user.role === "parent") {
      // Parents can see their children's course chats and the general parents chat
      chats = await db.all(
        `SELECT DISTINCT c.* FROM chats c
         LEFT JOIN parent_course_access pca ON c.course_id = pca.course_id
         WHERE (pca.parent_id = ? AND c.type = 'course') OR c.type = 'parents'`,
        [user.id],
      )
    }

    return NextResponse.json(chats)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener chats" }, { status: 500 })
  }
}

