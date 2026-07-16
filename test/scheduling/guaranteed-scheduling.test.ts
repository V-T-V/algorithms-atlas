import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guaranteedScheduling } from '../../src/algorithms/scheduling/guaranteed-scheduling/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/guaranteed-scheduling/trace.ts';

test('guaranteedScheduling 所有进程完成', () => {
  const r = guaranteedScheduling([
    { id: 'P1', burst: 3 },
    { id: 'P2', burst: 3 },
    { id: 'P3', burst: 3 },
  ]);
  assert.equal(r.stats.length, 3);
  for (const s of r.stats) assert.equal(s.allocated, s.burst);
});

test('guaranteedScheduling 等长短任务公平', () => {
  const r = guaranteedScheduling([
    { id: 'A', burst: 2 },
    { id: 'B', burst: 2 },
  ]);
  // 两进程等 burst，应交错
  assert.deepEqual(
    r.segments.map((s) => s.id),
    ['A', 'B', 'A', 'B'],
  );
});

test('guaranteedScheduling 总时间 = Σ burst', () => {
  const procs = [
    { id: 'X', burst: 4 },
    { id: 'Y', burst: 6 },
  ];
  const r = guaranteedScheduling(procs);
  const total = r.segments.reduce((acc, s) => acc + (s.finish - s.start), 0);
  assert.equal(total, 10);
});

test('guaranteedScheduling 钩子被调用', () => {
  let picks = 0;
  guaranteedScheduling(
    [
      { id: 'A', burst: 2 },
      { id: 'B', burst: 2 },
    ],
    { onPick: () => picks++ },
  );
  assert.equal(picks, 4);
});

test('guaranteedScheduling 空输入', () => {
  const r = guaranteedScheduling([]);
  assert.deepEqual(r.stats, []);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
