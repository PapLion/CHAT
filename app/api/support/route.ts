import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    // Configurar el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Enviar el correo
    await transporter.sendMail({
      from: '"Chat Educativo" <noreply@chateducativo.com>',
      to: "estudiantedanilolopez@gmail.com",
      subject: "Nuevo mensaje de soporte",
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
      html: `<p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensaje:</strong> ${message}</p>`,
    })

    return NextResponse.json({ message: "Mensaje enviado correctamente" })
  } catch (error) {
    console.error("Error sending support message:", error)
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 })
  }
}

