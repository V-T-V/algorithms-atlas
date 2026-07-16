import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swapBits } from '../../src/algorithms/bitwise/swap-bits/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/swap-bits/trace.ts';

test('swapBits 不同的位被交换', () => {
  // x = 0b00101100 = 44，交换位 1（值 0）与位 5（值 1）
  // 位 1 ← 1，位 5 ← 0 → 0b00001110 = 14
  assert.equal(swapBits(0b00101100, 1, 5), 0b00001110);
});

test('swapBits 相同的位不变', () => {
  // 位 0 与位 2 都是 1，交换后不变
  assert.equal(swapBits(0b00000101, 0, 2), 0b00000101);
  // 位 0 与位 1 都是 0
  assert.equal(swapBits(0b00000100, 0, 1), 0b00000100);
});

test('swapBits i==j 不变', () => {
  assert.equal(swapBits(0x12345678, 5, 5), 0x12345678);
});

test('swapBits 交换两次还原', () => {
  for (const [x, i, j] of [
    [0x12345678, 3, 17],
    [0xdeadbeef, 0, 31],
    [1, 0, 31],
  ] as const) {
    const once = swapBits(x, i, j);
    const twice = swapBits(once, i, j);
    assert.equal(twice, x >>> 0);
  }
});

test('swapBits 非法位报错', () => {
  assert.throws(() => swapBits(1, -1, 0));
  assert.throws(() => swapBits(1, 0, 32));
  assert.throws(() => swapBits(1, 0, 1.5));
});

test('swapBits 钩子被调用', () => {
  const diffs: boolean[] = [];
  swapBits(0b101, 0, 2, { onDiff: (d) => diffs.push(d) });
  assert.deepEqual(diffs, [false]); // 都是 1
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
