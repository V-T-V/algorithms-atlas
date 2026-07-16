import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Fenwick2 } from '../../src/algorithms/ds/ds-fenwick-2/impl.ts';

test('fenwick 前缀和', () => {
  const bit = new Fenwick2(5, [1, 3, 5, 7, 9]);
  assert.equal(bit.prefix(1), 1);
  assert.equal(bit.prefix(3), 9);
  assert.equal(bit.prefix(5), 25);
});

test('fenwick 区间和 + 单点更新', () => {
  const bit = new Fenwick2(5, [1, 3, 5, 7, 9]);
  bit.update(2, 10);
  assert.equal(bit.range(1, 5), 35);
  assert.equal(bit.range(2, 2), 13);
});
