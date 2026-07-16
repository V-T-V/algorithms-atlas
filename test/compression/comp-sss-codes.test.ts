import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sssEncode } from '../../src/algorithms/compression/comp-sss-codes/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-sss-codes/trace.ts';
test('sss 编 0 不为空', () => assert.ok(sssEncode([0], 2, 1, 3).length > 0));
test('sss trace 非空', () => assert.ok(buildTrace().length >= 2));
