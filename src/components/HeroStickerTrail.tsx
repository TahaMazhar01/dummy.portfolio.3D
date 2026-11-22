import * as React from "react"
type Stamp = { id: number; x: number; y: number; angle: number; kind: number }
function Sticker({ kind }: { kind: number }) {
  return <svg viewBox="0 0 100 100" fill="none" stroke="var(--mgn-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {kind === 0 && <><circle cx="50" cy="50" r="42" fill="#73e0d3"/><ellipse cx="35" cy="39" rx="5" ry="9" fill="var(--mgn-ink)"/><ellipse cx="65" cy="39" rx="5" ry="9" fill="var(--mgn-ink)"/><path d="M25 58Q50 91 76 57Z" fill="var(--mgn-paper)"/><path d="M27 64h46"/></>}
    {kind === 1 && <><rect x="9" y="17" width="82" height="68" rx="12" fill="var(--mgn-paper)"/><path d="M9 35h82"/><circle cx="20" cy="26" r="2" fill="var(--mgn-pen)"/><circle cx="30" cy="26" r="2" fill="var(--mgn-pen)"/><path d="m36 47-14 12 14 12m28-24 14 12-14 12m-10-28-8 31" stroke="var(--mgn-pen)" strokeWidth="5"/></>}
    {kind === 2 && <><path d="m50 6 10 24 26-10-10 27 19 16-29 5-3 27-20-20-25 13 6-29L5 44l28-8Z" fill="#d9d0ed"/><path d="m37 49 9 10 18-22" strokeWidth="6"/></>}
    {kind === 3 && <><rect x="17" y="27" width="66" height="58" rx="17" fill="#b9a5d6"/><path d="M50 27V13m-38 34H5v19h7m76-19h7v19h-7"/><circle cx="50" cy="10" r="5" fill="#73e0d3"/><circle cx="35" cy="49" r="9" fill="var(--mgn-paper)"/><circle cx="65" cy="49" r="9" fill="var(--mgn-paper)"/><circle cx="36" cy="50" r="3" fill="var(--mgn-ink)"/><circle cx="64" cy="50" r="3" fill="var(--mgn-ink)"/><rect x="32" y="67" width="36" height="9" rx="4" fill="var(--mgn-paper)"/><path d="M44 68v7m12-7v7"/></>}
    {kind === 4 && <><path d="M29 64 16 82l23-8m20-11 22-8-7 22-15-14" fill="#d9d0ed"/><path d="M29 62Q37 18 83 12q7 42-36 62Z" fill="var(--mgn-paper)"/><circle cx="63" cy="35" r="10" fill="#73e0d3"/><path d="m30 72-13 18 23-10" stroke="var(--mgn-pen)" strokeWidth="7"/></>}
    {kind === 5 && <><rect x="26" y="7" width="49" height="85" rx="12" fill="#73e0d3"/><rect x="32" y="20" width="37" height="55" rx="4" fill="var(--mgn-paper)"/><path d="M44 14h13m-11 68h10M39 36h23m-23 9h15"/><circle cx="50" cy="84" r="2" fill="var(--mgn-ink)"/></>}
    {kind === 6 && <><path d="M5 22h87v57H5Z" fill="var(--mgn-paper)"/><path d="m5 79 7 8h86V29l-6-7m0 57 6 8" fill="#73e0d3"/><text x="48" y="64" textAnchor="middle" fill="var(--mgn-ink)" stroke="none" fontFamily="Arial,sans-serif" fontSize="43" fontWeight="900">HI!</text></>}
  </svg>;
}

export default function HeroStickerTrail({ children }: { children: React.ReactNode }) {
  const stage = React.useRef<HTMLDivElement>(null)
  const serial = React.useRef(0)
  const last = React.useRef({ x: -999, y: -999, time: 0 })
  const reduced = React.useRef(true)
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  const [stamps, setStamps] = React.useState<Stamp[]>([])
  React.useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { reduced.current = media.matches; if (media.matches) setStamps([]) }
    update()
    media.addEventListener('change', update)
    return () => { media.removeEventListener('change', update); timers.current.forEach(clearTimeout); timers.current.clear() }
  }, [])
  const stamp = (x: number, y: number) => {
    if (reduced.current || !stage.current) return
    const id = serial.current++
    const box = stage.current.getBoundingClientRect()
    const margin = box.width < 600 ? 28 : 48
    setStamps(items => [...items.slice(-8), { id, x: Math.max(margin, Math.min(box.width-margin,x)), y: Math.max(margin,Math.min(box.height-margin,y)), angle: (id*37%55)-27, kind:id%7 }])
    const timer = setTimeout(() => { timers.current.delete(timer); setStamps(items => items.filter(item => item.id!==id)) },1500)
    timers.current.add(timer)
  }
  const pointer = (event: React.PointerEvent<HTMLDivElement>, force = false) => {
    if (!stage.current || reduced.current) return
    const box = stage.current.getBoundingClientRect()
    const x=event.clientX-box.left, y=event.clientY-box.top, now=performance.now()
    if(force || (now-last.current.time>75 && Math.hypot(x-last.current.x,y-last.current.y)>48)) {
      stamp(x,y); last.current={x,y,time:now}
    }
  }
  return <div ref={stage} className="mgn-title-stage" tabIndex={0} role="group" aria-label="Interactive Portfolio title: move the pointer, tap, or press Enter for stickers"
    onPointerEnter={event => { if(event.pointerType!=='touch') pointer(event,true) }}
    onPointerMove={event => { if(event.pointerType!=='touch') pointer(event) }}
    onPointerDown={event => pointer(event,true)}
    onKeyDown={event => {if(event.target===event.currentTarget && (event.key==='Enter'||event.key===' ')){event.preventDefault();const box=stage.current!.getBoundingClientRect();stamp(box.width*.35,box.height*.4);stamp(box.width*.65,box.height*.6)}}}>
    {children}
    <div className="mgn-sticker-trail" aria-hidden="true">{stamps.map(item => <span className="mgn-sticker" key={item.id} style={{left:item.x,top:item.y,'--angle':`${item.angle}deg`} as React.CSSProperties}><Sticker kind={item.kind}/></span>)}</div>
  </div>
}
