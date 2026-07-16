import { test } from 'node:test';
import assert from 'node:assert/strict';
import { warehouseScheduling } from '../../src/algorithms/dp/dp-warehouse/impl.ts';

test('warehouse 基本例 [7,1,5,3,6,4]', () => {
  // 1 买 6 卖 = 5
  assert.equal(warehouseScheduling([7, 1, 5, 3, 6, 4]), 5);
});

test('warehouse 单调递减', () => {
  assert.equal(warehouseScheduling([7, 6, 4, 3, 1]), 0);
});

test('warehouse 单调递增', () => {
  assert.equal(warehouseScheduling([1, 2, 3, 4, 5]), 4);
});

test('warehouse 单元素', () => {
  assert.equal(warehouseScheduling([5]), 0);
});

test('warehouse 空', () => {
  assert.equal(warehouseScheduling([]), 0);
});

test('warehouse 钩子', () => {
  let days = 0;
  warehouseScheduling([1, 2, 3], { onDay: () => days++ });
  assert.equal(days, 3);
});
