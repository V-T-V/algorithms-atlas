import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, middleNode } from '../../src/algorithms/list/list-middle-node/impl.ts';

test('middleNode 中点', () => {
  assert.equal(middleNode(buildList([1, 2, 3, 4, 5]))!.value, 3);
  assert.equal(middleNode(buildList([1, 2, 3, 4, 5, 6]))!.value, 4);
  assert.equal(middleNode(buildList([1]))!.value, 1);
  assert.equal(middleNode(buildList([1, 2]))!.value, 2);
  assert.equal(middleNode(buildList([])), null);
});

test('middleNode 钩子', () => {
  const slowValues: number[] = [];
  middleNode(buildList([1, 2, 3, 4, 5]), { onStep: (s) => slowValues.push(s) });
  assert.deepEqual(slowValues, [2, 3]);
});
