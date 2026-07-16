import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cykParse,
  SAMPLE_GRAMMAR,
  type CnfGrammar,
} from '../../src/algorithms/parsing/cyk-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/cyk-parser/trace.ts';

test('cyk-parser 接受 aabb（a^n b^n, n=2）', () => {
  assert.equal(cykParse('aabb', SAMPLE_GRAMMAR), true);
});

test('cyk-parser 接受 ab（n=1）', () => {
  assert.equal(cykParse('ab', SAMPLE_GRAMMAR), true);
});

test('cyk-parser 接受 aaabbb（n=3）', () => {
  assert.equal(cykParse('aaabbb', SAMPLE_GRAMMAR), true);
});

test('cyk-parser 接受 aaaabbbb（n=4）', () => {
  assert.equal(cykParse('aaaabbbb', SAMPLE_GRAMMAR), true);
});

test('cyk-parser 拒绝 ba（顺序错误）', () => {
  assert.equal(cykParse('ba', SAMPLE_GRAMMAR), false);
});

test('cyk-parser 拒绝 aab（b 数量不足）', () => {
  assert.equal(cykParse('aab', SAMPLE_GRAMMAR), false);
});

test('cyk-parser 拒绝 abb（a 数量不足）', () => {
  assert.equal(cykParse('abb', SAMPLE_GRAMMAR), false);
});

test('cyk-parser 拒绝空串（CNF 无 ε 规则）', () => {
  assert.equal(cykParse('', SAMPLE_GRAMMAR), false);
});

test('cyk-parser 拒绝含非法字符的输入', () => {
  assert.equal(cykParse('aacb', SAMPLE_GRAMMAR), false);
});

test('cyk-parser 自定义文法：识别 a* （A → a | AA）', () => {
  const g: CnfGrammar = {
    start: 'A',
    terminalRules: { A: ['a'] },
    binaryRules: [{ lhs: 'A', rhs1: 'A', rhs2: 'A' }],
  };
  assert.equal(cykParse('a', g), true);
  assert.equal(cykParse('aaa', g), true);
  assert.equal(cykParse('aaaaa', g), true);
  assert.equal(cykParse('b', g), false);
  assert.equal(cykParse('aab', g), false);
});

test('cyk-parser 自定义文法：识别 ab|cd', () => {
  const g: CnfGrammar = {
    start: 'S',
    terminalRules: { A: ['a'], B: ['b'], C: ['c'], D: ['d'] },
    binaryRules: [
      { lhs: 'S', rhs1: 'A', rhs2: 'B' },
      { lhs: 'S', rhs1: 'C', rhs2: 'D' },
    ],
  };
  assert.equal(cykParse('ab', g), true);
  assert.equal(cykParse('cd', g), true);
  assert.equal(cykParse('abcd', g), false);
  assert.equal(cykParse('ac', g), false);
});

test('cyk-parser 钩子被调用', () => {
  let cells = 0;
  let results = 0;
  cykParse('aabb', SAMPLE_GRAMMAR, {
    onCell: () => cells++,
    onResult: () => results++,
  });
  // aabb n=4：len=1 有 4 格，len=2 有 3 格，len=3 有 2 格，len=4 有 1 格 = 10
  assert.equal(cells, 10);
  assert.equal(results, 1);
});

test('cyk-parser onCell 内容正确（对角线）', () => {
  const diagonal: string[][] = [[], [], [], []];
  cykParse('aabb', SAMPLE_GRAMMAR, {
    onCell: (i, len, nts) => {
      if (len === 1) diagonal[i] = nts;
    },
  });
  // input[0]='a' → {A}, input[1]='a' → {A}, input[2]='b' → {B}, input[3]='b' → {B}
  assert.deepEqual(diagonal[0], ['A']);
  assert.deepEqual(diagonal[1], ['A']);
  assert.deepEqual(diagonal[2], ['B']);
  assert.deepEqual(diagonal[3], ['B']);
});

test('cyk-parser onResult 接受时为 true', () => {
  let res: boolean | null = null;
  cykParse('aabb', SAMPLE_GRAMMAR, {
    onResult: (a) => (res = a),
  });
  assert.equal(res, true);
});

test('cyk-parser onResult 拒绝时为 false', () => {
  let res: boolean | null = null;
  cykParse('ba', SAMPLE_GRAMMAR, {
    onResult: (a) => (res = a),
  });
  assert.equal(res, false);
});

test('cyk-parser 单字符但文法要求至少 2 字符', () => {
  // SAMPLE_GRAMMAR 的 S 至少需 AB（ab）才能产生，单 a 不能被 S 推导
  assert.equal(cykParse('a', SAMPLE_GRAMMAR), false);
});

test('buildTrace 生成 grid 帧', () => {
  const frames = buildTrace('aabb');
  assert.ok(frames.length >= 4);
  // 终帧应有 grid
  const last = frames[frames.length - 1]!;
  assert.ok(last.array2d, '终帧应有 grid');
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res);
  assert.equal(res!.value, 'ACCEPT');
});

test('buildTrace 拒绝时结果为 REJECT', () => {
  const frames = buildTrace('ba');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.equal(res!.value, 'REJECT');
});
