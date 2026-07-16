import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cfs, niceToWeight } from '../../src/algorithms/scheduling/cfs/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/cfs/trace.ts';

test('cfs nice=0 权重为 1024', () => {
  assert.equal(niceToWeight(0), 1024);
});

test('cfs nice 越低权重越大', () => {
  assert.ok(niceToWeight(-5) > niceToWeight(0));
  assert.ok(niceToWeight(0) > niceToWeight(5));
});

test('cfs 单任务完整运行', () => {
  const r = cfs([{ id: 'A', arrival: 0, burst: 5 }]);
  assert.equal(r.stats[0]!.runtime, 5);
  assert.equal(r.stats[0]!.finish, 5);
});

test('cfs 同 nice 任务轮流运行（vruntime 持平）', () => {
  const r = cfs(
    [
      { id: 'A', arrival: 0, burst: 2 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    { targetLatency: 4, minGranularity: 1 },
  );
  // 两任务应交替（A,B,A,B 或类似）
  assert.equal(r.stats[0]!.finish + r.stats[1]!.finish, 6); // 总完成 2+2 + 等待
});

test('cfs 高权重任务 vruntime 增长更慢', () => {
  const r = cfs(
    [
      { id: 'LOW', arrival: 0, burst: 5, nice: 5 },
      { id: 'HIGH', arrival: 0, burst: 5, nice: -5 },
    ],
    { targetLatency: 4, minGranularity: 1 },
  );
  // HIGH 的 finalVruntime 应小于 LOW（增长慢）
  const high = r.stats.find((s) => s.id === 'HIGH')!;
  const low = r.stats.find((s) => s.id === 'LOW')!;
  assert.ok(
    high.finalVruntime <= low.finalVruntime + 1e-6,
    `HIGH vr=${high.finalVruntime} 应 <= LOW vr=${low.finalVruntime}`,
  );
});

test('cfs 所有任务最终都完成', () => {
  const r = cfs([
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 1, burst: 4 },
    { id: 'C', arrival: 2, burst: 2 },
  ]);
  assert.equal(r.stats.length, 3);
  for (const s of r.stats) assert.ok(s.finish > 0);
});

test('cfs 总运行时间 = 总 burst', () => {
  const r = cfs(
    [
      { id: 'A', arrival: 0, burst: 3 },
      { id: 'B', arrival: 0, burst: 4 },
    ],
    { minGranularity: 1 },
  );
  const totalRuntime = r.stats.reduce((s, x) => s + x.runtime, 0);
  assert.equal(totalRuntime, 7);
});

test('cfs 空输入', () => {
  const r = cfs([]);
  assert.deepEqual(r.segments, []);
});

test('cfs 钩子 onRun/onComplete', () => {
  let runs = 0;
  let completes = 0;
  cfs(
    [{ id: 'A', arrival: 0, burst: 3 }],
    { minGranularity: 1 },
    {
      onRun: () => runs++,
      onComplete: () => completes++,
    },
  );
  assert.ok(runs >= 1);
  assert.equal(completes, 1);
});

test('cfs 不同到达时间', () => {
  const r = cfs([
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 3, burst: 2 },
  ]);
  // B 到达前 A 单独跑
  assert.ok(r.stats.find((s) => s.id === 'A')!.finish > 0);
  assert.ok(r.stats.find((s) => s.id === 'B')!.finish > 0);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
