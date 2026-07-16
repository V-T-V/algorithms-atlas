import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InvertedIndex, tokenize } from '../../src/algorithms/design/inverted-index/impl.ts';

test('tokenize 基本分词', () => {
  assert.deepEqual(tokenize('Hello, World!'), ['hello', 'world']);
  assert.deepEqual(tokenize('the quick-brown fox'), ['the', 'quick', 'brown', 'fox']);
  assert.deepEqual(tokenize(''), []);
});

test('InvertedIndex addDocument + search', () => {
  const idx = new InvertedIndex();
  idx.addDocument('the quick brown fox');
  idx.addDocument('the lazy brown dog');
  idx.addDocument('quick fox and quick hare');

  assert.deepEqual(idx.search('the'), [0, 1]);
  assert.deepEqual(idx.search('quick'), [0, 2]);
  assert.deepEqual(idx.search('brown'), [0, 1]);
  assert.deepEqual(idx.search('dog'), [1]);
  assert.deepEqual(idx.search('cat'), []);
});

test('InvertedIndex 大小写无关', () => {
  const idx = new InvertedIndex();
  idx.addDocument('Hello World');
  assert.deepEqual(idx.search('hello'), [0]);
  assert.deepEqual(idx.search('HELLO'), [0]);
});

test('InvertedIndex searchAnd（多词与）', () => {
  const idx = new InvertedIndex();
  idx.addDocument('the quick brown fox');
  idx.addDocument('the lazy brown dog');
  idx.addDocument('quick fox and quick hare');
  // 同时含 quick 和 fox：doc 0 和 doc 2
  assert.deepEqual(idx.searchAnd(['quick', 'fox']), [0, 2]);
  // 同时含 brown 和 dog：doc 1
  assert.deepEqual(idx.searchAnd(['brown', 'dog']), [1]);
  // 无解
  assert.deepEqual(idx.searchAnd(['quick', 'dog']), []);
});

test('InvertedIndex 带位置信息', () => {
  const idx = new InvertedIndex();
  idx.addDocument('quick fox quick');
  const postings = idx.getPostings('quick');
  assert.equal(postings.length, 1);
  assert.deepEqual(postings[0]!.positions, [0, 2]);
});

test('InvertedIndex 计数', () => {
  const idx = new InvertedIndex();
  idx.addDocument('a b c');
  idx.addDocument('a b');
  assert.equal(idx.docCount(), 2);
  assert.equal(idx.termCount(), 3);
});

test('InvertedIndex searchAnd 空查询', () => {
  const idx = new InvertedIndex();
  idx.addDocument('hello world');
  assert.deepEqual(idx.searchAnd([]), []);
});
