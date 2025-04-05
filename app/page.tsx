import { Rocketship } from "@/components/rocketship"
import { StarField } from "@/components/star-field"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white overflow-hidden">
      <StarField />
      <div className="text-center space-y-8 z-10">
        <Rocketship />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter animate-fade-in">coming soon.</h1>
      </div>
    </main>
  )
}

