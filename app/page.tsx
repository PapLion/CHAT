import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-white">
      <h1 className="text-5xl text-[#4e73df] mb-8 animate-fadeInUp">Welcome to Aula</h1>
      <p className="text-lg text-gray-800 mb-8 animate-fadeInUp delay-100">
        Your digital classroom for better learning!
      </p>
      <Link href="/login" className="animate-fadeInUp delay-200">
        <Button className="h-12 px-8 bg-[#4e73df] hover:bg-[#36b9cc] text-white text-lg">Get Started</Button>
      </Link>
    </div>
  )
}

