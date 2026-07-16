import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluate,
  num,
  varr,
  addE,
  mulE,
} from '../../src/algorithms/design/design-interpreter/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-interpreter/trace.ts';
test('解释 (3+4)*3', () => {
  const ctx = new Map([
    ['x', 3],
    ['y', 4],
  ]);
  assert.equal(evaluate(mulE(addE(varr('x'), varr('y')), varr('x')), ctx), 21);
});
test('解释器 trace 非空', () => assert.ok(buildTrace().length > 0));
