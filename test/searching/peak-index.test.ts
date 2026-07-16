import { test } from 'node:test';
import assert from 'node:assert/strict';
import { peakIndex } from '../../src/algorithms/searching/peak-index/impl.ts';

test('peakIndex 山脉数组', () => {
  assert.equal(peakIndex([0, 1, 0]), 1);
  assert.equal(peakIndex([0, 2, 1, 0]), 1);
  assert.equal(peakIndex([0, 10, 5, 2]), 1);
  assert.equal(peakIndex([0, 1, 3, 5, 4, 2]), 3);
  assert.equal(peakIndex([1]), 0);
  assert.equal(peakIndex([]), -1);
});

test('peakIndex 钩子', () => {
  let done = -1;
  peakIndex([0, 10, 5, 2], { onDone: (i) => (done = i) });
  assert.equal(done, 1);
});
