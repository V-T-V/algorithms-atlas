import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitwiseAbsV2, toBinary32 } from '../../src/algorithms/bitwise/bitwise-abs-v2/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/bitwise-abs-v2/trace.ts';

test('abs-v2 与 Math.abs 一致（非负）', () => {
  for (const v of [0, 1, 42, 255, 1000000, 2147483647]) {
    assert.equal(bitwiseAbsV2(v), Math.abs(v));
  }
});

test('abs-v2 与 Math.abs 一致（负数）', () => {
  for (const v of [-1, -42, -255, -1000000]) {
    assert.equal(bitwiseAbsV2(v), Math.abs(v));
  }
});

test('abs-v2 INT_MIN 溢出（按位运算语义）', () => {
  // -2147483648 的绝对值超出 int32 正数范围，按位运算返回其自身
  assert.equal(bitwiseAbsV2(-2147483648), -2147483648);
});

test('abs-v2 toBinary32', () => {
  assert.equal(toBinary32(0).length, 32);
  assert.equal(toBinary32(-1), '1'.repeat(32));
});

test('abs-v2 钩子被调用', () => {
  const steps: string[] = [];
  bitwiseAbsV2(-5, {
    onSign: (_x, m) => steps.push(`sign:${m}`),
    onXor: (x) => steps.push(`xor:${x}`),
    onResult: (r) => steps.push(`res:${r}`),
  });
  assert.equal(steps.length, 3);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
