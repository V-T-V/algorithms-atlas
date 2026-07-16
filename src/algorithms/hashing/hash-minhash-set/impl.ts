// MinHash · 实现
export interface MhHooks {
  onHash?: (i: number, aMin: number, bMin: number, match: boolean) => void;
  onConclude?: (estimate: number, actual: number) => void;
}
function makeHasher(seed: number): (x: number) => number {
  return (x: number) => {
    let h = seed;
    h = ((h ^ x) * 16777619) >>> 0;
    return h;
  };
}
export function minHashSimilarity(
  A: ReadonlySet<number>,
  B: ReadonlySet<number>,
  k: number,
  hooks: MhHooks = {},
): number {
  let matches = 0;
  for (let i = 0; i < k; i++) {
    const h = makeHasher(i + 1);
    let aMin = Infinity,
      bMin = Infinity;
    for (const x of A) aMin = Math.min(aMin, h(x));
    for (const x of B) bMin = Math.min(bMin, h(x));
    const m = aMin === bMin;
    if (m) matches++;
    hooks.onHash?.(i, aMin, bMin, m);
  }
  const estimate = matches / k;
  const inter = [...A].filter((x) => B.has(x)).length;
  const uni = new Set([...A, ...B]).size;
  const actual = uni > 0 ? inter / uni : 0;
  hooks.onConclude?.(estimate, actual);
  return estimate;
}
