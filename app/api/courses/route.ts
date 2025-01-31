import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const db = await openDb()
    const courses = await db.all("SELECT * FROM courses ORDER BY name, parallel")

    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener cursos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await auth(req)
    if (!user || user.role !== "authority") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name, parallel, year, specialization } = await req.json()
    const db = await openDb()

    const result = await db.run("INSERT INTO courses (name, parallel, year, specialization) VALUES (?, ?, ?, ?)", [
      name,
      parallel,
      year,
      specialization,
    ])

    // Create a chat for the new course
    await db.run("INSERT INTO chats (name, type, course_id) VALUES (?, ?, ?)", [
      `Chat de ${name} ${parallel} - ${specialization}`,
      "course",
      result.lastID,
    ])

    return NextResponse.json({ id: result.lastID, name, parallel, year, specialization })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear curso" }, { status: 500 })
  }
}

