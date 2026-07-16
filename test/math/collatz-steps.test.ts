import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collatzSteps, collatzMaxSteps } from '../../src/algorithms/math/collatz-steps/impl.ts';

test('collatz 已知步数', () => {
  assert.equal(collatzSteps(1).steps, 0);
  assert.equal(collatzSteps(2).steps, 1);
  assert.equal(collatzSteps(3).steps, 7); // 3→10→5→16→8→4→2→1
  assert.equal(collatzSteps(6).steps, 8);
  assert.equal(collatzSteps(27).steps, 111);
});

test('collatz 轨迹终止于 1', () => {
  for (const n of [1, 5, 7, 19, 97]) {
    const { trajectory } = collatzSteps(n);
    assert.equal(trajectory[0], n);
    assert.equal(trajectory[trajectory.length - 1], 1);
  }
});

test('collatz 步数唯一性（确定性）', () => {
  const a = collatzSteps(15).steps;
  const b = collatzSteps(15).steps;
  assert.equal(a, b);
});

test('collatz 非正整数返回 0', () => {
  assert.equal(collatzSteps(0).steps, 0);
  assert.equal(collatzSteps(-5).steps, 0);
});

test('collatz 记录保持者', () => {
  const { value, steps } = collatzMaxSteps(10);
  assert.ok(value >= 1 && value <= 10);
  assert.ok(steps > 0);
  // 1..10 中步数最多的是 9（19 步）
  assert.equal(value, 9);
});

test('collatz 钩子', () => {
  let s = 0;
  collatzSteps(5, { onStep: () => s++ });
  assert.ok(s > 0);
});
