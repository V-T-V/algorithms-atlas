#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Searching algorithms batches B (appends to list A)."""
# noqa: E501


def add_batch_b(A, std_search_trace, std_search_test):
    # 7. Ternary search (two midpoints in sorted array)
    A.append(dict(
        id="search-ternary-2",
        zh="三分查找",
        en="Ternary Search",
        szh="每次取两个中点把区间三等分，比较两次再缩到三分之一段。",
        sen="Pick two midpoints to trisect the range; two comparisons then shrink to one third.",
        dzh="三分查找（Ternary Search）是二分的变体：每次取 mid1 = lo + (hi-lo)/3 与 mid2 = hi - (hi-lo)/3 两个中点，比较 target 与 arr[mid1]、arr[mid2]，把搜索区间缩到三个子段之一。每轮比较 2 次但区间缩到 1/3。时间复杂度 O(log_3 n)，渐近仍为 O(log n)，常数通常不如二分优，但概念清晰。要求数组已排序。",
        den="Ternary search is a binary variant: each step pick two midpoints mid1 = lo + (hi-lo)/3 and mid2 = hi - (hi-lo)/3, compare target with arr[mid1] and arr[mid2], then narrow into one of three sub-segments. Two comparisons per round shrink the range to 1/3. Time O(log_3 n), still O(log n) asymptotically; the constant is usually worse than binary but the idea is clear. Requires a sorted array.",
        tags="['searching', 'ternary', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 三分查找 · 纯算法实现
export interface Ternary2Hooks { onCompare?: (mid: number) => void; }

export function ternarySearch2(arr: readonly number[], target: number, hooks: Ternary2Hooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid1 = lo + Math.floor((hi - lo) / 3);
    const mid2 = hi - Math.floor((hi - lo) / 3);
    hooks.onCompare?.(mid1);
    hooks.onCompare?.(mid2);
    if (arr[mid1]! === target) return mid1;
    if (arr[mid2]! === target) return mid2;
    if (target < arr[mid1]!) hi = mid1 - 1;
    else if (target > arr[mid2]!) lo = mid2 + 1;
    else { lo = mid1 + 1; hi = mid2 - 1; }
  }
  return -1;
}
""",
        trace=std_search_trace('search-ternary-2', 'ternarySearch2', 'Ternary2Hooks',
                               "[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]", 15, 'onCompare', '比较'),
        test=std_search_test('search-ternary-2', 'ternarySearch2', 'Ternary2Hooks'),
    ))

    # 8. Jump search with variable step (golden-ratio step)
    A.append(dict(
        id="search-jump-golden",
        zh="跳跃查找（黄金步长）",
        en="Jump Search (Golden Step)",
        szh="用黄金比例 0.618 作为步长因子的跳跃查找。",
        sen="Jump search using the golden ratio 0.618 as the step factor.",
        dzh="跳跃查找（Jump Search）经典版用步长 floor(sqrt(n))。本变体用黄金比例：步长 = floor(n * 0.618)，跳跃探测块右端，定位候选块后线性扫描。黄金步长使块划分更不均匀但概念新颖。时间 O(n/k + k) 仍为 O(sqrt(n)) 量级，空间 O(1)。要求数组已排序。",
        den="Jump search classically uses step floor(sqrt(n)). This variant uses the golden ratio: step = floor(n * 0.618), jumping to probe the block's right end, then linear-scanning the candidate block. The golden step gives a less even block split but is conceptually novel. Time O(n/k + k), still O(sqrt(n)); space O(1). Requires a sorted array.",
        tags="['searching', 'jump', 'sorted', 'golden-ratio']",
        time="O(sqrt n)", space="O(1)",
        impl="""// 跳跃查找（黄金步长）· 纯算法实现
export interface JumpGoldenHooks { onJump?: (pos: number) => void; onLinear?: (i: number) => void; }

export function jumpSearchGolden(arr: readonly number[], target: number, hooks: JumpGoldenHooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  const step = Math.max(1, Math.floor(n * 0.618));
  let prev = 0, pos = Math.min(step - 1, n - 1);
  while (pos < n && arr[pos]! < target) {
    hooks.onJump?.(pos);
    prev = pos + 1;
    pos += step;
  }
  pos = Math.min(pos, n - 1);
  for (let i = prev; i <= pos; i++) {
    hooks.onLinear?.(i);
    if (arr[i]! === target) return i;
    if (arr[i]! > target) return -1;
  }
  return -1;
}
""",
        trace=std_search_trace('search-jump-golden', 'jumpSearchGolden', 'JumpGoldenHooks',
                               "[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]", 15, 'onJump', '跳跃'),
        test=std_search_test('search-jump-golden', 'jumpSearchGolden', 'JumpGoldenHooks', 'onJump'),
    ))

    # 9. Galloping search (exponential + linear in block)
    A.append(dict(
        id="search-gallop-3",
        zh="飞奔查找",
        en="Galloping Search",
        szh="指数扩大下标定位块，块内线性回扫；适合目标靠前的有序数据。",
        sen="Exponentially grow the index to bound a block, then linear-scan back; good when the target is near the front.",
        dzh="飞奔查找（Galloping Search）与指数查找类似：以 1,2,4,8... 指数扩大下标 i 直到 arr[i] >= target 或越界，得到候选块 [i/2, i]；然后在块内从右向左线性扫描找 target。对目标靠前的有序数据非常高效（O(log k)），目标靠后则退化。本实现块内线性扫描。空间 O(1)。",
        den="Galloping search resembles exponential search: grow the index i by 1,2,4,8... until arr[i] >= target or out of bounds, giving candidate block [i/2, i]; then linear-scan the block (right to left) for the target. Very efficient (O(log k)) when the target is near the front of sorted data; degenerates when the target is near the back. This implementation linear-scans the block. Space O(1).",
        tags="['searching', 'gallop', 'exponential', 'sorted', 'unbounded']",
        time="O(log k)", space="O(1)",
        impl="""// 飞奔查找 · 纯算法实现
export interface Gallop3Hooks { onGallop?: (i: number) => void; onLinear?: (i: number) => void; }

export function gallopSearch3(arr: readonly number[], target: number, hooks: Gallop3Hooks = {}): number {
  const n = arr.length;
  if (n === 0 || target < arr[0]!) return -1;
  let i = 1;
  while (i < n && arr[i]! <= target) { hooks.onGallop?.(i); i *= 2; }
  const lo = Math.floor(i / 2);
  const hi = Math.min(i, n - 1);
  for (let k = hi; k >= lo; k--) {
    hooks.onLinear?.(k);
    if (arr[k]! === target) return k;
    if (arr[k]! < target) return -1;
  }
  return -1;
}
""",
        trace=std_search_trace('search-gallop-3', 'gallopSearch3', 'Gallop3Hooks',
                               "[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]", 7, 'onGallop', '飞奔'),
        test=std_search_test('search-gallop-3', 'gallopSearch3', 'Gallop3Hooks', 'onGallop'),
    ))

    # 10. Sentinel linear search (put target at end as sentinel)
    A.append(dict(
        id="search-linear-sentinel-2",
        zh="线性查找（哨兵）",
        en="Linear Search (Sentinel)",
        szh="把目标值放到数组末尾做哨兵，省去每次循环的越界判断。",
        sen="Place the target at the array end as a sentinel, removing the bound check inside the loop.",
        dzh="哨兵线性查找（Sentinel Linear Search）优化朴素线性查找：把 target 临时放到数组末尾位置作哨兵，于是主循环只需比较 a[i] === target，无需同时检查 i < n（因为哨兵保证必然命中）。命中后再判断 i 是否 < n（真实命中）还是等于哨兵位置（未找到）。比较次数不变 O(n)，但每次循环少一次比较，常数更小。无序数组也可用。",
        den="Sentinel linear search optimizes naive linear search: temporarily place target at the array end as a sentinel so the main loop only needs to compare a[i] === target, without also checking i < n (the sentinel guarantees a hit). After the hit, check whether i < n (real hit) or i equals the sentinel position (not found). Comparison count is still O(n) but each loop iteration does one fewer comparison, a smaller constant. Works on unsorted arrays too.",
        tags="['searching', 'linear', 'sentinel', 'unsorted']",
        time="O(n)", space="O(1)",
        impl="""// 线性查找（哨兵）· 纯算法实现
export interface LinearSentinel2Hooks { onCompare?: (i: number) => void; }

export function sentinelLinearSearch2(arr: readonly number[], target: number, hooks: LinearSentinel2Hooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  const a = [...arr];
  const last = a[n - 1]!;
  a[n - 1] = target;
  let i = 0;
  while (a[i]! !== target) { hooks.onCompare?.(i); i++; }
  a[n - 1] = last;
  if (i < n - 1) return i;
  return last === target ? n - 1 : -1;
}
""",
        trace=std_search_trace('search-linear-sentinel-2', 'sentinelLinearSearch2', 'LinearSentinel2Hooks',
                               "[9, 3, 7, 1, 5, 11, 13, 2, 8, 4]", 8, 'onCompare', '比较'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sentinelLinearSearch2, type LinearSentinel2Hooks } from '../../src/algorithms/searching/search-linear-sentinel-2/impl.ts';

const A = [9, 3, 7, 1, 5, 11, 13, 2, 8, 4];
test('sentinelLinearSearch2 命中', () => {
  assert.equal(sentinelLinearSearch2(A, 8), 8);
  assert.equal(sentinelLinearSearch2(A, 9), 0);
  assert.equal(sentinelLinearSearch2(A, 4), 9);
});
test('sentinelLinearSearch2 未命中', () => {
  assert.equal(sentinelLinearSearch2(A, 100), -1);
  assert.equal(sentinelLinearSearch2([], 1), -1);
});
test('sentinelLinearSearch2 不修改原数组', () => {
  const input = [3, 1, 2];
  sentinelLinearSearch2(input, 2);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sentinelLinearSearch2 钩子', () => {
  let c = 0;
  sentinelLinearSearch2([3, 1, 2], 2, { onCompare: () => c++ } as LinearSentinel2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 11. Binary search on reverse-sorted (descending) array
    A.append(dict(
        id="search-binary-desc",
        zh="二分查找（降序数组）",
        en="Binary Search (Descending Array)",
        szh="在降序排列的数组上做二分查找，比较方向与升序相反。",
        sen="Binary search on a descending-sorted array, with reversed comparison directions.",
        dzh="二分查找通常假设升序。本变体处理降序数组：仍取中点 mid，但当 arr[mid] < target 时向左半区收缩（hi = mid - 1），arr[mid] > target 时向右半区（lo = mid + 1），与升序版恰好相反。时间 O(log n)，空间 O(1)。适用于按降序存储的数据。",
        den="Binary search usually assumes ascending order. This variant handles descending arrays: still take the midpoint, but when arr[mid] < target shrink into the left half (hi = mid - 1) and when arr[mid] > target shrink into the right half (lo = mid + 1), the reverse of the ascending version. Time O(log n), space O(1). For data stored in descending order.",
        tags="['searching', 'binary-search', 'descending', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 二分查找（降序数组）· 纯算法实现
export interface BinDescHooks { onCompare?: (mid: number) => void; }

export function binarySearchDesc(arr: readonly number[], target: number, hooks: BinDescHooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! > target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
""",
        trace=std_search_trace('search-binary-desc', 'binarySearchDesc', 'BinDescHooks',
                               "[21, 19, 17, 15, 13, 11, 9, 7, 5, 3, 1]", 9, 'onCompare', '比较'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearchDesc, type BinDescHooks } from '../../src/algorithms/searching/search-binary-desc/impl.ts';

const A = [21, 19, 17, 15, 13, 11, 9, 7, 5, 3, 1];
test('binarySearchDesc 命中', () => {
  assert.equal(binarySearchDesc(A, 21), 0);
  assert.equal(binarySearchDesc(A, 1), 10);
  assert.equal(binarySearchDesc(A, 9), 6);
});
test('binarySearchDesc 未命中', () => {
  assert.equal(binarySearchDesc(A, 22), -1);
  assert.equal(binarySearchDesc(A, 0), -1);
  assert.equal(binarySearchDesc(A, 8), -1);
});
test('binarySearchDesc 边界', () => {
  assert.equal(binarySearchDesc([], 1), -1);
  assert.equal(binarySearchDesc([5], 5), 0);
  assert.equal(binarySearchDesc([5], 3), -1);
});
test('binarySearchDesc 钩子', () => {
  let c = 0;
  binarySearchDesc(A, 9, { onCompare: () => c++ } as BinDescHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 12. Find floor (largest element <= target) in sorted array
    A.append(dict(
        id="search-floor",
        zh="查找地板值",
        en="Find Floor",
        szh="在升序数组中找最大的 <= target 的元素下标，不存在返回 -1。",
        sen="Find the largest index with arr[i] <= target in a sorted array; -1 if none.",
        dzh="地板查找（Floor）：在升序数组中找最大的满足 arr[i] <= target 的下标 i。若所有元素都 > target 返回 -1。用二分：lo=0, hi=n-1, ans=-1，mid 命中 <= target 则 ans=mid 并向右 lo=mid+1，否则向左。时间 O(log n)，空间 O(1)。常用于离散化、找前驱。",
        den="Floor search: find the largest index i with arr[i] <= target in a sorted array. If all elements are > target return -1. Use binary search: lo=0, hi=n-1, ans=-1; if arr[mid] <= target set ans=mid and go right (lo=mid+1), else go left. Time O(log n), space O(1). Useful for discretization and finding predecessors.",
        tags="['searching', 'binary-search', 'floor', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 查找地板值 · 纯算法实现
export interface FloorHooks { onCompare?: (mid: number) => void; }

export function findFloor(arr: readonly number[], target: number, hooks: FloorHooks = {}): number {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! <= target) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}
""",
        trace=std_search_trace('search-floor', 'findFloor', 'FloorHooks',
                               "[1, 3, 5, 7, 9, 11, 13]", 6, 'onCompare', '比较'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findFloor, type FloorHooks } from '../../src/algorithms/searching/search-floor/impl.ts';

const A = [1, 3, 5, 7, 9, 11, 13];
test('findFloor 命中', () => {
  assert.equal(findFloor(A, 1), 0);
  assert.equal(findFloor(A, 13), 6);
  assert.equal(findFloor(A, 7), 3);
});
test('findFloor 地板', () => {
  assert.equal(findFloor(A, 6), 2);
  assert.equal(findFloor(A, 0), -1);
  assert.equal(findFloor(A, 100), 6);
});
test('findFloor 边界', () => {
  assert.equal(findFloor([], 1), -1);
  assert.equal(findFloor([5], 5), 0);
  assert.equal(findFloor([5], 3), -1);
});
test('findFloor 钩子', () => {
  let c = 0;
  findFloor(A, 6, { onCompare: () => c++ } as FloorHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 13. Find ceiling (smallest element >= target)
    A.append(dict(
        id="search-ceiling",
        zh="查找天花板值",
        en="Find Ceiling",
        szh="在升序数组中找最小的 >= target 的元素下标，不存在返回 -1。",
        sen="Find the smallest index with arr[i] >= target in a sorted array; -1 if none.",
        dzh="天花板查找（Ceiling）：在升序数组中找最小的满足 arr[i] >= target 的下标 i。若所有元素都 < target 返回 -1。等价于 lower_bound，但未找到时返回 -1 而非 n。二分实现：ans=-1，mid 命中 >= target 则 ans=mid 向左 hi=mid-1，否则向右。时间 O(log n)，空间 O(1)。",
        den="Ceiling search: find the smallest index i with arr[i] >= target in a sorted array. If all elements are < target return -1. Equivalent to lower_bound but returns -1 instead of n when not found. Binary implementation: ans=-1; if arr[mid] >= target set ans=mid and go left (hi=mid-1), else go right. Time O(log n), space O(1).",
        tags="['searching', 'binary-search', 'ceiling', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 查找天花板值 · 纯算法实现
export interface CeilingHooks { onCompare?: (mid: number) => void; }

export function findCeiling(arr: readonly number[], target: number, hooks: CeilingHooks = {}): number {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! >= target) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
  }
  return ans;
}
""",
        trace=std_search_trace('search-ceiling', 'findCeiling', 'CeilingHooks',
                               "[1, 3, 5, 7, 9, 11, 13]", 6, 'onCompare', '比较'),
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCeiling, type CeilingHooks } from '../../src/algorithms/searching/search-ceiling/impl.ts';

const A = [1, 3, 5, 7, 9, 11, 13];
test('findCeiling 命中', () => {
  assert.equal(findCeiling(A, 1), 0);
  assert.equal(findCeiling(A, 13), 6);
  assert.equal(findCeiling(A, 7), 3);
});
test('findCeiling 天花板', () => {
  assert.equal(findCeiling(A, 6), 3);
  assert.equal(findCeiling(A, 0), 0);
  assert.equal(findCeiling(A, 100), -1);
});
test('findCeiling 边界', () => {
  assert.equal(findCeiling([], 1), -1);
  assert.equal(findCeiling([5], 5), 0);
  assert.equal(findCeiling([5], 6), -1);
});
test('findCeiling 钩子', () => {
  let c = 0;
  findCeiling(A, 6, { onCompare: () => c++ } as CeilingHooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 14. Count occurrences via binary search (lower + upper)
    A.append(dict(
        id="search-count-occurrences-2",
        zh="统计出现次数",
        en="Count Occurrences",
        szh="用下界与上界二分查找统计有序数组中目标值的出现次数。",
        sen="Count occurrences of a target in a sorted array via lower-bound and upper-bound.",
        dzh="统计有序数组中目标值出现次数：直接线性扫描 O(n)；高效做法是用两次二分找 lower_bound（第一个 >= target）与 upper_bound（第一个 > target），次数 = upper - lower。若 lower == upper 说明不存在，次数为 0。时间 O(log n)，空间 O(1)。本实现即此法。",
        den="Count occurrences of a target in a sorted array: a linear scan is O(n); the efficient approach uses two binary searches for lower_bound (first >= target) and upper_bound (first > target); count = upper - lower. If lower == upper the target is absent (count 0). Time O(log n), space O(1). This is that approach.",
        tags="['searching', 'binary-search', 'count', 'sorted']",
        time="O(log n)", space="O(1)",
        impl="""// 统计出现次数 · 纯算法实现
export interface CountOcc2Hooks { onBound?: (which: 'lower' | 'upper', idx: number) => void; }

export function countOccurrences2(arr: readonly number[], target: number, hooks: CountOcc2Hooks = {}): number {
  const n = arr.length;
  let lo = 0, hi = n;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (arr[mid]! < target) lo = mid + 1; else hi = mid; }
  const lower = lo;
  hooks.onBound?.('lower', lower);
  lo = lower; hi = n;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (arr[mid]! <= target) lo = mid + 1; else hi = mid; }
  const upper = lo;
  hooks.onBound?.('upper', upper);
  return upper - lower;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countOccurrences2, type CountOcc2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 2, 3, 4, 5, 5, 5, 5, 6];
export const DEFAULT_TARGET = 5;

export function buildTrace(input: number[] = DEFAULT_INPUT, target: number = DEFAULT_TARGET): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `统计 ${target} 的出现次数`, en: `Count occurrences of ${target}` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: CountOcc2Hooks = {
    onBound: (which, idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[idx] = 'compare';
      rec
        .begin({ zh: `${which === 'lower' ? '下界' : '上界'}: 下标 ${idx}`, en: `${which}: index ${idx}` })
        .setArray(input, roles, [{ index: idx, label: which === 'lower' ? 'L' : 'U' }])
        .commit();
    },
  };
  const count = countOccurrences2(input, target, hooks);
  rec
    .begin({ zh: `出现次数 = ${count}`, en: `Count = ${count}` })
    .setAux([{ label: 'count', value: String(count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countOccurrences2, type CountOcc2Hooks } from '../../src/algorithms/searching/search-count-occurrences-2/impl.ts';

const A = [1, 2, 2, 2, 3, 4, 5, 5, 5, 5, 6];
test('countOccurrences2 统计', () => {
  assert.equal(countOccurrences2(A, 5), 4);
  assert.equal(countOccurrences2(A, 2), 3);
  assert.equal(countOccurrences2(A, 1), 1);
  assert.equal(countOccurrences2(A, 6), 1);
});
test('countOccurrences2 不存在', () => {
  assert.equal(countOccurrences2(A, 0), 0);
  assert.equal(countOccurrences2(A, 7), 0);
  assert.equal(countOccurrences2(A, 2.5), 0);
});
test('countOccurrences2 边界', () => {
  assert.equal(countOccurrences2([], 1), 0);
  assert.equal(countOccurrences2([5], 5), 1);
  assert.equal(countOccurrences2([5], 3), 0);
});
test('countOccurrences2 钩子', () => {
  let c = 0;
  countOccurrences2(A, 5, { onBound: () => c++ } as CountOcc2Hooks);
  assert.ok(c >= 1);
});
""",
    ))

    # 15. Search in nearly-sorted (k-sorted) array with windowed scan
    A.append(dict(
        id="search-nearly-sorted",
        zh="近似有序数组查找",
        en="Search Nearly-Sorted (k-sorted)",
        szh="在「每个元素偏离原位置不超过 k」的数组中用带偏移的二分查找。",
        sen="Binary search with offsets in an array where each element is at most k away from its sorted position.",
        dzh="近似有序（k-sorted）数组：每个元素距离它在完全有序数组中的位置不超过 k。标准二分不直接适用，因为 a[mid] 可能不是真实排序后的第 mid 小。本实现用一个简化的窗口线性扫描：对每个候选位置，检查 [max(0,i-k), min(n,i+k)] 窗口内是否有 target。时间 O(n*k) 最坏，但当 k 小时高效。适合插入排序后残留少量逆序的数据。",
        den="A nearly-sorted (k-sorted) array has each element at most k positions away from its sorted location. Standard binary search does not directly apply since a[mid] may not be the mid-th smallest. This implementation uses a simplified windowed linear scan: for each candidate position check the window [max(0,i-k), min(n,i+k)] for the target. Worst O(n*k) but efficient when k is small. Suits data with a few residual inversions after insertion sort.",
        tags="['searching', 'nearly-sorted', 'k-sorted', 'windowed']",
        time="O(n*k)", space="O(1)",
        impl="""// 近似有序数组查找 · 纯算法实现
export interface NearlySortedHooks { onCheck?: (i: number) => void; }

export function searchNearlySorted(arr: readonly number[], target: number, k: number = 2, hooks: NearlySortedHooks = {}): number {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    const lo = Math.max(0, i - k), hi = Math.min(n - 1, i + k);
    for (let j = lo; j <= hi; j++) {
      hooks.onCheck?.(j);
      if (arr[j]! === target) return j;
    }
  }
  return -1;
}
""",
        trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchNearlySorted, type NearlySortedHooks } from './impl.ts';

export const DEFAULT_INPUT = [6, 3, 7, 1, 5, 2, 8, 4];
export const DEFAULT_TARGET = 8;
export const DEFAULT_K = 2;

export function buildTrace(input: number[] = DEFAULT_INPUT, target: number = DEFAULT_TARGET, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `在近似有序数组（k=${k}）中查找 ${target}`, en: `Search ${target} in nearly-sorted (k=${k}) array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: NearlySortedHooks = {
    onCheck: (i) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'compare';
      rec
        .begin({ zh: `检查 a[${i}]=${input[i]}`, en: `Check a[${i}]=${input[i]}` })
        .setArray(input, roles, [{ index: i, label: 'i' }])
        .commit();
    },
  };
  const result = searchNearlySorted(input, target, k, hooks);
  const roles: BarRole[] = new Array(n).fill('default');
  if (result >= 0) roles[result] = 'final';
  rec
    .begin(result >= 0 ? { zh: `命中下标 ${result}`, en: `Found at ${result}` } : { zh: `未找到`, en: `Not found` })
    .setArray(input, roles, result >= 0 ? [{ index: result, label: 'V' }] : [])
    .commit();
  return rec.build();
}
""",
        test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchNearlySorted, type NearlySortedHooks } from '../../src/algorithms/searching/search-nearly-sorted/impl.ts';

const A = [6, 3, 7, 1, 5, 2, 8, 4];
test('searchNearlySorted 命中', () => {
  assert.equal(searchNearlySorted(A, 8), 6);
  assert.equal(searchNearlySorted(A, 6), 0);
  assert.equal(searchNearlySorted(A, 4), 7);
});
test('searchNearlySorted 未命中', () => {
  assert.equal(searchNearlySorted(A, 100), -1);
  assert.equal(searchNearlySorted([], 1), -1);
});
test('searchNearlySorted 钩子', () => {
  let c = 0;
  searchNearlySorted(A, 8, 2, { onCheck: () => c++ } as NearlySortedHooks);
  assert.ok(c >= 1);
});
""",
    ))

    return A
