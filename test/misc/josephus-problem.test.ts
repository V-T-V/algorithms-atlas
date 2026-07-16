import { test } from 'node:test';
import assert from 'node:assert/strict';
import { josephus, josephusSequence } from '../../src/algorithms/misc/josephus-problem/impl.ts';

test('josephus-problem (5, 2) 幸存者 = 2', () => {
  assert.equal(josephus(5, 2), 2);
});

test('josephus-problem (7, 3) 幸存者 = 3', () => {
  assert.equal(josephus(7, 3), 3);
});

test('josephus-problem n=1 时幸存者 = 0', () => {
  assert.equal(josephus(1, 5), 0);
});

test('josephus-problem (5, 2) 出列顺序', () => {
  // 模拟：[1,3,0,4,2]
  assert.deepEqual(josephusSequence(5, 2), [1, 3, 0, 4, 2]);
});

test('josephus-problem (7, 3) 出列顺序', () => {
  // 模拟：[2,5,1,6,4,0,3]
  assert.deepEqual(josephusSequence(7, 3), [2, 5, 1, 6, 4, 0, 3]);
});

test('josephus-problem 出列顺序末位等于 josephus 递推结果', () => {
  for (const [n, k] of [
    [5, 2],
    [7, 3],
    [10, 4],
    [41, 2],
  ] as const) {
    const seq = josephusSequence(n, k);
    assert.equal(seq[seq.length - 1], josephus(n, k), `n=${n},k=${k}`);
  }
});

test('josephus-problem k=1 时幸存者 = n-1', () => {
  for (const n of [1, 5, 10]) {
    assert.equal(josephus(n, 1), n - 1);
  }
});

test('josephus-problem 钩子被调用', () => {
  const eliminated: number[] = [];
  josephusSequence(5, 2, {
    onEliminate: (idx) => eliminated.push(idx),
  });
  assert.deepEqual(eliminated, [1, 3, 0, 4, 2]);
});

test('josephus-problem 非法参数抛错', () => {
  assert.throws(() => josephus(0, 3));
  assert.throws(() => josephus(5, 0));
  assert.throws(() => josephusSequence(0, 1));
});
