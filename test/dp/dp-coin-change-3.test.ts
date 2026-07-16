import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinChangeLex } from '../../src/algorithms/dp/dp-coin-change-3/impl.ts';

test('coin-change-lex LeetCode 322 例', () => {
  const r = coinChangeLex([1, 2, 5], 11);
  assert.equal(r.count, 3);
  // 11=5+5+1; 字典序最小 [1,5,5]
  assert.deepEqual(r.coins, [1, 5, 5]);
});

test('coin-change-lex 无解', () => {
  assert.equal(coinChangeLex([2], 3).count, -1);
});

test('coin-change-lex amount=0', () => {
  const r = coinChangeLex([1, 2, 5], 0);
  assert.equal(r.count, 0);
  assert.deepEqual(r.coins, []);
});

test('coin-change-lex 单面额', () => {
  const r = coinChangeLex([1], 4);
  assert.deepEqual(r, { count: 4, coins: [1, 1, 1, 1] });
});

test('coin-change-lex 字典序', () => {
  // 6=2+2+2=1+5 ; 最少 3 枚两种 [2,2,2] 和 [1,5]; 字典序 [1,5,?]... 实际 dp[6]=3 via 1+5? dp[6]=dp[1]+1=2? dp[1]=1 so dp[6]=2 (1+5). So count=2.
  const r = coinChangeLex([1, 2, 5], 6);
  assert.equal(r.count, 2);
  assert.deepEqual(r.coins, [1, 5]);
});
