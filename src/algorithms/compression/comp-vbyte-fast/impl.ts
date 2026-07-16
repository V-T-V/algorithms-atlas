export interface VbHooks {
  onEmit?: (v: number, bytes: number) => void;
}
export function vbyteEncode(values: number[], hooks: VbHooks = {}): number[] {
  const out: number[] = [];
  for (const v of values) {
    const buf: number[] = [];
    let x = v;
    do {
      buf.push(x & 0x7f);
      x >>>= 7;
    } while (x > 0);
    buf.forEach((b, i) => {
      out.push(i === buf.length - 1 ? b : b | 0x80);
    });
    hooks.onEmit?.(v, buf.length);
  }
  return out;
}
export function vbyteDecode(bytes: number[]): number[] {
  const out: number[] = [];
  let v = 0;
  let shift = 0;
  for (const b of bytes) {
    v |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) {
      out.push(v);
      v = 0;
      shift = 0;
    } else shift += 7;
  }
  return out;
}
