// 费马素性检验 · 实现
function modPow(base: number, exp: number, m: number): number {
  base = ((base % m) + m) % m;
  let r = 1;
  while (exp > 0) {
    if (exp & 1) r = (r * base) % m;
    base = (base * base) % m;
    exp = Math.floor(exp / 2);
  }
  return r;
}
export function fermatIsPrime(n: number, witnesses: number[]): boolean {
  if (n < 2) return false;
  for (const a of witnesses) {
    if (a % n === 0) continue;
    if (modPow(a, n - 1, n) !== 1) return false;
  }
  return true;
}
