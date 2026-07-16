// Generator for 45 numerical algorithms (55→100). Uses 'num-' prefix (unique vs existing).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'numerical';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: '${zh}', en: '${en}' },
  summary: { zh: '${sumZh}', en: '${sumEn}' },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// trace: import+setup line, scalar expr, note
function mt(impLine, expr, fzh, fen) {
  return `// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
${impLine}
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = ${expr};
  rec.begin({ zh: '${fzh}', en: '${fen}' }).setAux([{ label: '值', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`;
}

const ALGS = [];

// 1. num-quadratic-formula
ALGS.push({
  id: 'num-quadratic-formula',
  m: ['求根公式', 'Quadratic Formula', '求解一元二次方程 ax²+bx+c=0。', 'Solve ax²+bx+c=0 via the quadratic formula.',
    '判别式 Δ=b²-4ac：Δ>0 两实根，Δ=0 重根，Δ<0 共轭复根。', 'Discriminant Δ=b²-4ac: two real / double / conjugate-complex roots.', 'O(1)', 'O(1)', ['numerical', 'root-finding', 'algebra']],
  impl: `// 求根公式 · 实现
export interface QuadResult { roots: number[][]; discriminant: number; }
export function quadraticFormula(a: number, b: number, c: number): QuadResult {
  if (a === 0) throw new RangeError('a 不能为 0');
  const d = b * b - 4 * a * c;
  if (d > 0) { const s = Math.sqrt(d); return { roots: [[(-b + s) / (2 * a)], [(-b - s) / (2 * a)]], discriminant: d }; }
  if (d === 0) { const r = -b / (2 * a); return { roots: [[r === 0 ? 0 : r]], discriminant: 0 }; }
  const re0 = -b / (2 * a), re = re0 === 0 ? 0 : re0, im = Math.sqrt(-d) / (2 * a);
  return { roots: [[re, im], [re, -im]], discriminant: d };
}`,
  trace: mt("import { quadraticFormula } from './impl.ts';", "quadraticFormula(1,-3,2).roots.length", '求根完成', 'roots found'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quadraticFormula } from '../../src/algorithms/numerical/num-quadratic-formula/impl.ts';
test('两实根', () => { assert.deepEqual(quadraticFormula(1, -3, 2).roots, [[2], [1]]); });
test('复根', () => {
  const r = quadraticFormula(1, 0, 1).roots;
  assert.deepEqual(r, [[0, 1], [0, -1]]);
});
test('a=0 报错', () => { assert.throws(() => quadraticFormula(0, 1, 1), RangeError); });`,
});

// 2. num-cubic-newton
ALGS.push({
  id: 'num-cubic-newton',
  m: ['牛顿法求立方根', 'Cube Root via Newton', '用牛顿迭代 x←(2x+a/x²)/3 求 ∛a。', 'Newton iteration x←(2x+a/x²)/3 for ∛a.',
    '收敛阶 2，迭代至 |x³-a|<tol。', 'Quadratic convergence; iterate until |x³-a|<tol.', 'O(log(1/ε))', 'O(1)', ['numerical', 'root-finding', 'newton']],
  impl: `// 牛顿法求立方根 · 实现
export function cubeRootNewton(a: number, tol = 1e-10): number {
  if (a === 0) return 0;
  const sign = a < 0 ? -1 : 1;
  let x = sign * Math.abs(a) ** (1 / 3);
  for (let i = 0; i < 100; i++) {
    const x2 = x * x;
    if (x2 === 0) break;
    const nx = (2 * x + a / x2) / 3;
    if (Math.abs(nx - x) < tol) { x = nx; break; }
    x = nx;
  }
  return x;
}`,
  trace: mt("import { cubeRootNewton } from './impl.ts';", "Math.round(cubeRootNewton(27)*1000)/1000", '迭代完成', 'iteration done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cubeRootNewton } from '../../src/algorithms/numerical/num-cubic-newton/impl.ts';
test('∛27=3', () => { assert.ok(Math.abs(cubeRootNewton(27) - 3) < 1e-8); });
test('∛-8=-2', () => { assert.ok(Math.abs(cubeRootNewton(-8) - (-2)) < 1e-8); });
test('∛0=0', () => { assert.equal(cubeRootNewton(0), 0); });`,
});

// 3. num-binomial-coeff
ALGS.push({
  id: 'num-binomial-coeff',
  m: ['二项式系数', 'Binomial Coefficient', '计算 C(n,k)=n!/(k!(n-k)!)。', 'Compute C(n,k)=n!/(k!(n-k)!).',
    '用乘法累积避免大阶乘溢出。', 'Accumulate via multiplication to avoid large-factorial overflow.', 'O(k)', 'O(1)', ['numerical', 'combinatorics']],
  impl: `// 二项式系数 · 实现
export function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n || n < 0) throw new RangeError('非法参数');
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) { r = (r * (n - i)) / (i + 1); }
  return Math.round(r);
}`,
  trace: mt("import { binomialCoeff } from './impl.ts';", "binomialCoeff(10,3)", '系数计算完成', 'coefficient done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binomialCoeff } from '../../src/algorithms/numerical/num-binomial-coeff/impl.ts';
test('C(10,3)=120', () => { assert.equal(binomialCoeff(10, 3), 120); });
test('C(5,0)=1', () => { assert.equal(binomialCoeff(5, 0), 1); });
test('C(5,5)=1', () => { assert.equal(binomialCoeff(5, 5), 1); });
test('非法报错', () => { assert.throws(() => binomialCoeff(2, 5), RangeError); });`,
});

// 4. num-fibonacci-fast
ALGS.push({
  id: 'num-fibonacci-fast',
  m: ['快速斐波那契', 'Fast Fibonacci (Matrix)', '用快速幂矩阵法求第 n 个斐波那契数。', 'nth Fibonacci via fast matrix exponentiation.',
    '利用 [[1,1],[1,0]]ⁿ 的快速幂，O(log n)。', 'Fast exponentiation of [[1,1],[1,0]]ⁿ in O(log n).', 'O(log n)', 'O(1)', ['numerical', 'sequence']],
  impl: `// 快速斐波那契（矩阵快速幂）· 实现
export function fibFast(n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  const mul = (A: number[][], B: number[][]): number[][] => [
    [A[0]![0]! * B[0]![0]! + A[0]![1]! * B[1]![0]!, A[0]![0]! * B[0]![1]! + A[0]![1]! * B[1]![1]!],
    [A[1]![0]! * B[0]![0]! + A[1]![1]! * B[1]![0]!, A[1]![0]! * B[0]![1]! + A[1]![1]! * B[1]![1]!],
  ];
  let result = [[1, 0], [0, 1]];
  let base = [[1, 1], [1, 0]];
  let e = n;
  while (e > 0) { if (e & 1) result = mul(result, base); base = mul(base, base); e >>= 1; }
  return result[0]![1]!;
}`,
  trace: mt("import { fibFast } from './impl.ts';", "fibFast(10)", '计算完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibFast } from '../../src/algorithms/numerical/num-fibonacci-fast/impl.ts';
test('F(0)=0', () => { assert.equal(fibFast(0), 0); });
test('F(1)=1', () => { assert.equal(fibFast(1), 1); });
test('F(10)=55', () => { assert.equal(fibFast(10), 55); });
test('F(20)=6765', () => { assert.equal(fibFast(20), 6765); });`,
});

// 5. num-factorial-iter
ALGS.push({
  id: 'num-factorial-iter',
  m: ['阶乘（迭代）', 'Iterative Factorial', 'n!=1·2·…·n 的迭代实现。', 'Compute n!=1·2·…·n iteratively.',
    '从 1 累乘到 n，0!=1。', 'Multiply 1..n; 0!=1 by definition.', 'O(n)', 'O(1)', ['numerical', 'combinatorics']],
  impl: `// 阶乘（迭代）· 实现
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new RangeError('n 必须非负整数');
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}`,
  trace: mt("import { factorial } from './impl.ts';", "factorial(5)", '阶乘完成', 'factorial done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { factorial } from '../../src/algorithms/numerical/num-factorial-iter/impl.ts';
test('5!=120', () => { assert.equal(factorial(5), 120); });
test('0!=1', () => { assert.equal(factorial(0), 1); });
test('负数报错', () => { assert.throws(() => factorial(-1), RangeError); });`,
});

// 6. num-gcd-euclid
ALGS.push({
  id: 'num-gcd-euclid',
  m: ['欧几里得 GCD', 'Euclidean GCD', '辗转相除求最大公约数。', 'Greatest common divisor via the Euclidean algorithm.',
    'gcd(a,b)=gcd(b,a mod b)，终止于 b=0。', 'gcd(a,b)=gcd(b,a mod b) until b=0.', 'O(log min(a,b))', 'O(1)', ['numerical', 'number-theory']],
  impl: `// 欧几里得 GCD · 实现
export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) { [a, b] = [b, a % b]; }
  return a;
}
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}`,
  trace: mt("import { gcd } from './impl.ts';", "gcd(48,18)", 'GCD 完成', 'GCD done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gcd, lcm } from '../../src/algorithms/numerical/num-gcd-euclid/impl.ts';
test('gcd(48,18)=6', () => { assert.equal(gcd(48, 18), 6); });
test('gcd(7,13)=1', () => { assert.equal(gcd(7, 13), 1); });
test('lcm(4,6)=12', () => { assert.equal(lcm(4, 6), 12); });`,
});

// 7. num-modular-exp
ALGS.push({
  id: 'num-modular-exp',
  m: ['快速模幂', 'Modular Exponentiation', '计算 (base^exp) mod m 的快速幂。', 'Compute (base^exp) mod m via fast exponentiation.',
    '平方-乘法，O(log exp)，避免大数溢出。', 'Square-and-multiply in O(log exp); avoids overflow.', 'O(log exp)', 'O(1)', ['numerical', 'number-theory', 'modular']],
  impl: `// 快速模幂 · 实现
export function modPow(base: number, exp: number, m: number): number {
  if (m <= 0) throw new RangeError('模数必须为正');
  if (exp < 0) throw new RangeError('指数必须非负');
  base = ((base % m) + m) % m;
  let result = 1;
  while (exp > 0) { if (exp & 1) result = (result * base) % m; base = (base * base) % m; exp = Math.floor(exp / 2); }
  return result;
}`,
  trace: mt("import { modPow } from './impl.ts';", "modPow(2,10,1000)", '模幂完成', 'modpow done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modPow } from '../../src/algorithms/numerical/num-modular-exp/impl.ts';
test('2^10 mod 1000 = 24', () => { assert.equal(modPow(2, 10, 1000), 24); });
test('3^0 mod 7 = 1', () => { assert.equal(modPow(3, 0, 7), 1); });`,
});

// 8. num-sieve-eratosthenes
ALGS.push({
  id: 'num-sieve-eratosthenes',
  m: ['埃氏筛法', 'Sieve of Eratosthenes', '枚举不超过 n 的所有素数。', 'List all primes up to n.',
    '标记每个素数的倍数为合数，剩余为素数。', 'Mark multiples of each prime as composite.', 'O(n log log n)', 'O(n)', ['numerical', 'prime', 'sieve']],
  impl: `// 埃氏筛法 · 实现
export function sievePrimes(n: number): number[] {
  if (n < 2) return [];
  const sieve = new Array<boolean>(n + 1).fill(true);
  sieve[0] = false; sieve[1] = false;
  for (let p = 2; p * p <= n; p++) if (sieve[p]) for (let m = p * p; m <= n; m += p) sieve[m] = false;
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) if (sieve[i]) primes.push(i);
  return primes;
}`,
  trace: mt("import { sievePrimes } from './impl.ts';", "sievePrimes(20).length", '筛法完成', 'sieve done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sievePrimes } from '../../src/algorithms/numerical/num-sieve-eratosthenes/impl.ts';
test('≤20 的素数', () => { assert.deepEqual(sievePrimes(20), [2, 3, 5, 7, 11, 13, 17, 19]); });
test('<2 返回空', () => { assert.deepEqual(sievePrimes(1), []); });`,
});

// 9. num-is-prime-trial
ALGS.push({
  id: 'num-is-prime-trial',
  m: ['试除判素', 'Trial-Division Primality', '用试除法判断素数。', 'Test primality by trial division.',
    '试除 2..√n，整除即为合数。', 'Try divisors 2..√n; any divisor means composite.', 'O(√n)', 'O(1)', ['numerical', 'prime']],
  impl: `// 试除判素 · 实现
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}`,
  trace: mt("import { isPrime } from './impl.ts';", "isPrime(17)", '判素完成', 'primality done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPrime } from '../../src/algorithms/numerical/num-is-prime-trial/impl.ts';
test('17 是素数', () => { assert.equal(isPrime(17), true); });
test('15 不是', () => { assert.equal(isPrime(15), false); });
test('1 不是', () => { assert.equal(isPrime(1), false); });`,
});

// 10. num-log-taylor
ALGS.push({
  id: 'num-log-taylor',
  m: ['ln 的泰勒级数', 'Natural Log Taylor Series', '用泰勒级数近似 ln(1+x)。', 'Approximate ln(1+x) via Taylor series.',
    'ln(1+x)=x-x²/2+x³/3-...，对 |x|<1 收敛。', 'ln(1+x)=x-x²/2+x³/3-...; converges for |x|<1.', 'O(n)', 'O(1)', ['numerical', 'series']],
  impl: `// ln 的泰勒级数 · 实现
export function lnTaylor(x: number, terms = 50): number {
  if (x <= -1) throw new RangeError('x 必须 > -1');
  let sum = 0;
  for (let n = 1; n <= terms; n++) sum += (n % 2 === 1 ? 1 : -1) * Math.pow(x, n) / n;
  return sum;
}`,
  trace: mt("import { lnTaylor } from './impl.ts';", "Math.round(lnTaylor(0.5)*1000)/1000", '级数近似完成', 'series done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lnTaylor } from '../../src/algorithms/numerical/num-log-taylor/impl.ts';
test('ln(1.5) 近似', () => { assert.ok(Math.abs(lnTaylor(0.5) - Math.log(1.5)) < 1e-6); });
test('ln(1)=0', () => { assert.ok(Math.abs(lnTaylor(0)) < 1e-9); });`,
});

// 11. num-exp-taylor
ALGS.push({
  id: 'num-exp-taylor',
  m: ['exp 泰勒级数', 'Exponential Taylor Series', '用泰勒级数近似 e^x。', 'Approximate e^x via Taylor series.',
    'e^x=1+x+x²/2!+x³/3!+...', 'e^x=1+x+x²/2!+x³/3!+...', 'O(n)', 'O(1)', ['numerical', 'series']],
  impl: `// exp 泰勒级数 · 实现
export function expTaylor(x: number, terms = 30): number {
  let sum = 0, term = 1;
  for (let n = 0; n < terms; n++) { sum += term; term *= x / (n + 1); }
  return sum;
}`,
  trace: mt("import { expTaylor } from './impl.ts';", "Math.round(expTaylor(1)*1000)/1000", '级数近似完成', 'series done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expTaylor } from '../../src/algorithms/numerical/num-exp-taylor/impl.ts';
test('e^1', () => { assert.ok(Math.abs(expTaylor(1) - Math.E) < 1e-6); });
test('e^0=1', () => { assert.ok(Math.abs(expTaylor(0) - 1) < 1e-9); });`,
});

// 12. num-sin-taylor
ALGS.push({
  id: 'num-sin-taylor',
  m: ['sin 泰勒级数', 'Sine Taylor Series', '用泰勒级数近似 sin x。', 'Approximate sin x via Taylor series.',
    'sin x=x-x³/3!+x⁵/5!-...', 'sin x=x-x³/3!+x⁵/5!-...', 'O(n)', 'O(1)', ['numerical', 'series', 'trigonometry']],
  impl: `// sin 泰勒级数 · 实现
export function sinTaylor(x: number, terms = 15): number {
  let sum = 0, term = x;
  for (let n = 0; n < terms; n++) { sum += term; term *= -x * x / ((2 * n + 2) * (2 * n + 3)); }
  return sum;
}`,
  trace: mt("import { sinTaylor } from './impl.ts';", "Math.round(sinTaylor(Math.PI/2)*1000)/1000", '级数近似完成', 'series done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sinTaylor } from '../../src/algorithms/numerical/num-sin-taylor/impl.ts';
test('sin(π/2)=1', () => { assert.ok(Math.abs(sinTaylor(Math.PI / 2) - 1) < 1e-9); });
test('sin(0)=0', () => { assert.ok(Math.abs(sinTaylor(0)) < 1e-9); });`,
});

// 13. num-cos-taylor
ALGS.push({
  id: 'num-cos-taylor',
  m: ['cos 泰勒级数', 'Cosine Taylor Series', '用泰勒级数近似 cos x。', 'Approximate cos x via Taylor series.',
    'cos x=1-x²/2!+x⁴/4!-...', 'cos x=1-x²/2!+x⁴/4!-...', 'O(n)', 'O(1)', ['numerical', 'series', 'trigonometry']],
  impl: `// cos 泰勒级数 · 实现
export function cosTaylor(x: number, terms = 15): number {
  let sum = 0, term = 1;
  for (let n = 0; n < terms; n++) { sum += term; term *= -x * x / ((2 * n + 1) * (2 * n + 2)); }
  return sum;
}`,
  trace: mt("import { cosTaylor } from './impl.ts';", "Math.round(cosTaylor(0)*1000)/1000", '级数近似完成', 'series done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cosTaylor } from '../../src/algorithms/numerical/num-cos-taylor/impl.ts';
test('cos(0)=1', () => { assert.ok(Math.abs(cosTaylor(0) - 1) < 1e-9); });
test('cos(π)=-1', () => { assert.ok(Math.abs(cosTaylor(Math.PI) - (-1)) < 1e-9); });`,
});

// 14. num-arctan-taylor
ALGS.push({
  id: 'num-arctan-taylor',
  m: ['arctan 泰勒级数', 'Arctangent Taylor Series', '用泰勒级数近似 arctan x。', 'Approximate arctan x via Taylor series.',
    'arctan x=x-x³/3+x⁵/5-...，对 |x|≤1 收敛。', 'arctan x=x-x³/3+x⁵/5-...; converges for |x|≤1.', 'O(n)', 'O(1)', ['numerical', 'series', 'trigonometry']],
  impl: `// arctan 泰勒级数 · 实现
export function atanTaylor(x: number, terms = 100): number {
  let sum = 0;
  for (let n = 0; n < terms; n++) sum += (n % 2 === 0 ? 1 : -1) * Math.pow(x, 2 * n + 1) / (2 * n + 1);
  return sum;
}`,
  trace: mt("import { atanTaylor } from './impl.ts';", "Math.round(atanTaylor(1)*1000)/1000", '级数近似完成', 'series done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { atanTaylor } from '../../src/algorithms/numerical/num-arctan-taylor/impl.ts';
test('atan(1)=π/4', () => { assert.ok(Math.abs(atanTaylor(1) - Math.PI / 4) < 1e-2); });
test('atan(0)=0', () => { assert.ok(Math.abs(atanTaylor(0)) < 1e-9); });`,
});

// 15. num-rect-integral
ALGS.push({
  id: 'num-rect-integral',
  m: ['矩形法积分', 'Rectangle Rule Integration', '用矩形法数值积分。', 'Numerical integration via the rectangle rule.',
    '把 [a,b] 等分，每段用左端点函数值×宽求和。', 'Partition [a,b]; sum left-endpoint values times width.', 'O(n)', 'O(1)', ['numerical', 'integration']],
  impl: `// 矩形法积分 · 实现
export function rectangleIntegral(f: (x: number) => number, a: number, b: number, n = 1000): number {
  if (n <= 0) throw new RangeError('n 必须为正');
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + i * h);
  return sum * h;
}`,
  trace: mt("import { rectangleIntegral } from './impl.ts';", "Math.round(rectangleIntegral(x=>x*x,0,1)*1000)/1000", '积分完成', 'integral done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rectangleIntegral } from '../../src/algorithms/numerical/num-rect-integral/impl.ts';
test('∫0^1 x² dx ≈ 1/3', () => {
  assert.ok(Math.abs(rectangleIntegral((x) => x * x, 0, 1, 10000) - 1 / 3) < 1e-3);
});`,
});

// 16. num-trapezoid-integral
ALGS.push({
  id: 'num-trapezoid-integral',
  m: ['梯形法积分', 'Trapezoidal Rule Integration', '用梯形法数值积分。', 'Numerical integration via the trapezoidal rule.',
    '∫f ≈ h·(f(a)/2 + Σf + f(b)/2)。', '∫f ≈ h·(f(a)/2 + Σf + f(b)/2).', 'O(n)', 'O(1)', ['numerical', 'integration']],
  impl: `// 梯形法积分 · 实现
export function trapezoidIntegral(f: (x: number) => number, a: number, b: number, n = 1000): number {
  if (n <= 0) throw new RangeError('n 必须为正');
  const h = (b - a) / n;
  let sum = (f(a) + f(b)) / 2;
  for (let i = 1; i < n; i++) sum += f(a + i * h);
  return sum * h;
}`,
  trace: mt("import { trapezoidIntegral } from './impl.ts';", "Math.round(trapezoidIntegral(x=>x*x,0,1)*1000)/1000", '积分完成', 'integral done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trapezoidIntegral } from '../../src/algorithms/numerical/num-trapezoid-integral/impl.ts';
test('∫0^1 x² dx ≈ 1/3', () => {
  assert.ok(Math.abs(trapezoidIntegral((x) => x * x, 0, 1, 1000) - 1 / 3) < 1e-5);
});`,
});

// 17. num-left-rect
ALGS.push({
  id: 'num-midpoint-integral',
  m: ['中点法积分', 'Midpoint Rule Integration', '用中点法数值积分。', 'Numerical integration via the midpoint rule.',
    '每段用中点函数值×宽，精度优于矩形法。', 'Use midpoint value per segment; more accurate than left-rectangle.', 'O(n)', 'O(1)', ['numerical', 'integration']],
  impl: `// 中点法积分 · 实现
export function midpointIntegral(f: (x: number) => number, a: number, b: number, n = 1000): number {
  if (n <= 0) throw new RangeError('n 必须为正');
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + (i + 0.5) * h);
  return sum * h;
}`,
  trace: mt("import { midpointIntegral } from './impl.ts';", "Math.round(midpointIntegral(x=>x*x,0,1)*1000)/1000", '积分完成', 'integral done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { midpointIntegral } from '../../src/algorithms/numerical/num-midpoint-integral/impl.ts';
test('∫0^1 x² dx ≈ 1/3', () => {
  assert.ok(Math.abs(midpointIntegral((x) => x * x, 0, 1, 100) - 1 / 3) < 1e-5);
});`,
});

// 18. num-derivative-finite
ALGS.push({
  id: 'num-derivative-finite',
  m: ['有限差分求导', 'Finite-Difference Derivative', '用中心差分近似数值导数。', 'Approximate derivative via central difference.',
    "f'(x) ≈ (f(x+h)-f(x-h))/(2h)，二阶精度。", "f'(x) ≈ (f(x+h)-f(x-h))/(2h); second-order accurate.", 'O(1)', 'O(1)', ['numerical', 'derivative']],
  impl: `// 有限差分求导 · 实现
export function derivative(f: (x: number) => number, x: number, h = 1e-6): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}`,
  trace: mt("import { derivative } from './impl.ts';", "Math.round(derivative(x=>x*x,3)*1000)/1000", '导数计算完成', 'derivative done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { derivative } from '../../src/algorithms/numerical/num-derivative-finite/impl.ts';
test("d/dx x² 在 3 处=6", () => { assert.ok(Math.abs(derivative((x) => x * x, 3) - 6) < 1e-4); });`,
});

// 19. num-derivative-second
ALGS.push({
  id: 'num-derivative-second',
  m: ['二阶有限差分', 'Second-Order Finite Difference', '用二阶中心差分近似二阶导数。', 'Approximate second derivative via central difference.',
    "f''(x) ≈ (f(x+h)-2f(x)+f(x-h))/h²。", "f''(x) ≈ (f(x+h)-2f(x)+f(x-h))/h².", 'O(1)', 'O(1)', ['numerical', 'derivative']],
  impl: `// 二阶有限差分 · 实现
export function secondDerivative(f: (x: number) => number, x: number, h = 1e-4): number {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}`,
  trace: mt("import { secondDerivative } from './impl.ts';", "Math.round(secondDerivative(x=>x*x*x,2)*100)/100", '二阶导完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secondDerivative } from '../../src/algorithms/numerical/num-derivative-second/impl.ts';
test("d²/dx² x³ 在 2 处=12", () => { assert.ok(Math.abs(secondDerivative((x) => x ** 3, 2) - 12) < 1e-2); });`,
});

// 20. num-norm-l1
ALGS.push({
  id: 'num-norm-l1',
  m: ['L1 范数', 'L1 Norm', '向量绝对值之和。', 'Sum of absolute values of a vector.',
    '||x||₁=Σ|xᵢ|。', '||x||₁=Σ|xᵢ|.', 'O(n)', 'O(1)', ['numerical', 'linear-algebra']],
  impl: `// L1 范数 · 实现
export function l1Norm(x: number[]): number { return x.reduce((s, v) => s + Math.abs(v), 0); }
export function l2Norm(x: number[]): number { return Math.sqrt(x.reduce((s, v) => s + v * v, 0)); }
export function linfNorm(x: number[]): number { return Math.max(...x.map(Math.abs)); }`,
  trace: mt("import { l1Norm } from './impl.ts';", "l1Norm([3,-4])", 'L1 范数完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { l1Norm, l2Norm, linfNorm } from '../../src/algorithms/numerical/num-norm-l1/impl.ts';
test('L1', () => { assert.equal(l1Norm([3, -4]), 7); });
test('L2', () => { assert.equal(l2Norm([3, 4]), 5); });
test('Linf', () => { assert.equal(linfNorm([3, -5, 2]), 5); });`,
});

// 21. num-matrix-mult
ALGS.push({
  id: 'num-matrix-mult',
  m: ['矩阵乘法', 'Matrix Multiplication', '朴素三重循环矩阵乘法。', 'Naive triple-loop matrix multiplication.',
    'C[i][j]=Σ A[i][k]·B[k][j]。', 'C[i][j]=Σ A[i][k]·B[k][j].', 'O(n³)', 'O(n²)', ['numerical', 'matrix']],
  impl: `// 矩阵乘法 · 实现
export function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length, n = B[0]!.length, p = B.length;
  if (A[0]!.length !== p) throw new RangeError('维度不匹配');
  const C = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) for (let k = 0; k < p; k++) for (let j = 0; j < n; j++) C[i]![j]! += A[i]![k]! * B[k]![j]!;
  return C;
}`,
  trace: mt("import { matMul } from './impl.ts';", "matMul([[1,2]],[[3],[4]])[0]![0]", '矩阵乘完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matMul } from '../../src/algorithms/numerical/num-matrix-mult/impl.ts';
test('矩阵乘', () => { assert.deepEqual(matMul([[1, 2]], [[3], [4]]), [[11]]); });
test('维度不匹配', () => { assert.throws(() => matMul([[1, 2]], [[1, 2]]), RangeError); });`,
});

// 22. num-matrix-transpose
ALGS.push({
  id: 'num-matrix-transpose',
  m: ['矩阵转置', 'Matrix Transpose', '交换行列下标。', 'Swap row and column indices.',
    'Aᵀ[i][j]=A[j][i]。', 'Aᵀ[i][j]=A[j][i].', 'O(nm)', 'O(nm)', ['numerical', 'matrix']],
  impl: `// 矩阵转置 · 实现
export function transpose(A: number[][]): number[][] {
  const m = A.length, n = A[0]!.length;
  const T = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) T[j]![i]! = A[i]![j]!;
  return T;
}`,
  trace: mt("import { transpose } from './impl.ts';", "transpose([[1,2,3]]).length", '转置完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transpose } from '../../src/algorithms/numerical/num-matrix-transpose/impl.ts';
test('转置', () => { assert.deepEqual(transpose([[1, 2, 3]]), [[1], [2], [3]]); });`,
});

// 23. num-matrix-det-2x2
ALGS.push({
  id: 'num-matrix-det-2x2',
  m: ['2×2 行列式', '2x2 Matrix Determinant', '计算 2×2 矩阵行列式。', 'Determinant of a 2x2 matrix.',
    '|A|=ad-bc。', '|A|=ad-bc.', 'O(1)', 'O(1)', ['numerical', 'matrix']],
  impl: `// 2×2 行列式 · 实现
export function det2x2(A: number[][]): number {
  if (A.length !== 2 || A[0]!.length !== 2) throw new RangeError('必须 2×2');
  return A[0]![0]! * A[1]![1]! - A[0]![1]! * A[1]![0]!;
}`,
  trace: mt("import { det2x2 } from './impl.ts';", "det2x2([[1,2],[3,4]])", '行列式完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { det2x2 } from '../../src/algorithms/numerical/num-matrix-det-2x2/impl.ts';
test('2×2 行列式', () => { assert.equal(det2x2([[1, 2], [3, 4]]), -2); });`,
});

// 24. num-complex-add
ALGS.push({
  id: 'num-complex-add',
  m: ['复数加减法', 'Complex Number Arithmetic', '复数加减乘运算。', 'Add/subtract/multiply complex numbers.',
    '(a+bi)±(c+di)，乘法 (ac-bd)+(ad+bc)i。', '(a+bi)±(c+di); product (ac-bd)+(ad+bc)i.', 'O(1)', 'O(1)', ['numerical', 'complex']],
  impl: `// 复数加减法 · 实现
export interface Complex { re: number; im: number; }
export function cAdd(a: Complex, b: Complex): Complex { return { re: a.re + b.re, im: a.im + b.im }; }
export function cSub(a: Complex, b: Complex): Complex { return { re: a.re - b.re, im: a.im - b.im }; }
export function cMul(a: Complex, b: Complex): Complex { return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }; }
export function cAbs(a: Complex): number { return Math.hypot(a.re, a.im); }`,
  trace: mt("import { cAdd } from './impl.ts';", "cAdd({re:1,im:2},{re:3,im:4}).re", '复数运算完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cAdd, cMul, cAbs } from '../../src/algorithms/numerical/num-complex-add/impl.ts';
test('复数加', () => { assert.deepEqual(cAdd({ re: 1, im: 2 }, { re: 3, im: 4 }), { re: 4, im: 6 }); });
test('复数乘 (0+1i)²=-1', () => { assert.deepEqual(cMul({ re: 0, im: 1 }, { re: 0, im: 1 }), { re: -1, im: 0 }); });
test('模 |3+4i|=5', () => { assert.equal(cAbs({ re: 3, im: 4 }), 5); });`,
});

// 25. num-mean-variance
ALGS.push({
  id: 'num-mean-variance',
  m: ['均值与方差', 'Mean and Variance', '计算样本均值与方差。', 'Compute sample mean and variance.',
    'μ=Σxᵢ/n，σ²=Σ(xᵢ-μ)²/(n-1)。', 'μ=Σxᵢ/n; σ²=Σ(xᵢ-μ)²/(n-1).', 'O(n)', 'O(1)', ['numerical', 'statistics']],
  impl: `// 均值与方差 · 实现
export interface Stats { mean: number; variance: number; std: number; }
export function meanVariance(x: number[]): Stats {
  const n = x.length;
  if (n < 2) throw new RangeError('需至少 2 个样本');
  const mean = x.reduce((a, b) => a + b, 0) / n;
  const variance = x.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
  return { mean, variance, std: Math.sqrt(variance) };
}`,
  trace: mt("import { meanVariance } from './impl.ts';", "Math.round(meanVariance([1,2,3,4,5]).variance*100)/100", '统计完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanVariance } from '../../src/algorithms/numerical/num-mean-variance/impl.ts';
test('均值方差', () => {
  const s = meanVariance([1, 2, 3, 4, 5]);
  assert.equal(s.mean, 3);
  assert.ok(Math.abs(s.variance - 2.5) < 1e-9);
});
test('样本不足报错', () => { assert.throws(() => meanVariance([1]), RangeError); });`,
});

// 26. num-linear-interp
ALGS.push({
  id: 'num-linear-interp',
  m: ['线性插值', 'Linear Interpolation', '在两点间线性插值。', 'Linear interpolation between two points.',
    'y=y₀+(y₁-y₀)(x-x₀)/(x₁-x₀)。', 'y=y₀+(y₁-y₀)(x-x₀)/(x₁-x₀).', 'O(1)', 'O(1)', ['numerical', 'interpolation']],
  impl: `// 线性插值 · 实现
export function lerp(x0: number, y0: number, x1: number, y1: number, x: number): number {
  if (x1 === x0) return y0;
  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}`,
  trace: mt("import { lerp } from './impl.ts';", "lerp(0,0,10,10,5)", '插值完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lerp } from '../../src/algorithms/numerical/num-linear-interp/impl.ts';
test('中点', () => { assert.equal(lerp(0, 0, 10, 10, 5), 5); });`,
});

// 27. num-deg-rad-conv
ALGS.push({
  id: 'num-deg-rad-conv',
  m: ['角度弧度互转', 'Degree-Radian Conversion', '角度与弧度互转。', 'Convert between degrees and radians.',
    'rad = deg·π/180，deg = rad·180/π。', 'rad = deg·π/180; deg = rad·180/π.', 'O(1)', 'O(1)', ['numerical', 'trigonometry']],
  impl: `// 角度弧度互转 · 实现
export function degToRad(deg: number): number { return (deg * Math.PI) / 180; }
export function radToDeg(rad: number): number { return (rad * 180) / Math.PI; }`,
  trace: mt("import { degToRad } from './impl.ts';", "Math.round(degToRad(180)*100)/100", '转换完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { degToRad, radToDeg } from '../../src/algorithms/numerical/num-deg-rad-conv/impl.ts';
test('180° = π', () => { assert.ok(Math.abs(degToRad(180) - Math.PI) < 1e-9); });
test('π = 180°', () => { assert.ok(Math.abs(radToDeg(Math.PI) - 180) < 1e-9); });`,
});

// 28. num-abs-value
ALGS.push({
  id: 'num-abs-value',
  m: ['绝对值', 'Absolute Value', '返回数的绝对值。', 'Return the absolute value of a number.',
    '|x| = x≥0 ? x : -x。', '|x| = x≥0 ? x : -x.', 'O(1)', 'O(1)', ['numerical', 'arithmetic']],
  impl: `// 绝对值 · 实现
export function abs(x: number): number { return x < 0 ? -x : x; }
export function sign(x: number): number { return x > 0 ? 1 : x < 0 ? -1 : 0; }`,
  trace: mt("import { abs } from './impl.ts';", "abs(-7)", '绝对值完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abs, sign } from '../../src/algorithms/numerical/num-abs-value/impl.ts';
test('abs(-7)=7', () => { assert.equal(abs(-7), 7); });
test('sign', () => { assert.equal(sign(-3), -1); assert.equal(sign(0), 0); assert.equal(sign(5), 1); });`,
});

// 29. num-floor-ceil
ALGS.push({
  id: 'num-floor-ceil',
  m: ['向下/向上取整', 'Floor and Ceiling', '返回不超过/不小于 x 的最大/最小整数。', 'Largest int ≤ x / smallest int ≥ x.',
    '⌊x⌋ 向下，⌈x⌉ 向上。', '⌊x⌋ floor; ⌈x⌉ ceiling.', 'O(1)', 'O(1)', ['numerical', 'arithmetic']],
  impl: `// 向下/向上取整 · 实现
export function floor(x: number): number { return x | 0 <= x ? (x | 0) === x ? x | 0 : x < 0 ? (x | 0) - 1 : x | 0 : x | 0; }
export function ceil(x: number): number { const f = Math.floor(x); return f === x ? x : f + 1; }`,
  trace: mt("import { ceil } from './impl.ts';", "ceil(2.3)", '取整完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ceil } from '../../src/algorithms/numerical/num-floor-ceil/impl.ts';
test('ceil(2.3)=3', () => { assert.equal(ceil(2.3), 3); });`,
});

// 30. num-power-iter-mult
ALGS.push({
  id: 'num-power-iter',
  m: ['幂运算（迭代）', 'Iterative Power', '用迭代乘法计算 x^n。', 'Compute x^n by iterative multiplication.',
    '累乘 x 共 n 次，n 为非负整数。', 'Multiply x n times; n is a non-negative integer.', 'O(n)', 'O(1)', ['numerical', 'arithmetic']],
  impl: `// 幂运算（迭代）· 实现
export function powerIter(base: number, exp: number): number {
  if (exp < 0 || !Number.isInteger(exp)) throw new RangeError('exp 必须非负整数');
  let r = 1;
  for (let i = 0; i < exp; i++) r *= base;
  return r;
}`,
  trace: mt("import { powerIter } from './impl.ts';", "powerIter(2,10)", '幂运算完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { powerIter } from '../../src/algorithms/numerical/num-power-iter/impl.ts';
test('2^10=1024', () => { assert.equal(powerIter(2, 10), 1024); });
test('x^0=1', () => { assert.equal(powerIter(5, 0), 1); });`,
});

// 31. num-summation
ALGS.push({
  id: 'num-summation',
  m: ['数列求和', 'Series Summation', '对函数生成的数列求和。', 'Sum a series produced by a function.',
    'Σᵢ₌₀ⁿ⁻¹ f(i)。', 'Σᵢ₌₀ⁿ⁻¹ f(i).', 'O(n)', 'O(1)', ['numerical', 'series']],
  impl: `// 数列求和 · 实现
export function summation(f: (i: number) => number, n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  let s = 0;
  for (let i = 0; i < n; i++) s += f(i);
  return s;
}`,
  trace: mt("import { summation } from './impl.ts';", "summation(i=>i+1,5)", '求和完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summation } from '../../src/algorithms/numerical/num-summation/impl.ts';
test('1+2+3+4+5=15', () => { assert.equal(summation((i) => i + 1, 5), 15); });`,
});

// 32. num-geometric-sum
ALGS.push({
  id: 'num-geometric-sum',
  m: ['等比数列求和', 'Geometric Series Sum', '计算等比数列前 n 项和。', 'Sum of first n terms of a geometric series.',
    'Σᵢ₌₀ⁿ⁻¹ rⁱ = (1-rⁿ)/(1-r)，r≠1。', 'Σᵢ₌₀ⁿ⁻¹ rⁱ = (1-rⁿ)/(1-r), r≠1.', 'O(log n)', 'O(1)', ['numerical', 'series']],
  impl: `// 等比数列求和 · 实现
export function geometricSum(r: number, n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  if (r === 1) return n;
  return (1 - Math.pow(r, n)) / (1 - r);
}`,
  trace: mt("import { geometricSum } from './impl.ts';", "geometricSum(2,5)", '求和完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geometricSum } from '../../src/algorithms/numerical/num-geometric-sum/impl.ts';
test('1+2+4+8+16=31', () => { assert.equal(geometricSum(2, 5), 31); });
test('r=1', () => { assert.equal(geometricSum(1, 5), 5); });`,
});

// 33. num-arithmetic-sum
ALGS.push({
  id: 'num-arithmetic-sum',
  m: ['等差数列求和', 'Arithmetic Series Sum', '计算等差数列前 n 项和。', 'Sum of first n terms of an arithmetic series.',
    'Σᵢ₌₀ⁿ⁻¹(a₀+i·d) = n·(2a₀+(n-1)d)/2。', 'Σᵢ₌₀ⁿ⁻¹(a₀+i·d) = n·(2a₀+(n-1)d)/2.', 'O(1)', 'O(1)', ['numerical', 'series']],
  impl: `// 等差数列求和 · 实现
export function arithmeticSum(a0: number, d: number, n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  return (n * (2 * a0 + (n - 1) * d)) / 2;
}`,
  trace: mt("import { arithmeticSum } from './impl.ts';", "arithmeticSum(1,1,100)", '求和完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arithmeticSum } from '../../src/algorithms/numerical/num-arithmetic-sum/impl.ts';
test('1+...+100=5050', () => { assert.equal(arithmeticSum(1, 1, 100), 5050); });`,
});

// 34. num-harmonic-sum
ALGS.push({
  id: 'num-harmonic-sum',
  m: ['调和级数部分和', 'Harmonic Series Partial Sum', '计算前 n 项调和级数和 Hₙ。', 'Partial sum of the harmonic series Hₙ.',
    'Hₙ = 1 + 1/2 + 1/3 + ... + 1/n。', 'Hₙ = 1 + 1/2 + 1/3 + ... + 1/n.', 'O(n)', 'O(1)', ['numerical', 'series']],
  impl: `// 调和级数部分和 · 实现
export function harmonicSum(n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  let s = 0;
  for (let i = 1; i <= n; i++) s += 1 / i;
  return s;
}`,
  trace: mt("import { harmonicSum } from './impl.ts';", "Math.round(harmonicSum(10)*1000)/1000", '求和完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harmonicSum } from '../../src/algorithms/numerical/num-harmonic-sum/impl.ts';
test('H₁=1', () => { assert.equal(harmonicSum(1), 1); });
test('H₁₀≈2.93', () => { assert.ok(Math.abs(harmonicSum(10) - 2.9289) < 1e-3); });`,
});

// 35. num-clamp
ALGS.push({
  id: 'num-clamp',
  m: ['区间夹紧', 'Clamp', '把值限制在 [lo, hi] 内。', 'Clamp a value into [lo, hi].',
    'clamp(x)=max(lo,min(hi,x))。', 'clamp(x)=max(lo,min(hi,x)).', 'O(1)', 'O(1)', ['numerical', 'arithmetic']],
  impl: `// 区间夹紧 · 实现
export function clamp(x: number, lo: number, hi: number): number {
  if (lo > hi) throw new RangeError('lo 不能大于 hi');
  return Math.max(lo, Math.min(hi, x));
}`,
  trace: mt("import { clamp } from './impl.ts';", "clamp(15,0,10)", '夹紧完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clamp } from '../../src/algorithms/numerical/num-clamp/impl.ts';
test('clamp 上界', () => { assert.equal(clamp(15, 0, 10), 10); });
test('clamp 下界', () => { assert.equal(clamp(-3, 0, 10), 0); });
test('clamp 内', () => { assert.equal(clamp(5, 0, 10), 5); });`,
});

// 36. num-lerp-factor
ALGS.push({
  id: 'num-lerp-factor',
  m: ['插值因子', 'Inverse Lerp (Factor)', '求 x 在 [a,b] 中的归一化位置。', 'Normalized position of x within [a,b].',
    't=(x-a)/(b-a) ∈ [0,1]。', 't=(x-a)/(b-a) in [0,1].', 'O(1)', 'O(1)', ['numerical', 'interpolation']],
  impl: `// 插值因子 · 实现
export function invLerp(a: number, b: number, x: number): number {
  if (a === b) return 0;
  return (x - a) / (b - a);
}`,
  trace: mt("import { invLerp } from './impl.ts';", "invLerp(0,10,5)", '因子计算完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { invLerp } from '../../src/algorithms/numerical/num-lerp-factor/impl.ts';
test('中点=0.5', () => { assert.equal(invLerp(0, 10, 5), 0.5); });`,
});

// 37. num-smoothstep
ALGS.push({
  id: 'num-smoothstep',
  m: ['平滑阶梯', 'Smoothstep', '平滑的 0→1 过渡函数。', 'Smooth 0→1 transition function.',
    't=clamp((x-e0)/(e1-e0),0,1)，返回 t·t·(3-2t)。', 't=clamp((x-e0)/(e1-e0),0,1); return t·t·(3-2t).', 'O(1)', 'O(1)', ['numerical', 'interpolation']],
  impl: `// 平滑阶梯 · 实现
export function smoothstep(e0: number, e1: number, x: number): number {
  if (e0 === e1) return x < e0 ? 0 : 1;
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}`,
  trace: mt("import { smoothstep } from './impl.ts';", "Math.round(smoothstep(0,1,0.5)*1000)/1000", '平滑过渡完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smoothstep } from '../../src/algorithms/numerical/num-smoothstep/impl.ts';
test('smoothstep 中点=0.5', () => { assert.ok(Math.abs(smoothstep(0, 1, 0.5) - 0.5) < 1e-9); });`,
});

// 38. num-vector-add
ALGS.push({
  id: 'num-vector-add',
  m: ['向量加减', 'Vector Add/Subtract', '逐元素向量加减。', 'Element-wise vector add/subtract.',
    '(a±b)ᵢ=aᵢ±bᵢ。', '(a±b)ᵢ=aᵢ±bᵢ.', 'O(d)', 'O(d)', ['numerical', 'linear-algebra']],
  impl: `// 向量加减 · 实现
export function vAdd(a: number[], b: number[]): number[] {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  return a.map((v, i) => v + b[i]!);
}
export function vSub(a: number[], b: number[]): number[] {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  return a.map((v, i) => v - b[i]!);
}`,
  trace: mt("import { vAdd } from './impl.ts';", "vAdd([1,2],[3,4]).join(',')", '向量运算完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vAdd, vSub } from '../../src/algorithms/numerical/num-vector-add/impl.ts';
test('加', () => { assert.deepEqual(vAdd([1, 2], [3, 4]), [4, 6]); });
test('减', () => { assert.deepEqual(vSub([1, 2], [3, 4]), [-2, -2]); });`,
});

// 39. num-vector-scale
ALGS.push({
  id: 'num-vector-scale',
  m: ['向量数乘', 'Vector Scaling', '向量与标量相乘。', 'Multiply a vector by a scalar.',
    '(k·a)ᵢ = k·aᵢ。', '(k·a)ᵢ = k·aᵢ.', 'O(d)', 'O(d)', ['numerical', 'linear-algebra']],
  impl: `// 向量数乘 · 实现
export function vScale(a: number[], k: number): number[] { return a.map((v) => v * k); }
export function vNormalize(a: number[]): number[] {
  const n = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  if (n === 0) return a.slice();
  return a.map((v) => v / n);
}`,
  trace: mt("import { vScale } from './impl.ts';", "vScale([1,2,3],2).join(',')", '数乘完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vScale, vNormalize } from '../../src/algorithms/numerical/num-vector-scale/impl.ts';
test('数乘', () => { assert.deepEqual(vScale([1, 2, 3], 2), [2, 4, 6]); });
test('归一化', () => {
  const n = vNormalize([3, 4]);
  assert.ok(Math.abs(Math.hypot(n[0]!, n[1]!) - 1) < 1e-9);
});`,
});

// 40. num-vector-dot
ALGS.push({
  id: 'num-vector-dot',
  m: ['向量点积', 'Vector Dot Product', 'Σ aᵢbᵢ。', 'Σ aᵢbᵢ.',
    '点积是度量、投影的基础。', 'Foundation of metrics and projections.', 'O(d)', 'O(1)', ['numerical', 'linear-algebra']],
  impl: `// 向量点积 · 实现
export function vDot(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}`,
  trace: mt("import { vDot } from './impl.ts';", "vDot([1,2,3],[4,5,6])", '点积完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vDot } from '../../src/algorithms/numerical/num-vector-dot/impl.ts';
test('点积', () => { assert.equal(vDot([1, 2, 3], [4, 5, 6]), 32); });`,
});

// 41. num-quaternion-mul
ALGS.push({
  id: 'num-quaternion-mul',
  m: ['四元数乘法', 'Quaternion Multiplication', 'Hamilton 积四元数乘法。', 'Hamilton product of two quaternions.',
    '用于 3D 旋转的无万向锁表示。', 'Gimbal-lock-free representation of 3D rotations.', 'O(1)', 'O(1)', ['numerical', 'quaternion']],
  impl: `// 四元数乘法 · 实现
export interface Quat { w: number; x: number; y: number; z: number; }
export function qMul(a: Quat, b: Quat): Quat {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}
export function qNorm(a: Quat): number { return Math.hypot(a.w, a.x, a.y, a.z); }`,
  trace: mt("import { qMul } from './impl.ts';", "Math.round(qMul({w:1,x:0,y:0,z:0},{w:2,x:0,y:0,z:0}).w*100)/100", '四元数乘完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qMul, qNorm } from '../../src/algorithms/numerical/num-quaternion-mul/impl.ts';
test('单位四元数相乘', () => { assert.deepEqual(qMul({ w: 1, x: 0, y: 0, z: 0 }, { w: 1, x: 0, y: 0, z: 0 }), { w: 1, x: 0, y: 0, z: 0 }); });
test('模', () => { assert.ok(Math.abs(qNorm({ w: 1, x: 2, y: 2, z: 2 }) - Math.sqrt(13)) < 1e-9); });`,
});

// 42. num-percentile
ALGS.push({
  id: 'num-percentile',
  m: ['百分位数', 'Percentile', '计算数据集的第 p 百分位数。', 'Compute the p-th percentile of a dataset.',
    '排序后按线性插值法取第 p 百分位。', 'Sort then linear-interpolate to the p-th percentile.', 'O(n log n)', 'O(n)', ['numerical', 'statistics']],
  impl: `// 百分位数 · 实现
export function percentile(values: number[], p: number): number {
  if (values.length === 0) throw new RangeError('空数组');
  if (p < 0 || p > 100) throw new RangeError('p 必须在 [0,100]');
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (idx - lo) * (sorted[hi]! - sorted[lo]!);
}`,
  trace: mt("import { percentile } from './impl.ts';", "percentile([1,2,3,4,5],50)", '百分位完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentile } from '../../src/algorithms/numerical/num-percentile/impl.ts';
test('中位数', () => { assert.equal(percentile([1, 2, 3, 4, 5], 50), 3); });`,
});

// 43. num-median
ALGS.push({
  id: 'num-median',
  m: ['中位数', 'Median', '计算数据集中位数。', 'Compute the median of a dataset.',
    '排序后取中间（偶数取两中值平均）。', 'Sort, take middle (average of two middles for even length).', 'O(n log n)', 'O(n)', ['numerical', 'statistics']],
  impl: `// 中位数 · 实现
export function median(values: number[]): number {
  if (values.length === 0) throw new RangeError('空数组');
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}`,
  trace: mt("import { median } from './impl.ts';", "median([1,2,3,4,5])", '中位数完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { median } from '../../src/algorithms/numerical/num-median/impl.ts';
test('奇数中位数', () => { assert.equal(median([1, 2, 3, 4, 5]), 3); });
test('偶数中位数', () => { assert.equal(median([1, 2, 3, 4]), 2.5); });`,
});

// 44. num-mode
ALGS.push({
  id: 'num-mode',
  m: ['众数', 'Mode', '计算数据集众数。', 'Compute the mode of a dataset.',
    '出现次数最多的值（可能有多个）。', 'Most frequent value(s); may be multiple.', 'O(n)', 'O(n)', ['numerical', 'statistics']],
  impl: `// 众数 · 实现
export function mode(values: number[]): number[] {
  if (values.length === 0) return [];
  const cnt: Record<number, number> = {};
  for (const v of values) cnt[v] = (cnt[v] ?? 0) + 1;
  let max = 0;
  for (const k in cnt) if (cnt[k]! > max) max = cnt[k]!;
  return Object.keys(cnt).filter((k) => cnt[k] === max).map(Number).sort((a, b) => a - b);
}`,
  trace: mt("import { mode } from './impl.ts';", "mode([1,2,2,3,3]).join(',')", '众数完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mode } from '../../src/algorithms/numerical/num-mode/impl.ts';
test('众数', () => { assert.deepEqual(mode([1, 2, 2, 3, 3]), [2, 3]); });`,
});

// 45. num-range
ALGS.push({
  id: 'num-range',
  m: ['极差', 'Range', '计算数据集最大值与最小值之差。', 'Difference between max and min.',
    'range = max - min。', 'range = max - min.', 'O(n)', 'O(1)', ['numerical', 'statistics']],
  impl: `// 极差 · 实现
export function range(values: number[]): number {
  if (values.length === 0) throw new RangeError('空数组');
  return Math.max(...values) - Math.min(...values);
}`,
  trace: mt("import { range } from './impl.ts';", "range([3,1,4,1,5])", '极差完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { range } from '../../src/algorithms/numerical/num-range/impl.ts';
test('极差', () => { assert.equal(range([3, 1, 4, 1, 5]), 4); });`,
});

for (const a of ALGS) {
  writeAlg(a.id, meta(a.id, ...a.m), a.impl, a.trace, a.test);
}
console.log('numerical: wrote ' + ALGS.length + ' algorithms');
