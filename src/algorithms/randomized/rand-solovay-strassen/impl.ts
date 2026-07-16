// Solovay-Strassen 检验 · 实现
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
function jacobi(a: number, n: number): number {
  a = ((a % n) + n) % n;
  let result = 1;
  while (a !== 0) {
    while (a % 2 === 0) {
      a /= 2;
      if (n % 8 === 3 || n % 8 === 5) result = -result;
    }
    [a, n] = [n, a];
    if (a % 4 === 3 && n % 4 === 3) result = -result;
    a %= n;
  }
  return n === 1 ? result : 0;
}
export function solovayStrassen(n: number, witnesses: number[]): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  for (const a of witnesses) {
    const x = jacobi(a, n);
    if (x === 0) continue;
    const y = modPow(a, (n - 1) / 2, n);
    const expected = x === -1 ? n - 1 : 1;
    if (y !== expected) return false;
  }
  return true;
}
