import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fibonacciSearch,
  fibUntil,
} from '../../src/algorithms/searching/fibonacci-search-impl/impl.ts';

const ARR = [10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100];

test('fibonacciSearch 命中各位置', () => {
  for (let i = 0; i < ARR.length; i++) {
    assert.equal(fibonacciSearch(ARR, ARR[i]!), i, `应命中下标 ${i}`);
  }
});

test('fibonacciSearch 未命中返回 -1', () => {
  assert.equal(fibonacciSearch(ARR, 0), -1);
  assert.equal(fibonacciSearch(ARR, 101), -1);
  assert.equal(fibonacciSearch(ARR, 60), -1);
  assert.equal(fibonacciSearch([], 5), -1);
});

test('fibUntil 计算', () => {
  const r = fibUntil(11);
  assert.ok(r.fibs[r.fibs.length - 1]! >= 11);
  assert.deepEqual(fibUntil(1).fibs.slice(0, 3), [0, 1, 1]);
});

test('fibonacciSearch 边界', () => {
  assert.equal(fibonacciSearch([5], 5), 0);
  assert.equal(fibonacciSearch([5], 3), -1);
  assert.equal(fibonacciSearch([1, 2], 2), 1);
  assert.equal(fibonacciSearch([1, 2], 1), 0);
});

test('fibonacciSearch 钩子被调用', () => {
  let probes = 0;
  let done = 0;
  fibonacciSearch(ARR, 85, {
    onProbe: () => probes++,
    onDone: () => done++,
  });
  assert.ok(probes >= 1, '应至少探测一次');
  assert.equal(done, 1, '应恰好回调一次 onDone');
});
