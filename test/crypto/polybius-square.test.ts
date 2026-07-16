import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanText,
  coordToLetter,
  letterToCoord,
  polybiusDecrypt,
  polybiusEncrypt,
} from '../../src/algorithms/crypto/polybius-square/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/polybius-square/trace.ts';

test('polybius 已知映射', () => {
  assert.deepEqual(letterToCoord('A'), { row: 1, col: 1 });
  assert.deepEqual(letterToCoord('E'), { row: 1, col: 5 });
  assert.deepEqual(letterToCoord('B'), { row: 1, col: 2 });
  assert.deepEqual(letterToCoord('Z'), { row: 5, col: 5 });
});

test('polybius J 归并到 I', () => {
  assert.equal(cleanText('JACK'), 'IACK');
  assert.deepEqual(letterToCoord('I'), letterToCoord('J'));
});

test('polybius cleanText 清洗', () => {
  assert.equal(cleanText('He,llo!'), 'HELLO');
});

test('polybius 加密 HELLO', () => {
  // H=23, E=15, L=31, L=31, O=34
  assert.equal(polybiusEncrypt('HELLO').text, '2315313134');
});

test('polybius 编解码往返', () => {
  for (const s of ['HELLO', 'WORLD', 'IAMJ', 'A']) {
    const enc = polybiusEncrypt(s).text;
    const back = polybiusDecrypt(enc);
    // 解码后 I/J 不可区分，均以 I 表示
    const expected = s
      .toUpperCase()
      .replace(/J/g, 'I')
      .replace(/[^A-Z]/g, '');
    assert.equal(back, expected, `往返不一致: "${s}"`);
  }
});

test('polybius coordToLetter 往返', () => {
  for (const ch of 'ABCDEFGHIKLMNOPQRSTUVWXYZ') {
    const c = letterToCoord(ch)!;
    assert.equal(coordToLetter(c.row, c.col), ch);
  }
});

test('polybius 非字母被丢弃', () => {
  assert.equal(polybiusEncrypt('A B').text, '1112');
});

test('polybius 钩子被调用', () => {
  const encs: string[] = [];
  polybiusEncrypt('AB', { onEncode: (_i, _l, _r, _c, d) => encs.push(d) });
  assert.deepEqual(encs, ['11', '12']);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
