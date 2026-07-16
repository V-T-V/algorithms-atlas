export interface SnHooks {
  onTag?: (tag: number, len: number) => void;
}
export function snappyEncode(data: number[], hooks: SnHooks = {}): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < data.length) {
    let best = 0;
    let bestLen = 0;
    const start = Math.max(0, i - 65535);
    for (let p = start; p < i; p++) {
      let l = 0;
      while (l < 64 && i + l < data.length && data[p + l] === data[i + l]) l++;
      if (l > bestLen && l >= 4) {
        bestLen = l;
        best = i - p;
      }
    }
    if (bestLen >= 4) {
      const tag = 1 | ((bestLen - 4) << 2) | ((best & 3) << 2 === 0 ? 0 : 0);
      out.push(1 | (((bestLen - 4) & 0x7) << 2), best & 0xff, (best >> 8) & 0xff);
      hooks.onTag?.(1, bestLen);
      i += bestLen;
    } else {
      let lit = 0;
      while (i + lit < data.length && lit < 60) lit++;
      out.push((lit - 1) << 2);
      for (let k = 0; k < lit; k++) out.push(data[i + k]!);
      hooks.onTag?.(0, lit);
      i += lit;
    }
  }
  return out;
}
