import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  partitionNumber,
  partitionNumberBig,
} from '../../src/algorithms/math/partition-number/impl.ts';

const MOD = 1_000_000_007;
// p(0..10) = 1,1,2,3,5,7,11,15,22,30,42
const SEQ = [1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42];

test('partition 前 11 项', () => {
  for (let n = 0; n < SEQ.length; n++) {
    assert.equal(partitionNumber(n, MOD), SEQ[n], `p(${n})`);
  }
});

test('partition 边界', () => {
  assert.equal(partitionNumber(0, MOD), 1);
  assert.equal(partitionNumber(-1, MOD), 0);
});

test('partition BigInt', () => {
  assert.equal(partitionNumberBig(6), 11n);
  assert.equal(partitionNumberBig(20), 627n);
});

test('partition 取模', () => {
  assert.equal(partitionNumber(15, MOD), 176 % MOD);
});

test('partition 钩子', () => {
  let cells = 0;
  partitionNumber(4, MOD, { onCell: () => cells++ });
  assert.ok(cells > 0);
});
