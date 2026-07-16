import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  deltaOfDeltaDecode,
  deltaOfDeltaEncode,
} from '../../src/algorithms/compression/delta-of-delta/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/delta-of-delta/trace.ts';

test('dod 编解码往返一致', () => {
  for (const s of [[1000, 1010, 1020, 1030, 1031], [5, 4, 3, 2, 1], [1], []]) {
    const { values } = deltaOfDeltaEncode(s);
    assert.deepEqual(deltaOfDeltaDecode(values), s, `往返不一致: ${JSON.stringify(s)}`);
  }
});

test('dod 等差序列二阶差分全零', () => {
  const ts = [10, 20, 30, 40, 50];
  const { values } = deltaOfDeltaEncode(ts);
  // values[0]=10, values[1]=10, values[2..]=0
  assert.deepEqual(values, [10, 10, 0, 0, 0]);
});

test('dod 单元素', () => {
  const { values } = deltaOfDeltaEncode([42]);
  assert.deepEqual(values, [42]);
});

test('dod 空输入', () => {
  const { values } = deltaOfDeltaEncode([]);
  assert.deepEqual(values, []);
});

test('dod 二元素只含一阶 delta', () => {
  const { values } = deltaOfDeltaEncode([100, 130]);
  assert.deepEqual(values, [100, 30]);
});

test('dod 非等差序列含非零 dod', () => {
  const { values } = deltaOfDeltaEncode([0, 1, 3, 6, 10]); // delta: 1,2,3,4; dod: 0,1,1,1
  assert.deepEqual(values, [0, 1, 1, 1, 1]);
});

test('dod 钩子被调用', () => {
  const calls: number[] = [];
  deltaOfDeltaEncode([1, 2, 3], { onDelta: (i) => calls.push(i) });
  assert.deepEqual(calls, [1, 2]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
