import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  POPCOUNT_TABLE,
  popcountLookup,
  toBinaryString,
} from '../../src/algorithms/bitwise/count-set-bits-lookup/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/bitwise/count-set-bits-lookup/trace.ts';

test('lookup-popcount 已知值', () => {
  assert.equal(popcountLookup(0), 0);
  assert.equal(popcountLookup(1), 1);
  assert.equal(popcountLookup(7), 3); // 111
  assert.equal(popcountLookup(255), 8); // 一个字节全 1
  assert.equal(popcountLookup(0xffff), 16);
  assert.equal(popcountLookup(0xffffffff), 32);
});

test('lookup-popcount 表正确', () => {
  for (let i = 0; i < 256; i++) {
    let c = 0;
    let v = i;
    while (v) {
      c++;
      v &= v - 1;
    }
    assert.equal(POPCOUNT_TABLE[i], c, `表值错误 ${i}`);
  }
});

test('lookup-popcount 大数正确', () => {
  // > 2^32
  assert.equal(popcountLookup(0x100000000), 1); // 2^32
  assert.equal(popcountLookup(0x100000001), 2);
});

test('lookup-popcount 非法输入报错', () => {
  assert.throws(() => popcountLookup(-1));
  assert.throws(() => popcountLookup(1.5));
});

test('lookup-popcount 钩子被调用', () => {
  const bytes: number[] = [];
  popcountLookup(0x12345678, { onByte: (bi) => bytes.push(bi) });
  assert.equal(bytes.length, 4); // 4 字节
});

test('lookup-popcount toBinaryString', () => {
  assert.equal(toBinaryString(0), '0');
  assert.equal(toBinaryString(5), '101');
  assert.equal(toBinaryString(255), '11111111');
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
