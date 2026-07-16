import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BlockList2 } from '../../src/algorithms/ds/ds-block-list-2/impl.ts';

test('block-list 区间和', () => {
  const bl = new BlockList2([1, 3, 5, 7, 9, 2, 4, 6, 8, 0]);
  assert.equal(bl.query(0, 9), 45);
  assert.equal(bl.query(2, 6), 27);
});

test('block-list 区间加后再查', () => {
  const bl = new BlockList2([1, 3, 5, 7, 9, 2, 4, 6, 8, 0]);
  bl.update(1, 8, 10);
  assert.equal(bl.query(0, 9), 45 + 80);
  assert.equal(bl.query(0, 0), 1);
  assert.equal(bl.query(9, 9), 0);
});
