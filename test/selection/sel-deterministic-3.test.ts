import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deterministicSelect } from '../../src/algorithms/selection/sel-deterministic-3/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-deterministic-3/trace.ts';

test('deterministic select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) {
    assert.equal(deterministicSelect(a, k), k);
  }
});
test('deterministic select 单元素', () => {
  assert.equal(deterministicSelect([42], 0), 42);
});
test('deterministic select trace 非空', () => assert.ok(buildTrace().length > 0));
