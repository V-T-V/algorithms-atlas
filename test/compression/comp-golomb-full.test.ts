import { test } from 'node:test';
import assert from 'node:assert/strict';
import { golombEncode } from '../../src/algorithms/compression/comp-golomb-full/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-golomb-full/trace.ts';
test('golomb 0 编为 0+b', () => assert.equal(golombEncode([0], 4), '000'));
test('golomb trace 非空', () => assert.ok(buildTrace().length >= 2));
