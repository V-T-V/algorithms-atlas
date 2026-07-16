import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotateLeft, rotateLeftMany } from '../../src/algorithms/bitwise/rotate-left-only/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/rotate-left-only/trace.ts';

test('rotateLeft 已知值', () => {
  assert.equal(rotateLeft(0x12345678, 8), 0x34567812);
  assert.equal(rotateLeft(0x80000000, 1), 1); // 最高位回绕到最低位
  assert.equal(rotateLeft(0xffffffff, 5), 0xffffffff);
  assert.equal(rotateLeft(1, 31), 0x80000000);
});

test('rotateLeft r=0 不变', () => {
  assert.equal(rotateLeft(0xdeadbeef, 0), 0xdeadbeef);
});

test('rotateLeft r=32 回到原值', () => {
  assert.equal(rotateLeft(0x12345678, 32), 0x12345678);
});

test('rotateLeft 模 32 处理大位移', () => {
  assert.equal(rotateLeft(0x12345678, 40), rotateLeft(0x12345678, 8));
  assert.equal(rotateLeft(0x12345678, -24), rotateLeft(0x12345678, 8));
});

test('rotateLeftMany 累积', () => {
  assert.equal(rotateLeftMany(0x12345678, [4, 4]), rotateLeft(0x12345678, 8));
  assert.equal(rotateLeftMany(0x12345678, [10, 20, 2]), rotateLeft(0x12345678, 0)); // 32 mod 32
});

test('rotateLeft 可逆（左移 k 后左移 32-k 还原）', () => {
  for (const [x, k] of [
    [0x12345678, 8],
    [0xdeadbeef, 13],
    [1, 1],
  ] as const) {
    assert.equal(rotateLeft(rotateLeft(x, k), 32 - k), x >>> 0);
  }
});

test('rotateLeft 钩子被调用', () => {
  const rs: number[] = [];
  rotateLeft(0x12345678, 8, { onNormalize: (_r, n) => rs.push(n) });
  assert.deepEqual(rs, [8]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
