import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wilson } from '../../src/algorithms/math/wilson/impl.ts';

test('wilson 判定素数', () => {
  // 素数
  for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]) {
    assert.equal(wilson(p), true, `${p} 应为素数`);
  }
  // 合数
  for (const c of [4, 6, 8, 9, 10, 12, 15, 21, 25, 27, 33, 49]) {
    assert.equal(wilson(c), false, `${c} 应为合数`);
  }
});

test('wilson 边界', () => {
  assert.equal(wilson(2), true);
  assert.equal(wilson(1), false);
  assert.equal(wilson(0), false);
  assert.equal(wilson(-5), false);
});

test('wilson 钩子被调用', () => {
  let mults = 0;
  let results = 0;
  wilson(7, {
    onMultiply: () => mults++,
    onResult: () => results++,
  });
  assert.ok(mults >= 1, '应累乘多次');
  assert.equal(results, 1, 'onResult 恰好一次');
});
