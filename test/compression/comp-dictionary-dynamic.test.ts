import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dynDictEncode,
  dynDictDecode,
} from '../../src/algorithms/compression/comp-dictionary-dynamic/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-dictionary-dynamic/trace.ts';

function roundtrip(text: string): void {
  const codes = dynDictEncode(text);
  assert.equal(dynDictDecode(codes), text);
}

test('dyn-dict 重复模式往返', () => {
  roundtrip('ABABABABABABABA');
});

test('dyn-dict 无重复往返', () => {
  roundtrip('abcdefg');
});

test('dyn-dict 空输入', () => {
  assert.deepEqual(dynDictEncode(''), []);
  assert.equal(dynDictDecode([]), '');
});

test('dyn-dict 单字符', () => {
  assert.deepEqual(dynDictEncode('A'), [65]);
  assert.equal(dynDictDecode([65]), 'A');
});

test('dyn-dict 重复压缩有效', () => {
  const codes = dynDictEncode('AAAAAAAAAA');
  assert.ok(codes.length < 10);
});

test('dyn-dict DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
