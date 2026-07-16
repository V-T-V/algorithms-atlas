const PC: number[] = new Array(256);
for (let i = 0; i < 256; i++) PC[i] = (i & 1) + (PC[i >>> 1] ?? 0);
export interface PopcountHooks {
  onByte?: (pos: number, cnt: number) => void;
  onResult?: (r: number) => void;
}
export function popcountTbl(x: number, hooks: PopcountHooks = {}): number {
  let v = x >>> 0,
    sum = 0;
  for (let i = 0; i < 4; i++) {
    const byte = v & 0xff;
    const c = PC[byte]!;
    hooks.onByte?.(i, c);
    sum += c;
    v >>>= 8;
  }
  hooks.onResult?.(sum);
  return sum;
}
