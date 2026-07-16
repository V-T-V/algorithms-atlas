import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomWalk2D } from '../../src/algorithms/randomized/rand-walk-2d/impl.ts';
test('起点原点', () => {
  assert.deepEqual(randomWalk2D(10, 42)[0], [0, 0]);
});
test('长度正确', () => {
  assert.equal(randomWalk2D(30, 1).length, 31);
});
