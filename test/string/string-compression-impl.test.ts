import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  compress,
  compressToString,
} from '../../src/algorithms/string/string-compression-impl/impl.ts';

test('compress 基本用例', () => {
  const chars = ['a', 'a', 'b', 'b', 'c', 'c', 'c'];
  const len = compress(chars);
  assert.equal(len, 6);
  assert.deepEqual(chars.slice(0, len), ['a', '2', 'b', '2', 'c', '3']);
});

test('compress 单字符不写计数', () => {
  const chars = ['a'];
  const len = compress(chars);
  assert.equal(len, 1);
  assert.deepEqual(chars.slice(0, len), ['a']);
});

test('compress 多位计数', () => {
  // 12 个 a
  const chars = Array.from({ length: 12 }, () => 'a');
  const len = compress(chars);
  assert.equal(len, 3); // 'a', '1', '2'
  assert.deepEqual(chars.slice(0, len), ['a', '1', '2']);
});

test('compress 混合', () => {
  const chars = ['a', 'b', 'b', 'c', 'c', 'c', 'd'];
  const len = compress(chars);
  assert.equal(len, 6);
  assert.deepEqual(chars.slice(0, len), ['a', 'b', '2', 'c', '3', 'd']);
});

test('compressToString 便利函数', () => {
  assert.equal(compressToString(['a', 'a', 'a', 'b', 'b']), 'a3b2');
  assert.equal(compressToString(['x']), 'x');
  assert.equal(compressToString([]), '');
});

test('compress 钩子被调用', () => {
  let runs = 0;
  let writes = 0;
  compress(['a', 'a', 'b'], {
    onRun: () => runs++,
    onWriteChar: () => writes++,
  });
  assert.equal(runs, 2, '应识别 2 段');
  assert.ok(writes >= 2, '应至少写 2 个字符');
});
