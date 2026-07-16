// Rabin-Karp 滚动哈希 · 实现
export interface RkHooks {
  onWindow?: (start: number, hash: number) => void;
  onConclude?: (hashes: number[]) => void;
}
const BASE = 256,
  MOD = 1000000007;
export function rabinKarpRolling(s: string, m: number, hooks: RkHooks = {}): number[] {
  const hashes: number[] = [];
  if (s.length < m) return hashes;
  let h = 0,
    pow = 1;
  for (let i = 0; i < m - 1; i++) pow = (pow * BASE) % MOD;
  for (let i = 0; i < m; i++) h = (h * BASE + s.charCodeAt(i)) % MOD;
  hashes.push(h);
  hooks.onWindow?.(0, h);
  for (let i = 1; i + m <= s.length; i++) {
    h = (h - ((s.charCodeAt(i - 1) * pow) % MOD) + MOD) % MOD;
    h = (h * BASE + s.charCodeAt(i + m - 1)) % MOD;
    hashes.push(h);
    hooks.onWindow?.(i, h);
  }
  hooks.onConclude?.(hashes);
  return hashes;
}
