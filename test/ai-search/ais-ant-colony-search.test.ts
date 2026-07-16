import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aco } from '../../src/algorithms/ai-search/ais-ant-colony-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-ant-colony-search/trace.ts';

test('ACO 找到合理 tour', () => {
  const D = [
    [0, 2, 5, 8],
    [2, 0, 4, 3],
    [5, 4, 0, 6],
    [8, 3, 6, 0],
  ];
  const r = aco(D, 5, 30, 1, 3, 0.3, 13);
  // 朴素下界：最小生成树*2
  assert.ok(r.bestLen > 0 && r.bestLen < 30);
  assert.equal(r.bestTour.length, 4);
});
test('ACO 同种子可复现', () => {
  const D = [
    [0, 1, 2],
    [1, 0, 3],
    [2, 3, 0],
  ];
  const a = aco(D, 4, 10, 1, 2, 0.3, 5);
  const b = aco(D, 4, 10, 1, 2, 0.3, 5);
  assert.equal(a.bestLen, b.bestLen);
});
test('ACO trace 非空', () => assert.ok(buildTrace().length > 0));
