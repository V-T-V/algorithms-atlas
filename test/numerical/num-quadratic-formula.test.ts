import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quadraticFormula } from '../../src/algorithms/numerical/num-quadratic-formula/impl.ts';
test('两实根', () => {
  assert.deepEqual(quadraticFormula(1, -3, 2).roots, [[2], [1]]);
});
test('复根', () => {
  const r = quadraticFormula(1, 0, 1).roots;
  assert.deepEqual(r, [
    [0, 1],
    [0, -1],
  ]);
});
test('a=0 报错', () => {
  assert.throws(() => quadraticFormula(0, 1, 1), RangeError);
});
