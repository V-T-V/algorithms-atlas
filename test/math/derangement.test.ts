import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  derangement,
  derangementMod,
  derangementBig,
} from '../../src/algorithms/math/derangement/impl.ts';

// 标准错排数列：D(0..8) = 1,0,1,2,9,44,265,1854,14833
const SEQ = [1, 0, 1, 2, 9, 44, 265, 1854, 14833];

test('derangement 前 9 项', () => {
  for (let n = 0; n < SEQ.length; n++) {
    assert.equal(derangement(n), SEQ[n], `D(${n})`);
  }
});

test('derangement 边界', () => {
  assert.equal(derangement(0), 1);
  assert.equal(derangement(1), 0);
  assert.equal(derangement(-3), 0);
});

test('derangement 取模正确', () => {
  const mod = 1_000_000_007;
  assert.equal(derangementMod(6, mod), 44 % mod);
  assert.equal(derangementMod(8, mod), 14833 % mod);
});

test('derangement BigInt 大值', () => {
  assert.equal(derangementBig(6), 44n);
  assert.equal(derangementBig(20), 895014631192902121n);
});

test('derangement 钩子', () => {
  let steps = 0;
  derangement(5, { onStep: () => steps++ });
  assert.ok(steps > 0);
});
