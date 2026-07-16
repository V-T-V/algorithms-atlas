import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz78, lz78Decode, toCodePoints } from '../../src/algorithms/compression/lz78/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/lz78/trace.ts';

test('lz78 编解码往返一致', () => {
  for (const s of ['ABABABA', 'AAAAAAAAAA', 'abcabcabc', 'hello world', 'XYZ', 'a', '']) {
    const { tokens } = lz78(s);
    assert.equal(lz78Decode(tokens), s, `往返不一致: "${s}"`);
  }
});

test('lz78 空输入', () => {
  const { tokens, dictionary } = lz78('');
  assert.deepEqual(tokens, []);
  assert.equal(dictionary.length, 1); // 仅空串
});

test('lz78 单字符输出 (0, char)', () => {
  const { tokens } = lz78('A');
  assert.deepEqual(tokens, [{ index: 0, char: 'A'.codePointAt(0) }]);
});

test('lz78 无重复输入每个字符独立编码', () => {
  const { tokens } = lz78('XYZ');
  assert.deepEqual(tokens, [
    { index: 0, char: 'X'.codePointAt(0) },
    { index: 0, char: 'Y'.codePointAt(0) },
    { index: 0, char: 'Z'.codePointAt(0) },
  ]);
});

test('lz78 重复串会引用字典', () => {
  // ABABABA: 期望出现 index>0 的引用
  const { tokens, dictionary } = lz78('ABABABA');
  assert.equal(lz78Decode(tokens), 'ABABABA');
  assert.ok(
    tokens.some((t) => t.index > 0),
    '应出现非零字典引用',
  );
  // 字典从空串开始，长度 >= 2
  assert.ok(dictionary.length >= 2);
  assert.equal(dictionary[0], '');
});

test('lz78 末尾 token 的 char 为 -1', () => {
  // 构造一个以匹配结尾的输入：AAAA 末位应 char=-1
  const { tokens } = lz78('AAAA');
  assert.equal(tokens[tokens.length - 1]!.char, -1);
});

test('lz78 字典条目唯一且自洽', () => {
  const { dictionary } = lz78('ABCABCABC');
  // 字典无重复（除空串外）
  const set = new Set(dictionary);
  assert.equal(set.size, dictionary.length);
  assert.equal(dictionary[0], '');
});

test('lz78 toCodePoints 保留 Unicode', () => {
  assert.deepEqual(toCodePoints('AB'), [65, 66]);
});

test('lz78 钩子被调用', () => {
  const advances: number[] = [];
  const matches: number[] = [];
  const emits: number[] = [];
  lz78('ABAB', {
    onAdvance: (p) => advances.push(p),
    onMatch: (_p, index) => matches.push(index),
    onEmit: () => emits.push(1),
  });
  assert.ok(advances.length >= 1, '应触发 onAdvance');
  assert.ok(emits.length >= 1);
  assert.equal(emits.length, advances.length);
  assert.equal(matches.length, emits.length);
});

test('buildTrace 生成有序帧且末帧含 map', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
