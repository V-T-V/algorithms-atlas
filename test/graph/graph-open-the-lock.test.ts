import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openLock } from '../../src/algorithms/graph/graph-open-the-lock/impl.ts';

test('open-the-lock LeetCode 752 例 1', () => {
  assert.equal(openLock(['0201', '0101', '0102', '1212', '2002'], '0202'), 6);
});

test('open-the-lock LeetCode 752 例 2', () => {
  assert.equal(openLock(['8888'], '0009'), 1);
});

test('open-the-lock LeetCode 752 例 3', () => {
  assert.equal(
    openLock(['8887', '8889', '8878', '8898', '8788', '8988', '7888', '9888'], '8888'),
    -1,
  );
});

test('open-the-lock 起点是死锁', () => {
  assert.equal(openLock(['0000'], '8888'), -1);
});

test('open-the-lock 起点即终点', () => {
  assert.equal(openLock([], '0000'), 0);
});
