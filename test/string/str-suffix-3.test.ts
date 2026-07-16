import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SuffixTree3 } from '../../src/algorithms/string/str-suffix-3/impl.ts';

test('suffix tree contains', () => {
  const t = new SuffixTree3('banana');
  assert.equal(t.contains('ban'), true);
  assert.equal(t.contains('ana'), true);
  assert.equal(t.contains('na'), true);
  assert.equal(t.contains('banana'), true);
  assert.equal(t.contains('xyz'), false);
});

test('suffix tree node count', () => {
  const t = new SuffixTree3('abc');
  // 至少有根 + 3 个叶子
  assert.ok(t.nodeCount >= 4);
});
