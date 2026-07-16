import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btFactorCombinations } from '../../src/algorithms/backtracking/bt-factor-combinations/impl.ts';

const norm = (xs: number[][]): string[] => xs.map((s) => s.join(',')).sort();

test('bt-factor-combinations 32', () => {
  assert.deepEqual(norm(btFactorCombinations(32)), [
    '2,16',
    '2,2,2,2,2',
    '2,2,2,4',
    '2,2,8',
    '2,4,4',
    '4,8',
  ]);
});

test('bt-factor-combinations 每组乘积等于 n', () => {
  for (const c of btFactorCombinations(60)) {
    assert.equal(
      c.reduce((a, b) => a * b, 1),
      60,
    );
  }
});

test('bt-factor-combinations 因数升序', () => {
  for (const c of btFactorCombinations(48)) {
    for (let i = 1; i < c.length; i++) {
      assert.ok(c[i]! >= c[i - 1]!, '应升序');
    }
  }
});

test('bt-factor-combinations 质数无解', () => {
  assert.deepEqual(btFactorCombinations(7), []);
});
