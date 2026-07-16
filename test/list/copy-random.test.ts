import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRandomList,
  randomListToArray,
  copyRandom,
} from '../../src/algorithms/list/copy-random/impl.ts';

test('copyRandom 深拷贝', () => {
  const _head = buildRandomList([7, 13, 11, 10, 1], [3 - 1, 0, 4 - 1, 2 - 1, 0]);
  void _head;
  // 注意 randomIdx：第0个指向下标3? 用清晰的例子
  const head2 = buildRandomList([1, 2, 3], [2, 2, 0]); // node0->2, node1->2, node2->0
  const copy = copyRandom(head2);
  assert.notEqual(copy, head2);
  assert.deepEqual(randomListToArray(copy), randomListToArray(head2));
});

test('copyRandom 边界', () => {
  assert.equal(copyRandom(null), null);
  const head = buildRandomList([1], [-1]);
  const copy = copyRandom(head);
  assert.deepEqual(randomListToArray(copy), [[1, -1]]);
});

test('copyRandom 钩子', () => {
  let interleave = 0;
  let randomSet = 0;
  copyRandom(buildRandomList([1, 2], [1, 0]), {
    onInterleave: () => interleave++,
    onRandom: () => randomSet++,
  });
  assert.equal(interleave, 2);
  assert.equal(randomSet, 2);
});
