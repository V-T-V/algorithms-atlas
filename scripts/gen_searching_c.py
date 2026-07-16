#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Searching algorithms batch C (16-30)."""
# noqa: E501


def add_batch_c(A, std_search_trace, std_search_test):
    # 16. Meta binary search (bit-by-bit, build offset from MSB)
    A.append(dict(
        id="search-meta-bit",
        zh="元二分查找（逐位构造）",
        en="Meta Binary Search (Bit-by-Bit)",
        szh="从最高位起逐位构造候选下标，比较后决定该位置 0 或 1。",
        sen="Build the candidate index bit by bit from the MSB, comparing to decide each bit.",
        dzh="元二分查找（Meta Binary Search / One-Sided Binary Search）从最高有效位起，逐位尝试把候选下标 p 的某位置 1，若 arr[p] <= target 则保留该位（继续累加），否则清零。最终 p 收敛到 <= target 的最大下标。若 arr[p]==target 即命中。所有比较只针对下标的二进制位，O(log n) 次。空间 O(1)。需先算最高位 lg(n)。",
        den="Meta binary search (one-sided) starts from the most significant bit and tries setting each bit of the candidate index p; if arr[p] <= target keep that bit (accumulate), else clear it. p converges to the largest index with arr[p] <= target. If arr[p]==target it is a hit. All comparisons target individual bits of the index, O(log n) of them. Space O(1). Requires computing the MSB position lg(n) first.",
        tags="['searching', 'meta-binary', 'bitwise', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 元二分查找（逐位构造）· 纯算法实现
export interface MetaBitHooks { onTry?: (p: number) => void; }

export function metaBitSearch(arr: readonly number[], target: number, hooks: MetaBitHooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  let lg = 0;
  while ((1 << lg) <= n) lg++;
  let p = 0;
  for (let i = lg; i >= 0; i--) {
    const next = p | (1 << i);
    if (next < n && arr[next]! <= target) { hooks.onTry?.(next); p = next; }
  }
  return arr[p]! === target ? p : -1;
}
""",
        trace=std_search_trace('search-meta-bit', 'metaBitSearch', 'MetaBitHooks',
                               "[1, 3, 5, 7, 9, 11, 13, 15]", 11, 'onTry', '尝试'),
        test=std_search_test('search-meta-bit', 'metaBitSearch', 'MetaBitHooks', 'onTry'),
    ))

    # 17. Find insertion position (like bisect_left)
    A.append(dict(
        id="search-insert-2",
        zh="查找插入位置",
        en="Search Insert Position",
        szh="找 target 应插入升序数组的位置（保持有序），等价 lower_bound。",
        sen="Find where to insert target to keep a sorted array ordered; equivalent to lower_bound.",
        dzh="查找插入位置：给定升序数组与 target，返回应插入的下标使插入后仍有序。若 target 已存在，插入到其首次出现前（左边界）。这等价于 lower_bound（第一个 >= target 的下标）。时间 O(log n)，空间 O(1)。LeetCode 35 经典题。",
        den="Search insert position: given a sorted array and target, return the index where target should be inserted to keep the array sorted. If target already exists, insert before its first occurrence (left boundary). Equivalent to lower_bound (first index with arr[i] >= target). Time O(log n), space O(1). LeetCode 35.",
        tags="['searching', 'binary-search', 'insert-position', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 查找插入位置 · 纯算法实现
export interface Insert2Hooks { onCompare?: (mid: number) => void; }

export function searchInsert2(arr: readonly number[], target: number, hooks: Insert2Hooks = {}): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
""",
        trace=std_search_trace('search-insert-2', 'searchInsert2', 'Insert2Hooks',
                               "[1, 3, 5, 6]", 5, 'onCompare', '比较'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchInsert2, type Insert2Hooks } from '../../src/algorithms/searching/search-insert-2/impl.ts';

test('searchInsert2 命中', () => {
  assert.equal(searchInsert2([1, 3, 5, 6], 5), 2);
  assert.equal(searchInsert2([1, 3, 5, 6], 1), 0);
  assert.equal(searchInsert2([1, 3, 5, 6], 6), 3);
});
test('searchInsert2 插入位置', () => {
  assert.equal(searchInsert2([1, 3, 5, 6], 2), 1);
  assert.equal(searchInsert2([1, 3, 5, 6], 7), 4);
  assert.equal(searchInsert2([1, 3, 5, 6], 0), 0);
});
test('searchInsert2 边界', () => {
  assert.equal(searchInsert2([], 1), 0);
  assert.equal(searchInsert2([5], 5), 0);
  assert.equal(searchInsert2([5], 6), 1);
});
test('searchInsert2 钩子', () => {
  let c = 0;
  searchInsert2([1, 3, 5, 6], 5, { onCompare: () => c++ } as Insert2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 18. Search range [first, last] of target
    A.append(dict(
        id="search-range-2",
        zh="查找区间",
        en="Search Range",
        szh="返回 target 在升序数组中首次与末次出现的下标区间 [-1,-1] 表示无。",
        sen="Return the [first, last] indices of target in a sorted array; [-1,-1] if absent.",
        dzh="查找区间：在含重复的升序数组中找 target 的首次与末次出现下标 [first, last]，不存在返回 [-1, -1]。用两次二分：一次找最左命中（命中后继续向左 hi=mid-1），一次找最右命中（命中后继续向右 lo=mid+1）。时间 O(log n)，空间 O(1)。LeetCode 34。",
        den="Search range: find the first and last index of target in a sorted array with duplicates, returning [first, last]; [-1,-1] if absent. Two binary searches: one for the leftmost hit (on a hit keep going left, hi=mid-1), one for the rightmost hit (on a hit keep going right, lo=mid+1). Time O(log n), space O(1). LeetCode 34.",
        tags="['searching', 'binary-search', 'range', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 查找区间 · 纯算法实现
export interface Range2Hooks { onFind?: (which: 'first' | 'last', idx: number) => void; }

export function searchRange2(arr: readonly number[], target: number, hooks: Range2Hooks = {}): [number, number] {
  const findFirst = (): number => {
    let lo = 0, hi = arr.length - 1, ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid]! === target) { ans = mid; hi = mid - 1; }
      else if (arr[mid]! < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  };
  const findLast = (): number => {
    let lo = 0, hi = arr.length - 1, ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid]! === target) { ans = mid; lo = mid + 1; }
      else if (arr[mid]! < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  };
  const first = findFirst();
  hooks.onFind?.('first', first);
  if (first === -1) return [-1, -1];
  const last = findLast();
  hooks.onFind?.('last', last);
  return [first, last];
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchRange2, type Range2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 7, 7, 8, 8, 10];
export const DEFAULT_TARGET = 8;

export function buildTrace(input: number[] = DEFAULT_INPUT, target: number = DEFAULT_TARGET): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `查找 ${target} 的首次与最后一次出现`, en: `Find first and last position of ${target}` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Range2Hooks = {
    onFind: (which, idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[idx] = 'final';
      rec
        .begin({ zh: `${which === 'first' ? '首次' : '最后一次'}: 下标 ${idx}`, en: `${which}: index ${idx}` })
        .setArray(input, roles, [{ index: idx, label: which === 'first' ? 'L' : 'R' }])
        .commit();
    },
  };
  const [first, last] = searchRange2(input, target, hooks);
  rec
    .begin(first >= 0 ? { zh: `范围 [${first}, ${last}]`, en: `Range [${first}, ${last}]` } : { zh: `未找到`, en: `Not found` })
    .setArray(input, undefined, first >= 0 ? [{ index: first, label: 'L' }, { index: last, label: 'R' }] : [])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchRange2, type Range2Hooks } from '../../src/algorithms/searching/search-range-2/impl.ts';

test('searchRange2 命中', () => {
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 8), [3, 4]);
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 7), [1, 2]);
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 5), [0, 0]);
});
test('searchRange2 未命中', () => {
  assert.deepEqual(searchRange2([5, 7, 7, 8, 8, 10], 6), [-1, -1]);
  assert.deepEqual(searchRange2([], 1), [-1, -1]);
});
test('searchRange2 全相同', () => {
  assert.deepEqual(searchRange2([8, 8, 8, 8], 8), [0, 3]);
});
test('searchRange2 钩子', () => {
  let c = 0;
  searchRange2([5, 7, 7, 8, 8, 10], 8, { onFind: () => c++ } as Range2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 19. Square root via binary search (integer floor)
    A.append(dict(
        id="search-sqrt-2",
        zh="整数平方根（二分）",
        en="Integer Square Root (Binary)",
        szh="二分查找最大的整数 r 使 r*r <= x。",
        sen="Binary search for the largest integer r with r*r <= x.",
        dzh="整数平方根：给定非负整数 x，找最大的整数 r 使 r^2 <= x。用二分在 [0, x]（或 [0, x/2+1]）中查找：mid^2 <= x 则候选 ans=mid 向右，否则向左。注意 mid*mid 可能溢出，用除法或 BigInt 比较。时间 O(log x)，空间 O(1)。",
        den="Integer square root: given a non-negative integer x, find the largest integer r with r^2 <= x. Binary search in [0, x] (or [0, x/2+1]): if mid^2 <= x take ans=mid and go right, else go left. Beware mid*mid overflow; compare via division or BigInt. Time O(log x), space O(1).",
        tags="['searching', 'binary-search', 'sqrt', 'math']",
        time="O(log x)", space="O(1)",
        impl="""// 整数平方根（二分）· 纯算法实现
export interface Sqrt2Hooks { onTry?: (mid: number) => void; }

export function sqrtSearch2(x: number, hooks: Sqrt2Hooks = {}): number {
  if (x < 2) return x;
  let lo = 1, hi = Math.floor(x / 2), ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onTry?.(mid);
    if (mid <= Math.floor(x / mid)) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqrtSearch2, type Sqrt2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 50;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `求 floor(sqrt(${input}))`, en: `Compute floor(sqrt(${input}))` })
    .setAux([{ label: 'x', value: String(input), role: 'pivot' as BarRole }])
    .commit();
  const hooks: Sqrt2Hooks = {
    onTry: (mid) => {
      rec
        .begin({ zh: `尝试 mid=${mid}, mid*mid=${mid * mid}`, en: `Try mid=${mid}, mid*mid=${mid * mid}` })
        .setAux([
          { label: 'mid', value: String(mid), role: 'compare' as BarRole },
          { label: 'mid*mid', value: String(mid * mid), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  const r = sqrtSearch2(input, hooks);
  rec
    .begin({ zh: `结果 floor(sqrt(${input}))=${r}`, en: `Result floor(sqrt(${input}))=${r}` })
    .setAux([{ label: 'sqrt', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sqrtSearch2, type Sqrt2Hooks } from '../../src/algorithms/searching/search-sqrt-2/impl.ts';

test('sqrtSearch2 基本', () => {
  assert.equal(sqrtSearch2(0), 0);
  assert.equal(sqrtSearch2(1), 1);
  assert.equal(sqrtSearch2(4), 2);
  assert.equal(sqrtSearch2(8), 2);
  assert.equal(sqrtSearch2(9), 3);
  assert.equal(sqrtSearch2(15), 3);
  assert.equal(sqrtSearch2(16), 4);
  assert.equal(sqrtSearch2(50), 7);
  assert.equal(sqrtSearch2(100), 10);
});
test('sqrtSearch2 钩子', () => {
  let c = 0;
  sqrtSearch2(50, { onTry: () => c++ } as Sqrt2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 20. Find peak element (binary search, any peak)
    A.append(dict(
        id="search-peak-2",
        zh="查找峰值（二分）",
        en="Find Peak Element (Binary)",
        szh="二分找任意一个峰值：比相邻元素大的元素，O(log n)。",
        sen="Binary search for any peak (greater than its neighbors) in O(log n).",
        dzh="峰值查找：数组中一个元素若大于其相邻元素即为峰值（边界元素只需大于唯一邻居）。用二分可找任意一个峰值：比较 mid 与 mid+1，若 arr[mid] < arr[mid+1] 则右侧必有峰值（向右 lo=mid+1），否则左侧（含 mid）必有峰值（hi=mid）。时间 O(log n)，空间 O(1)。LeetCode 162。",
        den="Peak finding: an element greater than its neighbors is a peak (boundary elements need only beat their single neighbor). Binary search finds any peak: compare mid with mid+1; if arr[mid] < arr[mid+1] a peak must exist on the right (lo=mid+1), else one exists on the left including mid (hi=mid). Time O(log n), space O(1). LeetCode 162.",
        tags="['searching', 'binary-search', 'peak', 'unsorted']",
        time="O(log n)", space="O(1)",
        impl="""// 查找峰值（二分）· 纯算法实现
export interface Peak2Hooks { onCompare?: (mid: number) => void; }

export function findPeak2(arr: readonly number[], hooks: Peak2Hooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < arr[mid + 1]!) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findPeak2, type Peak2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 1];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `在数组中找峰值`, en: `Find a peak in array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Peak2Hooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      if (mid + 1 < n) roles[mid + 1] = 'pivot';
      rec
        .begin({ zh: `比较 a[${mid}]=${input[mid]} 与 a[${mid + 1}]=${input[mid + 1]}`, en: `Compare a[${mid}]=${input[mid]} vs a[${mid + 1}]=${input[mid + 1]}` })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findPeak2(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  roles2[r] = 'final';
  rec
    .begin({ zh: `峰值下标 ${r}`, en: `Peak at ${r}` })
    .setArray(input, roles2, [{ index: r, label: 'V' }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPeak2, type Peak2Hooks } from '../../src/algorithms/searching/search-peak-2/impl.ts';

test('findPeak2 是峰值', () => {
  const A1 = [1, 2, 3, 1];
  const p1 = findPeak2(A1);
  assert.equal(A1[p1], 3);
  const A2 = [1, 2, 1, 3, 5, 6, 4];
  const p2 = findPeak2(A2);
  assert.ok((p2 > 0 ? A2[p2]! >= A2[p2 - 1]! : true) && (p2 < A2.length - 1 ? A2[p2]! >= A2[p2 + 1]! : true));
});
test('findPeak2 单调', () => {
  assert.equal(findPeak2([1, 2, 3, 4, 5]), 4);
  assert.equal(findPeak2([5, 4, 3, 2, 1]), 0);
});
test('findPeak2 边界', () => {
  assert.equal(findPeak2([1]), 0);
  assert.equal(findPeak2([1, 2]), 1);
});
test('findPeak2 钩子', () => {
  let c = 0;
  findPeak2([1, 2, 3, 1], { onCompare: () => c++ } as Peak2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 21. Search in rotated sorted array (no duplicates)
    A.append(dict(
        id="search-rotate-2",
        zh="旋转数组查找（无重复）",
        en="Search Rotated Array (No Duplicates)",
        szh="在旋转过的升序数组（无重复）中二分查找 target。",
        sen="Binary search for target in a rotated sorted array with no duplicates.",
        dzh="旋转数组查找：一个升序数组在某个枢轴处旋转（如 [0,1,2,3,4] → [3,4,0,1,2]），无重复元素。二分时判断 mid 落在左半有序段还是右半有序段，再判断 target 在有序段内决定收缩方向。时间 O(log n)，空间 O(1)。LeetCode 33。",
        den="Rotated-array search: an ascending array rotated at some pivot (e.g. [0,1,2,3,4] → [3,4,0,1,2]) with no duplicates. On each binary step determine whether mid lies in the left-ordered or right-ordered segment, then whether target is within the ordered segment to decide the shrink direction. Time O(log n), space O(1). LeetCode 33.",
        tags="['searching', 'binary-search', 'rotated', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 旋转数组查找（无重复）· 纯算法实现
export interface Rotate2Hooks { onCompare?: (mid: number) => void; }

export function searchRotated2(arr: readonly number[], target: number, hooks: Rotate2Hooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === target) return mid;
    if (arr[lo]! <= arr[mid]!) {
      if (arr[lo]! <= target && target < arr[mid]!) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (arr[mid]! < target && target <= arr[hi]!) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
""",
        trace=std_search_trace('search-rotate-2', 'searchRotated2', 'Rotate2Hooks',
                               "[4, 5, 6, 7, 0, 1, 2]", 0, 'onCompare', '比较'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchRotated2, type Rotate2Hooks } from '../../src/algorithms/searching/search-rotate-2/impl.ts';

test('searchRotated2 命中', () => {
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 0), 4);
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 3), -1);
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 4), 0);
  assert.equal(searchRotated2([4, 5, 6, 7, 0, 1, 2], 2), 6);
});
test('searchRotated2 未旋转', () => {
  assert.equal(searchRotated2([1, 2, 3, 4, 5], 3), 2);
  assert.equal(searchRotated2([1], 1), 0);
  assert.equal(searchRotated2([1], 0), -1);
});
test('searchRotated2 边界', () => {
  assert.equal(searchRotated2([], 1), -1);
  assert.equal(searchRotated2([3, 1], 1), 1);
});
test('searchRotated2 钩子', () => {
  let c = 0;
  searchRotated2([4, 5, 6, 7, 0, 1, 2], 0, { onCompare: () => c++ } as Rotate2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 22. Find minimum in rotated sorted array
    A.append(dict(
        id="search-min-rotate-2",
        zh="旋转数组最小值",
        en="Find Min in Rotated Array",
        szh="二分找旋转升序数组中的最小元素下标。",
        sen="Binary search for the minimum element's index in a rotated sorted array.",
        dzh="旋转数组最小值：升序数组旋转后（无重复），最小值是旋转点。二分：比较 arr[mid] 与 arr[hi]，若 arr[mid] < arr[hi] 则最小在左半（含 mid）hi=mid；否则在右半 lo=mid+1。收敛时 lo 即最小值下标。时间 O(log n)，空间 O(1)。LeetCode 153。",
        den="Minimum in rotated array: after rotating an ascending array (no duplicates), the minimum is the rotation pivot. Binary search: compare arr[mid] with arr[hi]; if arr[mid] < arr[hi] the min is in the left half (including mid), hi=mid; else right half lo=mid+1. When converged, lo is the min index. Time O(log n), space O(1). LeetCode 153.",
        tags="['searching', 'binary-search', 'rotated', 'minimum']",
        time="O(log n)", space="O(1)",
        impl="""// 旋转数组最小值 · 纯算法实现
export interface MinRotate2Hooks { onCompare?: (mid: number) => void; }

export function findMinRotated2(arr: readonly number[], hooks: MinRotate2Hooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < arr[hi]!) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinRotated2, type MinRotate2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 5, 6, 7, 0, 1, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `旋转排序数组找最小值`, en: `Find min in rotated sorted array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: MinRotate2Hooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      roles[n - 1] = 'pivot';
      rec
        .begin({ zh: `比较 a[${mid}]=${input[mid]} 与 a[${n - 1}]=${input[n - 1]}`, en: `Compare a[${mid}]=${input[mid]} vs a[${n - 1}]=${input[n - 1]}` })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findMinRotated2(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  roles2[r] = 'final';
  rec
    .begin({ zh: `最小值下标 ${r} = ${input[r]}`, en: `Min at ${r} = ${input[r]}` })
    .setArray(input, roles2, [{ index: r, label: 'V' }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinRotated2, type MinRotate2Hooks } from '../../src/algorithms/searching/search-min-rotate-2/impl.ts';

test('findMinRotated2 基本', () => {
  assert.equal(findMinRotated2([4, 5, 6, 7, 0, 1, 2]), 4);
  assert.equal(findMinRotated2([3, 4, 5, 1, 2]), 3);
  assert.equal(findMinRotated2([11, 13, 15, 17]), 0);
});
test('findMinRotated2 边界', () => {
  assert.equal(findMinRotated2([1]), 0);
  assert.equal(findMinRotated2([2, 1]), 1);
  assert.equal(findMinRotated2([1, 2]), 0);
});
test('findMinRotated2 钩子', () => {
  let c = 0;
  findMinRotated2([4, 5, 6, 7, 0, 1, 2], { onCompare: () => c++ } as MinRotate2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 23. Search in 2D sorted matrix (row + col sorted, staircase walk)
    A.append(dict(
        id="search-2d-staircase",
        zh="二维矩阵查找（阶梯法）",
        en="2D Matrix Search (Staircase)",
        szh="从右上角起，每次比较后向左或向下走，O(m+n)。",
        sen="Start at the top-right; on each comparison move left or down; O(m+n).",
        dzh="二维矩阵查找（阶梯法 / 走廊法）：矩阵每行从左到右升序、每列从上到下升序。从右上角 (r=0, c=n-1) 起，若 arr[r][c] == target 命中；arr[r][c] > target 则向左 c--（排除整列）；arr[r][c] < target 则向下 r++（排除整行）。每步排除一行或一列，共 O(m+n) 步。空间 O(1)。",
        den="2D matrix staircase search: each row is ascending left to right and each column top to bottom. Start at the top-right (r=0, c=n-1); if arr[r][c] == target hit; arr[r][c] > target move left c-- (eliminate a column); arr[r][c] < target move down r++ (eliminate a row). Each step removes a row or column, O(m+n) total. Space O(1).",
        tags="['searching', '2d-matrix', 'staircase', 'sorted']",
        time="O(m+n)", space="O(1)",
        impl="""// 二维矩阵查找（阶梯法）· 纯算法实现
export interface StaircaseHooks { onStep?: (r: number, c: number) => void; }

export function staircaseSearch2D(matrix: number[][], target: number, hooks: StaircaseHooks = {}): [number, number] {
  const m = matrix.length;
  if (m === 0) return [-1, -1];
  const n = matrix[0]!.length;
  let r = 0, c = n - 1;
  while (r < m && c >= 0) {
    hooks.onStep?.(r, c);
    const v = matrix[r]![c]!;
    if (v === target) return [r, c];
    if (v > target) c--;
    else r++;
  }
  return [-1, -1];
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { staircaseSearch2D, type StaircaseHooks } from './impl.ts';

export const DEFAULT_INPUT = [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]];
export const DEFAULT_TARGET = 5;

export function buildTrace(input: number[][] = DEFAULT_INPUT, target: number = DEFAULT_TARGET): Frame[] {
  const rec = new TraceRecorder();
  const grid = input.map((row) => row.map((v) => ({ v, role: 'default' as BarRole })));
  rec
    .begin({ zh: `在二维有序矩阵中查找 ${target}`, en: `Search ${target} in 2D sorted matrix` })
    .setGrid(grid)
    .commit();
  const hooks: StaircaseHooks = {
    onStep: (r, c) => {
      const g = input.map((row, ri) => row.map((v, ci) => ({ v, role: (ri === r && ci === c ? 'compare' : 'default') as BarRole })));
      rec
        .begin({ zh: `比较 [${r}][${c}] = ${input[r]![c]}`, en: `Compare [${r}][${c}] = ${input[r]![c]}` })
        .setGrid(g)
        .commit();
    },
  };
  const [rr, cc] = staircaseSearch2D(input, target, hooks);
  const g = input.map((row, ri) => row.map((v, ci) => ({ v, role: (ri === rr && ci === cc ? 'final' : 'default') as BarRole })));
  rec
    .begin(rr >= 0 ? { zh: `命中 [${rr}][${cc}]`, en: `Found [${rr}][${cc}]` } : { zh: `未找到`, en: `Not found` })
    .setGrid(g)
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { staircaseSearch2D, type StaircaseHooks } from '../../src/algorithms/searching/search-2d-staircase/impl.ts';

const M = [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]];
test('staircaseSearch2D 命中', () => {
  assert.deepEqual(staircaseSearch2D(M, 5), [1, 1]);
  assert.deepEqual(staircaseSearch2D(M, 11), [0, 3]);
  assert.deepEqual(staircaseSearch2D(M, 17), [3, 3]);
});
test('staircaseSearch2D 未命中', () => {
  assert.deepEqual(staircaseSearch2D(M, 100), [-1, -1]);
  assert.deepEqual(staircaseSearch2D(M, 15), [-1, -1]);
});
test('staircaseSearch2D 边界', () => {
  assert.deepEqual(staircaseSearch2D([], 1), [-1, -1]);
  assert.deepEqual(staircaseSearch2D([[5]], 5), [0, 0]);
});
test('staircaseSearch2D 钩子', () => {
  let c = 0;
  staircaseSearch2D(M, 5, { onStep: () => c++ } as StaircaseHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 24. Search in bitonic array (peak then find target both sides)
    A.append(dict(
        id="search-bitonic-2",
        zh="双峰数组查找",
        en="Search Bitonic Array",
        szh="先找双峰数组峰值，再在升序左半与降序右半各二分。",
        sen="Find the bitonic peak, then binary-search the ascending left and descending right halves.",
        dzh="双峰数组（Bitonic Array）：先升后降的数组（无重复）。查找 target：先用二分找峰值下标 peak（比较 arr[mid] 与 arr[mid+1] 决定向升段还是降段走），然后在升序左半 [0,peak] 做标准二分，未命中再在降序右半 [peak+1,n-1] 做降序二分。时间 O(log n)，空间 O(1)。",
        den="Bitonic array search: an array that rises then falls (no duplicates). Find target: first binary-search for the peak index (compare arr[mid] with arr[mid+1] to go up or down), then standard binary search on the ascending left [0,peak]; if missed, descending binary search on the right [peak+1,n-1]. Time O(log n), space O(1).",
        tags="['searching', 'binary-search', 'bitonic', 'peak']",
        time="O(log n)", space="O(1)",
        impl="""// 双峰数组查找 · 纯算法实现
export interface Bitonic2Hooks { onPeak?: (peak: number) => void; onBinary?: (lo: number, hi: number) => void; }

function bsearchAsc(arr: readonly number[], lo: number, hi: number, t: number): number {
  while (lo <= hi) { const m = (lo + hi) >>> 1; if (arr[m]! === t) return m; if (arr[m]! < t) lo = m + 1; else hi = m - 1; }
  return -1;
}
function bsearchDesc(arr: readonly number[], lo: number, hi: number, t: number): number {
  while (lo <= hi) { const m = (lo + hi) >>> 1; if (arr[m]! === t) return m; if (arr[m]! > t) lo = m + 1; else hi = m - 1; }
  return -1;
}

export function searchBitonic2(arr: readonly number[], target: number, hooks: Bitonic2Hooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  let lo = 0, hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid]! < arr[mid + 1]!) lo = mid + 1;
    else hi = mid;
  }
  const peak = lo;
  hooks.onPeak?.(peak);
  hooks.onBinary?.(0, peak);
  const left = bsearchAsc(arr, 0, peak, target);
  if (left !== -1) return left;
  hooks.onBinary?.(peak + 1, n - 1);
  return bsearchDesc(arr, peak + 1, n - 1, target);
}
""",
        trace=std_search_trace('search-bitonic-2', 'searchBitonic2', 'Bitonic2Hooks',
                               "[1, 3, 8, 12, 4, 2]", 4, 'onPeak', '峰值'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchBitonic2, type Bitonic2Hooks } from '../../src/algorithms/searching/search-bitonic-2/impl.ts';

test('searchBitonic2 命中', () => {
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 4), 4);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 12), 3);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 1), 0);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 2), 5);
});
test('searchBitonic2 未命中', () => {
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 100), -1);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 6), -1);
});
test('searchBitonic2 边界', () => {
  assert.equal(searchBitonic2([1], 1), 0);
  assert.equal(searchBitonic2([], 1), -1);
});
test('searchBitonic2 钩子', () => {
  let c = 0;
  searchBitonic2([1, 3, 8, 12, 4, 2], 4, { onPeak: () => c++, onBinary: () => {} } as Bitonic2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 25. Fast search (combine gallop + binary)
    A.append(dict(
        id="search-fast-2",
        zh="快速查找（混合）",
        en="Fast Search (Hybrid)",
        szh="结合跳步定位与二分：先大步粗定位再细二分。",
        sen="Combine stepping and binary search: coarse-locate with big steps, then refine with binary.",
        dzh="快速查找（Fast Search）是跳跃查找与二分查找的混合：先以较大步长（如 sqrt(n)）粗略定位 target 所在的大致区间，再在该区间内做二分查找。结合了跳跃的快速定位与二分的对数收敛，对中等规模数组实测稳定。时间 O(sqrt(n) + log(sqrt(n)))，仍属亚线性。空间 O(1)。",
        den="Fast search hybrids jump search and binary search: coarse-locate the target's approximate interval with a large step (e.g. sqrt(n)), then binary search within that interval. It combines jumping's fast location and binary's logarithmic convergence, stable in practice on medium arrays. Time O(sqrt(n) + log(sqrt(n))), still sublinear. Space O(1).",
        tags="['searching', 'hybrid', 'jump', 'binary', 'sorted']",
        time="O(sqrt n)", space="O(1)",
        impl="""// 快速查找（混合）· 纯算法实现
export interface Fast2Hooks { onJump?: (pos: number) => void; onBinary?: (mid: number) => void; }

export function fastSearch2(arr: readonly number[], target: number, hooks: Fast2Hooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0, pos = Math.min(step - 1, n - 1);
  while (pos < n && arr[pos]! < target) { hooks.onJump?.(pos); prev = pos + 1; pos += step; }
  let hi = Math.min(pos, n - 1);
  let lo = prev;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onBinary?.(mid);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
""",
        trace=std_search_trace('search-fast-2', 'fastSearch2', 'Fast2Hooks',
                               "[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]", 15, 'onJump', '跳跃'),
        test=std_search_test('search-fast-2', 'fastSearch2', 'Fast2Hooks', 'onJump'),
    ))

    return A
