import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import type { User } from "./types"

export async function auth(req: NextRequest): Promise<User | null> {
  const token = req.headers.get("authorization")?.split(" ")[1]

  if (!token) {
    return null
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret") as User
  } catch (error) {
    return null
  }
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
  localStorage.removeItem("userRole")
}

