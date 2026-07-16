import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mortonCode,
  mortonDecode,
  spread16,
  squash16,
} from '../../src/algorithms/bitwise/bit-interleave/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/bit-interleave/trace.ts';

test('morton 已知值', () => {
  // x=1(0b01), y=1(0b01) → 交错 0b0011 = 3
  assert.equal(mortonCode(1, 1), 3);
  // x=2(0b10), y=0 → 0b0100 = 4
  assert.equal(mortonCode(2, 0), 4);
  // x=0, y=2(0b10) → 0b1000 = 8
  assert.equal(mortonCode(0, 2), 8);
});

test('morton 编解码往返一致', () => {
  for (let x = 0; x < 256; x++) {
    for (let y = 0; y < 256; y++) {
      const code = mortonCode(x, y);
      const back = mortonDecode(code);
      assert.equal(back.x, x, `x 还原失败: ${x},${y}`);
      assert.equal(back.y, y, `y 还原失败: ${x},${y}`);
    }
  }
});

test('morton spread/squash 互逆', () => {
  for (let i = 0; i < 65536; i += 257) {
    assert.equal(squash16(spread16(i)), i);
  }
});

test('morton 非法输入报错', () => {
  assert.throws(() => mortonCode(-1, 0));
  assert.throws(() => mortonCode(0x10000, 0));
  assert.throws(() => mortonCode(0, 1.5));
});

test('morton 相邻格子的码也相邻（粗略）', () => {
  // (0,0)->(1,0) 的码差应小
  const a = mortonCode(0, 0);
  const b = mortonCode(1, 0);
  assert.ok(b - a >= 1);
});

test('morton 钩子被调用', () => {
  const spreads: string[] = [];
  mortonCode(5, 3, { onSpread: (w) => spreads.push(w) });
  assert.equal(spreads.length, 2);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
