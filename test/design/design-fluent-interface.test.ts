import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Counter } from '../../src/algorithms/design/design-fluent-interface/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-fluent-interface/trace.ts';
test('流式 ((5-2)*3)+1 = 10', () =>
  assert.equal(new Counter().add(5).sub(2).mul(3).add(1).value(), 10));
test('fluent trace 非空', () => assert.ok(buildTrace().length > 0));
