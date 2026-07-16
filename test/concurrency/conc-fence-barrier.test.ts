import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memoryFenceModel } from '../../src/algorithms/concurrency/conc-fence-barrier/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-fence-barrier/trace.ts';
test('fence 计数正确', () => assert.equal(memoryFenceModel(['a', 'fence', 'b']).fences, 1));
test('fence trace 非空', () => assert.ok(buildTrace().length >= 2));
