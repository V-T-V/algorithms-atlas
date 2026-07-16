import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  glrParse,
  demoGrammar,
  DEMO_TOKENS,
  tokenizeExpr,
  buildAutomaton,
  type Rule,
} from '../../src/algorithms/parsing/glr-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/glr-parser/trace.ts';

const { rules, startLhs } = demoGrammar();

test('glr-parser 接受单个 n', () => {
  assert.equal(glrParse(['n'], rules, startLhs).accepted, true);
});

test('glr-parser 接受 n+n', () => {
  assert.equal(glrParse(['n', '+', 'n'], rules, startLhs).accepted, true);
});

test('glr-parser 接受 n+n*n（歧义表达式）', () => {
  assert.equal(glrParse(DEMO_TOKENS, rules, startLhs).accepted, true);
});

test('glr-parser 接受 n*n+n', () => {
  assert.equal(glrParse(['n', '*', 'n', '+', 'n'], rules, startLhs).accepted, true);
});

test('glr-parser 拒绝空输入', () => {
  assert.equal(glrParse([], rules, startLhs).accepted, false);
});

test('glr-parser 拒绝 n+（不完整）', () => {
  assert.equal(glrParse(['n', '+'], rules, startLhs).accepted, false);
});

test('glr-parser 拒绝 +n（以运算符开头）', () => {
  assert.equal(glrParse(['+', 'n'], rules, startLhs).accepted, false);
});

test('glr-parser 拒绝 n n（缺运算符）', () => {
  assert.equal(glrParse(['n', 'n'], rules, startLhs).accepted, false);
});

test('glr-parser 在歧义位置产生栈头分裂', () => {
  let maxHeads = 1;
  glrParse(DEMO_TOKENS, rules, startLhs, {
    onSplit: (_pos, n) => {
      maxHeads = Math.max(maxHeads, n);
    },
  });
  // n+n*n 在 * 处应分裂为 ≥2 个栈头（GLR 标志性行为）
  assert.ok(maxHeads >= 2, `歧义位置应分裂，实际最大栈头数 ${maxHeads}`);
});

test('glr-parser LR(0) 自动机状态数合理', () => {
  // 增广后 E' → E, E → E+E, E → E*E, E → n 应产生若干状态
  const augRules: Rule[] = [{ lhs: "E'", rhs: ['E'] }, ...rules];
  const auto = buildAutomaton(augRules, "E'");
  assert.ok(auto.states.length >= 5, `状态数应 ≥5，实际 ${auto.states.length}`);
});

test('glr-parser 触发归约钩子', () => {
  let reduceCount = 0;
  glrParse(['n', '+', 'n'], rules, startLhs, {
    onReduce: () => reduceCount++,
  });
  // n→E, E+E→E, E'→E 至少 3 次
  assert.ok(reduceCount >= 3, `归约次数应 ≥3，实际 ${reduceCount}`);
});

test('glr-parser tokenizeExpr 归一数字为 n', () => {
  assert.deepEqual(tokenizeExpr('1 + 2 * 3'), ['n', '+', 'n', '*', 'n']);
  assert.deepEqual(tokenizeExpr('42'), ['n']);
});

test('buildTrace 生成多帧，末帧含结果', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3, `帧数应 ≥3，实际 ${frames.length}`);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res, '末帧应含结果');
  assert.match(res!.value, /接受/);
});
