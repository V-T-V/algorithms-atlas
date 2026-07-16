import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cAdd, cMul, cAbs } from '../../src/algorithms/numerical/num-complex-add/impl.ts';
test('复数加', () => {
  assert.deepEqual(cAdd({ re: 1, im: 2 }, { re: 3, im: 4 }), { re: 4, im: 6 });
});
test('复数乘 (0+1i)²=-1', () => {
  assert.deepEqual(cMul({ re: 0, im: 1 }, { re: 0, im: 1 }), { re: -1, im: 0 });
});
test('模 |3+4i|=5', () => {
  assert.equal(cAbs({ re: 3, im: 4 }), 5);
});
