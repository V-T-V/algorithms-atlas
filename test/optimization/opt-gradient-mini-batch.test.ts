import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  miniBatchGradientDescent,
  shuffledIndices,
  type Sample,
} from '../../src/algorithms/optimization/opt-gradient-mini-batch/impl.ts';

const SAMPLES: Sample[] = [
  { x: 1, y: 3 },
  { x: 2, y: 5 },
  { x: 3, y: 7 },
  { x: 4, y: 9 },
  { x: 5, y: 11 },
  { x: 6, y: 13 },
];

test('miniBatchGradientDescent 拟合 y=2x+1', () => {
  const r = miniBatchGradientDescent(SAMPLES, [0, 0], 0.05, 2, 200);
  assert.ok(Math.abs(r.params[0]! - 2) < 0.1, `w=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! - 1) < 0.5, `b=${r.params[1]}`);
});

test('shuffledIndices 是一个排列', () => {
  const idx = shuffledIndices(5, 42);
  assert.deepEqual(
    [...idx].sort((a, b) => a - b),
    [0, 1, 2, 3, 4],
  );
});

test('miniBatchGradientDescent 钩子', () => {
  let epochs = 0;
  miniBatchGradientDescent(SAMPLES, [0, 0], 0.05, 2, 3, 1, { onEpochEnd: () => epochs++ });
  assert.equal(epochs, 3);
});
