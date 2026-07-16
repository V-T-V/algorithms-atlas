import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bat } from '../../src/algorithms/optimization/opt-bat-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bat-2/trace.ts';
test('蝙蝠收敛', () => {
  const r = bat((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 15, 50);
  assert.ok(r.bestFit < 5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
