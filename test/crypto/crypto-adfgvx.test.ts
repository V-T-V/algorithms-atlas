import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adfgvxEncrypt, buildAdfgvxFill } from '../../src/algorithms/crypto/crypto-adfgvx/impl.ts';

test('crypto-adfgvx 填充构造', () => {
  const fill = buildAdfgvxFill('');
  assert.equal(fill.length, 36);
  assert.equal(fill[0], 'A');
  assert.equal(fill[35], '9');
});

test('crypto-adfgvx 关键字去重', () => {
  const fill = buildAdfgvxFill('ABCABC');
  assert.equal(fill.slice(0, 3), 'ABC');
});

test('crypto-adfgvx 仅分数化（单列密钥）', () => {
  // transpositionKey 长度 1 => 不重排
  // 默认填充 ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
  // A 索引0 -> row0 LABELS[0]=A, col0 LABELS[0]=A => AA
  // T 索引19 -> row3 LABELS[3]=G, col1 LABELS[1]=D => GD
  const out = adfgvxEncrypt('AT', '', 'X');
  assert.equal(out, 'AAGD');
});
