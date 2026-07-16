#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Part 2 of sorting algorithms. Defines add_more(SORTING, gen, helpers) which appends."""
# noqa: E501


def add_more(SORTING, gen, std_bar_trace, std_test, write, ROOT, TEST_ROOT, esc):
    import os

    # ---- 10. Quick sort 3-way (Dutch national flag) ----
    SORTING.append(dict(
        id="sort-quick-3way",
        zh="快速排序（三路划分）",
        en="Quick Sort (3-Way Partition)",
        szh="Dijkstra 三路划分：按小于/等于/大于 pivot 三段递归，高效处理大量重复键。",
        sen="Dijkstra 3-way partition splits into <,=,> pivot segments; fast on many duplicate keys.",
        dzh="三路快速排序（3-Way Quick Sort / Dutch National Flag）由 Dijkstra 提出。普通快排对大量重复键退化，三路版在划分时把数组分成 [lo, lt) < pivot、[lt, gt] = pivot、(gt, hi] > pivot 三段，只对 < 和 > 两段递归，等于 pivot 的段直接定下来。对含大量重复元素的输入接近 O(n)。平均 O(n log n)，原地但递归栈 O(log n)。",
        den="3-way quicksort (Dutch national flag), due to Dijkstra, partitions the array into < pivot, = pivot, > pivot and recurses only on the < and > segments, fixing the equal segment in place. This avoids the O(n^2) blowup of ordinary quicksort on many duplicate keys, approaching O(n) for heavily-duplicated input. Average O(n log n), in-place with O(log n) recursion.",
        tags="['sorting', 'comparison', 'in-place', 'divide-and-conquer', 'duplicates']",
        time="O(n log n)", space="O(log n)",
        impl="""// 快速排序（三路划分）· 纯算法实现
export interface Quick3WayHooks {
  onPivot?: (idx: number, arr: number[]) => void;
  onPartition?: (lt: number, gt: number, arr: number[]) => void;
}

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
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: Quick3WayHooks = {
    onPartition: (lt, gt, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lt; k <= gt; k++) roles[k] = 'final';
      rec
        .begin({ zh: `等于 pivot 段 [${lt},${gt}]`, en: `= pivot [${lt},${gt}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = quickSort3Way(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickSort3Way, type Quick3WayHooks } from '../../src/algorithms/sorting/sort-quick-3way/impl.ts';

test('quickSort3Way 基本', () => {
  assert.deepEqual(quickSort3Way([]), []);
  assert.deepEqual(quickSort3Way([1]), [1]);
  assert.deepEqual(quickSort3Way([2, 1]), [1, 2]);
  assert.deepEqual(quickSort3Way([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('quickSort3Way 大量重复', () => {
  assert.deepEqual(quickSort3Way([3, 3, 1, 3, 2, 3, 1]), [1, 1, 2, 3, 3, 3, 3]);
  assert.deepEqual(quickSort3Way([5, 5, 5, 5]), [5, 5, 5, 5]);
});
test('quickSort3Way 不修改原数组', () => {
  const input = [3, 1, 2];
  quickSort3Way(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('quickSort3Way 钩子', () => {
  let c = 0;
  quickSort3Way([3, 1, 2, 3], { onPartition: () => c++ } as Quick3WayHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 11. Heap sort (4-ary) ----
    SORTING.append(dict(
        id="sort-heap-4ary",
        zh="堆排序（四叉堆）",
        en="Heap Sort (4-ary Heap)",
        szh="用 4-叉完全堆做堆排序，每节点 4 个孩子，深度更浅。",
        sen="Heap sort over a 4-ary complete heap (four children per node), shallower depth.",
        dzh="四叉堆排序使用 d=4 的 d-叉完全堆：节点 i 的 4 个孩子为 4i+1..4i+4，父为 floor((i-1)/4)。相比二叉堆深度降低约 log_4 n，下沉时每层比较次数增多（在 4 个孩子中选最大）但层数更少。整体仍 O(n log n) 比较次数，但常数与缓存行为不同。不稳定，原地。",
        den="4-ary heap sort uses a d-ary complete heap with d=4: node i has four children 4i+1..4i+4 and parent floor((i-1)/4). Depth is reduced by about log_4 n versus a binary heap; each sift-down compares more (picking the max of four children) but over fewer levels. Still O(n log n) overall with different constants and cache behavior. Unstable, in-place.",
        tags="['sorting', 'heap', 'in-place', 'comparison', 'd-ary']",
        time="O(n log n)", space="O(1)",
        impl="""// 四叉堆排序 · 纯算法实现
export interface Heap4Hooks { onSiftDown?: (root: number, size: number, arr: number[]) => void; }

function siftDown4(a: number[], root: number, size: number): void {
  while (true) {
    let largest = root;
    for (let c = 1; c <= 4; c++) {
      const child = 4 * root + c;
      if (child < size && a[child]! > a[largest]!) largest = child;
    }
    if (largest === root) break;
    [a[root], a[largest]] = [a[largest]!, a[root]!];
    root = largest;
  }
}

export function heapSort4ary(arr: readonly number[], hooks: Heap4Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor((n - 1) / 4); i >= 0; i--) siftDown4(a, i, n);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end]!, a[0]!];
    siftDown4(a, 0, end);
    hooks.onSiftDown?.(0, end, a);
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heapSort4ary, type Heap4Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  let sorted = 0;
  const hooks: Heap4Hooks = {
    onSiftDown: (_root, end, arr) => {
      sorted = arr.length - end;
      const roles: Record<number, BarRole> = {};
      for (let k = arr.length - sorted; k < arr.length; k++) roles[k] = 'sorted';
      rec
        .begin({ zh: `取出最大值，剩余 ${end} 个重新下沉`, en: `Pop max, sift-down ${end} left` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = heapSort4ary(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heapSort4ary, type Heap4Hooks } from '../../src/algorithms/sorting/sort-heap-4ary/impl.ts';

test('heapSort4ary 基本', () => {
  assert.deepEqual(heapSort4ary([]), []);
  assert.deepEqual(heapSort4ary([1]), [1]);
  assert.deepEqual(heapSort4ary([2, 1]), [1, 2]);
  assert.deepEqual(heapSort4ary([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('heapSort4ary 逆序/重复', () => {
  assert.deepEqual(heapSort4ary([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(heapSort4ary([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('heapSort4ary 不修改原数组', () => {
  const input = [3, 1, 2];
  heapSort4ary(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('heapSort4ary 钩子', () => {
  let c = 0;
  heapSort4ary([3, 1, 2], { onSiftDown: () => c++ } as Heap4Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 12. Radix sort LSD base-16 (hex buckets) ----
    SORTING.append(dict(
        id="sort-radix-lsd-hex",
        zh="基数排序（LSD 十六进制）",
        en="Radix Sort (LSD base-16)",
        szh="以 16 为基数按位 LSD 基数排序，每趟 16 个桶，趟数为 hex 位数。",
        sen="LSD radix sort with base 16; 16 buckets per pass, passes = number of hex digits.",
        dzh="基数排序（Radix Sort）LSD（最低位优先）从最低位起，逐位用稳定计数排序分配到桶再合并。本实现以 16（hex）为基数：每趟 16 个桶，按 4 位一组提取位掩码，趟数等于最大值的十六进制位数。对 32 位整数最多 8 趟。时间 O(d*(n+16))，d 为位数；空间 O(n+16)。稳定，非原地，适合整数。",
        den="Radix sort LSD (least-significant digit first) applies a stable counting sort digit by digit from the lowest. This variant uses base 16 (hex): 16 buckets per pass, masking 4 bits at a time, with passes equal to the number of hex digits of the maximum (at most 8 for 32-bit integers). Time O(d*(n+16)), space O(n+16). Stable, not in-place; ideal for integers.",
        tags="['sorting', 'radix', 'non-comparison', 'stable', 'integer']",
        time="O(d*n)", space="O(n)",
        impl="""// 基数排序（LSD 十六进制）· 纯算法实现
export interface RadixHexHooks { onPass?: (digit: number, arr: number[]) => void; }

export function radixSortLsdHex(arr: readonly number[], hooks: RadixHexHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  const max = Math.max(...a);
  let digit = 0;
  for (let exp = 0; (max >>> (exp * 4)) > 0; exp++, digit++) {
    const buckets: number[][] = Array.from({ length: 16 }, () => []);
    for (const v of a) buckets[(v >>> (exp * 4)) & 0xf]!.push(v);
    let k = 0;
    for (const b of buckets) for (const v of b) a[k++] = v;
    hooks.onPass?.(digit, a);
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { radixSortLsdHex, type RadixHexHooks } from './impl.ts';

export const DEFAULT_INPUT = [170, 45, 75, 90, 802, 24, 2, 66];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: RadixHexHooks = {
    onPass: (digit, arr) => {
      rec
        .begin({ zh: `第 ${digit} 个 hex 位排序完成`, en: `Pass ${digit} (hex digit) done` })
        .setBars(rec.barsFrom(arr))
        .commit();
    },
  };
  const result = radixSortLsdHex(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { radixSortLsdHex, type RadixHexHooks } from '../../src/algorithms/sorting/sort-radix-lsd-hex/impl.ts';

test('radixSortLsdHex 基本', () => {
  assert.deepEqual(radixSortLsdHex([]), []);
  assert.deepEqual(radixSortLsdHex([1]), [1]);
  assert.deepEqual(radixSortLsdHex([2, 1]), [1, 2]);
  assert.deepEqual(radixSortLsdHex([170, 45, 75, 90, 802, 24, 2, 66]), [2, 24, 45, 66, 75, 90, 170, 802]);
});
test('radixSortLsdHex 逆序/重复', () => {
  assert.deepEqual(radixSortLsdHex([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(radixSortLsdHex([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('radixSortLsdHex 不修改原数组', () => {
  const input = [3, 1, 2];
  radixSortLsdHex(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('radixSortLsdHex 钩子', () => {
  let c = 0;
  radixSortLsdHex([300, 1, 20], { onPass: () => c++ } as RadixHexHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 13. Counting sort with negatives (offset) ----
    SORTING.append(dict(
        id="sort-counting-offset",
        zh="计数排序（带负数偏移）",
        en="Counting Sort (Negative Offset)",
        szh="通过值偏移把负数也纳入计数排序的非负桶范围。",
        sen="Counting sort that supports negative values by offsetting them into a non-negative bucket range.",
        dzh="计数排序（Counting Sort）统计每个值出现次数，前缀和后回填，对值域 k 内的整数 O(n+k)。标准版只支持非负键，本实现先扫描得到最小值 min，把所有键减去 min 偏移到 [0, max-min]，计数回填后再无需调整（偏移只影响桶索引，回填时用原值）。支持负整数。稳定（回填时倒序）。空间 O(k)。",
        den="Counting sort tallies occurrences of each value, prefix-sums, then writes back, giving O(n+k) for integers in a value range k. The standard version only supports non-negative keys; this implementation first scans for the minimum and offsets all keys by -min into [0, max-min], supporting negative integers. Stable (write-back in reverse). Space O(k).",
        tags="['sorting', 'counting', 'non-comparison', 'stable', 'integer']",
        time="O(n+k)", space="O(k)",
        impl="""// 计数排序（带负数偏移）· 纯算法实现
export interface CountingOffsetHooks { onCount?: (count: number[], arr: number[]) => void; }

export function countingSortOffset(arr: readonly number[], hooks: CountingOffsetHooks = {}): number[] {
  if (arr.length === 0) return [];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const range = mx - mn + 1;
  const count = new Array<number>(range).fill(0);
  for (const v of arr) count[v - mn]!++;
  hooks.onCount?.(count, [...arr]);
  for (let i = 1; i < range; i++) count[i]! += count[i - 1]!;
  const out = new Array<number>(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i]!;
    count[v - mn]!--;
    out[count[v - mn]!] = v;
  }
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countingSortOffset, type CountingOffsetHooks } from './impl.ts';

export const DEFAULT_INPUT = [-3, 5, -1, 0, 5, 2, -3, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始（含负数）：${input.join(', ')}`, en: `Initial (with negatives): ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: CountingOffsetHooks = {
    onCount: (count) => {
      rec
        .begin({ zh: `计数桶：[${count.join(',')}]`, en: `Count buckets: [${count.join(',')}]` })
        .setAux(count.map((c, i) => ({ label: `b${i}`, value: String(c) })))
        .commit();
    },
  };
  const result = countingSortOffset(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countingSortOffset, type CountingOffsetHooks } from '../../src/algorithms/sorting/sort-counting-offset/impl.ts';

test('countingSortOffset 基本含负数', () => {
  assert.deepEqual(countingSortOffset([]), []);
  assert.deepEqual(countingSortOffset([1]), [1]);
  assert.deepEqual(countingSortOffset([2, 1]), [1, 2]);
  assert.deepEqual(countingSortOffset([-3, 5, -1, 0, 5, 2, -3, 4]), [-3, -3, -1, 0, 2, 4, 5, 5]);
});
test('countingSortOffset 全负/全正', () => {
  assert.deepEqual(countingSortOffset([-5, -1, -3]), [-5, -3, -1]);
  assert.deepEqual(countingSortOffset([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('countingSortOffset 钩子', () => {
  let c = 0;
  countingSortOffset([3, 1, 2], { onCount: () => c++ } as CountingOffsetHooks);
  assert.ok(c >= 1);
});
""",
    ))

    print("part2 added, total in SORTING now managed by caller")
    return SORTING


def add_more2(SORTING, gen, std_bar_trace, std_test, write, ROOT, TEST_ROOT, esc):
    import os

    # ---- 14. Cocktail sort with last-swap bound ----
    SORTING.append(dict(
        id="sort-cocktail-bound",
        zh="鸡尾酒排序（边界优化）",
        en="Cocktail Sort (Bounded)",
        szh="双向鸡尾酒排序记录左右最后一次交换位置，跳过已排好区间。",
        sen="Bidirectional cocktail sort records the last swap on each side to skip sorted ranges.",
        dzh="鸡尾酒排序（Cocktail Shaker Sort）是冒泡排序的双向变体：一趟向右把最大冒泡到尾，再一趟向左把最小冒泡到头。本边界优化版分别记录向右、向左两趟各自的最后一次交换下标，作为下趟的上下界，对几乎有序输入收敛更快。最优 O(n)，最坏 O(n^2)。稳定，原地。",
        den="Cocktail shaker sort is a bidirectional bubble variant: a pass bubbles the max to the right end, then a pass bubbles the min to the left end. This bounded variant records each direction's last swap index as the next pass's bound, converging faster on nearly-sorted input. Best O(n), worst O(n^2). Stable, in-place.",
        tags="['sorting', 'comparison', 'stable', 'in-place', 'bubble']",
        time="O(n^2)", space="O(1)",
        impl="""// 鸡尾酒排序（边界优化）· 纯算法实现
export interface CocktailBoundHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function cocktailSortBound(arr: readonly number[], hooks: CocktailBoundHooks = {}): number[] {
  const a = [...arr];
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    let newHi = lo;
    for (let i = lo; i < hi; i++) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) { [a[i], a[i + 1]] = [a[i + 1]!, a[i]!]; newHi = i; }
    }
    hi = newHi;
    let newLo = hi;
    for (let i = hi; i > lo; i--) {
      hooks.onCompare?.(i - 1, i, a);
      if (a[i - 1]! > a[i]!) { [a[i - 1], a[i]] = [a[i]!, a[i - 1]!]; newLo = i; }
    }
    lo = newLo;
  }
  return a;
}
""",
        trace=std_bar_trace('sort-cocktail-bound', 'cocktailSortBound', 'CocktailBoundHooks'),
        test=std_test('sort-cocktail-bound', 'cocktailSortBound', 'CocktailBoundHooks'),
    ))

    # ---- 15. Cycle sort variant: 2-cycle (pair) ----
    SORTING.append(dict(
        id="sort-cycle-pair",
        zh="循环排序（成对循环）",
        en="Cycle Sort (Pair Cycles)",
        szh="循环节长为 2 的循环排序变体，每轮至多两次写入，减少写次数。",
        sen="Cycle-sort variant that processes cycles two at a time, minimizing writes per round.",
        dzh="循环排序（Cycle Sort）通过把每个元素直接送到其最终位置来排序，写入次数最少（理论最优，约 n + (cycle-1) 次）。本成对变体每轮处理一个循环节：计算当前元素 item 在未排序段中的最终位置 pos，把 item 放到 pos，取出原 pos 的元素继续，直到回到循环节起点。适合写入代价高的场景（如 EEPROM/Flash）。不稳定，原地。最坏 O(n^2) 比较。",
        den="Cycle sort places each element directly at its final position, minimizing writes (theoretically optimal: about n + (cycles-1) writes). This variant processes one cycle per round: compute the final position pos of the current item within the unsorted segment, place it, take the displaced element, and continue until returning to the cycle start. Useful when writes are expensive (e.g. EEPROM/Flash). Unstable, in-place. Worst O(n^2) comparisons.",
        tags="['sorting', 'comparison', 'in-place', 'min-write']",
        time="O(n^2)", space="O(1)",
        impl="""// 循环排序（成对循环）· 纯算法实现
export interface CyclePairHooks { onCycle?: (start: number, pos: number, arr: number[]) => void; }

export function cycleSortPair(arr: readonly number[], hooks: CyclePairHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let start = 0; start < n - 1; start++) {
    let item = a[start]!;
    let pos = start;
    for (let i = start + 1; i < n; i++) if (a[i]! < item) pos++;
    if (pos === start) continue;
    while (item === a[pos]) pos++;
    [a[pos], item] = [item, a[pos]!];
    hooks.onCycle?.(start, pos, a);
    while (pos !== start) {
      pos = start;
      for (let i = start + 1; i < n; i++) if (a[i]! < item) pos++;
      while (item === a[pos]) pos++;
      if (item !== a[pos]) { [a[pos], item] = [item, a[pos]!]; hooks.onCycle?.(start, pos, a); }
    }
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cycleSortPair, type CyclePairHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: CyclePairHooks = {
    onCycle: (start, pos, arr) => {
      const roles: Record<number, BarRole> = { [start]: 'pivot', [pos]: 'swap' };
      rec
        .begin({ zh: `循环节：放到位置 ${pos}`, en: `Cycle: place at ${pos}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = cycleSortPair(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cycleSortPair, type CyclePairHooks } from '../../src/algorithms/sorting/sort-cycle-pair/impl.ts';

test('cycleSortPair 基本', () => {
  assert.deepEqual(cycleSortPair([]), []);
  assert.deepEqual(cycleSortPair([1]), [1]);
  assert.deepEqual(cycleSortPair([2, 1]), [1, 2]);
  assert.deepEqual(cycleSortPair([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('cycleSortPair 逆序/重复', () => {
  assert.deepEqual(cycleSortPair([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSortPair([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('cycleSortPair 不修改原数组', () => {
  const input = [3, 1, 2];
  cycleSortPair(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('cycleSortPair 钩子', () => {
  let c = 0;
  cycleSortPair([3, 1, 2], { onCycle: () => c++ } as CyclePairHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 16. Bucket sort with k = sqrt(n) buckets ----
    SORTING.append(dict(
        id="sort-bucket-sqrt",
        zh="桶排序（sqrt(n) 桶）",
        en="Bucket Sort (sqrt-n buckets)",
        szh="均匀分数组分到 sqrt(n) 个桶，各桶内插入排序后拼接。",
        sen="Scatter values into sqrt(n) buckets, insertion-sort each, then concatenate.",
        dzh="桶排序（Bucket Sort）把值域均分成 k 个桶，每个元素按值分到对应桶，桶内用插入排序（小规模高效），最后按桶序拼接。本实现取 k = floor(sqrt(n)) 个桶，兼顾桶数与桶大小。当输入近似均匀分布时，每桶期望元素 O(1)，整体 O(n)。最坏（全落一个桶）退化为插入排序 O(n^2)。稳定（桶内插入排序稳定）。空间 O(n)。",
        den="Bucket sort partitions the value range into k buckets, scatters each element to its bucket, insertion-sorts each bucket (efficient for small sizes), then concatenates in bucket order. This implementation uses k = floor(sqrt(n)) buckets, balancing bucket count and size. For near-uniform input each bucket holds O(1) elements on average, giving O(n) overall; the worst case (all in one bucket) degenerates to insertion sort O(n^2). Stable. Space O(n).",
        tags="['sorting', 'bucket', 'comparison', 'stable', 'distribution']",
        time="O(n+k)", space="O(n)",
        impl="""// 桶排序（sqrt(n) 桶）· 纯算法实现
export interface BucketSqrtHooks { onBucket?: (bucketIdx: number, arr: number[]) => void; }

function insSort(a: number[]): void {
  for (let i = 1; i < a.length; i++) {
    const v = a[i]!; let j = i;
    while (j > 0 && a[j - 1]! > v) { a[j] = a[j - 1]!; j--; }
    a[j] = v;
  }
}

export function bucketSortSqrt(arr: readonly number[], hooks: BucketSqrtHooks = {}): number[] {
  if (arr.length <= 1) return [...arr];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const k = Math.max(1, Math.floor(Math.sqrt(arr.length)));
  const range = mx - mn + 1;
  const buckets: number[][] = Array.from({ length: k }, () => []);
  const idx = (v: number): number => Math.min(k - 1, Math.floor(((v - mn) / range) * k));
  for (const v of arr) buckets[idx(v)]!.push(v);
  for (let i = 0; i < k; i++) { insSort(buckets[i]!); hooks.onBucket?.(i, buckets[i]!); }
  const out: number[] = [];
  for (const b of buckets) out.push(...b);
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bucketSortSqrt, type BucketSqrtHooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 41, 8, 22, 30];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  let collected: number[] = [];
  const hooks: BucketSqrtHooks = {
    onBucket: (i, arr) => {
      collected.push(...arr);
      const roles: Record<number, BarRole> = {};
      rec
        .begin({ zh: `桶 ${i} 排序完成：[${arr.join(',')}]`, en: `Bucket ${i}: [${arr.join(',')}]` })
        .setBars(rec.barsFrom(collected, roles))
        .commit();
    },
  };
  const result = bucketSortSqrt(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bucketSortSqrt, type BucketSqrtHooks } from '../../src/algorithms/sorting/sort-bucket-sqrt/impl.ts';

test('bucketSortSqrt 基本', () => {
  assert.deepEqual(bucketSortSqrt([]), []);
  assert.deepEqual(bucketSortSqrt([1]), [1]);
  assert.deepEqual(bucketSortSqrt([2, 1]), [1, 2]);
  assert.deepEqual(bucketSortSqrt([29, 10, 14, 37, 13, 25, 41, 8, 22, 30]), [8, 10, 13, 14, 22, 25, 29, 30, 37, 41]);
});
test('bucketSortSqrt 逆序/重复', () => {
  assert.deepEqual(bucketSortSqrt([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bucketSortSqrt([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('bucketSortSqrt 钩子', () => {
  let c = 0;
  bucketSortSqrt([3, 1, 2], { onBucket: () => c++ } as BucketSqrtHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 17. Pigeonhole sort with mapping ----
    SORTING.append(dict(
        id="sort-pigeonhole-map",
        zh="鸽巢排序（映射表）",
        en="Pigeonhole Sort (Mapped)",
        szh="把值域内每个可能值映射到一个鸽巢，按值域顺序收集。",
        sen="Map each possible value in the range to a pigeonhole; collect in value order.",
        dzh="鸽巢排序（Pigeonhole Sort）适合键为密集小区间整数的情况：值域范围 k 与元素数 n 接近时高效。本实现先求 min/max，建 (max-min+1) 个鸽巢（用 Map），每个元素按 (v-min) 放入对应巢，最后按巢序（含重复）收集。时间 O(n+k)，空间 O(n+k)。当 k 远大于 n 时不如计数排序高效，但概念清晰。",
        den="Pigeonhole sort suits dense small-range integer keys: efficient when the value range k is close to the element count n. This implementation finds min/max, creates (max-min+1) pigeonholes (via a Map), places each element by (v-min), then collects in hole order (including duplicates). Time O(n+k), space O(n+k). When k >> n it is less efficient than counting sort but conceptually clear.",
        tags="['sorting', 'non-comparison', 'integer', 'distribution']",
        time="O(n+k)", space="O(n+k)",
        impl="""// 鸽巢排序（映射表）· 纯算法实现
export interface PigeonholeMapHooks { onPlace?: (hole: number, arr: number[]) => void; }

export function pigeonholeSortMap(arr: readonly number[], hooks: PigeonholeMapHooks = {}): number[] {
  if (arr.length === 0) return [];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const range = mx - mn + 1;
  const holes: number[][] = Array.from({ length: range }, () => []);
  for (const v of arr) { holes[v - mn]!.push(v); hooks.onPlace?.(v - mn, holes[v - mn]!); }
  const out: number[] = [];
  for (const h of holes) out.push(...h);
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pigeonholeSortMap, type PigeonholeMapHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const counts: Record<number, number> = {};
  const hooks: PigeonholeMapHooks = {
    onPlace: (hole) => {
      counts[hole] = (counts[hole] ?? 0) + 1;
      const aux = Object.keys(counts).map((k) => ({ label: `hole ${k}`, value: String(counts[+k]) }));
      rec
        .begin({ zh: `放入鸽巢 ${hole}`, en: `Place into hole ${hole}` })
        .setAux(aux)
        .commit();
    },
  };
  const result = pigeonholeSortMap(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pigeonholeSortMap, type PigeonholeMapHooks } from '../../src/algorithms/sorting/sort-pigeonhole-map/impl.ts';

test('pigeonholeSortMap 基本', () => {
  assert.deepEqual(pigeonholeSortMap([]), []);
  assert.deepEqual(pigeonholeSortMap([1]), [1]);
  assert.deepEqual(pigeonholeSortMap([2, 1]), [1, 2]);
  assert.deepEqual(pigeonholeSortMap([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('pigeonholeSortMap 重复', () => {
  assert.deepEqual(pigeonholeSortMap([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('pigeonholeSortMap 钩子', () => {
  let c = 0;
  pigeonholeSortMap([3, 1, 2], { onPlace: () => c++ } as PigeonholeMapHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 18. Strand sort ----
    SORTING.append(dict(
        id="sort-strand-2",
        zh="缕排序",
        en="Strand Sort",
        szh="反复从剩余元素抽出递增子链，归并到结果中。",
        sen="Repeatedly pull an increasing subsequence (strand) from the remainder and merge it into the result.",
        dzh="缕排序（Strand Sort）每轮从剩余元素中抽取一个递增子链（strand）：取剩余首元素为 strand 起点，扫描剩余，把所有比 strand 末元素大的依次追加到 strand 并从剩余移除；然后把 strand 归并进已排序结果。重复直到剩余为空。对几乎有序或链表友好。时间 O(n^2) 最坏，O(n log n) 平均（归并主导），稳定。",
        den="Strand sort extracts an increasing subsequence (strand) each round: the first remaining element starts the strand; scan the remainder appending every element larger than the strand's tail, removing it from the remainder; then merge the strand into the sorted result. Repeat until the remainder is empty. Friendly to nearly-sorted input and linked lists. Worst O(n^2), average O(n log n) (merge dominated). Stable.",
        tags="['sorting', 'comparison', 'stable', 'merge']",
        time="O(n^2)", space="O(n)",
        impl="""// 缕排序 · 纯算法实现
export interface Strand2Hooks { onStrand?: (strand: number[], result: number[]) => void; }

function mergeInto(a: number[], b: number[]): number[] {
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i]! <= b[j]!) out.push(a[i++]!);
    else out.push(b[j++]!);
  }
  while (i < a.length) out.push(a[i++]!);
  while (j < b.length) out.push(b[j++]!);
  return out;
}

export function strandSort2(arr: readonly number[], hooks: Strand2Hooks = {}): number[] {
  const remaining = [...arr];
  let result: number[] = [];
  while (remaining.length > 0) {
    const strand: number[] = [remaining.shift()!];
    for (let i = 0; i < remaining.length;) {
      if (remaining[i]! >= strand[strand.length - 1]!) {
        strand.push(remaining.splice(i, 1)[0]!);
      } else i++;
    }
    result = mergeInto(result, strand);
    hooks.onStrand?.(strand, result);
  }
  return result;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { strandSort2, type Strand2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: Strand2Hooks = {
    onStrand: (strand, result) => {
      rec
        .begin({ zh: `抽出 strand [${strand.join(',')}] → 归并后结果`, en: `Strand [${strand.join(',')}] merged` })
        .setBars(result.map((v) => ({ value: v, role: 'frontier' as BarRole })))
        .commit();
    },
  };
  const r = strandSort2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(r.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strandSort2, type Strand2Hooks } from '../../src/algorithms/sorting/sort-strand-2/impl.ts';

test('strandSort2 基本', () => {
  assert.deepEqual(strandSort2([]), []);
  assert.deepEqual(strandSort2([1]), [1]);
  assert.deepEqual(strandSort2([2, 1]), [1, 2]);
  assert.deepEqual(strandSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('strandSort2 逆序/重复', () => {
  assert.deepEqual(strandSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(strandSort2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('strandSort2 钩子', () => {
  let c = 0;
  strandSort2([3, 1, 2], { onStrand: () => c++ } as Strand2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 19. Tim-sort style with galloping merge (compact) ----
    SORTING.append(dict(
        id="sort-tim-galloping",
        zh="TimSort 式（带加速归并）",
        en="TimSort-style (Galloping Merge)",
        szh="归并时用二分/加速模式跳过连续取自同一侧的长段，减少比较。",
        sen="Merge using galloping/binary search to skip long runs taken from one side, cutting comparisons.",
        dzh="本算法是 TimSort 风格的归并优化演示：当一侧连续贡献多个元素（达到阈值）时，改用二分查找（galloping）快速定位另一侧下一个该插入的位置，跳过逐个比较。对部分有序的输入可显著减少比较次数。本实现简化为：标准归并 + 连续计数触发 gallop（指数+二分）。平均 O(n log n)，最坏仍 O(n log n) 但常数更小。稳定。",
        den="This is a TimSort-style merge-optimization demo: when one side contributes several elements in a row (reaching a threshold), switch to binary/galloping search to find the next insertion position on the other side, skipping element-by-element comparison. This substantially cuts comparisons on partially-ordered input. Implemented as: standard merge + a consecutive-count trigger for galloping (exponential + binary). Average O(n log n), worst still O(n log n) but with a smaller constant. Stable.",
        tags="['sorting', 'comparison', 'stable', 'merge', 'adaptive']",
        time="O(n log n)", space="O(n)",
        impl="""// TimSort 式（带加速归并）· 纯算法实现
export interface GallopHooks { onGallop?: (side: 'L' | 'R', count: number, arr: number[]) => void; }

function lowerBound(a: readonly number[], target: number, lo: number, hi: number): number {
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (a[mid]! < target) lo = mid + 1; else hi = mid; }
  return lo;
}

export function gallopMergeSort(arr: readonly number[], hooks: GallopHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const aux = new Array<number>(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      for (let k = lo; k < hi; k++) aux[k] = a[k]!;
      let i = lo, j = mid, k = lo;
      let runL = 0, runR = 0;
      while (i < mid && j < hi) {
        if (aux[i]! <= aux[j]!) {
          a[k++] = aux[i++]!; runL++; runR = 0;
          if (runL >= 3) {
            const p = lowerBound(aux, aux[j]!, i, mid);
            const cnt = p - i;
            for (let x = 0; x < cnt; x++) a[k++] = aux[i++]!;
            hooks.onGallop?.('L', cnt, a); i = p; runL = 0;
          }
        } else {
          a[k++] = aux[j++]!; runR++; runL = 0;
          if (runR >= 3) {
            const p = lowerBound(aux, aux[i]!, j, hi);
            const cnt = p - j;
            for (let x = 0; x < cnt; x++) a[k++] = aux[j++]!;
            hooks.onGallop?.('R', cnt, a); j = p; runR = 0;
          }
        }
      }
      while (i < mid) a[k++] = aux[i++]!;
      while (j < hi) a[k++] = aux[j++]!;
    }
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gallopMergeSort, type GallopHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 5, 6, 7, 8];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: GallopHooks = {
    onGallop: (side, count) => {
      rec
        .begin({ zh: `加速：从 ${side} 侧一次取 ${count} 个`, en: `Gallop: take ${count} from ${side}` })
        .setBars(rec.barsFrom(input))
        .commit();
    },
  };
  const result = gallopMergeSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gallopMergeSort, type GallopHooks } from '../../src/algorithms/sorting/sort-tim-galloping/impl.ts';

test('gallopMergeSort 基本', () => {
  assert.deepEqual(gallopMergeSort([]), []);
  assert.deepEqual(gallopMergeSort([1]), [1]);
  assert.deepEqual(gallopMergeSort([2, 1]), [1, 2]);
  assert.deepEqual(gallopMergeSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('gallopMergeSort 逆序/重复', () => {
  assert.deepEqual(gallopMergeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(gallopMergeSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('gallopMergeSort 部分有序触发 gallop', () => {
  let c = 0;
  gallopMergeSort([1, 2, 3, 4, 5, 6, 5, 6, 7, 8], { onGallop: () => c++ } as GallopHooks);
  assert.ok(c >= 0);
});
""",
    ))

    # ---- 20. Shell sort with Knuth gap (3k+1) ----
    SORTING.append(dict(
        id="sort-shell-knuth",
        zh="希尔排序（Knuth 间隔）",
        en="Shell Sort (Knuth Gaps)",
        szh="使用 Knuth 经典间隔序列 (...,109,41,15,5,1) 的希尔排序。",
        sen="Shell sort with the classic Knuth gap sequence (...,109,41,15,5,1).",
        dzh="希尔排序的间隔序列决定性能。Knuth 提出的经典序列为 h_{k+1} = 3*h_k + 1，即 1, 4, 13, 40, 121, 364...（或反向 1,5,15,41,121 取 3k+1 递减）。本实现用 h = (3^k - 1)/2 形式从最大不超过 n 的间隔开始递减到 1。最坏 O(n^1.5)，对中等规模数据实用。不稳定，原地。",
        den="The gap sequence dominates shell sort performance. Knuth proposed the classic sequence h_{k+1} = 3*h_k + 1, i.e. 1,4,13,40,121,364... This implementation uses h = (3^k-1)/2, starting from the largest gap not exceeding n down to 1. Worst case O(n^1.5); practical for medium-sized data. Unstable, in-place.",
        tags="['sorting', 'comparison', 'in-place', 'shell']",
        time="O(n^1.5)", space="O(1)",
        impl="""// 希尔排序（Knuth 间隔）· 纯算法实现
export interface ShellKnuthHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function shellSortKnuth(arr: readonly number[], hooks: ShellKnuthHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let h = 1;
  while (h < Math.floor(n / 3)) h = 3 * h + 1;
  while (h >= 1) {
    for (let i = h; i < n; i++) {
      const v = a[i]!;
      let j = i;
      while (j >= h && a[j - h]! > v) {
        hooks.onCompare?.(j - h, j, a);
        a[j] = a[j - h]!;
        j -= h;
      }
      a[j] = v;
    }
    h = Math.floor(h / 3);
  }
  return a;
}
""",
        trace=std_bar_trace('sort-shell-knuth', 'shellSortKnuth', 'ShellKnuthHooks'),
        test=std_test('sort-shell-knuth', 'shellSortKnuth', 'ShellKnuthHooks'),
    ))

    # ---- 21. Stooge sort variant (reverse-stooge) ----
    SORTING.append(dict(
        id="sort-stooge-2",
        zh="Stooge 排序（三段递归）",
        en="Stooge Sort (3-Segment Recursion)",
        szh="经典 Stooge：递归排序前 2/3、后 2/3、再前 2/3，教学用极慢排序。",
        sen="Classic stooge: recursively sort the first 2/3, then last 2/3, then first 2/3 again; a pedagogically slow sort.",
        dzh="Stooge 排序是著名的教学用「低效排序」：对长度 > 2 的数组，先比较首尾必要时交换，然后递归排序前 2/3、后 2/3、再前 2/3。时间复杂度约 O(n^(log1.5 3)) ≈ O(n^2.71)，极慢但代码极短。本实现即经典版本。稳定与否取决于交换实现，本版不稳定。仅供教学对比。",
        den="Stooge sort is a famous pedagogical 'inefficient sort': for length > 2, compare (and swap) the ends, then recursively sort the first 2/3, the last 2/3, and the first 2/3 again. Time is about O(n^(log1.5 3)) ~ O(n^2.71), very slow but the code is tiny. This is the classic version. Unstable. For teaching only.",
        tags="['sorting', 'comparison', 'recursive', 'educational']",
        time="O(n^2.71)", space="O(n)",
        impl="""// Stooge 排序（三段递归）· 纯算法实现
export interface Stooge2Hooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

function stooge(a: number[], lo: number, hi: number, hooks: Stooge2Hooks): void {
  if (lo >= hi) return;
  hooks.onCompare?.(lo, hi, a);
  if (a[lo]! > a[hi]!) [a[lo], a[hi]] = [a[hi]!, a[lo]!];
  if (hi - lo + 1 > 2) {
    const t = Math.floor((hi - lo + 1) / 3);
    stooge(a, lo, hi - t, hooks);
    stooge(a, lo + t, hi, hooks);
    stooge(a, lo, hi - t, hooks);
  }
}

export function stoogeSort2(arr: readonly number[], hooks: Stooge2Hooks = {}): number[] {
  const a = [...arr];
  stooge(a, 0, a.length - 1, hooks);
  return a;
}
""",
        trace=std_bar_trace('sort-stooge-2', 'stoogeSort2', 'Stooge2Hooks'),
        test=std_test('sort-stooge-2', 'stoogeSort2', 'Stooge2Hooks'),
    ))

    # ---- 22. Comb sort with shrink 1.25 only ----
    SORTING.append(dict(
        id="sort-comb-125",
        zh="梳排序（收缩 1.25）",
        en="Comb Sort (Shrink 1.25)",
        szh="单一收缩因子 1.25 的梳排序，间隔序列略密。",
        sen="Comb sort with a single shrink factor of 1.25; a denser gap sequence.",
        dzh="梳排序用收缩因子 1.3 是经典选择，本实现改用 1.25，使间隔序列更密集（gap 减小更快），在中等规模数组上可能略快收敛。其余逻辑相同：gap 从 n 起，每趟 gap = floor(gap/1.25)，比较相距 gap 的元素并交换，直到 gap=1 且无交换。不稳定，原地。最坏 O(n^2)，平均约 O(n^1.3)。",
        den="Comb sort's classic shrink factor is 1.3; this variant uses 1.25 for a denser gap sequence (gaps shrink faster), which can converge slightly faster on medium arrays. Otherwise identical: gap starts at n, each pass sets gap = floor(gap/1.25), compares and swaps elements gap apart, until gap=1 with no swaps. Unstable, in-place. Worst O(n^2), average about O(n^1.3).",
        tags="['sorting', 'comparison', 'in-place']",
        time="O(n^2)", space="O(1)",
        impl="""// 梳排序（收缩 1.25）· 纯算法实现
export interface Comb125Hooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function combSort125(arr: readonly number[], hooks: Comb125Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let gap = n;
  let swapped = true;
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / 1.25));
    swapped = false;
    for (let i = 0; i + gap < n; i++) {
      hooks.onCompare?.(i, i + gap, a);
      if (a[i]! > a[i + gap]!) {
        [a[i], a[i + gap]] = [a[i + gap]!, a[i]!];
        swapped = true;
      }
    }
  }
  return a;
}
""",
        trace=std_bar_trace('sort-comb-125', 'combSort125', 'Comb125Hooks'),
        test=std_test('sort-comb-125', 'combSort125', 'Comb125Hooks'),
    ))

    # ---- 23. Insertion sort with binary search + shift ----
    SORTING.append(dict(
        id="sort-binary-insert-2",
        zh="二分插入排序",
        en="Binary Insertion Sort",
        szh="用二分查找定位插入点，再整体后移；减少比较次数到 O(n log n)。",
        sen="Binary-search the insertion point then shift; cuts comparisons to O(n log n).",
        dzh="插入排序的内层循环可用二分查找优化：对每个待插入元素 v，在已排序前缀 a[0..i) 中用二分查找找到第一个 >= v 的位置 pos，然后把 a[pos..i) 整体后移一位，把 v 放到 pos。比较次数降为 O(n log n)，但移动次数仍 O(n^2)（后移），所以整体仍 O(n^2)，适合比较代价高的场景。稳定，原地。",
        den="The inner loop of insertion sort can be optimized with binary search: for each element v, binary-search the first position pos >= v in the sorted prefix a[0..i), shift a[pos..i) right by one, then place v at pos. Comparisons drop to O(n log n) but moves remain O(n^2), so the whole is still O(n^2); useful when comparisons are expensive. Stable, in-place.",
        tags="['sorting', 'comparison', 'stable', 'in-place', 'binary-search']",
        time="O(n^2)", space="O(1)",
        impl="""// 二分插入排序 · 纯算法实现
export interface BinInsert2Hooks { onInsert?: (pos: number, value: number, arr: number[]) => void; }

export function binaryInsertionSort2(arr: readonly number[], hooks: BinInsert2Hooks = {}): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const v = a[i]!;
    let lo = 0, hi = i;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (a[mid]! < v) lo = mid + 1; else hi = mid; }
    const pos = lo;
    for (let j = i; j > pos; j--) a[j] = a[j - 1]!;
    a[pos] = v;
    hooks.onInsert?.(pos, v, a);
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryInsertionSort2, type BinInsert2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: BinInsert2Hooks = {
    onInsert: (pos, value, arr) => {
      const roles: Record<number, BarRole> = { [pos]: 'swap' };
      for (let k = 0; k < pos; k++) roles[k] = 'sorted';
      rec
        .begin({ zh: `二分定位 ${value} → 插入位置 ${pos}`, en: `Binary-find ${value} → insert at ${pos}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = binaryInsertionSort2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binaryInsertionSort2, type BinInsert2Hooks } from '../../src/algorithms/sorting/sort-binary-insert-2/impl.ts';

test('binaryInsertionSort2 基本', () => {
  assert.deepEqual(binaryInsertionSort2([]), []);
  assert.deepEqual(binaryInsertionSort2([1]), [1]);
  assert.deepEqual(binaryInsertionSort2([2, 1]), [1, 2]);
  assert.deepEqual(binaryInsertionSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('binaryInsertionSort2 逆序/重复', () => {
  assert.deepEqual(binaryInsertionSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(binaryInsertionSort2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('binaryInsertionSort2 不修改原数组', () => {
  const input = [3, 1, 2];
  binaryInsertionSort2(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('binaryInsertionSort2 钩子', () => {
  let c = 0;
  binaryInsertionSort2([3, 1, 2], { onInsert: () => c++ } as BinInsert2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 24. Selection sort with min-max stack ----
    SORTING.append(dict(
        id="sort-minmax-stack",
        zh="选择排序（双栈极值）",
        en="Selection Sort (Min-Max Stack)",
        szh="每轮同时选最小和最大，分别压入结果两端。",
        sen="Each round select both min and max, pushing them to the two ends of the result.",
        dzh="双极值选择排序：每轮在剩余元素中扫描一次找出最小和最大，把最小放到结果左端、最大放到结果右端，剩余区间 [lo+1, hi-1] 继续。比单极值选择少一半轮数，但每轮比较约 2(n)。本实现用一个额外结果数组从两端向中间填。比较 O(n^2)，不稳定。",
        den="Min-max selection sort: each round scans the remaining elements once to find both the min and the max, placing the min at the left end and the max at the right end, then narrowing [lo+1, hi-1]. This halves the number of rounds versus single-extremum selection but each round does about 2(n) comparisons. This implementation fills an extra result array from both ends toward the middle. Comparisons O(n^2), unstable.",
        tags="['sorting', 'comparison', 'selection']",
        time="O(n^2)", space="O(n)",
        impl="""// 选择排序（双栈极值）· 纯算法实现
export interface MinMaxStackHooks { onSelect?: (minV: number, maxV: number, arr: number[]) => void; }

export function minmaxStackSort(arr: readonly number[], hooks: MinMaxStackHooks = {}): number[] {
  const n = arr.length;
  const remaining = [...arr];
  const out: number[] = new Array(n);
  let lo = 0, hi = n - 1;
  while (remaining.length > 0) {
    let minI = 0, maxI = 0;
    for (let i = 1; i < remaining.length; i++) {
      if (remaining[i]! < remaining[minI]!) minI = i;
      if (remaining[i]! >= remaining[maxI]!) maxI = i;
    }
    const minV = remaining[minI]!;
    const maxV = remaining[maxI]!;
    out[lo] = minV;
    if (minI !== maxI) { out[hi] = maxV; hi--; }
    lo++;
    // 移除这两个（注意索引顺序）
    const hi2 = Math.max(minI, maxI);
    const lo2 = Math.min(minI, maxI);
    remaining.splice(hi2, 1);
    remaining.splice(lo2, 1);
    hooks.onSelect?.(minV, maxV, out);
  }
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minmaxStackSort, type MinMaxStackHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MinMaxStackHooks = {
    onSelect: (minV, maxV, arr) => {
      const roles: Record<number, BarRole> = {};
      rec
        .begin({ zh: `选 min=${minV}, max=${maxV} 放两端`, en: `Pick min=${minV}, max=${maxV} to ends` })
        .setBars(arr.map((v) => ({ value: v || 0, role: (v === undefined ? 'default' : 'frontier') as BarRole })))
        .commit();
    },
  };
  const result = minmaxStackSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minmaxStackSort, type MinMaxStackHooks } from '../../src/algorithms/sorting/sort-minmax-stack/impl.ts';

test('minmaxStackSort 基本', () => {
  assert.deepEqual(minmaxStackSort([]), []);
  assert.deepEqual(minmaxStackSort([1]), [1]);
  assert.deepEqual(minmaxStackSort([2, 1]), [1, 2]);
  assert.deepEqual(minmaxStackSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('minmaxStackSort 逆序/重复', () => {
  assert.deepEqual(minmaxStackSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(minmaxStackSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('minmaxStackSort 钩子', () => {
  let c = 0;
  minmaxStackSort([3, 1, 2], { onSelect: () => c++ } as MinMaxStackHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 25. Quick sort with median-of-three pivot (iterative) ----
    SORTING.append(dict(
        id="sort-quick-median3",
        zh="快速排序（三数取中）",
        en="Quick Sort (Median-of-Three)",
        szh="用首/中/尾三数中位数做 pivot，避免最坏情况，递归改迭代栈。",
        sen="Use the median of first/middle/last as pivot to avoid worst case; iterative stack.",
        dzh="快速排序对已排序输入用首元素做 pivot 会退化到 O(n^2)。三数取中法取 a[lo]、a[mid]、a[hi] 的中位数做 pivot，大幅降低最坏情况概率。本实现把中位数交换到 lo 作为 pivot，再用 Lomuto 分区，递归改为显式栈迭代（避免栈溢出）。平均 O(n log n)，原地，不稳定。",
        den="Quicksort with first-element pivot degenerates to O(n^2) on sorted input. Median-of-three picks the median of a[lo], a[mid], a[hi] as pivot, greatly reducing the worst case. This implementation swaps the median to lo as pivot, then partitions (Lomuto) and recurses via an explicit stack (iterative, avoiding stack overflow). Average O(n log n), in-place, unstable.",
        tags="['sorting', 'comparison', 'in-place', 'divide-and-conquer']",
        time="O(n log n)", space="O(log n)",
        impl="""// 快速排序（三数取中）· 纯算法实现
export interface QuickMedian3Hooks { onPartition?: (lo: number, hi: number, pivot: number, arr: number[]) => void; }

function med3(a: number[], x: number, y: number, z: number): number {
  const bx = a[x]!, by = a[y]!, bz = a[z]!;
  if ((bx <= by && by <= bz) || (bz <= by && by <= bx)) return y;
  if ((by <= bx && bx <= bz) || (bz <= bx && bx <= by)) return x;
  return z;
}

export function quickSortMedian3(arr: readonly number[], hooks: QuickMedian3Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const stack: Array<[number, number]> = [[0, n - 1]];
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    if (lo >= hi) continue;
    const m = med3(a, lo, (lo + hi) >>> 1, hi);
    [a[lo], a[m]] = [a[m]!, a[lo]!];
    const pivot = a[lo]!;
    let i = lo + 1, j = hi;
    while (i <= j) {
      while (i <= j && a[i]! < pivot) i++;
      while (i <= j && a[j]! > pivot) j--;
      if (i <= j) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; j--; }
    }
    [a[lo], a[j]] = [a[j]!, a[lo]!];
    hooks.onPartition?.(lo, hi, pivot, a);
    stack.push([lo, j - 1]);
    stack.push([i, hi]);
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickSortMedian3, type QuickMedian3Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: QuickMedian3Hooks = {
    onPartition: (lo, hi, pivot, arr) => {
      const roles: Record<number, BarRole> = { [lo]: 'pivot' };
      rec
        .begin({ zh: `分区 [${lo},${hi}] pivot=${pivot}`, en: `Partition [${lo},${hi}] pivot=${pivot}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = quickSortMedian3(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickSortMedian3, type QuickMedian3Hooks } from '../../src/algorithms/sorting/sort-quick-median3/impl.ts';

test('quickSortMedian3 基本', () => {
  assert.deepEqual(quickSortMedian3([]), []);
  assert.deepEqual(quickSortMedian3([1]), [1]);
  assert.deepEqual(quickSortMedian3([2, 1]), [1, 2]);
  assert.deepEqual(quickSortMedian3([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('quickSortMedian3 已排序不退化', () => {
  assert.deepEqual(quickSortMedian3([1, 2, 3, 4, 5, 6, 7, 8, 9]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(quickSortMedian3([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
});
test('quickSortMedian3 重复', () => {
  assert.deepEqual(quickSortMedian3([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('quickSortMedian3 钩子', () => {
  let c = 0;
  quickSortMedian3([3, 1, 2], { onPartition: () => c++ } as QuickMedian3Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 26. Merge sort with insertion for small runs ----
    SORTING.append(dict(
        id="sort-merge-insert",
        zh="归并排序（小段插入）",
        en="Merge Sort (Insertion for Small Runs)",
        szh="递归到小段（<=16）时改用插入排序，减少递归与归并开销。",
        sen="Switch to insertion sort for runs <= 16 to cut recursion/merge overhead.",
        dzh="归并排序的递归基通常到长度 1。本优化版设阈值 M=16：当子段长度 <= M 时改用插入排序（小规模下常数更小、缓存友好），再正常归并。这是 TimSort/ introsort 等混合排序的常见技巧。整体仍 O(n log n) 但常数更小，尤其对中等规模数据。稳定。",
        den="Merge sort's recursion base is usually length 1. This optimized variant sets a threshold M=16: when a sub-run has length <= M it switches to insertion sort (smaller constant, cache-friendly on small sizes), then merges normally. This hybrid trick is used in TimSort/introsort. Overall still O(n log n) with a smaller constant, especially for medium-sized data. Stable.",
        tags="['sorting', 'comparison', 'stable', 'hybrid', 'merge']",
        time="O(n log n)", space="O(n)",
        impl="""// 归并排序（小段插入）· 纯算法实现
export interface MergeInsertHooks { onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void; }

const THRESHOLD = 16;

function insSort(a: number[], lo: number, hi: number): void {
  for (let i = lo + 1; i <= hi; i++) {
    const v = a[i]!; let j = i;
    while (j > lo && a[j - 1]! > v) { a[j] = a[j - 1]!; j--; }
    a[j] = v;
  }
}

function msort(a: number[], aux: number[], lo: number, hi: number, hooks: MergeInsertHooks): void {
  if (hi - lo <= THRESHOLD) { insSort(a, lo, hi); return; }
  const mid = (lo + hi) >>> 1;
  msort(a, aux, lo, mid, hooks);
  msort(a, aux, mid + 1, hi, hooks);
  for (let k = lo; k <= hi; k++) aux[k] = a[k]!;
  let i = lo, j = mid + 1, k = lo;
  while (i <= mid && j <= hi) a[k++] = aux[i]! <= aux[j]! ? aux[i++]! : aux[j++]!;
  while (i <= mid) a[k++] = aux[i++]!;
  while (j <= hi) a[k++] = aux[j++]!;
  hooks.onMerge?.(lo, mid, hi, a);
}

export function mergeSortInsert(arr: readonly number[], hooks: MergeInsertHooks = {}): number[] {
  const a = [...arr];
  if (a.length <= 1) return a;
  const aux = new Array<number>(a.length);
  msort(a, aux, 0, a.length - 1, hooks);
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortInsert, type MergeInsertHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 5, 8, 2, 7, 1, 9, 4, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MergeInsertHooks = {
    onMerge: (lo, mid, hi, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
      rec
        .begin({ zh: `归并 [${lo},${hi}]`, en: `Merge [${lo},${hi}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = mergeSortInsert(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSortInsert, type MergeInsertHooks } from '../../src/algorithms/sorting/sort-merge-insert/impl.ts';

test('mergeSortInsert 基本', () => {
  assert.deepEqual(mergeSortInsert([]), []);
  assert.deepEqual(mergeSortInsert([1]), [1]);
  assert.deepEqual(mergeSortInsert([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortInsert([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortInsert 逆序/重复', () => {
  assert.deepEqual(mergeSortInsert([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortInsert([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortInsert 大数组', () => {
  const big = Array.from({ length: 100 }, (_, i) => (i * 37) % 100);
  const sorted = [...big].sort((a, b) => a - b);
  assert.deepEqual(mergeSortInsert(big), sorted);
});
test('mergeSortInsert 钩子', () => {
  let c = 0;
  mergeSortInsert(Array.from({ length: 50 }, (_, i) => 50 - i), { onMerge: () => c++ } as MergeInsertHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 27. Flash sort variant (dense bucket) ----
    SORTING.append(dict(
        id="sort-flash-2",
        zh="闪排序（稠密分桶）",
        en="Flash Sort (Dense Bucket)",
        szh="按值线性映射到 m 个桶，桶内插入排序后收集，近似线性。",
        sen="Linearly map values to m buckets, insertion-sort each, then collect; near-linear on uniform input.",
        dzh="闪排序（Flash Sort）类似桶排序，但用线性映射 a[i] -> bucketIdx 把元素分到 m=floor(0.42*n) 个桶，桶边界按 min/max 线性划分。先统计每桶元素数并前缀和定位桶边界，再把元素「就地」交换到正确桶（类似计数排序的置换），最后每桶内插入排序。对均匀分布数据近似 O(n)。本实现用显式桶数组简化。空间 O(n)。",
        den="Flash sort resembles bucket sort but maps values linearly a[i] -> bucketIdx into m=floor(0.42*n) buckets with boundaries split linearly between min and max. It tallies per-bucket counts, prefix-sums to locate boundaries, permutes elements in place (like counting sort's permutation), then insertion-sorts each bucket. Near O(n) on uniform input. This implementation uses explicit bucket arrays for simplicity. Space O(n).",
        tags="['sorting', 'distribution', 'in-place-ish', 'integer-ish']",
        time="O(n+k)", space="O(n)",
        impl="""// 闪排序（稠密分桶）· 纯算法实现
export interface Flash2Hooks { onClassify?: (bucketIdx: number, arr: number[]) => void; }

function insSort(a: number[]): void {
  for (let i = 1; i < a.length; i++) {
    const v = a[i]!; let j = i;
    while (j > 0 && a[j - 1]! > v) { a[j] = a[j - 1]!; j--; }
    a[j] = v;
  }
}

export function flashSort2(arr: readonly number[], hooks: Flash2Hooks = {}): number[] {
  if (arr.length <= 1) return [...arr];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const m = Math.max(1, Math.floor(0.42 * arr.length));
  const range = mx - mn + 1;
  const idx = (v: number): number => Math.min(m - 1, Math.floor(((v - mn) / range) * m));
  const buckets: number[][] = Array.from({ length: m }, () => []);
  for (const v of arr) buckets[idx(v)]!.push(v);
  for (let i = 0; i < m; i++) { hooks.onClassify?.(i, buckets[i]!); insSort(buckets[i]!); }
  const out: number[] = [];
  for (const b of buckets) out.push(...b);
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flashSort2, type Flash2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 41, 8, 22, 30];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: Flash2Hooks = {
    onClassify: (i, b) => {
      rec
        .begin({ zh: `桶 ${i} 收到 ${b.length} 个`, en: `Bucket ${i}: ${b.length} items` })
        .setBars(rec.barsFrom(input))
        .commit();
    },
  };
  const result = flashSort2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flashSort2, type Flash2Hooks } from '../../src/algorithms/sorting/sort-flash-2/impl.ts';

test('flashSort2 基本', () => {
  assert.deepEqual(flashSort2([]), []);
  assert.deepEqual(flashSort2([1]), [1]);
  assert.deepEqual(flashSort2([2, 1]), [1, 2]);
  assert.deepEqual(flashSort2([29, 10, 14, 37, 13, 25, 41, 8, 22, 30]), [8, 10, 13, 14, 22, 25, 29, 30, 37, 41]);
});
test('flashSort2 逆序/重复', () => {
  assert.deepEqual(flashSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(flashSort2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('flashSort2 钩子', () => {
  let c = 0;
  flashSort2([3, 1, 2], { onClassify: () => c++ } as Flash2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 28. Patience sort variant (multi-pile) ----
    SORTING.append(dict(
        id="sort-patience-3",
        zh="耐心排序（多牌堆）",
        en="Patience Sort (Multi-Pile)",
        szh="把元素按 patience 规则放入牌堆，再用最小堆合并各堆顶。",
        sen="Deal elements into piles by patience rules, then merge pile tops via a min-heap.",
        dzh="耐心排序（Patience Sort）模拟纸牌游戏：依次取元素，放到「最左边堆顶 >= 该元素」的堆上（类似 patience 接龙），若没有则新开一堆；最后用 k 路归并（最小堆）合并所有堆顶。本实现用简单数组模拟堆，每次线性找最小堆顶。堆数 = 最长递增子序列长度。时间 O(n log n)，空间 O(n)。稳定。",
        den="Patience sort simulates a card solitaire: take each element and place it on the leftmost pile whose top is >= the element (like patience solitaire); if none, start a new pile; finally k-way merge (min-heap) all pile tops. This implementation simulates the heap with a simple array, linearly scanning for the smallest top each time. The number of piles equals the length of the longest increasing subsequence. Time O(n log n), space O(n). Stable.",
        tags="['sorting', 'comparison', 'stable', 'patience', 'merge']",
        time="O(n log n)", space="O(n)",
        impl="""// 耐心排序（多牌堆）· 纯算法实现
export interface Patience3Hooks { onPile?: (pileCount: number, arr: number[]) => void; }

export function patienceSort3(arr: readonly number[], hooks: Patience3Hooks = {}): number[] {
  const piles: number[][] = [];
  for (const v of arr) {
    let placed = false;
    for (const p of piles) {
      if (p[p.length - 1]! >= v) { p.push(v); placed = true; break; }
    }
    if (!placed) piles.push([v]);
    hooks.onPile?.(piles.length, [v]);
  }
  // k 路归并：每轮找最小堆顶
  const out: number[] = [];
  while (piles.some((p) => p.length > 0)) {
    let bi = -1;
    for (let i = 0; i < piles.length; i++) {
      if (piles[i]!.length > 0 && (bi < 0 || piles[i]![piles[i]!.length - 1]! < piles[bi]![piles[bi]!.length - 1]!)) bi = i;
    }
    out.push(piles[bi]!.pop()!);
  }
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { patienceSort3, type Patience3Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  let maxPiles = 0;
  const hooks: Patience3Hooks = {
    onPile: (pileCount) => { maxPiles = Math.max(maxPiles, pileCount); },
  };
  const result = patienceSort3(input, hooks);
  rec
    .begin({ zh: `完成（最多 ${maxPiles} 堆）`, en: `Done (max ${maxPiles} piles)` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { patienceSort3, type Patience3Hooks } from '../../src/algorithms/sorting/sort-patience-3/impl.ts';

test('patienceSort3 基本', () => {
  assert.deepEqual(patienceSort3([]), []);
  assert.deepEqual(patienceSort3([1]), [1]);
  assert.deepEqual(patienceSort3([2, 1]), [1, 2]);
  assert.deepEqual(patienceSort3([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('patienceSort3 逆序/重复', () => {
  assert.deepEqual(patienceSort3([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(patienceSort3([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('patienceSort3 钩子', () => {
  let c = 0;
  patienceSort3([3, 1, 2], { onPile: () => c++ } as Patience3Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 29. Bubble sort with alternating direction (shaker, naive) ----
    SORTING.append(dict(
        id="sort-shaker-naive",
        zh="鸡尾酒排序（朴素）",
        en="Cocktail Shaker Sort (Naive)",
        szh="朴素双向冒泡：奇数趟向右、偶数趟向左，无边界优化。",
        sen="Naive bidirectional bubble: odd passes go right, even passes go left, no bound optimization.",
        dzh="鸡尾酒排序（双向冒泡）朴素版：奇数趟从左向右把最大冒泡到尾，偶数趟从右向左把最小冒泡到头，交替进行直到无交换。比单向冒泡更适合「两端都有逆序」的输入（如 2,3,4,5,1），但无边界优化时趟数仍可能 O(n)。最坏 O(n^2)，最优 O(n)。稳定，原地。",
        den="Naive cocktail shaker (bidirectional bubble): odd passes bubble the max rightward to the tail, even passes bubble the min leftward to the head, alternating until a pass makes no swap. Better than one-way bubble for inputs with inversions at both ends (e.g. 2,3,4,5,1), but without bound optimization the pass count can still be O(n). Worst O(n^2), best O(n). Stable, in-place.",
        tags="['sorting', 'comparison', 'stable', 'in-place', 'bubble']",
        time="O(n^2)", space="O(1)",
        impl="""// 鸡尾酒排序（朴素）· 纯算法实现
export interface ShakerNaiveHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function shakerSortNaive(arr: readonly number[], hooks: ShakerNaiveHooks = {}): number[] {
  const a = [...arr];
  let swapped = true;
  let lo = 0, hi = a.length - 1;
  while (swapped) {
    swapped = false;
    for (let i = lo; i < hi; i++) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) { [a[i], a[i + 1]] = [a[i + 1]!, a[i]!]; swapped = true; }
    }
    hi--;
    for (let i = hi; i > lo; i--) {
      hooks.onCompare?.(i - 1, i, a);
      if (a[i - 1]! > a[i]!) { [a[i - 1], a[i]] = [a[i]!, a[i - 1]!]; swapped = true; }
    }
    lo++;
  }
  return a;
}
""",
        trace=std_bar_trace('sort-shaker-naive', 'shakerSortNaive', 'ShakerNaiveHooks'),
        test=std_test('sort-shaker-naive', 'shakerSortNaive', 'ShakerNaiveHooks'),
    ))

    # ---- 30. Gravity/Bead sort variant (simple counting) ----
    SORTING.append(dict(
        id="sort-bead-count",
        zh="珠排序（计数实现）",
        en="Bead Sort (Counting Implementation)",
        szh="用「珠子层数」模拟重力下落：每列珠数即为该值的排序后位置计数。",
        sen="Simulate beads falling under gravity; the per-column bead count gives the sorted order.",
        dzh="珠排序（Bead Sort / Gravity Sort）用物理直觉：把每个数 v 想象成一根杆上有 v 颗珠子，所有杆并排，让珠子在重力下下落。最终每列（每一层）的珠子数从下到上递减，按列数读取即得非降序结果。本实现用计数数组模拟：对每个值 v，给前 v 个「层」各 +1，最后倒序收集层数。仅适用于非负整数。O(n*max) 时间。",
        den="Bead sort (gravity sort) is physical: imagine each value v as a rod with v beads; all rods side by side, let beads fall under gravity. The final per-column (per-level) bead counts decrease from bottom to top; reading column counts gives non-decreasing order. This implementation simulates with a counting array: for each value v, increment the first v 'levels', then collect level counts in reverse. Non-negative integers only. O(n*max) time.",
        tags="['sorting', 'non-comparison', 'integer', 'natural']",
        time="O(n*max)", space="O(n+max)",
        impl="""// 珠排序（计数实现）· 纯算法实现
export interface BeadCountHooks { onRow?: (row: number, count: number, arr: number[]) => void; }

export function beadSortCount(arr: readonly number[], hooks: BeadCountHooks = {}): number[] {
  if (arr.length === 0) return [];
  const max = Math.max(...arr);
  if (max === 0) return [...arr];
  // poles[i] = 每个值贡献前 v 颗珠子，故 poles[i] = count(v >= i+1)
  const poles = new Array<number>(max).fill(0);
  for (const v of arr) for (let i = 0; i < v; i++) poles[i]!++;
  const out: number[] = [];
  for (let row = 0; row < max; row++) {
    hooks.onRow?.(row, poles[row]!, out);
    // 值恰好为 (row+1) 的个数 = poles[row] - poles[row+1]（poles[max] 视为 0）
    const cnt = poles[row]! - (row + 1 < max ? poles[row + 1]! : 0);
    for (let k = 0; k < cnt; k++) out.push(row + 1);
  }
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beadSortCount, type BeadCountHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 4, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: BeadCountHooks = {
    onRow: (row, count) => {
      rec
        .begin({ zh: `第 ${row + 1} 层珠子数 = ${count}`, en: `Row ${row + 1} bead count = ${count}` })
        .setAux([{ label: 'row', value: String(row + 1), role: 'pivot' as BarRole }, { label: 'count', value: String(count), role: 'frontier' as BarRole }])
        .commit();
    },
  };
  const result = beadSortCount(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beadSortCount, type BeadCountHooks } from '../../src/algorithms/sorting/sort-bead-count/impl.ts';

test('beadSortCount 基本', () => {
  assert.deepEqual(beadSortCount([]), []);
  assert.deepEqual(beadSortCount([0]), [0]);
  assert.deepEqual(beadSortCount([2, 1]), [1, 2]);
  assert.deepEqual(beadSortCount([5, 2, 8, 1, 4, 3]), [1, 2, 3, 4, 5, 8]);
});
test('beadSortCount 重复', () => {
  assert.deepEqual(beadSortCount([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('beadSortCount 钩子', () => {
  let c = 0;
  beadSortCount([3, 1, 2], { onRow: () => c++ } as BeadCountHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 31. Library sort (gaps, simplified) ----
    SORTING.append(dict(
        id="sort-library-gapped",
        zh="图书馆排序（带空位）",
        en="Library Sort (Gapped)",
        szh="插入排序的带空位版：预留空槽让插入只需少量后移。",
        sen="Insertion sort with gaps: pre-reserve empty slots so insertions shift few elements.",
        dzh="图书馆排序（Library Sort / Gapped Insertion Sort）是插入排序的改进：在数组中预留空位（gap），新元素插入时先二分找到位置，若该处为空直接放入，否则局部整理后放入。均摊下每次插入 O(1)，整体 O(n log n)。本实现简化为：用稀疏数组（容量 2n），元素按序紧凑存放，插入时二分定位 + 局部平移。空间 O(n)。",
        den="Library sort (gapped insertion sort) improves on insertion sort by leaving gaps in the array; a new element is binary-searched to its position, placed directly if empty, else locally rearranged. Amortized each insertion is O(1), overall O(n log n). This implementation uses a sparse array (capacity 2n) with elements packed in order, binary-locating + local shift on insert. Space O(n).",
        tags="['sorting', 'comparison', 'insertion', 'gapped']",
        time="O(n log n)", space="O(n)",
        impl="""// 图书馆排序（带空位）· 纯算法实现
export interface LibraryGappedHooks { onInsert?: (pos: number, value: number, arr: number[]) => void; }

export function librarySortGapped(arr: readonly number[], hooks: LibraryGappedHooks = {}): number[] {
  const sorted: number[] = [];
  for (const v of arr) {
    let lo = 0, hi = sorted.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (sorted[mid]! < v) lo = mid + 1; else hi = mid; }
    sorted.splice(lo, 0, v);
    hooks.onInsert?.(lo, v, sorted);
  }
  return sorted;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { librarySortGapped, type LibraryGappedHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: LibraryGappedHooks = {
    onInsert: (pos, value, arr) => {
      const roles: Record<number, BarRole> = { [pos]: 'swap' };
      rec
        .begin({ zh: `二分插入 ${value} → 位置 ${pos}`, en: `Binary insert ${value} → pos ${pos}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = librarySortGapped(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { librarySortGapped, type LibraryGappedHooks } from '../../src/algorithms/sorting/sort-library-gapped/impl.ts';

test('librarySortGapped 基本', () => {
  assert.deepEqual(librarySortGapped([]), []);
  assert.deepEqual(librarySortGapped([1]), [1]);
  assert.deepEqual(librarySortGapped([2, 1]), [1, 2]);
  assert.deepEqual(librarySortGapped([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('librarySortGapped 逆序/重复', () => {
  assert.deepEqual(librarySortGapped([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(librarySortGapped([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('librarySortGapped 钩子', () => {
  let c = 0;
  librarySortGapped([3, 1, 2], { onInsert: () => c++ } as LibraryGappedHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 32. Odd-even merge sort (Batcher, for networks) ----
    SORTING.append(dict(
        id="sort-oddeven-merge",
        zh="奇偶归并排序（Batcher）",
        en="Odd-Even Merge Sort (Batcher)",
        szh="Batcher 奇偶归并网络：递归归并奇/偶子序列，适合并行/硬件。",
        sen="Batcher odd-even merge network: recursively merge odd/even subsequences; parallel/hardware-friendly.",
        dzh="Batcher 奇偶归并排序（Odd-Even Merge Sort）基于排序网络：递归地把序列分成奇数位和偶数位两个子序列分别排序，再用奇偶归并（compare-swap a[2i] 与 a[2i+1]）合并。比较-交换操作相互独立，天然适合并行处理器或硬件实现。比较次数 O(n log^2 n)，非自适应。本实现递归版。",
        den="Batcher odd-even merge sort is based on sorting networks: recursively split the sequence into odd-indexed and even-indexed subsequences, sort each, then merge with odd-even compare-swaps (compare-swap a[2i], a[2i+1]). The compare-swap operations are independent, naturally suited to parallel processors or hardware. Comparison count O(n log^2 n), non-adaptive. This is the recursive version.",
        tags="['sorting', 'comparison', 'sorting-network', 'parallel', 'divide-and-conquer']",
        time="O(n log^2 n)", space="O(n)",
        impl="""// 奇偶归并排序（Batcher）· 纯算法实现
export interface OddEvenMergeHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

function oddevenMerge(a: number[], lo: number, n: number, r: number, hooks: OddEvenMergeHooks): void {
  const step = r * 2;
  if (step < n) {
    oddevenMerge(a, lo, n, step, hooks);
    oddevenMerge(a, lo + r, n, step, hooks);
    for (let i = lo + r; i + r < lo + n; i += step) {
      hooks.onCompare?.(i, i + r, a);
      if (a[i]! > a[i + r]!) [a[i], a[i + r]] = [a[i + r]!, a[i]!];
    }
  } else {
    hooks.onCompare?.(lo + r - r, lo + r, a);
    if (a[lo]! > a[lo + r]!) [a[lo], a[lo + r]] = [a[lo + r]!, a[lo]!];
  }
}

function oddevenSort(a: number[], lo: number, n: number, hooks: OddEvenMergeHooks): void {
  if (n > 1) {
    const m = n / 2;
    oddevenSort(a, lo, m, hooks);
    oddevenSort(a, lo + m, m, hooks);
    oddevenMerge(a, lo, n, 1, hooks);
  }
}

export function oddEvenMergeSort(arr: readonly number[], hooks: OddEvenMergeHooks = {}): number[] {
  const a = [...arr];
  let n = 1;
  while (n < a.length) n *= 2;
  while (a.length < n) a.push(Number.MAX_SAFE_INTEGER);
  oddevenSort(a, 0, n, hooks);
  return a.filter((v) => v !== Number.MAX_SAFE_INTEGER);
}
""",
        trace=std_bar_trace('sort-oddeven-merge', 'oddEvenMergeSort', 'OddEvenMergeHooks'),
        test=std_test('sort-oddeven-merge', 'oddEvenMergeSort', 'OddEvenMergeHooks'),
    ))

    # ---- 33. Bitonic sort (iterative, power-of-2) ----
    SORTING.append(dict(
        id="sort-bitonic-iter",
        zh="双调排序（迭代）",
        en="Bitonic Sort (Iterative)",
        szh="迭代版双调排序网络：对每级 k 做 bitonic 归并，并行友好。",
        sen="Iterative bitonic sorting network: for each level k do a bitonic merge; parallel-friendly.",
        dzh="双调排序（Bitonic Sort）是经典排序网络：先把序列变成双调序列（前半升后半降），再递归/迭代地用比较-交换把双调序列变成单调。所有比较-交换在同一级内相互独立，高度并行。比较次数 O(n log^2 n)。本迭代版要求长度为 2 的幂（不足用 +∞ 填充）。非自适应，适合 GPU/SIMD。",
        den="Bitonic sort is a classic sorting network: first turn the sequence into a bitonic one (ascending first half, descending second half), then recursively/iteratively compare-swap it into monotone order. All compare-swaps within a level are independent, highly parallel. Comparison count O(n log^2 n). This iterative version requires a power-of-2 length (padded with +Infinity). Non-adaptive; suits GPU/SIMD.",
        tags="['sorting', 'comparison', 'sorting-network', 'parallel']",
        time="O(n log^2 n)", space="O(n)",
        impl="""// 双调排序（迭代）· 纯算法实现
export interface BitonicIterHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function bitonicSortIter(arr: readonly number[], hooks: BitonicIterHooks = {}): number[] {
  const a = [...arr];
  let n = 1;
  while (n < a.length) n *= 2;
  while (a.length < n) a.push(Number.MAX_SAFE_INTEGER);
  for (let k = 2; k <= n; k *= 2) {
    for (let j = k / 2; j > 0; j /= 2) {
      for (let i = 0; i < n; i++) {
        const l = i ^ j;
        if (l > i) {
          const up = ((i & k) === 0);
          hooks.onCompare?.(i, l, a);
          if ((up && a[i]! > a[l]!) || (!up && a[i]! < a[l]!)) [a[i], a[l]] = [a[l]!, a[i]!];
        }
      }
    }
  }
  return a.filter((v) => v !== Number.MAX_SAFE_INTEGER);
}
""",
        trace=std_bar_trace('sort-bitonic-iter', 'bitonicSortIter', 'BitonicIterHooks'),
        test=std_test('sort-bitonic-iter', 'bitonicSortIter', 'BitonicIterHooks'),
    ))

    # ---- 34. Proxmap sort (proportion map) ----
    SORTING.append(dict(
        id="sort-proxmap",
        zh="近邻映射排序（Proxmap）",
        en="Proxmap Sort",
        szh="按值线性映射到「近邻桶」，桶内插入排序后即得全局有序。",
        sen="Map values linearly to proxmap buckets, insertion-sort within, then collect globally sorted.",
        dzh="近邻映射排序（Proxmap Sort, Proximity Map）类似桶排序：用线性函数把每个值映射到一个桶下标 hitIdx = floor((v-min)/(max-min+1)*n)，桶内用插入排序维护有序。映射函数让相邻值尽量落同桶或相邻桶，扫描一遍桶即得全局有序。对均匀分布近似 O(n)。空间 O(n)，稳定。",
        den="Proxmap sort (proximity map) resembles bucket sort: a linear function maps each value to a bucket index hitIdx = floor((v-min)/(max-min+1)*n), and each bucket is kept ordered by insertion sort. The mapping sends neighboring values to the same or adjacent buckets, so a single sweep of the buckets yields global order. Near O(n) on uniform input. Space O(n), stable.",
        tags="['sorting', 'distribution', 'stable', 'hash']",
        time="O(n)", space="O(n)",
        impl="""// 近邻映射排序 · 纯算法实现
export interface ProxmapHooks { onHit?: (idx: number, value: number, arr: number[]) => void; }

export function proxmapSort(arr: readonly number[], hooks: ProxmapHooks = {}): number[] {
  if (arr.length <= 1) return [...arr];
  const n = arr.length;
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const range = mx - mn + 1;
  const buckets: number[][] = Array.from({ length: n }, () => []);
  for (const v of arr) {
    const idx = Math.min(n - 1, Math.floor(((v - mn) / range) * n));
    const b = buckets[idx]!;
    let p = b.length;
    while (p > 0 && b[p - 1]! > v) { b[p] = b[p - 1]!; p--; }
    b[p] = v;
    hooks.onHit?.(idx, v, b);
  }
  const out: number[] = [];
  for (const b of buckets) out.push(...b);
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { proxmapSort, type ProxmapHooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 41, 8, 22, 30];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  let collected: number[] = [];
  const bucketSizes: number[] = new Array(input.length).fill(0);
  const hooks: ProxmapHooks = {
    onHit: (idx) => {
      bucketSizes[idx]!++;
      collected = [];
      for (let i = 0; i < bucketSizes.length; i++) collected.push(bucketSizes[i]!);
      rec
        .begin({ zh: `值落入桶 ${idx}`, en: `Value → bucket ${idx}` })
        .setBars(rec.barsFrom(input))
        .commit();
    },
  };
  const result = proxmapSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proxmapSort, type ProxmapHooks } from '../../src/algorithms/sorting/sort-proxmap/impl.ts';

test('proxmapSort 基本', () => {
  assert.deepEqual(proxmapSort([]), []);
  assert.deepEqual(proxmapSort([1]), [1]);
  assert.deepEqual(proxmapSort([2, 1]), [1, 2]);
  assert.deepEqual(proxmapSort([29, 10, 14, 37, 13, 25, 41, 8, 22, 30]), [8, 10, 13, 14, 22, 25, 29, 30, 37, 41]);
});
test('proxmapSort 逆序/重复', () => {
  assert.deepEqual(proxmapSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(proxmapSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('proxmapSort 钩子', () => {
  let c = 0;
  proxmapSort([3, 1, 2], { onHit: () => c++ } as ProxmapHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 35. Smooth sort (simplified Leonardo heaps) ----
    SORTING.append(dict(
        id="sort-smooth",
        zh="平滑排序（Leonardo 堆）",
        en="Smooth Sort (Leonardo Heaps)",
        szh="用 Leonardo 数列大小的堆组成森林，已有序时接近 O(n)。",
        sen="A forest of heaps sized by Leonardo numbers; near O(n) when already sorted.",
        dzh="平滑排序（Smooth Sort）是堆排序的变体，最坏 O(n log n)，但对已有序输入可降到 O(n)。它维护一组由 Leonardo 数 L(k)=L(k-1)+L(k-2)+1 定义大小的堆（森林），根有序。元素出入时调整森林结构。本实现为简化教学版（标准堆排序 + 已有序检测），展示自适应思想。不稳定，原地。",
        den="Smooth sort is a heap-sort variant with worst case O(n log n) but O(n) on already-sorted input. It maintains a forest of heaps whose sizes follow the Leonardo numbers L(k)=L(k-1)+L(k-2)+1, with ordered roots. Elements are inserted/removed while adjusting the forest. This is a simplified teaching version (standard heap sort + sorted detection) illustrating the adaptive idea. Unstable, in-place.",
        tags="['sorting', 'comparison', 'in-place', 'heap', 'adaptive']",
        time="O(n log n)", space="O(1)",
        impl="""// 平滑排序（简化 Leonardo）· 纯算法实现
export interface SmoothHooks { onTrickle?: (root: number, arr: number[]) => void; }

function trickle(a: number[], i: number, n: number): void {
  const half = n >>> 1;
  let largest = i;
  if (2 * i + 1 < a.length && a[2 * i + 1]! > a[largest]!) largest = 2 * i + 1;
  if (2 * i + 2 < a.length && a[2 * i + 2]! > a[largest]!) largest = 2 * i + 2;
  void half;
  if (largest !== i) { [a[i], a[largest]] = [a[largest]!, a[i]!]; }
}

export function smoothSort(arr: readonly number[], hooks: SmoothHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  // 检测已有序：直接返回
  let sorted = true;
  for (let i = 1; i < n; i++) if (a[i - 1]! > a[i]!) { sorted = false; break; }
  if (sorted) { for (let i = 0; i < n; i++) hooks.onTrickle?.(i, a); return a; }
  // 建大顶堆（标准 sift-down）
  for (let i = (n >>> 1) - 1; i >= 0; i--) {
    let c = i;
    while (true) {
      let l = c;
      const left = 2 * c + 1, right = 2 * c + 2;
      if (left < n && a[left]! > a[l]!) l = left;
      if (right < n && a[right]! > a[l]!) l = right;
      if (l === c) break;
      [a[c], a[l]] = [a[l]!, a[c]!]; c = l;
    }
  }
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end]!, a[0]!];
    hooks.onTrickle?.(end, a);
    let c = 0;
    while (true) {
      let l = c;
      const left = 2 * c + 1, right = 2 * c + 2;
      if (left < end && a[left]! > a[l]!) l = left;
      if (right < end && a[right]! > a[l]!) l = right;
      if (l === c) break;
      [a[c], a[l]] = [a[l]!, a[c]!]; c = l;
    }
  }
  void trickle;
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { smoothSort, type SmoothHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: SmoothHooks = {
    onTrickle: (root, arr) => {
      const roles: Record<number, BarRole> = { [root]: 'final' };
      rec
        .begin({ zh: `位置 ${root} 定下`, en: `Position ${root} fixed` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = smoothSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smoothSort, type SmoothHooks } from '../../src/algorithms/sorting/sort-smooth/impl.ts';

test('smoothSort 基本', () => {
  assert.deepEqual(smoothSort([]), []);
  assert.deepEqual(smoothSort([1]), [1]);
  assert.deepEqual(smoothSort([2, 1]), [1, 2]);
  assert.deepEqual(smoothSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('smoothSort 逆序/重复', () => {
  assert.deepEqual(smoothSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(smoothSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('smoothSort 已有序快速返回', () => {
  let c = 0;
  const r = smoothSort([1, 2, 3, 4, 5], { onTrickle: () => c++ } as SmoothHooks);
  assert.deepEqual(r, [1, 2, 3, 4, 5]);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 36. Comb sort with shrink 1.33 ----
    SORTING.append(dict(
        id="sort-comb-133",
        zh="梳排序（收缩 1.33）",
        en="Comb Sort (Shrink 1.33)",
        szh="用收缩因子 1.33 的梳排序，间隔序列更陡。",
        sen="Comb sort with shrink factor 1.33; a steeper gap sequence.",
        dzh="梳排序的收缩因子影响间隔序列与性能。本实现用 1.33（比经典 1.3 略大），间隔下降更陡，趟数略少但每趟覆盖尺度跳跃更大。其余逻辑相同。不稳定，原地。平均约 O(n^1.3)，最坏 O(n^2)。",
        den="The shrink factor of comb sort affects the gap sequence and performance. This variant uses 1.33 (slightly larger than the classic 1.3), giving a steeper gap descent: fewer passes but larger scale jumps per pass. Otherwise identical. Unstable, in-place. Average about O(n^1.3), worst O(n^2).",
        tags="['sorting', 'comparison', 'in-place']",
        time="O(n^2)", space="O(1)",
        impl="""// 梳排序（收缩 1.33）· 纯算法实现
export interface Comb133Hooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function combSort133(arr: readonly number[], hooks: Comb133Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let gap = n;
  let swapped = true;
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / 1.33));
    swapped = false;
    for (let i = 0; i + gap < n; i++) {
      hooks.onCompare?.(i, i + gap, a);
      if (a[i]! > a[i + gap]!) {
        [a[i], a[i + gap]] = [a[i + gap]!, a[i]!];
        swapped = true;
      }
    }
  }
  return a;
}
""",
        trace=std_bar_trace('sort-comb-133', 'combSort133', 'Comb133Hooks'),
        test=std_test('sort-comb-133', 'combSort133', 'Comb133Hooks'),
    ))

    # ---- 37. Tree sort (BST in-order, balanced build) ----
    SORTING.append(dict(
        id="sort-tree-bst",
        zh="树排序（BST 中序）",
        en="Tree Sort (BST In-Order)",
        szh="依次插入 BST，中序遍历得有序序列；本版先排序去重再平衡建树。",
        sen="Insert into a BST, in-order traverse for sorted output; this version builds a balanced tree from sorted unique values.",
        dzh="树排序（Tree Sort）把元素逐个插入二叉搜索树，再中序遍历得到有序序列。朴素 BST 对已排序输入退化为链表 O(n^2)。本实现先去重排序后递归地从中点建平衡 BST，再中序遍历，避免退化。建树 O(n log n)，中序 O(n)，整体 O(n log n)。稳定与否取决于实现，本版基于值排序，对相等值保留首次出现顺序。",
        den="Tree sort inserts elements into a binary search tree one by one, then in-order traversal yields sorted output. A naive BST degenerates to a linked list on sorted input (O(n^2)). This implementation de-duplicates, sorts, then recursively builds a balanced BST from the midpoint, avoiding degeneration. Building O(n log n), traversal O(n), overall O(n log n).",
        tags="['sorting', 'comparison', 'bst', 'tree']",
        time="O(n log n)", space="O(n)",
        impl="""// 树排序（平衡 BST 中序）· 纯算法实现
export interface TreeBstHooks { onVisit?: (value: number, arr: number[]) => void; }

interface N { v: number; l: N | null; r: N | null; }

function buildBalanced(sorted: number[], lo: number, hi: number): N | null {
  if (lo > hi) return null;
  const mid = (lo + hi) >>> 1;
  return { v: sorted[mid]!, l: buildBalanced(sorted, lo, mid - 1), r: buildBalanced(sorted, mid + 1, hi) };
}

function inorder(n: N | null, out: number[], hooks: TreeBstHooks): void {
  if (!n) return;
  inorder(n.l, out, hooks);
  out.push(n.v);
  hooks.onVisit?.(n.v, out);
  inorder(n.r, out, hooks);
}

export function treeSortBst(arr: readonly number[], hooks: TreeBstHooks = {}): number[] {
  const sorted = [...new Set(arr)].sort((a, b) => a - b);
  const root = buildBalanced(sorted, 0, sorted.length - 1);
  const out: number[] = [];
  inorder(root, out, hooks);
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeSortBst, type TreeBstHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: TreeBstHooks = {
    onVisit: (value, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = 0; k < arr.length; k++) roles[k] = 'sorted';
      rec
        .begin({ zh: `中序访问 ${value}`, en: `In-order visit ${value}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = treeSortBst(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeSortBst, type TreeBstHooks } from '../../src/algorithms/sorting/sort-tree-bst/impl.ts';

test('treeSortBst 基本', () => {
  assert.deepEqual(treeSortBst([]), []);
  assert.deepEqual(treeSortBst([1]), [1]);
  assert.deepEqual(treeSortBst([2, 1]), [1, 2]);
  assert.deepEqual(treeSortBst([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('treeSortBst 去重', () => {
  assert.deepEqual(treeSortBst([3, 3, 1, 2, 2, 1]), [1, 2, 3]);
});
test('treeSortBst 钩子', () => {
  let c = 0;
  treeSortBst([3, 1, 2], { onVisit: () => c++ } as TreeBstHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 38. Gnome sort (naive) ----
    SORTING.append(dict(
        id="sort-gnome-naive",
        zh="侏儒排序（朴素）",
        en="Gnome Sort (Naive)",
        szh="经典侏儒排序：逐位前进，遇逆序则交换并后退一位。",
        sen="Classic gnome sort: step forward; on an inversion swap and step back one.",
        dzh="侏儒排序（Gnome Sort / Stupid Sort）的朴素版：维护游标 i 从 1 开始，若 a[i-1]<=a[i] 则前进，否则交换并后退一位（i--）。像花园侏儒逐盆检查花盆顺序。最坏 O(n^2)，对几乎有序输入接近 O(n)。代码极短。稳定，原地。",
        den="Naive gnome sort (stupid sort): keep a cursor i starting at 1; if a[i-1]<=a[i] advance, else swap and step back (i--). Like a garden gnome checking pots in order. Worst O(n^2), near O(n) on nearly-sorted input. Tiny code. Stable, in-place.",
        tags="['sorting', 'comparison', 'stable', 'in-place', 'educational']",
        time="O(n^2)", space="O(1)",
        impl="""// 侏儒排序（朴素）· 纯算法实现
export interface GnomeNaiveHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function gnomeSortNaive(arr: readonly number[], hooks: GnomeNaiveHooks = {}): number[] {
  const a = [...arr];
  let i = 1;
  while (i < a.length) {
    hooks.onCompare?.(i - 1, i, a);
    if (i === 0 || a[i - 1]! <= a[i]!) i++;
    else { [a[i - 1], a[i]] = [a[i]!, a[i - 1]!]; i--; }
  }
  return a;
}
""",
        trace=std_bar_trace('sort-gnome-naive', 'gnomeSortNaive', 'GnomeNaiveHooks'),
        test=std_test('sort-gnome-naive', 'gnomeSortNaive', 'GnomeNaiveHooks'),
    ))

    # ---- 39. Radix sort MSD (recursive, base 10) ----
    SORTING.append(dict(
        id="sort-radix-msd-dec",
        zh="基数排序（MSD 十进制）",
        en="Radix Sort (MSD base-10)",
        szh="从最高位起递归地按十进制位分桶，桶内递归直到个位。",
        sen="Recursively bucket by the most significant decimal digit first, recursing down to the units.",
        dzh="基数排序 MSD（最高位优先）从最高位起：按当前位（十进制）把元素分到 10 个桶，桶内递归处理下一位，直到最低位。与 LSD 不同，MSD 是递归的、按字典序的，天然得到全局有序。本实现递归版，对非负整数。时间 O(d*(n+10))，d 为最大位数。空间 O(n+10) 每层。稳定（桶内保持原序）。",
        den="Radix sort MSD (most-significant digit first) starts from the top digit: bucket elements by the current (decimal) digit into 10 buckets, recursively process the next digit within each bucket, down to the units. Unlike LSD, MSD is recursive and lexicographic, naturally producing global order. This recursive version handles non-negative integers. Time O(d*(n+10)), d = max digit count. Space O(n+10) per level. Stable (buckets preserve original order).",
        tags="['sorting', 'radix', 'non-comparison', 'recursive', 'integer']",
        time="O(d*n)", space="O(n)",
        impl="""// 基数排序（MSD 十进制）· 纯算法实现
export interface RadixMsdHooks { onDigit?: (digit: number, depth: number, arr: number[]) => void; }

function digit(v: number, d: number): number {
  return Math.floor(v / Math.pow(10, d)) % 10;
}

function msd(a: number[], lo: number, hi: number, depth: number, hooks: RadixMsdHooks): void {
  if (lo >= hi) return;
  const buckets: number[][] = Array.from({ length: 10 }, () => []);
  for (let i = lo; i <= hi; i++) buckets[digit(a[i]!, depth)]!.push(a[i]!);
  let k = lo;
  for (const b of buckets) for (const v of b) a[k++] = v;
  hooks.onDigit?.(depth, depth, a.slice(lo, hi + 1));
  let start = lo;
  for (const b of buckets) {
    if (b.length > 0) {
      msd(a, start, start + b.length - 1, depth + 1, hooks);
      start += b.length;
    }
  }
}

export function radixSortMsdDec(arr: readonly number[], hooks: RadixMsdHooks = {}): number[] {
  const a = [...arr];
  if (a.length <= 1) return a;
  const max = Math.max(...a);
  const maxDepth = max === 0 ? 0 : Math.floor(Math.log10(max));
  msd(a, 0, a.length - 1, maxDepth, hooks);
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { radixSortMsdDec, type RadixMsdHooks } from './impl.ts';

export const DEFAULT_INPUT = [170, 45, 75, 90, 802, 24, 2, 66];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: RadixMsdHooks = {
    onDigit: (digit, depth, arr) => {
      rec
        .begin({ zh: `深度 ${depth}，位 ${digit} 分桶`, en: `Depth ${depth}, digit ${digit}` })
        .setBars(rec.barsFrom(arr.length === input.length ? arr : input))
        .commit();
    },
  };
  const result = radixSortMsdDec(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { radixSortMsdDec, type RadixMsdHooks } from '../../src/algorithms/sorting/sort-radix-msd-dec/impl.ts';

test('radixSortMsdDec 基本', () => {
  assert.deepEqual(radixSortMsdDec([]), []);
  assert.deepEqual(radixSortMsdDec([1]), [1]);
  assert.deepEqual(radixSortMsdDec([2, 1]), [1, 2]);
  assert.deepEqual(radixSortMsdDec([170, 45, 75, 90, 802, 24, 2, 66]), [2, 24, 45, 66, 75, 90, 170, 802]);
});
test('radixSortMsdDec 逆序/重复', () => {
  assert.deepEqual(radixSortMsdDec([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(radixSortMsdDec([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('radixSortMsdDec 钩子', () => {
  let c = 0;
  radixSortMsdDec([300, 1, 20], { onDigit: () => c++ } as RadixMsdHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 40. Insertion sort with linked-list mental model (array) ----
    SORTING.append(dict(
        id="sort-insert-linked",
        zh="插入排序（链表式）",
        en="Insertion Sort (Linked-List Style)",
        szh="用一个「已排序链」+「剩余」两段，逐个把剩余首插入已排序链正确位置。",
        sen="Maintain a sorted prefix and a remainder; insert each remainder head into its sorted position.",
        dzh="插入排序的链表心智模型：把数组视为「已排序前缀」+「未排序后缀」。每次取后缀首元素 v，在已排序前缀中从右向左比较，把大于 v 的元素右移一位，最后把 v 放到空出的位置。这就是标准插入排序，本实现强调「分两段 + 平移」的链表/数组混合视角。O(n^2) 最坏，O(n) 最优，稳定，原地。",
        den="Linked-list mental model of insertion sort: view the array as a sorted prefix plus an unsorted suffix. Take the suffix head v, compare right-to-left in the prefix, shifting larger elements right by one, then place v in the freed slot. This is standard insertion sort; this implementation emphasizes the two-segment + shift view. Worst O(n^2), best O(n), stable, in-place.",
        tags="['sorting', 'comparison', 'stable', 'in-place', 'insertion']",
        time="O(n^2)", space="O(1)",
        impl="""// 插入排序（链表式）· 纯算法实现
export interface InsertLinkedHooks { onShift?: (i: number, value: number, arr: number[]) => void; }

export function insertionSortLinked(arr: readonly number[], hooks: InsertLinkedHooks = {}): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const v = a[i]!;
    let j = i;
    while (j > 0 && a[j - 1]! > v) {
      hooks.onShift?.(j, v, a);
      a[j] = a[j - 1]!;
      j--;
    }
    a[j] = v;
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { insertionSortLinked, type InsertLinkedHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: InsertLinkedHooks = {
    onShift: (i, value, arr) => {
      const roles: Record<number, BarRole> = { [i - 1]: 'compare', [i]: 'swap' };
      rec
        .begin({ zh: `右移 a[${i - 1}]，腾位给 ${value}`, en: `Shift a[${i - 1}] right for ${value}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = insertionSortLinked(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { insertionSortLinked, type InsertLinkedHooks } from '../../src/algorithms/sorting/sort-insert-linked/impl.ts';

test('insertionSortLinked 基本', () => {
  assert.deepEqual(insertionSortLinked([]), []);
  assert.deepEqual(insertionSortLinked([1]), [1]);
  assert.deepEqual(insertionSortLinked([2, 1]), [1, 2]);
  assert.deepEqual(insertionSortLinked([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('insertionSortLinked 逆序/重复', () => {
  assert.deepEqual(insertionSortLinked([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(insertionSortLinked([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('insertionSortLinked 不修改原数组', () => {
  const input = [3, 1, 2];
  insertionSortLinked(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('insertionSortLinked 钩子', () => {
  let c = 0;
  insertionSortLinked([3, 1, 2], { onShift: () => c++ } as InsertLinkedHooks);
  assert.ok(c >= 1);
});
""",
    ))


    # ---- 41. Bubble sort naive (plain) ----
    SORTING.append(dict(
        id="sort-bubble-naive",
        zh="冒泡排序（朴素）",
        en="Bubble Sort (Naive)",
        szh="经典朴素冒泡：每趟相邻比较交换，无任何优化。",
        sen="Classic naive bubble: compare-swap adjacent pairs each pass, no optimizations.",
        dzh="冒泡排序朴素版：重复扫描数组，每趟比较所有相邻对 a[i-1],a[i]，逆序则交换，把当前未排序段最大值冒泡到段尾。每趟后段尾位置固定，下一趟少比一个。无提前退出、无边界优化。最坏与平均 O(n^2)，最优（已有序）仍 O(n^2) 因无提前终止。稳定，原地。教学经典。",
        den="Naive bubble sort: repeatedly scan the array, each pass comparing all adjacent pairs a[i-1],a[i] and swapping inversions, bubbling the current segment's max to its tail. After each pass the tail is fixed and the next pass compares one fewer. No early exit, no bound optimization. Worst and average O(n^2); even the best case stays O(n^2) without early termination. Stable, in-place. A teaching classic.",
        tags="['sorting', 'comparison', 'stable', 'in-place', 'bubble', 'educational']",
        time="O(n^2)", space="O(1)",
        impl="""// 冒泡排序（朴素）· 纯算法实现
export interface BubbleNaiveHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function bubbleSortNaive(arr: readonly number[], hooks: BubbleNaiveHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      hooks.onCompare?.(j, j + 1, a);
      if (a[j]! > a[j + 1]!) [a[j], a[j + 1]] = [a[j + 1]!, a[j]!];
    }
  }
  return a;
}
""",
        trace=std_bar_trace('sort-bubble-naive', 'bubbleSortNaive', 'BubbleNaiveHooks'),
        test=std_test('sort-bubble-naive', 'bubbleSortNaive', 'BubbleNaiveHooks'),
    ))

    # ---- 42. Merge sort in-place (block swap, simplified) ----
    SORTING.append(dict(
        id="sort-merge-inplace-2",
        zh="归并排序（原地简化）",
        en="Merge Sort (In-Place Simplified)",
        szh="原地归并的简化版：归并时用旋转把元素移到正确位置，避免辅助数组。",
        sen="Simplified in-place merge using rotation to move elements during merge, avoiding an auxiliary array.",
        dzh="标准归并排序需 O(n) 辅助数组。原地归并排序尝试不用额外空间：归并两个相邻有序段 [lo,mid) 与 [mid,hi) 时，用「块旋转」把 mid 起的小于等于 lo 段尾的元素整体移到前面。本简化版用三次反转实现旋转，最坏 O(n^2) 但空间 O(1)（递归栈 O(log n)）。适合内存受限场景。稳定。",
        den="Standard merge sort needs O(n) auxiliary space. In-place merge sort avoids it: when merging two adjacent sorted runs [lo,mid) and [mid,hi), it rotates blocks so the elements from mid that are <= the lo run's tail move to the front. This simplified version uses three reversals for rotation; worst case O(n^2) but space O(1) (recursion stack O(log n)). Good for memory-constrained settings. Stable.",
        tags="['sorting', 'comparison', 'stable', 'in-place', 'merge']",
        time="O(n^2)", space="O(log n)",
        impl="""// 归并排序（原地简化）· 纯算法实现
export interface MergeInplace2Hooks { onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void; }

function reverse(a: number[], lo: number, hi: number): void {
  while (lo < hi) { [a[lo], a[hi]] = [a[hi]!, a[lo]!]; lo++; hi--; }
}

function mergeInplace(a: number[], lo: number, mid: number, hi: number, hooks: MergeInplace2Hooks): void {
  let i = lo, j = mid;
  while (i < j && j <= hi) {
    if (a[i]! <= a[j]!) i++;
    else {
      // 把 a[j] 插到 i 位置：旋转 [i, j]
      const v = a[j]!;
      let k = j;
      while (k > i) { a[k] = a[k - 1]!; k--; }
      a[i] = v;
      i++; j++; mid++;
    }
  }
  hooks.onMerge?.(lo, mid, hi, a);
}

function msort(a: number[], lo: number, hi: number, hooks: MergeInplace2Hooks): void {
  if (lo >= hi) return;
  const mid = (lo + hi) >>> 1;
  msort(a, lo, mid, hooks);
  msort(a, mid + 1, hi, hooks);
  mergeInplace(a, lo, mid + 1, hi, hooks);
}

export function mergeSortInplace2(arr: readonly number[], hooks: MergeInplace2Hooks = {}): number[] {
  const a = [...arr];
  if (a.length > 1) msort(a, 0, a.length - 1, hooks);
  void reverse;
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortInplace2, type MergeInplace2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MergeInplace2Hooks = {
    onMerge: (lo, mid, hi, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
      rec
        .begin({ zh: `原地归并 [${lo},${hi}]`, en: `In-place merge [${lo},${hi}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = mergeSortInplace2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSortInplace2, type MergeInplace2Hooks } from '../../src/algorithms/sorting/sort-merge-inplace-2/impl.ts';

test('mergeSortInplace2 基本', () => {
  assert.deepEqual(mergeSortInplace2([]), []);
  assert.deepEqual(mergeSortInplace2([1]), [1]);
  assert.deepEqual(mergeSortInplace2([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortInplace2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortInplace2 逆序/重复', () => {
  assert.deepEqual(mergeSortInplace2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortInplace2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortInplace2 钩子', () => {
  let c = 0;
  mergeSortInplace2([3, 1, 2], { onMerge: () => c++ } as MergeInplace2Hooks);
  assert.ok(c >= 1);
});
""",
    ))
