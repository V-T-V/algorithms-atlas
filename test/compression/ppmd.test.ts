import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ppmd } from '../../src/algorithms/compression/ppmd/impl.ts';

test('ppmd：未见符号概率为 1/alphabetSize', () => {
  const r = ppmd([65, 66], 2, 1, 256);
  assert.equal(r.predictions.length, 2);
  assert.equal(r.predictions[0]!.ctx, '');
  assert.equal(r.predictions[0]!.probability, 1 / 256);
});

test('ppmd：logLoss 为负对数概率之和', () => {
  const r = ppmd([65, 66], 2, 1, 256);
  // 两个未见符号，各 -log2(1/256) = 8
  assert.ok(Math.abs(r.logLoss - 16) < 1e-9);
});
