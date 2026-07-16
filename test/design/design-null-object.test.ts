import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runWithLogger, NullLogger } from '../../src/algorithms/design/design-null-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-null-object/trace.ts';
test('null logger 计数仍准确', () => assert.equal(runWithLogger(new NullLogger(), ['a', 'b']), 2));
test('null-object trace 非空', () => assert.ok(buildTrace().length > 0));
