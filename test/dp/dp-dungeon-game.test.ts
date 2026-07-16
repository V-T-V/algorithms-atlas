import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dungeonGame } from '../../src/algorithms/dp/dp-dungeon-game/impl.ts';

test('dungeon LeetCode 174 例', () => {
  assert.equal(
    dungeonGame([
      [-2, -3, 3],
      [-5, -10, 1],
      [10, 30, -5],
    ]),
    7,
  );
});

test('dungeon 全 0', () => {
  assert.equal(
    dungeonGame([
      [0, 0],
      [0, 0],
    ]),
    1,
  );
});

test('dungeon 单格正', () => {
  assert.equal(dungeonGame([[5]]), 1);
});

test('dungeon 单格负', () => {
  // -5 => 进入需 6
  assert.equal(dungeonGame([[-5]]), 6);
});

test('dungeon 全负路径', () => {
  // [-3,-5]: 伤3伤5，到达终点需 hp-3-5>=1 => 初始 hp>=9
  assert.equal(dungeonGame([[-3, -5]]), 9);
});
