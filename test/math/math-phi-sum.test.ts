import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phiSum, phiSingle } from '../../src/algorithms/math/math-phi-sum/impl.ts';

test('Φ(10) = 32', () => {
  // φ(1..10) = 1,1,2,2,4,2,6,4,6,4 -> sum=32
  assert.equal(phiSum(10), 32);
});

test('Φ(1) = 1', () => {
  assert.equal(phiSum(1), 1);
});

test('Φ(0) = 0', () => {
  assert.equal(phiSum(0), 0);
});

test('phiSingle 一致性', () => {
  assert.equal(phiSingle(1), 1);
  assert.equal(phiSingle(7), 6);
  assert.equal(phiSingle(10), 4);
  assert.equal(phiSingle(12), 4);
});

test('Φ(20) 数值', () => {
  // 1,1,2,2,4,2,6,4,6,4,10,4,12,6,8,8,16,6,18,8 → sum=128
  assert.equal(phiSum(20), 128);
});
