import { test } from 'node:test';
import assert from 'node:assert/strict';
import { atbash } from '../../src/algorithms/crypto/atbash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/atbash/trace.ts';

test('atbash 已知映射', () => {
  assert.equal(atbash('A').text, 'Z');
  assert.equal(atbash('Z').text, 'A');
  assert.equal(atbash('B').text, 'Y');
  assert.equal(atbash('a').text, 'z');
  assert.equal(atbash('M').text, 'N');
});

test('atbash 自对合（两次还原）', () => {
  for (const s of ['Hello, World!', 'ATBASH', 'abcXYZ']) {
    assert.equal(atbash(atbash(s).text).text, s, `不自对合: "${s}"`);
  }
});

test('atbash 非字母保留', () => {
  assert.equal(atbash('123!@#').text, '123!@#');
});

test('atbash 空串', () => {
  assert.equal(atbash('').text, '');
});

test('atbash 钩子被调用', () => {
  const maps: Array<[string, string]> = [];
  atbash('AB', { onMap: (_i, o, m) => maps.push([o, m]) });
  assert.equal(maps.length, 2);
  assert.deepEqual(maps, [
    ['A', 'Z'],
    ['B', 'Y'],
  ]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
