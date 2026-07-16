import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intervalCover } from '../../src/algorithms/greedy/interval-cover/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/interval-cover/trace.ts';

test('intervalCover 完全覆盖', () => {
  const { chosen } = intervalCover(
    [
      { start: 0, end: 3 },
      { start: 1, end: 6 },
      { start: 4, end: 9 },
      { start: 8, end: 10 },
    ],
    { L: 0, R: 10 },
  );
  assert.ok(chosen.length >= 2);
  assert.ok(chosen.length <= 4);
});

test('intervalCover 无法覆盖返回空', () => {
  const { chosen } = intervalCover([{ start: 0, end: 5 }], { L: 0, R: 10 });
  assert.deepEqual(chosen, []);
});

test('intervalCover 单区间覆盖', () => {
  const { chosen } = intervalCover([{ start: 0, end: 10 }], { L: 0, R: 10 });
  assert.equal(chosen.length, 1);
});

test('buildTrace 含区间数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
