import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  staticDictEncode,
  staticDictDecode,
  DEFAULT_DICT,
} from '../../src/algorithms/compression/comp-dictionary-static/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-dictionary-static/trace.ts';

function roundtrip(text: string): void {
  const codes = staticDictEncode(text, DEFAULT_DICT);
  assert.equal(staticDictDecode(codes, DEFAULT_DICT), text);
}

test('static-dict 往返一致', () => {
  roundtrip('the http and html tion');
});

test('static-dict 字典命中产生短码', () => {
  const codes = staticDictEncode('the', DEFAULT_DICT);
  assert.equal(codes.length, 1);
  assert.equal(codes[0], 1);
});

test('static-dict 无命中全字面量', () => {
  const codes = staticDictEncode('xyz', DEFAULT_DICT);
  assert.equal(codes.length, 3);
  assert.deepEqual(staticDictDecode(codes, DEFAULT_DICT), 'xyz');
});

test('static-dict 空输入', () => {
  assert.deepEqual(staticDictEncode('', DEFAULT_DICT), []);
  assert.equal(staticDictDecode([], DEFAULT_DICT), '');
});

test('static-dict DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
