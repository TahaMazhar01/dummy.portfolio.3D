import * as React from "react"

export default function HeroDesignProcess() {
  const ref = React.useRef<HTMLElement>(null)
  const [active, setActive] = React.useState(false)
  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <figure ref={ref} className="mgn-process" data-active={active}>
    <svg viewBox="0 0 520 128" className="mgn-ink" role="img" aria-label="My design process: research, sketch, design">
      <g className="mgn-process-step" style={{ '--step': 0 } as React.CSSProperties}>
        <path d="M25 16q20-4 51-1l-1 43q-27 3-50 0zM33 26h20m-20 8h15m-15 8h12" />
        <circle cx="69" cy="45" r="17" /><path d="m81 58 12 14M61 43q3-7 10-5" />
        <path className="mgn-process-draw" pathLength={1} d="m34 51 5 5 9-12" />
        <text x="59" y="109">Research</text>
      </g>
      <path className="mgn-process-flow" d="M111 45q42-13 87-1" /><path d="m189 37 10 7-11 5" />
      <g className="mgn-process-step" style={{ '--step': 1 } as React.CSSProperties}>
        <path d="M227 15q27-3 57 0l-1 53q-31-2-57 0zM228 27h54M234 21h2m5 0h2" />
        <path d="M235 35h17v15h-17zM259 36h15m-15 7h12M235 57h37" />
        <g className="mgn-process-pencil"><path d="m267 56 22-28 7 6-22 28-10 5zM286 32l7 6m-26 18 7 6m-10 5 4-10" /></g>
        <text x="259" y="109">Sketch</text>
      </g>
      <path className="mgn-process-flow" d="M316 44q43 13 87-2" /><path d="m393 38 11 4-8 9" />
      <g className="mgn-process-step" style={{ '--step': 2 } as React.CSSProperties}>
        <path d="M442 10q-9-1-9 8v48q0 8 9 8h28q8 0 8-8V18q0-8-8-8zM448 17h15M448 66h15" />
        <path d="M441 25h29v28h-29zM448 32h15m-15 7h9" />
        <path className="mgn-process-draw" pathLength={1} d="m450 45 5 5 12-15" />
        <path d="m491 15 2-7m3 14 8-2m-9 10 7 4" />
        <text x="457" y="109">Design</text>
      </g>
    </svg>
    <figcaption>From a curious question to a thoughtful experience.</figcaption>
  </figure>
}
