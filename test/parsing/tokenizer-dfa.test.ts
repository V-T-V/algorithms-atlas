import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenize, withoutWhitespace } from '../../src/algorithms/parsing/tokenizer-dfa/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/tokenizer-dfa/trace.ts';

test('tokenize 标识符与数字', () => {
  const toks = withoutWhitespace(tokenize('x42 = 7'));
  assert.deepEqual(
    toks.map((t) => [t.type, t.value]),
    [
      ['identifier', 'x42'],
      ['operator', '='],
      ['number', '7'],
    ],
  );
});

test('tokenize 多字符运算符', () => {
  const toks = withoutWhitespace(tokenize('a == b'));
  assert.equal(toks[1]!.type, 'operator');
  assert.equal(toks[1]!.value, '==');
});

test('tokenize 标点', () => {
  const toks = withoutWhitespace(tokenize('(x);'));
  assert.deepEqual(
    toks.map((t) => t.value),
    ['(', 'x', ')', ';'],
  );
});

test('tokenize 跳过空白', () => {
  const all = tokenize('  a  b  ');
  assert.equal(all[0]!.type, 'whitespace');
  const noWs = withoutWhitespace(all);
  assert.equal(noWs.length, 2);
});

test('tokenize 记录位置', () => {
  const toks = tokenize('ab 12');
  assert.equal(toks[0]!.position, 0);
  // ab 在 0，ws 在 2，12 在 4
  assert.equal(toks[2]!.position, 3);
});

test('tokenize 空字符串', () => {
  assert.deepEqual(tokenize(''), []);
});

test('tokenize 钩子触发', () => {
  let emits = 0;
  tokenize('a b', { onEmit: () => emits++ });
  assert.ok(emits >= 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
