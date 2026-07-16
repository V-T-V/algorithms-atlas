import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  continuedFraction,
  fromContinuedFraction,
} from '../../src/algorithms/math/continued-fraction/impl.ts';

test('continuedFraction 基本展开', () => {
  // 355/113 = [3; 7, 15, 1] → 规范化末项 1 合并 → [3; 7, 16]
  assert.deepEqual(continuedFraction(355, 113), [3n, 7n, 16n]);
  // 1071/462 = [2; 3, 6, 1]? 用 gcd=21; 1071/462: 2 r147; 462/147=3 r21;147/21=7 r0 → [2;3,7]
  assert.deepEqual(continuedFraction(1071, 462), [2n, 3n, 7n]);
});

test('continuedFraction 整数', () => {
  assert.deepEqual(continuedFraction(5, 1), [5n]);
  assert.deepEqual(continuedFraction(-3, 1), [-3n]);
});

test('continuedFraction 负数与符号归一', () => {
  // -355/113 → den>0, num<0 → a0 = floor(-355/113) = -4, ...
  const c = continuedFraction(-355, 113);
  const [p, q] = fromContinuedFraction(c);
  assert.equal(p * 113n, q * -355n);
});

test('continuedFraction 分母为负归一', () => {
  assert.deepEqual(continuedFraction(355, -113), continuedFraction(-355, 113));
});

test('fromContinuedFraction 还原一致', () => {
  for (const [p, q] of [
    [355, 113],
    [1071, 462],
    [22, 7],
    [1, 3],
    [5, 1],
  ] as const) {
    const c = continuedFraction(p, q);
    const [pp, qq] = fromContinuedFraction(c);
    assert.equal(pp * BigInt(q), qq * BigInt(p), `还原失败 ${p}/${q}`);
  }
});

test('continuedFraction 错误输入', () => {
  assert.throws(() => continuedFraction(1, 0), RangeError);
});

test('continuedFraction 钩子被调用', () => {
  let coeffs = 0;
  let results = 0;
  continuedFraction(355, 113, {
    onCoefficient: () => coeffs++,
    onResult: () => results++,
  });
  assert.ok(coeffs >= 1, '应提取至少一个系数');
  assert.equal(results, 1, 'onResult 恰好一次');
});
