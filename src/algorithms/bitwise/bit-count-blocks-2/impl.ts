export interface BlocksHooks {
  onRun?: (start: number) => void;
  onResult?: (c: number) => void;
}
export function countBlocks(x: number, hooks: BlocksHooks = {}): number {
  let v = x >>> 0;
  let count = 0;
  let prev = 0;
  for (let i = 0; i < 32; i++) {
    const bit = v & 1;
    if (bit === 1 && prev === 0) {
      count++;
      hooks.onRun?.(i);
    }
    prev = bit;
    v >>>= 1;
    if (v === 0 && prev === 0) break;
  }
  hooks.onResult?.(count);
  return count;
}
