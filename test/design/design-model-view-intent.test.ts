import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  reduce,
  view,
  type Model,
} from '../../src/algorithms/design/design-model-view-intent/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-model-view-intent/trace.ts';
test('mvi reduce', () => {
  let m: Model = { count: 0 };
  m = reduce(m, { type: 'inc', payload: 3 });
  m = reduce(m, { type: 'dec', payload: 1 });
  assert.equal(m.count, 2);
});
test('mvi view', () => assert.equal(view({ count: 5 }), 'count=5'));
test('mvi trace 非空', () => assert.ok(buildTrace().length > 0));
