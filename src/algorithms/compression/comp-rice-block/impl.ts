export interface RbHooks {
  onBlock?: (start: number, k: number, bits: number) => void;
}
export function riceBlockEncode(
  values: number[],
  blockSize: number,
  kMax: number,
  hooks: RbHooks = {},
): { k: number[]; bits: number } {
  const ks: number[] = [];
  let total = 0;
  for (let s = 0; s < values.length; s += blockSize) {
    const block = values.slice(s, s + blockSize);
    let bestK = 0;
    let bestBits = Infinity;
    for (let k = 0; k <= kMax; k++) {
      const bits = block.reduce((sum, v) => sum + (v >> k) + 1 + k, 0);
      if (bits < bestBits) {
        bestBits = bits;
        bestK = k;
      }
    }
    ks.push(bestK);
    total += bestBits;
    hooks.onBlock?.(s, bestK, bestBits);
  }
  return { k: ks, bits: total };
}
