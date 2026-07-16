import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btExpressionAdd2 } from '../../src/algorithms/backtracking/bt-expression-add-2/impl.ts';

test('bt-expression-add-2 "123" target 6', () => {
  const r = btExpressionAdd2('123', 6).sort();
  // 1+2+3=6, 1*2*3=6
  assert.deepEqual(r, ['1*2*3', '1+2+3']);
});

test('bt-expression-add-2 "232" target 8', () => {
  const r = btExpressionAdd2('232', 8).sort();
  assert.ok(r.includes('2*3+2'));
  assert.ok(r.includes('2+3*2'));
});

test('bt-expression-add-2 "105" target 5', () => {
  const r = btExpressionAdd2('105', 5).sort();
  // 1*0+5=5, 10-5=5, 1*5=5? no (1*0+5,10-5,1*0+5) ; 应含 "10-5"
  assert.ok(r.includes('10-5'));
});

test('bt-expression-add-2 无解返回空', () => {
  assert.deepEqual(btExpressionAdd2('99', 0), []);
});
