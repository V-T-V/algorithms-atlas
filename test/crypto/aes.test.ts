import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aes } from '../../src/algorithms/crypto/aes/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/aes/trace.ts';

test('aes 输出长度与确定性', () => {
  const { bytes } = aes([0x32, 0x88, 0x31, 0xe0], [0x2b, 0x7e, 0x15, 0x16]);
  assert.equal(bytes.length, 4);
  assert.deepEqual(aes([0x32, 0x88, 0x31, 0xe0]).bytes, aes([0x32, 0x88, 0x31, 0xe0]).bytes);
});

test('aes 对非 4 字节输入抛错', () => {
  assert.throws(() => aes([1, 2, 3]).bytes);
});

test('aes 钩子按序触发四步', () => {
  const steps: string[] = [];
  aes([1, 2, 3, 4], [0, 0, 0, 0], {
    onSubBytes: () => steps.push('sub'),
    onShiftRows: () => steps.push('shift'),
    onMixColumns: () => steps.push('mix'),
    onAddRoundKey: () => steps.push('add'),
  });
  assert.deepEqual(steps, ['sub', 'shift', 'mix', 'add']);
});

test('aes 全零输入经 S-Box 后非全零', () => {
  const { bytes } = aes([0, 0, 0, 0], [0, 0, 0, 0]);
  // S-Box[0] = 0x63，故 SubBytes 后非零；全零密钥 AddRoundKey 不改变
  assert.ok(bytes.some((b) => b !== 0));
});

test('buildTrace 生成帧且末帧含密文', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  assert.ok(frames[0]!.array2d, '首帧含 2x2 网格');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  assert.ok(last.map!.some((e) => e.key.startsWith('密文')));
});
