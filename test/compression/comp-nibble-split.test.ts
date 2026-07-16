import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nibbleSplitEncode } from '../../src/algorithms/compression/comp-nibble-split/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-nibble-split/trace.ts';
test('nibble 0 编为 1 个 nibble', () => assert.equal(nibbleSplitEncode([0]).length, 1));
test('nibble trace 非空', () => assert.ok(buildTrace().length >= 2));
