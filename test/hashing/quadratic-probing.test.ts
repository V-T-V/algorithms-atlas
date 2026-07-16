import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  QuadraticProbing,
  quadraticProbing,
  hashKey,
} from '../../src/algorithms/hashing/quadratic-probing/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/quadratic-probing/trace.ts';

test('quadratic-probing 基本插入无冲突', () => {
  // size=11: 1→1, 2→2 全无冲突
  const t = quadraticProbing([1, 2], 11);
  assert.equal(t.slots[1], 1);
  assert.equal(t.slots[2], 2);
});

test('quadratic-probing 冲突时 i² 探测', () => {
  // size=7: 10%7=3, 31%7=3 冲突 → +1² → 槽4
  const t = quadraticProbing([10, 31], 7);
  assert.equal(t.slots[3], 10);
  assert.equal(t.slots[4], 31); // (3 + 1*1) % 7 = 4
});

test('quadratic-probing 与线性探测布局不同', () => {
  // 同样输入 [10,22,31,17] size=7
  // 线性：10→3, 22→1, 31→4, 17→5(3冲突→4冲突→5)
  // 二次：10→3, 22→1, 31→4, 17→ 3+1²=4冲突→3+2²=7%7=0
  const lin = quadraticProbing([10, 22, 31, 17], 7);
  // 验证 17 不在槽 5（线性会去 5），而在 (3+4)%7=0
  assert.equal(lin.slots[3], 10);
  assert.equal(lin.slots[1], 22);
  assert.equal(lin.slots[4], 31);
  assert.equal(lin.slots[0], 17); // 二次探测落点
});

test('quadratic-probing 查找命中与未命中', () => {
  const t = quadraticProbing([10, 31], 7);
  assert.equal(t.search(10), 3);
  assert.equal(t.search(31), 4);
  assert.equal(t.search(99), -1);
});

test('quadratic-probing 去重', () => {
  const t = new QuadraticProbing(7);
  t.insert(10);
  t.insert(10);
  const count = t.slots.filter((s) => s === 10).length;
  assert.equal(count, 1);
});

test('quadratic-probing hashKey 一致性', () => {
  for (const k of [0, 1, 7, 8, 15, -1]) {
    assert.ok(hashKey(k, 7) >= 0 && hashKey(k, 7) < 7);
  }
  assert.equal(hashKey(10, 7), 3);
});

test('quadratic-probing 探测序列公式', () => {
  // 手动验证 i² 探测序列对 key=17 size=7 start=3:
  // i=0:3, i=1:4, i=2:(3+4)%7=0, i=3:(3+9)%7=5, i=4:(3+16)%7=5,...
  const t = new QuadraticProbing(7);
  const probes: number[] = [];
  t.insert(10); // 占 3
  t.insert(31); // 占 4
  t.insert(17, {
    onProbe: (_i, slot) => probes.push(slot),
  });
  // 第一次探测应是 3（i=0），冲突；然后 4（i=1），冲突；然后 0（i=2）
  assert.ok(probes.includes(3));
  assert.ok(probes.includes(4));
  assert.ok(probes.includes(0));
  assert.equal(t.slots[0], 17);
});

test('quadratic-probing 钩子被调用', () => {
  let hashes = 0;
  let probes = 0;
  let inserts = 0;
  quadraticProbing([10, 31], 7, {
    onHash: () => hashes++,
    onProbe: () => probes++,
    onInsert: () => inserts++,
  });
  assert.equal(hashes, 2);
  assert.equal(inserts, 2);
  assert.ok(probes >= 2);
});

test('buildTrace 生成 array 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4);
  for (const f of frames) assert.ok(f.array);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array!.values.length === 7);
});
