import { useMemo } from 'react';

/**
 * Doodle pictures.
 * Every emoji in the content is redrawn as a hand-inked sticker: flat colours,
 * ink contour lines, a slight hand wobble and a cream die-cut border.
 * Generated once per emoji on a canvas and cached.
 */

const INK: [number, number, number] = [28, 19, 70];
const CREAM: [number, number, number] = [250, 244, 232];
const N = 168; // art size
const PAD = 14;
const OUT = N + PAD * 2;

const cache = new Map<string, string | null>();

function hash(s: string) {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function make(c = 1, w = c, h = c) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  return cv;
}

function tint(src: HTMLCanvasElement, rgb: [number, number, number]) {
  const t = make(1, src.width, src.height);
  const x = t.getContext('2d')!;
  x.drawImage(src, 0, 0);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  x.fillRect(0, 0, t.width, t.height);
  return t;
}

function ring(dst: CanvasRenderingContext2D, sil: HTMLCanvasElement, r: number, ox: number, oy: number) {
  const steps = 28;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    dst.drawImage(sil, ox + Math.cos(a) * r, oy + Math.sin(a) * r);
  }
}

function draw(emoji: string): string | null {
  try {
    // 1. draw the emoji big, find its bounding box
    const S = 300;
    const big = make(1, S, S);
    const bx = big.getContext('2d', { willReadFrequently: true })!;
    bx.font = `${S * 0.74}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif`;
    bx.textAlign = 'center';
    bx.textBaseline = 'middle';
    bx.fillText(emoji, S / 2, S / 2 + S * 0.05);
    const d = bx.getImageData(0, 0, S, S).data;
    let x0 = S, y0 = S, x1 = 0, y1 = 0;
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++)
        if (d[(y * S + x) * 4 + 3] > 30) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
    if (x1 <= x0 || y1 <= y0) return null;
    const bw = x1 - x0 + 1;
    const bh = y1 - y0 + 1;
    const sc = Math.min(N / bw, N / bh);
    const dw = Math.round(bw * sc);
    const dh = Math.round(bh * sc);

    // 2. fit into art canvas
    const art = make(1, N, N);
    const ax = art.getContext('2d', { willReadFrequently: true })!;
    ax.imageSmoothingQuality = 'high';
    ax.drawImage(big, x0, y0, bw, bh, Math.round((N - dw) / 2), Math.round((N - dh) / 2), dw, dh);

    // 3. flatten colours + ink contour lines
    const img = ax.getImageData(0, 0, N, N);
    const px = img.data;
    const q = new Uint8ClampedArray(px.length);
    const LV = 4;
    const step = 255 / (LV - 1);
    for (let i = 0; i < px.length; i += 4) {
      const a = px[i + 3];
      if (a < 40) {
        q[i + 3] = 0;
        continue;
      }
      // boost saturation a little, then posterize
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const m = (r + g + b) / 3;
      const k = 1.22;
      const rr = Math.max(0, Math.min(255, m + (r - m) * k));
      const gg = Math.max(0, Math.min(255, m + (g - m) * k));
      const bb = Math.max(0, Math.min(255, m + (b - m) * k));
      q[i] = Math.round(rr / step) * step;
      q[i + 1] = Math.round(gg / step) * step;
      q[i + 2] = Math.round(bb / step) * step;
      q[i + 3] = 255;
    }
    const out = new Uint8ClampedArray(q);
    const dist = (i: number, j: number) => Math.abs(q[i] - q[j]) + Math.abs(q[i + 1] - q[j + 1]) + Math.abs(q[i + 2] - q[j + 2]);
    for (let y = 1; y < N - 1; y++)
      for (let x = 1; x < N - 1; x++) {
        const i = (y * N + x) * 4;
        if (!q[i + 3]) continue;
        const r = i + 4;
        const b = i + N * 4;
        const edge = (q[r + 3] && dist(i, r) > 130) || (q[b + 3] && dist(i, b) > 130);
        if (edge) {
          out[i] = INK[0];
          out[i + 1] = INK[1];
          out[i + 2] = INK[2];
          out[i + 3] = 255;
        }
      }
    // thicken contours slightly
    const th = new Uint8ClampedArray(out);
    for (let y = 1; y < N - 1; y++)
      for (let x = 1; x < N - 1; x++) {
        const i = (y * N + x) * 4;
        if (!out[i + 3]) continue;
        const isInk = out[i] === INK[0] && out[i + 1] === INK[1] && out[i + 2] === INK[2];
        if (isInk) continue;
        const nb = [i - 4, i - N * 4];
        if (nb.some((j) => out[j + 3] && out[j] === INK[0] && out[j + 1] === INK[1] && out[j + 2] === INK[2])) {
          th[i] = INK[0];
          th[i + 1] = INK[1];
          th[i + 2] = INK[2];
        }
      }
    const flat = make(1, N, N);
    flat.getContext('2d')!.putImageData(new ImageData(th, N, N), 0, 0);

    // 4. cream die-cut border + ink outline
    const comp = make(1, OUT, OUT);
    const cx = comp.getContext('2d')!;
    const cream = tint(flat, CREAM);
    const ink = tint(flat, INK);
    ring(cx, cream, 10, PAD, PAD);
    ring(cx, cream, 6, PAD, PAD);
    ring(cx, ink, 3.2, PAD, PAD);
    cx.drawImage(flat, PAD, PAD);

    // 5. hand wobble
    const wob = make(1, OUT, OUT);
    const wx = wob.getContext('2d')!;
    const sd = hash(emoji);
    const ph1 = (sd % 628) / 100;
    const ph2 = ((sd >> 5) % 628) / 100;
    const src = cx.getImageData(0, 0, OUT, OUT);
    const dst = wx.createImageData(OUT, OUT);
    const A = 1.7;
    for (let y = 0; y < OUT; y++)
      for (let x = 0; x < OUT; x++) {
        const sx = Math.round(x + A * Math.sin(y / 11 + ph1));
        const sy = Math.round(y + A * Math.sin(x / 13 + ph2));
        if (sx < 0 || sy < 0 || sx >= OUT || sy >= OUT) continue;
        const si = (sy * OUT + sx) * 4;
        const di = (y * OUT + x) * 4;
        dst.data[di] = src.data[si];
        dst.data[di + 1] = src.data[si + 1];
        dst.data[di + 2] = src.data[si + 2];
        dst.data[di + 3] = src.data[si + 3];
      }
    wx.putImageData(dst, 0, 0);
    return wob.toDataURL('image/png');
  } catch {
    return null;
  }
}

export function doodleUrl(emoji: string): string | null {
  if (cache.has(emoji)) return cache.get(emoji)!;
  const u = draw(emoji);
  cache.set(emoji, u);
  return u;
}

const seg: { segment: (s: string) => Iterable<{ segment: string }> } | null =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new (Intl as unknown as { Segmenter: new (l?: string, o?: object) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter(undefined, { granularity: 'grapheme' })
    : null;

const PICT = /\p{Extended_Pictographic}|⃣/u;

export function emojiParts(text: string): string[] {
  const parts: string[] = [];
  if (seg) {
    for (const s of seg.segment(text)) if (PICT.test(s.segment)) parts.push(s.segment);
  } else {
    const m = text.match(/(\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*|\d️?⃣)/gu);
    if (m) parts.push(...m);
  }
  return parts;
}

/** A doodle picture for one or more emoji. */
export function Pic({ e, size = 64, className = '', style, flat = false }: { e: string; size?: number; className?: string; style?: React.CSSProperties; flat?: boolean }) {
  const parts = useMemo(() => emojiParts(e), [e]);
  const each = parts.length <= 1 ? size : parts.length === 2 ? size * 0.62 : size * 0.46;
  return (
    <span className={`pic ${flat ? 'flat' : ''} ${className}`} style={{ ...style, ['--s' as string]: `${size}px` }} aria-hidden>
      {parts.map((p, i) => {
        const u = doodleUrl(p);
        return u ? (
          <img key={i} src={u} width={each} height={each} alt="" draggable={false} style={{ width: each, height: each, animationDelay: `${i * 0.08}s` }} />
        ) : (
          <span key={i} style={{ fontSize: each * 0.8 }}>{p}</span>
        );
      })}
    </span>
  );
}
