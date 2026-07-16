import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyNumber, isAbundant } from '../../src/algorithms/math/abundant-number/impl.ts';

test('abundant 12 是盈数', () => {
  assert.equal(isAbundant(12), true);
  assert.equal(classifyNumber(12).kind, 'abundant');
  assert.equal(classifyNumber(12).sum, 16);
});

test('abundant 18, 20 是盈数', () => {
  assert.equal(isAbundant(18), true); // 1+2+3+6+9=21>18
  assert.equal(isAbundant(20), true); // 1+2+4+5+10=22>20
});

test('abundant 6, 28 是完全数（非盈数）', () => {
  assert.equal(classifyNumber(6).kind, 'perfect');
  assert.equal(classifyNumber(28).kind, 'perfect');
  assert.equal(isAbundant(6), false);
});

test('abundant 素数是亏数', () => {
  assert.equal(classifyNumber(7).kind, 'deficient');
  assert.equal(classifyNumber(13).kind, 'deficient');
});

test('abundant 8 是亏数', () => {
  // 1+2+4=7<8
  assert.equal(classifyNumber(8).kind, 'deficient');
});

test('abundant 钩子被调用', () => {
  const ds: number[] = [];
  classifyNumber(12, { onDivisor: (d) => ds.push(d) });
  assert.deepEqual(
    [...ds].sort((a, b) => a - b),
    [1, 2, 3, 4, 6],
  );
});
