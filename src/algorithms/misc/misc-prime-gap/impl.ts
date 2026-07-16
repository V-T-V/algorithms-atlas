// 素数间隙 · 实现
export interface PgHooks {
  onGap?: (p1: number, p2: number, gap: number) => void;
  onConclude?: (maxGap: number, twinCount: number) => void;
}
function sieve(limit: number): number[] {
  const isP = new Uint8Array(limit + 1).fill(1);
  isP[0] = isP[1] = 0;
  for (let i = 2; i * i <= limit; i++)
    if (isP[i]) for (let j = i * i; j <= limit; j += i) isP[j] = 0;
  const ps: number[] = [];
  for (let i = 2; i <= limit; i++) if (isP[i]) ps.push(i);
  return ps;
}
export function primeGaps(
  limit: number,
  hooks: PgHooks = {},
): { maxGap: number; twinCount: number } {
  const ps = sieve(limit);
  let maxGap = 0,
    twinCount = 0;
  for (let i = 0; i + 1 < ps.length; i++) {
    const g = ps[i + 1]! - ps[i]!;
    hooks.onGap?.(ps[i]!, ps[i + 1]!, g);
    if (g > maxGap) maxGap = g;
    if (g === 2) twinCount++;
  }
  hooks.onConclude?.(maxGap, twinCount);
  return { maxGap, twinCount };
}
