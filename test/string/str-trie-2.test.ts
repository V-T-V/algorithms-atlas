import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Trie2 } from '../../src/algorithms/string/str-trie-2/impl.ts';

test('trie 插入与查询', () => {
  const t = new Trie2();
  t.insert('apple');
  t.insert('app');
  t.insert('apply');
  assert.equal(t.contains('app'), true);
  assert.equal(t.contains('apple'), true);
  assert.equal(t.contains('ap'), false);
});

test('trie 前缀计数', () => {
  const t = new Trie2();
  t.insert('apple');
  t.insert('app');
  t.insert('apply');
  t.insert('banana');
  assert.equal(t.prefixCount('app'), 3);
  assert.equal(t.prefixCount('ban'), 1);
  assert.equal(t.prefixCount('xyz'), 0);
});
