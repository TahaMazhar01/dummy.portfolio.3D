import * as React from "react"
type Stamp = { id: number; x: number; y: number; angle: number; kind: number }
export default function HeroStickerTrail({ children, renderIcon }: { children: React.ReactNode; renderIcon: (kind: number) => React.ReactNode }) {
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
    <div className="mgn-sticker-trail" aria-hidden="true">{stamps.map(item => <span className="mgn-sticker" key={item.id} style={{left:item.x,top:item.y,'--angle':`${item.angle}deg`} as React.CSSProperties}>{renderIcon(item.kind)}</span>)}</div>
  </div>
}
