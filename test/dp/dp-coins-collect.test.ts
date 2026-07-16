import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinsCollect } from '../../src/algorithms/dp/dp-coins-collect/impl.ts';

test('coins-collect 基本例', () => {
  assert.equal(
    coinsCollect([
      [1, 3, 1, 2],
      [2, 1, 4, 1],
      [5, 2, 1, 3],
    ]),
    14,
  );
});

test('coins-collect 单格', () => {
  assert.equal(coinsCollect([[7]]), 7);
});

test('coins-collect 单行', () => {
  assert.equal(coinsCollect([[1, 2, 3, 4]]), 10);
});

test('coins-collect 单列', () => {
  assert.equal(coinsCollect([[1], [2], [3]]), 6);
});

test('coins-collect 空网格', () => {
  assert.equal(coinsCollect([]), 0);
  assert.equal(coinsCollect([[]]), 0);
});
