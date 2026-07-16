export interface Lz4Hooks {
  onMatch?: (offset: number, len: number) => void;
  onLiteral?: (len: number) => void;
}
export function lz4BlockEncode(data: number[], minMatch: number, hooks: Lz4Hooks = {}): number[] {
  const out: number[] = [];
  let i = 0;
  let litStart = 0;
  const hash = new Map<number, number>();
  while (i < data.length) {
    if (i + minMatch <= data.length) {
      const h = (data[i]! * 2654435761) & 0xffffff;
      const prev = hash.get(h);
      if (prev !== undefined && i - prev < 65536) {
        let m = 0;
        while (i + m < data.length && data[prev + m] === data[i + m] && m < 255 + minMatch) m++;
        if (m >= minMatch) {
          const litLen = i - litStart;
          const mLen = m - minMatch;
          const token = (Math.min(litLen, 15) << 4) | Math.min(mLen, 15);
          out.push(token);
          if (litLen >= 15) out.push(...extraLen(litLen - 15));
          for (let k = litStart; k < i; k++) out.push(data[k]!);
          hooks.onLiteral?.(litLen);
          out.push((i - prev) & 0xff, (i - prev) >> 8);
          if (mLen >= 15) out.push(...extraLen(mLen - 15));
          hooks.onMatch?.(i - prev, m);
          i += m;
          litStart = i;
          hash.set(h, i);
          continue;
        }
      }
      hash.set(h, i);
    }
    i++;
  }
  const litLen = data.length - litStart;
  out.push(Math.min(litLen, 15) << 4);
  if (litLen >= 15) out.push(...extraLen(litLen - 15));
  for (let k = litStart; k < data.length; k++) out.push(data[k]!);
  return out;
}
function extraLen(n: number): number[] {
  const r: number[] = [];
  while (n >= 255) {
    r.push(255);
    n -= 255;
  }
  r.push(n);
  return r;
}
