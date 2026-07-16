import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  weightedReservoir,
  sampleWeighted,
  makeRng,
} from '../../src/algorithms/randomized/reservoir-weighted/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/reservoir-weighted/trace.ts';

test('reservoir-weighted 返回恰好 k 项（n ≥ k）', () => {
  const rng = makeRng(1);
  const result = weightedReservoir([1, 2, 3, 4, 5, 6, 7, 8], 3, rng);
  assert.equal(result.length, 3);
});

test('reservoir-weighted n < k 时返回全部', () => {
  const rng = makeRng(2);
  const result = weightedReservoir([1, 2], 5, rng);
  assert.equal(result.length, 2);
});

test('reservoir-weighted 选中下标不重复', () => {
  const rng = makeRng(3);
  const result = weightedReservoir([1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 4, rng);
  const indices = result.map((e) => e.index);
  assert.equal(new Set(indices).size, indices.length);
});

test('reservoir-weighted 高权重项更可能被选中', () => {
  // 一个权重极大，其余为1
  const weights = [1, 1, 1, 1, 100, 1, 1, 1, 1, 1];
  let bigSelected = 0;
  const trials = 200;
  for (let t = 0; t < trials; t++) {
    const rng = makeRng(100 + t);
    const idx = sampleWeighted(weights, 1, rng);
    if (idx.includes(4)) bigSelected++;
  }
  // 权重100/109 ≈ 0.917 应被选中约 92%
  assert.ok(bigSelected > trials * 0.7, `高权重选中率 ${bigSelected}/${trials} 过低`);
});

test('reservoir-weighted 等权重时均匀分布', () => {
  const weights = [1, 1, 1, 1];
  const counts = [0, 0, 0, 0];
  const trials = 4000;
  for (let t = 0; t < trials; t++) {
    const rng = makeRng(t * 7 + 1);
    const idx = sampleWeighted(weights, 1, rng);
    counts[idx[0]!]!++;
  }
  // 每个应接近 25%
  for (const c of counts) {
    const freq = c / trials;
    assert.ok(freq > 0.2 && freq < 0.3, `频率 ${freq} 偏离 0.25`);
  }
});

test('reservoir-weighted k=0 返回空', () => {
  assert.equal(weightedReservoir([1, 2, 3], 0).length, 0);
});

test('reservoir-weighted 零权重跳过', () => {
  const rng = makeRng(4);
  const result = weightedReservoir([0, 0, 5, 0, 0], 1, rng);
  assert.equal(result.length, 1);
  assert.equal(result[0]!.index, 2);
});

test('reservoir-weighted makeRng 确定性', () => {
  const a = makeRng(5);
  const b = makeRng(5);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

test('reservoir-weighted 同种子同结果', () => {
  const r1 = weightedReservoir([3, 1, 4, 1, 5, 9, 2, 6], 3, makeRng(42));
  const r2 = weightedReservoir([3, 1, 4, 1, 5, 9, 2, 6], 3, makeRng(42));
  assert.deepEqual(
    r1.map((e) => e.index),
    r2.map((e) => e.index),
  );
});

test('reservoir-weighted 钩子 onItem 每项触发', () => {
  let items = 0;
  weightedReservoir([1, 2, 3, 4], 2, makeRng(8), {
    onItem: () => items++,
  });
  assert.equal(items, 4);
});

test('reservoir-weighted key = u^(1/w) 正确性', () => {
  const rng = makeRng(10);
  const captured: Array<{ u: number; w: number; key: number }> = [];
  // 拦截：用已知 u 验证
  const weights = [4];
  weightedReservoir(weights, 1, () => 0.5, {
    onItem: (_i, w, key) => {
      captured.push({ u: 0.5, w, key });
    },
  });
  assert.ok(captured.length >= 1);
  const c = captured[0]!;
  assert.ok(Math.abs(c.key - Math.pow(0.5, 1 / c.w)) < 1e-9);
  void rng;
});

test('buildTrace 含 array，末帧含选中数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const sel = last.aux!.find((e) => e.label === '选中数');
  assert.ok(sel, '末帧应含选中数');
  assert.ok(Number(sel!.value) > 0);
});
