export interface XorHooks {
  onEmit?: (i: number, xor: number) => void;
}
export function xorDeltaEncode(values: number[], hooks: XorHooks = {}): number[] {
  return values.map((v, i) => {
    const x = i === 0 ? v : v ^ values[i - 1]!;
    hooks.onEmit?.(i, x);
    return x;
  });
}
