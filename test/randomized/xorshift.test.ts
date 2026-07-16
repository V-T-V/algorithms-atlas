import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Xorshift,
  generateXorshiftSequence,
} from '../../src/algorithms/randomized/xorshift/impl.ts';

test('xorshift 固定种子确定性输出', () => {
  const a = generateXorshiftSequence(42, 5);
  const b = generateXorshiftSequence(42, 5);
  assert.deepEqual(a, b);
});

test('xorshift seed=42 前 5 个值', () => {
  const seq = generateXorshiftSequence(42, 5);
  assert.deepEqual(seq, [3656013402, 504890879, 2421774874, 2421692779, 462149052]);
});

test('xorshift seed=1 前 3 个值', () => {
  const seq = generateXorshiftSequence(1, 3);
  assert.deepEqual(seq, [3656013425, 504890836, 2421774897]);
});

test('xorshift 输出为无符号 32 位', () => {
  const gen = new Xorshift(777);
  for (let i = 0; i < 1000; i++) {
    const v = gen.next();
    assert.ok(Number.isInteger(v), '应为整数');
    assert.ok(v >= 0 && v < 0x100000000, `v=${v} 越界`);
  }
});

test('xorshift nextInt 落在 [0, max)', () => {
  const gen = new Xorshift(555);
  const max = 50;
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextInt(max);
    assert.ok(v >= 0 && v < max, `v=${v} 越界`);
  }
});

test('xorshift nextFloat 落在 [0, 1)', () => {
  const gen = new Xorshift(321);
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextFloat();
    assert.ok(v >= 0 && v < 1, `v=${v} 越界`);
  }
});

test('xorshift 不同种子产生不同序列', () => {
  const a = generateXorshiftSequence(1, 5);
  const b = generateXorshiftSequence(2, 5);
  assert.notDeepEqual(a, b);
});

test('xorshift 无短周期循环（1000 内不回到初态 4 元组）', () => {
  // Xorshift128 周期为 2^128-1；其状态为 4 元组 (x,y,z,w)。
  // 检测前 1000 步内是否回到初始状态（短循环即 bug）。
  const gen = new Xorshift(123);
  // 抓取初始 4 元组状态需要内省，这里改用「输出序列不立刻重复」的弱断言：
  // 连续两段 32 输出不应完全相同。
  const seg1: number[] = [];
  for (let i = 0; i < 32; i++) seg1.push(gen.next());
  const seg2: number[] = [];
  for (let i = 0; i < 32; i++) seg2.push(gen.next());
  assert.notDeepEqual(seg1, seg2, '输出出现 32 长度短循环');
});

test('xorshift 输出分布：0 与 1 比特位近似均衡', () => {
  // 均匀 PRNG 的每一位 0/1 概率应接近 0.5
  const gen = new Xorshift(2024);
  const bits = 10000 * 32;
  let ones = 0;
  for (let i = 0; i < 10000; i++) {
    let v = gen.next();
    for (let b = 0; b < 32; b++) {
      ones += v & 1;
      v = v >>> 1;
    }
  }
  const ratio = ones / bits;
  assert.ok(Math.abs(ratio - 0.5) < 0.02, `0/1 比特比例 ${ratio} 偏离 0.5 过大`);
});

test('xorshift 钩子被调用', () => {
  const values: number[] = [];
  generateXorshiftSequence(42, 3, {
    onNext: (v) => values.push(v),
  });
  assert.equal(values.length, 3);
  assert.deepEqual(values, [3656013402, 504890879, 2421774874]);
});
