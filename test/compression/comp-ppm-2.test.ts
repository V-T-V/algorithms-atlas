import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ppmPredict } from '../../src/algorithms/compression/comp-ppm-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ppm-2/trace.ts';

test('ppm 输出长度 = 输入长度', () => {
  const out = ppmPredict([65, 66, 65, 66, 65]);
  assert.equal(out.length, 5);
});
test('ppm 重复模式提高预测概率', () => {
  const out = ppmPredict([65, 66, 65, 66, 65]);
  // 第 5 个 A 在 BA 之后已被预测
  assert.ok(out.some((x) => x.sym === 65 && !x.escaped));
});
test('ppm trace 非空', () => assert.ok(buildTrace().length > 0));
