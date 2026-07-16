import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedySplit2 } from '../../src/algorithms/greedy/greedy-split-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-split-2/trace.ts';

test('split "32" → 严格递减 3,2 (ok=true)', () => {
  // "32" 可拆为 3,2，正好两段且严格递减
  const r = greedySplit2('32');
  assert.equal(r.ok, true);
  assert.deepEqual(r.pieces.map(String), ['3', '2']);
});

test('split "4321" → 4,3,2,1', () => {
  const r = greedySplit2('4321');
  assert.equal(r.ok, true);
  assert.deepEqual(r.pieces.map(String), ['4', '3', '2', '1']);
});

test('split "1234" 不可拆为严格递减', () => {
  // 升序字符串无法拆成 ≥2 段严格递减
  const r = greedySplit2('1234');
  assert.equal(r.ok, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
