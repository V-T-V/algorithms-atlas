import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bakerySimulate, less } from '../../src/algorithms/concurrency/conc-bakery-n/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-bakery-n/trace.ts';

test('conc-bakery-n 互斥：临界区至多一人', () => {
  const steps = bakerySimulate(4, [0, 2, 1, 3]);
  for (const s of steps) {
    assert.ok(s.inCs.length <= 1, '至多一个线程在临界区');
  }
});

test('conc-bakery-n 取号单调', () => {
  const steps = bakerySimulate(3, [0, 1, 2]);
  const first = steps[1]!; // T0 taken
  assert.equal(first.numbers[0], 1);
  const second = steps[3]!; // T1 taken
  assert.equal(second.numbers[1], 2);
});

test('conc-bakery-n less 元组比较', () => {
  assert.equal(less([1, 0], [2, 0]), true);
  assert.equal(less([1, 1], [1, 0]), false);
  assert.equal(less([1, 0], [1, 0]), false);
});

test('conc-bakery-n trace', () => {
  assert.ok(buildTrace().length > 2);
});
