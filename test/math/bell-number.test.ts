import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bellNumber, bellNumberBig } from '../../src/algorithms/math/bell-number/impl.ts';

const MOD = 1_000_000_007;
// B(0..8) = 1,1,2,5,15,52,203,877,4140
const SEQ = [1, 1, 2, 5, 15, 52, 203, 877, 4140];

test('bell 前 9 项', () => {
  for (let n = 0; n < SEQ.length; n++) {
    assert.equal(bellNumber(n, MOD), SEQ[n], `B(${n})`);
  }
});

test('bell 边界', () => {
  assert.equal(bellNumber(0, MOD), 1);
  assert.equal(bellNumber(-1, MOD), 0);
});

test('bell BigInt 大值', () => {
  assert.equal(bellNumberBig(6), 203n);
  assert.equal(bellNumberBig(10), 115975n);
});

test('bell 取模一致', () => {
  assert.equal(bellNumber(8, MOD), 4140 % MOD);
  assert.equal(bellNumber(20, MOD) > 0, true);
});

test('bell 钩子', () => {
  let rows = 0;
  bellNumber(4, MOD, { onRow: () => rows++ });
  assert.equal(rows, 5); // 行 0..4
});
