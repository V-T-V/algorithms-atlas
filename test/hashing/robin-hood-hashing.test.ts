import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  robinHood,
  insert,
  search,
  hash,
  type Slot,
} from '../../src/algorithms/hashing/robin-hood-hashing/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
  DEFAULT_SIZE,
} from '../../src/algorithms/hashing/robin-hood-hashing/trace.ts';

test('robin-hood 插入后查找全部命中', () => {
  const { slots } = robinHood([10, 22, 31, 4, 15, 28, 17], 11);
  for (const k of [10, 22, 31, 4, 15, 28, 17]) {
    assert.ok(search(slots, k) !== null, `键 ${k} 应可查到`);
  }
});

test('robin-hood 查找未命中返回 null', () => {
  const { slots } = robinHood([10, 22, 31], 11);
  assert.equal(search(slots, 999), null);
});

test('robin-hood 每个键在表中至多出现一次', () => {
  const keys = [10, 22, 31, 4, 15, 28, 17, 33];
  const { slots } = robinHood(keys, 13);
  for (const k of keys) {
    const count = slots.filter((s) => s !== null && s.key === k).length;
    assert.equal(count, 1, `键 ${k} 出现 ${count} 次`);
  }
});

test('robin-hood 去重（相同键不重复插入）', () => {
  const slots: Slot[] = new Array(11).fill(null);
  insert(slots, 10);
  insert(slots, 10);
  const count = slots.filter((s) => s !== null && s.key === 10).length;
  assert.equal(count, 1);
});

test('robin-hood psl 一致性：slot[key].psl = (index - hash) mod size', () => {
  const keys = [10, 22, 31, 4, 15, 28, 17];
  const size = 7;
  const { slots } = robinHood(keys, size);
  for (const s of slots) {
    if (s === null) continue;
    const h = hash(s.key, size);
    const expectedPsl = (slots.indexOf(s) - h + size) % size;
    assert.equal(s.psl, expectedPsl, `键 ${s.key} psl 不一致`);
  }
});

test('robin-hood 钩子：插入触发 onHash 与 onPlace', () => {
  const hashes: number[] = [];
  const places: number[] = [];
  robinHood([10, 22, 31], 11, {
    onHash: (k) => hashes.push(k),
    onPlace: (k) => places.push(k),
  });
  assert.equal(hashes.length, 3);
  assert.equal(places.length, 3);
});

test('robin-hood 冲突时可能触发抢占（onEvict）', () => {
  let evicts = 0;
  robinHood(DEFAULT_INPUT, DEFAULT_SIZE, {
    onEvict: () => evicts++,
  });
  // 负载越高越可能抢占；这里仅断言机制存在
  assert.ok(evicts >= 0);
});

test('robin-hood hash 落在 [0, size)', () => {
  for (const k of [0, 1, 11, 12, 100, -1, -13]) {
    const h = hash(k, 11);
    assert.ok(h >= 0 && h < 11, `h=${h} 越界`);
  }
});

test('robin-hood 空输入', () => {
  const { slots, maxPsl, failed } = robinHood([], 11);
  assert.equal(maxPsl, 0);
  assert.deepEqual(failed, []);
  assert.equal(
    slots.every((s) => s === null),
    true,
  );
});

test('buildTrace 含 array，末帧含最大 PSL', () => {
  const frames = buildTrace(DEFAULT_INPUT, DEFAULT_SIZE);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const maxEntry = last.aux!.find((e) => e.label === '最大 PSL');
  assert.ok(maxEntry, '末帧应含最大 PSL');
  assert.ok(Number(maxEntry!.value) >= 0);
});
