import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collatzConjecture } from '../../src/algorithms/misc/collatz-conjecture/impl.ts';

test('collatz-conjecture 起点为 1', () => {
  const r = collatzConjecture(1);
  assert.deepEqual(r.sequence, [1]);
  assert.equal(r.steps, 0);
});

test('collatz-conjecture 从 6 出发', () => {
  const r = collatzConjecture(6);
  assert.deepEqual(r.sequence, [6, 3, 10, 5, 16, 8, 4, 2, 1]);
  assert.equal(r.steps, 8);
  assert.equal(r.maxValue, 16);
});

test('collatz-conjecture 从 27 出发（序列长 112，峰值 9232）', () => {
  const r = collatzConjecture(27);
  // 序列含首尾共 112 个元素（111 次转换）
  assert.equal(r.sequence.length, 112);
  assert.equal(r.steps, 111);
  assert.equal(r.maxValue, 9232);
  assert.equal(r.sequence[r.sequence.length - 1], 1);
});

test('collatz-conjecture 终点恒为 1', () => {
  for (const start of [2, 7, 19, 97, 871]) {
    const r = collatzConjecture(start);
    assert.equal(r.sequence[r.sequence.length - 1], 1, `start=${start} 应终止于 1`);
  }
});

test('collatz-conjecture 非正整数返回空', () => {
  const r = collatzConjecture(0);
  assert.deepEqual(r.sequence, []);
});

test('collatz-conjecture 钩子被调用', () => {
  let steps = 0;
  let ended = false;
  collatzConjecture(6, undefined, {
    onStep: () => steps++,
    onEnd: () => {
      ended = true;
    },
  });
  // onStep 触发次数 = 序列长度（含初始帧）
  assert.equal(steps, 9);
  assert.equal(ended, true);
});
