import { test } from 'node:test';
import assert from 'node:assert/strict';
import { balancedSelect } from '../../src/algorithms/selection/sel-balanced-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-balanced-select/trace.ts';

test('balanced select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(balancedSelect(a, k, 5), k);
});
test('balanced select trace 非空', () => assert.ok(buildTrace().length > 0));
