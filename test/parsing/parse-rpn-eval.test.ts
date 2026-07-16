import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rpnEval } from '../../src/algorithms/parsing/parse-rpn-eval/impl.ts';

test('rpn-eval 基本算术', () => {
  assert.equal(rpnEval(['3', '4', '+']), 7);
  assert.equal(rpnEval(['3', '4', '2', '*', '+']), 11);
});
test('rpn-eval 幂运算', () => {
  assert.equal(rpnEval(['2', '3', '^']), 8);
});
test('rpn-eval 复合', () => {
  // 3 4 + 2 * = 14
  assert.equal(rpnEval(['3', '4', '+', '2', '*']), 14);
});
