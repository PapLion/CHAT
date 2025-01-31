import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const db = await openDb()

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email])

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret", {
      expiresIn: "24h",
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}

