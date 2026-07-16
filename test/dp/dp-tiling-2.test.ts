import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dominoTiling2xN } from '../../src/algorithms/dp/dp-tiling-2/impl.ts';

test('tiling n=0', () => {
  assert.equal(dominoTiling2xN(0), 1);
});

test('tiling n=1', () => {
  assert.equal(dominoTiling2xN(1), 1);
});

test('tiling n=2', () => {
  assert.equal(dominoTiling2xN(2), 2);
});

test('tiling n=3', () => {
  assert.equal(dominoTiling2xN(3), 3);
});

test('tiling n=6 斐波那契', () => {
  // 1,1,2,3,5,8,13
  assert.equal(dominoTiling2xN(6), 13);
});

test('tiling 负数', () => {
  assert.equal(dominoTiling2xN(-1), 0);
});
