import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  quickselectRandomized,
  LCG,
} from '../../src/algorithms/selection/quickselect-randomized/impl.ts';

test('quickselectRandomized 基本选择', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(quickselectRandomized(arr, 0, 1), 1);
  assert.equal(quickselectRandomized(arr, 4, 1), 5);
  assert.equal(quickselectRandomized(arr, 8, 1), 9);
});

test('quickselectRandomized 与排序一致（多种种子）', () => {
  const arr = [7, 3, 9, 1, 5, 8, 2, 6, 4, 0];
  const sorted = [...arr].sort((a, b) => a - b);
  for (const seed of [1, 2, 7, 42, 99]) {
    for (let kk = 0; kk < arr.length; kk++) {
      assert.equal(quickselectRandomized(arr, kk, seed), sorted[kk], `seed=${seed} k=${kk}`);
    }
  }
});

test('quickselectRandomized 可复现（同种子同结果）', () => {
  const arr = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const r1 = quickselectRandomized(arr, 3, 123);
  const r2 = quickselectRandomized(arr, 3, 123);
  assert.equal(r1, r2);
});

test('LCG 在范围内', () => {
  const rng = new LCG(7);
  for (let i = 0; i < 100; i++) {
    const v = rng.nextInt(10);
    assert.ok(v >= 0 && v < 10);
  }
});

test('quickselectRandomized 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselectRandomized(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('quickselectRandomized 越界抛错', () => {
  assert.throws(() => quickselectRandomized([1], -1));
  assert.throws(() => quickselectRandomized([1], 1));
});
