import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectMed3 } from '../../src/algorithms/selection/sel-quickselect-pivot-med3/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quickselect-pivot-med3/trace.ts';

test('quickselect med3 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(quickselectMed3(a, k), k);
});
test('quickselect med3 trace 非空', () => assert.ok(buildTrace().length > 0));
