import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()
    const db = await openDb()

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.run("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)", [
      email,
      hashedPassword,
      name,
      role,
    ])

    return NextResponse.json({ message: "Usuario registrado exitosamente" })
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}

