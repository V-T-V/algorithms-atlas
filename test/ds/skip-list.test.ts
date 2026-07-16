import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SkipList, skipList, type SkipListHooks } from '../../src/algorithms/ds/skip-list/impl.ts';

test('skipList 批量插入后升序去重', () => {
  assert.deepEqual(skipList([5, 2, 8, 1, 9, 3]), [1, 2, 3, 5, 8, 9]);
  assert.deepEqual(skipList([3, 1, 2, 1, 3]), [1, 2, 3]); // 去重
  assert.deepEqual(skipList([]), []);
  assert.deepEqual(skipList([42]), [42]);
});

test('SkipList 查找命中 / 未命中', () => {
  const sl = new SkipList({ seed: 1 });
  for (const v of [10, 5, 20, 15, 8]) sl.insert(v);
  assert.equal(sl.search(8), true);
  assert.equal(sl.search(15), true);
  assert.equal(sl.search(7), false); // 不存在
  assert.equal(sl.search(21), false);
});

test('SkipList 重复插入不增加计数', () => {
  const sl = new SkipList({ seed: 1 });
  assert.equal(sl.insert(5), true);
  assert.equal(sl.insert(5), false); // 已存在
  assert.equal(sl.insert(5), false);
  assert.equal(sl.size, 1);
});

test('SkipList 删除', () => {
  const sl = new SkipList({ seed: 2 });
  for (const v of [10, 5, 20, 15, 8, 1]) sl.insert(v);
  assert.equal(sl.delete(8), true);
  assert.equal(sl.search(8), false);
  assert.deepEqual(sl.toArray(), [1, 5, 10, 15, 20]);
  assert.equal(sl.delete(999), false); // 不存在
  assert.equal(sl.size, 5);
});

test('SkipList 删除后仍保持有序与查找正确', () => {
  const sl = new SkipList({ seed: 3 });
  for (const v of [7, 3, 9, 1, 5, 8, 2]) sl.insert(v);
  // 删到只剩一个
  for (const v of [3, 9, 1, 5, 8, 2]) sl.delete(v);
  assert.deepEqual(sl.toArray(), [7]);
  assert.equal(sl.size, 1);
});

test('SkipList 钩子被调用（插入触发 onInsert/onCompare）', () => {
  const inserted: Array<{ v: number; levels: number }> = [];
  let compares = 0;
  const hooks: SkipListHooks = {
    onInsert: (value, levels) => inserted.push({ v: value, levels }),
    onCompare: () => compares++,
  };
  const sl = new SkipList({ seed: 1 });
  for (const v of [5, 2, 8, 1]) sl.insert(v, hooks);
  assert.equal(inserted.length, 4);
  assert.deepEqual(
    inserted.map((x) => x.v),
    [5, 2, 8, 1],
  );
  assert.ok(compares > 0, '应发生比较');
});

test('SkipList 固定种子结果可复现', () => {
  const a = new SkipList({ seed: 7 });
  const b = new SkipList({ seed: 7 });
  for (const v of [5, 2, 8, 1, 9, 3, 7, 4, 6]) {
    a.insert(v);
    b.insert(v);
  }
  // 同种子同序列 → 结构一致（层数分布一致）
  assert.deepEqual(a.toArray(), b.toArray());
  // 层数（最高已用层）应一致
  let aTop = a.head.forward.length - 1;
  while (aTop > 0 && a.head.forward[aTop] === null) aTop--;
  let bTop = b.head.forward.length - 1;
  while (bTop > 0 && b.head.forward[bTop] === null) bTop--;
  assert.equal(aTop, bTop);
});

test('SkipList 顺序插入大量元素仍可查找（对数期望）', () => {
  const sl = new SkipList({ seed: 11 });
  for (let i = 0; i < 100; i++) sl.insert(i);
  assert.equal(sl.size, 100);
  for (let i = 0; i < 100; i += 7) assert.equal(sl.search(i), true);
  assert.equal(sl.search(100), false);
  assert.equal(sl.search(-1), false);
});
