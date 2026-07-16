import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  wordSearch2,
  createTrie,
  insertWord,
  type WordSearch2Hooks,
} from '../../src/algorithms/backtracking/word-search-2/impl.ts';

test('word-search-2 经典例子', () => {
  const board = [
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v'],
  ];
  const words = ['oath', 'pea', 'eat', 'rain'];
  const got = wordSearch2(board, words).sort();
  assert.deepEqual(got, ['eat', 'oath']);
});

test('word-search-2 单个单词', () => {
  const board = [
    ['a', 'b'],
    ['c', 'd'],
  ];
  // abdc: a(0,0)->b(0,1)->d(1,1)->c(1,0) 相邻可达
  assert.deepEqual(wordSearch2(board, ['abdc']).sort(), ['abdc']);
});

test('word-search-2 不存在', () => {
  const board = [['a', 'a']];
  assert.deepEqual(wordSearch2(board, ['bbb']), []);
});

test('word-search-2 去重（词典重复）', () => {
  const board = [['a', 'a']];
  const got = wordSearch2(board, ['a', 'a', 'aa']);
  assert.deepEqual([...new Set(got)].sort(), got.sort());
  assert.ok(got.includes('aa'));
});

test('word-search-2 共享前缀', () => {
  const board = [
    ['a', 'b'],
    ['c', 'd'],
  ];
  // ab: a(0,0)->b(0,1) ✓; ac: a(0,0)->c(1,0) ✓; abdc: a->b->d->c ✓
  // abcd: a->b 后需 c，但 b(0,1) 与 c(1,0) 不相邻（对角）→ ✗
  const got = wordSearch2(board, ['ab', 'ac', 'abcd', 'abdc']).sort();
  assert.deepEqual(got, ['ab', 'abdc', 'ac']);
});

test('word-search-2 空输入', () => {
  assert.deepEqual(wordSearch2([], ['a']), []);
  assert.deepEqual(wordSearch2([['a']], []), []);
});

test('word-search-2 Trie 插入/查询', () => {
  const root = createTrie();
  insertWord(root, 'cat');
  insertWord(root, 'car');
  assert.equal(root.children.get('c')!.children.get('a')!.children.get('t')!.word, 'cat');
  assert.equal(root.children.get('c')!.children.get('a')!.children.get('r')!.word, 'car');
  assert.equal(root.children.get('c')!.children.get('a')!.children.get('x'), undefined);
});

test('word-search-2 同一单元格不重复使用', () => {
  // 'aaa' 不可能在 [['a','b']] 上构成（需要两个相邻 a）
  const board = [['a', 'b']];
  assert.deepEqual(wordSearch2(board, ['aa']), []);
  // 但 'a' 可以
  assert.deepEqual(wordSearch2(board, ['a']), ['a']);
});

test('word-search-2 钩子被调用', () => {
  let visits = 0;
  let founds = 0;
  const hooks: WordSearch2Hooks = {
    onVisit: () => visits++,
    onFound: () => founds++,
  };
  wordSearch2(
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
    ['ab'],
    hooks,
  );
  assert.ok(visits > 0);
  assert.equal(founds, 1);
});
