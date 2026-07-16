import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzoCompress, lzoDecompress, toBytes } from '../../src/algorithms/compression/lzo/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/lzo/trace.ts';

test('lzo 编解码往返一致', () => {
  for (const s of ['ABCABCABCABCDXYZ', 'AAAAAAAAAA', 'hello hello', 'XYZ', 'a', '']) {
    const { tokens } = lzoCompress(s);
    assert.equal(lzoDecompress(tokens), s, `往返不一致: "${s}"`);
  }
});

test('lzo 空输入', () => {
  const { tokens } = lzoCompress('');
  assert.deepEqual(tokens, []);
});

test('lzo 无重复全为 literal', () => {
  const { tokens } = lzoCompress('XYZ');
  assert.equal(tokens.length, 1);
  assert.equal(tokens[0]!.kind, 'lit');
});

test('lzo 重复串产生 match', () => {
  const { tokens } = lzoCompress('ABCABCABC');
  assert.ok(
    tokens.some((t) => t.kind === 'match'),
    '应出现 match token',
  );
  assert.equal(lzoDecompress(tokens), 'ABCABCABC');
});

test('lzo 最小匹配长度生效', () => {
  // minMatch=4 时，长度 3 的重复不会被匹配
  const { tokens } = lzoCompress('ABCABC', 32, 4);
  assert.ok(tokens.every((t) => t.kind === 'lit'));
});

test('lzo match 可自引用', () => {
  // AAAAAA：distance=1 的长匹配
  const { tokens } = lzoCompress('AAAAAA', 8, 3, 18);
  assert.equal(lzoDecompress(tokens), 'AAAAAA');
  const matches = tokens.filter((t) => t.kind === 'match');
  assert.ok(matches.length >= 1);
});

test('lzo toBytes 截断到字节', () => {
  assert.deepEqual(toBytes('AB'), [65, 66]);
});

test('lzo 钩子被调用', () => {
  const lits: number[] = [];
  const matches: number[] = [];
  lzoCompress('ABCABC', 16, 3, 18, {
    onLiteral: (_p, byte) => lits.push(byte),
    onMatch: (_p, _d, len) => matches.push(len),
  });
  assert.ok(lits.length >= 1);
  assert.ok(matches.length >= 1);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
