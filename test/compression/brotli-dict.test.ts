import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  brotliDictCompress,
  brotliDictDecompress,
  DICTIONARY,
  toBytes,
} from '../../src/algorithms/compression/brotli-dict/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/brotli-dict/trace.ts';

test('brotli-dict 编解码往返一致', () => {
  for (const s of ['http://www.example.com/html/body', 'the and tion ing', 'XYZ', 'a', '']) {
    const { tokens } = brotliDictCompress(s);
    assert.equal(brotliDictDecompress(tokens), s, `往返不一致: "${s}"`);
  }
});

test('brotli-dict 命中字典词', () => {
  const { tokens } = brotliDictCompress('http');
  assert.equal(tokens.length, 1);
  assert.equal(tokens[0]!.kind, 'dict');
  if (tokens[0]!.kind === 'dict') {
    assert.equal(tokens[0]!.index, 0);
    assert.equal(tokens[0]!.length, 4);
  }
});

test('brotli-dict 无匹配全为 literal', () => {
  const { tokens } = brotliDictCompress('XYZ');
  assert.equal(tokens.length, 1);
  assert.equal(tokens[0]!.kind, 'lit');
});

test('brotli-dict 空输入', () => {
  const { tokens } = brotliDictCompress('');
  assert.deepEqual(tokens, []);
});

test('brotli-dict toBytes 截断', () => {
  assert.deepEqual(toBytes('AB'), [65, 66]);
});

test('brotli-dict 自定义字典生效', () => {
  const { tokens } = brotliDictCompress('foobar', ['foo'], 3);
  assert.ok(tokens.some((t) => t.kind === 'dict'));
  assert.equal(brotliDictDecompress(tokens, ['foo']), 'foobar');
});

test('brotli-dict 钩子被调用', () => {
  const refs: string[] = [];
  brotliDictCompress('httpXYZ', DICTIONARY, 3, {
    onDictRef: (_p, _i, word) => refs.push(word),
  });
  assert.ok(refs.includes('http'));
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.map, '首帧含 map（字典）');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
