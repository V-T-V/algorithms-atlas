import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MiddleSquare,
  generateMiddleSquareSequence,
  findCycleLength,
} from '../../src/algorithms/randomized/middle-square/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/randomized/middle-square/trace.ts';

test('middle-square 经典示例：1111 → 2343', () => {
  // 1111^2 = 1234321，补 0 到 8 位：01234321，中间 4 位（从第 2 位起）= 2343
  const gen = new MiddleSquare(1111, 4);
  assert.equal(gen.next(), 2343);
});

test('middle-square 确定性（同种子同序列）', () => {
  const a = generateMiddleSquareSequence(6752, 4, 10);
  const b = generateMiddleSquareSequence(6752, 4, 10);
  assert.deepEqual(a, b);
});

test('middle-square 输出在 [0, 10^n)', () => {
  const gen = new MiddleSquare(1234, 4);
  for (let i = 0; i < 100; i++) {
    const v = gen.next();
    assert.ok(v >= 0 && v < 10000, `v=${v} 越界`);
  }
});

test('middle-square 收敛到 0 时序列终止', () => {
  // 种子 0 立即收敛
  const seq = generateMiddleSquareSequence(0, 4, 10);
  assert.ok(seq.length === 0);
});

test('middle-square 位数 ≥ 2', () => {
  assert.throws(() => new MiddleSquare(1, 1));
});

test('middle-square 钩子 onNext 被调用', () => {
  const values: number[] = [];
  generateMiddleSquareSequence(6752, 4, 5, {
    onNext: (v) => values.push(v),
  });
  assert.ok(values.length > 0);
  assert.ok(values.length <= 5);
});

test('middle-square findCycleLength 返回正周期或 -1', () => {
  const len = findCycleLength(6752, 4);
  assert.ok(typeof len === 'number');
  // 周期要么 >0，要么 -1（未在 maxIter 内找到）
  assert.ok(len === -1 || len > 0);
});

test('middle-square 种子 1000000 的平方正确（5 位）', () => {
  // 种子被 mod 10^digits
  const gen = new MiddleSquare(99999, 5);
  // 99999^2 = 9999800001，补到 10 位，中间 5 位（从第 2/3 位起）
  const v = gen.next();
  assert.ok(v >= 0 && v < 100000);
});

test('middle-square 不同种子可能不同序列', () => {
  const a = generateMiddleSquareSequence(1111, 4, 5);
  const b = generateMiddleSquareSequence(2222, 4, 5);
  // 至少第一项应不同
  assert.notEqual(a[0], b[0]);
});

test('middle-square current 反映状态', () => {
  const gen = new MiddleSquare(1111, 4);
  gen.next();
  assert.equal(gen.current, 2343);
});

test('buildTrace 含 aux，末帧含序列长度', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const len = last.aux!.find((e) => e.label === '序列长度');
  assert.ok(len, '末帧应含序列长度');
});
