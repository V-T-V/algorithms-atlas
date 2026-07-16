import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ppmStar } from '../../src/algorithms/compression/comp-ppm-d-star/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-ppm-d-star/trace.ts';

test('ppm*d 输出长度匹配', () => {
  const out = ppmStar([65, 66, 65, 66, 65, 66]);
  assert.equal(out.length, 6);
});
test('ppm*d 概率在 [0,1]', () => {
  for (const x of ppmStar([65, 66, 65])) assert.ok(x.prob >= 0 && x.prob <= 1);
});
test('ppm*d trace 非空', () => assert.ok(buildTrace().length > 0));
