import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trieString, StringTrie } from '../../src/algorithms/string/trie-string/impl.ts';

test('trieString 插入与查找', () => {
  const trie = trieString(['apple', 'app', 'april', 'banana']);
  assert.equal(trie.contains('app'), true);
  assert.equal(trie.contains('apple'), true);
  assert.equal(trie.contains('april'), true);
  assert.equal(trie.contains('banana'), true);
  assert.equal(trie.contains('ap'), false);
  assert.equal(trie.contains('apricot'), false);
  assert.equal(trie.contains('xyz'), false);
});

test('trieString 前缀枚举', () => {
  const trie = trieString(['app', 'apple', 'application', 'apply', 'banana']);
  const apps = trie.startsWith('app');
  assert.deepEqual(apps, ['app', 'appl' + 'e', 'appl' + 'ication', 'appl' + 'y']);
  assert.deepEqual(trie.startsWith('ban'), ['banana']);
  assert.deepEqual(trie.startsWith('xyz'), []);
  assert.deepEqual(trie.startsWith(''), ['app', 'apple', 'application', 'apply', 'banana']);
});

test('trieString 前缀计数', () => {
  const trie = trieString(['app', 'apple', 'apply', 'banana']);
  assert.equal(trie.countPrefix('app'), 3); // app, apple, apply
  assert.equal(trie.countPrefix('ap'), 3);
  assert.equal(trie.countPrefix('ban'), 1);
  assert.equal(trie.countPrefix('xyz'), 0);
});

test('trieString 钩子被调用', () => {
  let edges = 0;
  let marks = 0;
  trieString(['ab', 'ac'], {
    onCreateEdge: () => edges++,
    onMarkEnd: () => marks++,
  });
  assert.equal(edges, 3); // a, b, c
  assert.equal(marks, 2);
});

test('StringTrie 直接使用', () => {
  const trie = new StringTrie();
  trie.insert('hello');
  trie.insert('help');
  assert.equal(trie.contains('hello'), true);
  assert.equal(trie.contains('hel'), false);
  assert.deepEqual(trie.startsWith('hel'), ['hello', 'help']);
});
