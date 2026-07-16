import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fizzBuzz, fizzBuzzOf } from '../../src/algorithms/misc/fizzbuzz-impl/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/fizzbuzz-impl/trace.ts';

test('fizzBuzz 基本序列（前 15）', () => {
  const out = fizzBuzz(15);
  assert.deepEqual(out, [
    '1',
    '2',
    'Fizz',
    '4',
    'Buzz',
    'Fizz',
    '7',
    '8',
    'Fizz',
    'Buzz',
    '11',
    'Fizz',
    '13',
    '14',
    'FizzBuzz',
  ]);
});

test('fizzBuzz n=0 返回空数组', () => {
  assert.deepEqual(fizzBuzz(0), []);
});

test('fizzBuzz n=3', () => {
  assert.deepEqual(fizzBuzz(3), ['1', '2', 'Fizz']);
});

test('fizzBuzz n=5', () => {
  assert.deepEqual(fizzBuzz(5), ['1', '2', 'Fizz', '4', 'Buzz']);
});

test('fizzBuzzOf 单个数字', () => {
  assert.equal(fizzBuzzOf(1), '1');
  assert.equal(fizzBuzzOf(3), 'Fizz');
  assert.equal(fizzBuzzOf(5), 'Buzz');
  assert.equal(fizzBuzzOf(15), 'FizzBuzz');
  assert.equal(fizzBuzzOf(30), 'FizzBuzz');
  assert.equal(fizzBuzzOf(9), 'Fizz');
  assert.equal(fizzBuzzOf(25), 'Buzz');
  assert.equal(fizzBuzzOf(7), '7');
});

test('fizzBuzzOf 非法输入抛错', () => {
  assert.throws(() => fizzBuzzOf(0));
  assert.throws(() => fizzBuzzOf(-1));
  assert.throws(() => fizzBuzzOf(1.5));
});

test('fizzBuzz 非法输入抛错', () => {
  assert.throws(() => fizzBuzz(-1));
  assert.throws(() => fizzBuzz(1.5));
});

test('fizzBuzz 被 15 整除必为 FizzBuzz', () => {
  for (let i = 15; i <= 150; i += 15) {
    assert.equal(fizzBuzzOf(i), 'FizzBuzz');
  }
});

test('fizzBuzz 长度等于 n', () => {
  for (const n of [1, 10, 50, 100]) {
    assert.equal(fizzBuzz(n).length, n);
  }
});

test('fizzBuzz 钩子：onNumber 触发 n 次', () => {
  let count = 0;
  fizzBuzz(20, { onNumber: () => count++ });
  assert.equal(count, 20);
});

test('fizzBuzz 钩子：onResult 返回完整序列', () => {
  let result: string[] = [];
  fizzBuzz(10, { onResult: (o) => (result = o) });
  assert.equal(result.length, 10);
  assert.equal(result[2], 'Fizz');
});

test('buildTrace 含 array 与 aux，末帧含总数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '总数');
  assert.ok(c, '末帧应含总数');
});
