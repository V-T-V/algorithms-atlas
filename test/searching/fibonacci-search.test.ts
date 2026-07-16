import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciSearch, fibsUpTo } from '../../src/algorithms/searching/fibonacci-search/impl.ts';

test('fibonacci-search 命中', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
  for (let i = 0; i < arr.length; i++) {
    assert.equal(fibonacciSearch(arr, arr[i]!), i, `查找 ${arr[i]}`);
  }
});

test('fibonacci-search 未找到', () => {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
  assert.equal(fibonacciSearch(arr, 0), -1); // 比所有都小
  assert.equal(fibonacciSearch(arr, 24), -1); // 比所有都大
  assert.equal(fibonacciSearch(arr, 6), -1); // 间隙
  assert.equal(fibonacciSearch(arr, 8), -1);
  assert.equal(fibonacciSearch(arr, 22), -1);
});

test('fibonacci-search 边界', () => {
  assert.equal(fibonacciSearch([], 1), -1);
  assert.equal(fibonacciSearch([5], 5), 0);
  assert.equal(fibonacciSearch([5], 1), -1);
  assert.equal(fibonacciSearch([5], 9), -1);
  assert.equal(fibonacciSearch([1, 2], 1), 0);
  assert.equal(fibonacciSearch([1, 2], 2), 1);
});

test('fibonacci-search 与 Array.indexOf 一致（随机）', () => {
  for (let trial = 0; trial < 30; trial++) {
    const len = 1 + Math.floor(Math.random() * 40);
    const arr: number[] = [];
    let cur = 0;
    for (let i = 0; i < len; i++) {
      cur += 1 + Math.floor(Math.random() * 4);
      arr.push(cur);
    }
    // 命中
    for (let i = 0; i < arr.length; i++) {
      assert.equal(fibonacciSearch(arr, arr[i]!), i);
    }
    // 部分未命中
    for (let q = 0; q < 10; q++) {
      const t = Math.floor(Math.random() * (cur + 5));
      const expected = arr.indexOf(t);
      assert.equal(fibonacciSearch(arr, t), expected, `arr len=${len}, target=${t}`);
    }
  }
});

test('fibonacci-search 各种长度（1..30）每个位置都能命中', () => {
  for (let len = 1; len <= 30; len++) {
    const arr = Array.from({ length: len }, (_, i) => 2 * i + 1);
    for (let i = 0; i < len; i++) {
      assert.equal(fibonacciSearch(arr, arr[i]!), i, `len=${len}, idx=${i}`);
    }
  }
});

test('fibsUpTo 工具', () => {
  assert.deepEqual(fibsUpTo(0), [0, 1]);
  assert.deepEqual(fibsUpTo(1), [0, 1]);
  // 0 1 1 2 3 5 8 13
  const f = fibsUpTo(10);
  assert.equal(f[f.length - 1]!, 13);
  assert.equal(f[0], 0);
  assert.equal(f[1], 1);
});

test('fibonacci-search 钩子被调用', () => {
  let probe = 0;
  let compare = 0;
  let done = 0;
  fibonacciSearch([1, 3, 5, 7, 9, 11, 13, 15, 17], 13, {
    onProbe: () => probe++,
    onCompare: () => compare++,
    onDone: () => done++,
  });
  assert.ok(probe >= 1, '应至少探测一次');
  assert.ok(compare >= 1, '应至少比较一次');
  assert.equal(done, 1);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/searching/fibonacci-search/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
  assert.ok(frames[frames.length - 1]!.note?.en);
});
