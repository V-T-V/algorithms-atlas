import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fairShare } from '../../src/algorithms/scheduling/fair-share/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/fair-share/trace.ts';

test('fairShare 两用户等份额：各得一半 CPU', () => {
  const r = fairShare(
    [
      { id: 'A1', user: 'A', burst: 4 },
      { id: 'A2', user: 'A', burst: 4 },
      { id: 'B1', user: 'B', burst: 8 },
    ],
    [
      { user: 'A', share: 1 },
      { user: 'B', share: 1 },
    ],
  );
  // 总 16 时间单位；A 占 8，B 占 8
  assert.equal(r.userCpu['A'], 8);
  assert.equal(r.userCpu['B'], 8);
});

test('fairShare 所有进程都完成', () => {
  const r = fairShare(
    [
      { id: 'A1', user: 'A', burst: 3 },
      { id: 'B1', user: 'B', burst: 3 },
    ],
    [
      { user: 'A', share: 1 },
      { user: 'B', share: 1 },
    ],
  );
  assert.equal(r.stats.length, 2);
  for (const s of r.stats) {
    assert.equal(s.allocated, s.burst);
    assert.equal(s.completion > 0, true);
  }
});

test('fairShare 单用户退化为轮转', () => {
  const r = fairShare(
    [
      { id: 'P1', user: 'U', burst: 2 },
      { id: 'P2', user: 'U', burst: 2 },
    ],
    [{ user: 'U', share: 1 }],
  );
  assert.equal(r.userCpu['U'], 4);
});

test('fairShare 钩子被调用', () => {
  let picks = 0;
  let completes = 0;
  fairShare(
    [
      { id: 'A1', user: 'A', burst: 2 },
      { id: 'B1', user: 'B', burst: 2 },
    ],
    [
      { user: 'A', share: 1 },
      { user: 'B', share: 1 },
    ],
    {
      onPick: () => picks++,
      onComplete: () => completes++,
    },
  );
  assert.equal(picks, 4);
  assert.equal(completes, 2);
});

test('fairShare 空输入', () => {
  const r = fairShare([], []);
  assert.deepEqual(r.stats, []);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux);
});
