import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tiling3xN } from '../../src/algorithms/dp/dp-tiling-domino-tromino/impl.ts';

test('tiling3xN 仅多米诺 n=2 = 3', () => {
  assert.equal(tiling3xN(2, { tromino: false }).ways, 3);
});

test('tiling3xN 仅多米诺 n=4 = 11', () => {
  assert.equal(tiling3xN(4, { tromino: false }).ways, 11);
});

test('tiling3xN 仅多米诺 n=6 = 41', () => {
  assert.equal(tiling3xN(6, { tromino: false }).ways, 41);
});

test('tiling3xN 仅多米诺 n=奇数 = 0', () => {
  assert.equal(tiling3xN(1, { tromino: false }).ways, 0);
  assert.equal(tiling3xN(3, { tromino: false }).ways, 0);
  assert.equal(tiling3xN(5, { tromino: false }).ways, 0);
});

test('tiling3xN 含三多米诺 n=2 = 10', () => {
  assert.equal(tiling3xN(2).ways, 10);
});

test('tiling3xN 含三多米诺 n=3 = 6', () => {
  assert.equal(tiling3xN(3).ways, 6);
});

test('tiling3xN 含三多米诺 n=1 = 0', () => {
  // 3x1 单列无法用 L 型或多米诺填满
  assert.equal(tiling3xN(1).ways, 0);
});

test('tiling3xN 钩子被调用', () => {
  let calls = 0;
  tiling3xN(4, { tromino: false }, { onColumn: () => calls++ });
  assert.equal(calls, 4);
});
