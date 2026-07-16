import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  openAddressing,
  insert,
  search,
  createTable,
  hashKey,
} from '../../src/algorithms/hashing/open-addressing/impl.ts';

test('open-addressing 基本插入无冲突', () => {
  const t = openAddressing([3, 10, 17], 7); // 3%7=3, 10%7=3 冲突
  // 3→3, 10→3冲突→4, 17→3冲突→4冲突→5
  assert.deepEqual(t.slots, [null, null, null, 3, 10, 17, null]);
});

test('open-addressing 冲突时线性探测', () => {
  // 10%7=3, 22%7=1, 31%7=3冲突→4
  const t = openAddressing([10, 22, 31], 7);
  assert.equal(t.slots[3], 10);
  assert.equal(t.slots[1], 22);
  assert.equal(t.slots[4], 31);
});

test('open-addressing 查找命中与未命中', () => {
  const t = openAddressing([10, 22, 31], 7);
  assert.equal(search(t, 10), 3);
  assert.equal(search(t, 31), 4);
  assert.equal(search(t, 99), -1);
});

test('open-addressing 去重（相同键不重复插入）', () => {
  const t = createTable(7);
  insert(t, 10);
  insert(t, 10); // 重复
  const count = t.slots.filter((s) => s === 10).length;
  assert.equal(count, 1);
});

test('open-addressing hashKey 一致性', () => {
  for (const k of [0, 1, 7, 8, 15, -1]) {
    assert.ok(hashKey(k, 7) >= 0 && hashKey(k, 7) < 7);
  }
  assert.equal(hashKey(10, 7), 3);
});

test('open-addressing 钩子被调用', () => {
  let hashes = 0;
  let probes = 0;
  let inserts = 0;
  openAddressing([10, 22, 31], 7, {
    onHash: () => hashes++,
    onProbe: () => probes++,
    onInsert: () => inserts++,
  });
  assert.equal(hashes, 3);
  assert.equal(inserts, 3);
  assert.ok(probes >= 3, '至少探测 3 次');
});
