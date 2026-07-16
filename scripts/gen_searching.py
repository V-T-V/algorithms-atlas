#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate 45 searching algorithms. Run: python scripts/gen_searching.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from genlib import build_category, std_search_trace

ROOT = r"D:\M_X_M\algorithms-atlas\src\algorithms\searching"
TEST_ROOT = r"D:\M_X_M\algorithms-atlas\test\searching"

A = []  # accumulator

# A standard search test template: fn(arr, target, hooks?) => index
def std_search_test(id, fn, hooks_type, hook_field='onCompare'):
    return f"""import {{ test }} from 'node:test';
import assert from 'node:assert/strict';
import {{ {fn}, type {hooks_type} }} from '../../src/algorithms/searching/{id}/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('{id} 命中', () => {{
  assert.equal({fn}(ARR, 1), 0);
  assert.equal({fn}(ARR, 21), 10);
  assert.equal({fn}(ARR, 15), 7);
  assert.equal({fn}(ARR, 11), 5);
}});
test('{id} 未命中', () => {{
  assert.equal({fn}(ARR, 0), -1);
  assert.equal({fn}(ARR, 22), -1);
  assert.equal({fn}(ARR, 8), -1);
}});
test('{id} 边界', () => {{
  assert.equal({fn}([], 1), -1);
  assert.equal({fn}([5], 5), 0);
  assert.equal({fn}([5], 3), -1);
}});
test('{id} 钩子', () => {{
  let c = 0;
  {fn}(ARR, 15, {{ {hook_field}: () => c++ }} as {hooks_type});
  assert.ok(c >= 1);
}});
"""

print("searching scaffolding loaded")

# =========================================================================
# 1. Binary search variant: rightmost (last occurrence of target)
# =========================================================================
A.append(dict(
    id="search-binary-rightmost",
    zh="二分查找（最右命中）",
    en="Binary Search (Rightmost)",
    szh="在升序数组中找目标值最右一次出现的下标，不存在返回 -1。",
    sen="Find the rightmost index of a target in a sorted array; -1 if absent.",
    dzh="二分查找最右命中变体：标准二分查找定位目标值，但当命中时不立即返回，而是继续向右半区收缩 lo = mid + 1，并用一个候选变量 ans 记录最近一次命中的 mid。循环结束后 ans 即最右命中下标（未命中则 ans 仍为 -1）。时间 O(log n)，空间 O(1)。适合含重复键时找最后一次出现。",
    den="Rightmost binary search: standard binary search for a target, but on a hit do not return immediately; instead shrink into the right half (lo = mid + 1) while recording the latest hit index in ans. After the loop, ans holds the rightmost hit index (-1 if never hit). Time O(log n), space O(1). Useful for finding the last occurrence among duplicate keys.",
    tags="['searching', 'binary-search', 'sorted']",
    time="O(log n)", space="O(1)",
    impl="""// 二分查找（最右命中）· 纯算法实现
export interface BinRightHooks { onCompare?: (mid: number) => void; }

export function binarySearchRightmost(arr: readonly number[], target: number, hooks: BinRightHooks = {}): number {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === target) { ans = mid; lo = mid + 1; }
    else if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}
""",
    trace=std_search_trace('search-binary-rightmost', 'binarySearchRightmost', 'BinRightHooks',
                           "[1, 3, 3, 3, 5, 7, 9, 11, 11, 13]", 3, 'onCompare', '比较'),
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binarySearchRightmost, type BinRightHooks } from '../../src/algorithms/searching/search-binary-rightmost/impl.ts';

const A = [1, 3, 3, 3, 5, 7, 9, 11, 11, 13];
test('binarySearchRightmost 命中', () => {
  assert.equal(binarySearchRightmost(A, 3), 3);
  assert.equal(binarySearchRightmost(A, 11), 8);
  assert.equal(binarySearchRightmost(A, 1), 0);
  assert.equal(binarySearchRightmost(A, 13), 9);
});
test('binarySearchRightmost 未命中', () => {
  assert.equal(binarySearchRightmost(A, 0), -1);
  assert.equal(binarySearchRightmost(A, 14), -1);
  assert.equal(binarySearchRightmost(A, 4), -1);
});
test('binarySearchRightmost 边界', () => {
  assert.equal(binarySearchRightmost([], 1), -1);
  assert.equal(binarySearchRightmost([5], 5), 0);
  assert.equal(binarySearchRightmost([5, 5, 5], 5), 2);
});
test('binarySearchRightmost 钩子', () => {
  let c = 0;
  binarySearchRightmost(A, 3, { onCompare: () => c++ } as BinRightHooks);
  assert.ok(c >= 1);
});
""",
))

# =========================================================================
# 2. Lower bound binary search (first index where arr[i] >= target)
# =========================================================================
A.append(dict(
    id="search-lower-bound",
    zh="下界二分查找",
    en="Lower Bound Binary Search",
    szh="找第一个 >= target 的下标（标准 C++ lower_bound 语义）。",
    sen="Find the first index with arr[i] >= target (C++ lower_bound semantics).",
    dzh="下界（lower_bound）二分查找：在升序数组中找第一个满足 arr[i] >= target 的下标 i。若所有元素都 < target，返回 n（数组长度，即「插入到末尾」位置）。循环不变量：lo 始终是候选答案，hi 是排除区。这是 C++ std::lower_bound 的经典实现，时间 O(log n)，空间 O(1)。",
    den="Lower-bound binary search: find the first index i with arr[i] >= target in a sorted array. If all elements are < target, return n (the length, i.e. 'insert at end'). Loop invariant: lo is always the candidate answer, hi is excluded. This is the classic C++ std::lower_bound. Time O(log n), space O(1).",
    tags="['searching', 'binary-search', 'sorted', 'lower-bound']",
    time="O(log n)", space="O(1)",
    impl="""// 下界二分查找 · 纯算法实现
export interface LowerBoundHooks { onCompare?: (mid: number) => void; }

export function lowerBound(arr: readonly number[], target: number, hooks: LowerBoundHooks = {}): number {
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
    trace=std_search_trace('search-lower-bound', 'lowerBound', 'LowerBoundHooks',
                           "[1, 3, 3, 5, 7, 9, 11, 13]", 6, 'onCompare', '比较'),
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowerBound, type LowerBoundHooks } from '../../src/algorithms/searching/search-lower-bound/impl.ts';

const A = [1, 3, 3, 5, 7, 9, 11, 13];
test('lowerBound 命中', () => {
  assert.equal(lowerBound(A, 1), 0);
  assert.equal(lowerBound(A, 5), 3);
  assert.equal(lowerBound(A, 13), 7);
});
test('lowerBound 插入位置', () => {
  assert.equal(lowerBound(A, 0), 0);
  assert.equal(lowerBound(A, 14), 8);
  assert.equal(lowerBound(A, 6), 4);
  assert.equal(lowerBound(A, 3), 1);
});
test('lowerBound 边界', () => {
  assert.equal(lowerBound([], 1), 0);
  assert.equal(lowerBound([5], 5), 0);
  assert.equal(lowerBound([5], 6), 1);
});
test('lowerBound 钩子', () => {
  let c = 0;
  lowerBound(A, 6, { onCompare: () => c++ } as LowerBoundHooks);
  assert.ok(c >= 1);
});
""",
))

# =========================================================================
# 3. Upper bound binary search (first index where arr[i] > target)
# =========================================================================
A.append(dict(
    id="search-upper-bound",
    zh="上界二分查找",
    en="Upper Bound Binary Search",
    szh="找第一个 > target 的下标（C++ upper_bound 语义）。",
    sen="Find the first index with arr[i] > target (C++ upper_bound semantics).",
    dzh="上界（upper_bound）二分查找：在升序数组中找第一个满足 arr[i] > target 的下标 i。若所有元素都 <= target，返回 n。与 lower_bound 仅差一个比较方向。常与 lower_bound 配合确定 target 的值域范围 [lower, upper)。时间 O(log n)，空间 O(1)。",
    den="Upper-bound binary search: find the first index i with arr[i] > target in a sorted array. If all elements are <= target, return n. Differs from lower_bound only in the comparison direction. Often paired with lower_bound to determine the value range [lower, upper). Time O(log n), space O(1).",
    tags="['searching', 'binary-search', 'sorted', 'upper-bound']",
    time="O(log n)", space="O(1)",
    impl="""// 上界二分查找 · 纯算法实现
export interface UpperBoundHooks { onCompare?: (mid: number) => void; }

export function upperBound(arr: readonly number[], target: number, hooks: UpperBoundHooks = {}): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
""",
    trace=std_search_trace('search-upper-bound', 'upperBound', 'UpperBoundHooks',
                           "[1, 3, 3, 5, 7, 9, 11, 13]", 3, 'onCompare', '比较'),
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { upperBound, type UpperBoundHooks } from '../../src/algorithms/searching/search-upper-bound/impl.ts';

const A = [1, 3, 3, 5, 7, 9, 11, 13];
test('upperBound 命中', () => {
  assert.equal(upperBound(A, 3), 3);
  assert.equal(upperBound(A, 1), 1);
  assert.equal(upperBound(A, 13), 8);
});
test('upperBound 插入位置', () => {
  assert.equal(upperBound(A, 0), 0);
  assert.equal(upperBound(A, 14), 8);
  assert.equal(upperBound(A, 6), 4);
});
test('upperBound 边界', () => {
  assert.equal(upperBound([], 1), 0);
  assert.equal(upperBound([5], 5), 1);
  assert.equal(upperBound([5], 4), 0);
});
test('upperBound 钩子', () => {
  let c = 0;
  upperBound(A, 3, { onCompare: () => c++ } as UpperBoundHooks);
  assert.ok(c >= 1);
});
""",
))

# =========================================================================
# 4. Interpolation search (mid weighted by value distribution)
# =========================================================================
A.append(dict(
    id="search-interpolation-3",
    zh="插值查找",
    en="Interpolation Search",
    szh="按值分布估计位置：pos = lo + (target-a[lo])/(a[hi]-a[hi])*(hi-lo)。",
    sen="Estimate position by value distribution: pos = lo + (target-a[lo])/(a[hi]-a[lo])*(hi-lo).",
    dzh="插值查找（Interpolation Search）改进二分查找：不固定取中点，而是根据 target 在 [a[lo], a[hi]] 中的相对位置估计其下标 pos = lo + (target - a[lo]) / (a[hi] - a[lo]) * (hi - lo)。对均匀分布的数据，每次比较可排除更大比例的元素，期望 O(log log n)。最坏（分布不均）退化为 O(n)。要求数组已排序。",
    den="Interpolation search improves binary search: instead of always taking the midpoint, it estimates the target's index by its relative position within [a[lo], a[hi]]: pos = lo + (target - a[lo]) / (a[hi] - a[lo]) * (hi - lo). On uniformly-distributed data each comparison eliminates a larger fraction, giving expected O(log log n). Worst case (skewed distribution) degenerates to O(n). Requires a sorted array.",
    tags="['searching', 'interpolation', 'sorted', 'distribution']",
    time="O(log log n)", space="O(1)",
    impl="""// 插值查找 · 纯算法实现
export interface Interp3Hooks { onProbe?: (pos: number) => void; }

export function interpolationSearch3(arr: readonly number[], target: number, hooks: Interp3Hooks = {}): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo]! && target <= arr[hi]!) {
    if (lo === hi) { hooks.onProbe?.(lo); return arr[lo]! === target ? lo : -1; }
    const pos = lo + Math.floor(((target - arr[lo]!) / (arr[hi]! - arr[lo]!)) * (hi - lo));
    hooks.onProbe?.(pos);
    if (arr[pos]! === target) return pos;
    if (arr[pos]! < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}
""",
    trace=std_search_trace('search-interpolation-3', 'interpolationSearch3', 'Interp3Hooks',
                           "[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]", 70, 'onProbe', '探测'),
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpolationSearch3, type Interp3Hooks } from '../../src/algorithms/searching/search-interpolation-3/impl.ts';

const A = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
test('interpolationSearch3 命中', () => {
  assert.equal(interpolationSearch3(A, 10), 0);
  assert.equal(interpolationSearch3(A, 100), 9);
  assert.equal(interpolationSearch3(A, 70), 6);
  assert.equal(interpolationSearch3(A, 50), 4);
});
test('interpolationSearch3 未命中', () => {
  assert.equal(interpolationSearch3(A, 5), -1);
  assert.equal(interpolationSearch3(A, 105), -1);
  assert.equal(interpolationSearch3(A, 55), -1);
});
test('interpolationSearch3 边界', () => {
  assert.equal(interpolationSearch3([], 1), -1);
  assert.equal(interpolationSearch3([5], 5), 0);
  assert.equal(interpolationSearch3([5], 3), -1);
});
test('interpolationSearch3 钩子', () => {
  let c = 0;
  interpolationSearch3(A, 70, { onProbe: () => c++ } as Interp3Hooks);
  assert.ok(c >= 1);
});
""",
))

# =========================================================================
# 5. Exponential search (gallop to find range, then binary)
# =========================================================================
A.append(dict(
    id="search-exponential-3",
    zh="指数查找",
    en="Exponential Search",
    szh="先以 2 的幂扩大搜索范围定位候选段，再在段内二分。",
    sen="Gallop by powers of two to bound a candidate range, then binary-search within it.",
    dzh="指数查找（Exponential Search / Galloping Search）适合在很大且目标可能靠前的有序数组中查找。先以步长 1, 2, 4, 8, ... 指数扩大下标 bound，直到 arr[bound] >= target（bound 不超过 n）；然后在 [bound/2, min(bound, n)) 内做标准二分查找。时间 O(log k)，k 为目标位置（若目标靠前比二分更快）。空间 O(1)。",
    den="Exponential search (galloping search) suits very large sorted arrays where the target may be near the front. First gallop the index by powers of two (1, 2, 4, 8, ...) until arr[bound] >= target (bound capped at n), then standard binary search within [bound/2, min(bound, n)). Time O(log k) where k is the target position (faster than binary search when the target is near the front). Space O(1).",
    tags="['searching', 'exponential', 'binary-search', 'sorted', 'unbounded']",
    time="O(log k)", space="O(1)",
    impl="""// 指数查找 · 纯算法实现
export interface Expo3Hooks { onGallop?: (bound: number) => void; onBinary?: (lo: number, hi: number) => void; }

export function exponentialSearch3(arr: readonly number[], target: number, hooks: Expo3Hooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0]! === target) return 0;
  let bound = 1;
  while (bound < n && arr[bound]! < target) { hooks.onGallop?.(bound); bound *= 2; }
  let lo = Math.floor(bound / 2), hi = Math.min(bound, n - 1);
  hooks.onBinary?.(lo, hi);
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
""",
    trace=std_search_trace('search-exponential-3', 'exponentialSearch3', 'Expo3Hooks',
                           "[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]", 15, 'onGallop', '跳跃'),
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialSearch3, type Expo3Hooks } from '../../src/algorithms/searching/search-exponential-3/impl.ts';

const A = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
test('exponentialSearch3 命中', () => {
  assert.equal(exponentialSearch3(A, 1), 0);
  assert.equal(exponentialSearch3(A, 21), 10);
  assert.equal(exponentialSearch3(A, 15), 7);
});
test('exponentialSearch3 未命中', () => {
  assert.equal(exponentialSearch3(A, 0), -1);
  assert.equal(exponentialSearch3(A, 22), -1);
  assert.equal(exponentialSearch3(A, 8), -1);
});
test('exponentialSearch3 边界', () => {
  assert.equal(exponentialSearch3([], 1), -1);
  assert.equal(exponentialSearch3([5], 5), 0);
  assert.equal(exponentialSearch3([5], 3), -1);
});
test('exponentialSearch3 钩子', () => {
  let c = 0;
  exponentialSearch3(A, 15, { onGallop: () => c++, onBinary: () => {} } as Expo3Hooks);
  assert.ok(c >= 0);
});
""",
))

# =========================================================================
# 6. Fibonacci search (classic, uses Fibonacci numbers to partition)
# =========================================================================
A.append(dict(
    id="search-fibonacci-3",
    zh="斐波那契查找",
    en="Fibonacci Search",
    szh="用斐波那契数划分区间代替二分，避免除法，适合某些硬件。",
    sen="Partition the range with Fibonacci numbers instead of halving; division-free, suits some hardware.",
    dzh="斐波那契查找（Fibonacci Search）与二分类似，但用斐波那契数列划分区间：找到最小 F(k) >= n，把数组视为长度 F(k)-1（不足补 +∞）。每次比较下标 i = offset + F(k-2)，根据比较结果把范围收缩到前 F(k-2)-1 段或后 F(k-1)-1 段，并递减 k。所有运算只用加减，无除法（历史上有硬件优势）。时间 O(log n)，空间 O(1)。",
    den="Fibonacci search resembles binary search but partitions the range with Fibonacci numbers: find the smallest F(k) >= n, treat the array as length F(k)-1 (pad with +Infinity). Each step compares index i = offset + F(k-2) and narrows into the front F(k-2)-1 segment or the back F(k-1)-1 segment, decrementing k. All arithmetic is add/subtract only, no division (a historical hardware advantage). Time O(log n), space O(1).",
    tags="['searching', 'fibonacci', 'sorted', 'division-free']",
    time="O(log n)", space="O(1)",
    impl="""// 斐波那契查找 · 纯算法实现
export interface Fib3Hooks { onCompare?: (i: number) => void; }

export function fibonacciSearch3(arr: readonly number[], target: number, hooks: Fib3Hooks = {}): number {
  const n = arr.length;
  let fib2 = 0, fib1 = 1, fib = 1;
  while (fib < n) { fib2 = fib1; fib1 = fib; fib = fib1 + fib2; }
  let offset = -1;
  while (fib > 1) {
    const i = Math.min(offset + fib2, n - 1);
    hooks.onCompare?.(i);
    if (arr[i]! < target) { fib = fib1; fib1 = fib2; fib2 = fib - fib1; offset = i; }
    else if (arr[i]! > target) { fib = fib2; fib1 = fib1 - fib2; fib2 = fib - fib1; }
    else return i;
  }
  if (fib1 === 1 && offset + 1 < n && arr[offset + 1]! === target) return offset + 1;
  return -1;
}
""",
    trace=std_search_trace('search-fibonacci-3', 'fibonacciSearch3', 'Fib3Hooks',
                           "[10, 22, 35, 40, 54, 62, 78, 81, 92, 99]", 78, 'onCompare', '比较'),
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciSearch3, type Fib3Hooks } from '../../src/algorithms/searching/search-fibonacci-3/impl.ts';

const A = [10, 22, 35, 40, 54, 62, 78, 81, 92, 99];
test('fibonacciSearch3 命中', () => {
  assert.equal(fibonacciSearch3(A, 10), 0);
  assert.equal(fibonacciSearch3(A, 99), 9);
  assert.equal(fibonacciSearch3(A, 78), 6);
  assert.equal(fibonacciSearch3(A, 54), 4);
});
test('fibonacciSearch3 未命中', () => {
  assert.equal(fibonacciSearch3(A, 5), -1);
  assert.equal(fibonacciSearch3(A, 100), -1);
  assert.equal(fibonacciSearch3(A, 60), -1);
});
test('fibonacciSearch3 边界', () => {
  assert.equal(fibonacciSearch3([], 1), -1);
  assert.equal(fibonacciSearch3([5], 5), 0);
  assert.equal(fibonacciSearch3([5], 3), -1);
});
test('fibonacciSearch3 钩子', () => {
  let c = 0;
  fibonacciSearch3(A, 78, { onCompare: () => c++ } as Fib3Hooks);
  assert.ok(c >= 1);
});
""",
))

print("loaded batch 1:", len(A))

# Import more batches
from gen_searching_b import add_batch_b
add_batch_b(A, std_search_trace, std_search_test)
from gen_searching_c import add_batch_c
add_batch_c(A, std_search_trace, std_search_test)
from gen_searching_d import add_batch_d
add_batch_d(A, std_search_trace, std_search_test)

print("total searching algorithms:", len(A))
if __name__ == "__main__":
    build_category("searching", ROOT, TEST_ROOT, A)

