import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SuffixTree, suffixTree } from '../../src/algorithms/ds/suffix-tree/impl.ts';

test('suffix-tree 子串匹配', () => {
  const st = new SuffixTree('banana');
  assert.equal(st.contains('banana'), true);
  assert.equal(st.contains('ban'), true);
  assert.equal(st.contains('ana'), true);
  assert.equal(st.contains('na'), true);
  assert.equal(st.contains('a'), true);
  assert.equal(st.contains('nana'), true);
  assert.equal(st.contains('xyz'), false);
  assert.equal(st.contains('bananas'), false);
  assert.equal(st.contains('ab'), false);
});

test('suffix-tree 出现位置', () => {
  const st = new SuffixTree('banana');
  // banana: ana 出现在下标 1 和 3
  assert.deepEqual(st.occurrences('ana'), [1, 3]);
  assert.deepEqual(st.occurrences('a'), [1, 3, 5]);
  assert.deepEqual(st.occurrences('na'), [2, 4]);
  assert.deepEqual(st.occurrences('banana'), [0]);
  assert.deepEqual(st.occurrences('xyz'), []);
});

test('suffix-tree 重复字符', () => {
  const st = new SuffixTree('aaaa');
  assert.equal(st.contains('aaa'), true);
  assert.deepEqual(
    st.occurrences('aa').sort((a, b) => a - b),
    [0, 1, 2],
  );
});

test('suffix-tree 自动补哨兵', () => {
  const st = new SuffixTree('abc');
  assert.equal(st.contains('abc'), true);
  assert.equal(st.contains('ab'), true);
  assert.equal(st.contains('abcd'), false);
  // 已含哨兵则不重复补
  const st2 = new SuffixTree('abc$');
  assert.equal(st2.contains('abc'), true);
});

test('suffixTree 便利函数批量匹配', () => {
  const out = suffixTree({ text: 'mississippi', patterns: ['iss', 'ssi', 'xyz', 'ippi'] });
  assert.deepEqual(out, [true, true, false, true]);
});

test('suffix-tree 钩子被调用', () => {
  let inserts = 0;
  let built = 0;
  let searches = 0;
  const st = new SuffixTree('banana', {
    onInsertSuffix: () => inserts++,
    onBuilt: () => built++,
  });
  assert.ok(inserts >= 6, '应插入每个后缀');
  assert.equal(built, 1);
  st.contains('ana', { onSearch: () => searches++ });
  assert.equal(searches, 1);
});
