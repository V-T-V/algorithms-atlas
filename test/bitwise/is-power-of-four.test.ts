import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPowerOfFour } from '../../src/algorithms/bitwise/is-power-of-four/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/is-power-of-four/trace.ts';

test('isPowerOfFour 真', () => {
  for (const n of [1, 4, 16, 64, 256, 1024]) {
    assert.equal(isPowerOfFour(n), true, `${n} 应是 4 的幂`);
  }
});

test('isPowerOfFour 假', () => {
  for (const n of [0, -4, 2, 8, 32, 128, 5, 15, 20]) {
    assert.equal(isPowerOfFour(n), false, `${n} 不应是 4 的幂`);
  }
});

test('isPowerOfFour 2 的幂但非 4 的幂', () => {
  // 2,8,32,128 是 2 的奇数幂，非 4 的幂
  assert.equal(isPowerOfFour(2), false);
  assert.equal(isPowerOfFour(8), false);
  assert.equal(isPowerOfFour(32), false);
});

test('isPowerOfFour 钩子被调用', () => {
  const steps: boolean[] = [];
  isPowerOfFour(16, {
    onCheckPositive: (_n, ok) => steps.push(ok),
    onCheckSingleBit: (_n, ok) => steps.push(ok),
    onCheckEvenPosition: (_n, ok) => steps.push(ok),
    onResult: (r) => steps.push(r),
  });
  assert.deepEqual(steps, [true, true, true, true]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
