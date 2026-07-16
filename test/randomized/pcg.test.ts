import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PCG32, generatePcgSequence } from '../../src/algorithms/randomized/pcg/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/randomized/pcg/trace.ts';

test('pcg 固定种子确定性输出', () => {
  const a = generatePcgSequence(42n, 5);
  const b = generatePcgSequence(42n, 5);
  assert.deepEqual(a, b);
});

test('pcg 输出为无符号 32 位', () => {
  const gen = new PCG32(12345);
  for (let i = 0; i < 1000; i++) {
    const v = gen.next();
    assert.ok(Number.isInteger(v));
    assert.ok(v >= 0 && v < 0x100000000, `v=${v} 越界`);
  }
});

test('pcg 不同种子产生不同序列', () => {
  const a = generatePcgSequence(1n, 5);
  const b = generatePcgSequence(2n, 5);
  assert.notDeepEqual(a, b);
});

test('pcg 前 N 个值无重复（足够长）', () => {
  const gen = new PCG32(777n);
  const seen = new Set<number>();
  for (let i = 0; i < 1000; i++) {
    const v = gen.next();
    assert.equal(seen.has(v), false, `第 ${i} 个值重复`);
    seen.add(v);
  }
});

test('pcg nextInt 落在 [0, max)', () => {
  const gen = new PCG32(555n);
  const max = 100;
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextInt(max);
    assert.ok(v >= 0 && v < max, `v=${v} 越界`);
  }
});

test('pcg nextFloat 落在 [0, 1)', () => {
  const gen = new PCG32(321n);
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextFloat();
    assert.ok(v >= 0 && v < 1, `v=${v} 越界`);
  }
});

test('pcg 数值种子等价 BigInt 种子', () => {
  const a = generatePcgSequence(42, 5);
  const b = generatePcgSequence(42n, 5);
  assert.deepEqual(a, b);
});

test('pcg 默认种子确定性', () => {
  const gen1 = new PCG32();
  const gen2 = new PCG32();
  const a: number[] = [];
  const b: number[] = [];
  for (let i = 0; i < 5; i++) {
    a.push(gen1.next());
    b.push(gen2.next());
  }
  assert.deepEqual(a, b);
});

test('pcg 钩子被调用', () => {
  const values: number[] = [];
  generatePcgSequence(42n, 3, undefined, {
    onNext: (v) => values.push(v),
  });
  assert.equal(values.length, 3);
});

test('pcg 自定义 inc 改变序列', () => {
  const a = generatePcgSequence(42n, 5, 1n);
  const b = generatePcgSequence(42n, 5, 2n);
  assert.notDeepEqual(a, b);
});

test('buildTrace 含 bars，末帧含序列长度', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.bars !== undefined || frames[0]!.aux !== undefined);
  const last = frames[frames.length - 1]!;
  const len = last.aux!.find((e) => e.label === '序列长度');
  assert.ok(len, '末帧应含序列长度');
  assert.ok(Number(len!.value) > 0);
});
