import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  searchBitonic2,
  type Bitonic2Hooks,
} from '../../src/algorithms/searching/search-bitonic-2/impl.ts';

test('searchBitonic2 命中', () => {
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 4), 4);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 12), 3);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 1), 0);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 2), 5);
});
test('searchBitonic2 未命中', () => {
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 100), -1);
  assert.equal(searchBitonic2([1, 3, 8, 12, 4, 2], 6), -1);
});
test('searchBitonic2 边界', () => {
  assert.equal(searchBitonic2([1], 1), 0);
  assert.equal(searchBitonic2([], 1), -1);
});
test('searchBitonic2 钩子', () => {
  let c = 0;
  searchBitonic2([1, 3, 8, 12, 4, 2], 4, {
    onPeak: () => c++,
    onBinary: () => {},
  } as Bitonic2Hooks);
  assert.ok(c >= 1);
});
