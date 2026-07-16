// misc batch 2 — 30 new algorithms (70 -> 100)
export const algos = [
// 1. misc-perfect-power-2
{
  id: 'misc-perfect-power-2',
  titleZh: '完美幂判定', titleEn: 'Perfect Power Detection',
  summaryZh: '判断 n 是否可写成 a^b（a>0,b>1），枚举指数二分底数。',
  summaryEn: 'Test if n = a^b with a>0,b>1 by enumerating exponent and binary-searching base.',
  descZh: '完美幂：n=a^b。枚举 b∈[2,log2 n]，对每个 b 二分找 a 使 a^b=n。存在则返回 (a,b)。',
  descEn: 'Perfect power: n=a^b. Try each b in [2,log2 n], binary-search base a with a^b=n.',
  tags: ['misc','number-theory'],
  time: 'O(log²n)', space: 'O(1)',
  impl: `// 完美幂判定 · 实现
export interface PpHooks { onProbe?: (b: number, a: number, val: number) => void; onConclude?: (isPerfect: boolean, base: number, exp: number) => void; }
export function perfectPower(n: number, hooks: PpHooks = {}): { isPerfect: boolean; base: number; exp: number } {
  if (n < 4) return { isPerfect: false, base: 0, exp: 0 };
  const maxB = Math.floor(Math.log2(n));
  for (let b = 2; b <= maxB; b++) {
    let lo = 2, hi = Math.floor(Math.pow(2, Math.ceil(Math.log2(n) / b))) + 1;
    while (lo <= hi) {
      const a = Math.floor((lo + hi) / 2);
      const val = Math.pow(a, b);
      hooks.onProbe?.(b, a, val);
      if (val === n) { hooks.onConclude?.(true, a, b); return { isPerfect: true, base: a, exp: b }; }
      if (val < n) lo = a + 1; else hi = a - 1;
    }
  }
  hooks.onConclude?.(false, 0, 0);
  return { isPerfect: false, base: 0, exp: 0 };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { perfectPower } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 216;
  rec.begin({ zh: \`完美幂判定 \${n}\`, en: \`Perfect power \${n}\` }).commit();
  const r = perfectPower(n, {
    onConclude: (ok, a, b) => rec.begin({ zh: ok ? \`\${n}=\${a}^\${b}\` : \`\${n} 不是完美幂\`, en: ok ? \`\${n}=\${a}^\${b}\` : \`\${n} not perfect\` })
      .setAux([{ label: 'result', value: ok ? \`\${a}^\${b}\` : 'NO', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perfectPower } from '../../src/algorithms/misc/misc-perfect-power-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-perfect-power-2/trace.ts';
test('64 = 8^2 或 2^6', () => {
  const r = perfectPower(64);
  assert.equal(r.isPerfect, true);
  assert.equal(Math.pow(r.base, r.exp), 64);
});
test('素数非完美幂', () => {
  assert.equal(perfectPower(17).isPerfect, false);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 2. misc-amicable-pair
{
  id: 'misc-amicable-pair',
  titleZh: '亲和数对', titleEn: 'Amicable Pair',
  summaryZh: '两数各自真因子和等于对方，如 (220,284)，枚举验证。',
  summaryEn: 'Two numbers whose proper-divisor sums equal each other, e.g. (220,284); enumerate to verify.',
  descZh: '亲和数：σ(a)-a=b 且 σ(b)-b=a。枚举范围内数，计算因子和检查配对。',
  descEn: 'Amicable: σ(a)-a=b and σ(b)-b=a. Scan range, compute divisor-sum, check pairing.',
  tags: ['misc','number-theory'],
  time: 'O(n√n)', space: 'O(n)',
  impl: `// 亲和数对 · 实现
export interface ApHooks { onCheck?: (a: number, sumDiv: number, isAmicable: boolean) => void; onConclude?: (pairs: Array<[number, number]>) => void; }
function sumProperDiv(n: number): number { if (n < 2) return 0; let s = 1; for (let i = 2; i * i <= n; i++) { if (n % i === 0) { s += i; if (i !== n / i) s += n / i; } } return s; }
export function amicablePairs(limit: number, hooks: ApHooks = {}): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let a = 2; a <= limit; a++) {
    const b = sumProperDiv(a);
    if (b > a && b <= limit && sumProperDiv(b) === a) { pairs.push([a, b]); hooks.onCheck?.(a, b, true); }
    else hooks.onCheck?.(a, b, false);
  }
  hooks.onConclude?.(pairs);
  return pairs;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { amicablePairs } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '亲和数 limit=300', en: 'Amicable limit=300' }).commit();
  const pairs = amicablePairs(300, {
    onConclude: (ps) => rec.begin({ zh: \`找到 \${ps.length} 对\`, en: \`found \${ps.length} pairs\` })
      .setBars(ps.map(() => ({ value: 1, role: 'final' as BarRole }))).commit(),
  });
  rec.begin({ zh: pairs.map((p) => \`(\${p[0]},\${p[1]})\`).join(' '), en: pairs.map((p) => \`(\${p[0]},\${p[1]})\`).join(' ') })
    .setAux(pairs.length ? [{ label: 'pairs', value: pairs.map((p) => p.join(',')).join('; '), role: 'final' as BarRole }] : []).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amicablePairs } from '../../src/algorithms/misc/misc-amicable-pair/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-amicable-pair/trace.ts';
test('220 和 284 是亲和数', () => {
  const pairs = amicablePairs(300);
  assert.ok(pairs.some((p) => p[0] === 220 && p[1] === 284));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 3. misc-abundant-number
{
  id: 'misc-abundant-number',
  titleZh: '过剩数判定', titleEn: 'Abundant Number',
  summaryZh: '真因子和大于自身的数，如 12，与完美数/亏数互补。',
  summaryEn: 'A number whose proper-divisor sum exceeds itself, e.g. 12; complement of deficient/perfect.',
  descZh: '过剩数：σ(n)-n > n 即 σ(n)>2n。最小的过剩数是 12。',
  descEn: 'Abundant: σ(n)-n > n i.e. σ(n)>2n. Smallest is 12.',
  tags: ['misc','number-theory'],
  time: 'O(√n)', space: 'O(1)',
  impl: `// 过剩数判定 · 实现
export interface AnHooks { onDivisor?: (d: number) => void; onConclude?: (sum: number, isAbundant: boolean) => void; }
export function isAbundant(n: number, hooks: AnHooks = {}): boolean {
  if (n < 12) { hooks.onConclude?.(0, false); return false; }
  let s = 1; hooks.onDivisor?.(1);
  for (let i = 2; i * i <= n; i++) { if (n % i === 0) { s += i; hooks.onDivisor?.(i); if (i !== n / i) { s += n / i; hooks.onDivisor?.(n / i); } } }
  const ab = s > n;
  hooks.onConclude?.(s, ab);
  return ab;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isAbundant } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 12;
  rec.begin({ zh: \`过剩数判定 \${n}\`, en: \`Abundant \${n}\` }).commit();
  const ab = isAbundant(n, {
    onDivisor: (d) => rec.begin({ zh: \`因子 \${d}\`, en: \`divisor \${d}\` }).commit(),
    onConclude: (s, a) => rec.begin({ zh: \`\${n} 因子和=\${s} \${a ? '过剩' : '非过剩'}\`, en: \`\${n} sum=\${s} \${a ? 'abundant' : 'not'}\` })
      .setAux([{ label: 'sum', value: String(s), role: 'pivot' as BarRole }, { label: 'abundant', value: a ? 'YES' : 'NO', role: a ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  void ab;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isAbundant } from '../../src/algorithms/misc/misc-abundant-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-abundant-number/trace.ts';
test('12 是过剩数', () => { assert.equal(isAbundant(12), true); });
test('11 非过剩数', () => { assert.equal(isAbundant(11), false); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 4. misc-deficient-number
{
  id: 'misc-deficient-number',
  titleZh: '亏数判定', titleEn: 'Deficient Number',
  summaryZh: '真因子和小于自身的数，大多数自然数为亏数。',
  summaryEn: 'A number whose proper-divisor sum is less than itself; most naturals are deficient.',
  descZh: '亏数：σ(n)-n < n 即 σ(n)<2n。所有素数都是亏数。',
  descEn: 'Deficient: σ(n)-n < n i.e. σ(n)<2n. All primes are deficient.',
  tags: ['misc','number-theory'],
  time: 'O(√n)', space: 'O(1)',
  impl: `// 亏数判定 · 实现
export interface DnHooks { onConclude?: (sum: number, isDeficient: boolean) => void; }
export function isDeficient(n: number, hooks: DnHooks = {}): boolean {
  if (n < 2) { hooks.onConclude?.(0, true); return true; }
  let s = 1;
  for (let i = 2; i * i <= n; i++) { if (n % i === 0) { s += i; if (i !== n / i) s += n / i; } }
  const d = s < n;
  hooks.onConclude?.(s, d);
  return d;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isDeficient } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 21;
  rec.begin({ zh: \`亏数判定 \${n}\`, en: \`Deficient \${n}\` }).commit();
  isDeficient(n, {
    onConclude: (s, d) => rec.begin({ zh: \`\${n} 因子和=\${s} \${d ? '亏数' : '非亏'}\`, en: \`\${n} sum=\${s} \${d ? 'deficient' : 'not'}\` })
      .setBars([{ value: s, role: 'pivot' as BarRole }, { value: n, role: 'default' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeficient } from '../../src/algorithms/misc/misc-deficient-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-deficient-number/trace.ts';
test('素数是亏数', () => { assert.equal(isDeficient(13), true); });
test('12 不是亏数', () => { assert.equal(isDeficient(12), false); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 5. misc-smith-number
{
  id: 'misc-smith-number',
  titleZh: '史密斯数', titleEn: 'Smith Number',
  summaryZh: '合数其各位数字和等于其质因子各位数字和，如 22。',
  summaryEn: 'Composite whose digit sum equals the digit sum of its prime factors, e.g. 22.',
  descZh: '史密斯数：合数 n，digitSum(n)=Σ digitSum(p_i^e_i)。例如 666=2·3·3·37，6+6+6=2+3+3+3+7=18。',
  descEn: 'Smith: composite n where digitSum(n)=Σ digitSum(prime factors). E.g. 666=2·3·3·37, sums both 18.',
  tags: ['misc','number-theory'],
  time: 'O(√n)', space: 'O(1)',
  impl: `// 史密斯数 · 实现
export interface SnHooks { onFactor?: (p: number) => void; onConclude?: (digitSum: number, factorSum: number, isSmith: boolean) => void; }
function digitSum(n: number): number { let s = 0; while (n > 0) { s += n % 10; n = Math.floor(n / 10); } return s; }
export function isSmithNumber(n: number, hooks: SnHooks = {}): boolean {
  if (n < 2) { hooks.onConclude?.(0, 0, false); return false; }
  let m = n, factorSum = 0;
  for (let p = 2; p * p <= m; p++) { while (m % p === 0) { factorSum += digitSum(p); hooks.onFactor?.(p); m = Math.floor(m / p); } }
  if (m > 1) { if (m === n) { hooks.onConclude?.(0, 0, false); return false; } factorSum += digitSum(m); hooks.onFactor?.(m); }
  const ds = digitSum(n);
  const isSmith = ds === factorSum;
  hooks.onConclude?.(ds, factorSum, isSmith);
  return isSmith;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isSmithNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 666;
  rec.begin({ zh: \`史密斯数 \${n}\`, en: \`Smith \${n}\` }).commit();
  isSmithNumber(n, {
    onFactor: (p) => rec.begin({ zh: \`因子 \${p}\`, en: \`factor \${p}\` }).commit(),
    onConclude: (ds, fs, ok) => rec.begin({ zh: \`\${n} 数字和=\${ds} 因子和=\${fs} \${ok ? '史密斯' : '否'}\`, en: \`\${n} dsum=\${ds} fsum=\${fs} \${ok ? 'smith' : 'no'}\` })
      .setAux([{ label: 'ds', value: String(ds), role: 'pivot' as BarRole }, { label: 'fs', value: String(fs), role: 'pivot' as BarRole }, { label: 'smith', value: ok ? 'YES' : 'NO', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSmithNumber } from '../../src/algorithms/misc/misc-smith-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-smith-number/trace.ts';
test('666 是史密斯数', () => { assert.equal(isSmithNumber(666), true); });
test('素数非史密斯', () => { assert.equal(isSmithNumber(7), false); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 6. misc-keith-number
{
  id: 'misc-keith-number',
  titleZh: '基思数', titleEn: 'Keith Number',
  summaryZh: '用自身各位数字做斐波那契式累加能回到自身的数，如 14, 19, 197。',
  summaryEn: 'Fibonacci-like sum of its own digits returns to itself, e.g. 14, 19, 197.',
  descZh: '基思数：n 的各位 d_1..d_k 作为初始项，每项=前 k 项之和，序列中出现 n 则为基思数。',
  descEn: 'Keith number: digits d_1..d_k as seeds, each term = sum of previous k; if n appears in the sequence.',
  tags: ['misc','number-theory','sequence'],
  time: 'O(log n · log n)', space: 'O(log n)',
  impl: `// 基思数 · 实现
export interface KnHooks { onTerm?: (term: number) => void; onConclude?: (isKeith: boolean) => void; }
export function isKeithNumber(n: number, hooks: KnHooks = {}): boolean {
  const digits: number[] = []; let m = n; while (m > 0) { digits.unshift(m % 10); m = Math.floor(m / 10); }
  const k = digits.length; if (k < 2) { hooks.onConclude?.(false); return false; }
  let seq = [...digits];
  for (let i = 0; i < 1000; i++) {
    const next = seq.reduce((a, b) => a + b, 0);
    hooks.onTerm?.(next);
    if (next === n) { hooks.onConclude?.(true); return true; }
    if (next > n) { hooks.onConclude?.(false); return false; }
    seq = [...seq.slice(1), next];
  }
  hooks.onConclude?.(false);
  return false;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isKeithNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 197;
  rec.begin({ zh: \`基思数 \${n}\`, en: \`Keith \${n}\` }).commit();
  isKeithNumber(n, {
    onTerm: (t) => rec.begin({ zh: \`项 \${t}\`, en: \`term \${t}\` })
      .setBars([{ value: t, role: t === n ? ('final' as BarRole) : ('pivot' as BarRole) }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isKeithNumber } from '../../src/algorithms/misc/misc-keith-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-keith-number/trace.ts';
test('197 是基思数', () => { assert.equal(isKeithNumber(197), true); });
test('100 不是基思数', () => { assert.equal(isKeithNumber(100), false); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 7. misc-narcissistic-number
{
  id: 'misc-narcissistic-number',
  titleZh: '水仙花数', titleEn: 'Narcissistic Number',
  summaryZh: '各位数字的 k 次幂和等于自身的 k 位数，如 153=1³+5³+3³。',
  summaryEn: 'A k-digit number equal to the sum of its digits each raised to the k-th power, e.g. 153.',
  descZh: '水仙花数（自幂数）：k 位数 n，n=Σ d_i^k。如 153=1³+5³+3³。',
  descEn: 'Narcissistic: k-digit n with n=Σ d_i^k. E.g. 153=1³+5³+3³.',
  tags: ['misc','number-theory'],
  time: 'O(k)', space: 'O(1)',
  impl: `// 水仙花数 · 实现
export interface NaHooks { onConclude?: (sum: number, isNarcissistic: boolean) => void; }
export function isNarcissistic(n: number, hooks: NaHooks = {}): boolean {
  const digits: number[] = []; let m = n; while (m > 0) { digits.push(m % 10); m = Math.floor(m / 10); }
  const k = digits.length;
  const sum = digits.reduce((a, d) => a + Math.pow(d, k), 0);
  const ok = sum === n;
  hooks.onConclude?.(sum, ok);
  return ok;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isNarcissistic } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 153;
  rec.begin({ zh: \`水仙花 \${n}\`, en: \`Narcissistic \${n}\` }).commit();
  isNarcissistic(n, {
    onConclude: (s, ok) => rec.begin({ zh: \`\${n} 幂和=\${s} \${ok ? '是' : '否'}\`, en: \`\${n} sum=\${s} \${ok ? 'yes' : 'no'}\` })
      .setBars([{ value: s, role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isNarcissistic } from '../../src/algorithms/misc/misc-narcissistic-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-narcissistic-number/trace.ts';
test('153 是水仙花数', () => { assert.equal(isNarcissistic(153), true); });
test('100 不是', () => { assert.equal(isNarcissistic(100), false); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 8. misc-kaprekar
{
  id: 'misc-kaprekar',
  titleZh: '卡布列克数', titleEn: 'Kaprekar Number',
  summaryZh: '平方后分成两段相加等于原数，如 9²=81, 8+1=9。',
  summaryEn: 'Square splits into two parts that sum to the original, e.g. 9²=81, 8+1=9.',
  descZh: '卡布列克数：n² 分成左右两段 r 和 l，r+l=n（r 可为 0 但不能全 0）。如 45²=2025, 20+25=45。',
  descEn: 'Kaprekar: n² split into right r and left l with r+l=n (r may be 0 but not all zero). E.g. 45²=2025.',
  tags: ['misc','number-theory'],
  time: 'O(log n)', space: 'O(log n)',
  impl: `// 卡布列克数 · 实现
export interface KpHooks { onSplit?: (sq: number, left: number, right: number) => void; onConclude?: (isKaprekar: boolean) => void; }
export function isKaprekar(n: number, hooks: KpHooks = {}): boolean {
  if (n < 1) { hooks.onConclude?.(false); return false; }
  const sq = n * n;
  const s = String(sq);
  for (let i = 1; i < s.length; i++) {
    const left = parseInt(s.slice(0, i), 10);
    const right = parseInt(s.slice(i), 10);
    hooks.onSplit?.(sq, left, right);
    if (right > 0 && left + right === n) { hooks.onConclude?.(true); return true; }
  }
  hooks.onConclude?.(false);
  return false;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isKaprekar } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 45;
  rec.begin({ zh: \`卡布列克 \${n}\`, en: \`Kaprekar \${n}\` }).commit();
  isKaprekar(n, {
    onSplit: (sq, l, r) => rec.begin({ zh: \`\${sq} -> \${l}+\${r}\`, en: \`\${sq} -> \${l}+\${r}\` })
      .setBars([{ value: l, role: 'pivot' as BarRole }, { value: r, role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isKaprekar } from '../../src/algorithms/misc/misc-kaprekar/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-kaprekar/trace.ts';
test('45 是卡布列克数', () => { assert.equal(isKaprekar(45), true); });
test('100 不是', () => { assert.equal(isKaprekar(100), false); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 9. misc-happy-range
{
  id: 'misc-happy-range',
  titleZh: '快乐数区间', titleEn: 'Happy Number Range',
  summaryZh: '统计区间内快乐数个数，每个数反复平方和直到 1 或循环。',
  summaryEn: 'Count happy numbers in a range; each repeatedly sums digit-squares until 1 or cycle.',
  descZh: '快乐数：反复将 n 替换为各位平方和，最终到 1。扫描区间统计快乐数。',
  descEn: 'Happy: replace n by sum of squares of digits until reaching 1. Count in a range.',
  tags: ['misc','number-theory'],
  time: 'O(n·log n)', space: 'O(log n)',
  impl: `// 快乐数区间 · 实现
export interface HrHooks { onNumber?: (n: number, isHappy: boolean) => void; onConclude?: (count: number) => void; }
function isHappy(n: number): boolean { const seen = new Set<number>(); let x = n; while (x !== 1 && !seen.has(x)) { seen.add(x); let s = 0; while (x > 0) { const d = x % 10; s += d * d; x = Math.floor(x / 10); } x = s; } return x === 1; }
export function happyRange(lo: number, hi: number, hooks: HrHooks = {}): number {
  let count = 0;
  for (let n = lo; n <= hi; n++) { const h = isHappy(n); if (h) count++; hooks.onNumber?.(n, h); }
  hooks.onConclude?.(count);
  return count;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { happyRange } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '快乐数 [1,30]', en: 'Happy [1,30]' }).commit();
  const flags: boolean[] = [];
  const c = happyRange(1, 30, {
    onNumber: (n, h) => { flags.push(h); },
  });
  rec.begin({ zh: \`\${c} 个快乐数\`, en: \`\${c} happy numbers\` })
    .setBars(flags.map((f) => ({ value: f ? 1 : 0, role: f ? ('final' as BarRole) : ('default' as BarRole) }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { happyRange } from '../../src/algorithms/misc/misc-happy-range/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-happy-range/trace.ts';
test('1..30 中有快乐数', () => {
  assert.ok(happyRange(1, 30) > 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 10. misc-prime-gap
{
  id: 'misc-prime-gap',
  titleZh: '素数间隙', titleEn: 'Prime Gap',
  summaryZh: '相邻素数之差，分析最大间隙分布与孪生素数。',
  summaryEn: 'Difference between consecutive primes; analyze max gap and twin primes.',
  descZh: '素数间隙：g_n = p_{n+1} - p_n。孪生素数对应 g=2。筛出范围内素数计算间隙。',
  descEn: 'Prime gap: g_n = p_{n+1} - p_n. Twin primes give g=2. Sieve primes in range, compute gaps.',
  tags: ['misc','number-theory','prime'],
  time: 'O(n log log n)', space: 'O(n)',
  impl: `// 素数间隙 · 实现
export interface PgHooks { onGap?: (p1: number, p2: number, gap: number) => void; onConclude?: (maxGap: number, twinCount: number) => void; }
function sieve(limit: number): number[] { const isP = new Uint8Array(limit + 1).fill(1); isP[0] = isP[1] = 0; for (let i = 2; i * i <= limit; i++) if (isP[i]) for (let j = i * i; j <= limit; j += i) isP[j] = 0; const ps: number[] = []; for (let i = 2; i <= limit; i++) if (isP[i]) ps.push(i); return ps; }
export function primeGaps(limit: number, hooks: PgHooks = {}): { maxGap: number; twinCount: number } {
  const ps = sieve(limit);
  let maxGap = 0, twinCount = 0;
  for (let i = 0; i + 1 < ps.length; i++) { const g = ps[i + 1]! - ps[i]!; hooks.onGap?.(ps[i]!, ps[i + 1]!, g); if (g > maxGap) maxGap = g; if (g === 2) twinCount++; }
  hooks.onConclude?.(maxGap, twinCount);
  return { maxGap, twinCount };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primeGaps } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '素数间隙 limit=50', en: 'Prime gaps limit=50' }).commit();
  const r = primeGaps(50, {
    onGap: (p1, p2, g) => rec.begin({ zh: \`\${p1}->\${p2} gap=\${g}\`, en: \`\${p1}->\${p2} gap=\${g}\` })
      .setBars([{ value: g, role: g === 2 ? ('final' as BarRole) : ('pivot' as BarRole) }]).commit(),
  });
  rec.begin({ zh: \`最大间隙 \${r.maxGap} 孪生 \${r.twinCount}\`, en: \`max \${r.maxGap} twins \${r.twinCount}\` })
    .setAux([{ label: 'maxGap', value: String(r.maxGap), role: 'final' as BarRole }, { label: 'twins', value: String(r.twinCount), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primeGaps } from '../../src/algorithms/misc/misc-prime-gap/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-prime-gap/trace.ts';
test('50 内有孪生素数', () => {
  const r = primeGaps(50);
  assert.ok(r.twinCount > 0);
  assert.ok(r.maxGap >= 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 11. misc-goldbach
{
  id: 'misc-goldbach',
  titleZh: '哥德巴赫验证', titleEn: 'Goldbach Verification',
  summaryZh: '验证偶数可写成两素数之和，枚举素数对。',
  summaryEn: 'Verify an even number equals a sum of two primes; enumerate prime pairs.',
  descZh: '哥德巴赫猜想：每个 >2 的偶数 = 两素数之和。枚举 p≤n/2，检查 n-p 是否素数。',
  descEn: 'Goldbach: every even >2 is a sum of two primes. Try each p<=n/2, check n-p prime.',
  tags: ['misc','number-theory','prime'],
  time: 'O(√n)', space: 'O(1)',
  impl: `// 哥德巴赫验证 · 实现
export interface GbHooks { onPair?: (p: number, q: number) => void; onConclude?: (pairs: number) => void; }
function isPrime(n: number): boolean { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
export function goldbach(n: number, hooks: GbHooks = {}): Array<[number, number]> {
  if (n <= 2 || n % 2 !== 0) { hooks.onConclude?.(0); return []; }
  const pairs: Array<[number, number]> = [];
  for (let p = 2; p <= n / 2; p++) { if (isPrime(p) && isPrime(n - p)) { pairs.push([p, n - p]); hooks.onPair?.(p, n - p); } }
  hooks.onConclude?.(pairs.length);
  return pairs;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { goldbach } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 100;
  rec.begin({ zh: \`哥德巴赫 \${n}\`, en: \`Goldbach \${n}\` }).commit();
  const pairs = goldbach(n, {
    onPair: (p, q) => rec.begin({ zh: \`\${p}+\${q}\`, en: \`\${p}+\${q}\` })
      .setBars([{ value: p, role: 'final' as BarRole }, { value: q, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`\${pairs.length} 对\`, en: \`\${pairs.length} pairs\` })
    .setBars([{ value: pairs.length, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goldbach } from '../../src/algorithms/misc/misc-goldbach/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-goldbach/trace.ts';
test('100 至少一对', () => {
  const pairs = goldbach(100);
  assert.ok(pairs.length > 0);
  assert.equal(pairs[0]![0] + pairs[0]![1], 100);
});
test('奇数返回空', () => { assert.equal(goldbach(9).length, 0); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 12. misc-digital-root
{
  id: 'misc-digital-root',
  titleZh: '数根', titleEn: 'Digital Root',
  summaryZh: '反复求数字和直到一位，等价于 n mod 9（特殊处理 9 的倍数）。',
  summaryEn: 'Iteratively sum digits to one digit; equals n mod 9 (with multiples of 9 giving 9).',
  descZh: '数根：dr(n) = n===0?0 : 1+((n-1) mod 9)。是 n 对 9 取模的映射（0 映射为 9）。',
  descEn: 'Digital root: dr(n) = n===0?0 : 1+((n-1) mod 9). Maps n mod 9 (0->9).',
  tags: ['misc','number-theory'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 数根 · 实现
export interface DrHooks { onConclude?: (root: number) => void; }
export function digitalRoot(n: number, hooks: DrHooks = {}): number {
  if (n === 0) { hooks.onConclude?.(0); return 0; }
  const r = 1 + ((n - 1) % 9);
  hooks.onConclude?.(r);
  return r;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { digitalRoot } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ns = [0, 9, 38, 12345, 999999];
  rec.begin({ zh: '数根', en: 'Digital root' }).commit();
  const roots = ns.map((n) => digitalRoot(n));
  rec.begin({ zh: ns.map((n, i) => \`\${n}->\${roots[i]}\`).join(' '), en: ns.map((n, i) => \`\${n}->\${roots[i]}\`).join(' ') })
    .setBars(roots.map((r) => ({ value: r, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { digitalRoot } from '../../src/algorithms/misc/misc-digital-root/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-digital-root/trace.ts';
test('38 数根=2', () => { assert.equal(digitalRoot(38), 2); });
test('9 的倍数数根=9', () => { assert.equal(digitalRoot(999), 9); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 13. misc-palindrome-decimal
{
  id: 'misc-palindrome-decimal',
  titleZh: '回文数构造', titleEn: 'Palindromic Number Construction',
  summaryZh: '把数字反转相加迭代，大多数数能产生回文（Lychrel 数例外）。',
  summaryEn: 'Reverse-and-add iteration yields palindromes for most numbers (Lychrel numbers excepted).',
  descZh: '回文数构造：n = n + reverse(n)，重复直到回文。196 等是疑似 Lychrel 数（暂未得到回文）。',
  descEn: 'Palindrome construction: n = n + reverse(n), repeat until palindrome. 196 is a suspected Lychrel number.',
  tags: ['misc','number-theory','palindrome'],
  time: 'O(k·log n)', space: 'O(log n)',
  impl: `// 回文数构造 · 实现
export interface PdHooks { onIter?: (i: number, n: number) => void; onConclude?: (palindrome: number, iters: number) => void; }
function reverseNum(n: number): number { let r = 0, x = n; while (x > 0) { r = r * 10 + x % 10; x = Math.floor(x / 10); } return r; }
function isPal(n: number): boolean { return n === reverseNum(n); }
export function palindromeConstruct(n: number, maxIters = 100, hooks: PdHooks = {}): { palindrome: number; iters: number } {
  let x = n, i = 0;
  while (!isPal(x) && i < maxIters) { x = x + reverseNum(x); i++; hooks.onIter?.(i, x); }
  hooks.onConclude?.(x, i);
  return { palindrome: x, iters: i };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { palindromeConstruct } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 87;
  rec.begin({ zh: \`回文构造 \${n}\`, en: \`Palindrome \${n}\` }).commit();
  const r = palindromeConstruct(n, 20, {
    onIter: (i, x) => rec.begin({ zh: \`迭代\${i}: \${x}\`, en: \`iter\${i}: \${x}\` })
      .setBars([{ value: x % 1000, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`回文 \${r.palindrome} @\${r.iters}步\`, en: \`pal \${r.palindrome} @\${r.iters}\` })
    .setAux([{ label: 'pal', value: String(r.palindrome), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palindromeConstruct } from '../../src/algorithms/misc/misc-palindrome-decimal/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-palindrome-decimal/trace.ts';
test('87 能产生回文', () => {
  const r = palindromeConstruct(87, 20);
  const rev = String(r.palindrome).split('').reverse().join('');
  assert.equal(String(r.palindrome), rev);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 14. misc-look-and-say
{
  id: 'misc-look-and-say',
  titleZh: '外观数列', titleEn: 'Look-and-Say Sequence',
  summaryZh: '读出上一项的数字：连续相同数字用"个数+数字"描述，如 1->11->21->1211。',
  summaryEn: 'Describe the previous term: runs become "count+digit", e.g. 1->11->21->1211.',
  descZh: '外观数列：每项 = 上一项中连续相同数字的 (个数, 数字) 拼接。Conway 分析其增长率 ≈ 1.3035。',
  descEn: 'Look-and-say: each term = concatenation of (count, digit) of runs in the previous. Conway ratio ~1.3035.',
  tags: ['misc','sequence'],
  time: 'O(L)', space: 'O(L)',
  impl: `// 外观数列 · 实现
export interface LsHooks { onTerm?: (i: number, term: string) => void; }
export function lookAndSay(start: string, k: number, hooks: LsHooks = {}): string[] {
  const terms = [start];
  for (let it = 0; it < k; it++) {
    let cur = '', i = 0;
    const s = terms[terms.length - 1]!;
    while (i < s.length) { let c = 1; while (i + c < s.length && s[i + c] === s[i]) c++; cur += String(c) + s[i]; i += c; }
    terms.push(cur); hooks.onTerm?.(it + 1, cur);
  }
  return terms;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lookAndSay } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '外观数列', en: 'Look-and-say' }).commit();
  const terms = lookAndSay('1', 6, {
    onTerm: (i, t) => rec.begin({ zh: \`第\${i}项: \${t}\`, en: \`term\${i}: \${t}\` })
      .setAux([{ label: 'len', value: String(t.length), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`\${terms.length} 项\`, en: \`\${terms.length} terms\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lookAndSay } from '../../src/algorithms/misc/misc-look-and-say/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-look-and-say/trace.ts';
test('1->11->21->1211', () => {
  const t = lookAndSay('1', 3);
  assert.deepEqual(t.slice(0, 4), ['1', '11', '21', '1211']);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 15. misc-josephus-variant
{
  id: 'misc-josephus-variant',
  titleZh: '约瑟夫变体', titleEn: 'Josephus Variant',
  summaryZh: '每轮淘汰第 k 人，求幸存者位置，递推 O(n)。',
  summaryEn: 'Eliminate every k-th person; find survivor via O(n) recurrence.',
  descZh: '约瑟夫问题：n 人围圈，每数到 k 淘汰。J(n,k)=(J(n-1,k)+k) mod n，J(1,k)=0。',
  descEn: 'Josephus: n in circle, eliminate every k-th. J(n,k)=(J(n-1,k)+k) mod n, J(1,k)=0.',
  tags: ['misc','simulation','recurrence'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 约瑟夫变体 · 实现
export interface JvHooks { onRound?: (alive: number, survivor: number) => void; onConclude?: (survivor: number) => void; }
export function josephusVariant(n: number, k: number, hooks: JvHooks = {}): number {
  let s = 0;
  for (let i = 2; i <= n; i++) { s = (s + k) % i; hooks.onRound?.(i, s); }
  hooks.onConclude?.(s);
  return s;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { josephusVariant } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '约瑟夫 n=41 k=3', en: 'Josephus n=41 k=3' }).commit();
  const s = josephusVariant(41, 3, {
    onConclude: (sv) => rec.begin({ zh: \`幸存者位置 \${sv}\`, en: \`survivor \${sv}\` })
      .setBars([{ value: sv, role: 'final' as BarRole }]).commit(),
  });
  void s;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { josephusVariant } from '../../src/algorithms/misc/misc-josephus-variant/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-josephus-variant/trace.ts';
test('J(41,3)=30', () => { assert.equal(josephusVariant(41, 3), 30); });
test('J(5,2)=2', () => { assert.equal(josephusVariant(5, 2), 2); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 16. misc-nim-strategy
{
  id: 'misc-nim-strategy',
  titleZh: 'Nim 取胜策略', titleEn: 'Nim Winning Strategy',
  summaryZh: 'Nim 和非零时取若干使 Nim 和变零，先手必胜。',
  summaryEn: 'When nim-sum is nonzero, remove stones to make it zero; first player wins.',
  descZh: 'Nim 策略：nimSum=Σ堆^异或。若非 0，找一堆使其与 nimSum 异或后变小，取差量使 nimSum 归 0。',
  descEn: 'Nim strategy: nimSum=XOR of piles. If nonzero, pick a pile whose XOR with nimSum is smaller, take the diff.',
  tags: ['misc','game-theory','bitwise'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Nim 取胜策略 · 实现
export interface NsHooks { onConclude?: (firstWins: boolean, pile: number, take: number) => void; }
export function nimStrategy(piles: readonly number[], hooks: NsHooks = {}): { firstWins: boolean; pile: number; take: number } {
  const nimSum = piles.reduce((a, b) => a ^ b, 0);
  if (nimSum === 0) { hooks.onConclude?.(false, -1, 0); return { firstWins: false, pile: -1, take: 0 }; }
  for (let i = 0; i < piles.length; i++) { const t = piles[i]! ^ nimSum; if (t < piles[i]!) { const take = piles[i]! - t; hooks.onConclude?.(true, i, take); return { firstWins: true, pile: i, take }; } }
  hooks.onConclude?.(false, -1, 0);
  return { firstWins: false, pile: -1, take: 0 };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nimStrategy } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const piles = [5, 5, 5];
  rec.begin({ zh: \`Nim [\${piles.join(',')}]\`, en: \`Nim [\${piles.join(',')}]\` })
    .setBars(piles.map((p) => ({ value: p, role: 'default' as BarRole }))).commit();
  const r = nimStrategy(piles, {
    onConclude: (fw, p, t) => rec.begin({ zh: fw ? \`从堆\${p}取\${t}\` : '必败', en: fw ? \`pile\${p} take\${t}\` : 'lose' })
      .setAux([{ label: 'firstWins', value: fw ? 'YES' : 'NO', role: fw ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nimStrategy } from '../../src/algorithms/misc/misc-nim-strategy/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-nim-strategy/trace.ts';
test('相同堆 Nim 和 0 必败', () => {
  assert.equal(nimStrategy([5, 5]).firstWins, false);
});
test('[1,2,3] Nim 和 0', () => {
  assert.equal(nimStrategy([1, 2, 3]).firstWins, false);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 17. misc-modular-exp
{
  id: 'misc-modular-exp',
  titleZh: '快速模幂', titleEn: 'Modular Exponentiation',
  summaryZh: '计算 base^exp mod m，平方乘法 O(log exp)。',
  summaryEn: 'Compute base^exp mod m via square-and-multiply in O(log exp).',
  descZh: '快速模幂：反复平方，遇 exp 二进制位为 1 则乘入结果。用于 RSA 等密码学。',
  descEn: 'Modular exp: repeated squaring, multiply result on each 1-bit of exp. Used in RSA.',
  tags: ['misc','number-theory','modular'],
  time: 'O(log exp)', space: 'O(1)',
  impl: `// 快速模幂 · 实现
export interface MeHooks { onBit?: (bit: number, base: number, result: number) => void; onConclude?: (result: number) => void; }
export function modPow(base: number, exp: number, m: number, hooks: MeHooks = {}): number {
  let r = 1 % m, b = base % m, e = exp;
  while (e > 0) {
    if (e & 1) r = (r * b) % m;
    hooks.onBit?.(e & 1, b, r);
    b = (b * b) % m;
    e = Math.floor(e / 2);
  }
  hooks.onConclude?.(r);
  return r;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modPow } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2^10 mod 1000', en: '2^10 mod 1000' }).commit();
  const r = modPow(2, 10, 1000, {
    onBit: (bit, base, res) => rec.begin({ zh: \`bit=\${bit} base=\${base} res=\${res}\`, en: \`bit=\${bit} base=\${base} res=\${res}\` })
      .setBars([{ value: res, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`result \${r}\` })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modPow } from '../../src/algorithms/misc/misc-modular-exp/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-modular-exp/trace.ts';
test('2^10 mod 1000 = 24', () => { assert.equal(modPow(2, 10, 1000), 24); });
test('大指数正确', () => { assert.equal(modPow(3, 100, 7), 4); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 18. misc-chinese-remain
{
  id: 'misc-chinese-remain',
  titleZh: '中国剩余定理', titleEn: 'Chinese Remainder Theorem',
  summaryZh: '求解同余方程组 x≡a_i mod n_i，要求模两两互素。',
  summaryEn: 'Solve x≡a_i mod n_i for pairwise-coprime moduli via CRT.',
  descZh: 'CRT：x = Σ a_i · N_i · inv(N_i) mod N，N=Πn_i，N_i=N/n_i。模两两互素时有唯一解。',
  descEn: 'CRT: x = Σ a_i·N_i·inv(N_i) mod N, N=Πn_i. Unique solution when moduli are coprime.',
  tags: ['misc','number-theory','modular'],
  time: 'O(k log N)', space: 'O(1)',
  impl: `// 中国剩余定理 · 实现
export interface CrtHooks { onSolve?: (i: number, partial: number) => void; onConclude?: (x: number, N: number) => void; }
function extGcd(a: number, b: number): [number, number, number] { if (b === 0) return [a, 1, 0]; const [g, x, y] = extGcd(b, a % b); return [g, y, x - Math.floor(a / b) * y]; }
export function crt(rems: readonly number[], mods: readonly number[], hooks: CrtHooks = {}): number {
  let x = 0, N = 1;
  for (const m of mods) N *= m;
  for (let i = 0; i < mods.length; i++) {
    const Ni = N / mods[i]!;
    const [, inv] = extGcd(Ni % mods[i]!, mods[i]!);
    x += rems[i]! * Ni * ((inv % mods[i]!) + mods[i]!) % mods[i]!;
    hooks.onSolve?.(i, x);
  }
  x = ((x % N) + N) % N;
  hooks.onConclude?.(x, N);
  return x;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crt } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const rems = [2, 3, 2], mods = [3, 5, 7];
  rec.begin({ zh: 'CRT x≡2 mod 3, x≡3 mod 5, x≡2 mod 7', en: 'CRT' }).commit();
  const x = crt(rems, mods, {
    onConclude: (xx, N) => rec.begin({ zh: \`x=\${xx} (mod \${N})\`, en: \`x=\${xx} (mod \${N})\` })
      .setBars([{ value: xx, role: 'final' as BarRole }]).commit(),
  });
  void x;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crt } from '../../src/algorithms/misc/misc-chinese-remain/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-chinese-remain/trace.ts';
test('经典 CRT 23', () => {
  const x = crt([2, 3, 2], [3, 5, 7]);
  assert.equal(x % 3, 2);
  assert.equal(x % 5, 3);
  assert.equal(x % 7, 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 19. misc-baby-giant
{
  id: 'misc-baby-giant',
  titleZh: '小步大步离散对数', titleEn: 'Baby-Step Giant-Step',
  summaryZh: '求 a^x ≡ b mod p 的最小 x，用 sqrt(p) 空间换时间。',
  summaryEn: 'Find smallest x with a^x ≡ b mod p using sqrt(p) space-time tradeoff.',
  descZh: 'BSGS：baby 集 {a^0..a^(m-1)}，giant 步查 b·a^{-jm} 是否在 baby 集。O(√p)。',
  descEn: 'BSGS: baby set {a^0..a^(m-1)}, giant steps check b·a^{-jm} against baby set. O(sqrt p).',
  tags: ['misc','number-theory','discrete-log'],
  time: 'O(√p)', space: 'O(√p)',
  impl: `// 小步大步 · 实现
export interface BgHooks { onBaby?: (i: number, val: number) => void; onGiant?: (j: number, val: number, found: boolean) => void; onConclude?: (x: number | null) => void; }
function modPow(b: number, e: number, m: number): number { let r = 1; b = b % m; while (e > 0) { if (e & 1) r = (r * b) % m; e = Math.floor(e / 2); b = (b * b) % m; } return r; }
export function babyStepGiantStep(a: number, b: number, p: number, hooks: BgHooks = {}): number | null {
  const m = Math.ceil(Math.sqrt(p));
  const table = new Map<number, number>();
  let cur = 1;
  for (let i = 0; i < m; i++) { if (!table.has(cur)) table.set(cur, i); hooks.onBaby?.(i, cur); cur = (cur * a) % p; }
  const factor = modPow(a, p - 2, p); // a^{-1} (Fermat)
  const giantFactor = modPow(factor, m, p);
  let gamma = b % p;
  for (let j = 0; j < m; j++) {
    if (table.has(gamma)) { const x = j * m + table.get(gamma)!; hooks.onGiant?.(j, gamma, true); hooks.onConclude?.(x); return x; }
    hooks.onGiant?.(j, gamma, false);
    gamma = (gamma * giantFactor) % p;
  }
  hooks.onConclude?.(null);
  return null;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { babyStepGiantStep } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BSGS 2^x≡3 mod 5', en: 'BSGS 2^x≡3 mod 5' }).commit();
  const x = babyStepGiantStep(2, 3, 5, {
    onConclude: (xx) => rec.begin({ zh: xx === null ? '无解' : \`x=\${xx}\`, en: xx === null ? 'none' : \`x=\${xx}\` })
      .setBars([{ value: xx ?? 0, role: 'final' as BarRole }]).commit(),
  });
  void x;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { babyStepGiantStep } from '../../src/algorithms/misc/misc-baby-giant/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-baby-giant/trace.ts';
test('2^x≡3 mod 5 => x=3', () => {
  assert.equal(babyStepGiantStep(2, 3, 5), 3);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 20. misc-miller-rabin
{
  id: 'misc-miller-rabin',
  titleZh: 'Miller-Rabin 素性', titleEn: 'Miller-Rabin Primality',
  summaryZh: '概率素性测试：基于费马小定理与平方链，错误率 ≤ 1/4。',
  summaryEn: 'Probabilistic primality test via Fermat + squaring chain; error <= 1/4 per round.',
  descZh: 'Miller-Rabin：n-1=d·2^r。对随机 a，a^d≡1 或 a^(d·2^i)≡-1 (mod n) 某 i<r。否则合数。',
  descEn: 'Miller-Rabin: n-1=d·2^r. For random a, a^d≡1 or a^(d·2^i)≡-1 for some i<r, else composite.',
  tags: ['misc','number-theory','prime','randomized'],
  time: 'O(k·log n)', space: 'O(1)',
  impl: `// Miller-Rabin · 实现
export interface MrHooks { onWitness?: (a: number, isComposite: boolean) => void; onConclude?: (probablyPrime: boolean) => void; }
function modPow(b: number, e: number, m: number): number { let r = 1; b = b % m; while (e > 0) { if (e & 1) r = (r * b) % m; e = Math.floor(e / 2); b = (b * b) % m; } return r; }
export function millerRabin(n: number, k = 5, hooks: MrHooks = {}): boolean {
  if (n < 2) { hooks.onConclude?.(false); return false; }
  if (n === 2 || n === 3) { hooks.onConclude?.(true); return true; }
  if (n % 2 === 0) { hooks.onConclude?.(false); return false; }
  let d = n - 1, r = 0; while (d % 2 === 0) { d = Math.floor(d / 2); r++; }
  outer: for (let i = 0; i < k; i++) {
    const a = 2 + Math.floor(Math.random() * (n - 3));
    let x = modPow(a, d, n);
    if (x === 1 || x === n - 1) { hooks.onWitness?.(a, false); continue; }
    for (let j = 0; j < r - 1; j++) { x = (x * x) % n; if (x === n - 1) { hooks.onWitness?.(a, false); continue outer; } }
    hooks.onWitness?.(a, true);
    hooks.onConclude?.(false);
    return false;
  }
  hooks.onConclude?.(true);
  return true;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { millerRabin } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 561;
  rec.begin({ zh: \`Miller-Rabin \${n}\`, en: \`Miller-Rabin \${n}\` }).commit();
  const p = millerRabin(n, 10, {
    onConclude: (pp) => rec.begin({ zh: \`\${n} \${pp ? '可能素' : '合数'}\`, en: \`\${n} \${pp ? 'prime?' : 'composite'}\` })
      .setBars([{ value: pp ? 1 : 0, role: pp ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  void p;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { millerRabin } from '../../src/algorithms/misc/misc-miller-rabin/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-miller-rabin/trace.ts';
test('561 是合数 (Carmichael)', () => { assert.equal(millerRabin(561, 20), false); });
test('大素数判定', () => { assert.equal(millerRabin(1000003, 20), true); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 21. misc-pollard-rho
{
  id: 'misc-pollard-rho',
  titleZh: 'Pollard Rho 分解', titleEn: 'Pollard Rho Factorization',
  summaryZh: '用伪随机序列与 Floyd 环检测找合数的非平凡因子，O(√p)。',
  summaryEn: 'Pseudorandom sequence + Floyd cycle detection finds a nontrivial factor in O(√p).',
  descZh: 'Pollard Rho：x_{i+1}=(x_i²+c) mod n，gcd(|x_i-x_j|,n) 非 1 即得因子。',
  descEn: 'Pollard Rho: x_{i+1}=(x_i²+c) mod n; gcd(|x_i-x_j|,n) nontrivial yields a factor.',
  tags: ['misc','number-theory','factorization'],
  time: 'O(n^(1/4))', space: 'O(1)',
  impl: `// Pollard Rho · 实现
export interface PrHooks { onIter?: (i: number, x: number, y: number, gcd: number) => void; onFactor?: (factor: number) => void; }
function gcd(a: number, b: number): number { while (b) { [a, b] = [b, a % b]; } return a; }
export function pollardRho(n: number, hooks: PrHooks = {}): number {
  if (n % 2 === 0) return 2;
  let x = 2, y = 2, c = 1, d = 1;
  const f = (v: number) => (v * v + c) % n;
  for (let i = 0; i < 10000 && d === 1; i++) {
    x = f(x); y = f(f(y));
    d = gcd(Math.abs(x - y), n);
    hooks.onIter?.(i, x, y, d);
  }
  if (d !== n && d > 1) { hooks.onFactor?.(d); return d; }
  return n;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pollardRho } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 8051;
  rec.begin({ zh: \`Pollard Rho \${n}\`, en: \`Pollard Rho \${n}\` }).commit();
  const f = pollardRho(n, {
    onFactor: (ff) => rec.begin({ zh: \`因子 \${ff}\`, en: \`factor \${ff}\` })
      .setBars([{ value: ff, role: 'final' as BarRole }]).commit(),
  });
  void f;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pollardRho } from '../../src/algorithms/misc/misc-pollard-rho/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-pollard-rho/trace.ts';
test('8051 = 83 * 97', () => {
  const f = pollardRho(8051);
  assert.equal(n % f, 0);
});
function n() { return 8051; }
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 22. misc-sieve-atkin
{
  id: 'misc-sieve-atkin',
  titleZh: 'Atkin 筛', titleEn: 'Sieve of Atkin',
  summaryZh: '用二次型翻转标志位筛素数，比 Eratosthenes 更快（理论）。',
  summaryEn: 'Flips flags via quadratic forms to sieve primes; theoretically faster than Eratosthenes.',
  descZh: 'Atkin 筛：对 (x,y) 满足 4x²+y²、3x²+y²、3x²-y² 的 n 翻转标志，最后平方数倍数置假。',
  descEn: 'Atkin sieve: for (x,y) satisfying 4x²+y², 3x²+y², 3x²-y² flip n; then mark multiples of primes square as false.',
  tags: ['misc','number-theory','prime','sieve'],
  time: 'O(n / log log n)', space: 'O(n)',
  impl: `// Atkin 筛 · 实现
export interface SaHooks { onFlip?: (n: number) => void; onPrime?: (p: number) => void; onConclude?: (count: number) => void; }
export function sieveAtkin(limit: number, hooks: SaHooks = {}): number[] {
  const sieve = new Uint8Array(limit + 1);
  if (limit >= 2) sieve[2] = 1;
  if (limit >= 3) sieve[3] = 1;
  for (let x = 1; x * x <= limit; x++) {
    for (let y = 1; y * y <= limit; y++) {
      let n = 4 * x * x + y * y;
      if (n <= limit && n % 12 === 1 || n % 12 === 5) { sieve[n] ^= 1; hooks.onFlip?.(n); }
      n = 3 * x * x + y * y;
      if (n <= limit && n % 12 === 7) { sieve[n] ^= 1; hooks.onFlip?.(n); }
      n = 3 * x * x - y * y;
      if (x > y && n <= limit && n % 12 === 11) { sieve[n] ^= 1; hooks.onFlip?.(n); }
    }
  }
  for (let r = 5; r * r <= limit; r++) {
    if (sieve[r]) for (let i = r * r; i <= limit; i += r * r) sieve[i] = 0;
  }
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) if (sieve[i]) { primes.push(i); hooks.onPrime?.(i); }
  hooks.onConclude?.(primes.length);
  return primes;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sieveAtkin } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const limit = 30;
  rec.begin({ zh: \`Atkin 筛 \${limit}\`, en: \`Atkin sieve \${limit}\` }).commit();
  const ps = sieveAtkin(limit, {
    onConclude: (c) => rec.begin({ zh: \`\${c} 个素数\`, en: \`\${c} primes\` })
      .setBars([{ value: c, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: ps.join(', '), en: ps.join(', ') })
    .setBars(ps.map((p) => ({ value: p, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sieveAtkin } from '../../src/algorithms/misc/misc-sieve-atkin/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-sieve-atkin/trace.ts';
test('Atkin 30 内素数', () => {
  assert.deepEqual(sieveAtkin(30), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 23. misc-euler-totient-range
{
  id: 'misc-euler-totient-range',
  titleZh: '欧拉函数区间', titleEn: 'Euler Totient Range',
  summaryZh: '批量计算 1..n 的 φ(i)，用线性筛 O(n)。',
  summaryEn: 'Compute φ(1..n) in batch via linear sieve in O(n).',
  descZh: '欧拉函数 φ(n)=与 n 互素的个数。线性筛：φ(p)=p-1，φ(ip)=φ(i)·p（p|i 时）或 φ(i)(p-1)。',
  descEn: 'Euler phi: count coprime to n. Linear sieve: phi(p)=p-1, phi(ip)=phi(i)*p (p|i) or phi(i)(p-1).',
  tags: ['misc','number-theory'],
  time: 'O(n)', space: 'O(n)',
  impl: `// 欧拉函数区间 · 实现
export interface EtHooks { onValue?: (i: number, phi: number) => void; onConclude?: (phis: number[]) => void; }
export function eulerTotientRange(n: number, hooks: EtHooks = {}): number[] {
  const phi = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 2; i <= n; i++) {
    if (phi[i] === i) { for (let j = i; j <= n; j += i) phi[j] -= phi[j] / i; }
    hooks.onValue?.(i, phi[i]!);
  }
  hooks.onConclude?.(phi.slice(1));
  return phi.slice(1);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerTotientRange } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 20;
  rec.begin({ zh: \`欧拉函数 1..\${n}\`, en: \`Euler phi 1..\${n}\` }).commit();
  const phis = eulerTotientRange(n, {
    onConclude: (ps) => rec.begin({ zh: ps.join(','), en: ps.join(',') })
      .setBars(ps.map((p) => ({ value: p, role: 'final' as BarRole }))).commit(),
  });
  void phis;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerTotientRange } from '../../src/algorithms/misc/misc-euler-totient-range/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-euler-totient-range/trace.ts';
test('φ(1..10)', () => {
  assert.deepEqual(eulerTotientRange(10), [1, 1, 2, 2, 4, 2, 6, 4, 6, 4]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 24. misc-mobius
{
  id: 'misc-mobius',
  titleZh: 'Möbius 函数', titleEn: 'Mobius Function',
  summaryZh: 'μ(n)：无平方因子且 k 个素因子时 (-1)^k，否则 0，用于莫比乌斯反演。',
  summaryEn: 'mu(n): (-1)^k if square-free with k prime factors, else 0; for Mobius inversion.',
  descZh: 'Möbius：μ(n)=0 若 n 含平方因子；否则 (-1)^k，k 为素因子个数。',
  descEn: 'Mobius: mu=0 if n has a square factor; else (-1)^k where k is number of prime factors.',
  tags: ['misc','number-theory'],
  time: 'O(√n)', space: 'O(1)',
  impl: `// Möbius 函数 · 实现
export interface MbHooks { onFactor?: (p: number) => void; onConclude?: (mu: number) => void; }
export function mobius(n: number, hooks: MbHooks = {}): number {
  if (n === 1) { hooks.onConclude?.(1); return 1; }
  let m = n, cnt = 0;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) { cnt++; hooks.onFactor?.(p); m = Math.floor(m / p); if (m % p === 0) { hooks.onConclude?.(0); return 0; } }
  }
  if (m > 1) { cnt++; hooks.onFactor?.(m); }
  const mu = cnt % 2 === 0 ? 1 : -1;
  hooks.onConclude?.(mu);
  return mu;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mobius } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ns = [1, 2, 6, 10, 12, 30];
  rec.begin({ zh: 'Möbius 函数', en: 'Mobius' }).commit();
  const mus = ns.map((n) => mobius(n));
  rec.begin({ zh: ns.map((n, i) => \`μ(\${n})=\${mus[i]}\`).join(' '), en: ns.map((n, i) => \`mu(\${n})=\${mus[i]}\`).join(' ') })
    .setBars(mus.map((mu) => ({ value: mu, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobius } from '../../src/algorithms/misc/misc-mobius/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-mobius/trace.ts';
test('μ(12)=0 (含平方)', () => { assert.equal(mobius(12), 0); });
test('μ(30)=-1', () => { assert.equal(mobius(30), -1); });
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 25. misc-catalan-2
{
  id: 'misc-catalan-2',
  titleZh: '卡特兰数枚举', titleEn: 'Catalan Enumeration',
  summaryZh: '枚举合法括号/Dyck 路等结构，第 n 个卡特兰数 C_n=binom(2n,n)/(n+1)。',
  summaryEn: 'Count valid-paren / Dyck-path structures; the n-th Catalan C_n=binom(2n,n)/(n+1).',
  descZh: '卡特兰数 C_n=(2n)!/((n+1)!n!)。计数括号匹配、二叉树、多边形三角剖分等。',
  descEn: 'Catalan C_n=(2n)!/((n+1)!n!). Counts paren matchings, binary trees, polygon triangulations.',
  tags: ['misc','combinatorics'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 卡特兰数枚举 · 实现
export interface CtHooks { onValue?: (i: number, c: number) => void; onConclude?: (values: number[]) => void; }
export function catalanSeq(n: number, hooks: CtHooks = {}): number[] {
  const out: number[] = []; let c = 1; out.push(c); hooks.onValue?.(0, c);
  for (let i = 0; i < n; i++) { c = c * 2 * (2 * i + 1) / (i + 2); out.push(c); hooks.onValue?.(i + 1, c); }
  hooks.onConclude?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { catalanSeq } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '卡特兰数 C0..C8', en: 'Catalan C0..C8' }).commit();
  const vs = catalanSeq(8, {
    onConclude: (vals) => rec.begin({ zh: vals.join(','), en: vals.join(',') })
      .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  void vs;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalanSeq } from '../../src/algorithms/misc/misc-catalan-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-catalan-2/trace.ts';
test('C0..C5', () => {
  assert.deepEqual(catalanSeq(5), [1, 1, 2, 5, 14, 42]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 26. misc-stirling-2
{
  id: 'misc-stirling-2',
  titleZh: '第二类 Stirling', titleEn: 'Stirling Numbers Second Kind',
  summaryZh: 'S(n,k)：把 n 个不同元素分到 k 个相同非空盒的方案数。',
  summaryEn: 'S(n,k): ways to partition n distinct items into k identical nonempty boxes.',
  descZh: '第二类 Stirling：S(n,k)=k·S(n-1,k)+S(n-1,k-1)，S(0,0)=1。计数集合划分。',
  descEn: 'Stirling second kind: S(n,k)=k·S(n-1,k)+S(n-1,k-1), S(0,0)=1. Counts set partitions.',
  tags: ['misc','combinatorics'],
  time: 'O(n·k)', space: 'O(n·k)',
  impl: `// 第二类 Stirling 数 · 实现
export interface S2Hooks { onValue?: (n: number, k: number, val: number) => void; onConclude?: (table: number[][]) => void; }
export function stirling2(n: number, k: number, hooks: S2Hooks = {}): number[][] {
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(k + 1).fill(0));
  dp[0]![0] = 1;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= k; j++) { dp[i]![j] = j * dp[i - 1]![j]! + dp[i - 1]![j - 1]!; hooks.onValue?.(i, j, dp[i]![j]!); }
  hooks.onConclude?.(dp);
  return dp;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stirling2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Stirling S(5,k)', en: 'Stirling S(5,k)' }).commit();
  const dp = stirling2(5, 5, {
    onConclude: () => rec.begin({ zh: dp[5]!.join(','), en: dp[5]!.join(',') })
      .setBars(dp[5]!.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  void dp;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stirling2 } from '../../src/algorithms/misc/misc-stirling-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-stirling-2/trace.ts';
test('S(4,2)=7', () => {
  const dp = stirling2(4, 2);
  assert.equal(dp[4]![2], 7);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 27. misc-bell-number
{
  id: 'misc-bell-number',
  titleZh: '贝尔数', titleEn: 'Bell Number',
  summaryZh: 'B_n：n 个元素的集合划分数，等于 Σ S(n,k)。',
  summaryEn: 'B_n: number of partitions of an n-element set; equals sum of S(n,k).',
  descZh: '贝尔数 B_n=Σ_{k=0}^n S(n,k)。用 Bell 三角 O(n²) 计算。',
  descEn: 'Bell B_n=Σ S(n,k). Computed via Bell triangle in O(n²).',
  tags: ['misc','combinatorics'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 贝尔数 · 实现
export interface BnHooks { onRow?: (row: number[]) => void; onConclude?: (bell: number) => void; }
export function bellNumber(n: number, hooks: BnHooks = {}): number {
  const tri: number[][] = [[1]];
  for (let i = 1; i <= n; i++) {
    const row = new Array<number>(i + 1);
    row[0] = tri[i - 1]![tri[i - 1]!.length - 1]!;
    for (let j = 1; j <= i; j++) row[j] = row[j - 1]! + tri[i - 1]![j - 1]!;
    tri.push(row); hooks.onRow?.(row);
  }
  const bell = tri[n]![0]!;
  hooks.onConclude?.(bell);
  return bell;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝尔三角', en: 'Bell triangle' }).commit();
  const b = bellNumber(6, {
    onRow: (row) => rec.begin({ zh: row.join(','), en: row.join(',') })
      .setBars(row.map((v) => ({ value: v, role: 'pivot' as BarRole }))).commit(),
  });
  rec.begin({ zh: \`B_6 = \${b}\`, en: \`B_6 = \${b}\` })
    .setBars([{ value: b, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bellNumber } from '../../src/algorithms/misc/misc-bell-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-bell-number/trace.ts';
test('B0..B5', () => {
  assert.equal(bellNumber(0), 1);
  assert.equal(bellNumber(3), 5);
  assert.equal(bellNumber(5), 52);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 28. misc-partition-p
{
  id: 'misc-partition-p',
  titleZh: '整数划分', titleEn: 'Integer Partition',
  summaryZh: 'p(n)：把 n 写成正整数和的方案数，不分顺序。',
  summaryEn: 'p(n): number of ways to write n as a sum of positive integers, order irrelevant.',
  descZh: '整数划分：p(n) 用 DP p(n,k)=p(n-1,k-1)+p(n-k,k)，或欧拉五边形定理。',
  descEn: 'Integer partition: p(n) via DP p(n,k)=p(n-1,k-1)+p(n-k,k), or Euler pentagonal theorem.',
  tags: ['misc','combinatorics','dp'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 整数划分 · 实现
export interface Pp2Hooks { onValue?: (i: number, p: number) => void; onConclude?: (values: number[]) => void; }
export function partitionP(n: number, hooks: Pp2Hooks = {}): number[] {
  const dp = new Array<number>(n + 1).fill(0); dp[0] = 1;
  for (let k = 1; k <= n; k++) for (let i = k; i <= n; i++) dp[i] += dp[i - k]!;
  for (let i = 0; i <= n; i++) hooks.onValue?.(i, dp[i]!);
  hooks.onConclude?.(dp);
  return dp;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partitionP } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '整数划分 p(0..10)', en: 'Partition p(0..10)' }).commit();
  const dp = partitionP(10, {
    onConclude: (vals) => rec.begin({ zh: vals.join(','), en: vals.join(',') })
      .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  void dp;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partitionP } from '../../src/algorithms/misc/misc-partition-p/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-partition-p/trace.ts';
test('p(0..5)', () => {
  assert.deepEqual(partitionP(5), [1, 1, 2, 3, 5, 7]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 29. misc-fib-golden
{
  id: 'misc-fib-golden',
  titleZh: '黄金比斐波那契', titleEn: 'Golden Ratio Fibonacci',
  summaryZh: '用 Binet 公式 F_n=(φⁿ-ψⁿ)/√5 直接计算，但浮点精度有限。',
  summaryEn: 'Binet formula F_n=(phi^n-psi^n)/sqrt5 directly; limited by floating precision.',
  descZh: 'Binet：F_n = (φⁿ - (1-φ)ⁿ)/√5，φ=(1+√5)/2。O(log n) 快速幂，但大 n 有精度损失。',
  descEn: 'Binet: F_n=(phi^n-(1-phi)^n)/sqrt5, phi=(1+sqrt5)/2. O(log n) via fast pow, precision loss for large n.',
  tags: ['misc','sequence','number-theory'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 黄金比斐波那契 (Binet) · 实现
export interface FgHooks { onValue?: (i: number, f: number) => void; onConclude?: (values: number[]) => void; }
const PHI = (1 + Math.sqrt(5)) / 2;
const PSI = (1 - Math.sqrt(5)) / 2;
export function fibGolden(n: number, hooks: FgHooks = {}): number[] {
  const out: number[] = [];
  for (let i = 0; i <= n; i++) { const f = Math.round((Math.pow(PHI, i) - Math.pow(PSI, i)) / Math.sqrt(5)); out.push(f); hooks.onValue?.(i, f); }
  hooks.onConclude?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibGolden } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Binet 斐波那契', en: 'Binet Fibonacci' }).commit();
  const vs = fibGolden(12, {
    onConclude: (vals) => rec.begin({ zh: vals.join(','), en: vals.join(',') })
      .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  void vs;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibGolden } from '../../src/algorithms/misc/misc-fib-golden/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-fib-golden/trace.ts';
test('F0..F10', () => {
  assert.deepEqual(fibGolden(10), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 30. misc-derangement
{
  id: 'misc-derangement',
  titleZh: '错排数', titleEn: 'Derangement Number',
  summaryZh: '!n：n 个元素的排列中无一元素在原位的方案数，递推 !n=(n-1)(!(n-1)+!(n-2))。',
  summaryEn: '!n: permutations with no element in its original position; !(n)=(n-1)(!(n-1)+!(n-2)).',
  descZh: '错排：D(n)=(n-1)(D(n-1)+D(n-2))，D(0)=1,D(1)=0。信封问题。',
  descEn: 'Derangement: D(n)=(n-1)(D(n-1)+D(n-2)), D(0)=1,D(1)=0. Hat-check problem.',
  tags: ['misc','combinatorics'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 错排数 · 实现
export interface DrHooks { onValue?: (i: number, d: number) => void; onConclude?: (values: number[]) => void; }
export function derangement(n: number, hooks: DrHooks = {}): number[] {
  if (n < 0) return [];
  const out = [1, 0];
  for (let i = 2; i <= n; i++) { out.push((i - 1) * (out[i - 1]! + out[i - 2]!)); hooks.onValue?.(i, out[i]!); }
  hooks.onValue?.(0, out[0]!); if (n >= 1) hooks.onValue?.(1, out[1]!);
  hooks.onConclude?.(out.slice(0, n + 1));
  return out.slice(0, n + 1);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { derangement } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '错排 !0..!8', en: 'Derangement !0..!8' }).commit();
  const vs = derangement(8, {
    onConclude: (vals) => rec.begin({ zh: vals.join(','), en: vals.join(',') })
      .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  void vs;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { derangement } from '../../src/algorithms/misc/misc-derangement/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-derangement/trace.ts';
test('!0..!4', () => {
  assert.deepEqual(derangement(4), [1, 0, 1, 2, 9]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
];
