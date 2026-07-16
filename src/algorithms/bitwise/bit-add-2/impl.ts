export interface BitAddHooks {
  onIter?: (i: number, a: number, b: number) => void;
}
export function addBit(a: number, b: number, hooks: BitAddHooks = {}): number {
  let x = a | 0,
    y = b | 0,
    i = 0;
  while (y !== 0) {
    hooks.onIter?.(i, x >>> 0, y >>> 0);
    const sum = (x ^ y) | 0;
    const carry = ((x & y) << 1) | 0;
    x = sum;
    y = carry;
    i++;
  }
  return x;
}
