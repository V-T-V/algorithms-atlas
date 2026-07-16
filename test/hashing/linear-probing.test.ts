import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LinearProbing,
  linearProbing,
  hashKey,
} from '../../src/algorithms/hashing/linear-probing/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/linear-probing/trace.ts';

test('linear-probing 基本插入无冲突', () => {
  // size=7: 1→1, 2→2, 5→5 全无冲突
  const t = linearProbing([1, 2, 5], 7);
  assert.deepEqual(t.slots, [null, 1, 2, null, null, 5, null]);
});

test('linear-probing 冲突时线性探测', () => {
  // 10%7=3, 22%7=1, 31%7=3 冲突 → 探测到 4
  const t = linearProbing([10, 22, 31], 7);
  assert.equal(t.slots[3], 10);
  assert.equal(t.slots[1], 22);
  assert.equal(t.slots[4], 31);
});

test('linear-probing 连续聚集', () => {
  // 3%7=3, 10%7=3 冲突→4, 17%7=3 冲突→4冲突→5
  const t = linearProbing([3, 10, 17], 7);
  assert.deepEqual(t.slots, [null, null, null, 3, 10, 17, null]);
});

test('linear-probing 查找命中与未命中', () => {
  const t = linearProbing([10, 22, 31], 7);
  assert.equal(t.search(10), 3);
  assert.equal(t.search(31), 4);
  assert.equal(t.search(99), -1);
});

test('linear-probing 去重（相同键不重复插入）', () => {
  const t = new LinearProbing(7);
  t.insert(10);
  t.insert(10);
  const count = t.slots.filter((s) => s === 10).length;
  assert.equal(count, 1);
});

test('linear-probing 表满返回 -1', () => {
  const t = new LinearProbing(3);
  assert.equal(t.insert(0), 0);
  assert.equal(t.insert(1), 1);
  assert.equal(t.insert(2), 2);
  assert.equal(t.insert(3), -1); // 表满
});

test('linear-probing hashKey 一致性', () => {
  for (const k of [0, 1, 7, 8, 15, -1]) {
    assert.ok(hashKey(k, 7) >= 0 && hashKey(k, 7) < 7);
  }
  assert.equal(hashKey(10, 7), 3);
});

test('linear-probing 钩子被调用', () => {
  let hashes = 0;
  let probes = 0;
  let inserts = 0;
  let collisions = 0;
  linearProbing([10, 31], 7, {
    onHash: () => hashes++,
    onProbe: () => probes++,
    onInsert: () => inserts++,
    onCollision: () => collisions++,
  });
  assert.equal(hashes, 2);
  assert.equal(inserts, 2);
  // 10 落 3，31 hash=3 冲突 → 探测 4 落位：至少 1 次冲突
  assert.ok(collisions >= 1, '应至少 1 次冲突');
  assert.ok(probes >= 2);
});

test('buildTrace 生成 array 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4);
  // 每帧都应有 array
  for (const f of frames) assert.ok(f.array, '每帧应有 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.array!.values.length === 7);
});
