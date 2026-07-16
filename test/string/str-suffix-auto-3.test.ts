import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SuffixAutomaton3 } from '../../src/algorithms/string/str-suffix-auto-3/impl.ts';

test('sam 子串查询', () => {
  const sam = new SuffixAutomaton3('abcbc');
  assert.equal(sam.contains('bc'), true);
  assert.equal(sam.contains('abc'), true);
  assert.equal(sam.contains('cbc'), true);
  assert.equal(sam.contains('xyz'), false);
});

test('sam 状态数 <= 2n', () => {
  const s = 'abcbc';
  const sam = new SuffixAutomaton3(s);
  assert.ok(sam.size <= 2 * s.length + 1);
});
