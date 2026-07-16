import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SkipList2 } from '../../src/algorithms/ds/ds-skiplist-2/impl.ts';

test('skiplist 插入有序', () => {
  const sl = new SkipList2();
  for (const v of [5, 3, 8, 1, 9]) sl.insert(v);
  assert.deepEqual(sl.toArray(), [1, 3, 5, 8, 9]);
});

test('skiplist 查询', () => {
  const sl = new SkipList2();
  for (const v of [5, 3, 8, 1, 9]) sl.insert(v);
  assert.equal(sl.contains(5), true);
  assert.equal(sl.contains(7), false);
});
