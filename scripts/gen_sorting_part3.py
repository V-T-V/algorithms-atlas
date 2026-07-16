#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Part 3 of sorting algorithms (43-45). Defines add_part3 like add_more2."""


def add_part3(SORTING, gen, std_bar_trace, std_test, write, ROOT, TEST_ROOT, esc):
    import os

    # ---- 43. Heap sort (ternary, with build-then-extract) ----
    SORTING.append(dict(
        id="sort-heap-ternary",
        zh="堆排序（三叉带构建）",
        en="Heap Sort (Ternary, Explicit Build)",
        szh="显式构建三叉大顶堆，再反复取堆顶到末尾。",
        sen="Explicitly build a ternary max-heap, then repeatedly extract the root to the tail.",
        dzh="三叉堆排序（d=3）显式版：阶段一从最后一个非叶子节点 floor((n-1)/3) 起向上逐个下沉，构建大顶三叉堆；阶段二反复交换堆顶（最大）与当前段尾，段长减一，对堆顶下沉恢复堆序。每个节点 3 个孩子，深度 log_3 n。整体 O(n log n)，不稳定，原地。与已有的弱堆变体互补，本版强调构建与提取两阶段。",
        den="Explicit ternary heap sort (d=3): phase one sifts up from the last non-leaf floor((n-1)/3) to build a max ternary heap; phase two repeatedly swaps the root (max) with the current tail, shrinks the segment, and sifts the root down to restore heap order. Three children per node, depth log_3 n. Overall O(n log n), unstable, in-place. Complements the existing weak-heap variant; this version emphasizes the build-then-extract two phases.",
        tags="['sorting', 'heap', 'in-place', 'comparison', 'd-ary']",
        time="O(n log n)", space="O(1)",
        impl="""// 堆排序（三叉带构建）· 纯算法实现
export interface HeapTernaryHooks { onExtract?: (k: number, arr: number[]) => void; }

function sift3(a: number[], root: number, size: number): void {
  while (true) {
    let largest = root;
    for (let c = 1; c <= 3; c++) {
      const child = 3 * root + c;
      if (child < size && a[child]! > a[largest]!) largest = child;
    }
    if (largest === root) break;
    [a[root], a[largest]] = [a[largest]!, a[root]!];
    root = largest;
  }
}

export function heapSortTernary(arr: readonly number[], hooks: HeapTernaryHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor((n - 1) / 3); i >= 0; i--) sift3(a, i, n);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end]!, a[0]!];
    hooks.onExtract?.(end, a);
    sift3(a, 0, end);
  }
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heapSortTernary, type HeapTernaryHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: HeapTernaryHooks = {
    onExtract: (k, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let i = k; i < arr.length; i++) roles[i] = 'sorted';
      rec
        .begin({ zh: `取出最大值到位置 ${k}`, en: `Extract max to ${k}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = heapSortTernary(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heapSortTernary, type HeapTernaryHooks } from '../../src/algorithms/sorting/sort-heap-ternary/impl.ts';

test('heapSortTernary 基本', () => {
  assert.deepEqual(heapSortTernary([]), []);
  assert.deepEqual(heapSortTernary([1]), [1]);
  assert.deepEqual(heapSortTernary([2, 1]), [1, 2]);
  assert.deepEqual(heapSortTernary([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('heapSortTernary 逆序/重复', () => {
  assert.deepEqual(heapSortTernary([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(heapSortTernary([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('heapSortTernary 钩子', () => {
  let c = 0;
  heapSortTernary([3, 1, 2], { onExtract: () => c++ } as HeapTernaryHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # ---- 44. Selection sort (naive, plain) ----
    SORTING.append(dict(
        id="sort-selection-naive",
        zh="选择排序（朴素）",
        en="Selection Sort (Naive)",
        szh="每轮在未排序段线性找最小，与段首交换。朴素版无任何优化。",
        sen="Each round linearly find the min in the unsorted segment and swap it to the segment head; no optimizations.",
        dzh="选择排序朴素版：维护已排序前缀长度 i。每轮在 a[i..n) 中线性扫描找最小值下标 mi，把 a[i] 与 a[mi] 交换，i++。比较次数固定 n(n-1)/2 次（与输入无关），交换次数最多 n-1 次（最少，适合写入代价高的场景）。最坏/平均/最优均 O(n^2) 比较。不稳定（交换可能跨过相等元素），原地。",
        den="Naive selection sort: maintain the sorted prefix length i. Each round linearly scan a[i..n) for the minimum index mi, swap a[i] with a[mi], then i++. Comparison count is fixed at n(n-1)/2 (input-independent); swap count at most n-1 (minimal, good when writes are expensive). Worst/average/best all O(n^2) comparisons. Unstable (a swap can jump over equal elements), in-place.",
        tags="['sorting', 'comparison', 'in-place', 'selection', 'educational']",
        time="O(n^2)", space="O(1)",
        impl="""// 选择排序（朴素）· 纯算法实现
export interface SelectionNaiveHooks { onCompare?: (i: number, j: number, arr: number[]) => void; }

export function selectionSortNaive(arr: readonly number[], hooks: SelectionNaiveHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let mi = i;
    for (let j = i + 1; j < n; j++) {
      hooks.onCompare?.(j, mi, a);
      if (a[j]! < a[mi]!) mi = j;
    }
    if (mi !== i) [a[i], a[mi]] = [a[mi]!, a[i]!];
  }
  return a;
}
""",
        trace=std_bar_trace('sort-selection-naive', 'selectionSortNaive', 'SelectionNaiveHooks'),
        test=std_test('sort-selection-naive', 'selectionSortNaive', 'SelectionNaiveHooks'),
    ))

    # ---- 45. Merge sort top-down (recursive, classic) ----
    SORTING.append(dict(
        id="sort-merge-topdown",
        zh="归并排序（自顶向下）",
        en="Merge Sort (Top-Down Recursive)",
        szh="经典分治：递归拆半排序再归并，稳定 O(n log n)。",
        sen="Classic divide-and-conquer: recursively split in half, sort, and merge; stable O(n log n).",
        dzh="归并排序自顶向下版：把数组从中间一分为二，递归排序左半与右半，再用双指针归并两段有序子数组。递归基为长度 <= 1（已有序）。每层归并 O(n)，共 O(log n) 层，总 O(n log n)。需要 O(n) 辅助数组。稳定（归并时左段优先）。适合需要稳定排序或链表场景。本实现即教科书经典版。",
        den="Top-down merge sort: split the array in half, recursively sort each half, then merge the two sorted runs with two pointers. The base case is length <= 1 (already sorted). Each level merges in O(n); there are O(log n) levels, total O(n log n). Needs O(n) auxiliary space. Stable (left run takes priority on ties). Good when a stable sort or linked-list handling is needed. This is the textbook version.",
        tags="['sorting', 'comparison', 'stable', 'divide-and-conquer', 'recursive']",
        time="O(n log n)", space="O(n)",
        impl="""// 归并排序（自顶向下）· 纯算法实现
export interface MergeTopDownHooks { onMerge?: (lo: number, mid: number, hi: number, arr: number[]) => void; }

function msort(a: number[], aux: number[], lo: number, hi: number, hooks: MergeTopDownHooks): void {
  if (lo >= hi) return;
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

export function mergeSortTopDown(arr: readonly number[], hooks: MergeTopDownHooks = {}): number[] {
  const a = [...arr];
  if (a.length <= 1) return a;
  const aux = new Array<number>(a.length);
  msort(a, aux, 0, a.length - 1, hooks);
  return a;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortTopDown, type MergeTopDownHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MergeTopDownHooks = {
    onMerge: (lo, mid, hi, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
      rec
        .begin({ zh: `归并 [${lo},${hi}]`, en: `Merge [${lo},${hi}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = mergeSortTopDown(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSortTopDown, type MergeTopDownHooks } from '../../src/algorithms/sorting/sort-merge-topdown/impl.ts';

test('mergeSortTopDown 基本', () => {
  assert.deepEqual(mergeSortTopDown([]), []);
  assert.deepEqual(mergeSortTopDown([1]), [1]);
  assert.deepEqual(mergeSortTopDown([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortTopDown([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortTopDown 逆序/重复', () => {
  assert.deepEqual(mergeSortTopDown([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortTopDown([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortTopDown 不修改原数组', () => {
  const input = [3, 1, 2];
  mergeSortTopDown(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('mergeSortTopDown 钩子', () => {
  let c = 0;
  mergeSortTopDown([3, 1, 2], { onMerge: () => c++ } as MergeTopDownHooks);
  assert.ok(c >= 1);
});
""",
    ))

    return SORTING
