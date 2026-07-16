import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DoubleHashing,
  doubleHashing,
  hash1,
  hash2,
} from '../../src/algorithms/hashing/double-hashing/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/double-hashing/trace.ts';

test('double-hashing 基本插入无冲突', () => {
  // size=7: 1→1, 2→2 全无冲突
  const t = doubleHashing([1, 2], 7);
  assert.equal(t.slots[1], 1);
  assert.equal(t.slots[2], 2);
});

test('double-hashing 冲突时按 h2 步长探测', () => {
  // size=7: 10%7=3, 31%7=3 冲突 → 步长 h2(31)
  //   h2(31) = 1 + (31 % 6) = 1 + 1 = 2 → 探测 (3 + 2) % 7 = 5
  const t = doubleHashing([10, 31], 7);
  assert.equal(t.slots[3], 10);
  assert.equal(t.slots[5], 31); // (3 + 1*2) % 7 = 5
});

test('double-hashing 与线性/二次布局不同', () => {
  // 二次探测中 17 会落到 (3+4)%7=0；这里看双重哈希
  // h1(17)=17%7=3, h2(17)=1+(17%6)=1+5=6 → 探测 (3+6)%7=2
  const t = doubleHashing([10, 31, 17], 7);
  assert.equal(t.slots[3], 10);
  assert.equal(t.slots[5], 31);
  assert.equal(t.slots[2], 17); // (3 + 6) % 7 = 2
});

test('double-hashing h2 始终 >=1 且 < size', () => {
  for (const k of [0, 1, 7, 8, 15, 31, 100, -1]) {
    const h = hash2(k, 7);
    assert.ok(h >= 1 && h < 7, `h2(${k})=${h} 应在 [1,7)`);
  }
});

test('double-hashing h1 一致性', () => {
  for (const k of [0, 1, 7, 8, 15, -1]) {
    assert.ok(hash1(k, 7) >= 0 && hash1(k, 7) < 7);
  }
  assert.equal(hash1(10, 7), 3);
});

test('double-hashing 查找命中与未命中', () => {
  const t = doubleHashing([10, 31], 7);
  assert.equal(t.search(10), 3);
  assert.equal(t.search(31), 5);
  assert.equal(t.search(99), -1);
});

test('double-hashing 去重', () => {
  const t = new DoubleHashing(7);
  t.insert(10);
  t.insert(10);
  const count = t.slots.filter((s) => s === 10).length;
  assert.equal(count, 1);
});

test('double-hashing 钩子被调用', () => {
  let hashes = 0;
  let probes = 0;
  let inserts = 0;
  doubleHashing([10, 31], 7, {
    onHash: () => hashes++,
    onProbe: () => probes++,
    onInsert: () => inserts++,
  });
  assert.equal(hashes, 2);
  assert.equal(inserts, 2);
  assert.ok(probes >= 2);
});

test('double-hashing 探测路径不重合', () => {
  // key=31 size=7 h1=3 h2=2: 探测序列 3,5,0,2,4,6,1 (覆盖全表，无重复)
  const t = new DoubleHashing(7);
  const probes: number[] = [];
  t.insert(31, {
    onProbe: (_i, slot) => probes.push(slot),
  });
  // 每个槽应唯一（无重复探测）
  const unique = new Set(probes);
  assert.equal(unique.size, probes.length, '探测序列无重复');
  assert.equal(t.slots[3], 31); // i=0 落位
});

test('buildTrace 生成 array 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4);
  for (const f of frames) assert.ok(f.array);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array!.values.length === 7);
});
