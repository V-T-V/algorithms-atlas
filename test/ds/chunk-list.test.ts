import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ChunkList, chunkList } from '../../src/algorithms/ds/chunk-list/impl.ts';

test('chunk-list 插入保持序列', () => {
  const cl = new ChunkList([1, 2, 3, 4, 5]);
  cl.insert(0, 0); // 头
  cl.insert(6, 6); // 尾
  cl.insert(3, 99); // 中
  assert.deepEqual(cl.toArray(), [0, 1, 2, 99, 3, 4, 5, 6]);
});

test('chunk-list 删除', () => {
  const cl = new ChunkList([10, 20, 30, 40, 50]);
  assert.equal(cl.erase(0), 10);
  assert.equal(cl.erase(3), 50);
  assert.equal(cl.erase(1), 30);
  assert.deepEqual(cl.toArray(), [20, 40]);
  assert.equal(cl.erase(100), undefined); // 越界
});

test('chunk-list 大量插入触发分裂', () => {
  const cl = new ChunkList([]);
  // 空表不断插入应能正确增长且块数合理
  for (let i = 0; i < 50; i++) cl.insert(cl.size(), i);
  assert.equal(cl.size(), 50);
  assert.deepEqual(
    cl.toArray(),
    Array.from({ length: 50 }, (_, i) => i),
  );
  // 块数应 > 1
  assert.ok(cl.blockCount() > 1, '应分裂出多块');
});

test('chunk-list at 随机访问', () => {
  const cl = new ChunkList([5, 4, 3, 2, 1, 0]);
  assert.equal(cl.at(0), 5);
  assert.equal(cl.at(5), 0);
  assert.equal(cl.at(3), 2);
  assert.equal(cl.at(6), undefined);
});

test('chunk-list 插入删除交替正确', () => {
  const cl = new ChunkList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  cl.insert(5, 500);
  cl.erase(2);
  cl.insert(0, -1);
  cl.erase(cl.size() - 1);
  // 模拟：[1,2,3,4,5,6,7,8,9,10] -> insert 5:500 -> [1,2,3,4,5,500,6,7,8,9,10]
  //  -> erase 2 -> [1,2,4,5,500,6,7,8,9,10] -> insert 0:-1 -> [-1,1,2,4,5,500,6,7,8,9,10]
  //  -> erase last -> [-1,1,2,4,5,500,6,7,8,9]
  assert.deepEqual(cl.toArray(), [-1, 1, 2, 4, 5, 500, 6, 7, 8, 9]);
});

test('chunkList 便利函数', () => {
  const out = chunkList({
    values: [1, 2, 3],
    ops: [
      { op: 'insert', pos: 1, v: 9 },
      { op: 'push', v: 7 },
      { op: 'erase', pos: 0 },
    ],
  });
  // [1,2,3] -> insert 9@1 -> [1,9,2,3] -> push 7 -> [1,9,2,3,7] -> erase 0 -> [9,2,3,7]
  assert.deepEqual(out, [9, 2, 3, 7]);
});

test('chunk-list 钩子被调用', () => {
  let visits = 0;
  let mods = 0;
  let splits = 0;
  const cl = new ChunkList(
    Array.from({ length: 16 }, (_, i) => i),
    {},
  );
  cl.insert(3, 100, {
    onVisitBlock: () => visits++,
    onModify: () => mods++,
    onSplit: () => splits++,
  });
  assert.ok(visits > 0, '定位应访问块');
  assert.ok(mods >= 1, '应改动块');
});

test('chunk-list 删除触发合并', () => {
  let merges = 0;
  const cl = new ChunkList(Array.from({ length: 16 }, (_, i) => i));
  // 不断删除使其触发合并
  for (let i = 0; i < 12; i++) cl.erase(0, { onMerge: () => merges++ });
  assert.deepEqual(cl.toArray(), [12, 13, 14, 15]);
  assert.ok(merges >= 1, '应触发合并');
});
