import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PerfectHash } from '../../src/algorithms/hashing/perfect-hash-impl/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/perfect-hash-impl/trace.ts';

test('PerfectHash 构造后所有键无冲突', () => {
  const keys = ['apple', 'banana', 'cherry', 'date', 'fig', 'grape', 'kiwi'];
  const ph = new PerfectHash(keys);
  const slots = keys.map((k) => ph.slotOf(k));
  const unique = new Set(slots);
  assert.equal(unique.size, keys.length, '应有 n 个不同槽位');
});

test('PerfectHash slotOf 确定性', () => {
  const keys = ['one', 'two', 'three', 'four', 'five'];
  const ph = new PerfectHash(keys);
  for (const k of keys) {
    assert.equal(ph.slotOf(k), ph.slotOf(k));
  }
});

test('PerfectHash 成员判定', () => {
  const keys = ['x', 'y', 'z'];
  const ph = new PerfectHash(keys);
  assert.equal(ph.has('x'), true);
  assert.equal(ph.has('w'), false);
});

test('PerfectHash size 正确', () => {
  const keys = ['a', 'b', 'c'];
  const ph = new PerfectHash(keys);
  assert.equal(ph.size(), 3);
});

test('PerfectHash 空键集抛错', () => {
  assert.throws(() => new PerfectHash([]));
});

test('PerfectHash 表大小合理（O(n)）', () => {
  const keys = Array.from({ length: 50 }, (_, i) => `key${i}`);
  const ph = new PerfectHash(keys);
  assert.ok(ph.tableSize <= 4 * keys.length, '表大小应 O(n)');
  assert.ok(ph.tableSize >= keys.length);
});

test('PerfectHash 重复键仍无冲突', () => {
  const keys = ['dup', 'dup', 'dup'];
  // 重复键是同一键，集合去重后仅 1 个
  const ph = new PerfectHash(keys);
  assert.equal(ph.size(), 1);
});

test('PerfectHash 钩子：onBuckets 与 onResult 触发', () => {
  let buckets = false;
  let result = false;
  new PerfectHash(['a', 'b', 'c'], 0x9e3779b9, {
    onBuckets: () => (buckets = true),
    onResult: () => (result = true),
  });
  assert.equal(buckets, true);
  assert.equal(result, true);
});

test('PerfectHash 大键集压力测试（100 键无冲突）', () => {
  const keys = Array.from({ length: 100 }, (_, i) => `item_${i}`);
  const ph = new PerfectHash(keys);
  const slots = keys.map((k) => ph.slotOf(k));
  assert.equal(new Set(slots).size, 100);
});

test('PerfectHash 中文键', () => {
  const keys = ['苹果', '香蕉', '樱桃', '葡萄'];
  const ph = new PerfectHash(keys);
  const slots = keys.map((k) => ph.slotOf(k));
  assert.equal(new Set(slots).size, keys.length);
});

test('buildTrace 含 aux，末帧含槽位映射', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  // 末帧 aux 含 slot("...") 项
  const hasSlot = last.aux!.some((e) => e.label.startsWith('slot('));
  assert.ok(hasSlot, '末帧应含槽位映射');
});
