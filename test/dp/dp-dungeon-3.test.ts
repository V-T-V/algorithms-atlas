import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateMinimumHP } from '../../src/algorithms/dp/dp-dungeon-3/impl.ts';

test('dungeon 经典', () => {
  assert.equal(
    calculateMinimumHP([
      [-2, -3, 3],
      [-5, -10, 1],
      [10, 30, -5],
    ]),
    7,
  );
});
test('dungeon 单格伤害', () => {
  assert.equal(calculateMinimumHP([[-5]]), 6);
});
test('dungeon 单格回血', () => {
  assert.equal(calculateMinimumHP([[5]]), 1);
});
