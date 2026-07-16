import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lz77,
  lz77Decode,
  toCodePoints,
  type Lz77Token,
} from '../../src/algorithms/compression/lz77/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/lz77/trace.ts';

test('lz77 编解码往返一致', () => {
  for (const s of ['ABABABABABC', 'AAAAAAAAAAB', 'abcabcabc', 'hello hello hello', 'XYZ', 'a']) {
    const { tokens } = lz77(s);
    assert.equal(lz77Decode(tokens), s, `往返不一致: ${s}`);
  }
});

test('lz77 无重复输入全是单字符三元组', () => {
  // XYZ: 每个位置无匹配 → (0,0,X)(0,0,Y)(0,0,Z)，但末尾 next=-1
  const { tokens } = lz77('XYZ');
  assert.deepEqual(tokens, [
    { distance: 0, length: 0, next: 'X'.codePointAt(0) },
    { distance: 0, length: 0, next: 'Y'.codePointAt(0) },
    { distance: 0, length: 0, next: 'Z'.codePointAt(0) },
  ]);
});

test('lz77 重复串产生回退匹配', () => {
  // ABABABABABC：第二位起应匹配前方的 AB...
  const { tokens } = lz77('ABABABABABC', 32, 16);
  // 第一个 token 一定是 (0,0,'A')
  assert.equal(tokens[0]!.distance, 0);
  assert.equal(tokens[0]!.length, 0);
  // 至少存在一个 length>=2 的匹配
  assert.ok(
    tokens.some((t) => t.length >= 2),
    '应出现长度>=2的匹配',
  );
  assert.equal(lz77Decode(tokens), 'ABABABABABC');
});

test('lz77 自引用匹配（长串重复）', () => {
  // AAAAAAAAAA：从第二位起 distance=1 匹配，可跨越 pos 自引用复制
  const { tokens } = lz77('AAAAAAAAAA', 8, 8);
  assert.equal(lz77Decode(tokens), 'AAAAAAAAAA');
  // 第一个 token 无匹配，后续应有 distance=1 的长匹配
  assert.ok(
    tokens.some((t) => t.distance === 1 && t.length >= 2),
    '应有 distance=1 自引用匹配',
  );
});

test('lz77 空输入', () => {
  const { tokens } = lz77('');
  assert.deepEqual(tokens, []);
});

test('lz77 单字符', () => {
  const { tokens } = lz77('A');
  assert.deepEqual(tokens, [{ distance: 0, length: 0, next: 'A'.codePointAt(0) }]);
  assert.equal(lz77Decode(tokens), 'A');
});

test('lz77 末尾 token 的 next 为 -1（EOF 哨兵）', () => {
  const { tokens } = lz77('ABAB');
  assert.equal(tokens[tokens.length - 1]!.next, -1);
});

test('lz77Decode 纯三元组解码', () => {
  // 手工构造：(0,0,'A') (0,0,'B') (2,2,'A') → "AB" + 从 dist=2 复制 len=2("AB") + 'A' = "ABABA"
  const tokens: Lz77Token[] = [
    { distance: 0, length: 0, next: 'A'.codePointAt(0)! },
    { distance: 0, length: 0, next: 'B'.codePointAt(0)! },
    { distance: 2, length: 2, next: 'A'.codePointAt(0)! },
  ];
  assert.equal(lz77Decode(tokens), 'ABABA');
});

test('lz77 钩子被调用', () => {
  const advances: number[] = [];
  const matches: number[] = [];
  const emits: number[] = [];
  lz77('ABABAB', 8, 8, {
    onAdvance: (p) => advances.push(p),
    onMatch: (_p, _d, len) => matches.push(len),
    onEmit: () => emits.push(1),
  });
  assert.ok(advances.length >= 1, '应触发 onAdvance');
  assert.ok(matches.length >= 1, '应出现匹配');
  assert.equal(emits.length, advances.length, '每次 advance 应 emit 一个 token');
});

test('lz77 toCodePoints 保留多字节', () => {
  assert.deepEqual(toCodePoints('AB'), ['A'.codePointAt(0), 'B'.codePointAt(0)]);
});

test('buildTrace 生成有序帧且末帧含 token', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const first = frames[0]!;
  assert.ok(first.array, '首帧含 array');
  assert.ok(first.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
  const tok = last.map!.find((e) => e.key.includes('tokens') || e.key.includes('三元组'));
  assert.ok(tok, '末帧应含三元组序列');
});
