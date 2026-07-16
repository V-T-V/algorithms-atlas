import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gallopingSearch } from '../../src/algorithms/searching/exponential-search-2/impl.ts';

test('galloping 精确命中', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
  for (let i = 0; i < arr.length; i++) {
    const r = gallopingSearch(arr, arr[i]!);
    assert.equal(r.index, i, `查找 ${arr[i]}`);
    assert.equal(r.exact, true);
  }
});

test('galloping 下界（无精确匹配）', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
  // target=6 → 下界是 7 的位置 3，非精确
  const r1 = gallopingSearch(arr, 6);
  assert.equal(r1.index, 3);
  assert.equal(r1.exact, false);
  // target=0 → 下界 0
  const r2 = gallopingSearch(arr, 0);
  assert.equal(r2.index, 0);
  assert.equal(r2.exact, false);
  // target=24 → 比所有都大，下界 = n
  const r3 = gallopingSearch(arr, 24);
  assert.equal(r3.index, arr.length);
  assert.equal(r3.exact, false);
});

test('galloping 边界', () => {
  assert.deepEqual(gallopingSearch([], 5), { index: 0, exact: false });
  // 单元素
  assert.deepEqual(gallopingSearch([5], 5), { index: 0, exact: true });
  assert.deepEqual(gallopingSearch([5], 3), { index: 0, exact: false });
  assert.deepEqual(gallopingSearch([5], 9), { index: 1, exact: false });
});

test('galloping 与 Array.findIndex（lower_bound）一致（随机）', () => {
  // 用二分内置参考
  const refLowerBound = (arr: number[], t: number): number => {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid]! < t) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  for (let trial = 0; trial < 30; trial++) {
    const len = 1 + Math.floor(Math.random() * 50);
    const arr: number[] = [];
    let cur = 0;
    for (let i = 0; i < len; i++) {
      cur += 1 + Math.floor(Math.random() * 4);
      arr.push(cur);
    }
    for (let q = 0; q < 15; q++) {
      const t = Math.floor(Math.random() * (cur + 5));
      const r = gallopingSearch(arr, t);
      assert.equal(r.index, refLowerBound(arr, t), `arr len=${len}, t=${t}`);
      assert.equal(r.exact, r.index < arr.length && arr[r.index] === t);
    }
  }
});

test('galloping 含重复元素的下界', () => {
  // 重复元素：下界应指向第一个出现位置
  const arr = [1, 2, 2, 2, 3, 4, 4, 5];
  assert.equal(gallopingSearch(arr, 2).index, 1);
  assert.equal(gallopingSearch(arr, 4).index, 5);
  assert.equal(gallopingSearch(arr, 2).exact, true);
});

test('galloping 钩子被调用', () => {
  let gallop = 0;
  let probe = 0;
  let done = 0;
  gallopingSearch([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25], 17, {
    onGallops: () => gallop++,
    onProbe: () => probe++,
    onDone: () => done++,
  });
  assert.ok(gallop >= 1, '应至少 gallop 一次');
  assert.ok(probe >= 1, '应至少二分探测一次');
  assert.equal(done, 1);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } =
    await import('../../src/algorithms/searching/exponential-search-2/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
  assert.ok(frames[frames.length - 1]!.note?.en);
});
