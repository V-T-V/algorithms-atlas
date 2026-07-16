import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchFirst } from '../../src/algorithms/searching/search-first/impl.ts';

test('searchFirst 含重复', () => {
  const a = [1, 2, 2, 2, 3, 3, 4];
  assert.equal(searchFirst(a, 2), 1);
  assert.equal(searchFirst(a, 3), 4);
  assert.equal(searchFirst(a, 1), 0);
  assert.equal(searchFirst(a, 4), 6);
  assert.equal(searchFirst(a, 5), -1);
});

test('searchFirst 边界', () => {
  assert.equal(searchFirst([], 1), -1);
  assert.equal(searchFirst([5], 5), 0);
  assert.equal(searchFirst([5], 3), -1);
});

test('searchFirst 钩子', () => {
  let probes = 0;
  let done = -1;
  searchFirst([1, 2, 2, 3], 2, {
    onProbe: () => probes++,
    onDone: (i) => (done = i),
  });
  assert.ok(probes > 0);
  assert.equal(done, 1);
});
