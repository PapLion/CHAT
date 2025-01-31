import jwt from "jsonwebtoken"
import type { NextApiRequest } from "next"

export async function authenticateToken(req: NextApiRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) return resolve(null)

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
      if (err) return resolve(null)
      resolve(user)
    })
  })
}

