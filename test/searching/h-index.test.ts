import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hIndex } from '../../src/algorithms/searching/h-index/impl.ts';

test('hIndex 基本', () => {
  assert.equal(hIndex([3, 0, 6, 1, 5]), 3);
  assert.equal(hIndex([1, 1, 3]), 1);
  assert.equal(hIndex([100]), 1);
  assert.equal(hIndex([0, 0, 0]), 0);
  assert.equal(hIndex([]), 0);
});

test('hIndex 全高引用', () => {
  assert.equal(hIndex([10, 8, 5, 4, 3]), 4);
  assert.equal(hIndex([25, 8, 5, 3, 3]), 3);
});

test('hIndex 钩子', () => {
  let scans = 0;
  let done = -1;
  hIndex([3, 0, 6, 1, 5], {
    onScan: () => scans++,
    onDone: (h) => (done = h),
  });
  assert.ok(scans > 0);
  assert.equal(done, 3);
});
