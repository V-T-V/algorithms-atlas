import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SegTree2 } from '../../src/algorithms/ds/ds-seg-2/impl.ts';

test('seg 区间和', () => {
  const seg = new SegTree2([1, 3, 5, 7, 9]);
  assert.equal(seg.query(0, 4), 25);
  assert.equal(seg.query(1, 3), 15);
});

test('seg 区间加后再查', () => {
  const seg = new SegTree2([1, 3, 5, 7, 9]);
  seg.update(1, 3, 10);
  assert.equal(seg.query(0, 4), 55);
  assert.equal(seg.query(1, 3), 45);
});
