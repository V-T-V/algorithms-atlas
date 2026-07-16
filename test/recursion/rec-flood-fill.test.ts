import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floodFill, floodFillCopy } from '../../src/algorithms/recursion/rec-flood-fill/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-flood-fill/trace.ts';

test('rec-flood-fill 基本用例', () => {
  const result = floodFillCopy(
    [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
    ],
    1,
    1,
    2,
  );
  assert.deepEqual(result, [
    [2, 2, 2],
    [2, 2, 0],
    [2, 0, 1],
  ]);
});

test('rec-flood-fill 原地修改', () => {
  const img = [
    [0, 0, 0],
    [0, 1, 1],
  ];
  floodFill(img, 0, 0, 5);
  assert.deepEqual(img, [
    [5, 5, 5],
    [5, 1, 1],
  ]);
});

test('rec-flood-fill 旧色等于新色不变', () => {
  const img = [
    [1, 1],
    [1, 1],
  ];
  const result = floodFillCopy(img, 0, 0, 1);
  assert.deepEqual(result, [
    [1, 1],
    [1, 1],
  ]);
});

test('rec-flood-fill 单点', () => {
  const result = floodFillCopy([[5]], 0, 0, 9);
  assert.deepEqual(result, [[9]]);
});

test('rec-flood-fill trace', () => {
  assert.ok(buildTrace().length > 2);
});
