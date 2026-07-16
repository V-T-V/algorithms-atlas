import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hopscotch,
  insert,
  search,
  hash,
  DEFAULT_H,
} from '../../src/algorithms/hashing/hopscotch-hashing/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
  DEFAULT_SIZE,
} from '../../src/algorithms/hashing/hopscotch-hashing/trace.ts';

test('hopscotch 插入后查找全部命中', () => {
  const { slots, bitmap } = hopscotch([10, 22, 31, 4, 15], 11, DEFAULT_H);
  for (const k of [10, 22, 31, 4, 15]) {
    assert.ok(search(slots, bitmap, DEFAULT_H, k) !== null, `键 ${k} 应可查到`);
  }
});

test('hopscotch 查找未命中返回 null', () => {
  const { slots, bitmap } = hopscotch([10, 22, 31], 11, DEFAULT_H);
  assert.equal(search(slots, bitmap, DEFAULT_H, 999), null);
});

test('hopscotch 邻域约束：每个键落在 home 窗口内', () => {
  const keys = [10, 22, 31, 4, 15, 28];
  const size = 13;
  const H = DEFAULT_H;
  const { slots, failed } = hopscotch(keys, size, H);
  for (const s of slots) {
    if (s === null) continue;
    const h = hash(s.key, size);
    const offset = (slots.indexOf(s) - h + size) % size;
    assert.ok(offset < H, `键 ${s.key} 在 ${offset} 处，超出窗口 H=${H}`);
  }
  // 成功插入的键数 = 输入 - 失败
  assert.equal(failed.length, keys.length - slots.filter((s) => s !== null).length);
});

test('hopscotch 每个键在表中至多出现一次', () => {
  const keys = [10, 22, 31, 4, 15, 28, 17];
  const { slots } = hopscotch(keys, 17, DEFAULT_H);
  for (const k of keys) {
    const count = slots.filter((s) => s !== null && s.key === k).length;
    assert.ok(count <= 1, `键 ${k} 出现 ${count} 次`);
  }
});

test('hopscotch 去重（相同键不重复插入）', () => {
  const slots: Array<{ key: number; home: number } | null> = new Array(11).fill(null);
  const bitmap: number[] = new Array(11).fill(0);
  insert(slots, bitmap, DEFAULT_H, 10);
  insert(slots, bitmap, DEFAULT_H, 10);
  const count = slots.filter((s) => s !== null && s.key === 10).length;
  assert.equal(count, 1);
});

test('hopscotch 钩子：插入触发 onHash 与 onPlace（成功时）', () => {
  const hashes: number[] = [];
  const places: number[] = [];
  hopscotch([10, 22, 31], 11, DEFAULT_H, {
    onHash: (k) => hashes.push(k),
    onPlace: (k) => places.push(k),
  });
  assert.equal(hashes.length, 3);
  // 这组数据应能全部成功
  assert.equal(places.length, 3);
});

test('hopscotch hash 落在 [0, size)', () => {
  for (const k of [0, 1, 11, 12, 100, -1, -13]) {
    const h = hash(k, 11);
    assert.ok(h >= 0 && h < 11, `h=${h} 越界`);
  }
});

test('hopscotch 空输入', () => {
  const { slots, failed } = hopscotch([], 11, DEFAULT_H);
  assert.deepEqual(failed, []);
  assert.equal(
    slots.every((s) => s === null),
    true,
  );
});

test('hopscotch 较大邻域 H=8 插入更多键', () => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const size = 16;
  const H = 8;
  const { slots, bitmap, failed } = hopscotch(keys, size, H);
  for (const k of keys) {
    if (!failed.includes(k)) {
      assert.ok(search(slots, bitmap, H, k) !== null, `键 ${k} 应可查`);
    }
  }
});

test('buildTrace 含 array 与 aux，末帧含已插入数', () => {
  const frames = buildTrace(DEFAULT_INPUT, DEFAULT_SIZE);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const ins = last.aux!.find((e) => e.label === '已插入');
  assert.ok(ins, '末帧应含已插入数');
  assert.ok(Number(ins!.value) >= 0);
});
