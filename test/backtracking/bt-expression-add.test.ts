import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addOperators } from '../../src/algorithms/backtracking/bt-expression-add/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-expression-add/trace.ts';
test('addOperators 正确', () => {
  const r = addOperators('123', 6);
  assert.ok(r.includes('1+2+3'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
