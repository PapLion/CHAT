import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend("re_YAuCXqRF_3CtYKB8KFyvtGPwsakef3Qkd")

export const config = {
  runtime: "edge",
}

/**
 * Maneja la solicitud POST para enviar un email de soporte.
 *
 * @param {NextRequest} req - Objeto de solicitud de Next.js.
 * @returns {Promise<NextResponse>} Respuesta JSON indicando el éxito o fallo del envío del email.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["estudiantedanilolopez@gmail.com"],
      subject: "Nueva solicitud de soporte",
      html: `
        <h1>Nueva solicitud de soporte</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Email sent successfully", data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}