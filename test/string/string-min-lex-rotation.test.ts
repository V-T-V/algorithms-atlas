import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minLexRotation,
  minLexRotated,
} from '../../src/algorithms/string/string-min-lex-rotation/impl.ts';

test('minLexRotation baca', () => {
  // 旋转：baca, acab, caba, abac → 最小是 abac（"ab" < "ac"），k=3
  assert.equal(minLexRotation('baca'), 3);
  assert.equal(minLexRotated('baca'), 'abac');
});

test('minLexRotation 已最小', () => {
  assert.equal(minLexRotation('abcd'), 0);
  assert.equal(minLexRotated('abcd'), 'abcd');
});

test('minLexRotation 全相同', () => {
  assert.equal(minLexRotation('aaaa'), 0);
  assert.equal(minLexRotated('aaaa'), 'aaaa');
});

test('minLexRotation 单字符', () => {
  assert.equal(minLexRotation('a'), 0);
  assert.equal(minLexRotated('a'), 'a');
});

test('minLexRotation 空串', () => {
  assert.equal(minLexRotation(''), 0);
  assert.equal(minLexRotated(''), '');
});

test('minLexRotation 与朴素对照', () => {
  const naive = (s: string): number => {
    if (s.length === 0) return 0;
    let best = 0;
    for (let k = 1; k < s.length; k++) {
      const cand = s.slice(k) + s.slice(0, k);
      const cur = s.slice(best) + s.slice(0, best);
      if (cand < cur) best = k;
    }
    return best;
  };
  for (const s of ['cba', 'dcba', 'banana', 'foobar', 'mississippi', 'ababab', 'zzzabc']) {
    assert.equal(minLexRotated(s), s.slice(naive(s)) + s.slice(0, naive(s)), s);
  }
});

test('minLexRotation cba', () => {
  // 旋转：cba, bac, acb → 最小 acb，k=2
  assert.equal(minLexRotation('cba'), 2);
  assert.equal(minLexRotated('cba'), 'acb');
});
