import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SimpleTrie, buildTrie } from '../../src/algorithms/string/trie-insert-search/impl.ts';

test('trie insert + search 基本', () => {
  const t = buildTrie(['apple', 'app']);
  assert.equal(t.search('apple'), true);
  assert.equal(t.search('app'), true);
  assert.equal(t.search('ap'), false); // 不是完整词
  assert.equal(t.search('applez'), false);
});

test('trie startsWith', () => {
  const t = buildTrie(['apple', 'apt', 'bat']);
  assert.equal(t.startsWith('ap'), true);
  assert.equal(t.startsWith('app'), true);
  assert.equal(t.startsWith('b'), true);
  assert.equal(t.startsWith('c'), false);
  assert.equal(t.startsWith(''), true);
});

test('trie 空串', () => {
  const t = new SimpleTrie();
  assert.equal(t.search(''), false);
  assert.equal(t.startsWith(''), true);
  t.insert('');
  assert.equal(t.search(''), true);
});

test('trie 重复插入', () => {
  const t = buildTrie(['abc', 'abc', 'abc']);
  assert.equal(t.search('abc'), true);
  assert.equal(t.nodes.length, 4); // root + a + b + c
});

test('trie locate', () => {
  const t = buildTrie(['cat', 'car']);
  const id = t.locate('ca');
  assert.ok(id > 0);
  assert.equal(t.locate('xyz'), -1);
});

test('trie 共享前缀', () => {
  const t = buildTrie(['ab', 'ac', 'ad']);
  // root + a + b + c + d = 5
  assert.equal(t.nodes.length, 5);
  assert.equal(t.search('ab'), true);
  assert.equal(t.search('ac'), true);
  assert.equal(t.search('ad'), true);
  assert.equal(t.search('ae'), false);
});
