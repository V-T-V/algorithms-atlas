import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  expressionAddOperators,
  type ExpressionAddOperatorsHooks,
} from '../../src/algorithms/backtracking/expression-add-operators/impl.ts';

const sort = (xs: string[]): string[] => [...xs].sort();

test('expression-add-operators num="123" target=6', () => {
  // 1+2+3=6, 1*2*3=6
  assert.deepEqual(sort(expressionAddOperators('123', 6)), sort(['1+2+3', '1*2*3']));
});

test('expression-add-operators num="232" target=8', () => {
  // 2+3*2=8, 2*3+2=8
  const got = sort(expressionAddOperators('232', 8));
  assert.deepEqual(got, sort(['2+3*2', '2*3+2']));
});

test('expression-add-operators num="105" target=5', () => {
  // target=5: "10-5"=5, "1*0+5"=5；注意 1+0+5=6 不等于 5
  const got = expressionAddOperators('105', 5);
  assert.ok(got.includes('10-5'));
  assert.ok(got.includes('1*0+5'));
  // 不应出现前导零形式（如 "1*05"）
  assert.ok(!got.some((e) => e.includes('05')));
});

test('expression-add-operators num="105" target=6', () => {
  // target=6: "1+0+5"=6, "1-0+5"=6
  const got = expressionAddOperators('105', 6);
  assert.ok(got.includes('1+0+5'));
  assert.ok(got.includes('1-0+5'));
});

test('expression-add-operators num="00" target=0', () => {
  // 0+0, 0-0, 0*0, 00(非法)
  const got = expressionAddOperators('00', 0);
  assert.ok(got.includes('0+0'));
  assert.ok(got.includes('0-0'));
  assert.ok(got.includes('0*0'));
  // "00" 单独不合法（前导零）
  assert.ok(!got.includes('00'));
});

test('expression-add-operators 无解', () => {
  assert.deepEqual(expressionAddOperators('12', 100), []);
});

test('expression-add-operators 空串', () => {
  assert.deepEqual(expressionAddOperators('', 0), []);
});

test('expression-add-operators 单数字等于 target', () => {
  assert.deepEqual(expressionAddOperators('5', 5), ['5']);
  assert.deepEqual(expressionAddOperators('5', 6), []);
});

test('expression-add-operators 乘法优先级正确', () => {
  // num="234" target=14: 2+3*4=14
  const got = expressionAddOperators('234', 14);
  assert.ok(got.includes('2+3*4'));
  // num="345" target=15: 3+4+5? =12; 3*4+5=17; 3+4*5=23 → 无
  assert.deepEqual(expressionAddOperators('345', 15), []);
});

test('expression-add-operators 钩子被调用', () => {
  let solutions = 0;
  let segments = 0;
  const hooks: ExpressionAddOperatorsHooks = {
    onSolution: () => solutions++,
    onSegment: () => segments++,
  };
  expressionAddOperators('123', 6, hooks);
  assert.equal(solutions, 2);
  assert.ok(segments > 0);
});
