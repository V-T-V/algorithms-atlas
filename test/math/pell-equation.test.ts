import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solvePell } from '../../src/algorithms/math/pell-equation/impl.ts';

test('solvePell D=2', () => {
  // x²−2y²=1 最小解 (3,2)：9−8=1
  const { x, y } = solvePell(2);
  assert.equal(x, 3n);
  assert.equal(y, 2n);
  assert.equal(x * x - 2n * y * y, 1n);
});

test('solvePell D=3', () => {
  // (2,1): 4−3=1
  const { x, y } = solvePell(3);
  assert.equal(x, 2n);
  assert.equal(y, 1n);
});

test('solvePell D=5', () => {
  // (9,4): 81−80=1
  const { x, y } = solvePell(5);
  assert.equal(x, 9n);
  assert.equal(y, 4n);
  assert.equal(x * x - 5n * y * y, 1n);
});

test('solvePell D=13', () => {
  // (649,180)
  const { x, y } = solvePell(13);
  assert.equal(x, 649n);
  assert.equal(y, 180n);
  assert.equal(x * x - 13n * y * y, 1n);
});

test('solvePell 大 D=61', () => {
  // 经典大解 (1766319049, 226153980)
  const { x, y } = solvePell(61);
  assert.equal(x, 1766319049n);
  assert.equal(y, 226153980n);
  assert.equal(x * x - 61n * y * y, 1n);
});

test('solvePell 完全平方 D 抛错', () => {
  assert.throws(() => solvePell(4), RangeError);
  assert.throws(() => solvePell(1), RangeError);
});
