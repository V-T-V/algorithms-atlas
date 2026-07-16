import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalan } from '../../src/algorithms/math/catalan/impl.ts';

test('catalan 前 10 项', () => {
  // C_0..C_9: 1,1,2,5,14,42,132,429,1430,4862
  const expected = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862];
  const C = catalan(9);
  assert.deepEqual(
    C.map((x) => Number(x)),
    expected,
  );
});

test('catalan C_15 = 9694845', () => {
  const C = catalan(15);
  assert.equal(Number(C[15]), 9694845);
});

test('catalan 边界与错误', () => {
  assert.deepEqual(
    catalan(0).map((x) => Number(x)),
    [1],
  );
  assert.throws(() => catalan(-1), RangeError);
});

test('catalan 钩子被调用', () => {
  let computed = 0;
  catalan(5, { onComputed: () => computed++ });
  assert.equal(computed, 6, '应计算 C_0..C_5 共 6 项');
});
