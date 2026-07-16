#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Searching algorithms batch D (26-45)."""
# noqa: E501


def add_batch_d(A, std_search_trace, std_search_test):
    # 26. Find first bad version (binary search for boundary)
    A.append(dict(
        id="search-first-bad-2",
        zh="查找首个坏版本",
        en="First Bad Version",
        szh="二分查找单调布尔数组中第一个 true（坏版本）的位置。",
        sen="Binary search for the first true (bad version) in a monotone boolean array.",
        dzh="首个坏版本：n 个版本从某个起全部损坏（isBadVersion(i) 从某版本起恒 true），找第一个坏版本。这是经典的二分边界查找：lo=1, hi=n，mid 坏则候选 ans=mid 向左 hi=mid-1，否则向右 lo=mid+1。时间 O(log n)。本实现接受一个 isBad 谓词函数。",
        den="First bad version: n versions are all bad from some point on (isBadVersion(i) is true from some version); find the first bad one. Classic binary boundary search: lo=1, hi=n; if mid is bad set ans=mid and go left (hi=mid-1), else go right. Time O(log n). This implementation takes an isBad predicate.",
        tags="['searching', 'binary-search', 'boundary', 'monotone']",
        time="O(log n)", space="O(1)",
        impl="""// 查找首个坏版本 · 纯算法实现
export interface FirstBad2Hooks { onCheck?: (mid: number) => void; }

export function firstBadVersion2(n: number, isBad: (v: number) => boolean, hooks: FirstBad2Hooks = {}): number {
  let lo = 1, hi = n, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCheck?.(mid);
    if (isBad(mid)) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
  }
  return ans;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { firstBadVersion2, type FirstBad2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 10;
export const DEFAULT_BAD_AT = 4;

export function buildTrace(n: number = DEFAULT_INPUT, badAt: number = DEFAULT_BAD_AT): Frame[] {
  const rec = new TraceRecorder();
  const isBad = (v: number): boolean => v >= badAt;
  const versions = Array.from({ length: n }, (_, i) => i + 1);
  rec
    .begin({ zh: `${n} 个版本，从第 ${badAt} 个起全部坏`, en: `${n} versions, all bad from #${badAt}` })
    .setArray(versions, versions.map((v) => (isBad(v) ? 'warn' : 'default') as BarRole), [])
    .commit();
  const hooks: FirstBad2Hooks = {
    onCheck: (mid) => {
      const roles = versions.map((v) => (v === mid ? 'compare' : isBad(v) ? 'warn' : 'default') as BarRole);
      rec
        .begin({ zh: `检查版本 ${mid}：${isBad(mid) ? '坏' : '好'}`, en: `Check v${mid}: ${isBad(mid) ? 'bad' : 'good'}` })
        .setArray(versions, roles, [{ index: mid - 1, label: 'mid' }])
        .commit();
    },
  };
  const r = firstBadVersion2(n, isBad, hooks);
  rec
    .begin({ zh: `首个坏版本：${r}`, en: `First bad version: ${r}` })
    .setArray(versions, versions.map((v) => (v === r ? 'final' : isBad(v) ? 'warn' : 'default') as BarRole), [{ index: r - 1, label: 'V' }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstBadVersion2, type FirstBad2Hooks } from '../../src/algorithms/searching/search-first-bad-2/impl.ts';

test('firstBadVersion2 基本', () => {
  assert.equal(firstBadVersion2(5, (v) => v >= 4), 4);
  assert.equal(firstBadVersion2(5, (v) => v >= 1), 1);
  assert.equal(firstBadVersion2(10, (v) => v >= 7), 7);
  assert.equal(firstBadVersion2(1, (v) => v >= 1), 1);
});
test('firstBadVersion2 钩子', () => {
  let c = 0;
  firstBadVersion2(10, (v) => v >= 7, { onCheck: () => c++ } as FirstBad2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 27. H-index via sorting then linear scan
    A.append(dict(
        id="search-h-index-2",
        zh="H 指数",
        en="H-Index",
        szh="排序后线性找最大的 h 使至少 h 篇论文引用 >= h。",
        sen="Sort then linearly find the largest h with at least h papers having >= h citations.",
        dzh="H 指数：研究者有 n 篇论文，各篇引用数为 citations[i]，h 指数是最大的 h 使得至少 h 篇论文引用数 >= h。本实现先降序排序，再线性找最大的 i 使 citations[i] >= i+1，返回该 i+1。时间 O(n log n)（排序主导），空间 O(1)（原地排序副本）。LeetCode 274。",
        den="H-index: a researcher has n papers with citations[i] citations each; the h-index is the largest h such that at least h papers have >= h citations. This implementation sorts descending then linearly finds the largest i with citations[i] >= i+1, returning i+1. Time O(n log n) (sort dominated), space O(1) (in-place on a copy). LeetCode 274.",
        tags="['searching', 'h-index', 'sort', 'linear']",
        time="O(n log n)", space="O(1)",
        impl="""// H 指数 · 纯算法实现
export interface HIndex2Hooks { onStep?: (i: number, value: number) => void; }

export function hIndex2(citations: readonly number[], hooks: HIndex2Hooks = {}): number {
  const sorted = [...citations].sort((a, b) => b - a);
  let h = 0;
  for (let i = 0; i < sorted.length; i++) {
    hooks.onStep?.(i, sorted[i]!);
    if (sorted[i]! >= i + 1) h = i + 1;
    else break;
  }
  return h;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hIndex2, type HIndex2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 0, 6, 1, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => b - a);
  rec
    .begin({ zh: `引用数降序：[${sorted.join(',')}]`, en: `Citations desc: [${sorted.join(',')}]` })
    .setBars(rec.barsFrom(sorted))
    .commit();
  const hooks: HIndex2Hooks = {
    onStep: (i, value) => {
      const roles: Record<number, BarRole> = { [i]: 'compare' };
      for (let k = 0; k < i; k++) roles[k] = 'final';
      rec
        .begin({ zh: `citations[${i}]=${value} >= ${i + 1}?`, en: `citations[${i}]=${value} >= ${i + 1}?` })
        .setBars(rec.barsFrom(sorted, roles))
        .commit();
    },
  };
  const r = hIndex2(input, hooks);
  rec
    .begin({ zh: `H 指数 = ${r}`, en: `H-index = ${r}` })
    .setBars(rec.barsFrom(sorted))
    .setAux([{ label: 'h-index', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hIndex2, type HIndex2Hooks } from '../../src/algorithms/searching/search-h-index-2/impl.ts';

test('hIndex2 基本', () => {
  assert.equal(hIndex2([3, 0, 6, 1, 5]), 3);
  assert.equal(hIndex2([1, 1, 3]), 1);
  assert.equal(hIndex2([100]), 1);
});
test('hIndex2 边界', () => {
  assert.equal(hIndex2([]), 0);
  assert.equal(hIndex2([0, 0, 0]), 0);
  assert.equal(hIndex2([6, 6, 6, 6, 6]), 5);
});
test('hIndex2 钩子', () => {
  let c = 0;
  hIndex2([3, 0, 6, 1, 5], { onStep: () => c++ } as HIndex2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 28. Find single element in sorted array (all others appear twice)
    A.append(dict(
        id="search-single-elem-2",
        zh="查找单一元素",
        en="Single Element in Sorted Array",
        szh="二分找有序数组中唯一只出现一次的元素（其余成对）。",
        sen="Binary search for the only once-occurring element in a sorted array (others in pairs).",
        dzh="单一元素：给定一个有序数组，其中除一个元素外其余都恰好出现两次，找那个单一元素。利用「成对元素首下标偶/奇性」：二分 mid，若 mid 偶且 arr[mid]==arr[mid+1]（或 mid 奇且 arr[mid]==arr[mid-1]）说明单一元素在右半，否则左半。时间 O(log n)，空间 O(1)。LeetCode 540。",
        den="Single element: given a sorted array where every element except one appears exactly twice, find that single element. Exploit the even/odd parity of paired elements' first indices: binary search mid; if mid is even and arr[mid]==arr[mid+1] (or mid odd and arr[mid]==arr[mid-1]) the single is in the right half, else the left. Time O(log n), space O(1). LeetCode 540.",
        tags="['searching', 'binary-search', 'single', 'xor-pattern']",
        time="O(log n)", space="O(1)",
        impl="""// 查找单一元素 · 纯算法实现
export interface SingleElem2Hooks { onCompare?: (mid: number) => void; }

export function singleNonDuplicate2(arr: readonly number[], hooks: SingleElem2Hooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    let mid = (lo + hi) >>> 1;
    if (mid % 2 === 1) mid--;
    hooks.onCompare?.(mid);
    if (arr[mid]! === arr[mid + 1]!) lo = mid + 2;
    else hi = mid;
  }
  return arr[lo]!;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { singleNonDuplicate2, type SingleElem2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 1, 2, 3, 3, 4, 4, 8, 8];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `有序数组，仅一个单一元素`, en: `Sorted array, only one single element` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: SingleElem2Hooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      if (mid + 1 < n) roles[mid + 1] = 'compare';
      rec
        .begin({ zh: `比较 a[${mid}] 与 a[${mid + 1}]`, en: `Compare a[${mid}] vs a[${mid + 1}]` })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = singleNonDuplicate2(input, hooks);
  const idx = input.indexOf(r);
  rec
    .begin({ zh: `单一元素 = ${r}`, en: `Single element = ${r}` })
    .setArray(input, undefined, [{ index: idx, label: 'V' }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { singleNonDuplicate2, type SingleElem2Hooks } from '../../src/algorithms/searching/search-single-elem-2/impl.ts';

test('singleNonDuplicate2 基本', () => {
  assert.equal(singleNonDuplicate2([1, 1, 2, 3, 3, 4, 4, 8, 8]), 2);
  assert.equal(singleNonDuplicate2([3, 3, 7, 7, 10, 11, 11]), 10);
  assert.equal(singleNonDuplicate2([1]), 1);
});
test('singleNonDuplicate2 钩子', () => {
  let c = 0;
  singleNonDuplicate2([1, 1, 2, 3, 3, 4, 4, 8, 8], { onCompare: () => c++ } as SingleElem2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 29. Find duplicate (Floyd-like on index-linked cycle)
    A.append(dict(
        id="search-duplicate-2",
        zh="查找重复数（链环）",
        en="Find Duplicate (Cycle)",
        szh="把值当下标成链，用快慢指针找环入口即重复数。",
        sen="Treat values as next-index to form a linked cycle; slow/fast pointers find the entry = duplicate.",
        dzh="查找重复数：n+1 个数，值域 [1,n]，恰有一个重复（可能多次）。把数组视为隐式链表 i -> arr[i]，因值域有限必有环，环入口即重复数。用 Floyd 龟兔赛跑：慢指针一步、快指针两步相遇后，重置慢指针到 0 同速前进再次相遇即入口。时间 O(n)，空间 O(1)，不修改数组。LeetCode 287。",
        den="Find the duplicate: n+1 numbers in range [1,n] with exactly one duplicate (possibly multiple times). View the array as an implicit linked list i -> arr[i]; the bounded range guarantees a cycle whose entry is the duplicate. Use Floyd tortoise and hare: slow moves one step, fast two; after they meet, reset slow to 0 and advance both one step until they meet again at the entry. Time O(n), space O(1), no array modification. LeetCode 287.",
        tags="['searching', 'floyd', 'cycle', 'duplicate']",
        time="O(n)", space="O(1)",
        impl="""// 查找重复数（链环）· 纯算法实现
export interface Dup2Hooks { onStep?: (pos: number, who: 'slow' | 'fast') => void; }

export function findDuplicate2(arr: readonly number[], hooks: Dup2Hooks = {}): number {
  let slow = arr[0]!, fast = arr[0]!;
  do {
    slow = arr[slow]!;
    fast = arr[arr[fast]!]!;
    hooks.onStep?.(slow, 'slow');
  } while (slow !== fast);
  slow = arr[0]!;
  while (slow !== fast) {
    slow = arr[slow]!;
    fast = arr[fast]!;
    hooks.onStep?.(slow, 'slow');
  }
  return slow;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findDuplicate2, type Dup2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 4, 2, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `数组：[${input.join(',')}]（值当下标成链）`, en: `Array: [${input.join(',')}]` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Dup2Hooks = {
    onStep: (pos) => {
      rec
        .begin({ zh: `指针到达位置 ${pos}`, en: `Pointer at ${pos}` })
        .setArray(input, undefined, [{ index: pos, label: 'p' }])
        .commit();
    },
  };
  const r = findDuplicate2(input, hooks);
  rec
    .begin({ zh: `重复数 = ${r}`, en: `Duplicate = ${r}` })
    .setAux([{ label: 'duplicate', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findDuplicate2, type Dup2Hooks } from '../../src/algorithms/searching/search-duplicate-2/impl.ts';

test('findDuplicate2 基本', () => {
  assert.equal(findDuplicate2([1, 3, 4, 2, 2]), 2);
  assert.equal(findDuplicate2([3, 1, 3, 4, 2]), 3);
  assert.equal(findDuplicate2([1, 1]), 1);
  assert.equal(findDuplicate2([1, 1, 2]), 1);
});
test('findDuplicate2 钩子', () => {
  let c = 0;
  findDuplicate2([1, 3, 4, 2, 2], { onStep: () => c++ } as Dup2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 30. K-th smallest via sorting (select k-th)
    A.append(dict(
        id="search-kth-smallest",
        zh="第 k 小元素（排序）",
        en="K-th Smallest (Sort)",
        szh="排序后直接取第 k 小（下标 k-1）。",
        sen="Sort then take the k-th smallest (index k-1).",
        dzh="第 k 小元素：简单实现是排序后取 arr[k-1]。本实现即此法，时间 O(n log n)，空间 O(n)。适合一次性查询；若需多次查询或在线，用快速选择 O(n) 平均或堆 O(n log k)。",
        den="K-th smallest: the simple approach is to sort and take arr[k-1]. This is that, time O(n log n), space O(n). Good for one-shot queries; for repeated or online queries use quickselect (average O(n)) or a heap (O(n log k)).",
        tags="['searching', 'selection', 'sort', 'order-statistic']",
        time="O(n log n)", space="O(n)",
        impl="""// 第 k 小元素（排序）· 纯算法实现
export interface KthHooks { onPick?: (value: number) => void; }

export function kthSmallest(arr: readonly number[], k: number, hooks: KthHooks = {}): number {
  if (k < 1 || k > arr.length) throw new RangeError('k 超出范围');
  const sorted = [...arr].sort((a, b) => a - b);
  const v = sorted[k - 1]!;
  hooks.onPick?.(v);
  return v;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthSmallest, type KthHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 10, 4, 3, 20, 15];
export const DEFAULT_K = 3;

export function buildTrace(input: number[] = DEFAULT_INPUT, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => a - b);
  rec
    .begin({ zh: `排序后取第 ${k} 小`, en: `Sort and take the ${k}-th smallest` })
    .setBars(rec.barsFrom(sorted))
    .commit();
  const hooks: KthHooks = {
    onPick: (value) => {
      const idx = sorted.indexOf(value);
      const roles: Record<number, BarRole> = { [idx]: 'final' };
      rec
        .begin({ zh: `第 ${k} 小 = ${value}`, en: `${k}-th smallest = ${value}` })
        .setBars(rec.barsFrom(sorted, roles))
        .commit();
    },
  };
  kthSmallest(input, k, hooks);
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kthSmallest, type KthHooks } from '../../src/algorithms/searching/search-kth-smallest/impl.ts';

test('kthSmallest 基本', () => {
  assert.equal(kthSmallest([7, 10, 4, 3, 20, 15], 3), 7);
  assert.equal(kthSmallest([7, 10, 4, 3, 20, 15], 1), 3);
  assert.equal(kthSmallest([7, 10, 4, 3, 20, 15], 6), 20);
});
test('kthSmallest 边界', () => {
  assert.equal(kthSmallest([5], 1), 5);
  assert.throws(() => kthSmallest([1, 2], 3));
  assert.throws(() => kthSmallest([1, 2], 0));
});
test('kthSmallest 钩子', () => {
  let c = 0;
  kthSmallest([7, 10, 4], 2, { onPick: () => c++ } as KthHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 31. Quickselect (k-th smallest, average O(n))
    A.append(dict(
        id="search-quickselect",
        zh="快速选择（第 k 小）",
        en="Quickselect",
        szh="类快排的分区法，平均 O(n) 找第 k 小元素。",
        sen="Quicksort-style partitioning to find the k-th smallest in average O(n).",
        dzh="快速选择（Quickselect）是快速排序的选择版：选一个 pivot 分区，若 pivot 最终位置恰为 k-1 则返回；若 k-1 在左段递归左段，否则递归右段。每轮把搜索范围缩小，平均 O(n)，最坏 O(n^2)（可用随机 pivot 缓解）。原地，不稳定。Hoare 选择算法。",
        den="Quickselect is the selection version of quicksort: pick a pivot, partition; if the pivot's final position is exactly k-1 return it; if k-1 is in the left segment recurse left, else right. Each round shrinks the search range, average O(n), worst O(n^2) (mitigated by a random pivot). In-place, unstable. Hoare's selection algorithm.",
        tags="['searching', 'quickselect', 'partition', 'order-statistic']",
        time="O(n)", space="O(1)",
        impl="""// 快速选择（第 k 小）· 纯算法实现
export interface QuickselectHooks { onPartition?: (pivotIdx: number, arr: number[]) => void; }

export function quickselect(arr: readonly number[], k: number, hooks: QuickselectHooks = {}): number {
  if (k < 1 || k > arr.length) throw new RangeError('k 超出范围');
  const a = [...arr];
  let lo = 0, hi = a.length - 1, target = k - 1;
  while (lo < hi) {
    const pivot = a[hi]!;
    let i = lo;
    for (let j = lo; j < hi; j++) if (a[j]! <= pivot) { [a[i]!, a[j]!] = [a[j]!, a[i]!]; i++; }
    [a[i]!, a[hi]!] = [a[hi]!, a[i]!];
    hooks.onPartition?.(i, a);
    if (i === target) return a[i]!;
    if (i < target) lo = i + 1;
    else hi = i - 1;
  }
  return a[lo]!;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselect, type QuickselectHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 10, 4, 3, 20, 15];
export const DEFAULT_K = 3;

export function buildTrace(input: number[] = DEFAULT_INPUT, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `在 [${input.join(',')}] 中找第 ${k} 小`, en: `Find ${k}-th smallest in [${input.join(',')}]` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: QuickselectHooks = {
    onPartition: (_pivotIdx, arr) => {
      rec
        .begin({ zh: `分区后：[${arr.join(',')}]`, en: `After partition: [${arr.join(',')}]` })
        .setBars(rec.barsFrom(arr))
        .commit();
    },
  };
  const r = quickselect(input, k, hooks);
  rec
    .begin({ zh: `第 ${k} 小 = ${r}`, en: `${k}-th smallest = ${r}` })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselect, type QuickselectHooks } from '../../src/algorithms/searching/search-quickselect/impl.ts';

test('quickselect 基本', () => {
  assert.equal(quickselect([7, 10, 4, 3, 20, 15], 3), 7);
  assert.equal(quickselect([7, 10, 4, 3, 20, 15], 1), 3);
  assert.equal(quickselect([7, 10, 4, 3, 20, 15], 6), 20);
});
test('quickselect 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselect(input, 2);
  assert.deepEqual(input, [3, 1, 2]);
});
test('quickselect 边界', () => {
  assert.equal(quickselect([5], 1), 5);
  assert.throws(() => quickselect([1, 2], 3));
});
test('quickselect 钩子', () => {
  let c = 0;
  quickselect([7, 10, 4], 2, { onPartition: () => c++ } as QuickselectHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 32. Median of two sorted arrays (binary on smaller)
    A.append(dict(
        id="search-median-two",
        zh="两个有序数组中位数",
        en="Median of Two Sorted Arrays",
        szh="对较短数组二分切分点，使左右两半元素数相等且边界有序，O(log(min))。",
        sen="Binary search the partition on the shorter array so both halves are equal-sized and ordered; O(log(min)).",
        dzh="两有序数组中位数：经典 O(log(min(m,n))) 算法。在较短数组 A 上二分切分点 i，则 B 的切分点 j = (m+n+1)/2 - i。检查 A[i-1]<=B[j] 且 B[j-1]<=A[i] 即找到正确切分，中位数由切分两侧边界决定。奇偶总数分别处理。LeetCode 4。",
        den="Median of two sorted arrays: the classic O(log(min(m,n))) algorithm. Binary search the partition point i on the shorter array A; then B partition j = (m+n+1)/2 - i. Check A[i-1]<=B[j] and B[j-1]<=A[i] to find the correct partition; the median is decided by the partition boundary values, handling odd/even totals separately. LeetCode 4.",
        tags="['searching', 'binary-search', 'median', 'two-arrays']",
        time="O(log min(m,n))", space="O(1)",
        impl="""// 两个有序数组中位数 · 纯算法实现
export interface MedianTwoHooks { onPartition?: (i: number, j: number) => void; }

export function medianOfTwoSorted(nums1: readonly number[], nums2: readonly number[], hooks: MedianTwoHooks = {}): number {
  let A = nums1, B = nums2;
  if (A.length > B.length) [A, B] = [B, A];
  const m = A.length, n = B.length;
  let lo = 0, hi = m, half = Math.floor((m + n + 1) / 2);
  while (lo <= hi) {
    const i = (lo + hi) >>> 1;
    const j = half - i;
    hooks.onPartition?.(i, j);
    const aLeft = i === 0 ? -Infinity : A[i - 1]!;
    const aRight = i === m ? Infinity : A[i]!;
    const bLeft = j === 0 ? -Infinity : B[j - 1]!;
    const bRight = j === n ? Infinity : B[j]!;
    if (aLeft <= bRight && bLeft <= aRight) {
      if ((m + n) % 2 === 1) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    } else if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOfTwoSorted, type MedianTwoHooks } from './impl.ts';

export const DEFAULT_INPUT_A = [1, 3];
export const DEFAULT_INPUT_B = [2];

export function buildTrace(a: number[] = DEFAULT_INPUT_A, b: number[] = DEFAULT_INPUT_B): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `A=[${a.join(',')}] B=[${b.join(',')}]`, en: `A=[${a.join(',')}] B=[${b.join(',')}]` })
    .setAux([{ label: 'A', value: `[${a.join(',')}]`, role: 'pivot' as BarRole }, { label: 'B', value: `[${b.join(',')}]`, role: 'frontier' as BarRole }])
    .commit();
  const hooks: MedianTwoHooks = {
    onPartition: (i, j) => {
      rec
        .begin({ zh: `切分 i=${i}, j=${j}`, en: `Partition i=${i}, j=${j}` })
        .setAux([{ label: 'i', value: String(i), role: 'compare' as BarRole }, { label: 'j', value: String(j), role: 'compare' as BarRole }])
        .commit();
    },
  };
  const r = medianOfTwoSorted(a, b, hooks);
  rec
    .begin({ zh: `中位数 = ${r}`, en: `Median = ${r}` })
    .setAux([{ label: 'median', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianOfTwoSorted, type MedianTwoHooks } from '../../src/algorithms/searching/search-median-two/impl.ts';

test('medianOfTwoSorted 基本', () => {
  assert.equal(medianOfTwoSorted([1, 3], [2]), 2);
  assert.equal(medianOfTwoSorted([1, 2], [3, 4]), 2.5);
  assert.equal(medianOfTwoSorted([0, 0], [0, 0]), 0);
  assert.equal(medianOfTwoSorted([], [1]), 1);
  assert.equal(medianOfTwoSorted([2], []), 2);
});
test('medianOfTwoSorted 钩子', () => {
  let c = 0;
  medianOfTwoSorted([1, 3], [2], { onPartition: () => c++ } as MedianTwoHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 33. Find k-th fib via iteration
    A.append(dict(
        id="search-kth-fib-2",
        zh="查找第 k 个斐波那契数",
        en="K-th Fibonacci Number",
        szh="迭代计算第 k 个斐波那契数（F(0)=0, F(1)=1）。",
        sen="Iteratively compute the k-th Fibonacci number (F(0)=0, F(1)=1).",
        dzh="查找第 k 个斐波那契数：给定 k，返回 F(k)。本实现用迭代法（避免递归指数爆炸与重复计算），从 F(0)=0, F(1)=1 起迭代 k 步。时间 O(k)，空间 O(1)。斐波那契数列在算法分析、动态规划、黄金分割中 ubiquitous。",
        den="K-th Fibonacci number: given k, return F(k). This implementation uses iteration (avoiding recursive blow-up and recomputation) starting from F(0)=0, F(1)=1 for k steps. Time O(k), space O(1). Fibonacci numbers are ubiquitous in algorithm analysis, dynamic programming, and the golden ratio.",
        tags="['searching', 'fibonacci', 'iterative', 'sequence']",
        time="O(k)", space="O(1)",
        impl="""// 查找第 k 个斐波那契数 · 纯算法实现
export interface Fib2Hooks { onStep?: (k: number, value: number) => void; }

export function kthFibonacci2(k: number, hooks: Fib2Hooks = {}): number {
  if (k < 0) throw new RangeError('k 不能为负');
  if (k === 0) return 0;
  let a = 0, b = 1;
  for (let i = 2; i <= k; i++) {
    const c = a + b;
    hooks.onStep?.(i, c);
    a = b; b = c;
  }
  return b;
}
""",
        trace="""import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthFibonacci2, type Fib2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 10;

export function buildTrace(k: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values: number[] = [0, 1];
  rec
    .begin({ zh: `计算 F(0)=0, F(1)=1`, en: `Start F(0)=0, F(1)=1` })
    .setBars(rec.barsFrom(values))
    .commit();
  const hooks: Fib2Hooks = {
    onStep: (kk, value) => {
      values.push(value);
      rec
        .begin({ zh: `F(${kk}) = ${value}`, en: `F(${kk}) = ${value}` })
        .setBars(rec.barsFrom(values))
        .commit();
    },
  };
  kthFibonacci2(k, hooks);
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kthFibonacci2, type Fib2Hooks } from '../../src/algorithms/searching/search-kth-fib-2/impl.ts';

test('kthFibonacci2 基本', () => {
  assert.equal(kthFibonacci2(0), 0);
  assert.equal(kthFibonacci2(1), 1);
  assert.equal(kthFibonacci2(2), 1);
  assert.equal(kthFibonacci2(10), 55);
  assert.equal(kthFibonacci2(20), 6765);
});
test('kthFibonacci2 边界', () => {
  assert.throws(() => kthFibonacci2(-1));
});
test('kthFibonacci2 钩子', () => {
  let c = 0;
  kthFibonacci2(10, { onStep: () => c++ } as Fib2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 34. Find missing number (sum or xor)
    A.append(dict(
        id="search-missing-2",
        zh="查找缺失数字",
        en="Missing Number",
        szh="0..n 中缺失一个数，用求和公式减去实际和得到缺失值。",
        sen="Of 0..n one number is missing; subtract the actual sum from the expected sum.",
        dzh="缺失数字：数组含 0..n 中的 n 个数（缺一个），找缺失值。用求和公式：期望和 = n(n+1)/2（n 为数组长度+1），实际和遍历累加，缺失 = 期望 - 实际。也可用异或（全部异或再异或 0..n）。时间 O(n)，空间 O(1)。LeetCode 268。",
        den="Missing number: the array holds n of the numbers 0..n (one missing); find it. Sum formula: expected = n(n+1)/2 (n = length+1), actual = sum of array, missing = expected - actual. XOR also works (XOR all, then XOR 0..n). Time O(n), space O(1). LeetCode 268.",
        tags="['searching', 'missing', 'sum', 'math']",
        time="O(n)", space="O(1)",
        impl="""// 查找缺失数字 · 纯算法实现
export interface Missing2Hooks { onSum?: (i: number, sum: number) => void; }

export function missingNumber2(arr: readonly number[], hooks: Missing2Hooks = {}): number {
  const n = arr.length;
  let sum = 0;
  for (let i = 0; i < n; i++) { sum += arr[i]!; hooks.onSum?.(i, sum); }
  const expected = (n * (n + 1)) / 2;
  return expected - sum;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { missingNumber2, type Missing2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 0, 1];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `数组：[${input.join(',')}]（0..n 缺一）`, en: `Array: [${input.join(',')}]` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Missing2Hooks = {
    onSum: (i, sum) => {
      const roles: BarRole[] = new Array(input.length).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `累加 a[${i}]，当前和 = ${sum}`, en: `Add a[${i}], sum = ${sum}` })
        .setArray(input, roles, [{ index: i, label: 'i' }])
        .commit();
    },
  };
  const r = missingNumber2(input, hooks);
  rec
    .begin({ zh: `缺失数字 = ${r}`, en: `Missing = ${r}` })
    .setAux([{ label: 'missing', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { missingNumber2, type Missing2Hooks } from '../../src/algorithms/searching/search-missing-2/impl.ts';

test('missingNumber2 基本', () => {
  assert.equal(missingNumber2([3, 0, 1]), 2);
  assert.equal(missingNumber2([0, 1]), 2);
  assert.equal(missingNumber2([9, 6, 4, 2, 3, 5, 7, 0, 1]), 8);
});
test('missingNumber2 边界', () => {
  assert.equal(missingNumber2([0]), 1);
  assert.equal(missingNumber2([1]), 0);
});
test('missingNumber2 钩子', () => {
  let c = 0;
  missingNumber2([3, 0, 1], { onSum: () => c++ } as Missing2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 35. Majority element (Boyer-Moore vote)
    A.append(dict(
        id="search-majority",
        zh="多数元素（投票法）",
        en="Majority Element (Boyer-Moore)",
        szh="Boyer-Moore 投票：维护候选与计数，O(n) O(1) 找出现超过 n/2 次的元素。",
        sen="Boyer-Moore voting: maintain a candidate and counter; O(n) O(1) for the element appearing more than n/2 times.",
        dzh="多数元素：数组中出现次数超过 n/2 的元素（题目保证存在）。Boyer-Moore 投票算法：维护候选 candidate 与计数 count，遍历时若 count=0 则换候选，当前元素等于候选则 count++，否则 count--。最终候选即多数元素。时间 O(n)，空间 O(1)。LeetCode 169。",
        den="Majority element: the element appearing more than n/2 times (guaranteed to exist). Boyer-Moore voting: maintain a candidate and count; when count is 0 switch candidate; if the current element equals candidate increment count, else decrement. The final candidate is the majority. Time O(n), space O(1). LeetCode 169.",
        tags="['searching', 'majority', 'boyer-moore', 'voting']",
        time="O(n)", space="O(1)",
        impl="""// 多数元素（投票法）· 纯算法实现
export interface MajorityHooks { onVote?: (i: number, candidate: number, count: number) => void; }

export function majorityElement(arr: readonly number[], hooks: MajorityHooks = {}): number {
  let candidate = 0, count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (count === 0) candidate = arr[i]!;
    count += arr[i]! === candidate ? 1 : -1;
    hooks.onVote?.(i, candidate, count);
  }
  return candidate;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { majorityElement, type MajorityHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 2, 1, 1, 1, 2, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `数组：[${input.join(',')}]`, en: `Array: [${input.join(',')}]` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: MajorityHooks = {
    onVote: (i, candidate, count) => {
      const roles: BarRole[] = new Array(input.length).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `a[${i}]=${input[i]} 候选=${candidate} 计数=${count}`, en: `a[${i}]=${input[i]} cand=${candidate} cnt=${count}` })
        .setArray(input, roles, [{ index: i, label: 'i' }])
        .setAux([{ label: 'cand', value: String(candidate), role: 'pivot' as BarRole }, { label: 'cnt', value: String(count), role: 'frontier' as BarRole }])
        .commit();
    },
  };
  const r = majorityElement(input, hooks);
  rec
    .begin({ zh: `多数元素 = ${r}`, en: `Majority = ${r}` })
    .setAux([{ label: 'majority', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { majorityElement, type MajorityHooks } from '../../src/algorithms/searching/search-majority/impl.ts';

test('majorityElement 基本', () => {
  assert.equal(majorityElement([2, 2, 1, 1, 1, 2, 2]), 2);
  assert.equal(majorityElement([3, 3, 4]), 3);
  assert.equal(majorityElement([1]), 1);
});
test('majorityElement 钩子', () => {
  let c = 0;
  majorityElement([2, 2, 1], { onVote: () => c++ } as MajorityHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 36. Find pair with given sum in sorted array (two-pointer)
    A.append(dict(
        id="search-pair-sum",
        zh="两数之和（有序双指针）",
        en="Two Sum (Sorted Two-Pointer)",
        szh="升序数组用左右双指针找和等于 target 的一对。",
        sen="Two-pointer scan on a sorted array to find a pair summing to target.",
        dzh="两数之和（有序版）：升序数组中找两个数之和等于 target。双指针法：lo=0, hi=n-1，若 arr[lo]+arr[hi] < target 则 lo++，> target 则 hi--，相等即返回。时间 O(n)，空间 O(1)。比哈希法省空间。LeetCode 167。",
        den="Two sum (sorted): find two numbers in a sorted array summing to target. Two-pointer: lo=0, hi=n-1; if arr[lo]+arr[hi] < target lo++, if > target hi--, equal returns. Time O(n), space O(1). More space-efficient than the hash approach. LeetCode 167.",
        tags="['searching', 'two-pointer', 'pair-sum', 'sorted']",
        time="O(n)", space="O(1)",
        impl="""// 两数之和（有序双指针）· 纯算法实现
export interface PairSumHooks { onCompare?: (lo: number, hi: number) => void; }

export function twoSumSorted(arr: readonly number[], target: number, hooks: PairSumHooks = {}): [number, number] {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    hooks.onCompare?.(lo, hi);
    const s = arr[lo]! + arr[hi]!;
    if (s === target) return [lo, hi];
    if (s < target) lo++;
    else hi--;
  }
  return [-1, -1];
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoSumSorted, type PairSumHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 7, 11, 15, 20, 25];
export const DEFAULT_TARGET = 22;

export function buildTrace(input: number[] = DEFAULT_INPUT, target: number = DEFAULT_TARGET): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `在升序数组中找和为 ${target} 的一对`, en: `Find pair summing to ${target}` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: PairSumHooks = {
    onCompare: (lo, hi) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[lo] = 'compare';
      roles[hi] = 'pivot';
      rec
        .begin({ zh: `a[${lo}]+a[${hi}]=${input[lo]! + input[hi]!}`, en: `a[${lo}]+a[${hi}]=${input[lo]! + input[hi]!}` })
        .setArray(input, roles, [{ index: lo, label: 'lo' }, { index: hi, label: 'hi' }])
        .commit();
    },
  };
  const [lo, hi] = twoSumSorted(input, target, hooks);
  const hit = lo >= 0;
  const roles: BarRole[] = new Array(n).fill('default');
  if (hit) { roles[lo] = 'final'; roles[hi] = 'final'; }
  rec
    .begin(hit ? { zh: `命中：a[${lo}]+a[${hi}]=${target}`, en: `Found: a[${lo}]+a[${hi}]=${target}` } : { zh: `未找到`, en: `Not found` })
    .setArray(input, roles, hit ? [{ index: lo, label: 'L' }, { index: hi, label: 'R' }] : [])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSumSorted, type PairSumHooks } from '../../src/algorithms/searching/search-pair-sum/impl.ts';

test('twoSumSorted 命中', () => {
  assert.deepEqual(twoSumSorted([2, 7, 11, 15, 20, 25], 22), [1, 2]);
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 9), [0, 1]);
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 26), [2, 3]);
});
test('twoSumSorted 未命中', () => {
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 100), [-1, -1]);
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 10), [-1, -1]);
});
test('twoSumSorted 边界', () => {
  assert.deepEqual(twoSumSorted([], 1), [-1, -1]);
  assert.deepEqual(twoSumSorted([5], 5), [-1, -1]);
});
test('twoSumSorted 钩子', () => {
  let c = 0;
  twoSumSorted([2, 7, 11, 15], 9, { onCompare: () => c++ } as PairSumHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 37. Find intersection of two sorted arrays
    A.append(dict(
        id="search-intersect-sorted",
        zh="有序数组交集",
        en="Intersection of Sorted Arrays",
        szh="双指针扫描两个升序数组找共同元素。",
        sen="Two-pointer scan of two sorted arrays for common elements.",
        dzh="有序数组交集：两个升序数组找共同元素（去重）。双指针 lo1, lo2 同时前进：相等则加入结果（并跳过重复），不等则较小方前进。时间 O(m+n)，空间 O(1)（不计结果）。LeetCode 349/350 变体。",
        den="Sorted-array intersection: find common elements (deduped) of two ascending arrays. Two pointers advance together: on equality add to result (skipping duplicates), else advance the smaller side. Time O(m+n), space O(1) excluding the result. LeetCode 349/350 variant.",
        tags="['searching', 'two-pointer', 'intersection', 'sorted']",
        time="O(m+n)", space="O(1)",
        impl="""// 有序数组交集 · 纯算法实现
export interface IntersectHooks { onCompare?: (i: number, j: number) => void; }

export function intersectSorted(a: readonly number[], b: readonly number[], hooks: IntersectHooks = {}): number[] {
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    hooks.onCompare?.(i, j);
    if (a[i]! === b[j]!) {
      if (out.length === 0 || out[out.length - 1]! !== a[i]!) out.push(a[i]!);
      i++; j++;
    } else if (a[i]! < b[j]!) i++;
    else j++;
  }
  return out;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intersectSorted, type IntersectHooks } from './impl.ts';

export const DEFAULT_INPUT_A = [1, 2, 2, 3, 4, 6];
export const DEFAULT_INPUT_B = [2, 3, 5, 6];

export function buildTrace(a: number[] = DEFAULT_INPUT_A, b: number[] = DEFAULT_INPUT_B): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `A=[${a.join(',')}] B=[${b.join(',')}]`, en: `A=[${a.join(',')}] B=[${b.join(',')}]` })
    .setArray(a, undefined, [])
    .commit();
  const hooks: IntersectHooks = {
    onCompare: (i, j) => {
      const roles: BarRole[] = new Array(a.length).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `比较 A[${i}]=${a[i]} 与 B[${j}]=${b[j]}`, en: `Compare A[${i}]=${a[i]} vs B[${j}]=${b[j]}` })
        .setArray(a, roles, [{ index: i, label: 'i' }])
        .setAux([{ label: 'B[j]', value: String(b[j]), role: 'pivot' as BarRole }])
        .commit();
    },
  };
  const r = intersectSorted(a, b, hooks);
  rec
    .begin({ zh: `交集 = [${r.join(',')}]`, en: `Intersection = [${r.join(',')}]` })
    .setAux([{ label: 'result', value: `[${r.join(',')}]`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intersectSorted, type IntersectHooks } from '../../src/algorithms/searching/search-intersect-sorted/impl.ts';

test('intersectSorted 基本', () => {
  assert.deepEqual(intersectSorted([1, 2, 2, 3, 4, 6], [2, 3, 5, 6]), [2, 3, 6]);
  assert.deepEqual(intersectSorted([1, 2, 3], [4, 5, 6]), []);
  assert.deepEqual(intersectSorted([], [1, 2]), []);
});
test('intersectSorted 全交集', () => {
  assert.deepEqual(intersectSorted([1, 2, 3], [1, 2, 3]), [1, 2, 3]);
});
test('intersectSorted 钩子', () => {
  let c = 0;
  intersectSorted([1, 2], [2, 3], { onCompare: () => c++ } as IntersectHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 38. Binary search with duplicate leftmost (recursive)
    A.append(dict(
        id="search-leftmost-recursive",
        zh="二分查找（递归最左）",
        en="Binary Search (Recursive Leftmost)",
        szh="递归实现：找目标值最左一次出现的下标。",
        sen="Recursive implementation: find the leftmost index of the target.",
        dzh="递归版最左二分查找：在 [lo, hi] 上递归，命中时不立即返回而是继续向左子区 [lo, mid-1] 搜索更左的命中，用候选变量记录。递归基 lo > hi 时返回候选。展示二分的递归写法，时间 O(log n)，空间 O(log n)（递归栈）。",
        den="Recursive leftmost binary search: recurse on [lo, hi]; on a hit do not return immediately but keep searching the left sub-range [lo, mid-1] for an earlier hit, recording candidates. The base case lo > hi returns the candidate. Demonstrates the recursive form. Time O(log n), space O(log n) (recursion stack).",
        tags="['searching', 'binary-search', 'recursive', 'leftmost']",
        time="O(log n)", space="O(log n)",
        impl="""// 二分查找（递归最左）· 纯算法实现
export interface LeftRecurHooks { onCompare?: (mid: number) => void; }

function rec(a: readonly number[], target: number, lo: number, hi: number, ans: number, hooks: LeftRecurHooks): number {
  if (lo > hi) return ans;
  const mid = (lo + hi) >>> 1;
  hooks.onCompare?.(mid);
  if (a[mid]! === target) return rec(a, target, lo, mid - 1, mid, hooks);
  if (a[mid]! < target) return rec(a, target, mid + 1, hi, ans, hooks);
  return rec(a, target, lo, mid - 1, ans, hooks);
}

export function binarySearchLeftmostRecursive(arr: readonly number[], target: number, hooks: LeftRecurHooks = {}): number {
  return rec(arr, target, 0, arr.length - 1, -1, hooks);
}
""",
        trace=std_search_trace('search-leftmost-recursive', 'binarySearchLeftmostRecursive', 'LeftRecurHooks',
                               "[1, 3, 3, 3, 5, 7, 9]", 3, 'onCompare', '比较'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearchLeftmostRecursive, type LeftRecurHooks } from '../../src/algorithms/searching/search-leftmost-recursive/impl.ts';

const A = [1, 3, 3, 3, 5, 7, 9];
test('binarySearchLeftmostRecursive 命中', () => {
  assert.equal(binarySearchLeftmostRecursive(A, 3), 1);
  assert.equal(binarySearchLeftmostRecursive(A, 1), 0);
  assert.equal(binarySearchLeftmostRecursive(A, 9), 6);
});
test('binarySearchLeftmostRecursive 未命中', () => {
  assert.equal(binarySearchLeftmostRecursive(A, 0), -1);
  assert.equal(binarySearchLeftmostRecursive(A, 4), -1);
  assert.equal(binarySearchLeftmostRecursive(A, 10), -1);
});
test('binarySearchLeftmostRecursive 边界', () => {
  assert.equal(binarySearchLeftmostRecursive([], 1), -1);
  assert.equal(binarySearchLeftmostRecursive([5], 5), 0);
});
test('binarySearchLeftmostRecursive 钩子', () => {
  let c = 0;
  binarySearchLeftmostRecursive(A, 3, { onCompare: () => c++ } as LeftRecurHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 39. Linear search (plain, returns first match)
    A.append(dict(
        id="search-linear-2",
        zh="线性查找（朴素）",
        en="Linear Search (Naive)",
        szh="从头到尾逐个比较找目标值，无序数组也可用。",
        sen="Compare one by one from start to end; works on unsorted arrays.",
        dzh="线性查找（顺序查找）：最朴素的查找，从头到尾逐个元素与 target 比较，相等则返回下标，遍历完未命中返回 -1。无需数组有序。时间 O(n)，空间 O(1)。是其它查找算法的基线。",
        den="Linear (sequential) search: the most naive search, comparing each element with target from start to end; return the index on equality, -1 if exhausted. No ordering required. Time O(n), space O(1). The baseline for other search algorithms.",
        tags="['searching', 'linear', 'unsorted', 'naive']",
        time="O(n)", space="O(1)",
        impl="""// 线性查找（朴素）· 纯算法实现
export interface Linear2Hooks { onCompare?: (i: number) => void; }

export function linearSearch2(arr: readonly number[], target: number, hooks: Linear2Hooks = {}): number {
  for (let i = 0; i < arr.length; i++) {
    hooks.onCompare?.(i);
    if (arr[i]! === target) return i;
  }
  return -1;
}
""",
        trace=std_search_trace('search-linear-2', 'linearSearch2', 'Linear2Hooks',
                               "[9, 3, 7, 1, 5, 11, 13, 2, 8, 4]", 8, 'onCompare', '比较'),
        test=std_search_test('search-linear-2', 'linearSearch2', 'Linear2Hooks'),
    ))

    # 40. Binary search iterative standard
    A.append(dict(
        id="search-binary-iter",
        zh="二分查找（迭代标准）",
        en="Binary Search (Iterative Standard)",
        szh="标准迭代二分：命中即返回，时间 O(log n)。",
        sen="Standard iterative binary search; return on hit, O(log n).",
        dzh="标准迭代二分查找：在升序数组中取中点 mid，命中返回；target 较大向右 lo=mid+1，较小向左 hi=mid-1；lo>hi 时未命中返回 -1。这是最经典的二分写法，时间 O(log n)，空间 O(1)。",
        den="Standard iterative binary search: take the midpoint mid in a sorted array; return on hit; if target is larger go right (lo=mid+1), smaller go left (hi=mid-1); when lo>hi return -1 (miss). The most classic binary search form. Time O(log n), space O(1).",
        tags="['searching', 'binary-search', 'iterative', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 二分查找（迭代标准）· 纯算法实现
export interface BinIterHooks { onCompare?: (mid: number) => void; }

export function binarySearchIter(arr: readonly number[], target: number, hooks: BinIterHooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
""",
        trace=std_search_trace('search-binary-iter', 'binarySearchIter', 'BinIterHooks',
                               "[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]", 15, 'onCompare', '比较'),
        test=std_search_test('search-binary-iter', 'binarySearchIter', 'BinIterHooks'),
    ))

    # 41. Jump search with step = sqrt(n) (classic)
    A.append(dict(
        id="search-jump-classic",
        zh="跳跃查找（经典）",
        en="Jump Search (Classic)",
        szh="经典跳跃查找：步长 sqrt(n)，定位块后线性扫描。",
        sen="Classic jump search: step sqrt(n), locate a block then linear-scan.",
        dzh="经典跳跃查找（Jump Search）：步长 m = floor(sqrt(n))，从下标 m-1 起每次跳跃 m 步探测，直到 arr[pos] >= target 或越界；然后在候选块 [pos-m, pos] 内线性扫描。时间 O(sqrt(n))（sqrt(n) 次跳跃 + 最多 sqrt(n) 次线性比较），空间 O(1)。介于线性与二分之间。",
        den="Classic jump search: step m = floor(sqrt(n)); starting at index m-1 jump m each time until arr[pos] >= target or out of bounds; then linear-scan the candidate block [pos-m, pos]. Time O(sqrt(n)) (sqrt(n) jumps + at most sqrt(n) linear comparisons), space O(1). Sits between linear and binary.",
        tags="['searching', 'jump', 'sorted', 'classic']",
        time="O(sqrt n)", space="O(1)",
        impl="""// 跳跃查找（经典）· 纯算法实现
export interface JumpClassicHooks { onJump?: (pos: number) => void; onLinear?: (i: number) => void; }

export function jumpSearchClassic(arr: readonly number[], target: number, hooks: JumpClassicHooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0, pos = Math.min(step - 1, n - 1);
  while (pos < n && arr[pos]! < target) { hooks.onJump?.(pos); prev = pos + 1; pos += step; }
  const hi = Math.min(pos, n - 1);
  for (let i = prev; i <= hi; i++) {
    hooks.onLinear?.(i);
    if (arr[i]! === target) return i;
    if (arr[i]! > target) return -1;
  }
  return -1;
}
""",
        trace=std_search_trace('search-jump-classic', 'jumpSearchClassic', 'JumpClassicHooks',
                               "[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]", 15, 'onJump', '跳跃'),
        test=std_search_test('search-jump-classic', 'jumpSearchClassic', 'JumpClassicHooks', 'onJump'),
    ))

    # 42. Count elements in range [lo, hi] via binary bounds
    A.append(dict(
        id="search-count-range",
        zh="区间内元素计数",
        en="Count in Range",
        szh="用上界/下界二分统计升序数组中值落在 [lo,hi] 的元素数。",
        sen="Count elements of a sorted array whose values fall in [lo,hi] via upper/lower bounds.",
        dzh="区间计数：升序数组中统计值在闭区间 [loVal, hiVal] 内的元素个数。用两次二分：lower = 第一个 >= loVal 的下标，upper = 第一个 > hiVal 的下标，个数 = upper - lower。时间 O(log n)，空间 O(1)。",
        den="Range count: count elements of a sorted array with values in the closed interval [loVal, hiVal]. Two binary searches: lower = first index with arr[i] >= loVal, upper = first index with arr[i] > hiVal; count = upper - lower. Time O(log n), space O(1).",
        tags="['searching', 'binary-search', 'range-count', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 区间内元素计数 · 纯算法实现
export interface CountRangeHooks { onBound?: (idx: number) => void; }

export function countInRange(arr: readonly number[], loVal: number, hiVal: number, hooks: CountRangeHooks = {}): number {
  const n = arr.length;
  let lo = 0, hi = n;
  while (lo < hi) { const m = (lo + hi) >>> 1; if (arr[m]! < loVal) lo = m + 1; else hi = m; }
  const lower = lo;
  hooks.onBound?.(lower);
  hi = n;
  while (lo < hi) { const m = (lo + hi) >>> 1; if (arr[m]! <= hiVal) lo = m + 1; else hi = m; }
  const upper = lo;
  hooks.onBound?.(upper);
  return Math.max(0, upper - lower);
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countInRange, type CountRangeHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const DEFAULT_LO = 3;
export const DEFAULT_HI = 7;

export function buildTrace(input: number[] = DEFAULT_INPUT, loVal: number = DEFAULT_LO, hiVal: number = DEFAULT_HI): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const inRange = (v: number): boolean => v >= loVal && v <= hiVal;
  rec
    .begin({ zh: `统计值在 [${loVal}, ${hiVal}] 内的元素数`, en: `Count values in [${loVal}, ${hiVal}]` })
    .setArray(input, input.map((v) => (inRange(v) ? 'frontier' : 'default') as BarRole), [])
    .commit();
  const hooks: CountRangeHooks = {
    onBound: (idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[idx] = 'compare';
      rec
        .begin({ zh: `边界下标 = ${idx}`, en: `Bound index = ${idx}` })
        .setArray(input, roles, [{ index: idx, label: 'b' }])
        .commit();
    },
  };
  const r = countInRange(input, loVal, hiVal, hooks);
  rec
    .begin({ zh: `区间内元素数 = ${r}`, en: `Count in range = ${r}` })
    .setAux([{ label: 'count', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countInRange, type CountRangeHooks } from '../../src/algorithms/searching/search-count-range/impl.ts';

const A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
test('countInRange 基本', () => {
  assert.equal(countInRange(A, 3, 7), 5);
  assert.equal(countInRange(A, 1, 10), 10);
  assert.equal(countInRange(A, 5, 5), 1);
});
test('countInRange 区间外', () => {
  assert.equal(countInRange(A, 0, 0), 0);
  assert.equal(countInRange(A, 11, 20), 0);
  assert.equal(countInRange(A, 5, 4), 0);
});
test('countInRange 边界', () => {
  assert.equal(countInRange([], 1, 2), 0);
  assert.equal(countInRange([5], 5, 5), 1);
});
test('countInRange 钩子', () => {
  let c = 0;
  countInRange(A, 3, 7, { onBound: () => c++ } as CountRangeHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 43. Find pair with given difference (sorted two-pointer)
    A.append(dict(
        id="search-pair-diff",
        zh="查找差值对",
        en="Pair with Given Difference",
        szh="升序数组双指针找差为 d 的一对。",
        sen="Two-pointer on a sorted array to find a pair with a given difference.",
        dzh="差值对查找：升序数组中找两个数 a[i], a[j] 使 a[j] - a[i] = d（d>=0）。双指针：i=0, j=1，若 a[j]-a[i] < d 则 j++，> d 则 i++，相等则返回。注意 i==j 时 j++。时间 O(n)，空间 O(1)。",
        den="Pair-with-difference: find two numbers a[i], a[j] in a sorted array with a[j] - a[i] = d (d>=0). Two pointers: i=0, j=1; if a[j]-a[i] < d j++, if > d i++, equal returns. When i==j advance j. Time O(n), space O(1).",
        tags="['searching', 'two-pointer', 'pair-diff', 'sorted']",
        time="O(n)", space="O(1)",
        impl="""// 查找差值对 · 纯算法实现
export interface PairDiffHooks { onCompare?: (i: number, j: number) => void; }

export function pairWithDifference(arr: readonly number[], d: number, hooks: PairDiffHooks = {}): [number, number] {
  let i = 0, j = 1;
  const n = arr.length;
  while (i < n && j < n) {
    hooks.onCompare?.(i, j);
    if (i === j) { j++; continue; }
    const diff = arr[j]! - arr[i]!;
    if (diff === d) return [i, j];
    if (diff < d) j++;
    else i++;
  }
  return [-1, -1];
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pairWithDifference, type PairDiffHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 8, 12, 15];
export const DEFAULT_TARGET = 7;

export function buildTrace(input: number[] = DEFAULT_INPUT, d: number = DEFAULT_TARGET): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `找差为 ${d} 的一对`, en: `Find pair with difference ${d}` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: PairDiffHooks = {
    onCompare: (i, j) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      roles[j] = 'pivot';
      rec
        .begin({ zh: `a[${j}]-a[${i}]=${input[j]! - input[i]!}`, en: `a[${j}]-a[${i}]=${input[j]! - input[i]!}` })
        .setArray(input, roles, [{ index: i, label: 'i' }, { index: j, label: 'j' }])
        .commit();
    },
  };
  const [i, j] = pairWithDifference(input, d, hooks);
  const hit = i >= 0;
  const roles: BarRole[] = new Array(n).fill('default');
  if (hit) { roles[i] = 'final'; roles[j] = 'final'; }
  rec
    .begin(hit ? { zh: `命中：a[${j}]-a[${i}]=${d}`, en: `Found: a[${j}]-a[${i}]=${d}` } : { zh: `未找到`, en: `Not found` })
    .setArray(input, roles, hit ? [{ index: i, label: 'i' }, { index: j, label: 'j' }] : [])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pairWithDifference, type PairDiffHooks } from '../../src/algorithms/searching/search-pair-diff/impl.ts';

test('pairWithDifference 命中', () => {
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 7), [1, 4]);
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 2), [0, 1]);
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 0), [-1, -1]);
});
test('pairWithDifference 未命中', () => {
  assert.deepEqual(pairWithDifference([1, 3, 5, 8, 12, 15], 100), [-1, -1]);
  assert.deepEqual(pairWithDifference([], 1), [-1, -1]);
});
test('pairWithDifference 钩子', () => {
  let c = 0;
  pairWithDifference([1, 3, 5, 8, 12, 15], 7, { onCompare: () => c++ } as PairDiffHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 44. Find fixed point (arr[i] == i) in sorted distinct array
    A.append(dict(
        id="search-fixed-point",
        zh="查找不动点",
        en="Find Fixed Point",
        szh="升序互异数组中找 i 使 arr[i] == i，二分 O(log n)。",
        sen="Find i with arr[i] == i in a sorted distinct array via binary search, O(log n).",
        dzh="不动点查找：升序且元素互异的数组中找下标 i 使 arr[i] == i。利用互异性：若 arr[mid] < mid 则左半必无解（arr[i] <= arr[mid]-(mid-i) < i），向右 lo=mid+1；arr[mid] > mid 则右半必无解，向左 hi=mid-1。时间 O(log n)，空间 O(1)。",
        den="Fixed-point search: find index i with arr[i] == i in a sorted array with distinct elements. By distinctness: if arr[mid] < mid the left half has no solution (arr[i] <= arr[mid]-(mid-i) < i), go right lo=mid+1; if arr[mid] > mid the right half has no solution, go left hi=mid-1. Time O(log n), space O(1).",
        tags="['searching', 'binary-search', 'fixed-point', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 查找不动点 · 纯算法实现
export interface FixedPointHooks { onCompare?: (mid: number) => void; }

export function findFixedPoint(arr: readonly number[], hooks: FixedPointHooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === mid) return mid;
    if (arr[mid]! < mid) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findFixedPoint, type FixedPointHooks } from './impl.ts';

export const DEFAULT_INPUT = [-10, -5, 0, 3, 7];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `升序互异数组找 arr[i]==i`, en: `Find arr[i]==i in sorted distinct array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: FixedPointHooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      rec
        .begin({ zh: `比较 a[${mid}]=${input[mid]} 与 ${mid}`, en: `Compare a[${mid}]=${input[mid]} vs ${mid}` })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findFixedPoint(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  if (r >= 0) roles2[r] = 'final';
  rec
    .begin(r >= 0 ? { zh: `不动点下标 ${r}`, en: `Fixed point at ${r}` } : { zh: `无不动点`, en: `No fixed point` })
    .setArray(input, roles2, r >= 0 ? [{ index: r, label: 'V' }] : [])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findFixedPoint, type FixedPointHooks } from '../../src/algorithms/searching/search-fixed-point/impl.ts';

test('findFixedPoint 命中', () => {
  assert.equal(findFixedPoint([-10, -5, 0, 3, 7]), 3);
  assert.equal(findFixedPoint([-1, 1, 3, 5]), 1);
});
test('findFixedPoint 未命中', () => {
  assert.equal(findFixedPoint([1, 2, 3, 4]), -1);
  assert.equal(findFixedPoint([-1, 0, 1, 2]), -1);
});
test('findFixedPoint 边界', () => {
  assert.equal(findFixedPoint([]), -1);
  assert.equal(findFixedPoint([0]), 0);
});
test('findFixedPoint 钩子', () => {
  let c = 0;
  findFixedPoint([-10, -5, 0, 3, 7], { onCompare: () => c++ } as FixedPointHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 45. Find local minimum (smaller than neighbors)
    A.append(dict(
        id="search-local-min",
        zh="查找局部最小",
        en="Find Local Minimum",
        szh="二分找比相邻元素都小的局部最小（互异数组），O(log n)。",
        sen="Binary search for a local minimum (smaller than neighbors) in a distinct array, O(log n).",
        dzh="局部最小查找：互异数组中找一个比左右邻居都小的元素（边界只需比唯一邻居小）。二分：比较 arr[mid] 与 arr[mid+1]，若 arr[mid] < arr[mid+1] 则左半（含 mid）必有局部最小 hi=mid，否则右半 lo=mid+1。时间 O(log n)，空间 O(1)。",
        den="Local-minimum search: find an element smaller than both neighbors in a distinct array (boundaries need only beat the single neighbor). Binary search: compare arr[mid] with arr[mid+1]; if arr[mid] < arr[mid+1] the left half (including mid) has a local min hi=mid, else right half lo=mid+1. Time O(log n), space O(1).",
        tags="['searching', 'binary-search', 'local-minimum', 'unsorted']",
        time="O(log n)", space="O(1)",
        impl="""// 查找局部最小 · 纯算法实现
export interface LocalMinHooks { onCompare?: (mid: number) => void; }

export function findLocalMinimum(arr: readonly number[], hooks: LocalMinHooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  if (n === 1) return 0;
  if (arr[0]! < arr[1]!) return 0;
  if (arr[n - 1]! < arr[n - 2]!) return n - 1;
  let lo = 1, hi = n - 2;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < arr[mid - 1]! && arr[mid]! < arr[mid + 1]!) return mid;
    if (arr[mid]! > arr[mid - 1]!) hi = mid - 1;
    else lo = mid + 1;
  }
  return lo;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findLocalMinimum, type LocalMinHooks } from './impl.ts';

export const DEFAULT_INPUT = [9, 6, 3, 14, 5, 7, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `互异数组找局部最小`, en: `Find local min in distinct array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: LocalMinHooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      if (mid - 1 >= 0) roles[mid - 1] = 'pivot';
      if (mid + 1 < n) roles[mid + 1] = 'pivot';
      rec
        .begin({ zh: `检查 a[${mid}]=${input[mid]}`, en: `Check a[${mid}]=${input[mid]}` })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findLocalMinimum(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  if (r >= 0) roles2[r] = 'final';
  rec
    .begin({ zh: `局部最小下标 ${r}`, en: `Local min at ${r}` })
    .setArray(input, roles2, r >= 0 ? [{ index: r, label: 'V' }] : [])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findLocalMinimum, type LocalMinHooks } from '../../src/algorithms/searching/search-local-min/impl.ts';

test('findLocalMinimum 是局部最小', () => {
  const A = [9, 6, 3, 14, 5, 7, 4];
  const i = findLocalMinimum(A);
  const v = A[i]!;
  assert.ok((i === 0 || v < A[i - 1]!) && (i === A.length - 1 || v < A[i + 1]!));
});
test('findLocalMinimum 单调', () => {
  assert.equal(findLocalMinimum([5, 4, 3, 2, 1]), 4);
  assert.equal(findLocalMinimum([1, 2, 3, 4, 5]), 0);
});
test('findLocalMinimum 边界', () => {
  assert.equal(findLocalMinimum([5]), 0);
  assert.equal(findLocalMinimum([2, 1]), 1);
});
test('findLocalMinimum 钩子', () => {
  let c = 0;
  findLocalMinimum([9, 6, 3, 14, 5, 7, 4], { onCompare: () => c++ } as LocalMinHooks);
  assert.ok(c >= 1);
});
""",
    ))

    return A
