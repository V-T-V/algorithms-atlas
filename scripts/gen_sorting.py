#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate 45 sorting algorithm folders with full impl/trace/index/meta + tests.

Each algorithm is a real, working implementation (not placeholder).
Run: python scripts/gen_sorting.py
"""
import os

ROOT = r"D:\M_X_M\algorithms-atlas\src\algorithms\sorting"
TEST_ROOT = r"D:\M_X_M\algorithms-atlas\test\sorting"

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.lstrip("\n"))

def gen(id, zh, en, szh, sen, dzh, den, tags, time, space, impl, trace, test):
    folder = os.path.join(ROOT, id)
    meta = f"""// {zh} · 元数据
import type {{ AlgorithmMeta }} from '../../../types.ts';

export const meta: AlgorithmMeta = {{
  id: '{id}',
  categoryId: 'sorting',
  title: {{ zh: '{zh}', en: '{en}' }},
  summary: {{
    zh: '{szh}',
    en: '{sen}',
  }},
  description: {{
    zh: '{dzh}',
    en: '{den}',
  }},
  tags: {tags},
  complexity: {{ time: '{time}', space: '{space}' }},
}};
"""
    index = f"""import type {{ Demo }} from '../../../types.ts';
import {{ buildTrace }} from './trace.ts';

export {{ meta }} from './meta.ts';

export async function createDemo(): Promise<Demo> {{
  const {{ meta }} = await import('./meta.ts');
  return {{ meta, buildTrace }};
}}
"""
    write(os.path.join(folder, "meta.ts"), meta)
    write(os.path.join(folder, "impl.ts"), impl)
    write(os.path.join(folder, "trace.ts"), trace)
    write(os.path.join(folder, "index.ts"), index)
    write(os.path.join(TEST_ROOT, f"{id}.test.ts"), test)

count = 0
def run(algos):
    global count
    for a in algos:
        gen(**a)
        count += 1
    print(f"Generated {count} algorithms")

# =========================================================================
# SORTING ALGORITHMS (45 total)
# =========================================================================

SORTING = []

# ---- 1. Brick sort (odd-even transposition, parallel variant) ----
SORTING.append(dict(
    id="brick-sort",
    zh="砖块排序（奇偶排序）",
    en="Brick Sort (Odd-Even Sort)",
    szh="交替执行奇数位和偶数位相邻比较交换，适合并行处理器。",
    sen="Alternately compare-swap odd-indexed and even-indexed adjacent pairs; parallel-friendly.",
    dzh="砖块排序（Odd-Even Transposition Sort）反复扫描数组：第 0、2、4… 趟比较所有 (奇,奇+1) 对并交换逆序；第 1、3、5… 趟比较所有 (偶,偶+1) 对。每对比较相互独立，故可在并行处理器上以 O(n) 时间完成一趟。串行实现复杂度 O(n^2)，最坏与冒泡排序相同，但常数略小且对已基本有序数组收敛快。稳定排序。",
    den="Brick sort (odd-even transposition sort) repeatedly sweeps the array: even phases compare all (even,even+1) pairs, odd phases compare all (odd,odd+1) pairs. Each pair is independent, so a phase runs in O(n) on parallel processors. Serial cost is O(n^2) worst case, same as bubble sort but with a slightly smaller constant and fast convergence on nearly-sorted input. Stable.",
    tags="['sorting', 'comparison', 'stable', 'parallel']",
    time="O(n^2)", space="O(1)",
    impl="""// 砖块排序（奇偶排序）· 纯算法实现
export interface BrickSortHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function brickSort(arr: readonly number[], hooks: BrickSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let sorted = false;
  while (!sorted) {
    sorted = true;
    // 偶数相位：(1,2)(3,4)...
    for (let i = 1; i < n - 1; i += 2) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) {
        [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
        sorted = false;
      }
    }
    // 奇数相位：(0,1)(2,3)...
    for (let i = 0; i < n - 1; i += 2) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) {
        [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
        sorted = false;
      }
    }
  }
  return a;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brickSort, type BrickSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: BrickSortHooks = {
    onCompare: (i, j, arr) => {
      const roles: Record<number, BarRole> = { [i]: 'compare', [j]: 'pivot' };
      rec
        .begin({ zh: `比较 a[${i}], a[${j}]`, en: `Compare a[${i}], a[${j}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = brickSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brickSort, type BrickSortHooks } from '../../src/algorithms/sorting/brick-sort/impl.ts';

test('brickSort 基本', () => {
  assert.deepEqual(brickSort([]), []);
  assert.deepEqual(brickSort([1]), [1]);
  assert.deepEqual(brickSort([2, 1]), [1, 2]);
  assert.deepEqual(brickSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('brickSort 逆序/重复', () => {
  assert.deepEqual(brickSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(brickSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('brickSort 不修改原数组', () => {
  const input = [3, 1, 2];
  brickSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('brickSort 钩子', () => {
  let c = 0;
  brickSort([3, 1, 2], { onCompare: () => c++ } as BrickSortHooks);
  assert.ok(c >= 1);
});
""",
))

# run() called at end of file

# Helper: standard test for a sort fn(id, fn) returning number[], with hooks.onCompare
def std_test(id, fn, hooks_type):
    return f"""import {{ test }} from 'node:test';
import assert from 'node:assert/strict';
import {{ {fn}, type {hooks_type} }} from '../../src/algorithms/sorting/{id}/impl.ts';

test('{id} 基本排序', () => {{
  assert.deepEqual({fn}([]), []);
  assert.deepEqual({fn}([1]), [1]);
  assert.deepEqual({fn}([2, 1]), [1, 2]);
  assert.deepEqual({fn}([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
}});
test('{id} 逆序/重复', () => {{
  assert.deepEqual({fn}([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual({fn}([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
}});
test('{id} 不修改原数组', () => {{
  const input = [3, 1, 2];
  {fn}(input);
  assert.deepEqual(input, [3, 1, 2]);
}});
test('{id} 钩子', () => {{
  let c = 0;
  {fn}([3, 1, 2], {{ onCompare: () => c++ }} as {hooks_type});
  assert.ok(c >= 1);
}});
"""

# Helper: standard bar trace with onCompare(i,j,arr)
def std_bar_trace(id, fn, hooks_type):
    return f"""import type {{ BarRole, Frame }} from '../../../types.ts';
import {{ TraceRecorder }} from '../../../core/recorder.ts';
import {{ {fn}, type {hooks_type} }} from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {{
  const rec = new TraceRecorder();
  rec
    .begin({{ zh: `初始：${{input.join(', ')}}`, en: `Initial: ${{input.join(', ')}}` }})
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: {hooks_type} = {{
    onCompare: (i: number, j: number, arr: number[]) => {{
      const roles: Record<number, BarRole> = {{ [i]: 'compare', [j]: 'pivot' }};
      rec
        .begin({{ zh: `比较 a[${{i}}], a[${{j}}]`, en: `Compare a[${{i}}], a[${{j}}]` }})
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    }},
  }};
  const result = {fn}(input, hooks);
  rec
    .begin({{ zh: `完成`, en: `Done` }})
    .setBars(result.map((v) => ({{ value: v, role: 'final' as BarRole }}))))
    .commit();
  return rec.build();
}}
"""

# ---- 2. Comb sort variant 3 (double-gap shrink) ----
SORTING.append(dict(
    id="sort-comb-3",
    zh="梳排序（双收缩因子）",
    en="Comb Sort (Double-Shrink)",
    szh="梳排序用两个交替收缩的间隔因子，加速消除小乌龟值。",
    sen="Comb sort alternating between two shrinking gaps to kill turtles faster.",
    dzh="梳排序（Comb Sort）改进自冒泡排序：用大于 1 的间隔（gap）比较并交换相距 gap 的元素，再逐步缩小 gap。本变体在奇偶趟交替使用收缩因子 1.3 与 1.25，让 gap 序列更密集地覆盖多个尺度，进一步减少尾端的小值（乌龟）气泡。最终 gap=1 时退化为标准冒泡并提前退出。不稳定，原地。",
    den="Comb sort improves on bubble sort by comparing elements a gap apart, then shrinking the gap. This variant alternates shrink factors 1.3 and 1.25 between passes so the gap sequence covers scales more densely, killing tail-end 'turtles' faster. Falls back to a bubble pass with early exit once gap reaches 1. Unstable, in-place.",
    tags="['sorting', 'comparison', 'in-place']",
    time="O(n^2)", space="O(1)",
    impl="""// 梳排序（双收缩因子）· 纯算法实现
export interface Comb3Hooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function combSort3(arr: readonly number[], hooks: Comb3Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let gap = n;
  let pass = 0;
  let swapped = true;
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / (pass % 2 === 0 ? 1.3 : 1.25)));
    swapped = false;
    for (let i = 0; i + gap < n; i++) {
      hooks.onCompare?.(i, i + gap, a);
      if (a[i]! > a[i + gap]!) {
        [a[i], a[i + gap]] = [a[i + gap]!, a[i]!];
        swapped = true;
      }
    }
    pass++;
  }
  return a;
}
""",
    trace=None,
    test=None,
))
SORTING[-1]['trace'] = std_bar_trace('sort-comb-3', 'combSort3', 'Comb3Hooks')
SORTING[-1]['test'] = std_test('sort-comb-3', 'combSort3', 'Comb3Hooks')

print("OK", len(SORTING))

# ---- 3. Pancake sort variant: min-flip (flip smallest to top each pass) ----
SORTING.append(dict(
    id="sort-pancake-min",
    zh="煎饼排序（最小值上浮）",
    en="Pancake Sort (Min-Up)",
    szh="每轮把当前最小煎饼翻到顶再翻到正确位置，n-1 轮完成排序。",
    sen="Each round flip the smallest pancake to the top then to its final slot; n-1 rounds.",
    dzh="煎饼排序（Pancake Sort）只允许用「反转前 k 个」操作（flip(k)）。本变体每轮在未排序段中找到最小值，先 flip 把它翻到顶部，再 flip 把它翻到当前未排序段最左端，使该位置定下来。共 n-1 轮，每轮最多 2 次 flip。比较次数 O(n^2)，翻转次数最多 2(n-1)。稳定与否则取决于实现细节，本实现不稳定。",
    den="Pancake sort only allows reversing the first k elements via flip(k). This variant finds the minimum in the unsorted suffix, flips it to the top, then flips it to its final leftmost slot, fixing one position per round. n-1 rounds, at most 2 flips each: O(n^2) comparisons, at most 2(n-1) flips. Unstable.",
    tags="['sorting', 'comparison', 'in-place', 'flip']",
    time="O(n^2)", space="O(1)",
    impl="""// 煎饼排序（最小值上浮）· 纯算法实现
export interface PancakeMinHooks { onFlip?: (k: number, arr: number[]) => void; }

function flip(a: number[], k: number): void {
  let l = 0, r = k;
  while (l < r) { [a[l], a[r]] = [a[r]!, a[l]!]; l++; r--; }
}

export function pancakeSortMin(arr: readonly number[], hooks: PancakeMinHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let size = n; size > 1; size--) {
    let minIdx = 0;
    for (let i = 1; i < size; i++) if (a[i]! < a[minIdx]!) minIdx = i;
    if (minIdx !== size - 1) {
      if (minIdx > 0) { flip(a, minIdx); hooks.onFlip?.(minIdx, a); }
      flip(a, size - 1); hooks.onFlip?.(size - 1, a);
    }
  }
  return a;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pancakeSortMin, type PancakeMinHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: PancakeMinHooks = {
    onFlip: (k, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let i = 0; i <= k; i++) roles[i] = 'swap';
      rec
        .begin({ zh: `反转前 ${k + 1} 个`, en: `Flip first ${k + 1}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = pancakeSortMin(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pancakeSortMin, type PancakeMinHooks } from '../../src/algorithms/sorting/sort-pancake-min/impl.ts';

test('pancakeSortMin 基本', () => {
  assert.deepEqual(pancakeSortMin([]), []);
  assert.deepEqual(pancakeSortMin([1]), [1]);
  assert.deepEqual(pancakeSortMin([2, 1]), [1, 2]);
  assert.deepEqual(pancakeSortMin([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('pancakeSortMin 逆序/重复', () => {
  assert.deepEqual(pancakeSortMin([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(pancakeSortMin([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('pancakeSortMin 不修改原数组', () => {
  const input = [3, 1, 2];
  pancakeSortMin(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('pancakeSortMin 钩子', () => {
  let c = 0;
  pancakeSortMin([3, 1, 2], { onFlip: () => c++ } as PancakeMinHooks);
  assert.ok(c >= 1);
});
""",
))

# ---- 4. Gnome sort optimized with jump-back ----
SORTING.append(dict(
    id="sort-gnome-opt",
    zh="侏儒排序（跳回优化）",
    en="Gnome Sort (Jump-Back Optimized)",
    szh="经典侏儒排序加跳跃回退：交换后跳回上次位置而非逐位回退。",
    sen="Optimized gnome sort jumps back to the previous position after a swap instead of stepping one by one.",
    dzh="侏儒排序（Gnome Sort / Stupid Sort）像花园侏儒一样逐位向右走：若当前对有序则前进，否则交换并后退。朴素版本后退一位，本优化版记录上次前进到的最远位置 pos，交换后直接跳回 pos（而非 i-1），避免重复扫描已排序段。平均复杂度仍为 O(n^2)，但对几乎有序数组接近 O(n)。稳定，原地。",
    den="Gnome sort walks right like a garden gnome: advance if the pair is ordered, else swap and step back. The naive version steps back one; this optimized variant remembers the furthest position reached and jumps back there after a swap, skipping re-scans of the sorted prefix. Still O(n^2) average but ~O(n) on nearly-sorted input. Stable, in-place.",
    tags="['sorting', 'comparison', 'stable', 'in-place']",
    time="O(n^2)", space="O(1)",
    impl="""// 侏儒排序（跳回优化）· 纯算法实现
export interface GnomeOptHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function gnomeSortOpt(arr: readonly number[], hooks: GnomeOptHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let i = 1;
  let last = 0;
  while (i < n) {
    if (i === 0 || a[i - 1]! <= a[i]!) {
      hooks.onCompare?.(i - 1, i, a);
      last = i;
      i++;
    } else {
      hooks.onCompare?.(i - 1, i, a);
      [a[i - 1], a[i]] = [a[i]!, a[i - 1]!];
      i = i === last ? i - 1 : last;
      if (i < 0) i = 1;
    }
  }
  return a;
}
""",
    trace=std_bar_trace('sort-gnome-opt', 'gnomeSortOpt', 'GnomeOptHooks'),
    test=std_test('sort-gnome-opt', 'gnomeSortOpt', 'GnomeOptHooks'),
))

print("OK", len(SORTING))

# ---- 5. Insertion sort with sentinel ----
SORTING.append(dict(
    id="sort-insertion-sentinel",
    zh="插入排序（哨兵优化）",
    en="Insertion Sort (Sentinel)",
    szh="先把最小值移到首位作哨兵，内层循环省去边界判断。",
    sen="Move the minimum to the front as a sentinel so the inner loop skips boundary checks.",
    dzh="插入排序（Insertion Sort）逐个把元素插入已排序前缀。朴素版内层循环需判断 j>0，本哨兵版先扫描一次把全局最小值交换到 a[0]，于是内层 while 永远不会越界（a[0] 必然是最小，停在 j=0），省去每次比较的边界检查，常数更小。整体复杂度不变 O(n^2)，最优 O(n)。稳定，原地。",
    den="Insertion sort inserts each element into the sorted prefix. The naive inner loop checks j>0 each time; this sentinel variant first swaps the global minimum to a[0], so the inner while never runs off the front (a[0] is smallest), removing the boundary check for a smaller constant. Complexity is still O(n^2) worst, O(n) best. Stable, in-place.",
    tags="['sorting', 'comparison', 'stable', 'in-place', 'insertion']",
    time="O(n^2)", space="O(1)",
    impl="""// 插入排序（哨兵优化）· 纯算法实现
export interface InsertSentinelHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function insertionSortSentinel(arr: readonly number[], hooks: InsertSentinelHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  // 找最小值并放到首位做哨兵
  let minIdx = 0;
  for (let i = 1; i < n; i++) if (a[i]! < a[minIdx]!) minIdx = i;
  if (minIdx !== 0) [a[0], a[minIdx]] = [a[minIdx]!, a[0]!];
  for (let i = 2; i < n; i++) {
    const v = a[i]!;
    let j = i;
    while (a[j - 1]! > v) {
      hooks.onCompare?.(j - 1, j, a);
      a[j] = a[j - 1]!;
      j--;
    }
    a[j] = v;
  }
  return a;
}
""",
    trace=std_bar_trace('sort-insertion-sentinel', 'insertionSortSentinel', 'InsertSentinelHooks'),
    test=std_test('sort-insertion-sentinel', 'insertionSortSentinel', 'InsertSentinelHooks'),
))

# ---- 6. Shell sort with Ciura gap sequence ----
SORTING.append(dict(
    id="sort-shell-ciura",
    zh="希尔排序（Ciura 间隔）",
    en="Shell Sort (Ciura Gaps)",
    szh="使用 Marcin Ciura 实验得出的最优间隔序列的希尔排序。",
    sen="Shell sort using Marcin Ciura's experimentally-optimal gap sequence.",
    dzh="希尔排序（Shell Sort）是带间隔的插入排序：先按大间隔分组做插入排序，再逐步缩小间隔直到 1。间隔序列决定性能。Marcin Ciura 通过实验找到了一组接近最优的间隔 [1,4,10,23,57,132,301,701,1750]，实际复杂度约 O(n log n)~O(n^1.25)。本实现从不超过 n 的最大 Ciura 间隔开始递减。不稳定，原地。",
    den="Shell sort is insertion sort with a gap: sort groups spaced by gap, then shrink the gap to 1. The gap sequence dominates performance. Marcin Ciura experimentally found a near-optimal sequence [1,4,10,23,57,132,301,701,1750], giving roughly O(n log n)~O(n^1.25). This implementation starts from the largest Ciura gap not exceeding n. Unstable, in-place.",
    tags="['sorting', 'comparison', 'in-place', 'shell']",
    time="O(n^1.25)", space="O(1)",
    impl="""// 希尔排序（Ciura 间隔）· 纯算法实现
export interface ShellCiuraHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

const CIURA_GAPS = [1, 4, 10, 23, 57, 132, 301, 701, 1750, 3937];

export function shellSortCiura(arr: readonly number[], hooks: ShellCiuraHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const gaps: number[] = [];
  for (let k = CIURA_GAPS.length - 1; k >= 0; k--) if (CIURA_GAPS[k]! < n) gaps.push(CIURA_GAPS[k]!);
  for (const gap of gaps) {
    for (let i = gap; i < n; i++) {
      const v = a[i]!;
      let j = i;
      while (j >= gap && a[j - gap]! > v) {
        hooks.onCompare?.(j - gap, j, a);
        a[j] = a[j - gap]!;
        j -= gap;
      }
      a[j] = v;
    }
  }
  return a;
}
""",
    trace=std_bar_trace('sort-shell-ciura', 'shellSortCiura', 'ShellCiuraHooks'),
    test=std_test('sort-shell-ciura', 'shellSortCiura', 'ShellCiuraHooks'),
))

# ---- 7. Bubble sort with last-swap optimization ----
SORTING.append(dict(
    id="sort-bubble-lastswap",
    zh="冒泡排序（末次交换优化）",
    en="Bubble Sort (Last-Swap Bound)",
    szh="记录每趟最后一次交换的位置作为下趟的右边界，跳过已排好尾部。",
    sen="Record the last swap index each pass as the next pass's right bound, skipping the sorted tail.",
    dzh="冒泡排序（Bubble Sort）每趟把最大值冒泡到末尾。优化版记录每趟最后一次发生交换的位置 lastSwap，则该位置之后已有序，下趟只需扫描到 lastSwap。对几乎有序的输入可大幅减少比较次数，最优降为 O(n)。本实现即此「末次交换边界」优化。稳定，原地。",
    den="Bubble sort bubbles the largest element to the end each pass. The optimized variant records the last swap index; everything after it is already sorted, so the next pass only scans up to that index. This dramatically cuts comparisons on nearly-sorted input, reaching O(n) best case. Stable, in-place.",
    tags="['sorting', 'comparison', 'stable', 'in-place', 'bubble']",
    time="O(n^2)", space="O(1)",
    impl="""// 冒泡排序（末次交换优化）· 纯算法实现
export interface BubbleLastSwapHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function bubbleSortLastSwap(arr: readonly number[], hooks: BubbleLastSwapHooks = {}): number[] {
  const a = [...arr];
  let hi = a.length;
  while (hi > 1) {
    let lastSwap = 0;
    for (let i = 1; i < hi; i++) {
      hooks.onCompare?.(i - 1, i, a);
      if (a[i - 1]! > a[i]!) {
        [a[i - 1], a[i]] = [a[i]!, a[i - 1]!];
        lastSwap = i;
      }
    }
    hi = lastSwap;
  }
  return a;
}
""",
    trace=std_bar_trace('sort-bubble-lastswap', 'bubbleSortLastSwap', 'BubbleLastSwapHooks'),
    test=std_test('sort-bubble-lastswap', 'bubbleSortLastSwap', 'BubbleLastSwapHooks'),
))

print("OK", len(SORTING))

# ---- 8. Selection sort (bidirectional / double-ended) ----
SORTING.append(dict(
    id="sort-selection-bidir",
    zh="选择排序（双向）",
    en="Selection Sort (Bidirectional)",
    szh="每轮同时选出最小和最大，分别放到两端，趟数减半。",
    sen="Each round pick both min and max, placing them at the two ends; halves the rounds.",
    dzh="双向选择排序（Double Selection Sort / Cocktail Selection）每轮在未排序段 [lo, hi] 中同时找最小值和最大值：最小值放 lo，最大值放 hi，然后 lo++、hi--。比单向选择排序少了约一半的轮数，但每轮比较次数略多（同时维护 min 和 max）。需注意当最大值恰在 lo 时的索引修正。比较次数仍 O(n^2)，不稳定，原地。",
    den="Bidirectional (double) selection sort finds both min and max in the unsorted window [lo,hi] each round: place min at lo, max at hi, then lo++, hi--. This halves the number of rounds versus one-way selection while each round does slightly more work (tracking min and max together), with a fixup when the max sits at lo. Still O(n^2) comparisons, unstable, in-place.",
    tags="['sorting', 'comparison', 'in-place', 'selection']",
    time="O(n^2)", space="O(1)",
    impl="""// 选择排序（双向）· 纯算法实现
export interface SelectionBidirHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function selectionSortBidir(arr: readonly number[], hooks: SelectionBidirHooks = {}): number[] {
  const a = [...arr];
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    let mn = lo, mx = lo;
    for (let i = lo + 1; i <= hi; i++) {
      hooks.onCompare?.(i, mn, a);
      if (a[i]! < a[mn]!) mn = i;
      if (a[i]! >= a[mx]!) mx = i;
    }
    [a[lo], a[mn]] = [a[mn]!, a[lo]!];
    if (mx === lo) mx = mn;
    [a[hi], a[mx]] = [a[mx]!, a[hi]!];
    lo++; hi--;
  }
  return a;
}
""",
    trace=std_bar_trace('sort-selection-bidir', 'selectionSortBidir', 'SelectionBidirHooks'),
    test=std_test('sort-selection-bidir', 'selectionSortBidir', 'SelectionBidirHooks'),
))

# ---- 9. Merge sort bottom-up (iterative) ----
SORTING.append(dict(
    id="sort-merge-bottomup",
    zh="归并排序（自底向上迭代）",
    en="Merge Sort (Bottom-Up Iterative)",
    szh="迭代地归并长度 1,2,4,8... 的子段，无需递归。",
    sen="Iteratively merge runs of length 1,2,4,8... without recursion.",
    dzh="归并排序（Merge Sort）分治：自顶向下递归版先拆再合；自底向上迭代版直接从长度为 1 的子段开始，两两归并成长度 2，再 4、8... 直到整段有序。完全避免递归栈，空间 O(n)。时间 O(n log n) 稳定。适合链表或不希望递归的环境。",
    den="Merge sort divide-and-conquer: the top-down recursive version splits then merges; the bottom-up iterative version starts from length-1 runs and merges pairs into length 2, then 4, 8... until the whole array is ordered. It avoids the recursion stack entirely, using O(n) auxiliary space and O(n log n) time. Stable. Good for linked lists or recursion-free environments.",
    tags="['sorting', 'comparison', 'stable', 'divide-and-conquer', 'iterative']",
    time="O(n log n)", space="O(n)",
    impl="""// 归并排序（自底向上）· 纯算法实现
export interface MergeBottomUpHooks { onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void; }

export function mergeSortBottomUp(arr: readonly number[], hooks: MergeBottomUpHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const aux = new Array<number>(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      for (let k = lo; k < hi; k++) aux[k] = a[k]!;
      let i = lo, j = mid, k = lo;
      while (i < mid && j < hi) {
        if (aux[i]! <= aux[j]!) a[k++] = aux[i++]!;
        else a[k++] = aux[j++]!;
      }
      while (i < mid) a[k++] = aux[i++]!;
      while (j < hi) a[k++] = aux[j++]!;
      hooks.onMerge?.(lo, mid, hi, a);
    }
  }
  return a;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortBottomUp, type MergeBottomUpHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MergeBottomUpHooks = {
    onMerge: (lo, mid, hi, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lo; k < hi; k++) roles[k] = 'frontier';
      rec
        .begin({ zh: `归并 [${lo},${hi})`, en: `Merge [${lo},${hi})` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = mergeSortBottomUp(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSortBottomUp, type MergeBottomUpHooks } from '../../src/algorithms/sorting/sort-merge-bottomup/impl.ts';

test('mergeSortBottomUp 基本', () => {
  assert.deepEqual(mergeSortBottomUp([]), []);
  assert.deepEqual(mergeSortBottomUp([1]), [1]);
  assert.deepEqual(mergeSortBottomUp([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortBottomUp([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortBottomUp 逆序/重复', () => {
  assert.deepEqual(mergeSortBottomUp([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortBottomUp([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortBottomUp 不修改原数组', () => {
  const input = [3, 1, 2];
  mergeSortBottomUp(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('mergeSortBottomUp 钩子', () => {
  let c = 0;
  mergeSortBottomUp([3, 1, 2], { onMerge: () => c++ } as MergeBottomUpHooks);
  assert.ok(c >= 1);
});
""",
))

# ---- 10. Quick sort 3-way (Dutch national flag) ----
SORTING.append(dict(
    id="sort-quick-3way",
    zh="快速排序（三路划分）",
    en="Quick Sort (3-Way Partition)",
    szh="Dijkstra 三路划分：按 <,=,pivot 三段递归，高效处理大量重复键。",
    sen="Dijkstra's 3-way partition splits into <,=,pivot segments; fast on many duplicate keys.",
    dzh="三路快速排序（3-Way Quick Sort / Dutch National Flag）由 Dijkstra 提出。普通快排对大量重复键退化，三路版在划分时把数组分成 [lo, lt) < pivot、[lt, gt] = pivot、(gt, hi] > pivot 三段，只对 < 和 > 两段递归，等于 pivot 的段直接定下来。对含大量重复元素的输入接近 O(n)。平均 O(n log n)，原地但递归栈 O(log n)。",
    den="3-way quicksort (Dutch national flag), due to Dijkstra, partitions the array into < pivot, = pivot, > pivot and recurses only on the < and > segments, fixing the equal segment in place. This avoids the O(n^2) blowup of ordinary quicksort on many duplicate keys, approaching O(n) for heavily-duplicated input. Average O(n log n), in-place with O(log n) recursion.",
    tags="['sorting', 'comparison', 'in-place', 'divide-and-conquer', 'duplicates']",
    time="O(n log n)", space="O(log n)",
    impl="""// 快速排序（三路划分）· 纯算法实现
export interface Quick3WayHooks { onPivot?: (idx: number, arr: number[]) => void; onPartition?: (lt: number, gt: number, arr: number[]) => void; }

function sort3(a: number[], lo: number, hi: number, hooks: Quick3WayHooks): void {
  if (lo >= hi) return;
  const pivot = a[lo]!;
  hooks.onPivot?.(lo, a);
  let lt = lo, gt = hi, i = lo + 1;
  while (i <= gt) {
    if (a[i]! < pivot) { [a[lt], a[i]] = [a[i]!, a[lt]!]; lt++; i++; }
    else if (a[i]! > pivot) { [a[i], a[gt]] = [a[gt]!, a[i]!]; gt--; }
    else i++;
  }
  hooks.onPartition?.(lt, gt, a);
  sort3(a, lo, lt - 1, hooks);
  sort3(a, gt + 1, hi, hooks);
}

export function quickSort3Way(arr: readonly number[], hooks: Quick3WayHooks = {}): number[] {
  const a = [...arr];
  sort3(a, 0, a.length - 1, hooks);
  return a;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickSort3Way, type Quick3WayHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 3, 8, 3, 9, 3, 7, 4, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${in
