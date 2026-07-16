import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spreadStones } from '../../src/algorithms/graph/graph-spreadstone/impl.ts';

test('spreadstone 两源基本', () => {
  const grid = [
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 2],
    [0, 0, 0, 0],
  ];
  assert.equal(spreadStones(grid), 3);
});

test('spreadstone 单源中心', () => {
  assert.equal(
    spreadStones([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]),
    2,
  );
});

test('spreadstone 全是源', () => {
  assert.equal(
    spreadStones([
      [1, 1],
      [1, 1],
    ]),
    0,
  );
});

test('spreadstone 单格源', () => {
  assert.equal(spreadStones([[3]]), 0);
});

test('spreadstone 钩子', () => {
  let visits = 0;
  spreadStones(
    [
      [1, 0],
      [0, 0],
    ],
    { onVisit: () => visits++ },
  );
  assert.equal(visits, 3);
});
