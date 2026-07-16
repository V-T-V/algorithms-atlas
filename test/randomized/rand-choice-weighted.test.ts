import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedChoice } from '../../src/algorithms/randomized/rand-choice-weighted/impl.ts';
test('索引合法', () => {
  const i = weightedChoice([1, 2, 3, 4], 5);
  assert.ok(i >= 0 && i < 4);
});
test('权重为 0 永不选中', () => {
  for (let s = 1; s < 30; s++) assert.notEqual(weightedChoice([1, 0, 1], s), 1);
});
