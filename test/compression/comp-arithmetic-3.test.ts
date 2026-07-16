import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arithmeticEncode } from '../../src/algorithms/compression/comp-arithmetic-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-arithmetic-3/trace.ts';

test('arithmetic encode 区间收敛', () => {
  const freq = new Map<number, [number, number]>([
    ['A'.charCodeAt(0), [0, 49152]],
    ['B'.charCodeAt(0), [49152, 65536]],
  ]);
  const r = arithmeticEncode([65, 65, 66, 65], freq);
  assert.ok(r.high >= r.low);
});
test('arithmetic encode trace 非空', () => assert.ok(buildTrace().length > 0));
