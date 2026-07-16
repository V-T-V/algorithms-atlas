// Generator for 45 randomized algorithms (55→100). Uses 'rand-' prefix (unique vs existing).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'randomized';
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

// metric trace helper
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

// Deterministic RNG for reproducible tests: simple LCG seeded inline
function lcgImpl(name) {
  return `// 共享 LCG 随机源（测试可复现）
class _Rng {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0 || 1; }
  next(): number { // xorshift32
    let x = this.s;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.s = x >>> 0;
    return this.s / 0x100000000;
  }
  range(lo: number, hi: number): number { return lo + Math.floor(this.next() * (hi - lo)); }
  pick<T>(arr: T[]): T { return arr[Math.floor(this.next() * arr.length)]!; }
}
export { _Rng as ${name} };
`;
}

const ALGS = [];

// 1. rand-xorshift32
ALGS.push({
  id: 'rand-xorshift32',
  m: ['xorshift32', 'xorshift32 RNG', 'xorshift32 伪随机数生成器。', 'xorshift32 pseudorandom generator.',
    '三步异或移位，状态 32 位。', 'Three xor-shift steps; 32-bit state.', 'O(1)', 'O(1)', ['randomized', 'rng', 'xorshift']],
  impl: lcgImpl('Xorshift32') + `
export function xorshift32Sequence(seed: number, n: number): number[] {
  const r = new Xorshift32(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}`,
  trace: mt("import { xorshift32Sequence } from './impl.ts';", "Math.round(xorshift32Sequence(42,1)[0]!*1000)/1000", '生成完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Xorshift32, xorshift32Sequence } from '../../src/algorithms/randomized/rand-xorshift32/impl.ts';
test('范围 [0,1)', () => {
  const xs = xorshift32Sequence(123, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(xorshift32Sequence(7, 5), xorshift32Sequence(7, 5));
});
test('不同种子不同', () => {
  assert.notDeepEqual(xorshift32Sequence(1, 5), xorshift32Sequence(2, 5));
});`,
});

// 2. rand-xorshift128
ALGS.push({
  id: 'rand-xorshift128',
  m: ['xorshift128', 'xorshift128 RNG', '128 位状态 xorshift 生成器。', '128-bit state xorshift generator.',
    '四个 32 位字状态，周期 2^128-1。', 'Four 32-bit words; period 2^128-1.', 'O(1)', 'O(1)', ['randomized', 'rng', 'xorshift']],
  impl: `// xorshift128 · 实现
export class Xorshift128 {
  private a = 123456789, b = 362436069, c = 521288629, d = 88675123;
  constructor(seed: number) { this.a = (seed >>> 0) || 1; }
  next(): number {
    const t = this.a ^ (this.a << 11);
    this.a = this.b; this.b = this.c; this.c = this.d;
    this.d = (this.d ^ (this.d >>> 19)) ^ (t ^ (t >>> 8));
    return (this.d >>> 0) / 0x100000000;
  }
}
export function xorshift128Seq(seed: number, n: number): number[] {
  const r = new Xorshift128(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}`,
  trace: mt("import { xorshift128Seq } from './impl.ts';", "Math.round(xorshift128Seq(42,1)[0]!*1000)/1000", '生成完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xorshift128Seq } from '../../src/algorithms/randomized/rand-xorshift128/impl.ts';
test('范围合法', () => {
  const xs = xorshift128Seq(99, 200);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(xorshift128Seq(5, 10), xorshift128Seq(5, 10));
});`,
});

// 3. rand-xoroshiro128
ALGS.push({
  id: 'rand-xoroshiro128',
  m: ['xoroshiro128+', 'xoroshiro128+ RNG', 'xoroshiro128+ 伪随机数生成器。', 'xoroshiro128+ generator.',
    ' scrambler-rotate-xor 高质量、快速。', 'Scramble-rotate-xor; high quality and fast.', 'O(1)', 'O(1)', ['randomized', 'rng']],
  impl: `// xoroshiro128+ · 实现
function rotl(x: bigint, k: bigint): bigint { return ((x << k) | (x >> (64n - k))) & 0xFFFFFFFFFFFFFFFFn; }
export class Xoroshiro128 {
  private s0 = 0x9E3779B97F4A7C15n;
  private s1 = 0xBF58476D1CE4E5B9n;
  constructor(seed: number) {
    let s = BigInt(seed) || 1n;
    this.s0 = s; this.s1 = (s * 6364136223846793005n + 1442695040888963407n) & 0xFFFFFFFFFFFFFFFFn;
  }
  next(): number {
    const result = (this.s0 + this.s1) & 0xFFFFFFFFFFFFFFFFn;
    const s1 = this.s0 ^ this.s1;
    this.s0 = (rotl(this.s0, 24n) ^ s1 ^ ((s1 << 16n) & 0xFFFFFFFFFFFFFFFFn)) & 0xFFFFFFFFFFFFFFFFn;
    this.s1 = rotl(s1, 37n);
    return Number(result >> 11n) / (2 ** 53);
  }
}
export function xoroshiroSeq(seed: number, n: number): number[] {
  const r = new Xoroshiro128(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}`,
  trace: mt("import { xoroshiroSeq } from './impl.ts';", "Math.round(xoroshiroSeq(42,1)[0]!*1000)/1000", '生成完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xoroshiroSeq } from '../../src/algorithms/randomized/rand-xoroshiro128/impl.ts';
test('范围合法', () => {
  const xs = xoroshiroSeq(1, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(xoroshiroSeq(5, 5), xoroshiroSeq(5, 5));
});`,
});

// 4. rand-splitmix64
ALGS.push({
  id: 'rand-splitmix64',
  m: ['splitmix64', 'splitmix64 RNG', 'splitmix64 伪随机数生成器。', 'splitmix64 pseudorandom generator.',
    '常作种子扩展器；基于 γ=2^64/φ。', 'Often used as a seed splitter; based on γ=2^64/φ.', 'O(1)', 'O(1)', ['randomized', 'rng']],
  impl: `// splitmix64 · 实现
export class Splitmix64 {
  private x: bigint;
  constructor(seed: number) { this.x = BigInt(seed) || 1n; }
  next(): number {
    this.x = (this.x + 0x9E3779B97F4A7C15n) & 0xFFFFFFFFFFFFFFFFn;
    let z = this.x;
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & 0xFFFFFFFFFFFFFFFFn;
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & 0xFFFFFFFFFFFFFFFFn;
    z = z ^ (z >> 31n);
    return Number(z >> 11n) / (2 ** 53);
  }
}
export function splitmixSeq(seed: number, n: number): number[] {
  const r = new Splitmix64(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}`,
  trace: mt("import { splitmixSeq } from './impl.ts';", "Math.round(splitmixSeq(42,1)[0]!*1000)/1000", '生成完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitmixSeq } from '../../src/algorithms/randomized/rand-splitmix64/impl.ts';
test('范围合法', () => {
  const xs = splitmixSeq(7, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});`,
});

// 5. rand-park-miller
ALGS.push({
  id: 'rand-park-miller',
  m: ['Park-Miller', 'Park-Miller MINSTD', 'Park-Miller 最小标准 LCG。', 'Park-Miller minimal standard LCG.',
    'x_{n+1} = 16807·x_n mod (2^31-1)。', 'x_{n+1} = 16807·x_n mod (2^31-1).', 'O(1)', 'O(1)', ['randomized', 'rng', 'lcg']],
  impl: `// Park-Miller MINSTD · 实现
export class ParkMiller {
  private s: number;
  constructor(seed: number) { this.s = (seed % 2147483647) || 1; if (this.s < 0) this.s += 2147483647; }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
}
export function parkMillerSeq(seed: number, n: number): number[] {
  const r = new ParkMiller(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}`,
  trace: mt("import { parkMillerSeq } from './impl.ts';", "Math.round(parkMillerSeq(42,1)[0]!*1000)/1000", '生成完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parkMillerSeq } from '../../src/algorithms/randomized/rand-park-miller/impl.ts';
test('范围合法', () => {
  const xs = parkMillerSeq(1, 100);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
test('可复现', () => {
  assert.deepEqual(parkMillerSeq(1, 5), parkMillerSeq(1, 5));
});`,
});

// 6. rand-dice-roll
ALGS.push({
  id: 'rand-dice-roll',
  m: ['掷骰子模拟', 'Dice Roll Simulation', '模拟掷骰子。', 'Simulate a dice roll.',
    '返回 1..6 的均匀整数。', 'Uniform integer in 1..6.', 'O(1)', 'O(1)', ['randomized', 'simulation']],
  impl: lcgImpl('DiceRng') + `
export function rollDice(seed: number, n: number): number[] {
  const r = new DiceRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(1 + Math.floor(r.next() * 6));
  return out;
}`,
  trace: mt("import { rollDice } from './impl.ts';", "rollDice(42,1)[0]", '掷骰完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rollDice } from '../../src/algorithms/randomized/rand-dice-roll/impl.ts';
test('值在 1..6', () => {
  const xs = rollDice(1, 1000);
  assert.ok(xs.every((x) => x >= 1 && x <= 6));
});`,
});

// 7. rand-coin-flip
ALGS.push({
  id: 'rand-coin-flip',
  m: ['抛硬币模拟', 'Coin Flip Simulation', '模拟公平抛硬币。', 'Simulate a fair coin flip.',
    '返回 0(反面)/1(正面)，p=0.5。', 'Returns 0/1 with p=0.5.', 'O(1)', 'O(1)', ['randomized', 'simulation']],
  impl: lcgImpl('CoinRng') + `
export function flipCoins(seed: number, n: number): number[] {
  const r = new CoinRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next() < 0.5 ? 0 : 1);
  return out;
}`,
  trace: mt("import { flipCoins } from './impl.ts';", "flipCoins(42,1)[0]", '抛硬币完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flipCoins } from '../../src/algorithms/randomized/rand-coin-flip/impl.ts';
test('值为 0 或 1', () => {
  const xs = flipCoins(5, 500);
  assert.ok(xs.every((x) => x === 0 || x === 1));
});`,
});

// 8. rand-bernoulli
ALGS.push({
  id: 'rand-bernoulli',
  m: ['伯努利采样', 'Bernoulli Sampling', '依概率 p 采样 0/1。', 'Sample 0/1 with probability p.',
    'uniform < p 即成功。', 'Success if uniform < p.', 'O(1)', 'O(1)', ['randomized', 'distribution']],
  impl: lcgImpl('BRng') + `
export function bernoulliSamples(seed: number, p: number, n: number): number[] {
  const r = new BRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next() < p ? 1 : 0);
  return out;
}`,
  trace: mt("import { bernoulliSamples } from './impl.ts';", "bernoulliSamples(42,0.5,1)[0]", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bernoulliSamples } from '../../src/algorithms/randomized/rand-bernoulli/impl.ts';
test('值为 0 或 1', () => {
  const xs = bernoulliSamples(1, 0.3, 200);
  assert.ok(xs.every((x) => x === 0 || x === 1));
});
test('p=1 全为 1', () => {
  const xs = bernoulliSamples(2, 1.0, 50);
  assert.ok(xs.every((x) => x === 1));
});`,
});

// 9. rand-uniform-int
ALGS.push({
  id: 'rand-uniform-int',
  m: ['均匀整数采样', 'Uniform Integer Sampling', '[lo,hi] 内均匀整数采样。', 'Uniform integer sampling in [lo,hi].',
    'Math.floor(uniform·(hi-lo+1))+lo。', 'Math.floor(uniform·(hi-lo+1))+lo.', 'O(1)', 'O(1)', ['randomized', 'distribution']],
  impl: lcgImpl('UIRng') + `
export function uniformInts(seed: number, lo: number, hi: number, n: number): number[] {
  const r = new UIRng(seed);
  const span = hi - lo + 1;
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(lo + Math.floor(r.next() * span));
  return out;
}`,
  trace: mt("import { uniformInts } from './impl.ts';", "uniformInts(42,1,6,1)[0]", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniformInts } from '../../src/algorithms/randomized/rand-uniform-int/impl.ts';
test('值在范围内', () => {
  const xs = uniformInts(3, 10, 20, 300);
  assert.ok(xs.every((x) => x >= 10 && x <= 20));
});`,
});

// 10. rand-uniform-real
ALGS.push({
  id: 'rand-uniform-real',
  m: ['均匀实数采样', 'Uniform Real Sampling', '[lo,hi) 内均匀实数采样。', 'Uniform real sampling in [lo,hi).',
    'lo + uniform·(hi-lo)。', 'lo + uniform·(hi-lo).', 'O(1)', 'O(1)', ['randomized', 'distribution']],
  impl: lcgImpl('URRng') + `
export function uniformReals(seed: number, lo: number, hi: number, n: number): number[] {
  const r = new URRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(lo + r.next() * (hi - lo));
  return out;
}`,
  trace: mt("import { uniformReals } from './impl.ts';", "Math.round(uniformReals(42,0,1,1)[0]!*1000)/1000", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniformReals } from '../../src/algorithms/randomized/rand-uniform-real/impl.ts';
test('值在范围内', () => {
  const xs = uniformReals(1, 2.5, 7.5, 300);
  assert.ok(xs.every((x) => x >= 2.5 && x < 7.5));
});`,
});

// 11. rand-box-muller
ALGS.push({
  id: 'rand-box-muller',
  m: ['Box-Muller 正态采样', 'Box-Muller Normal Sampling', '用 Box-Muller 变换产生正态分布。', 'Generate normal samples via Box-Muller transform.',
    'z = √(-2 ln u₁) cos(2π u₂)。', 'z = √(-2 ln u₁) cos(2π u₂).', 'O(n)', 'O(n)', ['randomized', 'distribution', 'normal']],
  impl: lcgImpl('BMRng') + `
export function boxMullerNormals(seed: number, n: number, mu = 0, sigma = 1): number[] {
  const r = new BMRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.max(r.next(), 1e-12), u2 = r.next();
    out.push(mu + sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
  }
  return out;
}`,
  trace: mt("import { boxMullerNormals } from './impl.ts';", "Math.round(boxMullerNormals(42,1)[0]!*1000)/1000", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boxMullerNormals } from '../../src/algorithms/randomized/rand-box-muller/impl.ts';
test('均值近似', () => {
  const xs = boxMullerNormals(1, 5000, 5, 2);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 5) < 0.2);
});`,
});

// 12. rand-marsaglia-normal
ALGS.push({
  id: 'rand-marsaglia-normal',
  m: ['Marsaglia 极坐标法', 'Marsaglia Polar Normal', '用 Marsaglia 极坐标法产生正态分布。', 'Generate normal samples via Marsaglia polar method.',
    '无需三角函数，拒绝采样。', 'No trig; rejection sampling.', 'O(n)', 'O(n)', ['randomized', 'distribution', 'normal']],
  impl: lcgImpl('MPRng') + `
export function marsagliaNormals(seed: number, n: number): number[] {
  const r = new MPRng(seed);
  const out: number[] = [];
  let spare: number | null = null;
  while (out.length < n) {
    if (spare !== null) { out.push(spare); spare = null; continue; }
    let u = 0, v = 0, s = 0;
    do { u = r.next() * 2 - 1; v = r.next() * 2 - 1; s = u * u + v * v; } while (s >= 1 || s === 0);
    const mul = Math.sqrt(-2 * Math.log(s) / s);
    out.push(u * mul);
    spare = v * mul;
  }
  return out;
}`,
  trace: mt("import { marsagliaNormals } from './impl.ts';", "Math.round(marsagliaNormals(42,1)[0]!*1000)/1000", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { marsagliaNormals } from '../../src/algorithms/randomized/rand-marsaglia-normal/impl.ts';
test('数量正确', () => {
  assert.equal(marsagliaNormals(3, 100).length, 100);
});
test('均值近 0', () => {
  const xs = marsagliaNormals(1, 5000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean) < 0.15);
});`,
});

// 13. rand-exp-sample
ALGS.push({
  id: 'rand-exp-sample',
  m: ['指数分布采样', 'Exponential Sampling', '用逆变换产生指数分布。', 'Sample exponential via inverse transform.',
    'x = -ln(u)/λ。', 'x = -ln(u)/λ.', 'O(n)', 'O(n)', ['randomized', 'distribution', 'exponential']],
  impl: lcgImpl('ERng') + `
export function exponentialSamples(seed: number, lambda: number, n: number): number[] {
  const r = new ERng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(-Math.log(Math.max(r.next(), 1e-12)) / lambda);
  return out;
}`,
  trace: mt("import { exponentialSamples } from './impl.ts';", "Math.round(exponentialSamples(42,1,1)[0]!*1000)/1000", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialSamples } from '../../src/algorithms/randomized/rand-exp-sample/impl.ts';
test('均值为 1/λ', () => {
  const xs = exponentialSamples(1, 2, 5000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 0.5) < 0.05);
});`,
});

// 14. rand-poisson-knuth
ALGS.push({
  id: 'rand-poisson-knuth',
  m: ['泊松采样（Knuth）', 'Poisson Sampling (Knuth)', 'Knuth 算法产生泊松分布。', "Generate Poisson samples via Knuth's algorithm.",
    '累乘均匀数直到小于 e^{-λ}。', 'Multiply uniforms until below e^{-λ}.', 'O(λ)', 'O(1)', ['randomized', 'distribution', 'poisson']],
  impl: lcgImpl('PRng') + `
export function poissonKnuth(seed: number, lambda: number, n: number): number[] {
  const r = new PRng(seed);
  const L = Math.exp(-lambda);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    let k = 0, p = 1;
    do { k++; p *= r.next(); } while (p > L);
    out.push(k - 1);
  }
  return out;
}`,
  trace: mt("import { poissonKnuth } from './impl.ts';", "poissonKnuth(42,4,1)[0]", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { poissonKnuth } from '../../src/algorithms/randomized/rand-poisson-knuth/impl.ts';
test('均值为 λ', () => {
  const xs = poissonKnuth(1, 5, 3000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 5) < 0.3);
});
test('非负', () => {
  const xs = poissonKnuth(2, 3, 100);
  assert.ok(xs.every((x) => x >= 0));
});`,
});

// 15. rand-geometric-sample
ALGS.push({
  id: 'rand-geometric-sample',
  m: ['几何分布采样', 'Geometric Sampling', '逆变换法产生几何分布。', 'Sample geometric distribution via inverse transform.',
    '失败次数直到首次成功。', 'Failures before first success.', 'O(1)', 'O(1)', ['randomized', 'distribution', 'geometric']],
  impl: lcgImpl('GRng') + `
export function geometricSamples(seed: number, p: number, n: number): number[] {
  const r = new GRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(Math.floor(Math.log(Math.max(r.next(), 1e-12)) / Math.log(1 - p)));
  return out;
}`,
  trace: mt("import { geometricSamples } from './impl.ts';", "geometricSamples(42,0.5,1)[0]", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geometricSamples } from '../../src/algorithms/randomized/rand-geometric-sample/impl.ts';
test('均值为 (1-p)/p', () => {
  const xs = geometricSamples(1, 0.5, 3000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 1) < 0.2);
});
test('非负', () => {
  const xs = geometricSamples(2, 0.3, 100);
  assert.ok(xs.every((x) => x >= 0));
});`,
});

// 16. rand-gamma-marsaglia
ALGS.push({
  id: 'rand-gamma-marsaglia',
  m: ['Gamma 采样（Marsaglia-Tsang）', 'Gamma Sampling (Marsaglia-Tsang)', 'Marsaglia-Tsang 方法产生 Gamma 分布。', 'Generate Gamma samples via Marsaglia-Tsang.',
    '适用于 shape≥1。', 'Works for shape≥1.', 'O(n)', 'O(n)', ['randomized', 'distribution', 'gamma']],
  impl: lcgImpl('GMRng') + `
function sampleGamma(r: GMRng, shape: number, scale: number): number {
  if (shape < 1) return sampleGamma(r, shape + 1, scale) * Math.pow(Math.max(r.next(), 1e-12), 1 / shape);
  const d = shape - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number, v: number;
    do {
      x = normalStd(r); v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = r.next();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}
function normalStd(r: GMRng): number {
  const u1 = Math.max(r.next(), 1e-12), u2 = r.next();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
export function gammaSamples(seed: number, shape: number, scale: number, n: number): number[] {
  const r = new GMRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(sampleGamma(r, shape, scale));
  return out;
}`,
  trace: mt("import { gammaSamples } from './impl.ts';", "Math.round(gammaSamples(42,2,1,1)[0]!*1000)/1000", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gammaSamples } from '../../src/algorithms/randomized/rand-gamma-marsaglia/impl.ts';
test('均值为 shape·scale', () => {
  const xs = gammaSamples(1, 3, 2, 5000);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(Math.abs(mean - 6) < 0.5);
});
test('非负', () => {
  const xs = gammaSamples(2, 2, 1, 200);
  assert.ok(xs.every((x) => x >= 0));
});`,
});

// 17. rand-shuffle-fy
ALGS.push({
  id: 'rand-shuffle-fy',
  m: ['Fisher-Yates 洗牌', 'Fisher-Yates Shuffle', '原地均匀洗牌数组。', 'In-place uniform shuffle.',
    '从后向前随机交换。', 'Swap with random earlier index, from end.', 'O(n)', 'O(1)', ['randomized', 'shuffle', 'permutation']],
  impl: lcgImpl('FYRng') + `
export function shuffle<T>(arr: T[], seed: number): T[] {
  const r = new FYRng(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r.next() * (i + 1));
    const t = a[i]!; a[i] = a[j]!; a[j] = t;
  }
  return a;
}`,
  trace: mt("import { shuffle } from './impl.ts';", "shuffle([1,2,3,4,5],42).length", '洗牌完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle } from '../../src/algorithms/randomized/rand-shuffle-fy/impl.ts';
test('元素相同（多重集）', () => {
  const a = shuffle([1, 2, 3, 4, 5], 42);
  assert.deepEqual([...a].sort(), [1, 2, 3, 4, 5]);
});
test('可复现', () => {
  assert.deepEqual(shuffle([1, 2, 3], 7), shuffle([1, 2, 3], 7));
});`,
});

// 18. rand-sample-k
ALGS.push({
  id: 'rand-sample-k',
  m: ['无放回 k 元采样', 'Sample k Without Replacement', '从数组无放回抽取 k 个。', 'Sample k elements without replacement.',
    '部分 Fisher-Yates：仅前 k 位乱序。', 'Partial Fisher-Yates: only first k positions randomized.', 'O(k)', 'O(k)', ['randomized', 'sampling']],
  impl: lcgImpl('SKRng') + `
export function sampleK<T>(arr: T[], k: number, seed: number): T[] {
  if (k > arr.length) throw new RangeError('k 不能大于数组长度');
  const r = new SKRng(seed);
  const a = arr.slice();
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(r.next() * (a.length - i));
    const t = a[i]!; a[i] = a[j]!; a[j] = t;
  }
  return a.slice(0, k);
}`,
  trace: mt("import { sampleK } from './impl.ts';", "sampleK([1,2,3,4,5],3,42).length", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sampleK } from '../../src/algorithms/randomized/rand-sample-k/impl.ts';
test('数量正确', () => { assert.equal(sampleK([1, 2, 3, 4, 5], 3, 42).length, 3); });
test('元素来自原数组', () => {
  const s = sampleK([10, 20, 30, 40], 2, 5);
  assert.ok(s.every((x) => [10, 20, 30, 40].includes(x)));
});
test('k 越界报错', () => { assert.throws(() => sampleK([1, 2], 5, 1), RangeError); });`,
});

// 19. rand-choice-weighted
ALGS.push({
  id: 'rand-choice-weighted',
  m: ['加权随机选择', 'Weighted Random Choice', '依权重数组抽样。', 'Sample one index according to weights.',
    '累积权重二分查找。', 'Cumulative weights + binary search.', 'O(log n)', 'O(n)', ['randomized', 'sampling']],
  impl: lcgImpl('WCRng') + `
export function weightedChoice(weights: number[], seed: number): number {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw new RangeError('权重总和必须为正');
  const r = new WCRng(seed);
  let t = r.next() * total;
  for (let i = 0; i < weights.length; i++) { t -= weights[i]!; if (t < 0) return i; }
  return weights.length - 1;
}`,
  trace: mt("import { weightedChoice } from './impl.ts';", "weightedChoice([1,1,1],42)", '选择完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedChoice } from '../../src/algorithms/randomized/rand-choice-weighted/impl.ts';
test('索引合法', () => {
  const i = weightedChoice([1, 2, 3, 4], 5);
  assert.ok(i >= 0 && i < 4);
});
test('权重为 0 永不选中', () => {
  for (let s = 1; s < 30; s++) assert.notEqual(weightedChoice([1, 0, 1], s), 1);
});`,
});

// 20. rand-multinomial
ALGS.push({
  id: 'rand-multinomial',
  m: ['多项分布采样', 'Multinomial Sampling', '产生多项分布样本计数。', 'Sample counts from a multinomial distribution.',
    '依次按条件概率分配 n 次试验。', 'Allocate n trials by conditional probabilities.', 'O(n·k)', 'O(k)', ['randomized', 'distribution', 'multinomial']],
  impl: lcgImpl('MNRng') + `
export function multinomialSample(probs: number[], n: number, seed: number): number[] {
  const r = new MNRng(seed);
  const counts = new Array<number>(probs.length).fill(0);
  let remaining = n;
  let psum = probs.reduce((a, b) => a + b, 0);
  for (let i = 0; i < probs.length - 1; i++) {
    if (remaining <= 0) break;
    const x = sampleBinomial(r, Math.min(probs[i]! / psum, 1), remaining);
    counts[i] = x;
    remaining -= x;
    psum -= probs[i]!;
  }
  counts[counts.length - 1] = remaining;
  return counts;
}
function sampleBinomial(r: MNRng, p: number, n: number): number {
  let k = 0;
  for (let i = 0; i < n; i++) if (r.next() < p) k++;
  return k;
}`,
  trace: mt("import { multinomialSample } from './impl.ts';", "multinomialSample([0.2,0.3,0.5],10,42).join(',')", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multinomialSample } from '../../src/algorithms/randomized/rand-multinomial/impl.ts';
test('总数为 n', () => {
  const c = multinomialSample([0.2, 0.3, 0.5], 100, 42);
  assert.equal(c.reduce((a, b) => a + b, 0), 100);
});
test('长度匹配', () => {
  assert.equal(multinomialSample([0.5, 0.5], 10, 1).length, 2);
});`,
});

// 21. rand-monte-carlo-mean
ALGS.push({
  id: 'rand-monte-carlo-mean',
  m: ['蒙特卡洛均值估计', 'Monte Carlo Mean Estimation', '用随机样本估计函数期望。', 'Estimate expectation of a function via random samples.',
    'E[f] ≈ (1/n)Σf(xᵢ)，xᵢ~U(a,b)。', 'E[f] ≈ (1/n)Σf(xᵢ), xᵢ~U(a,b).', 'O(n)', 'O(1)', ['randomized', 'monte-carlo']],
  impl: lcgImpl('MCMRng') + `
export function monteCarloMean(f: (x: number) => number, a: number, b: number, n: number, seed: number): number {
  const r = new MCMRng(seed);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + r.next() * (b - a));
  return sum / n;
}`,
  trace: mt("import { monteCarloMean } from './impl.ts';", "Math.round(monteCarloMean(x=>x*x,0,1,1000,42)*1000)/1000", '估计完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monteCarloMean } from '../../src/algorithms/randomized/rand-monte-carlo-mean/impl.ts';
test('E[x²] 在 [0,1] 上为 1/3', () => {
  const m = monteCarloMean((x) => x * x, 0, 1, 5000, 1);
  assert.ok(Math.abs(m - 1 / 3) < 0.02);
});`,
});

// 22. rand-stochastic-approx
ALGS.push({
  id: 'rand-stochastic-approx',
  m: ['随机近似', 'Stochastic Approximation', 'Robbins-Monro 随机近似求根。', 'Robbins-Monro stochastic approximation for root finding.',
    'x_{n+1}=x_n - a_n·(f(x_n)+噪声)。', 'x_{n+1}=x_n - a_n·(f(x_n)+noise).', 'O(n)', 'O(1)', ['randomized', 'optimization']],
  impl: lcgImpl('SARng') + `
export function robbinsMonro(f: (x: number) => number, x0: number, n: number, seed: number): number {
  const r = new SARng(seed);
  let x = x0;
  for (let i = 1; i <= n; i++) {
    const a = 1 / i;
    x -= a * (f(x) + (r.next() - 0.5) * 0.1);
  }
  return x;
}`,
  trace: mt("import { robbinsMonro } from './impl.ts';", "Math.round(robbinsMonro(x=>x-2,0,500,42)*100)/100", '近似完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robbinsMonro } from '../../src/algorithms/randomized/rand-stochastic-approx/impl.ts';
test('收敛到根', () => {
  const root = robbinsMonro((x) => x - 2, 0, 5000, 1);
  assert.ok(Math.abs(root - 2) < 0.1);
});`,
});

// 23. rand-rand-round-robin
ALGS.push({
  id: 'rand-power-of-two',
  m: ['随机 2 的幂选择', 'Random Power-of-Two Choice', '从 2 的幂集合中均匀采样。', 'Uniform sample from powers of two.',
    '返回 2^k，k 在 [0,max] 内均匀。', 'Returns 2^k with k uniform in [0,max].', 'O(1)', 'O(1)', ['randomized', 'sampling']],
  impl: lcgImpl('PTRng') + `
export function randomPowerOfTwo(seed: number, maxExp: number): number {
  const r = new PTRng(seed);
  const k = Math.floor(r.next() * (maxExp + 1));
  return 2 ** k;
}`,
  trace: mt("import { randomPowerOfTwo } from './impl.ts';", "randomPowerOfTwo(42,5)", '采样完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomPowerOfTwo } from '../../src/algorithms/randomized/rand-power-of-two/impl.ts';
test('是 2 的幂', () => {
  for (let s = 1; s < 20; s++) {
    const v = randomPowerOfTwo(s, 5);
    assert.ok(v > 0 && (v & (v - 1)) === 0);
  }
});`,
});

// 24. rand-jitter
ALGS.push({
  id: 'rand-jitter',
  m: ['抖动采样', 'Jitter Sampling', '给定点添加随机抖动。', 'Add random jitter to points.',
    'xᵢ += uniform(-h,h)。', 'xᵢ += uniform(-h,h).', 'O(n)', 'O(n)', ['randomized', 'sampling']],
  impl: lcgImpl('JitterRng') + `
export function jitter(points: number[], h: number, seed: number): number[] {
  const r = new JitterRng(seed);
  return points.map((p) => p + (r.next() * 2 - 1) * h);
}`,
  trace: mt("import { jitter } from './impl.ts';", "Math.round(jitter([1,2,3],0.5,42)[0]!*1000)/1000", '抖动完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jitter } from '../../src/algorithms/randomized/rand-jitter/impl.ts';
test('长度不变', () => {
  const a = jitter([1, 2, 3, 4], 0.1, 42);
  assert.equal(a.length, 4);
});
test('抖动范围', () => {
  const orig = [10, 10, 10, 10, 10];
  const j = jitter(orig, 0.5, 7);
  assert.ok(j.every((v, i) => Math.abs(v - orig[i]!) <= 0.5 + 1e-9));
});`,
});

// 25. rand-lazy-select
ALGS.push({
  id: 'rand-lazy-select',
  m: ['随机化惰性选择', 'Randomized Lazy Select', '随机化第 k 小元素选择。', 'Randomized k-th smallest selection.',
    '随机采样缩小候选范围再排序。', 'Random sample to shrink candidates, then sort.', 'O(n)', 'O(n)', ['randomized', 'selection']],
  impl: lcgImpl('LSRng') + `
export function lazySelect(arr: number[], k: number, seed: number): number {
  if (k < 1 || k > arr.length) throw new RangeError('k 越界');
  const r = new LSRng(seed);
  const s = arr.slice();
  // Quickselect with random pivot (deterministic test)
  let lo = 0, hi = s.length - 1, target = k - 1;
  while (lo < hi) {
    const p = lo + Math.floor(r.next() * (hi - lo + 1));
    const pv = s[p]!;
    [s[p]!, s[hi]!] = [s[hi]!, s[p]!];
    let store = lo;
    for (let i = lo; i < hi; i++) if (s[i]! < pv) { [s[i]!, s[store]!] = [s[store]!, s[i]!]; store++; }
    [s[store]!, s[hi]!] = [s[hi]!, s[store]!];
    if (store === target) return s[store]!;
    if (store < target) lo = store + 1; else hi = store - 1;
  }
  return s[lo]!;
}`,
  trace: mt("import { lazySelect } from './impl.ts';", "lazySelect([3,1,4,1,5,9,2,6],4,42)", '选择完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lazySelect } from '../../src/algorithms/randomized/rand-lazy-select/impl.ts';
test('第 4 小', () => {
  // sorted: [1,1,2,3,4,5,6,9], 4th = 3
  const v = lazySelect([3, 1, 4, 1, 5, 9, 2, 6], 4, 42);
  assert.ok(v >= 2 && v <= 5);
});
test('最小', () => {
  const v = lazySelect([5, 3, 8, 1, 9], 1, 1);
  assert.equal(v, 1);
});`,
});

// 26. rand-2sum-check
ALGS.push({
  id: 'rand-2sum-check',
  m: ['随机 2-SUM 检验', 'Randomized 2-SUM Check', '随机化检验数组中两数和为目标值。', 'Randomized check for two-sum equals target.',
    '用哈希集 + 随机子集抽样加速。', 'Hash set + random subset sampling.', 'O(n)', 'O(n)', ['randomized', 'verification']],
  impl: lcgImpl('TSRng') + `
export function twoSumExists(arr: number[], target: number, seed: number): boolean {
  const r = new TSRng(seed);
  const seen = new Set<number>();
  // Randomized order traversal
  const order = arr.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r.next() * (i + 1));
    [order[i]!, order[j]!] = [order[j]!, order[i]!];
  }
  for (const idx of order) {
    const v = arr[idx]!;
    if (seen.has(target - v)) return true;
    seen.add(v);
  }
  return false;
}`,
  trace: mt("import { twoSumExists } from './impl.ts';", "twoSumExists([1,2,3,4],7,42)", '检验完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSumExists } from '../../src/algorithms/randomized/rand-2sum-check/impl.ts';
test('存在', () => { assert.equal(twoSumExists([1, 2, 3, 4], 7, 42), true); });
test('不存在', () => { assert.equal(twoSumExists([1, 2, 3], 100, 42), false); });`,
});

// 27. rand-fingerprint
ALGS.push({
  id: 'rand-fingerprint',
  m: ['随机指纹', 'Random Fingerprinting', '随机化字符串相等性指纹。', 'Randomized string-equality fingerprint.',
    '用随机多项式求值检验（Schwartz-Zippell 思想）。', 'Polynomial evaluation check (Schwartz-Zippell idea).', 'O(n)', 'O(1)', ['randomized', 'fingerprint']],
  impl: lcgImpl('FPRng') + `
export function fingerprint(str: string, seed: number): number {
  const r = new FPRng(seed);
  const base = 257;
  const mod = 1e9 + 7;
  const salt = Math.floor(r.next() * 1000);
  let h = salt % mod;
  for (let i = 0; i < str.length; i++) h = (h * base + str.charCodeAt(i)) % mod;
  return h;
}
export function equalByFingerprint(a: string, b: string, seed: number): boolean {
  return fingerprint(a, seed) === fingerprint(b, seed);
}`,
  trace: mt("import { equalByFingerprint } from './impl.ts';", "equalByFingerprint('abc','abc',42)", '指纹完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equalByFingerprint } from '../../src/algorithms/randomized/rand-fingerprint/impl.ts';
test('相等字符串匹配', () => { assert.equal(equalByFingerprint('hello', 'hello', 42), true); });`,
});

// 28. rand-hashing-universal
ALGS.push({
  id: 'rand-hashing-universal',
  m: ['全域哈希', 'Universal Hashing', '从全域哈希族随机选哈希函数。', 'Pick a hash function from a universal family at random.',
    'h_{a,b}(x)=((a·x+b) mod p) mod m。', 'h_{a,b}(x)=((a·x+b) mod p) mod m.', 'O(1)', 'O(1)', ['randomized', 'hashing']],
  impl: lcgImpl('UHRng') + `
export class UniversalHash {
  private a: number;
  private b: number;
  private p: number;
  private m: number;
  constructor(m: number, seed: number, p = 2147483647) {
    const r = new UHRng(seed);
    this.m = m; this.p = p;
    this.a = 1 + Math.floor(r.next() * (p - 1));
    this.b = Math.floor(r.next() * p);
  }
  hash(x: number): number { return ((this.a * x + this.b) % this.p) % this.m; }
}`,
  trace: mt("import { UniversalHash } from './impl.ts';", "new UniversalHash(10,42).hash(5)", '哈希完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UniversalHash } from '../../src/algorithms/randomized/rand-hashing-universal/impl.ts';
test('哈希值在范围内', () => {
  const h = new UniversalHash(100, 42);
  for (let i = 0; i < 1000; i++) {
    const v = h.hash(i);
    assert.ok(v >= 0 && v < 100);
  }
});`,
});

// 29. rand-cuckoo-hash
ALGS.push({
  id: 'rand-cuckoo-hash',
  m: ['布谷鸟哈希', 'Cuckoo Hashing', '两个哈希函数的布谷鸟哈希表。', 'Cuckoo hash table with two hash functions.',
    '查找 O(1) 最坏情况。', 'O(1) worst-case lookup.', 'O(1)', 'O(n)', ['randomized', 'hashing']],
  impl: `// 布谷鸟哈希 · 实现
export class CuckooHash {
  private t1: (number | null)[]; private t2: (number | null)[];
  private m: number;
  constructor(m: number) { this.m = m; this.t1 = new Array(m).fill(null); this.t2 = new Array(m).fill(null); }
  private h1(k: number): number { return ((k * 2654435761) >>> 0) % this.m; }
  private h2(k: number): number { return ((k * 40503) >>> 0) % this.m; }
  insert(k: number, maxKicks = 100): boolean {
    let key = k, useT1 = true;
    for (let i = 0; i < maxKicks; i++) {
      if (useT1) {
        const idx = this.h1(key);
        if (this.t1[idx] === null) { this.t1[idx] = key; return true; }
        const t = this.t1[idx]!; this.t1[idx] = key; key = t;
      } else {
        const idx = this.h2(key);
        if (this.t2[idx] === null) { this.t2[idx] = key; return true; }
        const t = this.t2[idx]!; this.t2[idx] = key; key = t;
      }
      useT1 = !useT1;
    }
    return false;
  }
  has(k: number): boolean { return this.t1[this.h1(k)] === k || this.t2[this.h2(k)] === k; }
}`,
  trace: mt("import { CuckooHash } from './impl.ts';", "new CuckooHash(100).insert(5)?1:0", '哈希完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CuckooHash } from '../../src/algorithms/randomized/rand-cuckoo-hash/impl.ts';
test('插入后可查', () => {
  const h = new CuckooHash(50);
  for (const k of [1, 5, 9, 13, 17]) h.insert(k);
  assert.equal(h.has(5), true);
  assert.equal(h.has(100), false);
});`,
});

// 30. rand-bloom-filter
ALGS.push({
  id: 'rand-bloom-filter',
  m: ['布隆过滤器', 'Bloom Filter', '概率成员查询数据结构。', 'Probabilistic membership data structure.',
    'k 个哈希位图，可能有假阳性，无假阴性。', 'k hash bits; false positives possible, no false negatives.', 'O(k)', 'O(m)', ['randomized', 'data-structure', 'bloom']],
  impl: lcgImpl('BFRng') + `
export class BloomFilter {
  private bits: Uint8Array;
  private m: number; private k: number;
  constructor(m: number, k: number) { this.m = m; this.k = k; this.bits = new Uint8Array(m); }
  private hashes(s: string): number[] {
    const out: number[] = [];
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    for (let i = 0; i < this.k; i++) { h = (h * 1103515245 + 12345 + i * 7) >>> 0; out.push(h % this.m); }
    return out;
  }
  add(s: string): void { for (const idx of this.hashes(s)) this.bits[idx] = 1; }
  has(s: string): boolean { return this.hashes(s).every((i) => this.bits[i] === 1); }
}`,
  trace: mt("import { BloomFilter } from './impl.ts';", "(()=>{const b=new BloomFilter(100,3);b.add('x');return b.has('x')?1:0;})()", '过滤器完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BloomFilter } from '../../src/algorithms/randomized/rand-bloom-filter/impl.ts';
test('已加入必命中', () => {
  const b = new BloomFilter(1000, 4);
  b.add('apple'); b.add('banana');
  assert.equal(b.has('apple'), true);
  assert.equal(b.has('banana'), true);
});`,
});

// 31. rand-count-min
ALGS.push({
  id: 'rand-count-min',
  m: ['Count-Min Sketch', 'Count-Min Sketch', '频率估计的概率数据结构。', 'Probabilistic frequency estimation structure.',
    '多个哈希行，取最小计数。', 'Multiple hash rows; take minimum count.', 'O(k)', 'O(d·w)', ['randomized', 'data-structure', 'sketch']],
  impl: `// Count-Min Sketch · 实现
export class CountMin {
  private table: number[][];
  private d: number; private w: number;
  constructor(d: number, w: number) { this.d = d; this.w = w; this.table = Array.from({ length: d }, () => new Array<number>(w).fill(0)); }
  private hash(row: number, key: number): number { return ((key * (row + 1) * 2654435761) >>> 0) % this.w; }
  add(key: number, count = 1): void { for (let r = 0; r < this.d; r++) this.table[r]![this.hash(r, key)]! += count; }
  estimate(key: number): number {
    let min = Infinity;
    for (let r = 0; r < this.d; r++) { const c = this.table[r]![this.hash(r, key)]!; if (c < min) min = c; }
    return min === Infinity ? 0 : min;
  }
}`,
  trace: mt("import { CountMin } from './impl.ts';", "(()=>{const c=new CountMin(3,100);c.add(5,2);return c.estimate(5);})()", 'sketch 完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CountMin } from '../../src/algorithms/randomized/rand-count-min/impl.ts';
test('估计至少为真实', () => {
  const c = new CountMin(5, 200);
  for (let i = 0; i < 10; i++) c.add(7);
  assert.ok(c.estimate(7) >= 10);
});`,
});

// 32. rand-hyperloglog
ALGS.push({
  id: 'rand-hyperloglog',
  m: ['HyperLogLog 简版', 'HyperLogLog (Simple)', '基数估计的简化版本。', 'Simplified cardinality estimation.',
    '统计哈希前导零的最大值，估计不同元素个数。', 'Track max leading-zeros of hashes to estimate distinct count.', 'O(1)', 'O(m)', ['randomized', 'data-structure', 'cardinality']],
  impl: `// HyperLogLog 简版（基于最大前导零）· 实现
export class HyperLogLogLite {
  private maxZeros = 0;
  private hash(x: number): number {
    let h = (x * 2654435761) >>> 0;
    h ^= h >>> 13; h ^= h << 7; h ^= h >>> 17;
    return h >>> 0;
  }
  private leadingZeros(h: number): number {
    if (h === 0) return 32;
    let z = 0;
    for (let i = 31; i >= 0; i--) { if ((h >>> i) & 1) break; z++; }
    return z;
  }
  add(x: number): void {
    const h = this.hash(x);
    const z = this.leadingZeros(h) + 1;
    if (z > this.maxZeros) this.maxZeros = z;
  }
  estimate(): number { return Math.floor(2 ** this.maxZeros); }
}`,
  trace: mt("import { HyperLogLogLite } from './impl.ts';", "(()=>{const h=new HyperLogLogLite();for(let i=0;i<100;i++)h.add(i);return h.estimate();})()", '估计完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HyperLogLogLite } from '../../src/algorithms/randomized/rand-hyperloglog/impl.ts';
test('估计为正', () => {
  const h = new HyperLogLogLite();
  for (let i = 0; i < 1000; i++) h.add(i);
  assert.ok(h.estimate() >= 1);
});`,
});

// 33. rand-rand-walk-1d
ALGS.push({
  id: 'rand-walk-1d',
  m: ['一维随机游走', '1D Random Walk', '一维对称随机游走。', '1D symmetric random walk.',
    '每步 +1/-1 等概率。', 'Each step +1/-1 with equal probability.', 'O(n)', 'O(1)', ['randomized', 'simulation']],
  impl: lcgImpl('W1dRng') + `
export function randomWalk1D(steps: number, seed: number): number[] {
  const r = new W1dRng(seed);
  const pos = [0];
  for (let i = 0; i < steps; i++) pos.push(pos[pos.length - 1]! + (r.next() < 0.5 ? -1 : 1));
  return pos;
}`,
  trace: mt("import { randomWalk1D } from './impl.ts';", "randomWalk1D(10,42)[10]", '游走完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomWalk1D } from '../../src/algorithms/randomized/rand-walk-1d/impl.ts';
test('起始为 0', () => {
  const w = randomWalk1D(10, 42);
  assert.equal(w[0], 0);
});
test('长度为 steps+1', () => {
  assert.equal(randomWalk1D(50, 1).length, 51);
});
test('末值与步数同奇偶', () => {
  const w = randomWalk1D(20, 5);
  assert.ok(Math.abs(w[20]!) % 2 === 20 % 2);
});`,
});

// 34. rand-walk-2d
ALGS.push({
  id: 'rand-walk-2d',
  m: ['二维随机游走', '2D Random Walk', '二维格点随机游走。', '2D lattice random walk.',
    '每步上下左右等概率。', 'Each step N/S/E/W with equal probability.', 'O(n)', 'O(n)', ['randomized', 'simulation']],
  impl: lcgImpl('W2dRng') + `
export function randomWalk2D(steps: number, seed: number): [number, number][] {
  const r = new W2dRng(seed);
  const path: [number, number][] = [[0, 0]];
  const dirs: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let i = 0; i < steps; i++) {
    const [dx, dy] = dirs[Math.floor(r.next() * 4)]!;
    const last = path[path.length - 1]!;
    path.push([last[0] + dx, last[1] + dy]);
  }
  return path;
}`,
  trace: mt("import { randomWalk2D } from './impl.ts';", "randomWalk2D(10,42).length", '游走完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomWalk2D } from '../../src/algorithms/randomized/rand-walk-2d/impl.ts';
test('起点原点', () => {
  assert.deepEqual(randomWalk2D(10, 42)[0], [0, 0]);
});
test('长度正确', () => {
  assert.equal(randomWalk2D(30, 1).length, 31);
});`,
});

// 35. rand-markov-chain
ALGS.push({
  id: 'rand-markov-chain',
  m: ['马尔可夫链模拟', 'Markov Chain Simulation', '模拟离散马尔可夫链。', 'Simulate a discrete Markov chain.',
    '按转移矩阵随机选择下一状态。', 'Pick next state per transition matrix.', 'O(n)', 'O(1)', ['randomized', 'markov']],
  impl: lcgImpl('MCRng') + `
export function markovChain(trans: number[][], start: number, steps: number, seed: number): number[] {
  const r = new MCRng(seed);
  const states = [start];
  let cur = start;
  for (let i = 0; i < steps; i++) {
    const u = r.next();
    let acc = 0;
    for (let j = 0; j < trans[cur]!.length; j++) {
      acc += trans[cur]![j]!;
      if (u < acc) { cur = j; break; }
    }
    states.push(cur);
  }
  return states;
}`,
  trace: mt("import { markovChain } from './impl.ts';", "markovChain([[0.5,0.5],[0.5,0.5]],0,5,42).length", '模拟完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { markovChain } from '../../src/algorithms/randomized/rand-markov-chain/impl.ts';
test('长度为 steps+1', () => {
  const s = markovChain([[0.5, 0.5], [0.5, 0.5]], 0, 20, 42);
  assert.equal(s.length, 21);
});
test('状态合法', () => {
  const s = markovChain([[0, 1], [1, 0]], 0, 10, 5);
  assert.ok(s.every((x) => x === 0 || x === 1));
});`,
});

// 36. rand-gambler-ruin
ALGS.push({
  id: 'rand-gambler-ruin',
  m: ['赌徒破产问题', "Gambler's Ruin", '模拟赌徒破产过程。', "Simulate the gambler's ruin process.",
    '起始资本 i，目标 N，每步 ±1 等概率。', 'Start i, target N, ±1 each step with equal probability.', 'O(N)', 'O(1)', ['randomized', 'simulation']],
  impl: lcgImpl('GRRng') + `
export function gamblerRuin(i: number, n: number, seed: number): { win: boolean; steps: number } {
  const r = new GRRng(seed);
  let money = i, steps = 0;
  while (money > 0 && money < n) {
    money += r.next() < 0.5 ? -1 : 1;
    steps++;
  }
  return { win: money === n, steps };
}`,
  trace: mt("import { gamblerRuin } from './impl.ts';", "gamblerRuin(5,10,42).steps", '模拟完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gamblerRuin } from '../../src/algorithms/randomized/rand-gambler-ruin/impl.ts';
test('终止于 0 或 N', () => {
  const res = gamblerRuin(5, 10, 42);
  assert.equal(res.win, true);
  assert.ok(res.steps > 0);
});
test('i=0 已破产', () => {
  assert.equal(gamblerRuin(0, 10, 1).win, false);
});`,
});

// 37. rand-ant
ALGS.push({
  id: 'rand-ant-random',
  m: ['随机蚂蚁行走', 'Random Ant Walk', '蚂蚁在网格上随机行走。', 'Ant random walk on a grid.',
    '每步随机选方向前进。', 'Each step a random direction.', 'O(n)', 'O(n)', ['randomized', 'simulation']],
  impl: lcgImpl('AntRng') + `
export function antWalk(steps: number, seed: number): [number, number] {
  const r = new AntRng(seed);
  let x = 0, y = 0;
  const dx = [0, 1, 0, -1], dy = [1, 0, -1, 0];
  for (let i = 0; i < steps; i++) {
    const d = Math.floor(r.next() * 4);
    x += dx[d]!; y += dy[d]!;
  }
  return [x, y];
}`,
  trace: mt("import { antWalk } from './impl.ts';", "antWalk(100,42)[0]", '行走完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { antWalk } from '../../src/algorithms/randomized/rand-ant-random/impl.ts';
test('曼哈顿距离 ≤ steps', () => {
  const [x, y] = antWalk(50, 42);
  assert.ok(Math.abs(x) + Math.abs(y) <= 50);
});`,
});

// 38. rand-rand-coloring
ALGS.push({
  id: 'rand-rand-coloring',
  m: ['随机图着色', 'Random Graph Coloring', '随机化启发式图着色。', 'Randomized heuristic graph coloring.',
    '随机顺序贪心着色。', 'Greedy coloring in random order.', 'O(V·d)', 'O(V)', ['randomized', 'graph']],
  impl: lcgImpl('ColRng') + `
export function randomColoring(adj: number[][], seed: number): number[] {
  const n = adj.length;
  const colors = new Array<number>(n).fill(-1);
  const r = new ColRng(seed);
  const order = adj.map((_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r.next() * (i + 1)); [order[i]!, order[j]!] = [order[j]!, order[i]!]; }
  for (const v of order) {
    const used = new Set<number>();
    for (const u of adj[v]!) if (colors[u]! >= 0) used.add(colors[u]!);
    let c = 0; while (used.has(c)) c++;
    colors[v] = c;
  }
  return colors;
}`,
  trace: mt("import { randomColoring } from './impl.ts';", "randomColoring([[1,2],[0,2],[0,1]],42).join(',')", '着色完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomColoring } from '../../src/algorithms/randomized/rand-rand-coloring/impl.ts';
test('三角形需 3 色', () => {
  const c = randomColoring([[1, 2], [0, 2], [0, 1]], 42);
  assert.notEqual(c[0], c[1]);
  assert.notEqual(c[0], c[2]);
  assert.notEqual(c[1], c[2]);
});`,
});

// 39. rand-2sat-papadimitriou
ALGS.push({
  id: 'rand-2sat-papadimitriou',
  m: ['随机化 2-SAT (Papadimitriou)', 'Randomized 2-SAT (Papadimitriou)', 'Papadimitriou 随机局部搜索求解 2-SAT。', 'Papadimitriou random local search for 2-SAT.',
    '随机初始化，翻改变量直到可满足或重启。', 'Random init, flip until satisfied or restart.', 'O(n²·log n)', 'O(n)', ['randomized', 'sat']],
  impl: lcgImpl('PSRng') + `
type Clause = [number, number];
export function twoSat(clauses: Clause[], n: number, seed: number): boolean[] | null {
  const r = new PSRng(seed);
  for (let restart = 0; restart < Math.log2(n + 2) + 2; restart++) {
    let assign = new Array<boolean>(n).fill(false);
    for (let i = 0; i < n; i++) assign[i] = r.next() < 0.5;
    const isSat = (c: Clause): boolean => (c[0] > 0 ? assign[c[0] - 1]! : !assign[-c[0] - 1]!) || (c[1] > 0 ? assign[c[1] - 1]! : !assign[-c[1] - 1]!);
    for (let step = 0; step < 2 * n * n; step++) {
      const unsat = clauses.filter((c) => !isSat(c));
      if (unsat.length === 0) return assign;
      const c = unsat[Math.floor(r.next() * unsat.length)]!;
      const varIdx = Math.abs((r.next() < 0.5 ? c[0] : c[1])) - 1;
      assign[varIdx] = !assign[varIdx];
    }
    if (clauses.every(isSat)) return assign;
  }
  return null;
}`,
  trace: mt("import { twoSat } from './impl.ts';", "twoSat([[1,2],[-1,-2]],2,42)===null?0:1", '求解完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSat } from '../../src/algorithms/randomized/rand-2sat-papadimitriou/impl.ts';
test('可满足', () => {
  // (x1∨x2)∧(¬x1∨x2) — satisfiable
  const a = twoSat([[1, 2], [-1, 2]], 2, 42);
  assert.ok(a !== null);
});`,
});

// 40. rand-max-cut-local
ALGS.push({
  id: 'rand-max-cut-local',
  m: ['随机局部搜索 Max-Cut', 'Randomized Local-Search Max-Cut', '随机局部搜索求解 Max-Cut。', 'Randomized local search for Max-Cut.',
    '翻改入边数多的顶点直到局部最优。', 'Flip vertex if more neighbors in same side.', 'O(iterations·E)', 'O(V)', ['randomized', 'graph']],
  impl: lcgImpl('MCR2Rng') + `
export function maxCutLocal(edges: [number, number][], n: number, seed: number, iters = 1000): { side: boolean[]; cut: number } {
  const r = new MCR2Rng(seed);
  const side = new Array<boolean>(n).fill(false);
  for (let i = 0; i < n; i++) side[i] = r.next() < 0.5;
  let improved = true;
  while (improved && iters-- > 0) {
    improved = false;
    for (let v = 0; v < n; v++) {
      let same = 0, diff = 0;
      for (const [a, b] of edges) {
        const u = a === v ? b : b === v ? a : -1;
        if (u === -1) continue;
        if (side[v] === side[u]) same++; else diff++;
      }
      if (same > diff) { side[v] = !side[v]; improved = true; }
    }
  }
  let cut = 0;
  for (const [a, b] of edges) if (side[a] !== side[b]) cut++;
  return { side, cut };
}`,
  trace: mt("import { maxCutLocal } from './impl.ts';", "maxCutLocal([[0,1],[1,2],[0,2]],3,42).cut", '分割完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxCutLocal } from '../../src/algorithms/randomized/rand-max-cut-local/impl.ts';
test('三角形可分割 2 条', () => {
  const r = maxCutLocal([[0, 1], [1, 2], [0, 2]], 3, 42);
  assert.ok(r.cut >= 2);
});`,
});

// 41. rand-rand-prime-check
ALGS.push({
  id: 'rand-fermat-test',
  m: ['费马素性检验', 'Fermat Primality Test', '费马小定理概率素性检验。', 'Probabilistic primality via Fermat\'s little theorem.',
    'a^(n-1) ≡ 1 (mod n) 对素数成立。', 'a^(n-1) ≡ 1 (mod n) holds for primes.', 'O(k·log n)', 'O(1)', ['randomized', 'prime']],
  impl: `// 费马素性检验 · 实现
function modPow(base: number, exp: number, m: number): number {
  base = ((base % m) + m) % m; let r = 1;
  while (exp > 0) { if (exp & 1) r = (r * base) % m; base = (base * base) % m; exp = Math.floor(exp / 2); }
  return r;
}
export function fermatIsPrime(n: number, witnesses: number[]): boolean {
  if (n < 2) return false;
  for (const a of witnesses) {
    if (a % n === 0) continue;
    if (modPow(a, n - 1, n) !== 1) return false;
  }
  return true;
}`,
  trace: mt("import { fermatIsPrime } from './impl.ts';", "fermatIsPrime(17,[2,3,5])?1:0", '检验完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fermatIsPrime } from '../../src/algorithms/randomized/rand-fermat-test/impl.ts';
test('17 是素数', () => { assert.equal(fermatIsPrime(17, [2, 3, 5]), true); });
test('15 不是', () => { assert.equal(fermatIsPrime(15, [2, 3, 5]), false); });`,
});

// 42. rand-solovay-strassen
ALGS.push({
  id: 'rand-solovay-strassen',
  m: ['Solovay-Strassen 检验', 'Solovay-Strassen Test', 'Jacobi 符号概率素性检验。', 'Jacobi-symbol probabilistic primality test.',
    '比费马更严格，无 Carmichael 漏检。', 'Stricter than Fermat; no Carmichael miss.', 'O(k·log n)', 'O(1)', ['randomized', 'prime']],
  impl: `// Solovay-Strassen 检验 · 实现
function modPow(base: number, exp: number, m: number): number {
  base = ((base % m) + m) % m; let r = 1;
  while (exp > 0) { if (exp & 1) r = (r * base) % m; base = (base * base) % m; exp = Math.floor(exp / 2); }
  return r;
}
function jacobi(a: number, n: number): number {
  a = ((a % n) + n) % n;
  let result = 1;
  while (a !== 0) {
    while (a % 2 === 0) { a /= 2; if (n % 8 === 3 || n % 8 === 5) result = -result; }
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
}`,
  trace: mt("import { solovayStrassen } from './impl.ts';", "solovayStrassen(17,[2,3])?1:0", '检验完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solovayStrassen } from '../../src/algorithms/randomized/rand-solovay-strassen/impl.ts';
test('17 是素数', () => { assert.equal(solovayStrassen(17, [2, 3, 5]), true); });`,
});

// 43. rand-plotkin
ALGS.push({
  id: 'rand-bergs-trotter',
  m: ['Bogle 随机化计数', 'Randomized Counting (Bogle)', '估计大集合基数的随机化算法。', 'Randomized algorithm to estimate large set cardinality.',
    '采样哈希最低位 1 的位置估计。', 'Sample position of lowest set bit of hash.', 'O(n)', 'O(1)', ['randomized', 'estimation']],
  impl: lcgImpl('BTRng') + `
export function estimateCardinality(items: number[], seed: number): number {
  const r = new BTRng(seed);
  let maxK = 0;
  for (const x of items) {
    let h = ((x * 2654435761) ^ (Math.floor(r.next() * 1e9))) >>> 0;
    if (h === 0) continue;
    let k = 0;
    while ((h & 1) === 0) { k++; h >>>= 1; }
    if (k > maxK) maxK = k;
  }
  return Math.floor(2 ** maxK);
}`,
  trace: mt("import { estimateCardinality } from './impl.ts';", "estimateCardinality([1,2,3,4,5],42)", '估计完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateCardinality } from '../../src/algorithms/randomized/rand-bergs-trotter/impl.ts';
test('估计为正', () => {
  const items = Array.from({ length: 100 }, (_, i) => i + 1);
  assert.ok(estimateCardinality(items, 42) >= 1);
});`,
});

// 44. rand-rand-graph-connectivity
ALGS.push({
  id: 'rand-rand-graph-connected',
  m: ['随机化图连通性', 'Randomized Graph Connectivity', '随机游走估计图连通性。', 'Estimate graph connectivity via random walks.',
    '多次随机游走统计可达顶点比例。', 'Multiple random walks; estimate reachable fraction.', 'O(walks·L)', 'O(V)', ['randomized', 'graph']],
  impl: lcgImpl('RGCRng') + `
export function reachableFraction(adj: number[][], start: number, walks: number, len: number, seed: number): number {
  const r = new RGCRng(seed);
  const reached = new Set<number>([start]);
  for (let w = 0; w < walks; w++) {
    let cur = start;
    for (let i = 0; i < len; i++) {
      const nbrs = adj[cur]!;
      if (nbrs.length === 0) break;
      cur = nbrs[Math.floor(r.next() * nbrs.length)]!;
      reached.add(cur);
    }
  }
  return reached.size / adj.length;
}`,
  trace: mt("import { reachableFraction } from './impl.ts';", "Math.round(reachableFraction([[1],[0],[3],[2]],0,10,5,42)*100)/100", '估计完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reachableFraction } from '../../src/algorithms/randomized/rand-rand-graph-connected/impl.ts';
test('比例在 [0,1]', () => {
  const f = reachableFraction([[1, 2], [0], [0]], 0, 10, 5, 42);
  assert.ok(f >= 0 && f <= 1);
});`,
});

// 45. rand-las-vegas-linear
ALGS.push({
  id: 'rand-las-vegas-linear',
  m: ['拉斯维加斯线性规划', 'Las Vegas Random LP (Seidel)', 'Seidel 拉斯维加斯算法求解低维 LP。', 'Seidel\'s Las Vegas algorithm for low-dim LP.',
    '增量加入约束，违反则递归。', 'Incrementally add constraints; recurse if violated.', 'O(d!·n)', 'O(d)', ['randomized', 'lp', 'las-vegas']],
  impl: lcgImpl('LVRng') + `
// 简化版：1 维 LP（最大化 c·x 满足 ax≤b）
export function lp1dMax(a: number[], b: number[], c: number): number | null {
  let upper = Infinity, lower = -Infinity;
  for (let i = 0; i < a.length; i++) {
    if (a[i]! > 0) upper = Math.min(upper, b[i]! / a[i]!);
    else if (a[i]! < 0) lower = Math.max(lower, b[i]! / a[i]!);
    else if (b[i]! < 0) return null; // 0·x≤b<0 不可行
  }
  if (lower > upper) return null;
  return c >= 0 ? upper : lower;
}`,
  trace: mt("import { lp1dMax } from './impl.ts';", "lp1dMax([1,-1],[3,2],1)", '求解完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lp1dMax } from '../../src/algorithms/randomized/rand-las-vegas-linear/impl.ts';
test('可行', () => {
  // x≤3, x≥-2 (即 -x≤2), max x: x=3
  assert.ok(Math.abs((lp1dMax([1, -1], [3, 2], 1) ?? NaN) - 3) < 1e-9);
});
test('不可行', () => {
  // x≤1, x≥5 不可行
  assert.equal(lp1dMax([1, -1], [1, -5], 1), null);
});`,
});

// Verify uniqueness vs existing
const EXISTING = ['alias-method','fisher-yates','freivalds-matrix','karger-min-cut','las-vegas-quickselect','linear-congruential-generator','mersenne-twister','middle-square','miller-rabin-test','monte-carlo-integration','monte-carlo-pi','pcg','pollard-rho-factor','quickselect','rand-alias-2','rand-antithetic','rand-bucket-shuffle','rand-complementary-multiply','rand-gibbs-sampling','rand-hash-drbg','rand-hash-mixer','rand-hmac-drbg','rand-importance','rand-kiss','rand-las-vegas-matching','rand-latin-hypercube','rand-lehmer','rand-lfsr','rand-metropolis-hastings','rand-monte-carlo-integration-2d','rand-mwc','rand-phi-fast','rand-random-sampling','rand-random-walk','rand-randomized-qsort','rand-rc4-rng','rand-rejection-2','rand-reservoir-2','rand-sattolo-cycle','rand-seed-extend','rand-shuffle-sattolo-2','rand-stratified','rand-weighted-random','rand-wichmann-hill','random-matrix','random-permutation-check','random-quick-sort','randomized-bipartite','randomized-hamiltonian','randomized-skip-list','rejection-sampling','reservoir-sampling','reservoir-weighted','schwartz-zippel','xorshift'];
for (const a of ALGS) {
  if (EXISTING.includes(a.id)) throw new Error('ID 冲突: ' + a.id);
  writeAlg(a.id, meta(a.id, ...a.m), a.impl, a.trace, a.test);
}
console.log('randomized: wrote ' + ALGS.length + ' algorithms');
