import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chaocipherEncrypt } from '../../src/algorithms/crypto/crypto-chaocipher/impl.ts';

test('crypto-chaocipher 首字符由初始表决定', () => {
  // left='HXUC...' 中 H 在索引 0，right[0]='P' => H->P
  assert.equal(chaocipherEncrypt('H'), 'P');
});

test('crypto-chaocipher 非字母保留', () => {
  assert.equal(chaocipherEncrypt('H!'), 'P!');
});

test('crypto-chaocipher 扰动使重复字母映射不同', () => {
  // 连续两个相同字母 -> 第二个受扰动影响，映射应不同
  const out = chaocipherEncrypt('HH');
  assert.notEqual(out[0], out[1]);
});
