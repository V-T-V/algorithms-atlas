import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fastSearch } from '../../src/algorithms/searching/fast-search/impl.ts';

const ARR = [5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71, 77, 83, 89, 95];

test('fastSearch 命中', () => {
  assert.equal(fastSearch(ARR, 5), 0);
  assert.equal(fastSearch(ARR, 95), 15);
  assert.equal(fastSearch(ARR, 47), 7);
  assert.equal(fastSearch(ARR, 29), 4);
});

test('fastSearch 未命中', () => {
  assert.equal(fastSearch(ARR, 1), -1);
  assert.equal(fastSearch(ARR, 100), -1);
  assert.equal(fastSearch(ARR, 50), -1);
});

test('fastSearch 边界', () => {
  assert.equal(fastSearch([], 1), -1);
  assert.equal(fastSearch([5], 5), 0);
  assert.equal(fastSearch([5], 3), -1);
});

test('fastSearch 两阶段均触发', () => {
  let blockProbes = 0;
  let inBlockProbes = 0;
  fastSearch(ARR, 47, {
    onBlockProbe: () => blockProbes++,
    onInBlockProbe: () => inBlockProbes++,
  });
  assert.ok(blockProbes >= 1);
  assert.ok(inBlockProbes >= 1);
});
