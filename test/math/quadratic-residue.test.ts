import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isQuadraticResidue,
  enumerateResidues,
} from '../../src/algorithms/math/quadratic-residue/impl.ts';

test('isQuadraticResidue 模 7', () => {
  // 剩余 1,2,4
  assert.equal(isQuadraticResidue(1n, 7n), true);
  assert.equal(isQuadraticResidue(2n, 7n), true);
  assert.equal(isQuadraticResidue(3n, 7n), false);
  assert.equal(isQuadraticResidue(4n, 7n), true);
  assert.equal(isQuadraticResidue(5n, 7n), false);
  assert.equal(isQuadraticResidue(6n, 7n), false);
});

test('enumerateResidues 模 13', () => {
  // x² mod 13 for x=1..12: 1,4,9,3,12,10,10,12,3,9,4,1 → 集合 {1,3,4,9,10,12}
  assert.deepEqual(enumerateResidues(13n), [1n, 3n, 4n, 9n, 10n, 12n]);
});

test('enumerateResidues 个数为 (p-1)/2', () => {
  for (const p of [7n, 11n, 13n, 17n, 23n, 101n]) {
    assert.equal(enumerateResidues(p).length, Number((p - 1n) / 2n));
  }
});

test('isQuadraticResidue 与枚举一致', () => {
  const p = 23n;
  const set = new Set(enumerateResidues(p).map((x) => Number(x)));
  for (let a = 1n; a < p; a++) {
    assert.equal(isQuadraticResidue(a, p), set.has(Number(a)), `a=${a}`);
  }
});
