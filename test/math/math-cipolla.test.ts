import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cipolla } from '../../src/algorithms/math/math-cipolla/impl.ts';

test('√2 mod 17 ∈ {6, 11}', () => {
  const r = cipolla(2, 17);
  assert.ok(r !== null);
  assert.equal((r * r) % 17, 2);
});

test('√4 mod 7 ∈ {2, 5}', () => {
  const r = cipolla(4, 7);
  assert.ok(r !== null);
  assert.equal((r * r) % 7, 4);
});

test('√0 mod p = 0', () => {
  const r = cipolla(0, 11);
  assert.equal(r, 0);
});

test('非剩余 → null: √2 mod 5', () => {
  // 2 不是模 5 的二次剩余
  const r = cipolla(2, 5);
  assert.equal(r, null);
});

test('√10 mod 13 ∈ {6, 7}', () => {
  const r = cipolla(10, 13);
  assert.ok(r !== null);
  assert.equal((r * r) % 13, 10);
});
