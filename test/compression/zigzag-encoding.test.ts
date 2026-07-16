import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  zigzagDecode,
  zigzagDecodeMany,
  zigzagEncode,
  zigzagEncodeMany,
} from '../../src/algorithms/compression/zigzag-encoding/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/zigzag-encoding/trace.ts';

test('zigzag 交替映射顺序', () => {
  assert.equal(zigzagEncode(0), 0);
  assert.equal(zigzagEncode(-1), 1);
  assert.equal(zigzagEncode(1), 2);
  assert.equal(zigzagEncode(-2), 3);
  assert.equal(zigzagEncode(2), 4);
});

test('zigzag 编解码往返一致', () => {
  for (const v of [0, 1, -1, 2, -2, 100, -100, 2147483647, -2147483648]) {
    assert.equal(zigzagDecode(zigzagEncode(v)), v, `往返不一致: ${v}`);
  }
});

test('zigzag 批量编解码', () => {
  const input = [0, -1, 1, -2, 2, -100, 100];
  const encoded = zigzagEncodeMany(input);
  assert.deepEqual(zigzagDecodeMany(encoded), input);
});

test('zigzag 输出非负', () => {
  for (const v of [-1000, -1, 0, 1, 1000]) {
    assert.ok(zigzagEncode(v) >= 0, `${v} 编码应为非负`);
  }
});

test('zigzag 越界报错', () => {
  assert.throws(() => zigzagEncode(2147483648));
  assert.throws(() => zigzagEncode(-2147483649));
  assert.throws(() => zigzagEncode(1.5));
});

test('zigzag 钩子被调用', () => {
  const outs: Array<[number, number]> = [];
  zigzagEncode(-5, { onEncode: (s, u) => outs.push([s, u]) });
  assert.deepEqual(outs, [[-5, 9]]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
