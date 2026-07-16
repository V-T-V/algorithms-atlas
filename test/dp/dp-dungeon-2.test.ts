import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateMinimumHP } from '../../src/algorithms/dp/dp-dungeon-2/impl.ts';

test('dungeon LC174 例', () => {
  assert.equal(
    calculateMinimumHP([
      [-2, -3, 3],
      [-5, -10, 1],
      [10, 30, -5],
    ]),
    7,
  );
});

test('dungeon 全加血', () => {
  assert.equal(
    calculateMinimumHP([
      [1, 2],
      [3, 4],
    ]),
    1,
  );
});

test('dungeon 单格负', () => {
  assert.equal(calculateMinimumHP([[-5]]), 6);
});

test('dungeon 单格正', () => {
  assert.equal(calculateMinimumHP([[5]]), 1);
});
