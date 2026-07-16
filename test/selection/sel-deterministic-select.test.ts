import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deterministicSelect } from '../../src/algorithms/selection/sel-deterministic-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-deterministic-select/trace.ts';

test('sel-deterministic-select 与排序一致', () => {
  const arr = [9, 3, 7, 1, 8, 2, 6, 5, 4, 0];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(deterministicSelect(arr, k), sorted[k], `k=${k}`);
  }
});

test('sel-deterministic-select 不改原数组', () => {
  const input = [3, 1, 2];
  deterministicSelect(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('sel-deterministic-select 越界抛错', () => {
  assert.throws(() => deterministicSelect([1], -1));
  assert.throws(() => deterministicSelect([1], 5));
});

test('sel-deterministic-select 单元素', () => {
  assert.equal(deterministicSelect([42], 0), 42);
});

test('sel-deterministic-select trace', () => {
  assert.ok(buildTrace().length > 2);
});
