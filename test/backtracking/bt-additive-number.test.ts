import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btAdditiveNumber } from '../../src/algorithms/backtracking/bt-additive-number/impl.ts';

test('bt-additive-number 112358', () => {
  assert.equal(btAdditiveNumber('112358'), true);
});

test('bt-additive-number 199100199', () => {
  assert.equal(btAdditiveNumber('199100199'), true);
});

test('bt-additive-number 1023', () => {
  assert.equal(btAdditiveNumber('1023'), false);
});

test('bt-additive-number 长度不足', () => {
  assert.equal(btAdditiveNumber('12'), false);
});
