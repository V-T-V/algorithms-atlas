import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctz, toBinary32 } from '../../src/algorithms/bitwise/trailing-zeros/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/trailing-zeros/trace.ts';

test('ctz 已知值', () => {
  assert.equal(ctz(0), 32);
  assert.equal(ctz(1), 0);
  assert.equal(ctz(2), 1);
  assert.equal(ctz(8), 3);
  assert.equal(ctz(10), 1); // 0b1010
  assert.equal(ctz(0x80000000), 31);
  assert.equal(ctz(0xffffffff), 0);
});

test('ctz 等于最低位 1 的位索引', () => {
  for (let i = 1; i < 1024; i++) {
    const expected = Math.log2(i & -i);
    assert.equal(ctz(i), expected, `ctz(${i})`);
  }
});

test('ctz 非法输入报错', () => {
  assert.throws(() => ctz(-1));
  assert.throws(() => ctz(0x100000000));
  assert.throws(() => ctz(1.5));
});

test('ctz toBinary32 长度', () => {
  assert.equal(toBinary32(0).length, 32);
  assert.equal(toBinary32(1), '00000000000000000000000000000001');
});

test('ctz 钩子被调用', () => {
  const lookups: number[] = [];
  ctz(16, { onLookup: (_i, c) => lookups.push(c) });
  assert.deepEqual(lookups, [4]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
