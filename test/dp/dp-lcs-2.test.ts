import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scsLength } from '../../src/algorithms/dp/dp-lcs-2/impl.ts';

test('scs 经典例 AGGTAB/GXTXAYB', () => {
  // LCS = GTAB(4), n=6,m=7 => SCS=6+7-4=9
  assert.equal(scsLength('AGGTAB', 'GXTXAYB'), 9);
});

test('scs 相同字符串', () => {
  assert.equal(scsLength('ABC', 'ABC'), 3);
});

test('scs 完全不同', () => {
  assert.equal(scsLength('ABC', 'DEF'), 6);
});

test('scs 一个为空', () => {
  assert.equal(scsLength('', 'ABC'), 3);
  assert.equal(scsLength('ABC', ''), 3);
});

test('scs 两空串', () => {
  assert.equal(scsLength('', ''), 0);
});
