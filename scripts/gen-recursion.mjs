// Generator for 23 recursion algorithms.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'recursion';
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
  const testDir = join(ROOT, 'test', CAT);
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: 'recursion',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// Hooks interface shared by all recursion impls
function hooksIface(iface, resultIface, hooksFields) {
  return `export interface ${iface} {
${hooksFields.map((f) => `  ${f}`).join('\n')}
}
export interface ${resultIface} { result: number | bigint | string; depth: number; calls: number; }`;
}

// Standard trace: snapshot initial, key recursive events (first few), final.
function recTrace(id, fnName, traceArgs, snapCall, extraNotes = '') {
  return `// ${id} · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ${fnName} } from './impl.ts';

export const DEFAULT_INPUT = ${traceArgs};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '${id}：开始递归', en: '${id}: start recursion' })
    .setAux([{ label: 'input', value: JSON.stringify(input), role: 'pivot' as BarRole }])
    .commit();
  const events: Array<{ note: { zh: string; en: string }; aux: Array<{ label: string; value: string; role?: BarRole }> }> = [];
  const r = ${snapCall};
  ${extraNotes}
  for (const ev of events) {
    rec.begin(ev.note).setAux(ev.aux).commit();
  }
  rec
    .begin({ zh: \`结果: \${r.result}, 最大深度 \${r.depth}, 调用 \${r.calls} 次\`, en: \`Result: \${r.result}, depth \${r.depth}, \${r.calls} calls\` })
    .setAux([
      { label: 'result', value: String(r.result), role: 'final' as BarRole },
      { label: 'depth', value: String(r.depth), role: 'compare' as BarRole },
      { label: 'calls', value: String(r.calls), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}`;
}

function recTest(id, fnName, callExpr, expected) {
  return `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ${fnName} } from '../../src/algorithms/recursion/${id}/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/${id}/trace.ts';

test('${id} 基本正确性', () => {
  const r = ${callExpr};
  assert.equal(r.result, ${expected});
});

test('${id} 调用次数 > 0', () => {
  const r = ${callExpr};
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
`;
}

// ---- 1. rec-multiply-rec (multiply via repeated addition) ----
writeAlg('rec-multiply-rec',
  meta('rec-multiply-rec', '递归乘法', 'Recursive Multiply',
    '递归实现 a×b = a + a×(b−1)，用加法替代乘法。', 'Recursive multiply: a×b = a + a×(b−1) using addition instead of multiplication.',
    '俄罗斯式/递归加法：以 b 为计数，每次递归把 b 减 1、把 a 累加。基线 b=0 返回 0。',
    'Recursive addition: with b as counter, each recursion decrements b and accumulates a. Base case b=0 returns 0.',
    'O(b)', 'O(b)', ['recursion', 'arithmetic']),
  `// 递归乘法 · 实现
export interface MultiplyHooks {
  onRecurse?: (depth: number, a: number, b: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface MultiplyResult { result: number; depth: number; calls: number; }
export function recMultiplyRec(a: number, b: number, hooks: MultiplyHooks = {}): MultiplyResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, x, y);
    if (y === 0) { hooks.onBase?.(depth); return 0; }
    const v = x + go(x, y - 1, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(a, b, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-multiply-rec', 'recMultiplyRec', '{ a: 6, b: 7 }',
    `recMultiplyRec(input.a, input.b, {
      onRecurse: (d, x, y) => events.push({ note: { zh: \`递归 d=\${d}: \${x}×\${y}\`, en: \`recurse d=\${d}: \${x}*\${y}\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }),
      onBase: (d) => events.push({ note: { zh: \`基线 d=\${d}: 返回 0\`, en: \`base d=\${d}: return 0\` }, aux: [] }),
      onReturn: (d, v) => events.push({ note: { zh: \`返回 d=\${d}: \${v}\`, en: \`return d=\${d}: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-multiply-rec', 'recMultiplyRec', 'recMultiplyRec(6, 7)', '42'),
);

// ---- 2. rec-power-rec-2 (a^b via repeated multiplication, integer power) ----
writeAlg('rec-power-rec-2',
  meta('rec-power-rec-2', '递归幂', 'Recursive Power (a^b)',
    '递归实现 a^b = a · a^(b−1)，整数幂。', 'Recursive power: a^b = a · a^(b−1) for integer exponent.',
    '递归幂：基线 b=0 返回 1；否则 a · a^(b−1)。',
    'Recursive power: base b=0 returns 1; otherwise a · a^(b−1).',
    'O(b)', 'O(b)', ['recursion', 'arithmetic']),
  `// 递归幂 · 实现
export interface PowerHooks {
  onRecurse?: (depth: number, a: number, b: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface PowerResult { result: number; depth: number; calls: number; }
export function recPowerRec2(a: number, b: number, hooks: PowerHooks = {}): PowerResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, x, y);
    if (y === 0) { hooks.onBase?.(depth); return 1; }
    const v = x * go(x, y - 1, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(a, b, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-power-rec-2', 'recPowerRec2', '{ a: 2, b: 10 }',
    `recPowerRec2(input.a, input.b, {
      onRecurse: (d, x, y) => events.push({ note: { zh: \`递归 d=\${d}: \${x}^\${y}\`, en: \`recurse d=\${d}: \${x}^\${y}\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }),
      onBase: (d) => events.push({ note: { zh: \`基线 d=\${d}: 返回 1\`, en: \`base d=\${d}: return 1\` }, aux: [] }),
      onReturn: (d, v) => events.push({ note: { zh: \`返回 d=\${d}: \${v}\`, en: \`return d=\${d}: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-power-rec-2', 'recPowerRec2', 'recPowerRec2(2, 10)', '1024'),
);

// ---- 3. rec-fib-rec (naive fibonacci) / 4. rec-fib-memo (memoized) ----
writeAlg('rec-fib-rec',
  meta('rec-fib-rec', '递归斐波那契', 'Recursive Fibonacci',
    '朴素递归 fib(n) = fib(n−1) + fib(n−2)，基线 fib(0)=0, fib(1)=1。', 'Naive recursive fibonacci: fib(n) = fib(n−1) + fib(n−2).',
    '朴素递归斐波那契：时间复杂度 O(φ^n)，重叠子问题指数爆炸，是动态规划的反面教材。',
    'Naive recursive fibonacci: O(φ^n) time, exponential overlapping subproblems; the canonical DP counterexample.',
    'O(φ^n)', 'O(n)', ['recursion', 'fibonacci', 'dp']),
  `// 递归斐波那契 · 实现
export interface FibHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface FibResult { result: number; depth: number; calls: number; }
export function recFibRec(n: number, hooks: FibHooks = {}): FibResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k <= 1) { hooks.onBase?.(depth, k); return k; }
    const v = go(k - 1, depth + 1) + go(k - 2, depth + 1);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-fib-rec', 'recFibRec', '{ n: 10 }',
    `recFibRec(input.n, {
      onRecurse: (d, k) => { if (events.length < 12) events.push({ note: { zh: \`递归 d=\${d}: fib(\${k})\`, en: \`recurse d=\${d}: fib(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => { if (events.length < 12) events.push({ note: { zh: \`基线 d=\${d}: \${v}\`, en: \`base d=\${d}: \${v}\` }, aux: [] }); },
      onReturn: (d, k, v) => { if (events.length < 12) events.push({ note: { zh: \`返回 d=\${d}: fib(\${k})=\${v}\`, en: \`return fib(\${k})=\${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`,
    '// 仅保留前 12 个事件以保持帧序列简洁'),
  recTest('rec-fib-rec', 'recFibRec', 'recFibRec(10)', '55'),
);

writeAlg('rec-fib-memo',
  meta('rec-fib-memo', '记忆化斐波那契', 'Memoized Fibonacci',
    '带记忆化的递归 fib：用缓存消除重叠子问题，降到 O(n)。', 'Memoized recursive fibonacci: cache eliminates overlapping subproblems, O(n).',
    '记忆化递归（自顶向下 DP）：memo[n] 缓存已算结果，每个 fib(k) 只算一次。',
    'Memoized recursion (top-down DP): memo[n] caches results; each fib(k) is computed only once.',
    'O(n)', 'O(n)', ['recursion', 'fibonacci', 'dp', 'memoization']),
  `// 记忆化斐波那契 · 实现
export interface FibMemoHooks {
  onRecurse?: (depth: number, n: number) => void;
  onCache?: (n: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface FibMemoResult { result: number; depth: number; calls: number; }
export function recFibMemo(n: number, hooks: FibMemoHooks = {}): FibMemoResult {
  const memo = new Map<number, number>();
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k <= 1) return k;
    const cached = memo.get(k);
    if (cached !== undefined) { hooks.onCache?.(k, cached); return cached; }
    const v = go(k - 1, depth + 1) + go(k - 2, depth + 1);
    memo.set(k, v);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-fib-memo', 'recFibMemo', '{ n: 20 }',
    `recFibMemo(input.n, {
      onRecurse: (d, k) => { if (events.length < 12) events.push({ note: { zh: \`递归 d=\${d}: fib(\${k})\`, en: \`recurse d=\${d}: fib(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onCache: (k, v) => events.push({ note: { zh: \`缓存命中 fib(\${k})=\${v}\`, en: \`cache hit fib(\${k})=\${v}\` }, aux: [{ label: 'hit', value: String(k), role: 'compare' as BarRole }] }),
      onReturn: (d, k, v) => { if (events.length < 12) events.push({ note: { zh: \`返回 fib(\${k})=\${v}\`, en: \`return fib(\${k})=\${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-fib-memo', 'recFibMemo', 'recFibMemo(20)', '6765'),
);

// ---- 5. rec-tribonacci-rec / 6. rec-lucas-rec / 7. rec-pell-rec ----
function linRec3Impl(id, fnName, name0, name1, name2, base0, base1, base2) {
  return `// ${id} · 实现
export interface RecHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface RecResult { result: number; depth: number; calls: number; }
export function ${fnName}(n: number, hooks: RecHooks = {}): RecResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k === 0) { hooks.onBase?.(depth, ${base0}); return ${base0}; }
    if (k === 1) { hooks.onBase?.(depth, ${base1}); return ${base1}; }
    if (k === 2) { hooks.onBase?.(depth, ${base2}); return ${base2}; }
    const v = go(k - 1, depth + 1) + go(k - 2, depth + 1) + go(k - 3, depth + 1);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}`;
}

writeAlg('rec-tribonacci-rec',
  meta('rec-tribonacci-rec', '递归泰波那契', 'Recursive Tribonacci',
    'T(n) = T(n−1)+T(n−2)+T(n−3)，基线 T(0)=0,T(1)=0,T(2)=1。', 'T(n) = T(n−1)+T(n−2)+T(n−3) with T(0)=0,T(1)=0,T(2)=1.',
    '泰波那契：三阶线性递推，时间复杂度 O(c^n)。',
    'Tribonacci: third-order linear recurrence, O(c^n) time.',
    'O(c^n)', 'O(n)', ['recursion', 'linear-recurrence']),
  linRec3Impl('rec-tribonacci-rec', 'recTribonacciRec', 'T0', 'T1', 'T2', '0', '0', '1'),
  recTrace('rec-tribonacci-rec', 'recTribonacciRec', '{ n: 8 }',
    `recTribonacciRec(input.n, {
      onRecurse: (d, k) => { if (events.length < 10) events.push({ note: { zh: \`递归 d=\${d}: T(\${k})\`, en: \`recurse T(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线 d=\${d}: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, k, v) => { if (events.length < 10) events.push({ note: { zh: \`返回 T(\${k})=\${v}\`, en: \`T(\${k})=\${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-tribonacci-rec', 'recTribonacciRec', 'recTribonacciRec(8)', '13'),
);

function linRec2Impl(id, fnName, base0, base1) {
  return `// ${id} · 实现
export interface RecHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface RecResult { result: number; depth: number; calls: number; }
export function ${fnName}(n: number, hooks: RecHooks = {}): RecResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k === 0) { hooks.onBase?.(depth, ${base0}); return ${base0}; }
    if (k === 1) { hooks.onBase?.(depth, ${base1}); return ${base1}; }
    const v = go(k - 1, depth + 1) + go(k - 2, depth + 1);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}`;
}

writeAlg('rec-lucas-rec',
  meta('rec-lucas-rec', '递归卢卡斯数', 'Recursive Lucas',
    'L(n) = L(n−1)+L(n−2)，基线 L(0)=2, L(1)=1。', 'L(n) = L(n−1)+L(n−2) with L(0)=2, L(1)=1.',
    '卢卡斯数列：与斐波那契同递推但基线不同。',
    'Lucas numbers: same recurrence as Fibonacci but different bases.',
    'O(φ^n)', 'O(n)', ['recursion', 'linear-recurrence']),
  linRec2Impl('rec-lucas-rec', 'recLucasRec', '2', '1'),
  recTrace('rec-lucas-rec', 'recLucasRec', '{ n: 8 }',
    `recLucasRec(input.n, {
      onRecurse: (d, k) => { if (events.length < 10) events.push({ note: { zh: \`递归 L(\${k})\`, en: \`recurse L(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, k, v) => { if (events.length < 10) events.push({ note: { zh: \`L(\${k})=\${v}\`, en: \`L(\${k})=\${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-lucas-rec', 'recLucasRec', 'recLucasRec(8)', '47'),
);

writeAlg('rec-pell-rec',
  meta('rec-pell-rec', '递归佩尔数', 'Recursive Pell',
    'P(n) = 2·P(n−1) + P(n−2)，基线 P(0)=0, P(1)=1。', 'P(n) = 2·P(n−1) + P(n−2) with P(0)=0, P(1)=1.',
    '佩尔数：系数为 2 的线性递推，比斐波那契增长更快。',
    'Pell numbers: linear recurrence with coefficient 2; grows faster than Fibonacci.',
    'O(c^n)', 'O(n)', ['recursion', 'linear-recurrence']),
  `// rec-pell-rec · 实现
export interface RecHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface RecResult { result: number; depth: number; calls: number; }
export function recPellRec(n: number, hooks: RecHooks = {}): RecResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k === 0) { hooks.onBase?.(depth, 0); return 0; }
    if (k === 1) { hooks.onBase?.(depth, 1); return 1; }
    const v = 2 * go(k - 1, depth + 1) + go(k - 2, depth + 1);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-pell-rec', 'recPellRec', '{ n: 7 }',
    `recPellRec(input.n, {
      onRecurse: (d, k) => { if (events.length < 10) events.push({ note: { zh: \`递归 P(\${k})\`, en: \`recurse P(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, k, v) => { if (events.length < 10) events.push({ note: { zh: \`P(\${k})=\${v}\`, en: \`P(\${k})=\${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-pell-rec', 'recPellRec', 'recPellRec(7)', '169'),
);

// ---- 8. rec-catalan-rec (Catalan via binomial sum) ----
writeAlg('rec-catalan-rec',
  meta('rec-catalan-rec', '递归卡塔兰数', 'Recursive Catalan',
    'C(n) = Σ_{i=0}^{n−1} C(i)·C(n−1−i)，基线 C(0)=1。', 'C(n) = Σ_{i=0}^{n−1} C(i)·C(n−1−i) with C(0)=1.',
    '卡塔兰数：组合数学经典序列，统计括号配对、二叉树形态等。',
    'Catalan numbers: classic combinatorial sequence counting bracket pairs, binary tree shapes, etc.',
    'O(4^n / √n)', 'O(n)', ['recursion', 'combinatorics', 'catalan']),
  `// 递归卡塔兰数 · 实现
export interface CatalanHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface CatalanResult { result: number; depth: number; calls: number; }
export function recCatalanRec(n: number, hooks: CatalanHooks = {}): CatalanResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k <= 1) { hooks.onBase?.(depth); return 1; }
    let sum = 0;
    for (let i = 0; i < k; i++) sum += go(i, depth + 1) * go(k - 1 - i, depth + 1);
    hooks.onReturn?.(depth, k, sum);
    return sum;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-catalan-rec', 'recCatalanRec', '{ n: 6 }',
    `recCatalanRec(input.n, {
      onRecurse: (d, k) => { if (events.length < 10) events.push({ note: { zh: \`递归 C(\${k})\`, en: \`recurse C(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d) => events.push({ note: { zh: \`基线 d=\${d}: 1\`, en: \`base: 1\` }, aux: [] }),
      onReturn: (d, k, v) => { if (events.length < 10) events.push({ note: { zh: \`C(\${k})=\${v}\`, en: \`C(\${k})=\${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-catalan-rec', 'recCatalanRec', 'recCatalanRec(6)', '132'),
);

// ---- 9. rec-sterling-rec (Stirling numbers of 2nd kind) ----
writeAlg('rec-sterling-rec',
  meta('rec-sterling-rec', '递归斯特林数', 'Recursive Stirling (2nd kind)',
    'S(n,k) = k·S(n−1,k) + S(n−1,k−1)。把 n 个不同元素分成 k 个非空子集的方法数。', 'S(n,k) = k·S(n−1,k) + S(n−1,k−1). Number of ways to partition n distinct elements into k non-empty subsets.',
    '第二类斯特林数：基线 S(0,0)=1, S(n,0)=0 (n>0), S(0,k)=0 (k>0)。',
    'Stirling numbers of the 2nd kind: bases S(0,0)=1, S(n,0)=0 (n>0), S(0,k)=0 (k>0).',
    'O(2^n)', 'O(n)', ['recursion', 'combinatorics', 'stirling']),
  `// 递归斯特林数（第二类）· 实现
export interface SterlingHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface SterlingResult { result: number; depth: number; calls: number; }
export function recSterlingRec(n: number, k: number, hooks: SterlingHooks = {}): SterlingResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (a === 0 && b === 0) { hooks.onBase?.(depth, 1); return 1; }
    if (a === 0 || b === 0) { hooks.onBase?.(depth, 0); return 0; }
    if (b > a) { hooks.onBase?.(depth, 0); return 0; }
    const v = b * go(a - 1, b, depth + 1) + go(a - 1, b - 1, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-sterling-rec', 'recSterlingRec', '{ n: 5, k: 3 }',
    `recSterlingRec(input.n, input.k, {
      onRecurse: (d, a, b) => { if (events.length < 10) events.push({ note: { zh: \`递归 S(\${a},\${b})\`, en: \`recurse S(\${a},\${b})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => { if (events.length < 10) events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-sterling-rec', 'recSterlingRec', 'recSterlingRec(5, 3)', '25'),
);

// ---- 10. rec-bell-rec (Bell numbers via Stirling sum) ----
writeAlg('rec-bell-rec',
  meta('rec-bell-rec', '递归贝尔数', 'Recursive Bell Numbers',
    'B(n) = Σ_{k=0}^{n} S(n,k)，n 个元素的划分数总数。', 'B(n) = Σ_{k=0}^{n} S(n,k). Total number of partitions of n elements.',
    '贝尔数：基线 B(0)=1；也可用 B(n+1)=Σ C(n,k)·B(k) 递推。',
    'Bell numbers: base B(0)=1; alternatively B(n+1)=Σ C(n,k)·B(k).',
    'O(n!)', 'O(n)', ['recursion', 'combinatorics', 'bell']),
  `// 递归贝尔数 · 实现（使用第二类斯特林数之和）
export interface BellHooks {
  onRecurse?: (depth: number, n: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface BellResult { result: number; depth: number; calls: number; }
export function recBellRec(n: number, hooks: BellHooks = {}): BellResult {
  let calls = 0;
  let maxDepth = 0;
  const sterling = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (a === 0 && b === 0) return 1;
    if (a === 0 || b === 0 || b > a) return 0;
    return b * sterling(a - 1, b, depth + 1) + sterling(a - 1, b - 1, depth + 1);
  };
  hooks.onRecurse?.(0, n);
  let sum = 0;
  for (let k = 0; k <= n; k++) sum += sterling(n, k, 1);
  hooks.onReturn?.(0, sum);
  return { result: sum, depth: maxDepth, calls };
}`,
  recTrace('rec-bell-rec', 'recBellRec', '{ n: 5 }',
    `recBellRec(input.n, {
      onRecurse: (d, n) => events.push({ note: { zh: \`计算 B(\${n})\`, en: \`compute B(\${n})\` }, aux: [{ label: 'n', value: String(n), role: 'pivot' as BarRole }] }),
      onReturn: (d, v) => events.push({ note: { zh: \`B(n)=\${v}\`, en: \`B(n)=\${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-bell-rec', 'recBellRec', 'recBellRec(5)', '52'),
);

// ---- 11. rec-partition-rec (integer partitions P(n,k)) ----
writeAlg('rec-partition-rec',
  meta('rec-partition-rec', '递归整数划分', 'Recursive Integer Partition',
    'P(n,k) = P(n−1,k−1) + P(n−k,k)。把 n 划分为 k 个正整数之和的方法数。', 'P(n,k) = P(n−1,k−1) + P(n−k,k). Ways to write n as sum of k positive integers.',
    '整数划分：基线 P(n,1)=1, P(n,n)=1, P(n,k)=0 (k>n 或 k=0,n>0)。',
    'Integer partition: bases P(n,1)=1, P(n,n)=1, P(n,k)=0 (k>n or k=0,n>0).',
    'O(2^n)', 'O(n)', ['recursion', 'combinatorics', 'partition']),
  `// 递归整数划分 · 实现
export interface PartitionHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface PartitionResult { result: number; depth: number; calls: number; }
export function recPartitionRec(n: number, k: number, hooks: PartitionHooks = {}): PartitionResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (a === 0) { hooks.onBase?.(depth, 1); return 1; }
    if (b === 0 || a < 0) { hooks.onBase?.(depth, 0); return 0; }
    const v = go(a, b - 1, depth + 1) + go(a - b, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-partition-rec', 'recPartitionRec', '{ n: 6, k: 3 }',
    `recPartitionRec(input.n, input.k, {
      onRecurse: (d, a, b) => { if (events.length < 10) events.push({ note: { zh: \`递归 P(\${a},\${b})\`, en: \`recurse P(\${a},\${b})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => { if (events.length < 10) events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-partition-rec', 'recPartitionRec', 'recPartitionRec(6, 3)', '3'),
);

// ---- 12. rec-composition-rec (ordered integer compositions) ----
writeAlg('rec-composition-rec',
  meta('rec-composition-rec', '递归组合（有序划分）', 'Recursive Composition',
    '把 n 写成 k 个正整数之和（顺序不同算不同方法）。comp(n,k) = comp(n−1,k−1) + comp(n−k,k)。', 'Write n as sum of k positive integers where order matters. comp(n,k) = comp(n−1,k−1) + comp(n−k,k).',
    '组合（有序划分）：与无序的整数划分不同，1+2 和 2+1 算两种。基线 comp(0,0)=1，comp(n,0)=0 (n>0)，comp(n,k)=0 (k>n)。',
    'Composition (ordered partition): unlike unordered integer partitions, 1+2 and 2+1 are distinct. Bases comp(0,0)=1, comp(n,0)=0 (n>0), comp(n,k)=0 (k>n).',
    'O(2^n)', 'O(n)', ['recursion', 'combinatorics', 'composition']),
  `// 递归组合（有序整数划分）· 实现
export interface CompHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface CompResult { result: number; depth: number; calls: number; }
export function recCompositionRec(n: number, k: number, hooks: CompHooks = {}): CompResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0) { const v = a === 0 ? 1 : 0; hooks.onBase?.(depth, v); return v; }
    if (b < 0 || a < b) { hooks.onBase?.(depth, 0); return 0; }
    const v = go(a - 1, b - 1, depth + 1) + go(a - b, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-composition-rec', 'recCompositionRec', '{ n: 6, k: 3 }',
    `recCompositionRec(input.n, input.k, {
      onRecurse: (d, a, b) => { if (events.length < 10) events.push({ note: { zh: \`递归 comp(\${a},\${b})\`, en: \`recurse comp(\${a},\${b})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => { if (events.length < 10) events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-composition-rec', 'recCompositionRec', 'recCompositionRec(6, 3)', '10'),
);

// ---- 12b. rec-combination-rec (binomial coefficient via Pascal) ----
writeAlg('rec-combination-rec',
  meta('rec-combination-rec', '递归二项式系数', 'Recursive Binomial Coefficient',
    '用帕斯卡递推 C(n,k)=C(n−1,k−1)+C(n−1,k) 递归计算二项式系数。', 'Compute binomial coefficient via Pascal recurrence C(n,k)=C(n−1,k−1)+C(n−1,k).',
    '二项式系数（n 选 k）：基线 C(n,0)=C(n,n)=1。展示组合数学最基本的递推关系——帕斯卡三角。',
    'Binomial coefficient (n choose k): bases C(n,0)=C(n,n)=1. Illustrates the most fundamental combinatorial recurrence — Pascal triangle.',
    'O(2^n)', 'O(n)', ['recursion', 'combinatorics', 'binomial']),
  `// 递归二项式系数 · 实现
export interface CombHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface CombResult { result: number; depth: number; calls: number; }
export function recCombinationRec(n: number, k: number, hooks: CombHooks = {}): CombResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0 || b === a) { hooks.onBase?.(depth, 1); return 1; }
    if (b > a || b < 0) { hooks.onBase?.(depth, 0); return 0; }
    const v = go(a - 1, b - 1, depth + 1) + go(a - 1, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-combination-rec', 'recCombinationRec', '{ n: 6, k: 3 }',
    `recCombinationRec(input.n, input.k, {
      onRecurse: (d, a, b) => { if (events.length < 10) events.push({ note: { zh: \`递归 C(\${a},\${b})\`, en: \`recurse C(\${a},\${b})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => { if (events.length < 10) events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-combination-rec', 'recCombinationRec', 'recCombinationRec(6, 3)', '20'),
);

// ---- 13. rec-permutation-rec (P(n,k)) ----
writeAlg('rec-permutation-rec',
  meta('rec-permutation-rec', '递归排列数', 'Recursive Permutation (P(n,k))',
    'P(n,k) = n · P(n−1, k−1)。从 n 中选 k 个的有序排列数。', 'P(n,k) = n · P(n−1, k−1). Ordered arrangements of k from n.',
    '排列数：P(n,k) = n!/(n−k)!，基线 P(n,0)=1。',
    'Permutation count: P(n,k) = n!/(n−k)!, base P(n,0)=1.',
    'O(k)', 'O(k)', ['recursion', 'combinatorics', 'permutation']),
  `// 递归排列数 · 实现
export interface PermHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface PermResult { result: number; depth: number; calls: number; }
export function recPermutationRec(n: number, k: number, hooks: PermHooks = {}): PermResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0) { hooks.onBase?.(depth); return 1; }
    const v = a * go(a - 1, b - 1, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-permutation-rec', 'recPermutationRec', '{ n: 6, k: 3 }',
    `recPermutationRec(input.n, input.k, {
      onRecurse: (d, a, b) => events.push({ note: { zh: \`递归 P(\${a},\${b})\`, en: \`recurse P(\${a},\${b})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }),
      onBase: (d) => events.push({ note: { zh: \`基线 d=\${d}: 1\`, en: \`base: 1\` }, aux: [] }),
      onReturn: (d, v) => events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-permutation-rec', 'recPermutationRec', 'recPermutationRec(6, 3)', '120'),
);

// ---- 14. rec-subset-rec (count subsets of size k) - same as combination but framed differently ----
writeAlg('rec-subset-rec',
  meta('rec-subset-rec', '递归子集计数', 'Recursive Subset Count',
    '子集数：S(n,k) = S(n−1,k−1) + S(n−1,k)。从 n 元素中选大小为 k 的子集。', 'Subset count: S(n,k) = S(n−1,k−1) + S(n−1,k). Subsets of size k from n elements.',
    '子集计数：与组合数同递推，但侧重「选/不选」决策树视角。',
    'Subset counting: same recurrence as binomial but framed as a choose/skip decision tree.',
    'O(2^n)', 'O(n)', ['recursion', 'combinatorics', 'subset']),
  `// 递归子集计数 · 实现（决策树视角：第 n 个元素 选 / 不选）
export interface SubsetHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface SubsetResult { result: number; depth: number; calls: number; }
export function recSubsetRec(n: number, k: number, hooks: SubsetHooks = {}): SubsetResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (b === 0) { hooks.onBase?.(depth, 1); return 1; }
    if (a < b) { hooks.onBase?.(depth, 0); return 0; }
    // 选第 a 个 + 不选第 a 个
    const v = go(a - 1, b - 1, depth + 1) + go(a - 1, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-subset-rec', 'recSubsetRec', '{ n: 5, k: 2 }',
    `recSubsetRec(input.n, input.k, {
      onRecurse: (d, a, b) => { if (events.length < 10) events.push({ note: { zh: \`决策 a=\${a}, k=\${b}\`, en: \`decide a=\${a} k=\${b}\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => { if (events.length < 10) events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-subset-rec', 'recSubsetRec', 'recSubsetRec(5, 2)', '10'),
);

// ---- 15. rec-tower-4peg / 16. rec-tower-3peg (Hanoi) ----
function hanoiImpl(id, fnName, pegs) {
  return `// ${id} · 实现（${pegs}柱汉诺塔）
export interface HanoiHooks {
  onMove?: (depth: number, disk: number, from: number, to: number) => void;
  onBase?: (depth: number, disk: number, from: number, to: number) => void;
}
export interface HanoiResult { result: string; depth: number; calls: number; moves: Array<[number, number, number]>; }
export function ${fnName}(n: number, hooks: HanoiHooks = {}): HanoiResult {
  let calls = 0;
  let maxDepth = 0;
  const moves: Array<[number, number, number]> = [];
  ${pegs === 3
    ? `const go = (k: number, from: number, to: number, via: number, depth: number): void => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (k === 1) { moves.push([k, from, to]); hooks.onBase?.(depth, k, from, to); return; }
    go(k - 1, from, via, to, depth + 1);
    moves.push([k, from, to]);
    hooks.onMove?.(depth, k, from, to);
    go(k - 1, via, to, from, depth + 1);
  };
  go(n, 0, 2, 1, 0);`
    : `// Frame-Stewart algorithm (4 pegs), 2k−1 split heuristic
  const go = (k: number, pegs: number[], target: number, depth: number): void => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (k === 0) return;
    if (k === 1) { moves.push([1, pegs[0]!, target]); hooks.onBase?.(depth, 1, pegs[0]!, target); return; }
    if (pegs.length === 3) {
      const via = pegs.find((p) => p !== pegs[0]! && p !== target)!;
      go(k - 1, [pegs[0]!], [via], depth + 1);
      moves.push([k, pegs[0]!, target]);
      hooks.onMove?.(depth, k, pegs[0]!, target);
      return;
    }
    const m = Math.floor(k / 2);
    const aux = pegs.filter((p) => p !== pegs[0]! && p !== target)[0]!;
    go(m, pegs, [aux], depth + 1);
    go(k - m, [pegs[0]!], pegs.filter((p) => p !== aux), depth + 1);
    go(m, [aux], pegs.filter((p) => p !== pegs[0]!).concat([target]).slice(0, pegs.length), depth + 1);
  };
  go(n, [0, 1, 2, 3], 3, 0);`}
  return { result: \`\${moves.length} moves\`, depth: maxDepth, calls, moves };
}`;
}

writeAlg('rec-tower-3peg',
  meta('rec-tower-3peg', '3柱汉诺塔', 'Tower of Hanoi (3 pegs)',
    '经典汉诺塔：T(n)=2·T(n−1)+1，最少 2^n−1 步。', 'Classic Hanoi: T(n)=2·T(n−1)+1, minimum 2^n−1 moves.',
    '三柱汉诺塔：递归把 n−1 个盘搬到辅助柱，最大盘搬到目标柱，再把 n−1 个盘搬过来。',
    'Three-peg Hanoi: recursively move n−1 disks to aux, largest to target, then n−1 from aux to target.',
    'O(2^n)', 'O(n)', ['recursion', 'classic', 'hanoi']),
  hanoiImpl('rec-tower-3peg', 'recTower3peg', 3),
  `// rec-tower-3peg · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recTower3peg } from './impl.ts';
export const DEFAULT_INPUT = { n: 3 };
export function buildTrace(input: { n?: number } = {}): Frame[] {
  const { n = 3 } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '3柱汉诺塔开始', en: '3-peg Hanoi start' }).commit();
  const events: Array<{ note: { zh: string; en: string }; aux: Array<{ label: string; value: string; role?: BarRole }> }> = [];
  const r = recTower3peg(n, {
    onMove: (d, disk, from, to) => events.push({ note: { zh: \`移动盘 \${disk}: \${from}→\${to}\`, en: \`move disk \${disk}: \${from}->\${to}\` }, aux: [{ label: 'disk', value: String(disk), role: 'pivot' as BarRole }, { label: 'from', value: String(from), role: 'compare' as BarRole }, { label: 'to', value: String(to), role: 'final' as BarRole }] }),
    onBase: (d, disk, from, to) => events.push({ note: { zh: \`基线: 盘 \${disk} \${from}→\${to}\`, en: \`base: disk \${disk} \${from}->\${to}\` }, aux: [] }),
  });
  for (const ev of events) rec.begin(ev.note).setAux(ev.aux).commit();
  rec.begin({ zh: \`完成，共 \${r.moves.length} 步\`, en: \`Done in \${r.moves.length} moves\` })
    .setAux([{ label: 'moves', value: String(r.moves.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recTower3peg } from '../../src/algorithms/recursion/rec-tower-3peg/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-tower-3peg/trace.ts';
test('tower-3peg 步数 = 2^n - 1', () => {
  const r = recTower3peg(4);
  assert.equal(r.moves.length, 15);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('rec-tower-4peg',
  meta('rec-tower-4peg', '4柱汉诺塔', 'Reve\'s Puzzle (4 pegs)',
    '4柱汉诺塔（Reve 难题）：Frame-Stewart 算法，比 2^n−1 更少步数。', '4-peg Hanoi (Reve puzzle): Frame-Stewart algorithm uses fewer moves than 2^n−1.',
    '四柱汉诺塔：用 Frame-Stewart 启发式，把盘子分成两部分，借助多出的柱子降低步数上限。',
    'Four-peg Hanoi: Frame-Stewart heuristic splits disks to exploit the extra peg and reduce move count.',
    'O(2^(√n))', 'O(n)', ['recursion', 'classic', 'hanoi', 'frame-stewart']),
  hanoiImpl('rec-tower-4peg', 'recTower4peg', 4),
  `// rec-tower-4peg · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recTower4peg } from './impl.ts';
export const DEFAULT_INPUT = { n: 4 };
export function buildTrace(input: { n?: number } = {}): Frame[] {
  const { n = 4 } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '4柱汉诺塔开始', en: '4-peg Hanoi start' }).commit();
  const r = recTower4peg(n);
  rec.begin({ zh: \`完成，共 \${r.moves.length} 步\`, en: \`Done in \${r.moves.length} moves\` })
    .setAux([
      { label: 'moves', value: String(r.moves.length), role: 'final' as BarRole },
      { label: 'depth', value: String(r.depth), role: 'compare' as BarRole },
    ]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recTower4peg } from '../../src/algorithms/recursion/rec-tower-4peg/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-tower-4peg/trace.ts';
test('tower-4peg 生成步数', () => {
  const r = recTower4peg(3);
  assert.ok(r.moves.length >= 1);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// ---- 17. rec-ackermann-3 (classic 3-arg Ackermann) ----
writeAlg('rec-ackermann-3',
  meta('rec-ackermann-3', '阿克曼函数', 'Ackermann Function',
    'A(m,n)：经典的非原始递归函数，增长极快。基线 A(0,n)=n+1。', 'A(m,n): classic non-primitive-recursive function with explosive growth. Base A(0,n)=n+1.',
    '阿克曼函数：A(0,n)=n+1；A(m,0)=A(m−1,1)；A(m,n)=A(m−1,A(m,n−1))。是计算理论的重要例子。',
    'Ackermann: A(0,n)=n+1; A(m,0)=A(m−1,1); A(m,n)=A(m−1,A(m,n−1)). A key example in computability theory.',
    'O(A(m,n))', 'O(m)', ['recursion', 'theory', 'ackermann']),
  `// 阿克曼函数 · 实现
export interface AckermannHooks {
  onRecurse?: (depth: number, m: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface AckermannResult { result: number; depth: number; calls: number; }
export function recAckermann3(m: number, n: number, hooks: AckermannHooks = {}): AckermannResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (a === 0) { const v = b + 1; hooks.onBase?.(depth, v); return v; }
    if (b === 0) { const v = go(a - 1, 1, depth + 1); hooks.onReturn?.(depth, v); return v; }
    const inner = go(a, b - 1, depth + 1);
    const v = go(a - 1, inner, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(m, n, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-ackermann-3', 'recAckermann3', '{ m: 2, n: 3 }',
    `recAckermann3(input.m, input.n, {
      onRecurse: (d, a, b) => { if (events.length < 10) events.push({ note: { zh: \`递归 A(\${a},\${b})\`, en: \`recurse A(\${a},\${b})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => { if (events.length < 10) events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-ackermann-3', 'recAckermann3', 'recAckermann3(2, 3)', '9'),
);

// ---- 18. rec-mccarthy-2 (McCarthy 91 function) ----
writeAlg('rec-mccarthy-2',
  meta('rec-mccarthy-2', 'McCarthy 91', 'McCarthy 91 Function',
    'M(n) = n−10 (n>100), 否则 M(M(n+11))。对 n≤100 总返回 91。', 'M(n) = n−10 (n>100), else M(M(n+11)). Always returns 91 for n≤100.',
    'McCarthy 91 函数：递归理论反直觉经典——所有 n≤100 都映射到 91。',
    'McCarthy 91 function: a counterintuitive recursion-theory classic — every n≤100 maps to 91.',
    'O(n)', 'O(n)', ['recursion', 'theory', 'mccarthy']),
  `// McCarthy 91 · 实现
export interface MccarthyHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface MccarthyResult { result: number; depth: number; calls: number; }
export function recMccarthy2(n: number, hooks: MccarthyHooks = {}): MccarthyResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k > 100) { const v = k - 10; hooks.onBase?.(depth, v); return v; }
    const v = go(go(k + 11, depth + 1), depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-mccarthy-2', 'recMccarthy2', '{ n: 50 }',
    `recMccarthy2(input.n, {
      onRecurse: (d, k) => { if (events.length < 10) events.push({ note: { zh: \`M(\${k})\`, en: \`M(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }); },
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => { if (events.length < 10) events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }); },
    })`),
  recTest('rec-mccarthy-2', 'recMccarthy2', 'recMccarthy2(50)', '91'),
);

// ---- 19. rec-gcd-rec-2 / 20. rec-lcm-rec ----
writeAlg('rec-gcd-rec-2',
  meta('rec-gcd-rec-2', '递归最大公约数', 'Recursive GCD (Euclid)',
    '欧几里得算法：gcd(a,b) = gcd(b, a mod b)，基线 gcd(a,0)=a。', 'Euclidean algorithm: gcd(a,b) = gcd(b, a mod b), base gcd(a,0)=a.',
    '递归欧几里得：每一轮用模运算把问题规模缩小到一半以下，对数时间复杂度。',
    'Recursive Euclid: modular reduction halves the problem each round; logarithmic time.',
    'O(log(min(a,b)))', 'O(log n)', ['recursion', 'number-theory', 'gcd']),
  `// 递归最大公约数 · 实现
export interface GcdHooks {
  onRecurse?: (depth: number, a: number, b: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface GcdResult { result: number; depth: number; calls: number; }
export function recGcdRec2(a: number, b: number, hooks: GcdHooks = {}): GcdResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, x, y);
    if (y === 0) { hooks.onBase?.(depth, x); return x; }
    const v = go(y, x % y, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(a, b, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-gcd-rec-2', 'recGcdRec2', '{ a: 48, b: 36 }',
    `recGcdRec2(input.a, input.b, {
      onRecurse: (d, x, y) => events.push({ note: { zh: \`gcd(\${x},\${y})\`, en: \`gcd(\${x},\${y})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }),
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-gcd-rec-2', 'recGcdRec2', 'recGcdRec2(48, 36)', '12'),
);

writeAlg('rec-lcm-rec',
  meta('rec-lcm-rec', '递归最小公倍数', 'Recursive LCM',
    'lcm(a,b) = a·b / gcd(a,b)，递归求 gcd 后算 lcm。', 'lcm(a,b) = a·b / gcd(a,b); recursively compute gcd then derive lcm.',
    '最小公倍数：依赖 gcd 的欧几里得递归，再做一次除法。',
    'Least common multiple: builds on recursive Euclid gcd, then one division.',
    'O(log(min(a,b)))', 'O(log n)', ['recursion', 'number-theory', 'lcm']),
  `// 递归最小公倍数 · 实现
export interface LcmHooks {
  onGcd?: (depth: number, a: number, b: number) => void;
  onReturn?: (value: number) => void;
}
export interface LcmResult { result: number; depth: number; calls: number; }
export function recLcmRec(a: number, b: number, hooks: LcmHooks = {}): LcmResult {
  let calls = 0;
  let maxDepth = 0;
  const gcd = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onGcd?.(depth, x, y);
    if (y === 0) return x;
    return gcd(y, x % y, depth + 1);
  };
  const g = gcd(a, b, 0);
  const result = (a / g) * b;
  hooks.onReturn?.(result);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-lcm-rec', 'recLcmRec', '{ a: 12, b: 18 }',
    `recLcmRec(input.a, input.b, {
      onGcd: (d, x, y) => events.push({ note: { zh: \`gcd(\${x},\${y})\`, en: \`gcd(\${x},\${y})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }),
      onReturn: (v) => events.push({ note: { zh: \`lcm = \${v}\`, en: \`lcm = \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-lcm-rec', 'recLcmRec', 'recLcmRec(12, 18)', '36'),
);

// ---- 21. rec-mod-rec (a mod b recursively) ----
writeAlg('rec-mod-rec',
  meta('rec-mod-rec', '递归取模', 'Recursive Modulo',
    'a mod b：递归从 a 中减 b 直到 a < b。', 'a mod b: recursively subtract b from a until a < b.',
    '递归取模：通过反复减法实现，演示取模的本质。',
    'Recursive modulo: implemented by repeated subtraction to reveal the essence of mod.',
    'O(a/b)', 'O(a/b)', ['recursion', 'arithmetic']),
  `// 递归取模 · 实现
export interface ModHooks {
  onRecurse?: (depth: number, a: number, b: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface ModResult { result: number; depth: number; calls: number; }
export function recModRec(a: number, b: number, hooks: ModHooks = {}): ModResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, x, y);
    if (x < y) { hooks.onBase?.(depth, x); return x; }
    const v = go(x - y, y, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(a, b, 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-mod-rec', 'recModRec', '{ a: 17, b: 5 }',
    `recModRec(input.a, input.b, {
      onRecurse: (d, x, y) => events.push({ note: { zh: \`mod(\${x},\${y})\`, en: \`mod(\${x},\${y})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }),
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-mod-rec', 'recModRec', 'recModRec(17, 5)', '2'),
);

// ---- 22-23. rec-digits-rec (sum digits) ----
writeAlg('rec-digits-rec',
  meta('rec-digits-rec', '递归数字求和', 'Recursive Digit Sum',
    '递归求整数各位数字之和：基线 n<10 返回 n。', 'Recursively sum digits of an integer; base n<10 returns n.',
    '数字求和：每次取最低位 n%10 加上 n/10 的递归结果。',
    'Digit sum: each step adds n%10 to the recursive result on n/10.',
    'O(log n)', 'O(log n)', ['recursion', 'arithmetic', 'digits']),
  `// 递归数字求和 · 实现
export interface DigitsHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface DigitsResult { result: number; depth: number; calls: number; }
export function recDigitsRec(n: number, hooks: DigitsHooks = {}): DigitsResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k < 10) { hooks.onBase?.(depth, k); return k; }
    const v = (k % 10) + go(Math.floor(k / 10), depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(Math.abs(Math.floor(n)), 0);
  return { result, depth: maxDepth, calls };
}`,
  recTrace('rec-digits-rec', 'recDigitsRec', '{ n: 12345 }',
    `recDigitsRec(input.n, {
      onRecurse: (d, k) => events.push({ note: { zh: \`sumDigits(\${k})\`, en: \`sumDigits(\${k})\` }, aux: [{ label: 'd', value: String(d), role: 'pivot' as BarRole }] }),
      onBase: (d, v) => events.push({ note: { zh: \`基线: \${v}\`, en: \`base: \${v}\` }, aux: [] }),
      onReturn: (d, v) => events.push({ note: { zh: \`返回: \${v}\`, en: \`return: \${v}\` }, aux: [{ label: 'val', value: String(v), role: 'compare' as BarRole }] }),
    })`),
  recTest('rec-digits-rec', 'recDigitsRec', 'recDigitsRec(12345)', '15'),
);

console.log('generated all 23 recursion algorithms');
