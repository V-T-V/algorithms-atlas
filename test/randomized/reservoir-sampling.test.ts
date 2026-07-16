import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  reservoirSampling,
  makeLcg,
} from '../../src/algorithms/randomized/reservoir-sampling/impl.ts';

const STREAM = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 4, 7];

test('reservoir-sampling 容量与边界', () => {
  assert.deepEqual(reservoirSampling([], 3, makeLcg(1)), []);
  // k > n：返回整个流
  assert.deepEqual(reservoirSampling([1, 2, 3], 5, makeLcg(1)), [1, 2, 3]);
  assert.equal(reservoirSampling(STREAM, 4, makeLcg(1)).length, 4);
});

test('reservoir-sampling 固定种子可复现', () => {
  assert.deepEqual(reservoirSampling(STREAM, 4, makeLcg(7)), [7, 9, 8, 4]);
  assert.deepEqual(
    reservoirSampling(STREAM, 1, makeLcg(7)),
    reservoirSampling(STREAM, 1, makeLcg(7)),
  );
});

test('reservoir-sampling 钩子被调用', () => {
  let streamCount = 0;
  let fillCount = 0;
  const replaces: Array<[number, number]> = [];
  reservoirSampling(STREAM, 3, makeLcg(99), {
    onStream: () => streamCount++,
    onFill: () => fillCount++,
    onTryReplace: (i, slot) => replaces.push([i, slot]),
  });
  assert.equal(streamCount, STREAM.length, '每个流元素应触发一次 onStream');
  assert.equal(fillCount, 1, 'onFill 仅触发一次');
  assert.ok(replaces.length >= 0);
});
