// 通用哈希族 · 实现
export interface UcHooks {
  onPick?: (a: number, b: number) => void;
  onHash?: (x: number, result: number) => void;
}
const P = 2147483647;
export function makeUniversalHasher(
  m: number,
  rng: () => number,
  hooks: UcHooks = {},
): (x: number) => number {
  const a = 1 + Math.floor(rng() * (P - 1));
  const b = Math.floor(rng() * P);
  hooks.onPick?.(a, b);
  return (x: number) => {
    const r = ((a * x + b) % P) % m;
    hooks.onHash?.(x, r);
    return r;
  };
}
export function universalCollisionRate(
  m: number,
  keys: readonly number[],
  rng: () => number,
): number {
  const h = makeUniversalHasher(m, rng);
  const slots = keys.map(h);
  let coll = 0;
  for (let i = 0; i < keys.length; i++)
    for (let j = i + 1; j < keys.length; j++) if (slots[i] === slots[j]) coll++;
  return coll / ((keys.length * (keys.length - 1)) / 2);
}
