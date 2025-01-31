export interface User {
  id: number
  email: string
  name: string
  role: "student" | "parent" | "authority"
}

export interface Message {
  id: number
  content: string
  sender_id: number
  sender_name: string
  created_at: string
}

