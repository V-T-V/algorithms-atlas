import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  packbitsEncode,
  packbitsDecode,
  toBytes,
} from '../../src/algorithms/compression/rle-packbits/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/rle-packbits/trace.ts';

test('packbits 编解码往返一致', () => {
  for (const s of ['AAAABBBCCXYZDDD', 'AAAAAAAAAA', 'ABCDEF', 'a', '']) {
    const { segments } = packbitsEncode(s);
    assert.equal(packbitsDecode(segments), s, `往返不一致: "${s}"`);
  }
});

test('packbits 空输入', () => {
  const { segments } = packbitsEncode('');
  assert.deepEqual(segments, []);
});

test('packbits 长重复段被合并', () => {
  const { segments } = packbitsEncode('AAAA');
  assert.equal(segments.length, 1);
  assert.equal(segments[0]!.kind, 'run');
  assert.equal(segments[0]!.count, 4);
});

test('packbits 无重复全为 lit', () => {
  const { segments } = packbitsEncode('ABCDEF');
  assert.equal(segments.length, 1);
  assert.equal(segments[0]!.kind, 'lit');
  assert.equal(segments[0]!.count, 6);
});

test('packbits run 段 count 上限 128', () => {
  const { segments } = packbitsEncode('A'.repeat(200));
  // 应被拆成 128 + 72 两段
  const runs = segments.filter((s) => s.kind === 'run');
  assert.equal(runs.length, 2);
  assert.equal(runs[0]!.count, 128);
});

test('packbits toBytes 截断', () => {
  assert.deepEqual(toBytes('AB'), [65, 66]);
});

test('packbits lit 段上限 128', () => {
  // 交替字符防止形成 run
  const s = 'AB'.repeat(80);
  const { segments } = packbitsEncode(s);
  const lits = segments.filter((x) => x.kind === 'lit');
  assert.ok(lits.every((x) => x.count <= 128));
});

test('packbits 钩子被调用', () => {
  const runs: number[] = [];
  const lits: number[] = [];
  packbitsEncode('AAABBC', {
    onRun: (_p, _b, c) => runs.push(c),
    onLit: (_s, bytes) => lits.push(bytes.length),
  });
  assert.ok(runs.length >= 1);
  assert.ok(lits.length >= 1);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
});
