import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  earleyParse,
  isNonTerminal,
  SAMPLE_GRAMMAR,
  type Grammar,
} from '../../src/algorithms/parsing/earley-parser/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/earley-parser/trace.ts';

test('earley-parser 接受 id+id*id', () => {
  assert.equal(earleyParse(['id', '+', 'id', '*', 'id'], SAMPLE_GRAMMAR).accepted, true);
});

test('earley-parser 接受 id', () => {
  assert.equal(earleyParse(['id'], SAMPLE_GRAMMAR).accepted, true);
});

test('earley-parser 接受 (id+id)', () => {
  assert.equal(earleyParse(['(', 'id', '+', 'id', ')'], SAMPLE_GRAMMAR).accepted, true);
});

test('earley-parser 接受嵌套括号 ((id))', () => {
  assert.equal(earleyParse(['(', '(', 'id', ')', ')'], SAMPLE_GRAMMAR).accepted, true);
});

test('earley-parser 接受 id*id+id', () => {
  assert.equal(earleyParse(['id', '*', 'id', '+', 'id'], SAMPLE_GRAMMAR).accepted, true);
});

test('earley-parser 拒绝 id+', () => {
  assert.equal(earleyParse(['id', '+'], SAMPLE_GRAMMAR).accepted, false);
});

test('earley-parser 拒绝 +id', () => {
  assert.equal(earleyParse(['+', 'id'], SAMPLE_GRAMMAR).accepted, false);
});

test('earley-parser 拒绝空输入', () => {
  assert.equal(earleyParse([], SAMPLE_GRAMMAR).accepted, false);
});

test('earley-parser 拒绝未闭合括号 (id', () => {
  assert.equal(earleyParse(['(', 'id'], SAMPLE_GRAMMAR).accepted, false);
});

test('earley-parser chart 有 n+1 个状态集', () => {
  const { chart } = earleyParse(['id', '+', 'id'], SAMPLE_GRAMMAR);
  assert.equal(chart.length, 4); // 3 tokens + 1
});

test('earley-parser isNonTerminal 正确', () => {
  assert.equal(isNonTerminal('E', SAMPLE_GRAMMAR), true);
  assert.equal(isNonTerminal('id', SAMPLE_GRAMMAR), false);
  assert.equal(isNonTerminal('+', SAMPLE_GRAMMAR), false);
});

test('earley-parser 钩子触发（扫描/预测/完成）', () => {
  let predicts = 0,
    scans = 0,
    completes = 0,
    accepted = false;
  earleyParse(['id', '+', 'id'], SAMPLE_GRAMMAR, {
    onPredict: () => predicts++,
    onScan: () => scans++,
    onComplete: () => completes++,
    onResult: (a) => (accepted = a),
  });
  assert.ok(predicts > 0);
  assert.ok(scans >= 3);
  assert.ok(completes > 0);
  assert.equal(accepted, true);
});

test('earley-parser 自定义文法：a^n b^n（任意 CFG）', () => {
  const g: Grammar = {
    start: 'S',
    productions: [
      { lhs: 'S', rhs: ['S', 'b'] }, // 注意：Earley 处理左递归
      { lhs: 'S', rhs: ['a'] },
    ],
  };
  // 这个文法实际接受 a b^n（一个 a 后跟若干 b）；调整：
  const g2: Grammar = {
    start: 'S',
    productions: [
      { lhs: 'S', rhs: ['a', 'S', 'b'] },
      { lhs: 'S', rhs: ['a', 'b'] },
    ],
  };
  assert.equal(earleyParse(['a', 'b'], g2).accepted, true);
  assert.equal(earleyParse(['a', 'a', 'b', 'b'], g2).accepted, true);
  assert.equal(earleyParse(['b', 'a'], g2).accepted, false);
  void g;
});

test('earley-parser 处理左递归文法', () => {
  // E → E + E | id （左递归，非 LR 但 Earley 可处理）
  const g: Grammar = {
    start: 'E',
    productions: [
      { lhs: 'E', rhs: ['E', '+', 'E'] },
      { lhs: 'E', rhs: ['id'] },
    ],
  };
  assert.equal(earleyParse(['id', '+', 'id', '+', 'id'], g).accepted, true);
});

test('buildTrace 含 array2d，末帧含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res, '末帧应含结果');
});
