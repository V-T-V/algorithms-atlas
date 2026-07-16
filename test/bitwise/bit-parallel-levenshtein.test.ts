import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bitParallelLevenshtein,
  levenshteinDP,
} from '../../src/algorithms/bitwise/bit-parallel-levenshtein/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/bitwise/bit-parallel-levenshtein/trace.ts';

test('myers 与 DP 一致（大量随机对照）', () => {
  const ps = ['abc', 'hello', 'sat', 'saturday', 'kitten', 'aaaa', 'xyz', 'test', 'bbbb'];
  const ts = ['abc', 'world', 'sun', 'sunday', 'sitting', 'aaab', 'x', '', 'bbbbbbbb', 'tent'];
  let checked = 0;
  for (const P of ps) {
    for (const T of ts) {
      assert.equal(bitParallelLevenshtein(P, T), levenshteinDP(P, T), `不一致: P="${P}" T="${T}"`);
      checked++;
    }
  }
  assert.ok(checked > 50);
});

test('myers 已知距离', () => {
  assert.equal(bitParallelLevenshtein('kitten', 'sitting'), 3);
  assert.equal(bitParallelLevenshtein('saturday', 'sunday'), 3);
  assert.equal(bitParallelLevenshtein('abc', 'abc'), 0);
  assert.equal(bitParallelLevenshtein('', 'abc'), 3);
  assert.equal(bitParallelLevenshtein('abc', ''), 3);
});

test('myers 模式串过长报错', () => {
  assert.throws(() => bitParallelLevenshtein('a'.repeat(33), 'b'));
});

test('myers 钩子被调用', () => {
  const chars: string[] = [];
  bitParallelLevenshtein('abc', 'world', { onChar: (_j, ch) => chars.push(ch) });
  assert.deepEqual(chars, ['w', 'o', 'r', 'l', 'd']);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
