import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knightProbability } from '../../src/algorithms/dp/dp-knight-probability/impl.ts';

test('knight LeetCode 688 例', () => {
  assert.equal(knightProbability(3, 2, 0, 0), 0.0625);
  assert.equal(knightProbability(1, 0, 0, 0), 1);
});

test('knight k=0 概率为 1（在棋盘上）', () => {
  assert.equal(knightProbability(4, 0, 2, 2), 1);
});

test('knight 单格棋盘 k>0 必出界', () => {
  assert.equal(knightProbability(1, 1, 0, 0), 0);
});

test('knight 大棋盘角落数步', () => {
  const p = knightProbability(8, 3, 0, 0);
  assert.ok(p > 0 && p <= 1);
});

test('knight 起点出界', () => {
  assert.equal(knightProbability(3, 2, 5, 5), 0);
});

test('knight 钩子', () => {
  let steps = 0;
  knightProbability(3, 2, 0, 0, { onStep: () => steps++ });
  assert.equal(steps, 2);
});
