import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xorDeltaEncode } from '../../src/algorithms/compression/comp-xor-delta/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-xor-delta/trace.ts';
test('xor 相同值输出 0', () => assert.deepEqual(xorDeltaEncode([7, 7, 7]), [7, 0, 0]));
test('xor trace 非空', () => assert.ok(buildTrace().length >= 2));
