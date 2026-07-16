import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  arithmeticBinaryEncode,
  arithmeticBinaryDecode,
} from '../../src/algorithms/compression/comp-arithmetic-binary/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-arithmetic-binary/trace.ts';
test('bac 往返', () => {
  const c = arithmeticBinaryEncode([1, 0, 1, 1], 0.5);
  assert.deepEqual(arithmeticBinaryDecode(c, 0.5, 4), [1, 0, 1, 1]);
});
test('bac trace 非空', () => assert.ok(buildTrace().length >= 2));
