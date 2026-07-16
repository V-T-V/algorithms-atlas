export interface NsHooks {
  onEmit?: (n: number, nibbles: number[]) => void;
}
export function nibbleSplitEncode(values: number[], hooks: NsHooks = {}): number[] {
  const out: number[] = [];
  for (const v of values) {
    const nibs: number[] = [];
    let x = v;
    do {
      nibs.unshift(x & 0x7);
      x >>>= 3;
    } while (x > 0);
    nibs.forEach((n, i) => out.push(i === nibs.length - 1 ? n : n | 0x8));
    hooks.onEmit?.(v, nibs);
  }
  return out;
}
