import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  boyerMooreBadChar,
  buildBadCharTable,
} from '../../src/algorithms/string/boyer-moore-bad-char/impl.ts';

test('BM 基本命中', () => {
  assert.deepEqual(boyerMooreBadChar('HERE IS A SIMPLE EXAMPLE', 'EXAMPLE'), [17]);
  assert.deepEqual(boyerMooreBadChar('ABAAABCD', 'ABC'), [4]);
});

test('BM 多次命中', () => {
  assert.deepEqual(
    boyerMooreBadChar('aaaa', 'aa').sort((a, b) => a - b),
    [0, 1, 2],
  );
  assert.deepEqual(
    boyerMooreBadChar('abababab', 'abab').sort((a, b) => a - b),
    [0, 2, 4],
  );
});

test('BM 不命中', () => {
  assert.deepEqual(boyerMooreBadChar('hello world', 'xyz'), []);
  assert.deepEqual(boyerMooreBadChar('abcdefg', 'xyz'), []);
});

test('BM 空模式', () => {
  assert.deepEqual(boyerMooreBadChar('abc', ''), [0]);
});

test('BM 模式比文本长', () => {
  assert.deepEqual(boyerMooreBadChar('ab', 'abc'), []);
});

test('buildBadCharTable', () => {
  const t = buildBadCharTable('EXAMPLE');
  assert.equal(t.get('E'), 6); // 最右
  assert.equal(t.get('L'), 5);
  assert.equal(t.get('X'), 1);
  assert.equal(t.get('Z'), undefined);
});

test('BM 与 includes 对照', () => {
  const text = 'the quick brown fox jumps over the lazy dog';
  for (const pat of ['quick', 'fox', 'dog', 'cat', 'the']) {
    const bm = boyerMooreBadChar(text, pat);
    const idx = text.indexOf(pat);
    if (idx >= 0) assert.ok(bm.includes(idx), pat);
    else assert.deepEqual(bm, [], pat);
  }
});
