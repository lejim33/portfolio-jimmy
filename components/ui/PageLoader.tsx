'use client';

import { useEffect, useRef, useState } from 'react';

const ICONS = [
  { label: 'instagram', bg: '#E1306C', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>` },
  { label: 'linkedin', bg: '#0A66C2', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` },
  { label: 'tiktok', bg: '#010101', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.86a8.17 8.17 0 004.78 1.52V6.93a4.85 4.85 0 01-1.01-.24z"/></svg>` },
  { label: 'youtube', bg: '#FF0000', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>` },
  { label: 'facebook', bg: '#1877F2', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>` },
  { label: 'mail', bg: '#4444ff', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
  { label: 'dm', bg: '#8b5cf6', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>` },
  { label: 'like', bg: '#f43f5e', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>` },
  { label: 'comment', bg: '#10b981', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>` },
  { label: 'share', bg: '#f97316', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>` },
  { label: 'notif', bg: '#eab308', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
  { label: 'hashtag', bg: '#06b6d4', fg: '#fff', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="22" height="22"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>` },
];

const N_ICONS = ICONS.length;

const LINK_PAIRS: [number, number][] = [];
for (let i = 0; i < N_ICONS; i++) {
  LINK_PAIRS.push([i, (i + 1) % N_ICONS]);
  if (i % 3 === 0) LINK_PAIRS.push([i, (i + 4) % N_ICONS]);
}

const NODE_META = ICONS.map((_, i) => ({
  fixedAngle: (i / N_ICONS) * Math.PI * 2 - Math.PI / 2,
  fixedR: 115 + (i % 3) * 35,
  floatAmpX: 6 + Math.random() * 8,
  floatAmpY: 8 + Math.random() * 10,
  floatFreqX: 0.00035 + Math.random() * 0.00025,
  floatFreqY: 0.00028 + Math.random() * 0.0002,
  floatPhaseX: Math.random() * Math.PI * 2,
  floatPhaseY: Math.random() * Math.PI * 2,
  driftSpeed: (Math.random() - 0.5) * 0.00009,
  radiusAmp: 10 + Math.random() * 14,
  radiusFreq: 0.00025 + Math.random() * 0.00018,
  radiusPhase: Math.random() * Math.PI * 2,
  rotAmp: 3 + Math.random() * 3,
  rotFreq: 0.00018 + Math.random() * 0.00012,
  rotPhase: Math.random() * Math.PI * 2,
}));

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const exitOverlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const underlineFillRef = useRef<HTMLDivElement>(null);
  const nameBlockRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>(new Array(N_ICONS).fill(null));
  const linkRefs = useRef<(SVGLineElement | null)[]>(new Array(LINK_PAIRS.length).fill(null));
  const charRefs = useRef<(HTMLSpanElement | null)[]>(new Array(12).fill(null));
  const containerRef = useRef<HTMLDivElement>(null);
  const aliveRef = useRef(true);
  const mainRafRef = useRef(0);

  useEffect(() => {
    if (sessionStorage.getItem('loaderShown')) {
      setHidden(true);
      return;
    }

    // Prevent scroll while loader is visible
    document.body.style.overflow = 'hidden';
    aliveRef.current = true;

    // ── EASING ──
    const E = {
      outExpo:   (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      outBack:   (t: number) => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
      outQuart:  (t: number) => 1 - Math.pow(1 - t, 4),
      inOutQ:    (t: number) => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
      inQuart:   (t: number) => t * t * t * t,
    };

    function go({ from = 0, to = 1, dur, delay = 0, fn = E.outExpo, tick, done }: {
      from?: number; to?: number; dur: number; delay?: number;
      fn?: (t: number) => number;
      tick: (v: number, raw: number) => void;
      done?: () => void;
    }) {
      const t0 = performance.now() + delay;
      function frame(now: number) {
        if (!aliveRef.current) return;
        if (now < t0) { requestAnimationFrame(frame); return; }
        const raw = Math.min((now - t0) / dur, 1);
        tick(from + (to - from) * fn(raw), raw);
        if (raw < 1) requestAnimationFrame(frame);
        else if (done) done();
      }
      requestAnimationFrame(frame);
    }

    // ── PARTICLES BACKGROUND ──
    const cv = canvasRef.current!;
    const ctx = cv.getContext('2d')!;
    let W = 0, H = 0;
    type Pt = { x: number; y: number; r: number; vx: number; vy: number; a: number; p: number; ps: number };
    let pts: Pt[] = [];

    function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
    function mkPts() {
      pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + .4,
        vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
        a: Math.random() * .4 + .1,
        p: Math.random() * Math.PI * 2, ps: .006 + Math.random() * .01,
      }));
    }
    function drawParticles() {
      if (!aliveRef.current) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.p += p.ps;
        const al = p.a * (.6 + .4 * Math.sin(p.p));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,100,255,${al})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5; if (p.y > H + 5) p.y = -5;
      }
      requestAnimationFrame(drawParticles);
    }
    resize(); mkPts(); drawParticles();
    const handleResize = () => { resize(); mkPts(); };
    window.addEventListener('resize', handleResize);

    // ── MAIN LOOP ──
    let globalTime = 0, lastNow: number | null = null, loopAlive = true;
    let masterAlpha = 0, convergeT = 0, disperseT = 0;
    const currentPos: { x: number; y: number }[] = new Array(N_ICONS).fill(null).map(() => ({ x: 0, y: 0 }));

    function mainLoop(now: number) {
      if (!aliveRef.current) return;
      if (!lastNow) lastNow = now;
      const dt = Math.min(now - lastNow, 50);
      lastNow = now; globalTime += dt;

      const W = window.innerWidth, H = window.innerHeight;
      const CX = W / 2, CY = H / 2;

      NODE_META.forEach((nd, i) => {
        const ease = 1 - convergeT;
        const currentAngle = nd.fixedAngle + globalTime * nd.driftSpeed * ease;
        const currentR = nd.fixedR + Math.sin(globalTime * nd.radiusFreq + nd.radiusPhase) * nd.radiusAmp * ease;
        const baseX = CX + Math.cos(currentAngle) * currentR;
        const baseY = CY + Math.sin(currentAngle) * currentR;
        const floatX = Math.sin(globalTime * nd.floatFreqX + nd.floatPhaseX) * nd.floatAmpX * ease;
        const floatY = Math.sin(globalTime * nd.floatFreqY + nd.floatPhaseY) * nd.floatAmpY * ease;
        const ox = baseX + floatX, oy = baseY + floatY;
        const tx = CX - 24, ty = CY - 24;
        const px = ox + (tx - ox) * convergeT, py = oy + (ty - oy) * convergeT;
        const dDist = 280 + i * 20;
        const fpx = px + Math.cos(nd.fixedAngle) * dDist * disperseT;
        const fpy = py + Math.sin(nd.fixedAngle) * dDist * disperseT;
        const alpha = masterAlpha * (1 - disperseT * 1.2);
        const el = nodeRefs.current[i];
        if (el) {
          el.style.left = fpx + 'px';
          el.style.top = fpy + 'px';
          el.style.opacity = String(Math.max(0, alpha));
          const sc = 1 + Math.sin(globalTime * 0.0006 + i * 0.9) * 0.04;
          const rot = Math.sin(globalTime * nd.rotFreq + nd.rotPhase) * nd.rotAmp * ease;
          el.style.transform = `scale(${sc}) rotate(${rot}deg)`;
        }
        const svgSize = Math.min(W, H);
        currentPos[i] = { x: (fpx + 24 - CX) / svgSize * 500, y: (fpy + 24 - CY) / svgSize * 500 };
      });

      const linkAlpha = masterAlpha * (1 - convergeT) * (1 - disperseT);
      LINK_PAIRS.forEach(([a, b], i) => {
        const pa = currentPos[a], pb = currentPos[b];
        const el = linkRefs.current[i];
        if (!pa || !pb || !el) return;
        el.setAttribute('x1', String(pa.x)); el.setAttribute('y1', String(pa.y));
        el.setAttribute('x2', String(pb.x)); el.setAttribute('y2', String(pb.y));
        el.setAttribute('opacity', String(linkAlpha * 0.9));
      });

      if (loopAlive) {
        mainRafRef.current = requestAnimationFrame(mainLoop);
      } else {
        nodeRefs.current.forEach(el => { if (el) el.style.opacity = '0'; });
        linkRefs.current.forEach(el => { if (el) el.setAttribute('opacity', '0'); });
      }
    }

    // ── TIMELINE ──
    const allChars = charRefs.current.filter(Boolean) as HTMLSpanElement[];
    const jimmy = allChars.slice(0, 5);
    const guillot = allChars.slice(5);
    const iconColors = ICONS.map(ic => ic.bg);
    const charColors = allChars.map((_, i) => iconColors[i % iconColors.length]);

    allChars.forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(18px) scale(0.88)';
      c.style.filter = 'blur(8px)';
      c.style.color = '';
    });
    const badge = badgeRef.current;
    const subtitle = subtitleRef.current;
    const underlineFill = underlineFillRef.current;
    const exitOverlay = exitOverlayRef.current;
    if (badge) { badge.style.opacity = '0'; badge.style.transform = 'translateY(8px)'; }
    if (subtitle) { subtitle.style.opacity = '0'; subtitle.style.transform = 'translateY(8px)'; }
    if (underlineFill) { underlineFill.style.opacity = '0'; underlineFill.style.transform = 'scaleX(0)'; }
    if (exitOverlay) exitOverlay.style.opacity = '0';

    mainRafRef.current = requestAnimationFrame(mainLoop);

    // Phase 1 : fade-in icons
    go({ dur: 1600, delay: 0, fn: E.outQuart, tick: (v) => { masterAlpha = v; } });

    // Convergence
    setTimeout(() => {
      go({ from: 0, to: 1, dur: 1200, fn: E.inOutQ, tick: (v) => { convergeT = v; } });
    }, 1650);

    // Flash + disperse
    setTimeout(() => {
      nodeRefs.current.forEach(el => {
        if (!el) return;
        el.style.transition = 'transform 0.18s ease-out';
        el.style.transform = 'scale(1.5)';
        setTimeout(() => { if (el) { el.style.transition = 'none'; el.style.transform = 'scale(1)'; } }, 180);
      });
      go({ from: 0, to: 1, dur: 800, fn: E.outQuart, tick: (v) => { disperseT = v; }, done() { loopAlive = false; } });
    }, 2850);

    // Badge
    go({ from: 0, to: 1, dur: 600, delay: 3150, fn: E.outExpo, tick: (v) => {
      if (badge) { badge.style.opacity = String(v); badge.style.transform = `translateY(${(1 - v) * 10}px)`; }
    }});

    // Jimmy
    jimmy.forEach((ch, i) => {
      ch.style.color = charColors[i];
      go({ from: 0, to: 1, dur: 700, delay: 3400 + i * 110, fn: E.outBack, tick: (v) => {
        ch.style.opacity = String(v);
        ch.style.transform = `translateY(${(1 - v) * 18}px) scale(${.88 + v * .12})`;
        ch.style.filter = `blur(${(1 - v) * 8}px)`;
      }});
    });

    // Guillot
    guillot.forEach((ch, i) => {
      ch.style.color = charColors[5 + i];
      go({ from: 0, to: 1, dur: 720, delay: 4010 + i * 100, fn: E.outBack, tick: (v) => {
        ch.style.opacity = String(v);
        ch.style.transform = `translateY(${(1 - v) * 18}px) scale(${.88 + v * .12})`;
        ch.style.filter = `blur(${(1 - v) * 8}px)`;
      }});
    });

    // Color flashes
    allChars.forEach(ch => {
      const numFlashes = Math.random() < 0.5 ? 1 : 2;
      for (let f = 0; f < numFlashes; f++) {
        const flashDelay = 4550 + Math.random() * 600 + f * 300;
        setTimeout(() => {
          if (!aliveRef.current) return;
          const newColor = iconColors[Math.floor(Math.random() * iconColors.length)];
          ch.style.transition = 'color 0.3s ease';
          ch.style.color = newColor;
          setTimeout(() => { ch.style.transition = 'none'; }, 320);
        }, flashDelay);
      }
    });

    // Colors → black
    setTimeout(() => {
      allChars.forEach((ch, i) => {
        const computed = ch.style.color;
        let sc: { r: number; g: number; b: number };
        if (computed.startsWith('rgb')) {
          const m = computed.match(/\d+/g)!;
          sc = { r: +m[0], g: +m[1], b: +m[2] };
        } else {
          const hex = charColors[i];
          sc = { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
        }
        const ec = { r: 12, g: 12, b: 30 };
        go({ from: 0, to: 1, dur: 1000, delay: i * 45, fn: E.inOutQ, tick: (v) => {
          const r = Math.round(sc.r + (ec.r - sc.r) * v);
          const g = Math.round(sc.g + (ec.g - sc.g) * v);
          const b = Math.round(sc.b + (ec.b - sc.b) * v);
          ch.style.color = `rgb(${r},${g},${b})`;
        }});
      });
    }, 5350);

    // Underline
    go({ from: 0, to: 1, dur: 600, delay: 6450, fn: E.outExpo, tick: (v) => {
      if (underlineFill) { underlineFill.style.opacity = String(v); underlineFill.style.transform = `scaleX(${v})`; }
    }});

    // Subtitle
    go({ from: 0, to: 1, dur: 550, delay: 6700, fn: E.outExpo, tick: (v) => {
      if (subtitle) { subtitle.style.opacity = String(v); subtitle.style.transform = `translateY(${(1 - v) * 10}px)`; }
    }});

    // Micro-pulse
    setTimeout(() => {
      const nb = nameBlockRef.current;
      if (!nb) return;
      nb.style.transition = 'transform .24s cubic-bezier(.34,1.56,.64,1)';
      nb.style.transform = 'scale(1.03)';
      setTimeout(() => { if (nb) nb.style.transform = 'scale(1)'; }, 260);
    }, 7150);

    // EXIT
    setTimeout(() => {
      allChars.forEach((ch, i) => {
        go({ from: 0, to: 1, dur: 500, delay: i * 30, fn: E.outExpo, tick: (v) => {
          ch.style.opacity = String(1 - v);
          ch.style.transform = `translateY(${-v * 50}px) scale(${1 - v * .15})`;
          ch.style.filter = `blur(${v * 8}px)`;
        }});
      });
      [badge, subtitle].forEach(el => {
        if (!el) return;
        go({ from: 1, to: 0, dur: 380, delay: 60, fn: E.outExpo, tick: (v) => { el.style.opacity = String(v); }});
      });
      if (underlineFill) {
        go({ from: 1, to: 0, dur: 380, delay: 90, fn: E.outExpo, tick: (v) => {
          underlineFill.style.opacity = String(v);
          underlineFill.style.transform = `scaleX(${v})`;
        }});
      }
      go({ from: 0, to: 1, dur: 600, delay: 350, fn: E.inOutQ,
        tick: (v) => { if (exitOverlay) exitOverlay.style.opacity = String(v); },
        done() {
          // Fade the entire container to transparent, revealing the page beneath
          document.body.style.overflow = '';
          go({ from: 1, to: 0, dur: 700, delay: 80, fn: E.inOutQ,
            tick: (v) => {
              const el = containerRef.current;
              if (el) {
                el.style.opacity = String(v);
                el.style.transform = `scale(${1 + (1 - v) * 0.015})`;
              }
            },
            done() {
              sessionStorage.setItem('loaderShown', '1');
              setHidden(true);
            },
          });
        },
      });
    }, 8650);

    return () => {
      aliveRef.current = false;
      document.body.style.overflow = '';
      cancelAnimationFrame(mainRafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (hidden) return null;

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#eeeef8', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif", willChange: 'opacity, transform' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800;900&display=swap');
        .pl-icon { position:fixed;display:flex;align-items:center;justify-content:center;border-radius:18px;width:48px;height:48px;opacity:0;pointer-events:none;z-index:10;will-change:transform,opacity;box-shadow:0 4px 20px rgba(68,68,255,0.15); }
        .pl-char { display:inline-block;font-size:clamp(62px,11.5vw,132px);font-weight:900;color:#0c0c1e;letter-spacing:-0.03em;opacity:0;will-change:transform,opacity,filter; }
        .pl-bdot { width:6px;height:6px;border-radius:50%;background:#4444ff;animation:plBlink 1.4s ease-in-out infinite; }
        @keyframes plBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div ref={exitOverlayRef} style={{ position: 'fixed', inset: 0, background: '#eeeef8', zIndex: 50, opacity: 0, pointerEvents: 'none' }} />

      {/* Orbit SVG */}
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        <svg style={{ position: 'absolute', width: '100vmin', height: '100vmin', overflow: 'visible' }} viewBox="-250 -250 500 500">
          <defs>
            <filter id="plLinkBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>
          <g>
            {LINK_PAIRS.map((_, i) => (
              <line
                key={i}
                ref={el => { linkRefs.current[i] = el; }}
                stroke="rgba(120,120,255,0.25)"
                strokeWidth="0.8"
                filter="url(#plLinkBlur)"
                opacity="0"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Icon nodes */}
      {ICONS.map((ic, i) => (
        <div
          key={i}
          ref={el => { nodeRefs.current[i] = el; }}
          className="pl-icon"
          style={{ background: ic.bg, color: ic.fg }}
          dangerouslySetInnerHTML={{ __html: ic.svg }}
        />
      ))}

      {/* Name section */}
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 20 }}>
        <div ref={badgeRef} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #a0a0ee', borderRadius: 999, padding: '6px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#4444ff', textTransform: 'uppercase', opacity: 0, marginBottom: 28 }}>
          <span className="pl-bdot" /> Bonjour, je suis
        </div>
        <div ref={nameBlockRef} style={{ textAlign: 'center', lineHeight: 1 }}>
          <span style={{ display: 'block' }}>
            {'Jimmy'.split('').map((ch, i) => (
              <span key={i} ref={el => { charRefs.current[i] = el; }} className="pl-char">{ch}</span>
            ))}
          </span>
          <span style={{ display: 'block', height: '0.05em' }} />
          <span style={{ display: 'block' }}>
            {'Guillot'.split('').map((ch, i) => (
              <span key={i} ref={el => { charRefs.current[5 + i] = el; }} className="pl-char">{ch}</span>
            ))}
          </span>
          <div style={{ width: '100%', height: 3, marginTop: 14, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
            <div ref={underlineFillRef} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #4444ff, #6666ff)', transformOrigin: 'left', transform: 'scaleX(0)', opacity: 0, borderRadius: 2 }} />
          </div>
        </div>
        <div ref={subtitleRef} style={{ fontSize: 'clamp(11px, 1.4vw, 14px)', fontWeight: 700, color: '#4444ff', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0, marginTop: 20 }}>
          Étudiant en BTS Communication
        </div>
      </div>
    </div>
  );
}
