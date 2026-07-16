import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  reservoirSampling,
  StreamLCG,
} from '../../src/algorithms/design/reservoir-sampling-design/impl.ts';

test('reservoirSampling 基本功能', () => {
  const r = reservoirSampling([1, 2, 3, 4, 5], 3, 1);
  assert.equal(r.length, 3);
  // 全部来自原流
  for (const v of r) assert.ok([1, 2, 3, 4, 5].includes(v));
});

test('reservoirSampling k >= n 时返回全部', () => {
  const r = reservoirSampling([1, 2, 3], 5, 1);
  assert.equal(r.length, 3);
  assert.deepEqual(
    [...r].sort((a, b) => a - b),
    [1, 2, 3],
  );
});

test('reservoirSampling 可复现', () => {
  const s = [10, 20, 30, 40, 50, 60, 70, 80];
  const r1 = reservoirSampling(s, 3, 42);
  const r2 = reservoirSampling(s, 3, 42);
  assert.deepEqual(r1, r2);
});

test('reservoirSampling 始终返回 k 个不同的合法元素', () => {
  const s = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const k of [1, 2, 3, 5]) {
    for (const seed of [1, 2, 7, 42, 99, 123, 777]) {
      const r = reservoirSampling(s, k, seed);
      assert.equal(r.length, k, `k=${k} seed=${seed}`);
      // 全部来自原流
      for (const v of r) assert.ok(s.includes(v), `k=${k} seed=${seed} v=${v}`);
      // 互不相同
      assert.equal(new Set(r).size, k, `k=${k} seed=${seed} 有重复`);
    }
  }
});

test('reservoirSampling k=1 多种子覆盖全部元素', () => {
  // 跨足够多种子后，应至少命中过每个元素（避免退化）
  const s = [10, 20, 30, 40];
  const seen = new Set<number>();
  for (let seed = 1; seed <= 200; seed++) {
    seen.add(reservoirSampling(s, 1, seed)[0]!);
  }
  for (const v of s) assert.ok(seen.has(v), `元素 ${v} 从未被选中`);
});

test('reservoirSampling 不修改原数组', () => {
  const input = [1, 2, 3, 4, 5];
  reservoirSampling(input, 2, 1);
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
});

test('reservoirSampling 非法 k 抛错', () => {
  assert.throws(() => reservoirSampling([1, 2], 0));
  assert.throws(() => reservoirSampling([1, 2], -1));
  assert.throws(() => reservoirSampling([1, 2], 1.5));
});

test('StreamLCG 范围', () => {
  const rng = new StreamLCG(3);
  for (let i = 0; i < 50; i++) {
    const v = rng.nextInt(5);
    assert.ok(v >= 0 && v < 5);
  }
});
