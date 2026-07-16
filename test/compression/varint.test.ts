import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  varintByteLength,
  varintDecode,
  varintDecodeMany,
  varintEncode,
  varintEncodeMany,
} from '../../src/algorithms/compression/varint/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/varint/trace.ts';

test('varint 单字节（<128）', () => {
  assert.deepEqual(varintEncode(0), [0]);
  assert.deepEqual(varintEncode(1), [1]);
  assert.deepEqual(varintEncode(127), [127]);
});

test('varint 多字节', () => {
  // 300 = 0b100101100 → 低7位 0101100=44 |0x80 = 0xAC，高7位 10=2
  assert.deepEqual(varintEncode(300), [0xac, 0x02]);
  assert.equal(varintDecode([0xac, 0x02]).value, 300);
});

test('varint 编解码往返一致', () => {
  for (const v of [0, 1, 127, 128, 255, 300, 16384, 123456789]) {
    const bytes = varintEncode(v);
    assert.equal(varintDecode(bytes).value, v, `往返不一致: ${v}`);
  }
});

test('varint 连续编解码多个整数', () => {
  const bytes = varintEncodeMany([1, 300, 16384]);
  assert.deepEqual(varintDecodeMany(bytes), [1, 300, 16384]);
});

test('varint 负数与非整数报错', () => {
  assert.throws(() => varintEncode(-1));
  assert.throws(() => varintEncode(1.5));
});

test('varint 不完整序列报错', () => {
  assert.throws(() => varintDecode([0x80])); // 只有继续位
});

test('varint byteLength 正确', () => {
  assert.equal(varintByteLength(0), 1);
  assert.equal(varintByteLength(127), 1);
  assert.equal(varintByteLength(128), 2);
  assert.equal(varintByteLength(300), 2);
  assert.equal(varintByteLength(16384), 3);
  assert.equal(varintByteLength(300), varintEncode(300).length);
});

test('varint 钩子被调用', () => {
  const bytes: number[] = [];
  varintEncode(300, { onByte: (_v, b) => bytes.push(b) });
  assert.deepEqual(bytes, [0xac, 0x02]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
