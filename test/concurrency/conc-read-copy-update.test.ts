import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rcuModel } from '../../src/algorithms/concurrency/conc-read-copy-update/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-read-copy-update/trace.ts';
test('rcu 累加写入', () => assert.equal(rcuModel(10, [1, 2, -3], 0), 10));
test('rcu trace 非空', () => assert.ok(buildTrace().length >= 2));
