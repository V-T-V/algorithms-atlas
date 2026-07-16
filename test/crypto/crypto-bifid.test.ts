import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bifidEncrypt, buildBifidSquare } from '../../src/algorithms/crypto/crypto-bifid/impl.ts';

test('crypto-bifid 方阵构造', () => {
  const cells = buildBifidSquare('');
  assert.equal(cells.length, 25);
  assert.ok(!cells.includes('J'));
});

test('crypto-bifid 单字母不变', () => {
  // 单字母: combined = [r,c], 回查 -> 原字母
  assert.equal(bifidEncrypt('A'), 'A');
  assert.equal(bifidEncrypt('B'), 'B');
});

test('crypto-bifid 两字母跨行', () => {
  // 默认方阵 ABCDEFGHIKLMNOPQRSTUVWXYZ（跳过 J）
  // F=idx5=[1,0], K=idx9=[1,4] -> rows=[1,1] cols=[0,4] -> combined=[1,1,0,4]
  // pairs (1,1)->cells[6]=G, (0,4)->cells[4]=E => GE
  assert.equal(bifidEncrypt('FK'), 'GE');
});
