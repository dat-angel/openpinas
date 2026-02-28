"use client"

import { useEffect, useRef, useState } from "react"
import { Network, Users, MapPin, Database } from "lucide-react"

const STATS = [
  { label: "Dynasties Tracked", value: 71, icon: Network },
  { label: "Members Tracked", value: 148, icon: Users },
  { label: "Provinces Mapped", value: 71, icon: MapPin },
  { label: "Open Datasets", value: 8, icon: Database },
]

function useCountUp(target: number, isVisible: boolean, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)

      if (current !== start) {
        start = current
        setCount(current)
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, isVisible, duration])

  return count
}

function StatItem({
  stat,
  isVisible,
}: {
  stat: (typeof STATS)[0]
  isVisible: boolean
}) {
  const count = useCountUp(stat.value, isVisible)

  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <stat.icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
          {isVisible ? count : 0}
          {stat.value >= 100 ? "+" : ""}
        </p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </div>
  )
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="px-4 py-6 lg:px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 rounded-xl border border-border bg-card px-6 py-5 lg:grid-cols-4 lg:gap-8">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
