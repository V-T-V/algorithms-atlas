export interface BacHooks {
  onBit?: (bit: number, low: number, high: number) => void;
}
export function arithmeticBinaryEncode(bits: number[], p1: number, hooks: BacHooks = {}): number {
  let low = 0,
    high = 1;
  for (const b of bits) {
    const range = high - low;
    const split = low + range * p1;
    if (b === 1) {
      low = split;
    } else {
      high = split;
    }
    hooks.onBit?.(b, low, high);
  }
  return (low + high) / 2;
}
export function arithmeticBinaryDecode(code: number, p1: number, n: number): number[] {
  const out: number[] = [];
  let low = 0,
    high = 1;
  for (let i = 0; i < n; i++) {
    const range = high - low;
    const split = low + range * p1;
    if (code < split) {
      out.push(0);
      high = split;
    } else {
      out.push(1);
      low = split;
    }
  }
  return out;
}
