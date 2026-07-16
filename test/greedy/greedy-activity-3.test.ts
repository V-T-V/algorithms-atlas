import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyActivity3 } from '../../src/algorithms/greedy/greedy-activity-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-activity-3/trace.ts';

test('活动选择 CLRS 经典示例（子集）', () => {
  const acts = [
    { name: 'A', start: 1, finish: 4 },
    { name: 'B', start: 3, finish: 5 },
    { name: 'C', start: 0, finish: 6 },
    { name: 'D', start: 5, finish: 7 },
    { name: 'E', start: 8, finish: 9 },
    { name: 'F', start: 5, finish: 9 },
  ];
  const r = greedyActivity3(acts);
  // 按 finish 排序后贪心选：A(1-4) → D(5-7) → E(8-9)，共 3 个
  assert.equal(r.count, 3);
  assert.deepEqual(
    r.chosen.map((c) => c.name),
    ['A', 'D', 'E'],
  );
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
