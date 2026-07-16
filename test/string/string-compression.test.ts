import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stringCompression,
  decompress,
} from '../../src/algorithms/string/string-compression/impl.ts';

test('stringCompression 基本', () => {
  assert.equal(stringCompression('aabcccccaaa'), 'a2b1c5a3');
  assert.equal(stringCompression('abc'), 'a1b1c1');
  assert.equal(stringCompression('aaaa'), 'a4');
  assert.equal(stringCompression(''), '');
  assert.equal(stringCompression('a'), 'a1');
});

test('stringCompression 可逆', () => {
  for (const s of ['aabcccccaaa', 'abc', 'aaaa', 'aabbcc']) {
    assert.equal(decompress(stringCompression(s)), s, s);
  }
});

test('stringCompression 钩子', () => {
  let segs = 0;
  stringCompression('aabcccccaaa', { onSegment: () => segs++ });
  assert.equal(segs, 4); // a, b, c, a
});
