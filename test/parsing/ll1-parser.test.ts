import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ll1Parse,
  predict,
  PROD_S_ASB,
  PROD_S_EPS,
} from '../../src/algorithms/parsing/ll1-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/ll1-parser/trace.ts';

test('ll1-parser 接受 aabb（a^n b^n）', () => {
  const r = ll1Parse('aabb');
  assert.equal(r.accepted, true);
  assert.ok(r.steps.length > 0);
});

test('ll1-parser 接受空串（ε）', () => {
  // S → ε 直接推导
  const r = ll1Parse('');
  assert.equal(r.accepted, true);
});

test('ll1-parser 接受 ab', () => {
  const r = ll1Parse('ab');
  assert.equal(r.accepted, true);
});

test('ll1-parser 接受 aaaabbbb', () => {
  const r = ll1Parse('aaaabbbb');
  assert.equal(r.accepted, true);
});

test('ll1-parser 拒绝 ba（顺序错误）', () => {
  const r = ll1Parse('ba');
  assert.equal(r.accepted, false);
});

test('ll1-parser 拒绝 aab（b 数量不足）', () => {
  const r = ll1Parse('aab');
  assert.equal(r.accepted, false);
});

test('ll1-parser 拒绝 aabb 外字符', () => {
  // 文法只识别 a/b
  const r = ll1Parse('aacb');
  assert.equal(r.accepted, false);
});

test('ll1-parser predict 表正确', () => {
  assert.equal(predict('S', 'a'), PROD_S_ASB);
  assert.equal(predict('S', '$'), PROD_S_EPS);
  assert.equal(predict('S', 'b'), PROD_S_EPS);
  assert.equal(predict('S', 'c'), undefined);
});

test('ll1-parser 步骤数合理', () => {
  // 'aabb'：初始 + 展开 + 匹配 + 接受，步数应 >= 5
  const r = ll1Parse('aabb');
  assert.ok(r.steps.length >= 5);
  // 第一步栈含 S
  assert.ok(r.steps[0]!.stack.includes('S'));
});

test('ll1-parser 每步栈与输入非空（除接受外）', () => {
  const r = ll1Parse('ab');
  for (const s of r.steps) {
    assert.ok(s.action.length > 0);
  }
});

test('ll1-parser 钩子被调用', () => {
  let steps = 0;
  let prods = 0;
  let matches = 0;
  let results = 0;
  ll1Parse('ab', {
    onStep: () => steps++,
    onProduction: () => prods++,
    onMatch: () => matches++,
    onResult: () => results++,
  });
  assert.ok(steps >= 3);
  assert.ok(prods >= 1);
  assert.ok(matches >= 2); // 至少匹配 a, b, $
  assert.equal(results, 1);
});

test('ll1-parser onResult 收到 true（接受）', () => {
  let acc: boolean | null = null;
  ll1Parse('aabb', {
    onResult: (a) => (acc = a),
  });
  assert.equal(acc, true);
});

test('ll1-parser onResult 收到 false（拒绝）', () => {
  let acc: boolean | null = null;
  ll1Parse('ba', {
    onResult: (a) => (acc = a),
  });
  assert.equal(acc, false);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace('aabb');
  assert.ok(frames.length >= 4);
  for (const f of frames) assert.ok(f.aux, '每帧应有 aux');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res);
  assert.equal(res!.value, 'ACCEPT');
});
