import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clamp } from '../../src/algorithms/numerical/num-clamp/impl.ts';
test('clamp 上界', () => {
  assert.equal(clamp(15, 0, 10), 10);
});
test('clamp 下界', () => {
  assert.equal(clamp(-3, 0, 10), 0);
});
test('clamp 内', () => {
  assert.equal(clamp(5, 0, 10), 5);
});
