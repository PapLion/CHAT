import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const { email, password, name, role, courseId } = await req.json()
    const db = await openDb()

    const hashedPassword = await bcrypt.hash(password, 10)

    if (role === "authority") {
      // For authorities, we don't associate a course
      await db.run("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)", [
        email,
        hashedPassword,
        name,
        role,
      ])
    } else {
      // For students and parents, we associate a course
      await db.run("INSERT INTO users (email, password, name, role, course_id) VALUES (?, ?, ?, ?, ?)", [
        email,
        hashedPassword,
        name,
        role,
        courseId,
      ])

      // If it's a parent, we need to create an entry in parent_course_access
      if (role === "parent") {
        const user = await db.get("SELECT id FROM users WHERE email = ?", [email])
        await db.run("INSERT INTO parent_course_access (parent_id, course_id) VALUES (?, ?)", [user.id, courseId])
      }
    }

    return NextResponse.json({ message: "Usuario registrado exitosamente" })
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}

