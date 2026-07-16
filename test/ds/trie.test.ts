import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Trie, trie } from '../../src/algorithms/ds/trie/impl.ts';

test('trie 插入与计数', () => {
  const t = new Trie();
  assert.equal(t.isEmpty(), true);
  assert.equal(t.insert('cat'), true);
  assert.equal(t.insert('car'), true);
  assert.equal(t.insert('cat'), false); // 重复
  assert.equal(t.size, 2);
  assert.equal(t.isEmpty(), false);
});

test('trie 精确查找', () => {
  const t = trie(['cat', 'car', 'card', 'care', 'dog', 'do']);
  assert.equal(t.search('cat'), true);
  assert.equal(t.search('car'), true);
  assert.equal(t.search('card'), true);
  assert.equal(t.search('care'), true);
  assert.equal(t.search('dog'), true);
  assert.equal(t.search('do'), true);
  // 仅是前缀、非完整键
  assert.equal(t.search('ca'), false);
  assert.equal(t.search('carde'), false);
  assert.equal(t.search(''), false); // 空串未插入
  assert.equal(t.search('xyz'), false);
});

test('trie 前缀判定 startsWith', () => {
  const t = trie(['cat', 'car', 'card']);
  assert.equal(t.startsWith('ca'), true);
  assert.equal(t.startsWith('car'), true);
  assert.equal(t.startsWith('card'), true);
  assert.equal(t.startsWith('cards'), false);
  assert.equal(t.startsWith('d'), false);
  assert.equal(t.startsWith(''), true); // 空前缀恒成立
});

test('trie 空集合 / 空串', () => {
  const t = trie([]);
  assert.equal(t.size, 0);
  assert.equal(t.search('a'), false);
  assert.equal(t.startsWith('a'), false);
  // 插入空串
  assert.equal(t.insert(''), true);
  assert.equal(t.search(''), true);
  assert.equal(t.insert(''), false);
  assert.equal(t.size, 1);
});

test('trie 中文字符（任意字符）', () => {
  const t = trie(['你好', '你好世界', '再见']);
  assert.equal(t.search('你好'), true);
  assert.equal(t.search('你好世界'), true);
  assert.equal(t.startsWith('你好'), true);
  assert.equal(t.search('再见'), true);
  assert.equal(t.search('你'), false);
});

test('trie 钩子被调用', () => {
  let creates = 0;
  let marks = 0;
  let compares = 0;
  let results = 0;
  const t = new Trie();
  t.insert('cat', {
    onCreate: () => creates++,
    onMarkEnd: () => marks++,
    onStep: () => {},
  });
  assert.ok(creates >= 3, '插入 cat 应新建 3 个节点');
  assert.equal(marks, 1);
  t.insert('car', {
    onCreate: () => creates++,
  });
  // cat 已建 c,a；car 只需新建 r
  // 累计 creates 应为 3(cat) + 1(r) = 4
  assert.equal(creates, 4);
  t.search('car', {
    onCompare: () => compares++,
    onResult: () => results++,
  });
  assert.ok(compares > 0, '查找应触发比较');
  assert.equal(results, 1);
});

test('trie 钩子：查找未命中也回调 onResult', () => {
  let okVal = true;
  let called = 0;
  const t = trie(['cat']);
  t.search('xyz', {
    onResult: (_k, _key, ok) => {
      called++;
      okVal = ok;
    },
  });
  assert.equal(called, 1);
  assert.equal(okVal, false);
});
