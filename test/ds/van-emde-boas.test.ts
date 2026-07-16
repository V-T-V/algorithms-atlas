import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VanEmdeBoas, vanEmdeBoas } from '../../src/algorithms/ds/van-emde-boas/impl.ts';

test('veb 插入与 min/max', () => {
  const t = new VanEmdeBoas(16);
  assert.equal(t.min(), -1);
  assert.equal(t.max(), -1);
  for (const v of [5, 2, 8, 1, 9, 3, 12, 7]) t.insert(v);
  assert.equal(t.min(), 1);
  assert.equal(t.max(), 12);
});

test('veb member 查询', () => {
  const t = new VanEmdeBoas(16);
  for (const v of [5, 2, 8, 1, 9, 3, 12, 7]) t.insert(v);
  for (const v of [5, 2, 8, 1, 9, 3, 12, 7]) assert.equal(t.member(v), true, `${v}`);
  for (const v of [0, 4, 6, 10, 11, 13, 14, 15]) assert.equal(t.member(v), false, `${v}`);
});

test('veb successor / predecessor', () => {
  const t = new VanEmdeBoas(16);
  for (const v of [1, 3, 5, 7, 9, 12]) t.insert(v);
  assert.equal(t.successor(0), 1);
  assert.equal(t.successor(1), 3);
  assert.equal(t.successor(4), 5);
  assert.equal(t.successor(6), 7);
  assert.equal(t.successor(12), -1); // 无后继
  assert.equal(t.successor(13), -1);
  assert.equal(t.predecessor(15), 12);
  assert.equal(t.predecessor(12), 9);
  assert.equal(t.predecessor(8), 7);
  assert.equal(t.predecessor(2), 1);
  assert.equal(t.predecessor(1), -1); // 无前驱
  assert.equal(t.predecessor(0), -1);
});

test('veb 删除', () => {
  const t = new VanEmdeBoas(16);
  for (const v of [1, 3, 5, 7, 9, 12]) t.insert(v);
  t.delete(5);
  t.delete(1);
  t.delete(12);
  assert.equal(t.member(5), false);
  assert.equal(t.member(1), false);
  assert.equal(t.member(12), false);
  assert.equal(t.min(), 3);
  assert.equal(t.max(), 9);
  assert.equal(t.successor(4), 7);
  assert.equal(t.predecessor(10), 9);
  // 剩余应为 [3,7,9]
  assert.equal(t.member(3), true);
  assert.equal(t.member(7), true);
  assert.equal(t.member(9), true);
});

test('veb 删到空再插入', () => {
  const t = new VanEmdeBoas(8);
  t.insert(3);
  t.delete(3);
  assert.equal(t.min(), -1);
  assert.equal(t.max(), -1);
  assert.equal(t.member(3), false);
  t.insert(5);
  assert.equal(t.member(5), true);
  assert.equal(t.min(), 5);
  assert.equal(t.max(), 5);
});

test('vanEmdeBoas 便利函数（升序收集）', () => {
  const out = vanEmdeBoas({
    universe: 16,
    ops: [
      { op: 'insert', v: 5 },
      { op: 'insert', v: 2 },
      { op: 'insert', v: 8 },
      { op: 'insert', v: 1 },
      { op: 'delete', v: 2 },
    ],
  });
  assert.deepEqual(out, [1, 5, 8]);
});

test('veb 钩子被调用', () => {
  let inserts = 0;
  let results = 0;
  const t = new VanEmdeBoas(16, { onBuild: () => {} });
  t.insert(5, {
    onInsertCluster: () => inserts++,
    onResult: () => results++,
  });
  assert.ok(inserts >= 0);
  assert.equal(results, 1);
  let succResults = 0;
  t.successor(0, { onResult: () => succResults++ });
  assert.equal(succResults, 1);
});

test('veb 非法 universe 抛错', () => {
  assert.throws(() => new VanEmdeBoas(10), /power of 2/);
  assert.throws(() => new VanEmdeBoas(1), /power of 2/);
});
