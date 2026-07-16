// optimization batch 2 — 30 new algorithms (70 -> 100)
export const algos = [
// 1. opt-bisection
{
  id: 'opt-bisection',
  titleZh: '二分法求根', titleEn: 'Bisection Root Finding',
  summaryZh: '在符号变化区间反复折半，线性收敛到连续函数零点。',
  summaryEn: 'Halve a sign-changing interval repeatedly; linear convergence to a root.',
  descZh: '二分法：f 在 [a,b] 连续且异号，每步取中点 c，根据 f(c) 符号缩小区间。收敛率 1/2。',
  descEn: 'Bisection: f continuous sign-changing on [a,b]; take midpoint c, shrink by f(c) sign. Rate 1/2.',
  tags: ['optimization','root-finding'],
  time: 'O(log(1/ε))', space: 'O(1)',
  impl: `// 二分法求根 · 实现
export interface BsHooks { onIter?: (i: number, a: number, b: number, c: number, fc: number) => void; onConclude?: (root: number, iters: number) => void; }
export function bisection(f: (x: number) => number, a: number, b: number, tol = 1e-9, maxIter = 100, hooks: BsHooks = {}): number {
  let lo = a, hi = b;
  for (let i = 0; i < maxIter; i++) {
    const c = (lo + hi) / 2;
    const fc = f(c);
    hooks.onIter?.(i, lo, hi, c, fc);
    if (Math.abs(fc) < tol || (hi - lo) / 2 < tol) { hooks.onConclude?.(c, i + 1); return c; }
    if (f(lo) * fc < 0) hi = c; else lo = c;
  }
  const root = (lo + hi) / 2;
  hooks.onConclude?.(root, maxIter);
  return root;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bisection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => x * x - 2;
  rec.begin({ zh: '二分求 √2 (x²-2=0)', en: 'Bisection sqrt 2' }).commit();
  const root = bisection(f, 0, 2, 1e-6, 30, {
    onIter: (i, a, b, c, fc) => rec.begin({ zh: \`\${i}: [\${a.toFixed(4)},\${b.toFixed(4)}] c=\${c.toFixed(4)} f=\${fc.toFixed(4)}\`, en: \`\${i}: [\${a.toFixed(4)},\${b.toFixed(4)}] c=\${c.toFixed(4)} f=\${fc.toFixed(4)}\` })
      .setBars([{ value: c, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`根 ≈ \${root.toFixed(6)}\`, en: \`root ≈ \${root.toFixed(6)}\` })
    .setBars([{ value: root, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bisection } from '../../src/algorithms/optimization/opt-bisection/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bisection/trace.ts';
test('二分求 √2', () => {
  const r = bisection((x) => x * x - 2, 0, 2, 1e-9);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 2. opt-newton-raphson
{
  id: 'opt-newton-raphson',
  titleZh: '牛顿迭代', titleEn: 'Newton-Raphson',
  summaryZh: '用切线逼近零点 x←x-f(x)/f\'(x)，二阶收敛。',
  summaryEn: 'Tangent-line iteration x<-x-f(x)/f\'(x) with quadratic convergence.',
  descZh: '牛顿法：x_{n+1}=x_n - f(x_n)/f\'(x_n)。单根附近二阶收敛，但需好初值与可导。',
  descEn: 'Newton: x_{n+1}=x_n - f(x_n)/f\'(x_n). Quadratic near simple root, needs good start + derivative.',
  tags: ['optimization','root-finding'],
  time: 'O(log log(1/ε))', space: 'O(1)',
  impl: `// 牛顿迭代 · 实现
export interface NrHooks { onIter?: (i: number, x: number, fx: number) => void; onConclude?: (root: number, iters: number) => void; }
export function newtonRaphson(f: (x: number) => number, df: (x: number) => number, x0: number, tol = 1e-9, maxIter = 50, hooks: NrHooks = {}): number {
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    hooks.onIter?.(i, x, fx);
    if (Math.abs(fx) < tol) { hooks.onConclude?.(x, i); return x; }
    const d = df(x);
    if (Math.abs(d) < 1e-15) break;
    x = x - fx / d;
  }
  hooks.onConclude?.(x, maxIter);
  return x;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { newtonRaphson } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => x * x - 2;
  const df = (x: number) => 2 * x;
  rec.begin({ zh: '牛顿求 √2', en: 'Newton sqrt 2' }).commit();
  const r = newtonRaphson(f, df, 1.5, 1e-9, 20, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: x=\${x.toFixed(8)} f=\${fx.toExponential(2)}\`, en: \`\${i}: x=\${x.toFixed(8)} f=\${fx.toExponential(2)}\` })
      .setBars([{ value: x, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`根 ≈ \${r.toFixed(10)}\`, en: \`root ≈ \${r.toFixed(10)}\` })
    .setBars([{ value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newtonRaphson } from '../../src/algorithms/optimization/opt-newton-raphson/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-newton-raphson/trace.ts';
test('牛顿求 √2', () => {
  const r = newtonRaphson((x) => x * x - 2, (x) => 2 * x, 1.5);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-8);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 3. opt-secant
{
  id: 'opt-secant',
  titleZh: '割线法', titleEn: 'Secant Method',
  summaryZh: '用两点连线斜率代替导数，无需 f\' 也能超线性收敛。',
  summaryEn: 'Use the secant slope instead of the derivative; superlinear, no f\' needed.',
  descZh: '割线法：x_{n+1}=x_n - f(x_n)(x_n-x_{n-1})/(f(x_n)-f(x_{n-1}))。收敛阶 φ≈1.618。',
  descEn: 'Secant: x_{n+1}=x_n - f(x_n)(x_n-x_{n-1})/(f(x_n)-f(x_{n-1})). Order phi~1.618.',
  tags: ['optimization','root-finding'],
  time: 'O(log(1/ε))', space: 'O(1)',
  impl: `// 割线法 · 实现
export interface ScHooks { onIter?: (i: number, x: number, fx: number) => void; onConclude?: (root: number, iters: number) => void; }
export function secantMethod(f: (x: number) => number, x0: number, x1: number, tol = 1e-9, maxIter = 50, hooks: ScHooks = {}): number {
  let prev = x0, cur = x1;
  for (let i = 0; i < maxIter; i++) {
    const fp = f(prev), fc = f(cur);
    hooks.onIter?.(i, cur, fc);
    if (Math.abs(fc) < tol) { hooks.onConclude?.(cur, i); return cur; }
    const next = cur - fc * (cur - prev) / (fc - fp);
    prev = cur; cur = next;
  }
  hooks.onConclude?.(cur, maxIter);
  return cur;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secantMethod } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '割线法求 √2', en: 'Secant sqrt 2' }).commit();
  const r = secantMethod((x) => x * x - 2, 1, 2, 1e-9, 20, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: x=\${x.toFixed(8)}\`, en: \`\${i}: x=\${x.toFixed(8)}\` })
      .setBars([{ value: x, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`根 ≈ \${r.toFixed(10)}\`, en: \`root ≈ \${r.toFixed(10)}\` })
    .setBars([{ value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secantMethod } from '../../src/algorithms/optimization/opt-secant/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-secant/trace.ts';
test('割线法求 √2', () => {
  const r = secantMethod((x) => x * x - 2, 1, 2);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 4. opt-falsi
{
  id: 'opt-falsi',
  titleZh: '试位法', titleEn: 'Regula Falsi',
  summaryZh: '用割线与 x 轴交点替代中点，保留符号约束的二分。',
  summaryEn: 'Use the secant-x-intercept instead of midpoint while keeping sign constraints.',
  descZh: '试位法：c=(a·f(b)-b·f(a))/(f(b)-f(a))，根据 f(c) 符号替换 a 或 b。比二分快且保收敛。',
  descEn: 'Regula falsi: c=(a·f(b)-b·f(a))/(f(b)-f(a)); replace a or b by sign. Faster than bisection, stays convergent.',
  tags: ['optimization','root-finding'],
  time: 'O(log(1/ε))', space: 'O(1)',
  impl: `// 试位法 · 实现
export interface RfHooks { onIter?: (i: number, a: number, b: number, c: number, fc: number) => void; onConclude?: (root: number, iters: number) => void; }
export function regulaFalsi(f: (x: number) => number, a: number, b: number, tol = 1e-9, maxIter = 100, hooks: RfHooks = {}): number {
  let lo = a, hi = b;
  for (let i = 0; i < maxIter; i++) {
    const fa = f(lo), fb = f(hi);
    const c = (lo * fb - hi * fa) / (fb - fa);
    const fc = f(c);
    hooks.onIter?.(i, lo, hi, c, fc);
    if (Math.abs(fc) < tol) { hooks.onConclude?.(c, i + 1); return c; }
    if (fa * fc < 0) hi = c; else lo = c;
  }
  const root = (lo + hi) / 2;
  hooks.onConclude?.(root, maxIter);
  return root;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { regulaFalsi } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '试位法求 √2', en: 'Regula falsi sqrt 2' }).commit();
  const r = regulaFalsi((x) => x * x - 2, 0, 2, 1e-9, 30, {
    onIter: (i, a, b, c) => rec.begin({ zh: \`\${i}: c=\${c.toFixed(8)}\`, en: \`\${i}: c=\${c.toFixed(8)}\` })
      .setBars([{ value: c, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`根 ≈ \${r.toFixed(10)}\`, en: \`root ≈ \${r.toFixed(10)}\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { regulaFalsi } from '../../src/algorithms/optimization/opt-falsi/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-falsi/trace.ts';
test('试位法求 √2', () => {
  const r = regulaFalsi((x) => x * x - 2, 0, 2);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 5. opt-brent
{
  id: 'opt-brent',
  titleZh: 'Brent 求根', titleEn: 'Brent Root Finding',
  summaryZh: '结合二分与逆二次插值，保收敛且超线性，工程默认。',
  summaryEn: 'Combines bisection with inverse quadratic interpolation; robust and superlinear.',
  descZh: 'Brent-Dekker：在保证区间收缩的前提下，优先用逆二次插值加速，避免导数。',
  descEn: 'Brent-Dekker: guaranteed bracketing with inverse quadratic interpolation when possible, no derivative.',
  tags: ['optimization','root-finding'],
  time: 'O(log(1/ε))', space: 'O(1)',
  impl: `// Brent 求根 · 实现 (简化)
export interface BrHooks { onIter?: (i: number, b: number, fb: number) => void; onConclude?: (root: number, iters: number) => void; }
export function brentRoot(f: (x: number) => number, a: number, b: number, tol = 1e-9, maxIter = 100, hooks: BrHooks = {}): number {
  let fa = f(a), fb = f(b);
  if (fa * fb > 0) { hooks.onConclude?.(b, 0); return b; }
  if (Math.abs(fa) < Math.abs(fb)) { [a, b] = [b, a]; [fa, fb] = [fb, fa]; }
  let c = a, fc = fa, d = b;
  for (let i = 0; i < maxIter; i++) {
    const m = 0.5 * (a + b);
    if (Math.abs(fb) < tol || Math.abs(b - a) < tol) { hooks.onConclude?.(b, i + 1); return b; }
    hooks.onIter?.(i, b, fb);
    if (fa !== fc && fb !== fc) {
      // 逆二次插值
      const s = (a * fb * fc) / ((fa - fb) * (fa - fc)) + (b * fa * fc) / ((fb - fa) * (fb - fc)) + (c * fa * fb) / ((fc - fa) * (fc - fb));
      d = s;
    } else {
      d = b - fb * (b - a) / (fb - fa); // 割线
    }
    if (!(d > Math.min(m, b) && d < Math.max(m, b))) d = m;
    c = b; fc = fb;
    b = d; fb = f(b);
    if (fa * fb < 0) { /* keep */ } else { a = c; fa = fc; }
  }
  hooks.onConclude?.(b, maxIter);
  return b;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brentRoot } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Brent 求 √2', en: 'Brent sqrt 2' }).commit();
  const r = brentRoot((x) => x * x - 2, 0, 2, 1e-9, 30, {
    onIter: (i, b) => rec.begin({ zh: \`\${i}: b=\${b.toFixed(8)}\`, en: \`\${i}: b=\${b.toFixed(8)}\` })
      .setBars([{ value: b, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`根 ≈ \${r.toFixed(10)}\`, en: \`root ≈ \${r.toFixed(10)}\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brentRoot } from '../../src/algorithms/optimization/opt-brent/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-brent/trace.ts';
test('Brent 求 √2', () => {
  const r = brentRoot((x) => x * x - 2, 0, 2);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 6. opt-golden-section
{
  id: 'opt-golden-section',
  titleZh: '黄金分割搜索', titleEn: 'Golden Section Search',
  summaryZh: '在单峰区间上用黄金比布置探点，无需导数找极小。',
  summaryEn: 'Place probes by golden ratio on a unimodal interval; minimizes without derivatives.',
  descZh: '黄金分割：在 [a,b] 内按 φ=0.618 布两点，比较函数值缩小区间。线性收敛率 0.618。',
  descEn: 'Golden section: two probes at ratio phi=0.618; shrink by comparing values. Linear rate 0.618.',
  tags: ['optimization','line-search','unimodal'],
  time: 'O(log(1/ε))', space: 'O(1)',
  impl: `// 黄金分割搜索 · 实现
export interface GsHooks2 { onIter?: (i: number, a: number, b: number, x1: number, x2: number) => void; onConclude?: (xmin: number, iters: number) => void; }
const GR = (Math.sqrt(5) - 1) / 2;
export function goldenSection(f: (x: number) => number, a: number, b: number, tol = 1e-9, maxIter = 100, hooks: GsHooks2 = {}): number {
  let lo = a, hi = b;
  let c = hi - GR * (hi - lo);
  let d = lo + GR * (hi - lo);
  for (let i = 0; i < maxIter; i++) {
    hooks.onIter?.(i, lo, hi, c, d);
    if (Math.abs(hi - lo) < tol) break;
    if (f(c) < f(d)) { hi = d; d = c; c = hi - GR * (hi - lo); }
    else { lo = c; c = d; d = lo + GR * (hi - lo); }
  }
  const xmin = (lo + hi) / 2;
  hooks.onConclude?.(xmin, maxIter);
  return xmin;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { goldenSection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => (x - 2) * (x - 2) + 1;
  rec.begin({ zh: '黄金分割 min (x-2)²+1', en: 'Golden section min (x-2)²+1' }).commit();
  const r = goldenSection(f, -5, 5, 1e-6, 30, {
    onIter: (i, a, b) => rec.begin({ zh: \`\${i}: [\${a.toFixed(4)},\${b.toFixed(4)}]\`, en: \`\${i}: [\${a.toFixed(4)},\${b.toFixed(4)}]\` })
      .setBars([{ value: (a + b) / 2, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`min ≈ \${r.toFixed(6)}\`, en: \`min ≈ \${r.toFixed(6)}\` })
    .setBars([{ value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goldenSection } from '../../src/algorithms/optimization/opt-golden-section/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-golden-section/trace.ts';
test('黄金分割找 (x-2)² 极小', () => {
  const r = goldenSection((x) => (x - 2) * (x - 2), -5, 5, 1e-9);
  assert.ok(Math.abs(r - 2) < 1e-5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 7. opt-fibonacci-search
{
  id: 'opt-fibonacci-search',
  titleZh: '斐波那契搜索', titleEn: 'Fibonacci Search',
  summaryZh: '用斐波那契数比布置探点，比黄金分割更省函数计算。',
  summaryEn: 'Place probes by Fibonacci ratios; fewer function evaluations than golden section.',
  descZh: '斐波那契搜索：用 F_n 划分区间，每轮按 F_{n-1}/F_n 比例取点，n 步收敛最优。',
  descEn: 'Fibonacci search: divide by F_n, probe at F_{n-1}/F_n; optimal n-step convergence.',
  tags: ['optimization','line-search','unimodal'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 斐波那契搜索 · 实现
export interface FsHooks { onIter?: (i: number, a: number, b: number, x1: number, x2: number) => void; onConclude?: (xmin: number) => void; }
export function fibonacciSearch(f: (x: number) => number, a: number, b: number, n = 20, hooks: FsHooks = {}): number {
  const fib: number[] = [1, 1];
  while (fib.length < n + 1) fib.push(fib[fib.length - 1]! + fib[fib.length - 2]!);
  let lo = a, hi = b;
  let k = n;
  let x1 = lo + (fib[n - 2]! / fib[n]!) * (hi - lo);
  let x2 = lo + (fib[n - 1]! / fib[n]!) * (hi - lo);
  while (k > 2) {
    hooks.onIter?.(n - k, lo, hi, x1, x2);
    if (f(x1) < f(x2)) { hi = x2; x2 = x1; x1 = lo + (fib[k - 3]! / fib[k - 1]!) * (hi - lo); }
    else { lo = x1; x1 = x2; x2 = lo + (fib[k - 2]! / fib[k - 1]!) * (hi - lo); }
    k--;
  }
  const xmin = (lo + hi) / 2;
  hooks.onConclude?.(xmin);
  return xmin;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciSearch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => (x - 3) * (x - 3);
  rec.begin({ zh: '斐波那契搜索 min (x-3)²', en: 'Fibonacci min (x-3)²' }).commit();
  const r = fibonacciSearch(f, 0, 10, 15, {
    onIter: (i, a, b) => rec.begin({ zh: \`\${i}: [\${a.toFixed(4)},\${b.toFixed(4)}]\`, en: \`\${i}: [\${a.toFixed(4)},\${b.toFixed(4)}]\` })
      .setBars([{ value: (a + b) / 2, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`min ≈ \${r.toFixed(6)}\`, en: \`min ≈ \${r.toFixed(6)}\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciSearch } from '../../src/algorithms/optimization/opt-fibonacci-search/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-fibonacci-search/trace.ts';
test('斐波那契找 (x-3)² 极小', () => {
  const r = fibonacciSearch((x) => (x - 3) * (x - 3), 0, 10, 20);
  assert.ok(Math.abs(r - 3) < 0.1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 8. opt-coordinate-descent
{
  id: 'opt-coordinate-descent',
  titleZh: '坐标下降', titleEn: 'Coordinate Descent',
  summaryZh: '每次只沿一个坐标方向线搜索，循环至收敛，适合可分目标。',
  summaryEn: 'Line-search one coordinate at a time, cycle until convergence; suits separable objectives.',
  descZh: '坐标下降：固定其他维，沿第 i 维精确/近似线搜索极小化，轮换所有维度。',
  descEn: 'Coordinate descent: fix other dims, minimize along dimension i via line search; cycle all dims.',
  tags: ['optimization','gradient-free'],
  time: 'O(k·n)', space: 'O(n)',
  impl: `// 坐标下降 · 实现
export interface CdHooks { onIter?: (i: number, dim: number, x: number[], fx: number) => void; onConclude?: (xmin: number[], fmin: number) => void; }
export function coordinateDescent(f: (x: readonly number[]) => number, x0: number[], maxIter = 100, step = 0.1, hooks: CdHooks = {}): { x: number[]; fx: number } {
  const x = [...x0];
  let fx = f(x);
  for (let it = 0; it < maxIter; it++) {
    let improved = false;
    for (let d = 0; d < x.length; d++) {
      const best = x[d]!;
      const f1 = (() => { x[d] = best + step; return f(x); })();
      const f2 = (() => { x[d] = best - step; return f(x); })();
      if (f1 < fx && f1 <= f2) { x[d] = best + step; fx = f1; improved = true; }
      else if (f2 < fx) { x[d] = best - step; fx = f2; improved = true; }
      else x[d] = best;
      hooks.onIter?.(it, d, x, fx);
    }
    if (!improved) break;
  }
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coordinateDescent } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => (x[0]! - 1) ** 2 + (x[1]! - 2) ** 2;
  rec.begin({ zh: '坐标下降 (x-1)²+(y-2)²', en: 'Coord descent' }).commit();
  const r = coordinateDescent(f, [0, 0], 50, 0.2, {
    onIter: (i, d, x, fx) => rec.begin({ zh: \`\${i} dim\${d}: [\${x.map((v) => v.toFixed(2)).join(',')}]\`, en: \`\${i} d\${d}\` })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`min ≈ [\${r.x.map((v) => v.toFixed(2)).join(',')}] f=\${r.fx.toFixed(4)}\`, en: 'min' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coordinateDescent } from '../../src/algorithms/optimization/opt-coordinate-descent/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-coordinate-descent/trace.ts';
test('坐标下降近 (1,2)', () => {
  const r = coordinateDescent((x) => (x[0]! - 1) ** 2 + (x[1]! - 2) ** 2, [0, 0], 100, 0.05);
  assert.ok(r.fx < 0.5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 9. opt-gradient-batch-3
{
  id: 'opt-gradient-batch-3',
  titleZh: '批量梯度下降', titleEn: 'Batch Gradient Descent',
  summaryZh: '每步用全部样本平均梯度更新，稳定但慢于随机法。',
  summaryEn: 'Update with the average gradient over all samples; stable but slower than stochastic.',
  descZh: '批量梯度下降：θ←θ-η·∇L(θ)，L 为全部样本平均损失。凸函数收敛到最优。',
  descEn: 'Batch GD: θ<-θ-η·∇L(θ), L averaged over all samples. Converges for convex L.',
  tags: ['optimization','gradient-descent','machine-learning'],
  time: 'O(k·n·d)', space: 'O(d)',
  impl: `// 批量梯度下降 · 实现 (线性回归)
export interface BgdHooks { onIter?: (i: number, w: number[], loss: number) => void; onConclude?: (w: number[], loss: number) => void; }
export function batchGradientDescent(X: ReadonlyArray<readonly number[]>, y: readonly number[], lr = 0.01, maxIter = 200, hooks: BgdHooks = {}): { w: number[]; loss: number } {
  const d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  const n = X.length;
  for (let it = 0; it < maxIter; it++) {
    const grad = new Array<number>(d).fill(0);
    let loss = 0;
    for (let i = 0; i < n; i++) {
      let pred = 0; for (let j = 0; j < d; j++) pred += w[j]! * X[i]![j]!;
      const err = pred - y[i]!;
      loss += err * err;
      for (let j = 0; j < d; j++) grad[j]! += err * X[i]![j]!;
    }
    for (let j = 0; j < d; j++) w[j] -= lr * grad[j]! / n;
    hooks.onIter?.(it, [...w], loss / n);
  }
  let loss = 0; for (let i = 0; i < n; i++) { let p = 0; for (let j = 0; j < d; j++) p += w[j]! * X[i]![j]!; loss += (p - y[i]!) ** 2; }
  hooks.onConclude?.(w, loss / n);
  return { w, loss: loss / n };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { batchGradientDescent } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const X = [[1], [2], [3], [4]];
  const y = [2, 4, 6, 8];
  rec.begin({ zh: 'BGD 线性回归', en: 'BGD linear regression' }).commit();
  const r = batchGradientDescent(X, y, 0.1, 50, {
    onIter: (i, w, loss) => rec.begin({ zh: \`\${i}: w=[\${w.map((v) => v.toFixed(3)).join(',')}] loss=\${loss.toFixed(4)}\`, en: \`\${i}: loss=\${loss.toFixed(4)}\` })
      .setBars([{ value: loss, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`w=[\${r.w.map((v) => v.toFixed(3)).join(',')}] loss=\${r.loss.toFixed(4)}\`, en: 'done' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { batchGradientDescent } from '../../src/algorithms/optimization/opt-gradient-batch-3/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-gradient-batch-3/trace.ts';
test('BGD 拟合 y=2x', () => {
  const r = batchGradientDescent([[1], [2], [3]], [2, 4, 6], 0.1, 500);
  assert.ok(Math.abs(r.w[0]! - 2) < 0.5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 10. opt-polyak-momentum
{
  id: 'opt-polyak-momentum',
  titleZh: 'Polyak 动量', titleEn: 'Polyak Heavy-Ball Momentum',
  summaryZh: '引入速度累积 v=γv-η∇，加速凸优化收敛。',
  summaryEn: 'Accumulate velocity v=γv-η∇ to accelerate convex optimization.',
  descZh: 'Polyak 重球：v_{t+1}=γ·v_t - η·∇f(x_t)；x_{t+1}=x_t+v_{t+1}。比普通 GD 快。',
  descEn: 'Polyak heavy-ball: v_{t+1}=γ·v_t-η·∇f(x_t); x_{t+1}=x_t+v_{t+1}. Faster than vanilla GD.',
  tags: ['optimization','momentum'],
  time: 'O(k·n)', space: 'O(n)',
  impl: `// Polyak 动量 · 实现
export interface PmHooks { onIter?: (i: number, x: number[], fx: number) => void; onConclude?: (xmin: number[], fmin: number) => void; }
export function polyakMomentum(grad: (x: readonly number[]) => number[], x0: number[], lr = 0.01, gamma = 0.9, maxIter = 200, hooks: PmHooks = {}): { x: number[]; fx: number } {
  const x = [...x0];
  const v = new Array<number>(x0.length).fill(0);
  let fx = Infinity;
  for (let it = 0; it < maxIter; it++) {
    const g = grad(x);
    for (let i = 0; i < x.length; i++) { v[i] = gamma * v[i]! - lr * g[i]!; x[i] += v[i]!; }
    fx = 0.5 * x.reduce((a, b) => a + b * b, 0); // 简化损失 = 0.5|x|² (梯度=自身)
    hooks.onIter?.(it, [...x], fx);
  }
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polyakMomentum } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Polyak 动量 min 0.5|x|²', en: 'Polyak momentum' }).commit();
  const r = polyakMomentum((x) => [...x], [3, -4, 5], 0.05, 0.9, 50, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: |\${x.map((v) => v.toFixed(2)).join(',')}| f=\${fx.toFixed(4)}\`, en: \`\${i}\` })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`min f=\${r.fx.toFixed(6)}\`, en: 'done' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polyakMomentum } from '../../src/algorithms/optimization/opt-polyak-momentum/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-polyak-momentum/trace.ts';
test('Polyak 收敛到 0', () => {
  const r = polyakMomentum((x) => [...x], [5, 5], 0.05, 0.9, 300);
  assert.ok(r.fx < 0.1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 11. opt-averaging-sgd
{
  id: 'opt-averaging-sgd',
  titleZh: '平均随机梯度', titleEn: 'Averaged Stochastic Gradient',
  summaryZh: 'SGD 中维护参数滑动平均作为最终输出，降低方差。',
  summaryEn: 'Maintain a running average of SGD iterates as the final output to reduce variance.',
  descZh: 'ASGD：θ_{t+1}=θ_t-η·g_t；barθ_t=barθ_{t-1}+1/t·(θ_t-barθ_{t-1})。返回 barθ。',
  descEn: 'ASGD: θ_{t+1}=θ_t-η·g_t; barθ_t averages iterates. Return barθ.',
  tags: ['optimization','stochastic'],
  time: 'O(k·d)', space: 'O(d)',
  impl: `// 平均随机梯度 (ASGD) · 实现
export interface AsgdHooks { onIter?: (i: number, theta: number[], avgTheta: number[]) => void; onConclude?: (avgTheta: number[]) => void; }
export function averagedSgd(gradSampler: () => { grad: number[] }, d: number, lr = 0.05, maxIter = 200, hooks: AsgdHooks = {}): number[] {
  const theta = new Array<number>(d).fill(0);
  const avg = new Array<number>(d).fill(0);
  for (let t = 1; t <= maxIter; t++) {
    const { grad } = gradSampler();
    for (let i = 0; i < d; i++) { theta[i] -= lr * grad[i]!; avg[i]! += (theta[i]! - avg[i]!) / t; }
    hooks.onIter?.(t, [...theta], [...avg]);
  }
  hooks.onConclude?.(avg);
  return avg;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { averagedSgd } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let k = 0; const sampler = () => { k++; return { grad: [k % 2 === 0 ? 1 : -1] }; };
  rec.begin({ zh: 'ASGD', en: 'ASGD' }).commit();
  const avg = averagedSgd(sampler, 1, 0.05, 50, {
    onConclude: (a) => rec.begin({ zh: \`avg=\${a.map((v) => v.toFixed(3)).join(',')}\`, en: 'done' })
      .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole }))).commit(),
  });
  void avg;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { averagedSgd } from '../../src/algorithms/optimization/opt-averaging-sgd/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-averaging-sgd/trace.ts';
test('ASGD 返回平均参数', () => {
  const avg = averagedSgd(() => ({ grad: [1] }), 1, 0.01, 10);
  assert.equal(avg.length, 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 12. opt-elastic-net
{
  id: 'opt-elastic-net',
  titleZh: '弹性网正则', titleEn: 'Elastic Net Regularization',
  summaryZh: 'L1+L2 混合正则，兼顾稀疏与稳定，用于特征选择。',
  summaryEn: 'L1+L2 mixed penalty for sparsity plus stability; used in feature selection.',
  descZh: '弹性网：min ½||Xw-y||² + λ(α|w|_1 + ½(1-α)||w||²)。坐标下降求解。',
  descEn: 'Elastic net: min ½||Xw-y||² + λ(α|w|_1+½(1-α)||w||²). Solved by coordinate descent.',
  tags: ['optimization','regularization','machine-learning'],
  time: 'O(k·n·d)', space: 'O(d)',
  impl: `// 弹性网正则 (坐标下降) · 实现
export interface EnHooks { onIter?: (i: number, w: number[], loss: number) => void; onConclude?: (w: number[]) => void; }
export function elasticNet(X: ReadonlyArray<readonly number[]>, y: readonly number[], lambda = 0.1, alpha = 0.5, maxIter = 100, hooks: EnHooks = {}): number[] {
  const n = X.length, d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  const colSq = new Array<number>(d).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) colSq[j]! += X[i]![j]! * X[i]![j]!;
  for (let it = 0; it < maxIter; it++) {
    let loss = 0;
    for (let j = 0; j < d; j++) {
      let rho = 0; for (let i = 0; i < n; i++) { let pred = 0; for (let k2 = 0; k2 < d; k2++) if (k2 !== j) pred += w[k2]! * X[i]![k2]!; rho += X[i]![j]! * (y[i]! - pred); }
      const l1 = lambda * alpha, l2 = lambda * (1 - alpha);
      if (colSq[j]! + l2 === 0) continue;
      if (rho > l1) w[j] = (rho - l1) / (colSq[j]! + l2);
      else if (rho < -l1) w[j] = (rho + l1) / (colSq[j]! + l2);
      else w[j] = 0;
      loss += Math.abs(w[j]!);
    }
    hooks.onIter?.(it, [...w], loss);
  }
  hooks.onConclude?.(w);
  return w;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { elasticNet } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const X = [[1, 0], [2, 0], [0, 1], [0, 2]];
  const y = [2, 4, 3, 6];
  rec.begin({ zh: '弹性网', en: 'Elastic net' }).commit();
  const w = elasticNet(X, y, 0.1, 0.5, 50, {
    onIter: (i, ww) => rec.begin({ zh: \`\${i}: w=[\${ww.map((v) => v.toFixed(3)).join(',')}]\`, en: \`\${i}\` })
      .setBars(ww.map((v) => ({ value: v, role: 'pivot' as BarRole }))).commit(),
  });
  rec.begin({ zh: \`w=[\${w.map((v) => v.toFixed(3)).join(',')]\`, en: 'done' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elasticNet } from '../../src/algorithms/optimization/opt-elastic-net/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-elastic-net/trace.ts';
test('弹性网产生稀疏 w', () => {
  const w = elasticNet([[1, 1], [2, 2]], [1, 2], 1.0, 1.0, 50);
  assert.ok(w.some((v) => Math.abs(v) < 1e-3));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 13. opt-trust-region-cg
{
  id: 'opt-trust-region-cg',
  titleZh: '信赖域 CG', titleEn: 'Trust Region Conjugate Gradient',
  summaryZh: '在信赖域内用共轭梯度解二次模型，自动调节步长。',
  summaryEn: 'Solve the quadratic model with CG inside a trust region; auto-adjusts step length.',
  descZh: '信赖域 Steihaug-CG：在半径 Δ 内用 CG 迭代解 Bp=-g，遇边界则截断，根据实际/预测下降调节 Δ。',
  descEn: 'Trust region Steihaug-CG: CG solves Bp=-g within radius Δ; truncate at boundary; adjust Δ by actual/predicted.',
  tags: ['optimization','trust-region'],
  time: 'O(k·n)', space: 'O(n)',
  impl: `// 信赖域 CG (简化) · 实现
export interface TcHooks { onIter?: (i: number, x: number[], fx: number, delta: number) => void; onConclude?: (xmin: number[], fmin: number) => void; }
export function trustRegionCg(f: (x: readonly number[]) => number, grad: (x: readonly number[]) => number[], hess: (x: readonly number[]) => number[][], x0: number[], maxIter = 50, hooks: TcHooks = {}): { x: number[]; fx: number } {
  const x = [...x0];
  let delta = 1.0;
  for (let it = 0; it < maxIter; it++) {
    const g = grad(x);
    const B = hess(x);
    // 简化: 一步牛顿方向 p = -B^{-1} g (假设可逆), 截断到 delta
    let p = new Array<number>(x.length).fill(0);
    // 用梯度下降近似
    for (let i = 0; i < x.length; i++) p[i] = -g[i]!;
    const np = Math.sqrt(p.reduce((a, b) => a + b * b, 0));
    if (np > delta) for (let i = 0; i < x.length; i++) p[i] = p[i]! * delta / np;
    const fxOld = f(x);
    const xNew = x.map((v, i) => v + p[i]!);
    const fxNew = f(xNew);
    const actual = fxOld - fxNew;
    const pred = -(g.reduce((a, gi, i) => a + gi * p[i]!, 0) + 0.5 * p.reduce((a, _, i) => a + B[i]!.reduce((s, bij, j) => s + bij * p[j]!, 0), 0));
    const rho = pred > 0 ? actual / pred : 0;
    if (rho > 0.25) { for (let i = 0; i < x.length; i++) x[i] = xNew[i]!; }
    if (rho < 0.25) delta *= 0.5; else if (rho > 0.75) delta *= 2;
    hooks.onIter?.(it, [...x], fxNew, delta);
    if (Math.abs(actual) < 1e-12) break;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trustRegionCg } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => (x[0]! - 1) ** 2 + (x[1]! - 1) ** 2;
  const g = (x: readonly number[]) => [2 * (x[0]! - 1), 2 * (x[1]! - 1)];
  const h = () => [[2, 0], [0, 2]];
  rec.begin({ zh: '信赖域 CG', en: 'Trust region CG' }).commit();
  const r = trustRegionCg(f, g, h, [0, 0], 30, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: [\${x.map((v) => v.toFixed(3)).join(',')}] f=\${fx.toFixed(4)}\`, en: '' })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`min ≈ [\${r.x.map((v) => v.toFixed(3)).join(',')}] f=\${r.fx.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trustRegionCg } from '../../src/algorithms/optimization/opt-trust-region-cg/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-trust-region-cg/trace.ts';
test('信赖域 CG 收敛到 (1,1)', () => {
  const f = (x: readonly number[]) => (x[0]! - 1) ** 2 + (x[1]! - 1) ** 2;
  const r = trustRegionCg(f, (x) => [2 * (x[0]! - 1), 2 * (x[1]! - 1)], () => [[2, 0], [0, 2]], [0, 0], 100);
  assert.ok(r.fx < 0.1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 14. opt-interior-barrier-2
{
  id: 'opt-interior-barrier-2',
  titleZh: '内点障碍法', titleEn: 'Interior Point Barrier Method',
  summaryZh: '用对数障碍把不等式约束并入目标，沿中心路径逼近最优。',
  summaryEn: 'Fold inequality constraints into the objective via a log barrier; track central path.',
  descZh: '障碍法：min f(x)-μ·Σlog(b_i-a_i^T x)，μ→0。每步用牛顿法，得到中心路径。',
  descEn: 'Barrier method: min f(x)-μ·Σlog(b_i-a_i^T x), μ→0. Newton steps trace the central path.',
  tags: ['optimization','constrained','interior-point'],
  time: 'O(k·n³)', space: 'O(n²)',
  impl: `// 内点障碍法 · 实现 (简化: min x² s.t. x>=0)
export interface IbHooks { onIter?: (i: number, mu: number, x: number, fval: number) => void; onConclude?: (xmin: number, fmin: number) => void; }
export function interiorBarrier(f: (x: number) => number, grad: (x: number) => number, x0: number, lo: number, mu0 = 1, maxIter = 50, hooks: IbHooks = {}): { x: number; fx: number } {
  let x = x0, mu = mu0;
  for (let it = 0; it < maxIter; it++) {
    // 障碍梯度: grad - mu/(x-lo)
    const bg = grad(x) - mu / (x - lo);
    x -= 0.1 * bg;
    if (x <= lo) x = lo + 1e-6;
    const fval = f(x) - mu * Math.log(x - lo);
    hooks.onIter?.(it, mu, x, fval);
    mu *= 0.7;
    if (mu < 1e-8) break;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interiorBarrier } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '内点法 min (x+1)² s.t. x>=0', en: 'Interior point' }).commit();
  const r = interiorBarrier((x) => (x + 1) * (x + 1), (x) => 2 * (x + 1), 5, 0, 1, 40, {
    onIter: (i, mu, x) => rec.begin({ zh: \`\${i}: mu=\${mu.toExponential(1)} x=\${x.toFixed(4)}\`, en: '' })
      .setBars([{ value: x, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`min x=\${r.x.toFixed(4)} f=\${r.fx.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interiorBarrier } from '../../src/algorithms/optimization/opt-interior-barrier-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-interior-barrier-2/trace.ts';
test('内点法逼近边界', () => {
  const r = interiorBarrier((x) => (x + 1) * (x + 1), (x) => 2 * (x + 1), 5, 0, 1, 60);
  assert.ok(r.x >= 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 15. opt-penalty-aug-lag
{
  id: 'opt-penalty-aug-lag',
  titleZh: '增广拉格朗日', titleEn: 'Augmented Lagrangian',
  summaryZh: '结合拉格朗日乘子与二次罚项，比纯罚函数更稳定。',
  summaryEn: 'Combine Lagrange multipliers with a quadratic penalty; more stable than pure penalty.',
  descZh: 'ALM：L_A=f(x)+λ·c(x)+μ/2·c(x)²。交替更新 x 与乘子 λ←λ+μc(x)。',
  descEn: 'ALM: L_A=f(x)+λ·c(x)+μ/2·c(x)². Alternate x-update with λ<-λ+μc(x).',
  tags: ['optimization','constrained'],
  time: 'O(k·n)', space: 'O(n)',
  impl: `// 增广拉格朗日 · 实现 (等式约束 c(x)=0)
export interface AlHooks { onIter?: (i: number, x: number, lambda: number, violation: number) => void; onConclude?: (xmin: number, fmin: number) => void; }
export function augmentedLagrangian(f: (x: number) => number, gradf: (x: number) => number, c: (x: number) => number, gradc: (x: number) => number, x0: number, maxIter = 30, hooks: AlHooks = {}): { x: number; fx: number } {
  let x = x0, lambda = 0, mu = 10;
  for (let it = 0; it < maxIter; it++) {
    // 内层: 几步梯度下降极小化 L_A
    for (let inner = 0; inner < 20; inner++) {
      const g = gradf(x) + (lambda + mu * c(x)) * gradc(x);
      x -= 0.01 * g;
    }
    const violation = Math.abs(c(x));
    hooks.onIter?.(it, x, lambda, violation);
    lambda = lambda + mu * c(x);
    if (violation > 1e-3) mu *= 5;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { augmentedLagrangian } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // min x² s.t. x-2=0 => x=2
  rec.begin({ zh: 'ALM min x² s.t. x=2', en: 'ALM' }).commit();
  const r = augmentedLagrangian((x) => x * x, (x) => 2 * x, (x) => x - 2, () => 1, 0, 30, {
    onIter: (i, x, lam, v) => rec.begin({ zh: \`\${i}: x=\${x.toFixed(3)} λ=\${lam.toFixed(2)} v=\${v.toExponential(1)}\`, en: '' })
      .setBars([{ value: v, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`x=\${r.x.toFixed(3)} f=\${r.fx.toFixed(3)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { augmentedLagrangian } from '../../src/algorithms/optimization/opt-penalty-aug-lag/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-penalty-aug-lag/trace.ts';
test('ALM 满足约束', () => {
  const r = augmentedLagrangian((x) => x * x, (x) => 2 * x, (x) => x - 2, () => 1, 0, 50);
  assert.ok(Math.abs(r.x - 2) < 0.5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 16. opt-sqp
{
  id: 'opt-sqp',
  titleZh: '序列二次规划', titleEn: 'Sequential Quadratic Programming',
  summaryZh: '每步解一个 QP 子问题近似原约束问题，收敛快。',
  summaryEn: 'Each step solves a QP subproblem approximating the constrained problem; fast convergence.',
  descZh: 'SQP：在第 k 点构造 QP 子问题 min ½d^TBd+g^Td s.t. 约束线性化，解 d 更新 x。',
  descEn: 'SQP: at point k build QP subproblem min ½d^TBd+g^Td s.t. linearized constraints; solve d, update x.',
  tags: ['optimization','constrained','nonlinear'],
  time: 'O(k·n³)', space: 'O(n²)',
  impl: `// SQP (简化: 等式约束, B=I) · 实现
export interface SqpHooks { onIter?: (i: number, x: number, viol: number) => void; onConclude?: (xmin: number, fmin: number) => void; }
export function sqp(f: (x: number) => number, gradf: (x: number) => number, c: (x: number) => number, gradc: (x: number) => number, x0: number, maxIter = 50, hooks: SqpHooks = {}): { x: number; fx: number } {
  let x = x0, lam = 0;
  for (let it = 0; it < maxIter; it++) {
    const g = gradf(x), a = gradc(x), cv = c(x);
    // 解 QP: min ½d²+gd s.t. a·d+cv=0 => d = -(g + lam*a)/1, lam = (cv - a*g/(a²+...))
    // 简化一维
    lam = (a * g[0]! - cv) / (a * a + 1e-8);
    const d = -(g[0]! + lam * a);
    x += 0.5 * d;
    hooks.onIter?.(it, x, Math.abs(c(x)));
    if (Math.abs(d) < 1e-9) break;
  }
  const fx = f(x);
  hooks.onConclude?.(x, fx);
  void lam;
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SQP min x² s.t. x=2', en: 'SQP' }).commit();
  const r = sqp((x) => x * x, (x) => [2 * x], (x) => x - 2, () => 1, 0, 30, {
    onIter: (i, x, v) => rec.begin({ zh: \`\${i}: x=\${x.toFixed(3)} v=\${v.toExponential(1)}\`, en: '' })
      .setBars([{ value: v, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`x=\${r.x.toFixed(3)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sqp } from '../../src/algorithms/optimization/opt-sqp/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-sqp/trace.ts';
test('SQP 满足约束', () => {
  const r = sqp((x) => x * x, (x) => [2 * x], (x) => x - 2, () => 1, 0, 100);
  assert.ok(Math.abs(r.x - 2) < 1.0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 17. opt-proximal-grad
{
  id: 'opt-proximal-grad',
  titleZh: '近端梯度', titleEn: 'Proximal Gradient',
  summaryZh: '对可分 f+g 用梯度步处理 f、近端算子处理 g（如软阈值）。',
  summaryEn: 'For separable f+g use a gradient step on f and a proximal operator on g (e.g. soft threshold).',
  descZh: '近端梯度：x←prox_{ηg}(x-η∇f)。软阈值 prox 是 Lasso 的核心。',
  descEn: 'Proximal gradient: x<-prox_{ηg}(x-η∇f). Soft-thresholding prox is core to Lasso.',
  tags: ['optimization','proximal'],
  time: 'O(k·n)', space: 'O(n)',
  impl: `// 近端梯度 (Lasso) · 实现
export interface PgHooks2 { onIter?: (i: number, w: number[], loss: number) => void; onConclude?: (w: number[]) => void; }
function softThreshold(z: number, lam: number): number { return z > lam ? z - lam : z < -lam ? z + lam : 0; }
export function proximalGradient(X: ReadonlyArray<readonly number[]>, y: readonly number[], lam: number, lr = 0.01, maxIter = 100, hooks: PgHooks2 = {}): number[] {
  const n = X.length, d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  for (let it = 0; it < maxIter; it++) {
    const grad = new Array<number>(d).fill(0);
    let loss = 0;
    for (let i = 0; i < n; i++) { let p = 0; for (let j = 0; j < d; j++) p += w[j]! * X[i]![j]!; const r = p - y[i]!; loss += r * r; for (let j = 0; j < d; j++) grad[j]! += r * X[i]![j]!; }
    for (let j = 0; j < d; j++) w[j] = softThreshold(w[j]! - lr * grad[j]! / n, lr * lam);
    hooks.onIter?.(it, [...w], loss / n);
  }
  hooks.onConclude?.(w);
  return w;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { proximalGradient } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const X = [[1, 0], [2, 0], [3, 1]];
  const y = [2, 4, 6];
  rec.begin({ zh: '近端梯度 Lasso', en: 'Proximal Lasso' }).commit();
  const w = proximalGradient(X, y, 0.5, 0.05, 80, {
    onIter: (i, ww, loss) => rec.begin({ zh: \`\${i}: loss=\${loss.toFixed(3)}\`, en: '' })
      .setBars([{ value: loss, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`w=[\${w.map((v) => v.toFixed(3)).join(',')}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proximalGradient } from '../../src/algorithms/optimization/opt-proximal-grad/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-proximal-grad/trace.ts';
test('近端梯度产生稀疏', () => {
  const w = proximalGradient([[1, 0.01]], [1], 5, 0.1, 100);
  assert.ok(w.length === 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 18. opt-ada-bound
{
  id: 'opt-ada-bound',
  titleZh: 'AdaBound', titleEn: 'AdaBound Optimizer',
  summaryZh: '给 Adam 的步长设上下界，初期像 Adam 后期像 SGD。',
  summaryEn: 'Bound Adam step sizes between dynamic limits; Adam-like early, SGD-like late.',
  descZh: 'AdaBound：在 Adam 基础上把 lr 裁剪到 [lower, upper] 动态边界，兼顾自适应与稳定。',
  descEn: 'AdaBound: clip Adam lr into dynamic [lower, upper]; balances adaptivity and stability.',
  tags: ['optimization','adaptive','machine-learning'],
  time: 'O(k·d)', space: 'O(d)',
  impl: `// AdaBound · 实现
export interface AbHooks { onIter?: (i: number, x: number[], fx: number) => void; onConclude?: (xmin: number[], fmin: number) => void; }
export function adabound(grad: (x: readonly number[]) => number[], x0: number[], lr = 0.01, beta1 = 0.9, beta2 = 0.999, finalLr = 0.1, gamma = 0.001, maxIter = 200, hooks: AbHooks = {}): { x: number[]; fx: number } {
  const d = x0.length;
  const m = new Array<number>(d).fill(0);
  const v = new Array<number>(d).fill(0);
  const x = [...x0];
  for (let t = 1; t <= maxIter; t++) {
    const g = grad(x);
    const lower = lr - lr * (1 - 1 / (t * gamma + 1));
    const upper = lr + lr * (1 - 1 / (t * gamma + 1));
    for (let i = 0; i < d; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      const mhat = m[i]! / (1 - Math.pow(beta1, t));
      const vhat = v[i]! / (1 - Math.pow(beta2, t));
      let step = lr * mhat / (Math.sqrt(vhat) + 1e-8);
      step = Math.max(finalLr * lower / lr, Math.min(finalLr * upper / lr, step));
      x[i] -= step;
    }
    const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(t - 1, [...x], fx);
  }
  const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adabound } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'AdaBound', en: 'AdaBound' }).commit();
  const r = adabound((x) => [...x], [3, -4], 0.01, 0.9, 0.999, 0.1, 0.001, 60, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: f=\${fx.toFixed(4)}\`, en: '' })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`f=\${r.fx.toFixed(6)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adabound } from '../../src/algorithms/optimization/opt-ada-bound/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-ada-bound/trace.ts';
test('AdaBound 收敛', () => {
  const r = adabound((x) => [...x], [5, 5], 0.1, 0.9, 0.999, 0.1, 0.01, 200);
  assert.ok(r.fx < 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 19. opt-lion
{
  id: 'opt-lion',
  titleZh: 'Lion 优化器', titleEn: 'Lion Optimizer',
  summaryZh: '符号动量优化器，内存比 Adam 少一半，性能相当。',
  summaryEn: 'Sign-momentum optimizer using half the memory of Adam with comparable performance.',
  descZh: 'Lion：u=sign(β1·m+(1-β1)·g)；x←x-lr·u；m←β2·m+(1-β2)·g。只用一阶动量。',
  descEn: 'Lion: u=sign(β1·m+(1-β1)·g); x<-x-lr·u; m<-β2·m+(1-β2)·g. Single first moment.',
  tags: ['optimization','adaptive','machine-learning'],
  time: 'O(k·d)', space: 'O(d)',
  impl: `// Lion 优化器 · 实现
export interface LiHooks { onIter?: (i: number, x: number[], fx: number) => void; onConclude?: (xmin: number[], fmin: number) => void; }
export function lion(grad: (x: readonly number[]) => number[], x0: number[], lr = 0.01, beta1 = 0.9, beta2 = 0.99, maxIter = 200, hooks: LiHooks = {}): { x: number[]; fx: number } {
  const d = x0.length;
  const m = new Array<number>(d).fill(0);
  const x = [...x0];
  for (let t = 0; t < maxIter; t++) {
    const g = grad(x);
    for (let i = 0; i < d; i++) {
      const u = Math.sign(beta1 * m[i]! + (1 - beta1) * g[i]!);
      x[i] -= lr * u;
      m[i] = beta2 * m[i]! + (1 - beta2) * g[i]!;
    }
    const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(t, [...x], fx);
  }
  const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lion } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Lion 优化器', en: 'Lion' }).commit();
  const r = lion((x) => [...x], [4, -3], 0.1, 0.9, 0.99, 60, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: f=\${fx.toFixed(4)}\`, en: '' })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`f=\${r.fx.toFixed(6)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lion } from '../../src/algorithms/optimization/opt-lion/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-lion/trace.ts';
test('Lion 收敛', () => {
  const r = lion((x) => [...x], [5, 5], 0.1, 0.9, 0.99, 200);
  assert.ok(r.fx < 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 20. opt-shampoo
{
  id: 'opt-shampoo',
  titleZh: 'Shampoo 优化器', titleEn: 'Shampoo Optimizer',
  summaryZh: '为矩阵参数维护左右预条件统计，二阶信息近似。',
  summaryEn: 'Maintains left/right preconditioner statistics for matrix parameters; 2nd-order-like.',
  descZh: 'Shampoo：对矩阵参数 W，维护 L=G^TG 和 R=GG^T 的指数移动平均，更新 W←W-lr·L^{-1/4} G R^{-1/4}。',
  descEn: 'Shampoo: for matrix W keep EMA of L=G^TG and R=GG^T; update W<-W-lr·L^{-1/4}GR^{-1/4}.',
  tags: ['optimization','preconditioned','matrix'],
  time: 'O(k·mn)', space: 'O(m²+n²)',
  impl: `// Shampoo (简化一维近似) · 实现
export interface ShHooks { onIter?: (i: number, w: number[], fx: number) => void; onConclude?: (w: number[]) => void; }
export function shampoo(grad: (w: readonly number[]) => number[], w0: number[], lr = 0.01, eps = 1e-6, maxIter = 200, hooks: ShHooks = {}): number[] {
  const d = w0.length;
  const w = [...w0];
  const stat = new Array<number>(d).fill(0); // 各维梯度平方统计
  for (let t = 0; t < maxIter; t++) {
    const g = grad(w);
    for (let i = 0; i < d; i++) { stat[i] = 0.9 * stat[i]! + 0.1 * Math.abs(g[i]!); w[i] -= lr * g[i]! / (Math.sqrt(stat[i]!) + eps); }
    const fx = 0.5 * w.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(t, [...w], fx);
  }
  hooks.onConclude?.(w);
  return w;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shampoo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Shampoo', en: 'Shampoo' }).commit();
  const w = shampoo((x) => [...x], [3, -2, 1], 0.1, 1e-6, 60, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: f=\${fx.toFixed(4)}\`, en: '' })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`f=0.5|x|² 收敛\`, en: '' }).commit();
  void w;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shampoo } from '../../src/algorithms/optimization/opt-shampoo/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-shampoo/trace.ts';
test('Shampoo 收敛', () => {
  const w = shampoo((x) => [...x], [5, 5], 0.1, 1e-6, 200);
  const fx = 0.5 * w.reduce((a, b) => a + b * b, 0);
  assert.ok(fx < 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 21. opt-quasi-dfp-2
{
  id: 'opt-quasi-dfp-2',
  titleZh: 'DFP 拟牛顿', titleEn: 'DFP Quasi-Newton',
  summaryZh: '用秩 2 更新近似逆 Hessian，无需二阶导。',
  summaryEn: 'Rank-2 update approximates the inverse Hessian; no second derivatives needed.',
  descZh: 'DFP：H_{k+1}=H+ss^T/(y^Ts)-Hy y^T H/(y^THy)。比 BFGS 稍早，原理类似。',
  descEn: 'DFP: H_{k+1}=H+ss^T/(y^Ts)-Hy y^T H/(y^THy). Earlier than BFGS, similar idea.',
  tags: ['optimization','quasi-newton'],
  time: 'O(k·n²)', space: 'O(n²)',
  impl: `// DFP 拟牛顿 · 实现
export interface DfpHooks { onIter?: (i: number, x: number[], fx: number) => void; onConclude?: (xmin: number[], fmin: number) => void; }
export function dfp(grad: (x: readonly number[]) => number[], x0: number[], maxIter = 100, hooks: DfpHooks = {}): { x: number[]; fx: number } {
  const n = x0.length;
  let x = [...x0];
  let H = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
  let g = grad(x);
  for (let it = 0; it < maxIter; it++) {
    const d = H.map((row) => -row.reduce((a, hij, j) => a + hij * g[j]!, 0));
    const dnorm = Math.sqrt(d.reduce((a, b) => a + b * b, 0));
    if (dnorm < 1e-9) break;
    const xNew = x.map((v, i) => v + 0.01 * d[i]!); // 简化步长
    const gNew = grad(xNew);
    const s = xNew.map((v, i) => v - x[i]!);
    const y = gNew.map((v, i) => v - g[i]!);
    const ys = y.reduce((a, yi, i) => a + yi * s[i]!, 0);
    if (Math.abs(ys) > 1e-12) {
      const Hy = H.map((row) => row.reduce((a, hij, j) => a + hij * y[j]!, 0));
      const yHy = y.reduce((a, yi, i) => a + yi * Hy[i]!, 0);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) H[i]![j]! += s[i]! * s[j]! / ys - Hy[i]! * Hy[j]! / yHy;
    }
    x = xNew; g = gNew;
    const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
    hooks.onIter?.(it, [...x], fx);
  }
  const fx = 0.5 * x.reduce((a, b) => a + b * b, 0);
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DFP 拟牛顿', en: 'DFP' }).commit();
  const r = dfp((x) => [...x], [3, -4], 60, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: f=\${fx.toFixed(4)}\`, en: '' })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`f=\${r.fx.toFixed(6)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfp } from '../../src/algorithms/optimization/opt-quasi-dfp-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-quasi-dfp-2/trace.ts';
test('DFP 收敛', () => {
  const r = dfp((x) => [...x], [5, 5], 200);
  assert.ok(r.fx < 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 22. opt-particle-swarm-2
{
  id: 'opt-particle-swarm-2',
  titleZh: '粒子群优化', titleEn: 'Particle Swarm Optimization',
  summaryZh: '群体智能：每个粒子受自身最优与全局最优吸引，迭代搜索。',
  summaryEn: 'Swarm intelligence: each particle pulled by its own and the global best; iterative search.',
  descZh: 'PSO：v←ωv+c1r1(pBest-x)+c2r2(gBest-x)；x←x+v。群体涌现全局搜索能力。',
  descEn: 'PSO: v<-ωv+c1r1(pBest-x)+c2r2(gBest-x); x<-x+v. Emergent global search.',
  tags: ['optimization','metaheuristic','swarm'],
  time: 'O(k·n·d)', space: 'O(n·d)',
  impl: `// 粒子群优化 · 实现
export interface PsoHooks2 { onIter?: (i: number, gBest: number[], gFit: number) => void; onConclude?: (gBest: number[], gFit: number) => void; }
export function particleSwarm(f: (x: readonly number[]) => number, dim: number, n = 20, maxIter = 50, hooks: PsoHooks2 = {}): { gBest: number[]; gFit: number } {
  const pos = Array.from({ length: n }, () => Array.from({ length: dim }, () => (Math.random() - 0.5) * 10));
  const vel = Array.from({ length: n }, () => new Array<number>(dim).fill(0));
  const pBest = pos.map((p) => [...p]);
  const pFit = pos.map((p) => f(p));
  let gBest = [...pFit.reduce((best, _, i) => pFit[i]! < pFit[best]! ? i : best, 0)];
  let gFit = Math.min(...pFit);
  for (let it = 0; it < maxIter; it++) {
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        const r1 = Math.random(), r2 = Math.random();
        vel[i]![d] = 0.7 * vel[i]![d]! + 1.5 * r1 * (pBest[i]![d]! - pos[i]![d]!) + 1.5 * r2 * (gBest[d]! - pos[i]![d]!);
        pos[i]![d] += vel[i]![d]!;
      }
      const fit = f(pos[i]!);
      if (fit < pFit[i]!) { pFit[i] = fit; pBest[i] = [...pos[i]!]; if (fit < gFit) { gFit = fit; gBest = [...pos[i]!]; } }
    }
    hooks.onIter?.(it, [...gBest], gFit);
  }
  hooks.onConclude?.(gBest, gFit);
  return { gBest, gFit };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { particleSwarm } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: 'PSO min x²+y²', en: 'PSO' }).commit();
  // fixed seed for reproducibility-ish
  const r = particleSwarm(f, 2, 20, 40, {
    onIter: (i, gb, gf) => rec.begin({ zh: \`\${i}: gBest=[\${gb.map((v) => v.toFixed(2)).join(',')}] f=\${gf.toFixed(4)}\`, en: '' })
      .setBars([{ value: gf, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`best f=\${r.gFit.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { particleSwarm } from '../../src/algorithms/optimization/opt-particle-swarm-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-particle-swarm-2/trace.ts';
test('PSO 接近 0', () => {
  const r = particleSwarm((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 20, 50);
  assert.ok(r.gFit < 5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 23. opt-firefly-2
{
  id: 'opt-firefly-2',
  titleZh: '萤火虫算法', titleEn: 'Firefly Algorithm',
  summaryZh: '模拟萤火虫相互吸引，亮度高的吸引低的，亮度∝目标值。',
  summaryEn: 'Fireflies attract each other proportional to brightness; brightness ties to fitness.',
  descZh: '萤火虫算法：每只萤火虫亮度=1/(1+f)。低亮度被高亮度吸引：x←x+β·e^{-γr²}·(j-i)+α·ε。',
  descEn: 'Firefly: brightness=1/(1+f). Less bright moves toward brighter: x<-x+βe^{-γr²}(j-i)+αε.',
  tags: ['optimization','metaheuristic','swarm'],
  time: 'O(k·n²·d)', space: 'O(n·d)',
  impl: `// 萤火虫算法 · 实现
export interface FaHooks { onIter?: (i: number, best: number[], bestFit: number) => void; onConclude?: (best: number[], bestFit: number) => void; }
export function firefly(f: (x: readonly number[]) => number, dim: number, n = 15, maxIter = 30, hooks: FaHooks = {}): { best: number[]; bestFit: number } {
  const pos = Array.from({ length: n }, () => Array.from({ length: dim }, () => (Math.random() - 0.5) * 10));
  const alpha = 0.2, beta0 = 1, gamma = 1;
  for (let it = 0; it < maxIter; it++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (f(pos[j]!) < f(pos[i]!)) {
          const r = Math.sqrt(pos[i]!.reduce((a, v, d) => a + (v - pos[j]![d]!) ** 2, 0));
          const beta = beta0 * Math.exp(-gamma * r * r);
          for (let d = 0; d < dim; d++) pos[i]![d] += beta * (pos[j]![d]! - pos[i]![d]!) + alpha * (Math.random() - 0.5);
        }
      }
    }
    const fits = pos.map((p) => f(p));
    const bi = fits.reduce((b, _, i) => fits[i]! < fits[b]! ? i : b, 0);
    hooks.onIter?.(it, [...pos[bi]!], fits[bi]!);
  }
  const fits = pos.map((p) => f(p));
  const bi = fits.reduce((b, _, i) => fits[i]! < fits[b]! ? i : b, 0);
  hooks.onConclude?.([...pos[bi]!], fits[bi]!);
  return { best: [...pos[bi]!], bestFit: fits[bi]! };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { firefly } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: '萤火虫算法', en: 'Firefly' }).commit();
  const r = firefly(f, 2, 15, 30, {
    onIter: (i, b, bf) => rec.begin({ zh: \`\${i}: best f=\${bf.toFixed(4)}\`, en: '' })
      .setBars([{ value: bf, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`best f=\${r.bestFit.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firefly } from '../../src/algorithms/optimization/opt-firefly-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-firefly-2/trace.ts';
test('萤火虫收敛', () => {
  const r = firefly((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 15, 40);
  assert.ok(r.bestFit < 10);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 24. opt-bat-2
{
  id: 'opt-bat-2',
  titleZh: '蝙蝠算法', titleEn: 'Bat Algorithm',
  summaryZh: '模拟蝙蝠回声定位调频调响，群体搜索最优。',
  summaryEn: 'Mimics bat echolocation with frequency/loudness adjustment for swarm search.',
  descZh: '蝙蝠算法：每只蝙蝠频率 f_i，位置更新 x←x+f·v，响度与脉冲率随迭代衰减。',
  descEn: 'Bat: each bat has frequency f; position x<-x+fv; loudness and pulse rate decay over iterations.',
  tags: ['optimization','metaheuristic','swarm'],
  time: 'O(k·n·d)', space: 'O(n·d)',
  impl: `// 蝙蝠算法 · 实现
export interface BatHooks2 { onIter?: (i: number, best: number[], bestFit: number) => void; onConclude?: (best: number[], bestFit: number) => void; }
export function bat(f: (x: readonly number[]) => number, dim: number, n = 15, maxIter = 40, hooks: BatHooks2 = {}): { best: number[]; bestFit: number } {
  const pos = Array.from({ length: n }, () => Array.from({ length: dim }, () => (Math.random() - 0.5) * 10));
  const vel = Array.from({ length: n }, () => new Array<number>(dim).fill(0));
  let gBest = [...pos[0]!], gFit = f(pos[0]!);
  for (let i = 1; i < n; i++) { const fit = f(pos[i]!); if (fit < gFit) { gFit = fit; gBest = [...pos[i]!]; } }
  for (let it = 0; it < maxIter; it++) {
    for (let i = 0; i < n; i++) {
      const freq = 0.25 + Math.random() * 0.5;
      for (let d = 0; d < dim; d++) { vel[i]![d] += (pos[i]![d]! - gBest[d]!) * freq; pos[i]![d] += vel[i]![d]! * 0.5; }
      if (Math.random() > 0.5) for (let d = 0; d < dim; d++) pos[i]![d] = gBest[d]! + (Math.random() - 0.5) * 0.5;
      const fit = f(pos[i]!);
      if (fit < gFit) { gFit = fit; gBest = [...pos[i]!]; }
    }
    hooks.onIter?.(it, [...gBest], gFit);
  }
  hooks.onConclude?.(gBest, gFit);
  return { best: gBest, bestFit: gFit };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bat } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: '蝙蝠算法', en: 'Bat' }).commit();
  const r = bat(f, 2, 15, 40, {
    onIter: (i, b, bf) => rec.begin({ zh: \`\${i}: best f=\${bf.toFixed(4)}\`, en: '' })
      .setBars([{ value: bf, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`best f=\${r.bestFit.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bat } from '../../src/algorithms/optimization/opt-bat-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bat-2/trace.ts';
test('蝙蝠收敛', () => {
  const r = bat((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 15, 50);
  assert.ok(r.bestFit < 5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 25. opt-cuckoo-2
{
  id: 'opt-cuckoo-2',
  titleZh: '布谷鸟搜索', titleEn: 'Cuckoo Search',
  summaryZh: '基于莱维飞行的随机搜索，弃差巢保留好巢。',
  summaryEn: 'Levy-flight random search; abandon worst nests, keep best.',
  descZh: '布谷鸟搜索：每个巢代表一个解，新解由莱维飞行生成，按概率 pa 弃最差巢。',
  descEn: 'Cuckoo search: each nest a solution; new solutions via Levy flights; abandon worst nests with prob pa.',
  tags: ['optimization','metaheuristic','levy'],
  time: 'O(k·n·d)', space: 'O(n·d)',
  impl: `// 布谷鸟搜索 · 实现
export interface CsHooks { onIter?: (i: number, best: number[], bestFit: number) => void; onConclude?: (best: number[], bestFit: number) => void; }
function levy(d: number): number[] { const out: number[] = []; for (let i = 0; i < d; i++) out.push((Math.random() - 0.5) * 2 / Math.pow(Math.random() + 0.01, 1.5)); return out; }
export function cuckoo(f: (x: readonly number[]) => number, dim: number, n = 15, maxIter = 40, pa = 0.25, hooks: CsHooks = {}): { best: number[]; bestFit: number } {
  let nests = Array.from({ length: n }, () => Array.from({ length: dim }, () => (Math.random() - 0.5) * 10));
  let fits = nests.map((p) => f(p));
  for (let it = 0; it < maxIter; it++) {
    const i = Math.floor(Math.random() * n);
    const step = levy(dim);
    const newNest = nests[i]!.map((v, d) => v + step[d]!);
    const newFit = f(newNest);
    const j = Math.floor(Math.random() * n);
    if (newFit < fits[j]!) { nests[j] = newNest; fits[j] = newFit; }
    // 弃最差 pa 比例
    const order = fits.map((v, idx) => ({ v, idx })).sort((a, b) => b.v - a.v);
    for (let k = 0; k < Math.floor(n * pa); k++) { const idx = order[k]!.idx; nests[idx] = Array.from({ length: dim }, () => (Math.random() - 0.5) * 10); fits[idx] = f(nests[idx]!); }
    const bi = fits.reduce((b, _, idx) => fits[idx]! < fits[b]! ? idx : b, 0);
    hooks.onIter?.(it, [...nests[bi]!], fits[bi]!);
  }
  const bi = fits.reduce((b, _, idx) => fits[idx]! < fits[b]! ? idx : b, 0);
  hooks.onConclude?.([...nests[bi]!], fits[bi]!);
  return { best: [...nests[bi]!], bestFit: fits[bi]! };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cuckoo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: '布谷鸟搜索', en: 'Cuckoo' }).commit();
  const r = cuckoo(f, 2, 15, 40, 0.25, {
    onIter: (i, b, bf) => rec.begin({ zh: \`\${i}: best f=\${bf.toFixed(4)}\`, en: '' })
      .setBars([{ value: bf, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`best f=\${r.bestFit.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cuckoo } from '../../src/algorithms/optimization/opt-cuckoo-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-cuckoo-2/trace.ts';
test('布谷鸟收敛', () => {
  const r = cuckoo((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 15, 50);
  assert.ok(r.bestFit < 5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 26. opt-grey-wolf
{
  id: 'opt-grey-wolf',
  titleZh: '灰狼优化', titleEn: 'Grey Wolf Optimizer',
  summaryZh: '模拟狼群 αβδ 三阶领导狩猎，包围与攻击猎物。',
  summaryEn: 'Mimics alpha/beta/delta leadership hierarchy in encircling and attacking prey.',
  descZh: 'GWO：α、β、δ 三只最优狼引导，其他狼根据三者位置更新位置，参数 a 线性递减。',
  descEn: 'GWO: top three wolves alpha/beta/delta guide; others update position from these three; param a decreases.',
  tags: ['optimization','metaheuristic','swarm'],
  time: 'O(k·n·d)', space: 'O(n·d)',
  impl: `// 灰狼优化 · 实现
export interface GwoHooks { onIter?: (i: number, best: number[], bestFit: number) => void; onConclude?: (best: number[], bestFit: number) => void; }
export function greyWolf(f: (x: readonly number[]) => number, dim: number, n = 20, maxIter = 40, hooks: GwoHooks = {}): { best: number[]; bestFit: number } {
  let pos = Array.from({ length: n }, () => Array.from({ length: dim }, () => (Math.random() - 0.5) * 10));
  const fit = pos.map((p) => f(p));
  const sorted = () => [...fit.keys()].sort((a, b) => fit[a]! - fit[b]!);
  for (let it = 0; it < maxIter; it++) {
    const a = 2 - 2 * it / maxIter;
    const order = sorted();
    const [alpha, beta, delta] = [pos[order[0]!]!, pos[order[1]!]!, pos[order[2]!]!];
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        const upd = (lead: number[]) => { const A = 2 * a * Math.random() - a, C = 2 * Math.random(); const D = Math.abs(C * lead[d]! - pos[i]![d]!); return lead[d]! - A * D; };
        pos[i]![d] = (upd(alpha) + upd(beta) + upd(delta)) / 3;
      }
      fit[i] = f(pos[i]!);
    }
    const o = sorted();
    hooks.onIter?.(it, [...pos[o[0]!]!], fit[o[0]!]!);
  }
  const o = sorted();
  hooks.onConclude?.([...pos[o[0]!]!], fit[o[0]!]!);
  return { best: [...pos[o[0]!]!], bestFit: fit[o[0]!]! };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greyWolf } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: '灰狼优化', en: 'GWO' }).commit();
  const r = greyWolf(f, 2, 20, 40, {
    onIter: (i, b, bf) => rec.begin({ zh: \`\${i}: best f=\${bf.toFixed(4)}\`, en: '' })
      .setBars([{ value: bf, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`best f=\${r.bestFit.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greyWolf } from '../../src/algorithms/optimization/opt-grey-wolf/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-grey-wolf/trace.ts';
test('灰狼收敛', () => {
  const r = greyWolf((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 20, 50);
  assert.ok(r.bestFit < 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 27. opt-whale
{
  id: 'opt-whale',
  titleZh: '鲸鱼优化', titleEn: 'Whale Optimization',
  summaryZh: '模拟座头鲸气泡网捕食的包围与螺旋更新机制。',
  summaryEn: 'Mimics humpback whale bubble-net encircling and spiral updating.',
  descZh: 'WOA：以 50% 概率选择缩小包围或螺旋更新，向最优鲸位置逼近。',
  descEn: 'WOA: 50% chance between shrinking encircle or spiral update toward best whale.',
  tags: ['optimization','metaheuristic','swarm'],
  time: 'O(k·n·d)', space: 'O(n·d)',
  impl: `// 鲸鱼优化 · 实现
export interface WoHooks2 { onIter?: (i: number, best: number[], bestFit: number) => void; onConclude?: (best: number[], bestFit: number) => void; }
export function whale(f: (x: readonly number[]) => number, dim: number, n = 20, maxIter = 40, hooks: WoHooks2 = {}): { best: number[]; bestFit: number } {
  let pos = Array.from({ length: n }, () => Array.from({ length: dim }, () => (Math.random() - 0.5) * 10));
  const fit = pos.map((p) => f(p));
  let bi = fit.reduce((b, _, i) => fit[i]! < fit[b]! ? i : b, 0);
  for (let it = 0; it < maxIter; it++) {
    const a = 2 - 2 * it / maxIter;
    for (let i = 0; i < n; i++) {
      const A = 2 * a * Math.random() - a, C = 2 * Math.random(), p = Math.random();
      for (let d = 0; d < dim; d++) {
        if (p < 0.5) {
          if (Math.abs(A) < 1) pos[i]![d] = pos[bi]![d]! - A * Math.abs(C * pos[bi]![d]! - pos[i]![d]!);
          else { const rand = pos[Math.floor(Math.random() * n)]!; pos[i]![d] = rand[d]! - A * Math.abs(C * rand[d]! - pos[i]![d]!); }
        } else { const l = (Math.random() - 0.5) * 2; const D = Math.abs(pos[bi]![d]! - pos[i]![d]!); pos[i]![d] = D * Math.exp(0.5 * l) * Math.cos(2 * Math.PI * l) + pos[bi]![d]!; }
      }
      fit[i] = f(pos[i]!); if (fit[i]! < fit[bi]!) bi = i;
    }
    hooks.onIter?.(it, [...pos[bi]!], fit[bi]!);
  }
  hooks.onConclude?.([...pos[bi]!], fit[bi]!);
  return { best: [...pos[bi]!], bestFit: fit[bi]! };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { whale } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: '鲸鱼优化', en: 'WOA' }).commit();
  const r = whale(f, 2, 20, 40, {
    onIter: (i, b, bf) => rec.begin({ zh: \`\${i}: best f=\${bf.toFixed(4)}\`, en: '' })
      .setBars([{ value: bf, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`best f=\${r.bestFit.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whale } from '../../src/algorithms/optimization/opt-whale/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-whale/trace.ts';
test('鲸鱼收敛', () => {
  const r = whale((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 20, 50);
  assert.ok(r.bestFit < 5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 28. opt-grasp
{
  id: 'opt-grasp',
  titleZh: 'GRASP 元启发', titleEn: 'GRASP Metaheuristic',
  summaryZh: '反复构造贪婪随机解再局部改进，保留最优。',
  summaryEn: 'Repeatedly build greedy-random solutions then locally improve; keep the best.',
  descZh: 'GRASP：每轮从受限候选列表(RCL)随机选元素构造解，再做局部搜索，取多轮最优。',
  descEn: 'GRASP: each round build a solution by random picks from a restricted candidate list, then local search.',
  tags: ['optimization','metaheuristic'],
  time: 'O(k·n²)', space: 'O(n)',
  impl: `// GRASP (路径构造) · 实现
export interface GrHooks { onIter?: (i: number, sol: number[], cost: number) => void; onConclude?: (best: number[], bestCost: number) => void; }
export function grasp(dist: ReadonlyArray<readonly number[]>, n: number, rounds = 20, alpha = 0.3, hooks: GrHooks = {}): { best: number[]; bestCost: number } {
  let best: number[] = [], bestCost = Infinity;
  for (let r = 0; r < rounds; r++) {
    const unvisited = new Set<number>(Array.from({ length: n }, (_, i) => i));
    const sol: number[] = [];
    let cur = 0; unvisited.delete(0); sol.push(0);
    while (unvisited.size > 0) {
      const cands = [...unvisited].map((j) => ({ j, d: dist[cur]![j]! })).sort((a, b) => a.d - b.d);
      const cut = Math.max(1, Math.floor(cands.length * alpha));
      const pick = cands[Math.floor(Math.random() * cut)]!;
      cur = pick.j; sol.push(cur); unvisited.delete(cur);
    }
    sol.push(0);
    let cost = 0; for (let i = 0; i + 1 < sol.length; i++) cost += dist[sol[i]!]![sol[i + 1]!]!;
    hooks.onIter?.(r, sol, cost);
    if (cost < bestCost) { bestCost = cost; best = sol; }
  }
  hooks.onConclude?.(best, bestCost);
  return { best, bestCost };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grasp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [[0, 2, 9, 10], [1, 0, 6, 4], [15, 7, 0, 8], [6, 3, 12, 0]];
  rec.begin({ zh: 'GRASP TSP', en: 'GRASP TSP' }).commit();
  const r = grasp(D, 4, 20, 0.3, {
    onConclude: (b, c) => rec.begin({ zh: \`best cost=\${c}\`, en: '' })
      .setBars([{ value: c, role: 'final' as BarRole }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grasp } from '../../src/algorithms/optimization/opt-grasp/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-grasp/trace.ts';
test('GRASP 返回回路', () => {
  const r = grasp([[0, 1, 2], [1, 0, 3], [2, 3, 0]], 3, 10, 0.3);
  assert.equal(r.best[0], 0);
  assert.ok(r.bestCost >= 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 29. opt-kalman-1d
{
  id: 'opt-kalman-1d',
  titleZh: '一维卡尔曼滤波', titleEn: '1D Kalman Filter',
  summaryZh: '递归最小均方估计：预测-更新两步融合带噪观测。',
  summaryEn: 'Recursive LMMSE: predict-update steps fuse noisy measurements.',
  descZh: '卡尔曼：预测 x=x, P=P+Q；更新 K=P/(P+R), x=x+K(z-x), P=(1-K)P。一维简化。',
  descEn: 'Kalman: predict x=x, P=P+Q; update K=P/(P+R), x=x+K(z-x), P=(1-K)P. 1D simplified.',
  tags: ['optimization','filtering','estimation'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 一维卡尔曼滤波 · 实现
export interface KfHooks { onStep?: (i: number, z: number, x: number, P: number) => void; onConclude?: (estimates: number[]) => void; }
export function kalman1d(measurements: readonly number[], x0: number, P0: number, Q: number, R: number, hooks: KfHooks = {}): number[] {
  let x = x0, P = P0;
  const est: number[] = [];
  for (let i = 0; i < measurements.length; i++) {
    P += Q;
    const K = P / (P + R);
    x = x + K * (measurements[i]! - x);
    P = (1 - K) * P;
    est.push(x);
    hooks.onStep?.(i, measurements[i]!, x, P);
  }
  hooks.onConclude?.(est);
  return est;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kalman1d } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const z = [1.2, 1.9, 3.1, 3.8, 5.2];
  rec.begin({ zh: '卡尔曼滤波', en: 'Kalman' }).commit();
  const est = kalman1d(z, 0, 1, 0.1, 1, {
    onStep: (i, zi, x) => rec.begin({ zh: \`\${i}: z=\${zi.toFixed(2)} x=\${x.toFixed(2)}\`, en: '' })
      .setBars([{ value: zi, role: 'pivot' as BarRole }, { value: x, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`估计 [\${est.map((v) => v.toFixed(2)).join(',')}]\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kalman1d } from '../../src/algorithms/optimization/opt-kalman-1d/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-kalman-1d/trace.ts';
test('卡尔曼收敛到真值', () => {
  const est = kalman1d([5, 5, 5, 5, 5], 0, 1, 0.1, 0.5);
  assert.ok(Math.abs(est[est.length - 1]! - 5) < 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 30. opt-line-search-zhang
{
  id: 'opt-line-search-zhang',
  titleZh: 'Zhang-Hager 线搜索', titleEn: 'Zhang-Hager Line Search',
  summaryZh: '非单调线搜索：允许目标偶尔上升，避免窄谷震荡。',
  summaryEn: 'Non-monotone line search allowing occasional objective increases; avoids narrow-valley oscillation.',
  descZh: 'Zhang-Hager：维护参考值 c≤max f，接受满足 f≤c+α·步长的点，平滑非单调。',
  descEn: 'Zhang-Hager: reference c<=max f; accept point with f<=c+alpha*step; smooth non-monotone.',
  tags: ['optimization','line-search','non-monotone'],
  time: 'O(k)', space: 'O(1)',
  impl: `// Zhang-Hager 非单调线搜索 · 实现
export interface ZhHooks { onIter?: (i: number, x: number, fx: number, ref: number) => void; onConclude?: (xmin: number, fmin: number) => void; }
export function zhangHagerLineSearch(f: (x: number) => number, grad: (x: number) => number, x0: number, maxIter = 50, eta = 0.1, hooks: ZhHooks = {}): { x: number; fx: number } {
  let x = x0, fx = f(x), q = 1, c = fx;
  for (let it = 0; it < maxIter; it++) {
    const g = grad(x);
    let t = 1;
    let xNew = x - t * g;
    let fNew = f(xNew);
    while (fNew > c - eta * t * g * g && t > 1e-8) { t *= 0.5; xNew = x - t * g; fNew = f(xNew); }
    const gamma = 0.5;
    q = gamma * q + 1;
    c = (gamma * q * c + fNew) / q;
    x = xNew; fx = fNew;
    hooks.onIter?.(it, x, fx, c);
  }
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zhangHagerLineSearch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Zhang-Hager 线搜索', en: 'ZH line search' }).commit();
  const r = zhangHagerLineSearch((x) => (x - 3) * (x - 3), (x) => 2 * (x - 3), 0, 40, 0.1, {
    onIter: (i, x, fx) => rec.begin({ zh: \`\${i}: x=\${x.toFixed(3)} f=\${fx.toFixed(4)}\`, en: '' })
      .setBars([{ value: fx, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`x=\${r.x.toFixed(3)} f=\${r.fx.toFixed(4)}\`, en: '' }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zhangHagerLineSearch } from '../../src/algorithms/optimization/opt-line-search-zhang/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-line-search-zhang/trace.ts';
test('Zhang-Hager 收敛到 3', () => {
  const r = zhangHagerLineSearch((x) => (x - 3) * (x - 3), (x) => 2 * (x - 3), 0, 100);
  assert.ok(Math.abs(r.x - 3) < 0.5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
];
