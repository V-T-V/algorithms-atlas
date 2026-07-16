export interface CarryHooks {
  onCarry?: (idx: number, bit: number) => void;
}
export function carryPropagate(bits: number[], hooks: CarryHooks = {}): number[] {
  const out = [...bits];
  for (let i = 0; i + 1 < out.length; i++) {
    const cur = out[i]! | 0;
    if (cur >= 2) {
      const carry = Math.floor(cur / 2);
      out[i] = cur % 2;
      out[i + 1] = (out[i + 1]! | 0) + carry;
      hooks.onCarry?.(i, out[i]!);
    }
  }
  return out;
}
