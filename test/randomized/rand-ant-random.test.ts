import { test } from 'node:test';
import assert from 'node:assert/strict';
import { antWalk } from '../../src/algorithms/randomized/rand-ant-random/impl.ts';
test('曼哈顿距离 ≤ steps', () => {
  const [x, y] = antWalk(50, 42);
  assert.ok(Math.abs(x) + Math.abs(y) <= 50);
});
