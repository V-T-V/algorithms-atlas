import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rle,
  encodeRuns,
  decodeRuns,
  compressionRatio,
} from '../../src/algorithms/compression/rle/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/rle/trace.ts';

test('rle 基本游程', () => {
  assert.deepEqual(rle('AAAABBBCCDAA'), [
    { value: 'A', count: 4 },
    { value: 'B', count: 3 },
    { value: 'C', count: 2 },
    { value: 'D', count: 1 },
    { value: 'A', count: 2 },
  ]);
});

test('rle 空串与单字符', () => {
  assert.deepEqual(rle(''), []);
  assert.deepEqual(rle('X'), [{ value: 'X', count: 1 }]);
});

test('rle 无重复（每符号 count=1）', () => {
  assert.deepEqual(rle('ABCD'), [
    { value: 'A', count: 1 },
    { value: 'B', count: 1 },
    { value: 'C', count: 1 },
    { value: 'D', count: 1 },
  ]);
});

test('rle 全相同', () => {
  assert.deepEqual(rle('AAAAA'), [{ value: 'A', count: 5 }]);
});

test('encodeRuns / decodeRuns 往返一致', () => {
  const runs = rle('AAAABBBCCDAA');
  assert.equal(encodeRuns(runs), 'A4B3C2D1A2');
  assert.equal(decodeRuns(runs), 'AAAABBBCCDAA');
  // 往返不变性
  for (const s of ['', 'A', 'AABBCC', 'XYZ', 'PPPPPP']) {
    assert.equal(decodeRuns(rle(s)), s);
  }
});

test('compressionRatio 对重复数据 >1', () => {
  const runs = rle('AAAAAAAAAA'); // 10 个 A
  assert.ok(compressionRatio('AAAAAAAAAA', runs) > 1);
  // 无重复数据会膨胀
  const runs2 = rle('ABCD');
  assert.ok(compressionRatio('ABCD', runs2) < 1);
});

test('rle 钩子被调用', () => {
  const emitted: Array<{ value: string; count: number }> = [];
  const started: string[] = [];
  rle('AABB', {
    onRun: (_s, v) => started.push(v),
    onEmit: (_s, v, c) => emitted.push({ value: v, count: c }),
  });
  assert.deepEqual(started, ['A', 'B']);
  assert.deepEqual(emitted, [
    { value: 'A', count: 2 },
    { value: 'B', count: 2 },
  ]);
});

test('buildTrace 生成有序帧且末帧含编码结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3, '至少有初始帧 + 若干游程帧 + 终态帧');
  const first = frames[0]!;
  assert.ok(first.array, '首帧含 array');
  assert.ok(first.aux, '首帧含 aux（token 区，初始为空）');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map（原始/编码对照）');
  const encoded = last.map!.find((e) => e.key.startsWith('编码'));
  assert.equal(encoded!.value, 'A4B3C2D1A2');
});
