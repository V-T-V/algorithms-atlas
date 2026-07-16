import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ackermannIter } from '../../src/algorithms/recursion/ackermann-iter/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/ackermann-iter/trace.ts';

test('ackermannIter 基线 A(0,n) = n+1', () => {
  assert.equal(ackermannIter(0, 0), 1);
  assert.equal(ackermannIter(0, 5), 6);
});

test('ackermannIter A(1,n) = n+2', () => {
  assert.equal(ackermannIter(1, 0), 2);
  assert.equal(ackermannIter(1, 3), 5);
});

test('ackermannIter A(2,n) = 2n+3', () => {
  assert.equal(ackermannIter(2, 0), 3);
  assert.equal(ackermannIter(2, 3), 9);
});

test('ackermannIter A(3,n) = 2^(n+3) − 3', () => {
  assert.equal(ackermannIter(3, 0), 5);
  assert.equal(ackermannIter(3, 3), 61);
  assert.equal(ackermannIter(3, 4), 125);
});

test('ackermannIter 与递归版一致', () => {
  function rec(m: number, n: number): number {
    if (m === 0) return n + 1;
    if (n === 0) return rec(m - 1, 1);
    return rec(m - 1, rec(m, n - 1));
  }
  for (let m = 0; m <= 2; m++) {
    for (let n = 0; n <= 4; n++) {
      assert.equal(ackermannIter(m, n), rec(m, n), `m=${m},n=${n}`);
    }
  }
});

test('ackermannIter 非法输入抛错', () => {
  assert.throws(() => ackermannIter(-1, 0));
  assert.throws(() => ackermannIter(0, -1));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
