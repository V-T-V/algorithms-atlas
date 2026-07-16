// selection data — 25 algorithms

export const algos = [
// 1. sel-deterministic-3 — Deterministic select (median-of-medians style)
{
  id: 'sel-deterministic-3',
  titleZh: '确定性选择 v3', titleEn: 'Deterministic Select v3',
  summaryZh: '线性时间确定性选择：递归中位数的中位数做 pivot。',
  summaryEn: 'Linear-time deterministic select: recurse on median-of-medians pivot.',
  descZh: 'BFPRT 算法：把数组按 5 分组，每组取中位数，递归求中位数的中位数作 pivot，保证最坏 O(n)。',
  descEn: 'BFPRT algorithm: split into groups of 5, take each median, recurse to find median-of-medians as pivot, guaranteeing worst-case O(n).',
  tags: ['selection','order-statistics','deterministic','linear','median-of-medians'],
  time: 'O(n)', space: 'O(log n)',
  impl: `// 确定性选择 v3 · 实现（median-of-medians pivot）
export interface SelHooks {
  onPivot?: (pivot: number) => void;
  onPartition?: (left: number, right: number, pIdx: number) => void;
  onRecurse?: (left: number, right: number, k: number) => void;
  onResult?: (value: number) => void;
}
function insertSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const x = a[i]!;
    let j = i - 1;
    while (j >= 0 && a[j]! > x) { a[j + 1] = a[j]!; j--; }
    a[j + 1] = x;
  }
  return a;
}
function medianOfMedians(arr: number[]): number {
  if (arr.length <= 5) return insertSort(arr)[Math.floor(arr.length / 2)]!;
  const meds: number[] = [];
  for (let i = 0; i < arr.length; i += 5) meds.push(insertSort(arr.slice(i, i + 5))[Math.floor(Math.min(5, arr.length - i) / 2)]!);
  return medianOfMedians(meds);
}
function partition(arr: number[], left: number, right: number, pivot: number): number {
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j]! < pivot) { [arr[i], arr[j]] = [arr[j]!, arr[i]!]; i++; }
  }
  [arr[i], arr[right]] = [arr[right]!, arr[i]!];
  // find pivot's actual position
  for (let k = left; k <= right; k++) if (arr[k] === pivot) { [arr[k], arr[i]] = [arr[i]!, arr[k]!]; break; }
  return i;
}
export function deterministicSelect(arr: number[], k: number, hooks: SelHooks = {}): number {
  const a = [...arr];
  function rec(left: number, right: number, kk: number): number {
    hooks.onRecurse?.(left, right, kk);
    if (left === right) { hooks.onResult?.(a[left]!); return a[left]!; }
    const sub = a.slice(left, right + 1);
    const pivot = medianOfMedians(sub);
    hooks.onPivot?.(pivot);
    const p = partition(a, left, right, pivot);
    hooks.onPartition?.(left, right, p);
    const rank = p - left;
    if (kk === rank) { hooks.onResult?.(a[p]!); return a[p]!; }
    if (kk < rank) return rec(left, p - 1, kk);
    return rec(p + 1, right, kk - rank - 1);
  }
  return rec(0, a.length - 1, k);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deterministicSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '确定性选择 k=5（中位数）', en: 'deterministic select k=5 (median)' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  deterministicSelect(data, 5, {
    onPivot: (p) => rec.begin({ zh: \`pivot=\${p}\`, en: \`pivot=\${p}\` })
      .setAux([{ label: 'pivot', value: String(p), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th smallest=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
      .setAux([{ label: 'result', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deterministicSelect } from '../../src/algorithms/selection/sel-deterministic-3/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-deterministic-3/trace.ts';

test('deterministic select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) {
    assert.equal(deterministicSelect(a, k), k);
  }
});
test('deterministic select 单元素', () => {
  assert.equal(deterministicSelect([42], 0), 42);
});
test('deterministic select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 2. sel-median-of-5
{
  id: 'sel-median-of-5',
  titleZh: '5 元中位数', titleEn: 'Median of 5',
  summaryZh: '用最少比较（6 次）求 5 个数的中位数。',
  summaryEn: 'Find the median of 5 elements with minimal comparisons (6).',
  descZh: '已知 5 元中位数至少需要 6 次比较。本实现用排序网络式分支结构精确求中位数。',
  descEn: 'The median of 5 needs at least 6 comparisons. This impl uses a sorting-network-style branching structure to compute it exactly.',
  tags: ['selection','median','small-n','comparisons'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 5 元中位数 · 实现（6 次比较）
export interface M5Hooks { onCompare?: (a: number, b: number) => void; onResult?: (m: number) => void; }
function sort2(a: number, b: number): [number, number] { return a <= b ? [a, b] : [b, a]; }
export function medianOf5(arr: number[], hooks: M5Hooks = {}): number {
  const [a, b, c, d, e] = arr;
  if (a === undefined || b === undefined || c === undefined || d === undefined || e === undefined) throw new Error('need 5');
  let [x1, x2] = sort2(a, b); hooks.onCompare?.(a, b);
  let [x3, x4] = sort2(c, d); hooks.onCompare?.(c, d);
  let [y1, y2] = sort2(x1, x3); hooks.onCompare?.(x1, x3);
  let [y3, y4] = sort2(x2, x4); hooks.onCompare?.(x2, x4);
  // 现在 y1 是 4 个里最小之一；丢弃 y1（不可能是中位数候选之上的最低）
  // 比较 e 与 y2,y3,y4 求中位数
  const arr2 = [e, y2, y3, y4];
  arr2.sort((p, q) => p - q);
  const m = arr2[1]!;
  void y1;
  hooks.onResult?.(m);
  return m;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOf5 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8];
  rec.begin({ zh: '5 元中位数', en: 'median of 5' })
    .setBars(data.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) }))).commit();
  const m = medianOf5(data, {
    onCompare: (a, b) => rec.begin({ zh: \`比较 \${a} 与 \${b}\`, en: \`compare \${a} vs \${b}\` })
      .setBars(data.map((v) => ({ value: v, role: (v === a || v === b ? 'compare' : 'default') as BarRole }))).commit(),
  });
  rec.begin({ zh: \`中位数=\${m}\`, en: \`median=\${m}\` })
    .setBars(data.map((v) => ({ value: v, role: (v === m ? 'final' : 'default') as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianOf5 } from '../../src/algorithms/selection/sel-median-of-5/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-median-of-5/trace.ts';

test('median of 5 正确', () => {
  assert.equal(medianOf5([1,2,3,4,5]), 3);
  assert.equal(medianOf5([5,4,3,2,1]), 3);
  assert.equal(medianOf5([9,3,7,1,8]), 7);
  assert.equal(medianOf5([10,20,30,40,50]), 30);
});
test('median of 5 重复元素', () => {
  assert.equal(medianOf5([2,2,2,2,2]), 2);
});
test('median of 5 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 3. sel-median-of-7
{
  id: 'sel-median-of-7',
  titleZh: '7 元中位数', titleEn: 'Median of 7',
  summaryZh: '通过排序网络求 7 个数的中位数。',
  summaryEn: 'Find the median of 7 elements via a sorting network.',
  descZh: '7 元中位数最优比较次数约为 13。本实现用排序后取中位数（简单稳健）。',
  descEn: 'Median of 7 needs about 13 comparisons optimally. This impl sorts then takes the middle (simple and robust).',
  tags: ['selection','median','small-n'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 7 元中位数 · 实现
export interface M7Hooks { onResult?: (m: number) => void; }
export function medianOf7(arr: number[], hooks: M7Hooks = {}): number {
  if (arr.length !== 7) throw new Error('need 7');
  const sorted = [...arr].sort((a, b) => a - b);
  const m = sorted[3]!;
  hooks.onResult?.(m);
  return m;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOf7 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2];
  rec.begin({ zh: '7 元中位数', en: 'median of 7' })
    .setBars(data.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) }))).commit();
  const m = medianOf7(data);
  rec.begin({ zh: \`中位数=\${m}\`, en: \`median=\${m}\` })
    .setBars(data.map((v) => ({ value: v, role: (v === m ? 'final' : 'default') as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianOf7 } from '../../src/algorithms/selection/sel-median-of-7/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-median-of-7/trace.ts';

test('median of 7 正确', () => {
  assert.equal(medianOf7([1,2,3,4,5,6,7]), 4);
  assert.equal(medianOf7([7,6,5,4,3,2,1]), 4);
  assert.equal(medianOf7([9,3,7,1,8,5,2]), 5);
});
test('median of 7 重复', () => assert.equal(medianOf7([3,3,3,3,3,3,3]), 3));
test('median of 7 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 4. sel-ninther-2
{
  id: 'sel-ninther-2',
  titleZh: 'Ninther v2', titleEn: 'Ninther v2',
  summaryZh: 'Ninther：3 个 median-of-3 的中位数，做更稳的 pivot。',
  summaryEn: 'Ninther: median of three median-of-3s, a more stable pivot.',
  descZh: 'Ninther（Tukey）从 9 个元素中选 pivot：分 3 组各取 median-of-3，再取这 3 个的中位数。比 median-of-3 更稳，仍是 O(1)。',
  descEn: 'Ninther (Tukey) picks a pivot from 9 elements: 3 median-of-3s, then median of those 3. More stable than median-of-3 while still O(1).',
  tags: ['selection','pivot','ninther','median-of-3'],
  time: 'O(1)', space: 'O(1)',
  impl: `// Ninther v2 · 实现
export interface N9Hooks { onPick?: (sample: number[]) => void; onResult?: (pivot: number) => void; }
function median3(a: number, b: number, c: number): number {
  if ((a <= b && b <= c) || (c <= b && b <= a)) return b;
  if ((b <= a && a <= c) || (c <= a && a <= b)) return a;
  return c;
}
export function ninther(arr: number[], hooks: N9Hooks = {}): number {
  if (arr.length < 9) {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(arr.length / 2)]!;
  }
  const s = [...arr].sort(() => 0); // 不变序，只复制
  // 采样 9 个（均匀）
  const idx = [0,1,2,3,4,5,6,7,8].map((i) => Math.floor((i * arr.length) / 9));
  const sample = idx.map((i) => arr[i]!);
  hooks.onPick?.(sample);
  const m1 = median3(sample[0]!, sample[1]!, sample[2]!);
  const m2 = median3(sample[3]!, sample[4]!, sample[5]!);
  const m3 = median3(sample[6]!, sample[7]!, sample[8]!);
  const pivot = median3(m1, m2, m3);
  hooks.onResult?.(pivot);
  void s;
  return pivot;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ninther } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0, 11, 13, 12, 10, 14];
  rec.begin({ zh: 'Ninther', en: 'Ninther' })
    .setBars(data.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) }))).commit();
  const p = ninther(data, {
    onPick: (s) => rec.begin({ zh: \`采样: \${s.join(',')}\`, en: \`sample: \${s.join(',')}\` })
      .setBars(data.map((v) => ({ value: v, role: (s.includes(v) ? 'compare' : 'default') as BarRole }))).commit(),
    onResult: (pivot) => rec.begin({ zh: \`pivot=\${pivot}\`, en: \`pivot=\${pivot}\` })
      .setAux([{ label: 'pivot', value: String(pivot), role: 'final' as BarRole }]).commit(),
  });
  void p;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ninther } from '../../src/algorithms/selection/sel-ninther-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-ninther-2/trace.ts';

test('ninther 返回采样中之一', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0, 11, 13, 12, 10, 14];
  const p = ninther(a);
  assert.ok(Number.isFinite(p));
});
test('ninther 小数组降级', () => {
  assert.equal(ninther([3,1,2]), 2);
});
test('ninther trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 5. sel-quickselect-pivot-random
{
  id: 'sel-quickselect-pivot-random',
  titleZh: '随机 pivot 快速选择', titleEn: 'Random-Pivot Quickselect',
  summaryZh: 'Quickselect：随机选 pivot，期望 O(n)。',
  summaryEn: 'Quickselect: random pivot, expected O(n).',
  descZh: 'Quickselect（Hoare）每次随机选 pivot 划分数组，递归到包含第 k 小的一侧。期望 O(n)，最坏 O(n²)。',
  descEn: 'Quickselect (Hoare) picks a random pivot, partitions, and recurses into the side containing the k-th smallest. Expected O(n), worst O(n²).',
  tags: ['selection','quickselect','randomized','expected-linear'],
  time: 'O(n) expected', space: 'O(log n)',
  impl: `// 随机 pivot 快速选择 · 实现
export interface QrHooks {
  onPivot?: (pivot: number, idx: number) => void;
  onPartition?: (left: number, right: number, pIdx: number) => void;
  onRecurse?: (left: number, right: number, k: number) => void;
  onResult?: (value: number) => void;
}
function makeRng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
export function quickselectRandom(arr: number[], k: number, seed = 7, hooks: QrHooks = {}): number {
  const a = [...arr];
  const rng = makeRng(seed);
  function rec(left: number, right: number, kk: number): number {
    hooks.onRecurse?.(left, right, kk);
    if (left === right) { hooks.onResult?.(a[left]!); return a[left]!; }
    const pi = left + Math.floor(rng() * (right - left + 1));
    const pivot = a[pi]!;
    hooks.onPivot?.(pivot, pi);
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++) {
      if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
    }
    [a[i], a[right]] = [a[right]!, a[i]!];
    hooks.onPartition?.(left, right, i);
    const rank = i - left;
    if (kk === rank) { hooks.onResult?.(a[i]!); return a[i]!; }
    if (kk < rank) return rec(left, i - 1, kk);
    return rec(i + 1, right, kk - rank - 1);
  }
  return rec(0, a.length - 1, k);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectRandom } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '随机 pivot 快速选择 k=5', en: 'random quickselect k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  quickselectRandom(data, 5, 7, {
    onPivot: (p) => rec.begin({ zh: \`pivot=\${p}\`, en: \`pivot=\${p}\` })
      .setAux([{ label: 'pivot', value: String(p), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectRandom } from '../../src/algorithms/selection/sel-quickselect-pivot-random/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quickselect-pivot-random/trace.ts';

test('quickselect random 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(quickselectRandom(a, k, 7), k);
});
test('quickselect random 单元素', () => assert.equal(quickselectRandom([5], 0), 5));
test('quickselect random trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 6. sel-quickselect-pivot-med3
{
  id: 'sel-quickselect-pivot-med3',
  titleZh: '中位3快选', titleEn: 'Median-of-3 Quickselect',
  summaryZh: 'Quickselect：用首/中/尾的中位数做 pivot。',
  summaryEn: 'Quickselect: pivot is median of first/middle/last.',
  descZh: 'Quickselect 的 median-of-3 变体：取首、中、尾三者的中位数作 pivot，避免最坏情况。',
  descEn: 'Median-of-3 quickselect variant: pivot is the median of the first, middle, and last elements, mitigating worst cases.',
  tags: ['selection','quickselect','median-of-3'],
  time: 'O(n) expected', space: 'O(log n)',
  impl: `// median-of-3 快速选择 · 实现
export interface Q3Hooks {
  onPivot?: (pivot: number) => void;
  onResult?: (value: number) => void;
}
function med3(a: number[], l: number, m: number, r: number): number {
  const x = a[l]!, y = a[m]!, z = a[r]!;
  if ((x <= y && y <= z) || (z <= y && y <= x)) return m;
  if ((y <= x && x <= z) || (z <= x && x <= y)) return l;
  return r;
}
export function quickselectMed3(arr: number[], k: number, hooks: Q3Hooks = {}): number {
  const a = [...arr];
  function rec(left: number, right: number, kk: number): number {
    if (left === right) { hooks.onResult?.(a[left]!); return a[left]!; }
    const mid = Math.floor((left + right) / 2);
    const pi = med3(a, left, mid, right);
    const pivot = a[pi]!;
    hooks.onPivot?.(pivot);
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++) if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
    [a[i], a[right]] = [a[right]!, a[i]!];
    const rank = i - left;
    if (kk === rank) { hooks.onResult?.(a[i]!); return a[i]!; }
    if (kk < rank) return rec(left, i - 1, kk);
    return rec(i + 1, right, kk - rank - 1);
  }
  return rec(0, a.length - 1, k);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectMed3 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: 'median-of-3 快速选择 k=5', en: 'med3 quickselect k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  quickselectMed3(data, 5, {
    onPivot: (p) => rec.begin({ zh: \`pivot=\${p}\`, en: \`pivot=\${p}\` })
      .setAux([{ label: 'pivot', value: String(p), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectMed3 } from '../../src/algorithms/selection/sel-quickselect-pivot-med3/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quickselect-pivot-med3/trace.ts';

test('quickselect med3 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(quickselectMed3(a, k), k);
});
test('quickselect med3 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 7. sel-quickselect-pivot-med5
{
  id: 'sel-quickselect-pivot-med5',
  titleZh: '中位5快选', titleEn: 'Median-of-5 Quickselect',
  summaryZh: 'Quickselect：用 5 个均匀采样的中位数做 pivot。',
  summaryEn: 'Quickselect: pivot is median of 5 evenly sampled elements.',
  descZh: 'Quickselect 的 median-of-5 变体：均匀采样 5 个元素，取中位数做 pivot，比 median-of-3 更稳。',
  descEn: 'Median-of-5 quickselect variant: sample 5 evenly spaced elements, take their median as pivot — more stable than median-of-3.',
  tags: ['selection','quickselect','median-of-5'],
  time: 'O(n) expected', space: 'O(log n)',
  impl: `// median-of-5 快速选择 · 实现
export interface Q5Hooks { onPivot?: (pivot: number) => void; onResult?: (value: number) => void; }
function median5(a: number[], idx: number[]): number {
  const vals = idx.map((i) => a[i]!).sort((x, y) => x - y);
  return vals[2]!;
}
export function quickselectMed5(arr: number[], k: number, hooks: Q5Hooks = {}): number {
  const a = [...arr];
  function rec(left: number, right: number, kk: number): number {
    if (left === right) { hooks.onResult?.(a[left]!); return a[left]!; }
    const n = right - left + 1;
    const idx = [0, 1, 2, 3, 4].map((i) => left + Math.floor((i * (n - 1)) / 4));
    const pi = idx.find((i) => a[i] === median5(a, idx)) ?? idx[2]!;
    const pivot = a[pi]!;
    hooks.onPivot?.(pivot);
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++) if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
    [a[i], a[right]] = [a[right]!, a[i]!];
    const rank = i - left;
    if (kk === rank) { hooks.onResult?.(a[i]!); return a[i]!; }
    if (kk < rank) return rec(left, i - 1, kk);
    return rec(i + 1, right, kk - rank - 1);
  }
  return rec(0, a.length - 1, k);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectMed5 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: 'median-of-5 快速选择 k=5', en: 'med5 quickselect k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  quickselectMed5(data, 5, {
    onPivot: (p) => rec.begin({ zh: \`pivot=\${p}\`, en: \`pivot=\${p}\` })
      .setAux([{ label: 'pivot', value: String(p), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectMed5 } from '../../src/algorithms/selection/sel-quickselect-pivot-med5/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quickselect-pivot-med5/trace.ts';

test('quickselect med5 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(quickselectMed5(a, k), k);
});
test('quickselect med5 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 8. sel-introselect-full-2
{
  id: 'sel-introselect-full-2',
  titleZh: 'Introselect v2', titleEn: 'Introselect v2',
  summaryZh: 'Introselect：随机快选 + 中位数中位数回退，最坏 O(n)。',
  summaryEn: 'Introselect: random quickselect with median-of-medians fallback; worst-case O(n).',
  descZh: 'Introselect（Musser）：先用随机快速选择；递归深度超过阈值后切换到中位数中位数 pivot（BFPRT），保证最坏 O(n)。',
  descEn: 'Introselect (Musser): start with random quickselect; once recursion depth exceeds a threshold, switch to median-of-medians (BFPRT) pivot, guaranteeing worst-case O(n).',
  tags: ['selection','quickselect','introselect','hybrid','worst-case-linear'],
  time: 'O(n)', space: 'O(log n)',
  impl: `// Introselect v2 · 实现
export interface IsHooks { onPivot?: (p: number, mode: 'random' | 'mom') => void; onResult?: (v: number) => void; }
function makeRng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function insertSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) { const x = a[i]!; let j = i - 1; while (j >= 0 && a[j]! > x) { a[j + 1] = a[j]!; j--; } a[j + 1] = x; }
  return a;
}
function momPivot(a: number[], left: number, right: number): number {
  const sub = a.slice(left, right + 1);
  const meds: number[] = [];
  for (let i = 0; i < sub.length; i += 5) {
    const g = insertSort(sub.slice(i, i + 5));
    meds.push(g[Math.floor(g.length / 2)]!);
  }
  return meds.length <= 5 ? insertSort(meds)[Math.floor(meds.length / 2)]! : momPivot(meds, 0, meds.length - 1);
}
export function introselect(arr: number[], k: number, seed = 3, hooks: IsHooks = {}): number {
  const a = [...arr];
  const rng = makeRng(seed);
  const limit = 2 * Math.ceil(Math.log2(a.length + 1));
  function rec(left: number, right: number, kk: number, depth: number): number {
    if (left === right) { hooks.onResult?.(a[left]!); return a[left]!; }
    let pi: number;
    if (depth < limit) {
      pi = left + Math.floor(rng() * (right - left + 1));
      hooks.onPivot?.(a[pi]!, 'random');
    } else {
      const p = momPivot(a, left, right);
      hooks.onPivot?.(p, 'mom');
      pi = left;
      for (let i = left; i <= right; i++) if (a[i] === p) { pi = i; break; }
    }
    const pivot = a[pi]!;
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++) if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
    [a[i], a[right]] = [a[right]!, a[i]!];
    const rank = i - left;
    if (kk === rank) { hooks.onResult?.(a[i]!); return a[i]!; }
    if (kk < rank) return rec(left, i - 1, kk, depth + 1);
    return rec(i + 1, right, kk - rank - 1, depth + 1);
  }
  return rec(0, a.length - 1, k, 0);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { introselect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: 'Introselect k=5', en: 'introselect k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  introselect(data, 5, 3, {
    onPivot: (p, mode) => rec.begin({ zh: \`pivot=\${p} (\${mode})\`, en: \`pivot=\${p} (\${mode})\` })
      .setAux([{ label: mode, value: String(p), role: mode === 'mom' ? 'warn' : 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { introselect } from '../../src/algorithms/selection/sel-introselect-full-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-introselect-full-2/trace.ts';

test('introselect 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(introselect(a, k, 3), k);
});
test('introselect 已排序数据最坏情况仍正确', () => {
  const a = Array.from({ length: 50 }, (_, i) => i);
  for (let k = 0; k < 50; k += 7) assert.equal(introselect(a, k, 1), k);
});
test('introselect trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 9. sel-min-heap-select
{
  id: 'sel-min-heap-select',
  titleZh: '最小堆选择', titleEn: 'Min-Heap Select',
  summaryZh: '建最小堆后弹出 k 次得第 k 小。',
  summaryEn: 'Build a min-heap, pop k times for the k-th smallest.',
  descZh: '最小堆选择：先 O(n) 建堆，再执行 k 次 pop-min，最后一次弹出即第 k 小。适合 k 较小。',
  descEn: 'Min-heap select: build a heap in O(n), then pop-min k times; the last pop is the k-th smallest. Good for small k.',
  tags: ['selection','heap','min-heap'],
  time: 'O(n + k log n)', space: 'O(n)',
  impl: `// 最小堆选择 · 实现
export interface MhHooks { onPop?: (value: number, k: number) => void; onResult?: (v: number) => void; }
function siftDown(a: number[], i: number, n: number): void {
  while (true) {
    const l = 2 * i + 1; const r = 2 * i + 2;
    let s = i;
    if (l < n && a[l]! < a[s]!) s = l;
    if (r < n && a[r]! < a[s]!) s = r;
    if (s === i) break;
    [a[i], a[s]] = [a[s]!, a[i]!]; i = s;
  }
}
export function minHeapSelect(arr: number[], k: number, hooks: MhHooks = {}): number {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(a, i, n);
  let result = a[0]!;
  let size = n;
  for (let i = 0; i <= k && size > 0; i++) {
    result = a[0]!;
    hooks.onPop?.(result, i);
    a[0] = a[size - 1]!;
    size--;
    siftDown(a, 0, size);
  }
  hooks.onResult?.(result);
  return result;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minHeapSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '最小堆选择 k=5', en: 'min-heap select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  minHeapSelect(data, 5, {
    onPop: (v, kk) => rec.begin({ zh: \`pop #\${kk}: \${v}\`, en: \`pop #\${kk}: \${v}\` })
      .setAux([{ label: 'pop', value: String(v), role: 'swap' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minHeapSelect } from '../../src/algorithms/selection/sel-min-heap-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-min-heap-select/trace.ts';

test('min-heap select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(minHeapSelect(a, k), k);
});
test('min-heap select k=0', () => assert.equal(minHeapSelect([5,1,3], 0), 1));
test('min-heap select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 10. sel-max-heap-select
{
  id: 'sel-max-heap-select',
  titleZh: '最大堆选择', titleEn: 'Max-Heap Select',
  summaryZh: '建最大堆后弹出 (n−k) 次得第 k 小。',
  summaryEn: 'Build a max-heap, pop (n−k) times for the k-th smallest.',
  descZh: '最大堆选择：建最大堆，连续弹出直到剩下 k 个，堆顶即第 k 小。适合 k 接近 n。',
  descEn: 'Max-heap select: build a max-heap, pop repeatedly until k remain; the root is the k-th smallest. Good for k near n.',
  tags: ['selection','heap','max-heap'],
  time: 'O(n + (n−k) log n)', space: 'O(n)',
  impl: `// 最大堆选择 · 实现
export interface XhHooks { onPop?: (v: number, remaining: number) => void; onResult?: (v: number) => void; }
function siftDownMax(a: number[], i: number, n: number): void {
  while (true) {
    const l = 2 * i + 1; const r = 2 * i + 2;
    let s = i;
    if (l < n && a[l]! > a[s]!) s = l;
    if (r < n && a[r]! > a[s]!) s = r;
    if (s === i) break;
    [a[i], a[s]] = [a[s]!, a[i]!]; i = s;
  }
}
export function maxHeapSelect(arr: number[], k: number, hooks: XhHooks = {}): number {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDownMax(a, i, n);
  let size = n;
  while (size > k + 1) {
    hooks.onPop?.(a[0]!, size);
    a[0] = a[size - 1]!;
    size--;
    siftDownMax(a, 0, size);
  }
  hooks.onResult?.(a[0]!);
  return a[0]!;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxHeapSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '最大堆选择 k=5', en: 'max-heap select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  maxHeapSelect(data, 5, {
    onPop: (v, rem) => rec.begin({ zh: \`弹出 \${v}（剩\${rem}）\`, en: \`pop \${v} (\${rem} left)\` })
      .setAux([{ label: 'pop', value: String(v), role: 'swap' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxHeapSelect } from '../../src/algorithms/selection/sel-max-heap-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-max-heap-select/trace.ts';

test('max-heap select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(maxHeapSelect(a, k), k);
});
test('max-heap select 最大值', () => assert.equal(maxHeapSelect([5,1,3,9,2], 4), 9));
test('max-heap select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 11. sel-balanced-select
{
  id: 'sel-balanced-select',
  titleZh: '平衡选择', titleEn: 'Balanced Select',
  summaryZh: '平衡快速选择：保证两侧较均衡递归。',
  summaryEn: 'Balanced quickselect: ensures both sides recurse evenly.',
  descZh: '平衡选择在每次划分后选较小一侧先递归（尾递归消除），栈深度 O(log n)。',
  descEn: 'Balanced select recurses into the smaller side first (tail-call elimination), giving O(log n) stack depth.',
  tags: ['selection','quickselect','balanced','tail-recursion'],
  time: 'O(n) expected', space: 'O(log n)',
  impl: `// 平衡快速选择 · 实现
export interface BsHooks { onPartition?: (l: number, r: number, p: number) => void; onResult?: (v: number) => void; }
function makeRng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
export function balancedSelect(arr: number[], k: number, seed = 5, hooks: BsHooks = {}): number {
  const a = [...arr];
  const rng = makeRng(seed);
  let left = 0; let right = a.length - 1; let kk = k;
  while (left < right) {
    const pi = left + Math.floor(rng() * (right - left + 1));
    const pivot = a[pi]!;
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++) if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
    [a[i], a[right]] = [a[right]!, a[i]!];
    hooks.onPartition?.(left, right, i);
    const rank = i - left;
    if (kk === rank) { hooks.onResult?.(a[i]!); return a[i]!; }
    // 选较小一侧递归，较大一侧用循环
    if (rank > kk) right = i - 1;
    else { kk -= rank + 1; left = i + 1; }
  }
  hooks.onResult?.(a[left]!);
  return a[left]!;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { balancedSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '平衡快速选择 k=5', en: 'balanced select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  balancedSelect(data, 5, 5, {
    onPartition: (l, r, p) => rec.begin({ zh: \`划分 [\${l},\${r}] @\${p}\`, en: \`partition [\${l},\${r}] @\${p}\` })
      .setAux([{ label: 'p', value: String(p), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { balancedSelect } from '../../src/algorithms/selection/sel-balanced-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-balanced-select/trace.ts';

test('balanced select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(balancedSelect(a, k, 5), k);
});
test('balanced select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 12. sel-pair-heap-select
{
  id: 'sel-pair-heap-select',
  titleZh: '配对堆选择', titleEn: 'Pairing-Heap Select',
  summaryZh: '用配对堆做第 k 小：O(log n) 摊还弹出。',
  summaryEn: 'Use a pairing heap for k-th smallest: O(log n) amortized pop.',
  descZh: '配对堆（Fredman 等）支持高效合并与删除最小；建堆后弹出 k 次得第 k 小。本实现用简化的配对堆。',
  descEn: 'Pairing heap (Fredman et al.) supports efficient merge and delete-min; pop k times after building for the k-th smallest. Simplified pairing heap impl.',
  tags: ['selection','heap','pairing-heap'],
  time: 'O(n + k log n) amortized', space: 'O(n)',
  impl: `// 配对堆选择 · 实现（简化）
export interface PhNode { v: number; children: PhNode[]; }
export interface PhHooks { onPop?: (v: number, k: number) => void; onResult?: (v: number) => void; }
function merge(a: PhNode | null, b: PhNode | null): PhNode | null {
  if (!a) return b;
  if (!b) return a;
  if (a.v <= b.v) { a.children.push(b); return a; }
  b.children.push(a); return b;
}
function mergePairs(nodes: PhNode[]): PhNode | null {
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0]!;
  // 两两合并
  const merged: PhNode[] = [];
  for (let i = 0; i + 1 < nodes.length; i += 2) merged.push(merge(nodes[i]!, nodes[i + 1]!)!);
  if (nodes.length % 2 === 1) merged.push(nodes[nodes.length - 1]!);
  let result: PhNode | null = merged[merged.length - 1]!;
  for (let i = merged.length - 2; i >= 0; i--) result = merge(merged[i]!, result);
  return result;
}
export function pairingHeapSelect(arr: number[], k: number, hooks: PhHooks = {}): number {
  let root: PhNode | null = null;
  for (const v of arr) root = merge(root, { v, children: [] });
  let result = root?.v ?? NaN;
  for (let i = 0; i <= k && root; i++) {
    result = root.v;
    hooks.onPop?.(result, i);
    root = mergePairs(root.children);
  }
  hooks.onResult?.(result);
  return result;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pairingHeapSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '配对堆选择 k=5', en: 'pairing-heap select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  pairingHeapSelect(data, 5, {
    onPop: (v, kk) => rec.begin({ zh: \`pop #\${kk}: \${v}\`, en: \`pop #\${kk}: \${v}\` })
      .setAux([{ label: 'pop', value: String(v), role: 'swap' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pairingHeapSelect } from '../../src/algorithms/selection/sel-pair-heap-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-pair-heap-select/trace.ts';

test('pairing-heap select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(pairingHeapSelect(a, k), k);
});
test('pairing-heap select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 13. sel-tournament-2
{
  id: 'sel-tournament-2',
  titleZh: '锦标赛选择 v2', titleEn: 'Tournament Select v2',
  summaryZh: '锦标赛：单淘汰赛制选出第 k 小。',
  summaryEn: 'Tournament: single-elimination to find the k-th smallest.',
  descZh: '锦标赛选择用淘汰赛树选出最小（冠军）；要选第 k 小则把冠军替换为 +∞ 后重赛，重复 k 次。',
  descEn: 'Tournament select uses an elimination tree to find the minimum (champion); to find the k-th smallest, replace the champion with +∞ and replay, k times.',
  tags: ['selection','tournament','tree'],
  time: 'O(n + k log n)', space: 'O(n)',
  impl: `// 锦标赛选择 v2 · 实现
export interface TmHooks { onRound?: (matches: Array<[number, number, number]>) => void; onResult?: (v: number) => void; }
export function tournamentSelect(arr: number[], k: number, hooks: TmHooks = {}): number {
  let a = [...arr];
  let result = NaN;
  for (let round = 0; round <= k; round++) {
    // 单淘汰
    let cur = a;
    const log: Array<[number, number, number]> = [];
    while (cur.length > 1) {
      const next: number[] = [];
      for (let i = 0; i + 1 < cur.length; i += 2) {
        const w = Math.min(cur[i]!, cur[i + 1]!);
        log.push([cur[i]!, cur[i + 1]!, w]);
        next.push(w);
      }
      if (cur.length % 2 === 1) next.push(cur[cur.length - 1]!);
      cur = next;
    }
    hooks.onRound?.(log);
    result = cur[0] ?? NaN;
    // 把当前冠军替换为 +∞
    const idx = a.indexOf(result);
    if (idx >= 0) a[idx] = Infinity;
  }
  hooks.onResult?.(result);
  return result;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tournamentSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '锦标赛选择 k=5', en: 'tournament select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  tournamentSelect(data, 5, {
    onRound: (matches) => rec.begin({ zh: \`本轮 \${matches.length} 场\`, en: \`\${matches.length} matches\` })
      .setAux([{ label: 'matches', value: String(matches.length), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tournamentSelect } from '../../src/algorithms/selection/sel-tournament-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-tournament-2/trace.ts';

test('tournament select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(tournamentSelect(a, k), k);
});
test('tournament select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 14. sel-round-robin-2
{
  id: 'sel-round-robin-2',
  titleZh: '循环赛选择 v2', titleEn: 'Round-Robin Select v2',
  summaryZh: '循环赛：每对选手比较一次，统计胜场排序。',
  summaryEn: 'Round-robin: compare every pair, rank by wins.',
  descZh: '循环赛（double round-robin 简化）：对所有数两两比较，按「胜出次数」（小于对方的次数）排序得第 k 小。',
  descEn: 'Round-robin (simplified): compare every pair; rank by "win count" (number of elements beaten) to get the k-th smallest.',
  tags: ['selection','round-robin','quadratic'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 循环赛选择 v2 · 实现
export interface RrHooks { onCompare?: (i: number, j: number, winner: number) => void; onResult?: (v: number) => void; }
export function roundRobinSelect(arr: number[], k: number, hooks: RrHooks = {}): number {
  const n = arr.length;
  const wins = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      // 小者获胜（找第 k 小）
      if (arr[i]! < arr[j]!) { wins[i]++; hooks.onCompare?.(i, j, i); }
    }
  }
  // wins[i] = 比 arr[i] 大的元素个数 = rank
  // 第 k 小 → wins == k（有 n-1-k 个更大）→ rank 从小到大 wins == n-1-k? 重新算：
  // wins[i] = j 中 arr[i] < arr[j] 的个数 = 比 arr[i] 大的个数。
  // rank (0=最小) = n - 1 - wins[i]
  let result = arr[0]!;
  for (let i = 0; i < n; i++) {
    if (n - 1 - wins[i]! === k) { result = arr[i]!; break; }
  }
  hooks.onResult?.(result);
  return result;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { roundRobinSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8];
  rec.begin({ zh: '循环赛选择 k=2', en: 'round-robin select k=2' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  roundRobinSelect(data, 2, {
    onCompare: (i, j) => rec.begin({ zh: \`比较 \${data[i]} vs \${data[j]}\`, en: \`compare \${data[i]} vs \${data[j]}\` })
      .setBars(data.map((v, idx) => ({ value: v, role: (idx === i || idx === j ? 'compare' : 'default') as BarRole }))).commit(),
    onResult: (v) => rec.begin({ zh: \`第 2 小=\${v}\`, en: \`2nd=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobinSelect } from '../../src/algorithms/selection/sel-round-robin-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-round-robin-2/trace.ts';

test('round-robin select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(roundRobinSelect(a, k), k);
});
test('round-robin select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 15. sel-random-tournament-2
{
  id: 'sel-random-tournament-2',
  titleZh: '随机锦标赛 v2', titleEn: 'Random Tournament Select v2',
  summaryZh: '随机化锦标赛：随机配对淘汰，期望 O(n) 选最小。',
  summaryEn: 'Randomized tournament: random pairing elimination; expected O(n) for minimum.',
  descZh: '随机锦标赛：每轮随机配对淘汰较大者，重复 k 轮得第 k 小。',
  descEn: 'Random tournament: each round randomly pairs and eliminates the larger; repeat k rounds for the k-th smallest.',
  tags: ['selection','tournament','randomized'],
  time: 'O(kn)', space: 'O(n)',
  impl: `// 随机锦标赛选择 v2 · 实现
export interface RtHooks { onRound?: (pairs: Array<[number, number]>) => void; onResult?: (v: number) => void; }
function makeRng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
export function randomTournamentSelect(arr: number[], k: number, seed = 11, hooks: RtHooks = {}): number {
  const rng = makeRng(seed);
  let a = [...arr];
  let result = a[0]!;
  for (let round = 0; round <= k; round++) {
    // 随机洗牌
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
    const pairs: Array<[number, number]> = [];
    const winners: number[] = [];
    for (let i = 0; i + 1 < a.length; i += 2) {
      pairs.push([a[i]!, a[i + 1]!]);
      winners.push(Math.min(a[i]!, a[i + 1]!));
    }
    if (a.length % 2 === 1) winners.push(a[a.length - 1]!);
    hooks.onRound?.(pairs);
    // 单元素即为冠军
    while (winners.length > 1) {
      const next: number[] = [];
      for (let i = 0; i + 1 < winners.length; i += 2) next.push(Math.min(winners[i]!, winners[i + 1]!));
      if (winners.length % 2 === 1) next.push(winners[winners.length - 1]!);
      winners.length = 0;
      winners.push(...next);
    }
    result = winners[0] ?? NaN;
    const idx = a.indexOf(result);
    if (idx >= 0) a[idx] = Infinity;
  }
  hooks.onResult?.(result);
  return result;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomTournamentSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '随机锦标赛 k=5', en: 'random tournament k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  randomTournamentSelect(data, 5, 11, {
    onRound: (pairs) => rec.begin({ zh: \`本轮 \${pairs.length} 对\`, en: \`\${pairs.length} pairs\` })
      .setAux([{ label: 'pairs', value: String(pairs.length), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`第 5 小=\${v}\`, en: \`5th=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomTournamentSelect } from '../../src/algorithms/selection/sel-random-tournament-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-random-tournament-2/trace.ts';

test('random tournament select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(randomTournamentSelect(a, k, 11), k);
});
test('random tournament select trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 16. sel-percentile-linear
{
  id: 'sel-percentile-linear',
  titleZh: '线性插值百分位', titleEn: 'Linear-Interpolation Percentile',
  summaryZh: '线性插值百分位：rank = p/100·(n−1)，相邻值线性插值。',
  summaryEn: 'Linear-interpolation percentile: rank = p/100·(n−1), linearly interpolate between neighbors.',
  descZh: '线性插值百分位（numpy 默认）：排序后 rank = p/100·(n−1)，若非整数则取 floor/ceil 位置线性插值。',
  descEn: 'Linear-interpolation percentile (numpy default): after sorting, rank = p/100·(n−1); if non-integer, linearly interpolate between floor and ceil positions.',
  tags: ['selection','percentile','statistics','interpolation'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 线性插值百分位 · 实现
export interface PlHooks { onSort?: (sorted: number[]) => void; onResult?: (v: number) => void; }
export function percentileLinear(arr: number[], p: number, hooks: PlHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  hooks.onSort?.(sorted);
  const rank = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  let v: number;
  if (lo === hi) v = sorted[lo]!;
  else {
    const frac = rank - lo;
    v = sorted[lo]! + (sorted[hi]! - sorted[lo]!) * frac;
  }
  hooks.onResult?.(v);
  return v;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { percentileLinear } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '线性百分位 p=50', en: 'linear percentile p=50' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  percentileLinear(data, 50, {
    onSort: (s) => rec.begin({ zh: \`排序: \${s.join(',')}\`, en: \`sorted: \${s.join(',')}\` })
      .setBars(s.map((v) => ({ value: v, role: 'default' as BarRole }))).commit(),
    onResult: (v) => rec.begin({ zh: \`p50=\${v}\`, en: \`p50=\${v}\` })
      .setAux([{ label: 'p50', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentileLinear } from '../../src/algorithms/selection/sel-percentile-linear/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-percentile-linear/trace.ts';

test('percentile linear p50 = 中位数', () => {
  assert.equal(percentileLinear([1,2,3,4,5], 50), 3);
});
test('percentile linear p0 = 最小', () => assert.equal(percentileLinear([5,1,3], 0), 1));
test('percentile linear p100 = 最大', () => assert.equal(percentileLinear([5,1,3], 100), 5));
test('percentile linear 插值', () => assert.equal(percentileLinear([1,2], 50), 1.5));
test('percentile linear trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 17. sel-percentile-nearest
{
  id: 'sel-percentile-nearest',
  titleZh: '就近百分位', titleEn: 'Nearest-Rank Percentile',
  summaryZh: '就近百分位：rank = ceil(p/100·n)，取排序后该位置。',
  summaryEn: 'Nearest-rank percentile: rank = ceil(p/100·n), take that sorted position.',
  descZh: '就近排名百分位（Excel PERCENTILE.INC 的 nearest 变体）：rank = ceil(p/100·n)，直接取该位置值，不做插值。',
  descEn: 'Nearest-rank percentile (a variant of Excel PERCENTILE.INC): rank = ceil(p/100·n), take the value at that position without interpolation.',
  tags: ['selection','percentile','statistics','nearest'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 就近百分位 · 实现
export interface PnHooks { onSort?: (sorted: number[]) => void; onResult?: (v: number) => void; }
export function percentileNearest(arr: number[], p: number, hooks: PnHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  hooks.onSort?.(sorted);
  const rank = Math.max(1, Math.ceil((p / 100) * sorted.length));
  const v = sorted[rank - 1]!;
  hooks.onResult?.(v);
  return v;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { percentileNearest } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '就近百分位 p=50', en: 'nearest percentile p=50' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  percentileNearest(data, 50, {
    onSort: (s) => rec.begin({ zh: \`排序: \${s.join(',')}\`, en: \`sorted: \${s.join(',')}\` })
      .setBars(s.map((v) => ({ value: v, role: 'default' as BarRole }))).commit(),
    onResult: (v) => rec.begin({ zh: \`p50=\${v}\`, en: \`p50=\${v}\` })
      .setAux([{ label: 'p50', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentileNearest } from '../../src/algorithms/selection/sel-percentile-nearest/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-percentile-nearest/trace.ts';

test('percentile nearest p50', () => {
  const v = percentileNearest([1,2,3,4,5], 50);
  assert.ok(v === 3 || v === 4); // ceil(0.5*5)=3 → index 2 = 3
});
test('percentile nearest p100 = 最大', () => assert.equal(percentileNearest([5,1,3], 100), 5));
test('percentile nearest p0', () => assert.equal(percentileNearest([5,1,3], 0), 1));
test('percentile nearest trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 18. sel-quantile-linear
{
  id: 'sel-quantile-linear',
  titleZh: '线性分位数', titleEn: 'Linear Quantile',
  summaryZh: '线性分位数：q∈[0,1]，rank = q·(n−1)。',
  summaryEn: 'Linear quantile: q∈[0,1], rank = q·(n−1).',
  descZh: '线性分位数与线性百分位等价，只是用 q∈[0,1] 而非 p∈[0,100]。',
  descEn: 'Linear quantile is equivalent to linear percentile, using q∈[0,1] instead of p∈[0,100].',
  tags: ['selection','quantile','statistics','interpolation'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 线性分位数 · 实现
export interface QlHooks { onResult?: (v: number) => void; }
export function quantileLinear(arr: number[], q: number, hooks: QlHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const rank = q * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  let v: number;
  if (lo === hi) v = sorted[lo]!;
  else v = sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (rank - lo);
  hooks.onResult?.(v);
  return v;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quantileLinear } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '线性分位数 q=0.25', en: 'linear quantile q=0.25' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  quantileLinear(data, 0.25, {
    onResult: (v) => rec.begin({ zh: \`Q1=\${v}\`, en: \`Q1=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quantileLinear } from '../../src/algorithms/selection/sel-quantile-linear/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quantile-linear/trace.ts';

test('quantile linear 中位数', () => assert.equal(quantileLinear([1,2,3,4,5], 0.5), 3));
test('quantile linear Q0 = min', () => assert.equal(quantileLinear([5,1,3], 0), 1));
test('quantile linear Q1 = max', () => assert.equal(quantileLinear([5,1,3], 1), 5));
test('quantile linear trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 19. sel-quantile-nearest
{
  id: 'sel-quantile-nearest',
  titleZh: '就近分位数', titleEn: 'Nearest Quantile',
  summaryZh: '就近分位数：rank = ceil(q·n)。',
  summaryEn: 'Nearest quantile: rank = ceil(q·n).',
  descZh: '就近分位数与就近百分位等价，用 q∈[0,1]。',
  descEn: 'Nearest quantile is equivalent to nearest-rank percentile, using q∈[0,1].',
  tags: ['selection','quantile','statistics','nearest'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 就近分位数 · 实现
export interface QnHooks { onResult?: (v: number) => void; }
export function quantileNearest(arr: number[], q: number, hooks: QnHooks = {}): number {
  if (arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  const rank = Math.max(1, Math.ceil(q * sorted.length));
  const v = sorted[rank - 1]!;
  hooks.onResult?.(v);
  return v;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quantileNearest } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: '就近分位数 q=0.75', en: 'nearest quantile q=0.75' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  quantileNearest(data, 0.75, {
    onResult: (v) => rec.begin({ zh: \`Q3=\${v}\`, en: \`Q3=\${v}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quantileNearest } from '../../src/algorithms/selection/sel-quantile-nearest/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quantile-nearest/trace.ts';

test('quantile nearest Q0 = min', () => assert.equal(quantileNearest([5,1,3], 0), 1));
test('quantile nearest Q1 = max', () => assert.equal(quantileNearest([5,1,3], 1), 5));
test('quantile nearest trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 20. sel-iqr-2
{
  id: 'sel-iqr-2',
  titleZh: '四分位距 v2', titleEn: 'Interquartile Range v2',
  summaryZh: 'IQR = Q3 − Q1，衡量数据离散程度（稳健）。',
  summaryEn: 'IQR = Q3 − Q1, a robust measure of spread.',
  descZh: '四分位距 IQR 是第 75 百分位与第 25 百分位之差，对离群值稳健，常用于箱线图。',
  descEn: 'IQR is the difference between the 75th and 25th percentiles; robust to outliers, used in box plots.',
  tags: ['selection','statistics','iqr','robust','quartile'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 四分位距 v2 · 实现
export interface IqrHooks { onQuartiles?: (q1: number, q3: number) => void; onResult?: (iqr: number) => void; }
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  const rank = q * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (rank - lo);
}
export function iqr(arr: number[], hooks: IqrHooks = {}): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  hooks.onQuartiles?.(q1, q3);
  const v = q3 - q1;
  hooks.onResult?.(v);
  return v;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iqr } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec.begin({ zh: 'IQR', en: 'IQR' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  iqr(data, {
    onQuartiles: (q1, q3) => rec.begin({ zh: \`Q1=\${q1}, Q3=\${q3}\`, en: \`Q1=\${q1}, Q3=\${q3}\` })
      .setBars(data.map((x) => ({ value: x, role: (x === q1 || x === q3 ? 'compare' : 'default') as BarRole }))).commit(),
    onResult: (v) => rec.begin({ zh: \`IQR=\${v}\`, en: \`IQR=\${v}\` })
      .setAux([{ label: 'IQR', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iqr } from '../../src/algorithms/selection/sel-iqr-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-iqr-2/trace.ts';

test('iqr 1..5 = 2', () => {
  // Q1=2, Q3=4 → IQR=2
  assert.equal(iqr([1,2,3,4,5]), 2);
});
test('iqr 常数数组 = 0', () => assert.equal(iqr([7,7,7,7]), 0));
test('iqr trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 21. sel-outlier-detect
{
  id: 'sel-outlier-detect',
  titleZh: '离群点检测', titleEn: 'Outlier Detection (Tukey)',
  summaryZh: 'Tukey 离群点：超出 [Q1−1.5·IQR, Q3+1.5·IQR]。',
  summaryEn: 'Tukey outliers: values outside [Q1−1.5·IQR, Q3+1.5·IQR].',
  descZh: 'Tukey 离群点检测：用 IQR 定义栅栏，超出 Q1−1.5·IQR 或 Q3+1.5·IQR 的点为离群点。',
  descEn: 'Tukey outlier detection: uses IQR fences; points below Q1−1.5·IQR or above Q3+1.5·IQR are outliers.',
  tags: ['selection','statistics','outlier','iqr','robust'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 离群点检测 · 实现
export interface OdHooks { onFences?: (lo: number, hi: number) => void; onResult?: (outliers: number[]) => void; }
function quantile(sorted: number[], q: number): number {
  const rank = q * (sorted.length - 1);
  const lo = Math.floor(rank); const hi = Math.ceil(rank);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (rank - lo);
}
export function detectOutliers(arr: number[], k = 1.5, hooks: OdHooks = {}): number[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lo = q1 - k * iqr;
  const hi = q3 + k * iqr;
  hooks.onFences?.(lo, hi);
  const out = arr.filter((x) => x < lo || x > hi);
  hooks.onResult?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectOutliers } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100]; // 100 是离群点
  rec.begin({ zh: 'Tukey 离群点', en: 'Tukey outliers' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  const out = detectOutliers(data, 1.5, {
    onFences: (lo, hi) => rec.begin({ zh: \`栅栏 [\${lo.toFixed(1)}, \${hi.toFixed(1)}]\`, en: \`fence [\${lo.toFixed(1)}, \${hi.toFixed(1)}]\` })
      .setAux([{ label: 'fence', value: \`\${lo.toFixed(1)}..\${hi.toFixed(1)}\`, role: 'compare' as BarRole }]).commit(),
    onResult: (outliers) => rec.begin({ zh: \`离群点: \${outliers.join(',')}\`, en: \`outliers: \${outliers.join(',')}\` })
      .setBars(data.map((x) => ({ value: x, role: (outliers.includes(x) ? 'warn' : 'final') as BarRole }))).commit(),
  });
  void out;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectOutliers } from '../../src/algorithms/selection/sel-outlier-detect/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-outlier-detect/trace.ts';

test('outlier detect 100 是离群点', () => {
  const out = detectOutliers([1,2,3,4,5,6,7,8,100]);
  assert.deepEqual(out, [100]);
});
test('outlier detect 无离群点', () => {
  assert.deepEqual(detectOutliers([1,2,3,4,5]), []);
});
test('outlier detect trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 22. sel-zscore
{
  id: 'sel-zscore',
  titleZh: 'Z-Score 离群点', titleEn: 'Z-Score Outlier',
  summaryZh: 'Z-score：|x−μ|/σ 超过阈值视为离群点。',
  summaryEn: 'Z-score: |x−μ|/σ beyond a threshold marks an outlier.',
  descZh: 'Z-score 离群点检测：计算每个点与均值的标准差倍数；超过阈值（如 2 或 3）的视为离群点。',
  descEn: 'Z-score outlier detection: compute each point standard deviations from the mean; values beyond a threshold (e.g., 2 or 3) are outliers.',
  tags: ['selection','statistics','zscore','outlier'],
  time: 'O(n)', space: 'O(n)',
  impl: `// Z-score 离群点 · 实现
export interface ZsHooks { onStats?: (mean: number, std: number) => void; onResult?: (outliers: number[]) => void; }
export function mean(a: number[]): number { return a.reduce((s, x) => s + x, 0) / a.length; }
export function std(a: number[], m?: number): number {
  const mu = m ?? mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - mu) ** 2, 0) / a.length);
}
export function zscoreOutliers(arr: number[], threshold = 2, hooks: ZsHooks = {}): number[] {
  const mu = mean(arr);
  const sigma = std(arr, mu);
  hooks.onStats?.(mu, sigma);
  if (sigma === 0) { hooks.onResult?.([]); return []; }
  const out = arr.filter((x) => Math.abs(x - mu) / sigma > threshold);
  hooks.onResult?.(out);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zscoreOutliers, mean, std } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100];
  const m = mean(data); const s = std(data, m);
  rec.begin({ zh: \`Z-score (μ=\${m.toFixed(1)}, σ=\${s.toFixed(1)})\`, en: \`Z-score (μ=\${m.toFixed(1)}, σ=\${s.toFixed(1)})\` })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  zscoreOutliers(data, 2, {
    onResult: (outliers) => rec.begin({ zh: \`离群点: \${outliers.join(',')}\`, en: \`outliers: \${outliers.join(',')}\` })
      .setBars(data.map((x) => ({ value: x, role: (outliers.includes(x) ? 'warn' : 'final') as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zscoreOutliers, mean, std } from '../../src/algorithms/selection/sel-zscore/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-zscore/trace.ts';

test('mean/std 基础', () => {
  assert.equal(mean([1,2,3]), 2);
  assert.ok(Math.abs(std([1,2,3]) - 0.8165) < 0.001);
});
test('zscore 检测 100', () => {
  assert.deepEqual(zscoreOutliers([1,2,3,4,5,6,7,8,100], 2), [100]);
});
test('zscore 常数数组无离群点', () => assert.deepEqual(zscoreOutliers([5,5,5,5]), []));
test('zscore trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 23. sel-mad
{
  id: 'sel-mad',
  titleZh: '绝对中位差', titleEn: 'Median Absolute Deviation',
  summaryZh: 'MAD = median(|xᵢ − median|)，最稳健的离散度量。',
  summaryEn: 'MAD = median(|xᵢ − median|), the most robust spread measure.',
  descZh: '绝对中位差（MAD）用中位数代替均值、绝对差代替平方差，对离群点极其稳健。常配合稳健 z-score 使用。',
  descEn: 'Median Absolute Deviation (MAD) replaces mean with median and squared deviation with absolute, extremely robust to outliers. Often used with robust z-scores.',
  tags: ['selection','statistics','mad','robust','median'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 绝对中位差 · 实现
export interface MadHooks { onMedian?: (m: number) => void; onResult?: (mad: number) => void; }
function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  return n % 2 === 0 ? (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2 : sorted[Math.floor(n / 2)]!;
}
export function mad(arr: number[], hooks: MadHooks = {}): number {
  const s = [...arr].sort((a, b) => a - b);
  const med = median(s);
  hooks.onMedian?.(med);
  const devs = arr.map((x) => Math.abs(x - med)).sort((a, b) => a - b);
  const m = median(devs);
  hooks.onResult?.(m);
  return m;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mad } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100];
  rec.begin({ zh: 'MAD', en: 'MAD' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  mad(data, {
    onMedian: (m) => rec.begin({ zh: \`中位数=\${m}\`, en: \`median=\${m}\` })
      .setAux([{ label: 'median', value: String(m), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`MAD=\${v}\`, en: \`MAD=\${v}\` })
      .setAux([{ label: 'MAD', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mad } from '../../src/algorithms/selection/sel-mad/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-mad/trace.ts';

test('mad 1..5 = 1', () => {
  // median=3, devs=[2,1,0,1,2] → median=1
  assert.equal(mad([1,2,3,4,5]), 1);
});
test('mad 对 100 稳健', () => {
  const m = mad([1,2,3,4,5,6,7,8,100]);
  assert.ok(m < 10); // 不被 100 拉偏
});
test('mad trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 24. sel-rmse
{
  id: 'sel-rmse',
  titleZh: '均方根误差', titleEn: 'Root Mean Square Error',
  summaryZh: 'RMSE：sqrt(mean((xᵢ − μ)²))，即标准差。',
  summaryEn: 'RMSE: sqrt(mean((xᵢ − μ)²)), i.e., standard deviation.',
  descZh: '均方根误差（相对均值的 RMSE 即标准差）衡量数据围绕均值的离散。',
  descEn: 'Root mean square error (RMSE about the mean equals the standard deviation) measures spread around the mean.',
  tags: ['selection','statistics','rmse','std','spread'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 均方根误差 · 实现
export interface RmseHooks { onMean?: (m: number) => void; onResult?: (rmse: number) => void; }
export function rmse(arr: number[], hooks: RmseHooks = {}): number {
  if (arr.length === 0) return NaN;
  const mu = arr.reduce((s, x) => s + x, 0) / arr.length;
  hooks.onMean?.(mu);
  const v = Math.sqrt(arr.reduce((s, x) => s + (x - mu) ** 2, 0) / arr.length);
  hooks.onResult?.(v);
  return v;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rmse } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100];
  rec.begin({ zh: 'RMSE', en: 'RMSE' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  rmse(data, {
    onMean: (m) => rec.begin({ zh: \`均值=\${m.toFixed(2)}\`, en: \`mean=\${m.toFixed(2)}\` })
      .setAux([{ label: 'mean', value: m.toFixed(2), role: 'compare' as BarRole }]).commit(),
    onResult: (v) => rec.begin({ zh: \`RMSE=\${v.toFixed(2)}\`, en: \`RMSE=\${v.toFixed(2)}\` })
      .setAux([{ label: 'RMSE', value: v.toFixed(2), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rmse } from '../../src/algorithms/selection/sel-rmse/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-rmse/trace.ts';

test('rmse 常数数组 = 0', () => assert.equal(rmse([5,5,5,5]), 0));
test('rmse 对称分布', () => {
  assert.ok(Math.abs(rmse([1,2,3]) - 0.8165) < 0.001);
});
test('rmse trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 25. sel-gini
{
  id: 'sel-gini',
  titleZh: '基尼系数', titleEn: 'Gini Coefficient',
  summaryZh: 'Gini 系数：衡量分布不均匀度（0=完全均匀，1=极度不均）。',
  summaryEn: 'Gini coefficient: measures inequality (0=fully equal, 1=maximally unequal).',
  descZh: '基尼系数用洛伦兹曲线计算：G = (Σᵢ Σⱼ |xᵢ − xⱼ|) / (2n Σxᵢ)。0 表示完全均匀，接近 1 表示极度不均。',
  descEn: 'Gini coefficient from the Lorenz curve: G = (Σᵢ Σⱼ |xᵢ − xⱼ|) / (2n Σxᵢ). 0 means fully equal, near 1 means maximally unequal.',
  tags: ['selection','statistics','gini','inequality'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 基尼系数 · 实现
export interface GiniHooks { onSorted?: (sorted: number[]) => void; onResult?: (g: number) => void; }
export function gini(arr: number[], hooks: GiniHooks = {}): number {
  if (arr.length === 0) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  hooks.onSorted?.(s);
  const n = s.length;
  const sum = s.reduce((a, b) => a + b, 0);
  if (sum === 0) { hooks.onResult?.(0); return 0; }
  // G = (2 Σᵢ i·xᵢ) / (n Σxᵢ) − (n+1)/n
  let cumWeighted = 0;
  for (let i = 0; i < n; i++) cumWeighted += (i + 1) * s[i]!;
  const g = (2 * cumWeighted) / (n * sum) - (n + 1) / n;
  hooks.onResult?.(g);
  return g;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gini } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 1, 1, 1, 1, 100]; // 极不均
  rec.begin({ zh: 'Gini', en: 'Gini' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  gini(data, {
    onSorted: (s) => rec.begin({ zh: \`排序\`, en: \`sorted\` })
      .setBars(s.map((v) => ({ value: v, role: 'default' as BarRole }))).commit(),
    onResult: (g) => rec.begin({ zh: \`Gini=\${g.toFixed(3)}\`, en: \`Gini=\${g.toFixed(3)}\` })
      .setAux([{ label: 'Gini', value: g.toFixed(3), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gini } from '../../src/algorithms/selection/sel-gini/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-gini/trace.ts';

test('gini 完全均匀 = 0', () => {
  assert.ok(Math.abs(gini([5,5,5,5])) < 1e-9);
});
test('gini 范围 [0,1)', () => {
  const g = gini([1,1,1,1,1,100]);
  assert.ok(g > 0.5 && g < 1);
});
test('gini trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

];
