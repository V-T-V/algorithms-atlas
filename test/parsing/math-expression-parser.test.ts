import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  evalMath,
  DEFAULT_CONSTANTS,
} from '../../src/algorithms/parsing/math-expression-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/math-expression-parser/trace.ts';

test('math-expression-parser：基础四则运算', () => {
  assert.equal(evalMath('1 + 2 * 3'), 7);
  assert.equal(evalMath('(1 + 2) * 3'), 9);
  assert.equal(evalMath('10 - 4 / 2'), 8);
});

test('math-expression-parser：幂运算右结合', () => {
  // 2^3^2 = 2^(3^2) = 2^9 = 512
  assert.equal(evalMath('2^3^2'), 512);
  assert.equal(evalMath('2^3'), 8);
});

test('math-expression-parser：一元负号', () => {
  assert.equal(evalMath('-5'), -5);
  assert.equal(evalMath('-(2 + 3)'), -5);
  assert.equal(evalMath('3 * -2'), -6);
});

test('math-expression-parser：常量 pi / e', () => {
  assert.equal(evalMath('pi'), DEFAULT_CONSTANTS.pi);
  assert.equal(evalMath('e'), DEFAULT_CONSTANTS.e);
});

test('math-expression-parser：内置函数调用', () => {
  assert.equal(evalMath('sqrt(16)'), 4);
  assert.equal(evalMath('abs(-7)'), 7);
  assert.equal(evalMath('max(1, 5, 3)'), 5);
  assert.equal(evalMath('min(1, 5, 3)'), 1);
  assert.equal(evalMath('pow(2, 10)'), 1024);
});

test('math-expression-parser：嵌套函数与表达式', () => {
  // max(sin(0), 2^3) + sqrt(16) = max(0,8) + 4 = 12
  assert.equal(evalMath('max(sin(0), 2^3) + sqrt(16)'), 12);
});

test('math-expression-parser：自定义函数与常量环境', () => {
  const r = evalMath('f(3) + k', {
    functions: { f: (x) => x * x },
    constants: { k: 10 },
  });
  assert.equal(r, 19);
});

test('math-expression-parser：空白字符容错', () => {
  assert.equal(evalMath('   1   +   2   '), 3);
});

test('math-expression-parser：浮点数字面量', () => {
  assert.equal(evalMath('3.5 + 1.5'), 5);
  assert.equal(evalMath('0.5 * 4'), 2);
});

test('math-expression-parser：未知标识符抛错', () => {
  assert.throws(() => evalMath('unknownVar'), /未知标识符/);
});

test('math-expression-parser：未知函数抛错', () => {
  assert.throws(() => evalMath('nosuchfn(1)'), /未知函数/);
});

test('math-expression-parser：未消费字符抛错', () => {
  assert.throws(() => evalMath('1 + 2 foo'), /未消费字符/);
});

test('math-expression-parser：钩子触发', () => {
  const called: string[] = [];
  const result = evalMath('sqrt(16) + 1', {}, {
    onCall: (name, _args, _result) => called.push(name),
    onResult: (v) => called.push(`result=${v}`),
  });
  assert.equal(result, 5);
  assert.ok(called.includes('sqrt'));
  assert.ok(called.includes('result=5'));
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
});
