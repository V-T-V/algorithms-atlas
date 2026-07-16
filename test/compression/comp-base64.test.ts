import { test } from 'node:test';
import assert from 'node:assert/strict';
import { base64Encode } from '../../src/algorithms/compression/comp-base64/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-base64/trace.ts';
test('base64 Hello', () => assert.equal(base64Encode([72, 101, 108, 108, 111]), 'SGVsbG8='));
test('base64 trace 非空', () => assert.ok(buildTrace().length >= 2));
