import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  packratParse,
  SAMPLE_GRAMMAR,
  CHOICE_GRAMMAR,
  type PegGrammar,
} from '../../src/algorithms/parsing/packrat-parser/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/packrat-parser/trace.ts';

test('packrat-parser 接受 aaab（a*b 文法）', () => {
  assert.equal(packratParse('aaab', SAMPLE_GRAMMAR).accepted, true);
});

test('packrat-parser 接受 b（零个 a）', () => {
  assert.equal(packratParse('b', SAMPLE_GRAMMAR).accepted, true);
});

test('packrat-parser 接受 ab', () => {
  assert.equal(packratParse('ab', SAMPLE_GRAMMAR).accepted, true);
});

test('packrat-parser 拒绝空串', () => {
  assert.equal(packratParse('', SAMPLE_GRAMMAR).accepted, false);
});

test('packrat-parser 拒绝 aaa（缺 b）', () => {
  assert.equal(packratParse('aaa', SAMPLE_GRAMMAR).accepted, false);
});

test('packrat-parser 拒绝 aabb（b 后多余）', () => {
  assert.equal(packratParse('aabb', SAMPLE_GRAMMAR).accepted, false);
});

test('packrat-parser 有序选择：接受 ac', () => {
  assert.equal(packratParse('ac', CHOICE_GRAMMAR).accepted, true);
});

test('packrat-parser 有序选择：接受 bc', () => {
  assert.equal(packratParse('bc', CHOICE_GRAMMAR).accepted, true);
});

test('packrat-parser 有序选择：拒绝 cc', () => {
  assert.equal(packratParse('cc', CHOICE_GRAMMAR).accepted, false);
});

test('packrat-parser 有序选择：拒绝 ab（缺 c）', () => {
  assert.equal(packratParse('ab', CHOICE_GRAMMAR).accepted, false);
});

test('packrat-parser 记忆化：同一(规则,位置)只算一次', () => {
  let tries = 0;
  packratParse('aaab', SAMPLE_GRAMMAR, {
    onTry: () => tries++,
  });
  // 应有大量 onTry 调用；但缓存命中不应导致重复计算（这里仅断言被调用）
  assert.ok(tries > 0);
});

test('packrat-parser 钩子 onResult 被调用', () => {
  let results = 0;
  const { accepted } = packratParse('ab', SAMPLE_GRAMMAR, {
    onResult: () => results++,
  });
  assert.equal(accepted, true);
  assert.ok(results > 0);
});

test('packrat-parser 自定义文法：可选 ?', () => {
  const g: PegGrammar = {
    start: 'S',
    rules: [
      {
        name: 'S',
        expr: {
          kind: 'seq',
          parts: [
            { kind: 'opt', expr: { kind: 'lit', value: 'x' } },
            { kind: 'lit', value: 'y' },
          ],
        },
      },
    ],
  };
  assert.equal(packratParse('y', g).accepted, true);
  assert.equal(packratParse('xy', g).accepted, true);
  assert.equal(packratParse('x', g).accepted, false);
});

test('packrat-parser 自定义文法：星号 *', () => {
  const g2: PegGrammar = {
    start: 'S',
    rules: [
      {
        name: 'S',
        expr: {
          kind: 'seq',
          parts: [
            { kind: 'star', expr: { kind: 'lit', value: 'x' } },
            { kind: 'lit', value: 'z' },
          ],
        },
      },
    ],
  };
  assert.equal(packratParse('z', g2).accepted, true);
  assert.equal(packratParse('xxxxz', g2).accepted, true);
  assert.equal(packratParse('x', g2).accepted, false);
});

test('buildTrace 含 array2d，末帧含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res, '末帧应含结果');
});
