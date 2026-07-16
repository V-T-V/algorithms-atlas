import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eliasGammaBitLength,
  eliasGammaDecode,
  eliasGammaDecodeMany,
  eliasGammaEncode,
  eliasGammaEncodeMany,
} from '../../src/algorithms/compression/elias-gamma/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/elias-gamma/trace.ts';

test('elias-gamma 已知编码', () => {
  assert.equal(eliasGammaEncode(1), '1');
  assert.equal(eliasGammaEncode(2), '010');
  assert.equal(eliasGammaEncode(3), '011');
  assert.equal(eliasGammaEncode(4), '00100');
  assert.equal(eliasGammaEncode(5), '00101');
  assert.equal(eliasGammaEncode(8), '0001000');
});

test('elias-gamma 编解码往返一致', () => {
  for (const v of [1, 2, 3, 5, 8, 13, 100, 1024]) {
    assert.equal(eliasGammaDecode(eliasGammaEncode(v)).value, v, `往返不一致: ${v}`);
  }
});

test('elias-gamma 批量拼接编解码', () => {
  const bits = eliasGammaEncodeMany([1, 2, 3, 5, 8]);
  assert.deepEqual(eliasGammaDecodeMany(bits), [1, 2, 3, 5, 8]);
});

test('elias-gamma 非正整数报错', () => {
  assert.throws(() => eliasGammaEncode(0));
  assert.throws(() => eliasGammaEncode(-1));
  assert.throws(() => eliasGammaEncode(1.5));
});

test('elias-gamma 位串不完整报错', () => {
  assert.throws(() => eliasGammaDecode('0'));
  assert.throws(() => eliasGammaDecode('0010'));
});

test('elias-gamma bitLength 正确', () => {
  assert.equal(eliasGammaBitLength(1), 1);
  assert.equal(eliasGammaBitLength(2), 3);
  assert.equal(eliasGammaBitLength(4), 5);
  assert.equal(eliasGammaBitLength(8), 7);
  assert.equal(eliasGammaBitLength(5), eliasGammaEncode(5).length);
});

test('elias-gamma 钩子被调用', () => {
  const outs: string[] = [];
  eliasGammaEncode(5, { onEncode: (_n, bits) => outs.push(bits) });
  assert.deepEqual(outs, ['00101']);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
