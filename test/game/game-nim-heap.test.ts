import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameNimHeap } from '../../src/algorithms/game/game-nim-heap/impl.ts';

test('game-nim-heap maxTake=1 退化为 Nim 异或', () => {
  assert.equal(gameNimHeap([1, 1], 1), false);
  assert.equal(gameNimHeap([1, 2], 1), true);
});

test('game-nim-heap 单堆 maxTake=2', () => {
  // 3 颗，每次最多取 2：先手取 2，后手取 1 → 先手取走最后 → 但后手取的是最后一个
  // 3 mod 3 = 0 → 先手必败
  assert.equal(gameNimHeap([3], 2), false);
  assert.equal(gameNimHeap([4], 2), true);
});

test('game-nim-heap 返回布尔', () => {
  assert.equal(typeof gameNimHeap([5, 5], 3), 'boolean');
});
