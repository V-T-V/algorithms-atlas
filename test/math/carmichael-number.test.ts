import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isCarmichael } from '../../src/algorithms/math/carmichael-number/impl.ts';

test('carmichael 561 = 3·11·17 是 Carmichael', () => {
  const r = isCarmichael(561);
  assert.equal(r.isCarmichael, true);
  assert.deepEqual(r.factors, [3, 11, 17]);
});

test('carmichael 1105 是 Carmichael', () => {
  // 1105 = 5·13·17
  assert.equal(isCarmichael(1105).isCarmichael, true);
});

test('carmichael 1729 是 Carmichael', () => {
  // 1729 = 7·13·19
  assert.equal(isCarmichael(1729).isCarmichael, true);
});

test('carmichael 素数不是 Carmichael', () => {
  assert.equal(isCarmichael(7).isCarmichael, false);
  assert.equal(isCarmichael(13).isCarmichael, false);
});

test('carmichael 一般合数非 Carmichael', () => {
  // 12 = 2²·3 含平方因子
  assert.equal(isCarmichael(12).isCarmichael, false);
  // 15 = 3·5: (3-1)=2 不整除 14; 非 Carmichael
  assert.equal(isCarmichael(15).isCarmichael, false);
});

test('carmichael 含平方因子立即排除', () => {
  const r = isCarmichael(4);
  assert.equal(r.isCarmichael, false);
  assert.equal(r.squareFree, false);
});

test('carmichael 钩子被调用', () => {
  const factors: number[] = [];
  isCarmichael(561, { onFactor: (p) => factors.push(p) });
  assert.deepEqual(factors, [3, 11, 17]);
});
