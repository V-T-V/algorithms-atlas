import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  arithIntEncode,
  arithIntDecode,
  buildModel,
} from '../../src/algorithms/compression/comp-arithmetic-integer/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-arithmetic-integer/trace.ts';

function roundtrip(data: number[], freq: Map<number, number>): void {
  const m = buildModel(freq);
  const bits = arithIntEncode(data, m, 32);
  assert.deepEqual(arithIntDecode(bits, m, data.length, 32), data);
}

test('arith-int 往返一致', () => {
  roundtrip(
    [0, 0, 1, 0, 2, 0, 1],
    new Map([
      [0, 5],
      [1, 3],
      [2, 2],
    ]),
  );
});

test('arith-int 单符号往返', () => {
  roundtrip([5, 5, 5], new Map([[5, 10]]));
});

test('arith-int DEFAULT_INPUT 往返', () => {
  roundtrip(
    DEFAULT_INPUT,
    new Map([
      [0, 5],
      [1, 3],
      [2, 2],
    ]),
  );
});

test('arith-int 未知符号抛错', () => {
  const m = buildModel(new Map([[0, 1]]));
  assert.throws(() => arithIntEncode([9], m, 32));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
