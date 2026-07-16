import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StatefulLexer } from '../../src/algorithms/parsing/parse-lexer-state/impl.ts';

test('stateful lexer 标识符与数字', () => {
  const lex = new StatefulLexer({
    INIT: [
      { re: /[A-Za-z_]\w*/g, type: 'ID' },
      { re: / d+/g, type: 'NUM' },
      { re: / s+/g, type: 'SKIP' },
    ],
  });
  assert.deepEqual(lex.lex('foo 42'), [
    { type: 'ID', value: 'foo' },
    { type: 'NUM', value: '42' },
  ]);
});
test('stateful lexer 字符串状态', () => {
  const lex = new StatefulLexer({
    INIT: [
      { re: /"/g, type: 'QUOTE', pushState: 'STR' },
      { re: /[^"]/g, type: 'OTHER' },
    ],
    STR: [
      { re: /[^"]+/g, type: 'STRTEXT' },
      { re: /"/g, type: 'QUOTE', popState: true },
    ],
  });
  assert.deepEqual(
    lex.lex('"ab"').map((x) => x.type),
    ['QUOTE', 'STRTEXT', 'QUOTE'],
  );
});
