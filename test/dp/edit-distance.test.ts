import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editDistance } from '../../src/algorithms/dp/edit-distance/impl.ts';

test('edit-distance 基本行为（空串）', () => {
  assert.equal(editDistance('', ''), 0);
  assert.equal(editDistance('abc', ''), 3);
  assert.equal(editDistance('', 'xyz'), 3);
  assert.equal(editDistance('a', 'a'), 0);
});

test('edit-distance 经典 kitten → sitting = 3', () => {
  assert.equal(editDistance('kitten', 'sitting'), 3);
});

test('edit-distance 经典 Sunday → Saturday = 3', () => {
  assert.equal(editDistance('Sunday', 'Saturday'), 3);
});

test('edit-distance 完全相同 / 完全不同', () => {
  assert.equal(editDistance('abc', 'abc'), 0);
  assert.equal(editDistance('abc', 'xyz'), 3); // 全替换
});

test('edit-distance 纯插入 / 纯删除', () => {
  // a 是 b 的前缀 → 距离 = 多出的字符数（纯插入）
  assert.equal(editDistance('abc', 'abcdef'), 3);
  assert.equal(editDistance('abcdef', 'abc'), 3);
});

test('edit-distance 单字符替换', () => {
  assert.equal(editDistance('ab', 'ac'), 1);
  assert.equal(editDistance('abcd', 'abxd'), 1);
});

test('edit-distance 大小写敏感', () => {
  assert.equal(editDistance('ABC', 'abc'), 3); // 全替换
});

test('edit-distance 中文 / 任意字符', () => {
  assert.equal(editDistance('你好世界', '你好'), 2);
  assert.equal(editDistance('你好', '你好吗'), 1);
});

test('edit-distance 对称性 dist(a,b) === dist(b,a)', () => {
  const pairs: Array<[string, string]> = [
    ['abc', 'xyz'],
    ['kitten', 'sitting'],
    ['flaw', 'lawn'],
    ['', 'abc'],
  ];
  for (const [a, b] of pairs) {
    assert.equal(editDistance(a, b), editDistance(b, a), `dist(${a},${b}) 应对称`);
  }
});

test('edit-distance 三角不等式 dist(a,c) <= dist(a,b) + dist(b,c)', () => {
  const a = 'kitten';
  const b = 'sitting';
  const c = 'kitchen';
  assert.ok(editDistance(a, c) <= editDistance(a, b) + editDistance(b, c));
});

test('edit-distance 钩子被调用', () => {
  let fills = 0;
  let matches = 0;
  let backtracks = 0;
  editDistance('abc', 'abd', {
    onFillCell: (_i, _j, _v, from) => {
      fills++;
      if (from === 'match') matches++;
    },
    onBacktrack: () => backtracks++,
  });
  // 内部格数 = m*n = 3*3 = 9
  assert.equal(fills, 9, '应填满内部 m*n 格');
  assert.ok(matches >= 2, 'abc/abd 前 2 字符应匹配');
  assert.ok(backtracks > 0, '应触发回溯');
});

test('edit-distance 回溯还原最优序列长度合理', () => {
  const ops: string[] = [];
  editDistance('kitten', 'sitting', {
    onBacktrack: (_i, _j, op) => ops.push(op),
  });
  // 非匹配操作数应等于距离 3
  const edits = ops.filter((o) => o !== 'match').length;
  assert.equal(edits, 3, `非匹配操作数应等于距离 3，实际 ${edits}`);
});
