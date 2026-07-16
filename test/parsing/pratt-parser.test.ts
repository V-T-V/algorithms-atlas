import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prattParse, evalExpr, tokenize } from '../../src/algorithms/parsing/pratt-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/pratt-parser/trace.ts';

test('pratt-parser 简单加减', () => {
  assert.equal(evalExpr('1 + 2'), 3);
  assert.equal(evalExpr('10 - 3'), 7);
});

test('pratt-parser 乘除', () => {
  assert.equal(evalExpr('4 * 5'), 20);
  assert.equal(evalExpr('8 / 4'), 2);
});

test('pratt-parser 优先级：* 高于 +', () => {
  assert.equal(evalExpr('1 + 2 * 3'), 7); // 1 + (2*3) = 7
});

test('pratt-parser 优先级：/ 高于 -', () => {
  assert.equal(evalExpr('10 - 6 / 2'), 7); // 10 - (6/2) = 7
});

test('pratt-parser 括号', () => {
  assert.equal(evalExpr('(1 + 2) * 3'), 9); // (1+2)*3 = 9
  assert.equal(evalExpr('2 * (3 + 4)'), 14);
});

test('pratt-parser ^ 右结合', () => {
  assert.equal(evalExpr('2 ^ 3 ^ 2'), 512); // 2^(3^2) = 2^9 = 512
});

test('pratt-parser ^ 高于 *', () => {
  assert.equal(evalExpr('2 * 3 ^ 2'), 18); // 2 * (3^2) = 18
});

test('pratt-parser 左结合 + -', () => {
  assert.equal(evalExpr('1 - 2 - 3'), -4); // (1-2)-3 = -4
  assert.equal(evalExpr('8 / 4 / 2'), 1); // (8/4)/2 = 1
});

test('pratt-parser 综合', () => {
  assert.equal(evalExpr('1 + 2 * 3 ^ 2'), 19); // 1 + (2*(3^2)) = 1+18 = 19
  assert.equal(evalExpr('(1 + 2) * (3 + 4)'), 21);
});

test('pratt-parser 嵌套括号', () => {
  assert.equal(evalExpr('((1 + 2) * 3) - 4'), 5);
  assert.equal(evalExpr('(((2)))'), 2);
});

test('pratt-parser 单数字', () => {
  assert.equal(evalExpr('42'), 42);
  assert.equal(evalExpr('3.5'), 3.5);
});

test('pratt-parser 一元负号', () => {
  assert.equal(evalExpr('-5'), -5);
  assert.equal(evalExpr('3 + -2'), 1);
});

test('pratt-parser token 数组直接调用', () => {
  assert.equal(prattParse(['1', '+', '2', '*', '3']), 7);
  assert.equal(prattParse(['2', '^', '3', '^', '2']), 512);
});

test('pratt-parser tokenize', () => {
  assert.deepEqual(tokenize('1 + 2 * 3'), ['1', '+', '2', '*', '3']);
  assert.deepEqual(tokenize('(1+2)*3'), ['(', '1', '+', '2', ')', '*', '3']);
  assert.deepEqual(tokenize('2^3^2'), ['2', '^', '3', '^', '2']);
});

test('pratt-parser 钩子被调用', () => {
  let numbers = 0;
  let binaries = 0;
  let enters = 0;
  let results = 0;
  evalExpr('1 + 2 * 3', {
    onNumber: () => numbers++,
    onBinary: () => binaries++,
    onEnter: () => enters++,
    onResult: () => results++,
  });
  assert.equal(numbers, 3); // 1, 2, 3
  assert.equal(binaries, 2); // *, +
  assert.ok(enters >= 1);
  assert.equal(results, 1);
});

test('pratt-parser onBinary 记录正确运算', () => {
  const ops: Array<{ op: string; result: number }> = [];
  evalExpr('1 + 2 * 3', {
    onBinary: (op, _l, _r, result) => ops.push({ op, result }),
  });
  // 先算 2*3=6，再算 1+6=7
  assert.deepEqual(ops, [
    { op: '*', result: 6 },
    { op: '+', result: 7 },
  ]);
});

test('pratt-parser 未知运算符抛错', () => {
  assert.throws(() => evalExpr('1 # 2'));
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace('1 + 2 * 3');
  assert.ok(frames.length >= 4);
  for (const f of frames) assert.ok(f.aux, '每帧应有 aux');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res);
  assert.equal(res!.value, '7');
});

test('buildTrace 右结合 ^', () => {
  const frames = buildTrace('2 ^ 3 ^ 2');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.equal(res!.value, '512');
});
