import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boruvkaMst, type Edge } from '../../src/algorithms/greedy/greedy-mst-boruvka/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-mst-boruvka/trace.ts';
test('Borůvka MST 权重正确', () => {
  const E: Edge[] = [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 2 },
    { u: 0, v: 2, w: 5 },
  ];
  const r = boruvkaMst(3, E);
  assert.equal(r.weight, 3);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
