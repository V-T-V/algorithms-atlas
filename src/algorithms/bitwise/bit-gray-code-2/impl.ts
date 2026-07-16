export interface GrayHooks {
  onResult?: (g: number) => void;
}
export function toGray(x: number, hooks: GrayHooks = {}): number {
  const g = ((x | 0) ^ ((x | 0) >>> 1)) >>> 0;
  hooks.onResult?.(g);
  return g;
}
export function fromGray(g: number): number {
  let b = g >>> 0;
  let mask = b >>> 1;
  while (mask !== 0) {
    b = b ^ mask;
    mask = mask >>> 1;
  }
  return b >>> 0;
}
