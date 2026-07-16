import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, getRandom } from '../../src/algorithms/list/list-linked-random/impl.ts';

test('getRandom 返回链表中某个值', () => {
  const head = buildList([1, 2, 3, 4, 5]);
  const set = new Set([1, 2, 3, 4, 5]);
  for (let i = 0; i < 50; i++) {
    assert.ok(set.has(getRandom(head)));
  }
});

test('getRandom 单节点', () => {
  assert.equal(getRandom(buildList([42])), 42);
});

test('getRandom 空链表返回 NaN', () => {
  assert.ok(Number.isNaN(getRandom(buildList([]))));
});

test('getRandom 均匀性（确定性 rng 验证选择范围）', () => {
  // 用伪 rng：返回 0.0 时只在 i==1 选中，即结果恒为第 1 个
  const head = buildList([10, 20, 30]);
  const r = getRandom(head, {}, () => 0.999); // 永不替换
  assert.equal(r, 10);
});

test('getRandom 钩子', () => {
  let visits = 0;
  getRandom(buildList([1, 2, 3, 4]), { onVisit: () => visits++ });
  assert.equal(visits, 3); // 从 i=2 开始访问
});
