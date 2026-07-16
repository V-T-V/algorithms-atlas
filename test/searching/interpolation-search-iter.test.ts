import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpolationSearchIter } from '../../src/algorithms/searching/interpolation-search-iter/impl.ts';

const ARR = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

test('interpolationSearchIter 命中', () => {
  assert.equal(interpolationSearchIter(ARR, 10), 0);
  assert.equal(interpolationSearchIter(ARR, 100), 9);
  assert.equal(interpolationSearchIter(ARR, 70), 6);
});

test('interpolationSearchIter 未命中返回 -1', () => {
  assert.equal(interpolationSearchIter(ARR, 5), -1);
  assert.equal(interpolationSearchIter(ARR, 105), -1);
  assert.equal(interpolationSearchIter(ARR, 25), -1);
});

test('interpolationSearchIter 边界', () => {
  assert.equal(interpolationSearchIter([], 1), -1);
  assert.equal(interpolationSearchIter([5], 5), 0);
  assert.equal(interpolationSearchIter([5], 1), -1);
});

test('interpolationSearchIter 钩子触发探测', () => {
  let probes = 0;
  let doneIdx = -2;
  interpolationSearchIter(ARR, 70, {
    onProbe: () => probes++,
    onDone: (i) => {
      doneIdx = i;
    },
  });
  assert.ok(probes >= 1);
  assert.equal(doneIdx, 6);
});
