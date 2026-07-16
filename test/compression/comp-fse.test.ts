import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fseEncode } from '../../src/algorithms/compression/comp-fse/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-fse/trace.ts';
const T = new Map([
  [0, [1, 2]],
  [1, [3, 4]],
]);
test('fse 确定性', () => assert.equal(fseEncode([0, 1], T), fseEncode([0, 1], T)));
test('fse trace 非空', () => assert.ok(buildTrace().length >= 2));
