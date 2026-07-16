import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clz, toBinary32 } from '../../src/algorithms/bitwise/leading-zeros/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/leading-zeros/trace.ts';

test('clz 已知值', () => {
  assert.equal(clz(0), 32);
  assert.equal(clz(1), 31);
  assert.equal(clz(0x80000000), 0);
  assert.equal(clz(0x00010000), 15);
  assert.equal(clz(0xffffffff), 0);
  assert.equal(clz(0x40000000), 1);
});

test('clz 与 31 - floor(log2) 一致（非零）', () => {
  for (let i = 1; i < 4096; i++) {
    const expected = 31 - Math.floor(Math.log2(i));
    assert.equal(clz(i), expected, `clz(${i})`);
  }
});

test('clz 非法输入报错', () => {
  assert.throws(() => clz(-1));
  assert.throws(() => clz(0x100000000));
  assert.throws(() => clz(1.5));
});

test('clz toBinary32', () => {
  assert.equal(toBinary32(0), '0'.repeat(32));
  assert.equal(toBinary32(1).slice(-1), '1');
});

test('clz 钩子被调用', () => {
  const stages: number[] = [];
  clz(256, { onStage: (s) => stages.push(s) });
  assert.equal(stages.length, 5);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
