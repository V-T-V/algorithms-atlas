import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strideScheduling } from '../../src/algorithms/scheduling/stride-scheduling/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/scheduling/stride-scheduling/trace.ts';

test('stride 等权重进程被选次数相等', () => {
  const r = strideScheduling(
    [
      { id: 'A', weight: 1 },
      { id: 'B', weight: 1 },
    ],
    10,
  );
  assert.equal(r.picks.get('A'), 5);
  assert.equal(r.picks.get('B'), 5);
});

test('stride 权重比例正确（w=1:2，10 步 → 约 3:7 或 4:6）', () => {
  const r = strideScheduling(
    [
      { id: 'A', weight: 1 },
      { id: 'B', weight: 2 },
    ],
    10,
  );
  // B 应被选更多
  assert.ok((r.picks.get('B') ?? 0) > (r.picks.get('A') ?? 0));
});

test('stride 权重 1:2:3 被选次数符合比例', () => {
  const r = strideScheduling(
    [
      { id: 'A', weight: 1 },
      { id: 'B', weight: 2 },
      { id: 'C', weight: 3 },
    ],
    60,
  );
  const a = r.picks.get('A')!;
  const b = r.picks.get('B')!;
  const c = r.picks.get('C')!;
  // 总和 60，比例 1:2:3 → 10:20:30
  assert.equal(a + b + c, 60);
  assert.equal(a, 10);
  assert.equal(b, 20);
  assert.equal(c, 30);
});

test('stride 步数正确', () => {
  const r = strideScheduling([{ id: 'A', weight: 1 }], 5);
  assert.equal(r.steps.length, 5);
  assert.equal(r.picks.get('A'), 5);
});

test('stride passes 累加正确', () => {
  const r = strideScheduling([{ id: 'A', weight: 1 }], 3);
  // K = 1, stride = 1/1 = 1，3 步后 passes = 3
  assert.equal(r.finalPasses.get('A'), 3);
});

test('stride 空任务返回空', () => {
  const r = strideScheduling([], 10);
  assert.equal(r.steps.length, 0);
});

test('stride 0 步返回空', () => {
  const r = strideScheduling([{ id: 'A', weight: 1 }], 0);
  assert.equal(r.steps.length, 0);
});

test('stride 钩子 onPick', () => {
  const ids: string[] = [];
  strideScheduling(
    [
      { id: 'A', weight: 1 },
      { id: 'B', weight: 1 },
    ],
    4,
    { onPick: (id) => ids.push(id) },
  );
  assert.equal(ids.length, 4);
  assert.deepEqual(ids, ['A', 'B', 'A', 'B']);
});

test('stride 平局时按 id 字典序', () => {
  const r = strideScheduling(
    [
      { id: 'Z', weight: 1 },
      { id: 'A', weight: 1 },
    ],
    1,
  );
  // 两进程 passes 都 0，平局 → A 字典序小
  assert.equal(r.steps[0]!.id, 'A');
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
