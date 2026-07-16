import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RadixTree, trie2 } from '../../src/algorithms/ds/trie-2/impl.ts';

test('radix 插入与查找（经典 ruber/romulus 例）', () => {
  const t = trie2(['romane', 'romanus', 'romulus', 'rubens', 'ruber', 'rubicon', 'rubicundus']);
  assert.equal(t.size, 7);
  for (const k of ['romane', 'romanus', 'romulus', 'rubens', 'ruber', 'rubicon', 'rubicundus']) {
    assert.equal(t.search(k), true, `应找到 ${k}`);
  }
  // 仅前缀、非完整键
  assert.equal(t.search('rom'), false);
  assert.equal(t.search('roman'), false);
  assert.equal(t.search('ruberx'), false);
  assert.equal(t.search('xyz'), false);
});

test('radix 前缀判定', () => {
  const t = trie2(['romane', 'romanus']);
  assert.equal(t.startsWith('rom'), true);
  assert.equal(t.startsWith('roma'), true);
  assert.equal(t.startsWith('roman'), true);
  assert.equal(t.startsWith('romanus'), true);
  assert.equal(t.startsWith('romanusx'), false);
  assert.equal(t.startsWith('rub'), false);
  assert.equal(t.startsWith(''), true);
});

test('radix 重复插入不计数', () => {
  const t = new RadixTree();
  assert.equal(t.insert('cat'), true);
  assert.equal(t.insert('cat'), false);
  assert.equal(t.insert('car'), true);
  assert.equal(t.size, 2);
});

test('radix 边分裂正确（插入键在前缀处分叉）', () => {
  const t = new RadixTree();
  t.insert('abc');
  t.insert('ab'); // ab 是 abc 的前缀 → 应在分叉点标 isEnd
  assert.equal(t.search('ab'), true);
  assert.equal(t.search('abc'), true);
  assert.equal(t.size, 2);
});

test('radix 共享长前缀', () => {
  const t = trie2(['aaaa', 'aaab', 'aaac']);
  assert.equal(t.search('aaaa'), true);
  assert.equal(t.search('aaab'), true);
  assert.equal(t.search('aaac'), true);
  assert.equal(t.search('aaa'), false);
  assert.equal(t.search('aaad'), false);
});

test('radix 空串 / 空集', () => {
  const t = new RadixTree();
  assert.equal(t.size, 0);
  assert.equal(t.search('a'), false);
  assert.equal(t.startsWith('a'), false);
  assert.equal(t.insert(''), true); // 空串 → 标记根
  assert.equal(t.search(''), true);
  assert.equal(t.size, 1);
});

test('radix 钩子被调用', () => {
  let splits = 0;
  let leaves = 0;
  let results = 0;
  const t = new RadixTree();
  t.insert('abc', {
    onSplitEdge: () => splits++,
    onCreateLeaf: () => leaves++,
  });
  assert.equal(leaves, 1);
  t.insert('abd', { onSplitEdge: () => splits++, onCreateLeaf: () => leaves++ });
  assert.ok(splits >= 1, 'ab 共享后 c/d 应分裂边');
  t.search('abc', { onResult: () => results++ });
  assert.equal(results, 1);
});
