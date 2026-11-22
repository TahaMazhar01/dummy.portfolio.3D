import * as React from "react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import styles from './StudioMotionHero.module.css';

type Stamp = { id: number; x: number; y: number; angle: number; kind: number };
const word = 'DESIGN';

// Original vector stickers: crisp at any size, with no image downloads.
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

export default function StudioMotionHero() {
  const stage = useRef<HTMLDivElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const serial = useRef(0);
  const last = useRef({ x: -999, y: -999, time: 0 });
  const reduced = useRef(true);
  const visible = useRef(false);
  const [ready, setReady] = useState(false);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const later = (fn: () => void, ms: number) => {
    const timer = setTimeout(() => { timers.current.delete(timer); fn(); }, ms);
    timers.current.add(timer);
  };
  const stamp = (x: number, y: number) => {
    if (reduced.current || !stage.current || !visible.current) return;
    const id = serial.current++;
    const box = stage.current.getBoundingClientRect();
    const margin = box.width < 600 ? 38 : 60;
    setStamps(items => [...items.slice(-9), { id, x: Math.max(margin, Math.min(box.width - margin, x)), y: Math.max(margin, Math.min(box.height - margin, y)), angle: (id * 37 % 55) - 27, kind: id % 7 }]);
    later(() => setStamps(items => items.filter(item => item.id !== id)), 1500);
  };
  const burst = () => {
    const box = stage.current?.getBoundingClientRect();
    if (!box || reduced.current) return;
    for (let i = 0; i < 5; i++) later(() => stamp(box.width * (.16 + i * .17), box.height * (.34 + (i % 2) * .3)), i * 100);
  };
  const reset = () => {
    letters.current.forEach(letter => { letter?.style.removeProperty('--stretch'); letter?.style.removeProperty('--lean'); });
    last.current = { x: -999, y: -999, time: 0 };
  };
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reduced.current = motion.matches; if (motion.matches) { reset(); setStamps([]); } };
    update();
    motion.addEventListener('change', update);
    const checkVisibility = () => {
      const box = stage.current?.getBoundingClientRect();
      if (!box) return;
      const shown = Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0));
      const inView = shown >= Math.min(box.height, innerHeight) * .2;
      if (inView) { visible.current = true; setReady(true); }
      else if (visible.current) { visible.current = false; setReady(false); reset(); setStamps([]); }
    };
    const observer = new IntersectionObserver(checkVisibility, { threshold: [0, .2] });
    const resize = new ResizeObserver(checkVisibility);
    if (stage.current) { observer.observe(stage.current); resize.observe(stage.current); }
    const initial = requestAnimationFrame(checkVisibility);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    return () => { cancelAnimationFrame(initial); observer.disconnect(); resize.disconnect(); window.removeEventListener('scroll', checkVisibility); window.removeEventListener('resize', checkVisibility); motion.removeEventListener('change', update); timers.current.forEach(clearTimeout); timers.current.clear(); };
  }, []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || reduced.current) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left, y = event.clientY - box.top;
    letters.current.forEach((letter, i) => {
      const distance = Math.abs(x / box.width - (i + .5) / word.length);
      letter?.style.setProperty('--stretch', String(.9 + Math.max(0, 1 - distance * 4) * .18));
      letter?.style.setProperty('--lean', `${(y / box.height - .5) * -14}deg`);
    });
    const now = performance.now();
    if (now - last.current.time > 75 && Math.hypot(x - last.current.x, y - last.current.y) > 65) {
      stamp(x, y); last.current = { x, y, time: now };
    }
  };
  return <section className={`studio-motion-hero ${styles.hero}`} aria-labelledby="studio-hero-title">
    <div className={styles.meta}><span>SARAH GUHAINA / DESIGN STUDIO</span></div>
    <div ref={stage} className={styles.stage} data-ready={ready} onPointerMove={move} onPointerLeave={reset} onPointerDown={event => { if (event.pointerType === 'touch') { const r = event.currentTarget.getBoundingClientRect(); stamp(event.clientX-r.left,event.clientY-r.top); } }}>
      <h2 id="studio-hero-title" className={styles.title} aria-label="Design">{word.split('').map((char,i)=><span className={styles.slot} key={i} style={{'--i':i} as CSSProperties}><span ref={el=>{letters.current[i]=el;}} className={styles.letter} aria-hidden="true"><span className={styles.reel}>{[0,1,2,3].map(copy=><span key={copy}>{char}</span>)}</span></span></span>)}</h2>
      <div className={styles.trail} aria-hidden="true">{stamps.map(item=><span className={styles.stamp} key={item.id} style={{left:item.x,top:item.y,'--angle':`${item.angle}deg`} as CSSProperties}><Sticker kind={item.kind}/></span>)}</div>
    </div>
    <div className={styles.playline}><span className={styles.hint}>MOVE YOUR CURSOR. LEAVE A LITTLE INSPIRATION.</span><span className={styles.touchHint}>TAP THE LETTERS. ADD A LITTLE MAGIC.</span><button className={styles.play} type="button" onClick={burst} aria-label="Play studio sticker animation">PLAY <span aria-hidden="true">✳</span></button></div>
    <div className={styles.bottom}><h3>Thoughtful ideas.<br/><em>Human experiences.</em></h3><p>I turn curious questions into thoughtful interfaces, bringing research, playful exploration and a little personality to every digital experience.</p><div className={styles.links}><a href="#projects">Explore my work <span aria-hidden="true">↗</span></a></div></div>
    <div className={styles.foot}><span>UX RESEARCH / UI DESIGN / CREATIVE EXPLORATION</span><span>A LITTLE CURIOSITY GOES A LONG WAY. ↓</span></div>
  </section>;
}
