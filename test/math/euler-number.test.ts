import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerianTriangle, eulerianNumber } from '../../src/algorithms/math/euler-number/impl.ts';

test('eulerianTriangle 已知值', () => {
  // ⟨4,k⟩: 1,11,11,1；⟨5,k⟩: 1,26,66,26,1
  const t = eulerianTriangle(5);
  assert.deepEqual(t[4], [1, 11, 11, 1]);
  assert.deepEqual(t[5], [1, 26, 66, 26, 1]);
});

test('eulerianTriangle 行和为 n!', () => {
  const t = eulerianTriangle(7);
  const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
  for (let n = 1; n <= 7; n++) {
    assert.equal(
      t[n]!.reduce((a, b) => a + b, 0),
      fact(n),
      `row ${n}`,
    );
  }
});

test('eulerianNumber 单值', () => {
  assert.equal(eulerianNumber(4, 1), 11);
  assert.equal(eulerianNumber(5, 2), 66);
});

test('eulerianTriangle 边界', () => {
  assert.deepEqual(eulerianTriangle(0), [[]]);
  assert.deepEqual(eulerianTriangle(1), [[], [1]]);
});
